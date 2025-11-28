"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@hex-ai/ui/components/button";
import { Card } from "@hex-ai/ui/components/card";
import { ScrollArea } from "@hex-ai/ui/components/scroll-area";
import { cn } from "@hex-ai/ui/lib/utils";
import { MessageSquare, X, Send, Minimize2, Menu } from "lucide-react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { SessionsPanel } from "./sessions-panel";
import { useAgents } from "@/hooks/use-agent";
import { useSessions } from "@/hooks/use-sessions";
import { parseAsString, useQueryState } from "nuqs";
import type { Message } from "@/lib/schema";

interface ChatSidebarProps {
  defaultOpen?: boolean;
  className?: string;
}

export function ChatSidebar({
  defaultOpen = false,
  className,
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isSessionsPanelOpen, setIsSessionsPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  // State management with nuqs
  const [sessionId, setSessionId] = useQueryState("sessionId", parseAsString);
  const [agentName, setAgentName] = useQueryState("agent", parseAsString);

  // Hooks for agents and sessions
  const {
    agents,
    selectedAgent,
    messages,
    sendMessage: sendAgentMessage,
    selectAgent,
    isSendingMessage,
    loading: agentsLoading,
  } = useAgents(sessionId);

  const {
    sessions,
    isLoading: sessionsLoading,
    createSession,
    deleteSession,
    switchSession,
  } = useSessions(selectedAgent);

  // Auto-select first agent
  useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      const firstAgent = agents[0];
      if (firstAgent) {
        selectAgent(firstAgent);
        if (!agentName) {
          setAgentName(firstAgent.name);
        }
      }
    }
  }, [agents, selectedAgent, agentName, selectAgent, setAgentName]);

  // Auto-select or create first session
  useEffect(() => {
    if (!selectedAgent || sessionsLoading) return;

    if (sessions.length === 0) {
      // No sessions exist - create one
      createSession({})
        .then((created) => {
          if (created?.id) {
            setSessionId(created.id);
          }
        })
        .catch(console.error);
    } else if (!sessionId || !sessions.some((s) => s.id === sessionId)) {
      // No valid session selected - select first
      const firstSession = sessions[0];
      if (firstSession) {
        setSessionId(firstSession.id);
      }
    }
  }, [
    selectedAgent,
    sessions,
    sessionsLoading,
    sessionId,
    setSessionId,
    createSession,
  ]);

  const handleSend = (text: string) => {
    if (!text.trim() || isSendingMessage || !selectedAgent || !sessionId)
      return;

    sendAgentMessage(text);
    setInputValue("");
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.type === "user");
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  const handleStop = () => {
    // Stop functionality would be implemented here
  };

  const handleCreateSession = async (
    state?: Record<string, any>,
    newSessionId?: string
  ) => {
    const created = await createSession({ state, sessionId: newSessionId });
    if (created?.id) {
      setSessionId(created.id);
    }
    return created;
  };

  const handleDeleteSession = async (deleteSessionId: string) => {
    await deleteSession(deleteSessionId);
    if (sessionId === deleteSessionId) {
      setSessionId(null);
    }
  };

  const handleSwitchSession = async (newSessionId: string) => {
    await switchSession(newSessionId);
    setSessionId(newSessionId);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "/" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (event.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 transition-all",
          isOpen && "opacity-0 pointer-events-none"
        )}
        size="icon"
        variant="default"
        aria-label="Open Chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Sidebar Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-[28rem] bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-base font-medium">
            {selectedAgent?.name || "Hex AI Chat"}
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsSessionsPanelOpen(true)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Open Sessions"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden bg-background">
              {agentsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : !selectedAgent ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No agent available</p>
                  </div>
                </div>
              ) : !sessionId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Creating session...</p>
                  </div>
                </div>
              ) : (
                <ChatMessages
                  messages={messages}
                  inProgress={isSendingMessage}
                  onRegenerate={handleRegenerate}
                />
              )}
            </div>

            {/* Input Area */}
            <div className="bg-background pb-4">
              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSend}
                onStop={handleStop}
                placeholder={`Message ${selectedAgent?.name || "AI"}...`}
                inProgress={isSendingMessage}
                disabled={!selectedAgent || !sessionId}
              />
              <p className="text-xs text-muted-foreground text-center mt-2 px-4">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                  Cmd/Ctrl+/
                </kbd>{" "}
                to toggle
              </p>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Chat minimized. Click to expand.
          </div>
        )}
      </div>

      {/* Sessions Panel Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-80 bg-background border-l shadow-2xl z-[60] transition-transform duration-300 ease-in-out",
          isSessionsPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-base font-medium">Chat Sessions</div>
          <Button
            onClick={() => setIsSessionsPanelOpen(false)}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Close Sessions"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <SessionsPanel
          sessions={sessions}
          currentSessionId={sessionId}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
          onSwitchSession={handleSwitchSession}
          isLoading={sessionsLoading}
        />
      </div>

      {/* Overlay for Chat */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Overlay for Sessions Panel */}
      {isSessionsPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSessionsPanelOpen(false)}
        />
      )}
    </>
  );
}
