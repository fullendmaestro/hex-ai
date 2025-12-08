"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AgentListItemDto,
  type AgentsListResponseDto,
  Api,
  type EventItemDto,
  type EventsResponseDto,
  type SessionResponseDto,
} from "@/lib/Api";
import { useApiUrl } from "./use-api-url";
import { UIMessage, UIMessagePart, TextUIPart, ToolUIPart } from "@/types";
// Add these imports for wallet integration
import { useAccount, useChainId, useChains } from "wagmi";

// Type definitions for event content structure
interface EventContentPart {
  text?: string;
  functionCall?: {
    name: string;
    args?: any;
    input?: any;
    id: string;
  };
  functionResponse?: {
    name: string;
    response?: any;
    output?: any;
    id: string;
  };
}

interface EventContent {
  parts?: EventContentPart[];
  role?: string;
}

interface FunctionCallWrapper {
  functionCall: {
    name: string;
    args?: any;
    input?: any;
    id: string;
  };
  thoughtSignature?: string;
}

interface FunctionResponseWrapper {
  functionResponse: {
    name: string;
    response?: any;
    output?: any;
    args?: any;
    input?: any;
    id: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8042";

export function useChat() {
  const queryClient = useQueryClient();
  const apiUrl = useApiUrl();
  const apiClient = useMemo(() => new Api({ baseUrl: apiUrl }), [apiUrl]);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const isCreatingSessionDuringMessageSend = useRef(false);

  // Add wallet hooks
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const chain = chains.find((c) => c.id === chainId);

  // Fetch available agents
  const { data: agents = [] } = useQuery({
    queryKey: ["agents", apiUrl],
    queryFn: async (): Promise<AgentListItemDto[]> => {
      if (!apiClient) throw new Error("API URL is required");
      const res = await apiClient.api.agentsControllerListAgents();
      const data: AgentsListResponseDto = res.data;
      return data.agents;
    },
    enabled: !!apiUrl,
    staleTime: 30000,
    retry: 2,
  });

  // Root agent is always the first agent
  const rootAgent = agents[0] || null;

  // Transform server events to UI messages
  const transformEventsToUIMessages = useCallback(
    (events: EventItemDto[]): UIMessage[] => {
      if (!events.length) return [];

      // Sort events by timestamp
      const sortedEvents = [...events].sort(
        (a, b) => a.timestamp - b.timestamp
      );

      // Group events into interactions (user message + AI response)
      const interactions: EventItemDto[][] = [];
      let currentInteraction: EventItemDto[] = [];

      for (const event of sortedEvents) {
        if (event.author === "user") {
          if (currentInteraction.length > 0) {
            interactions.push(currentInteraction);
          }
          currentInteraction = [event];
        } else {
          // Group AI events within 2 seconds
          if (
            currentInteraction.length === 0 ||
            currentInteraction[0].author === "user"
          ) {
            currentInteraction.push(event);
          } else {
            const lastEvent = currentInteraction[currentInteraction.length - 1];
            const timeDiff = event.timestamp - lastEvent.timestamp;
            if (timeDiff < 2) {
              currentInteraction.push(event);
            } else {
              interactions.push(currentInteraction);
              currentInteraction = [event];
            }
          }
        }
      }

      if (currentInteraction.length > 0) {
        interactions.push(currentInteraction);
      }

      const uiMessages: UIMessage[] = [];

      interactions.forEach((interaction) => {
        // Process user message
        const userEvent = interaction.find((e) => e.author === "user");
        if (userEvent) {
          let text = "";
          const content = userEvent.content as EventContent;
          if (content?.parts) {
            text = content.parts
              .filter((part) => part.text)
              .map((part) => part.text!)
              .join("");
          }

          uiMessages.push({
            id: userEvent.id,
            role: "user",
            parts: [{ type: "text", text }],
            metadata: {
              timestamp: userEvent.timestamp,
              isFinalResponse: userEvent.isFinalResponse,
            },
          });
        }

        // Process AI events
        const aiEvents = interaction.filter((e) => e.author !== "user");
        if (aiEvents.length > 0) {
          const parts: UIMessagePart[] = [];

          // Track pending function calls by ID
          const pendingCalls = new Map<
            string,
            { toolName: string; input: any }
          >();

          aiEvents.forEach((event) => {
            // Extract text parts
            const content = event.content as EventContent;
            if (content?.parts) {
              content.parts.forEach((part) => {
                if (part.text) {
                  parts.push({
                    type: "text",
                    text: part.text,
                  } as TextUIPart);
                }
              });
            }

            // Store function calls - extract from nested functionCall object
            if (event.functionCalls && event.functionCalls.length > 0) {
              (event.functionCalls as FunctionCallWrapper[]).forEach((call) => {
                if (call.functionCall && call.functionCall.id) {
                  pendingCalls.set(call.functionCall.id, {
                    toolName: call.functionCall.name,
                    input:
                      call.functionCall.args || call.functionCall.input || {},
                  });
                }
              });
            }

            // Process function responses - extract from nested functionResponse object
            if (event.functionResponses && event.functionResponses.length > 0) {
              (event.functionResponses as FunctionResponseWrapper[]).forEach(
                (response) => {
                  if (response.functionResponse) {
                    const funcResponse = response.functionResponse;
                    const matchingCall = pendingCalls.get(funcResponse.id);

                    parts.push({
                      type: "tool",
                      state: "executed",
                      toolName: funcResponse.name,
                      input:
                        matchingCall?.input ||
                        funcResponse.args ||
                        funcResponse.input ||
                        {},
                      output: funcResponse.response || funcResponse.output,
                      providerExecuted: true,
                    } as ToolUIPart);

                    // Remove matched call
                    if (funcResponse.id) {
                      pendingCalls.delete(funcResponse.id);
                    }
                  }
                }
              );
            }
          });

          // Add any unmatched calls as call-state
          pendingCalls.forEach((call, id) => {
            parts.push({
              type: "tool",
              state: "call",
              toolName: call.toolName,
              input: call.input,
              providerExecuted: false,
            } as ToolUIPart);
          });

          if (parts.length > 0) {
            const lastEvent = aiEvents[aiEvents.length - 1];
            uiMessages.push({
              id: lastEvent.id,
              role: "assistant",
              parts,
              metadata: {
                timestamp: lastEvent.timestamp,
                isFinalResponse: lastEvent.isFinalResponse,
              },
            });
          }
        }
      });

      return uiMessages;
    },
    []
  );

  // Fetch events for session
  const { data: sessionEvents } = useQuery({
    queryKey: [
      "agent-events",
      apiUrl,
      rootAgent?.relativePath,
      currentSessionId,
    ],
    queryFn: async (): Promise<EventsResponseDto> => {
      if (!apiClient || !rootAgent || !currentSessionId) {
        return { events: [], totalCount: 0 };
      }
      const res = await apiClient.api.eventsControllerGetEvents(
        encodeURIComponent(rootAgent.relativePath),
        currentSessionId
      );
      return res.data as EventsResponseDto;
    },
    enabled: !!apiClient && !!rootAgent && !!currentSessionId,
    staleTime: 10000,
  });

  // Update messages when events change
  useEffect(() => {
    if (sessionEvents?.events) {
      const transformedMessages = transformEventsToUIMessages(
        sessionEvents.events
      );

      // Preserve optimistic user messages that haven't been confirmed by server yet
      setMessages((prevMessages) => {
        const optimisticMessages = prevMessages.filter(
          (msg) =>
            msg.id.startsWith("user_") &&
            !transformedMessages.some(
              (serverMsg) =>
                serverMsg.role === "user" &&
                serverMsg.parts[0]?.type === "text" &&
                msg.parts[0]?.type === "text" &&
                serverMsg.parts[0].text === msg.parts[0].text
            )
        );

        return [...transformedMessages, ...optimisticMessages];
      });
    } else if (!currentSessionId) {
      setMessages([]);
    }
  }, [sessionEvents, transformEventsToUIMessages, currentSessionId]);

  useEffect(() => {
    console.log("Messages updated: ", messages);
    console.log("Session Events updated: ", sessionEvents);
    console.log("Current Session ID updated: ", currentSessionId);
    console.log("Root Agent: ", rootAgent);
  }, [messages, sessionEvents, currentSessionId, rootAgent]);

  // Create session mutation
  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (): Promise<SessionResponseDto> => {
      if (!apiClient || !rootAgent) throw new Error("Root agent required");

      const response = await apiClient.api.sessionsControllerCreateSession(
        encodeURIComponent(rootAgent.relativePath),
        {}
      );

      return response.data;
    },
    onSuccess: async (session) => {
      // Set the new session as current
      setCurrentSessionId(session.id);

      // Only clear messages if this is an intentional new chat (not during message send)
      if (!isCreatingSessionDuringMessageSend.current) {
        setMessages([]);
      }

      // Reset the flag
      isCreatingSessionDuringMessageSend.current = false;

      // Switch to the new session on the server side
      await apiClient?.api.sessionsControllerSwitchSession(
        encodeURIComponent(rootAgent!.relativePath),
        session.id
      );

      // Invalidate events query to start fetching for new session
      queryClient.invalidateQueries({
        queryKey: ["agent-events", apiUrl, rootAgent?.relativePath, session.id],
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!apiClient || !rootAgent) {
        throw new Error("Root agent required");
      }

      let sessionId = currentSessionId;
      if (!sessionId) {
        isCreatingSessionDuringMessageSend.current = true;
        const session = await createSessionMutation.mutateAsync();
        sessionId = session.id;
      }

      setStatus(true);

      // Add user message immediately for instant UI feedback
      const userMessage: UIMessage = {
        id: `user_${Date.now()}_${Math.random()}`,
        role: "user",
        parts: [{ type: "text", text: content }],
        metadata: {
          timestamp: Date.now(),
          isFinalResponse: true,
        },
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response =
          await apiClient.api.messagingControllerPostAgentMessage(
            encodeURIComponent(rootAgent.relativePath),
            { message: content, attachments: [] }
          );
        return { data: response.data, sessionId };
      } finally {
        setStatus(false);
      }
    },
    onSuccess: (result) => {
      if (!currentSessionId && result.sessionId) {
        setCurrentSessionId(result.sessionId);
      }

      queryClient.invalidateQueries({
        queryKey: [
          "agent-events",
          apiUrl,
          rootAgent?.relativePath,
          result.sessionId || currentSessionId,
        ],
      });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((m) => !m.id.startsWith("user_")));
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation]
  );

  const stop = useCallback(() => {
    setStatus(false);
  }, []);

  const createNewSession = useCallback(() => {
    createSessionMutation.mutate();
  }, [createSessionMutation]);

  // Update session state on wallet/network changes
  useEffect(() => {
    if (!currentSessionId || !rootAgent || !isConnected || !address) {
      return;
    }

    const updateSessionState = async () => {
      try {
        await apiClient.api.stateControllerUpdateState(
          encodeURIComponent(rootAgent.relativePath),
          currentSessionId,
          {
            path: "wallet.address",
            value: address,
          }
        );

        if (chain) {
          await apiClient.api.stateControllerUpdateState(
            encodeURIComponent(rootAgent.relativePath),
            currentSessionId,
            {
              path: "wallet.chainId",
              value: chain.id,
            }
          );

          await apiClient.api.stateControllerUpdateState(
            encodeURIComponent(rootAgent.relativePath),
            currentSessionId,
            {
              path: "wallet.chainName",
              value: chain.name,
            }
          );
        }

        // Invalidate state queries to refresh UI
        queryClient.invalidateQueries({
          queryKey: ["state", apiUrl, rootAgent.relativePath, currentSessionId],
        });
      } catch (error) {
        console.error("Failed to update session state:", error);
      }
    };

    updateSessionState();
  }, [
    address,
    chain,
    isConnected,
    currentSessionId,
    rootAgent,
    apiClient,
    apiUrl,
    queryClient,
  ]);

  return {
    messages,
    status,
    sendMessage,
    stop,
    createNewSession,
  };
}
