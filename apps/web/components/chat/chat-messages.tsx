"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { ScrollArea } from "@hex-ai/ui/components/scroll-area";
import { cn } from "@hex-ai/ui/lib/utils";
import { Copy, RotateCcw, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Message } from "@/lib/schema";
import type { UIMessage } from "@/types";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "./elements/tool";
import { getToolBodyComponent } from "./elements/tool-body";

// Use `any` aliases for components to avoid React type mismatches across @types/react versions
const ToolComponent: any = Tool;
const ToolContentComponent: any = ToolContent;
interface ChatMessagesProps {
  messages: (Message | UIMessage)[];
  inProgress?: boolean;
  onRegenerate?: () => void;
}

export function ChatMessages({
  messages,
  inProgress = false,
  onRegenerate,
}: ChatMessagesProps): ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Type guard to check if message is UIMessage
  const isUIMessage = (msg: Message | UIMessage): msg is UIMessage => {
    return "parts" in msg && "role" in msg;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="px-6 py-4 flex flex-col space-y-2">
        {messages.map((message, index) => {
          const isCurrentMessage = index === messages.length - 1;

          // Handle UIMessage format with parts
          if (isUIMessage(message)) {
            const isLastAssistantMessage =
              message.role === "assistant" && isCurrentMessage;

            // Render user messages with styled bubble
            if (message.role === "user") {
              const textContent = message.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as any).text)
                .join("\n");

              return (
                <div
                  key={message.id}
                  className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="rounded-2xl px-3 py-2 max-w-[80%] bg-foreground text-background">
                    <p className="text-[15px] leading-[1.75] whitespace-pre-wrap break-words">
                      {textContent}
                    </p>
                  </div>
                </div>
              );
            }

            // Render assistant messages with tools
            return (
              <div
                key={message.id}
                className="group flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="max-w-full space-y-4">
                  {message.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return (
                        <p
                          key={partIndex}
                          className="text-[15px] leading-[1.5] whitespace-pre-wrap break-words text-foreground"
                        >
                          {part.text}
                        </p>
                      );
                    }

                    if (part.type === "tool") {
                      const toolCallId = `${message.id}-${partIndex}`;

                      const ToolBody = getToolBodyComponent(part.toolName);
                      if (!ToolBody) return null;

                      return (
                        <ToolComponent defaultOpen={true} key={toolCallId}>
                          <ToolHeader
                            state={part.state}
                            title={part.toolName}
                          />
                          <ToolContentComponent>
                            <ToolOutput
                              output={
                                <ToolBody
                                  output={part.output}
                                  input={part.input}
                                />
                              }
                            />
                          </ToolContentComponent>
                        </ToolComponent>
                      );
                    }

                    return null;
                  })}
                </div>

                <MessageControls
                  message={{
                    id:
                      typeof message.id === "string"
                        ? parseInt(message.id)
                        : (message.id as number),
                    type: message.role,
                    content: message.parts
                      .filter((p) => p.type === "text")
                      .map((p) => (p as any).text)
                      .join("\n"),
                    timestamp: new Date(),
                  }}
                  isCurrentMessage={isLastAssistantMessage}
                  onRegenerate={onRegenerate}
                />
              </div>
            );
          }

          // Handle legacy Message format
          const legacyMessage = message as Message;
          const isLastAssistantMessage =
            legacyMessage.type === "assistant" && isCurrentMessage;

          if (legacyMessage.type === "user") {
            return (
              <div
                key={legacyMessage.id}
                className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="rounded-2xl px-3 py-2 max-w-[80%] bg-foreground text-background">
                  <p className="text-[15px] leading-[1.75] whitespace-pre-wrap break-words">
                    {legacyMessage.content}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={legacyMessage.id}
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="max-w-full">
                <p className="text-[15px] leading-[1.5] whitespace-pre-wrap break-words text-foreground">
                  {legacyMessage.content}
                </p>
              </div>

              <MessageControls
                message={legacyMessage}
                isCurrentMessage={isLastAssistantMessage}
                onRegenerate={onRegenerate}
              />
            </div>
          );
        })}

        {/* Loading indicator */}
        {inProgress && (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-foreground"
                style={{
                  animation: "activityDot 1.4s infinite ease-in-out both",
                  animationDelay: "0s",
                }}
              />
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-foreground"
                style={{
                  animation: "activityDot 1.4s infinite ease-in-out both",
                  animationDelay: "0.2s",
                }}
              />
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-foreground"
                style={{
                  animation: "activityDot 1.4s infinite ease-in-out both",
                  animationDelay: "0.4s",
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes activityDot {
          0%,
          80%,
          100% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ScrollArea>
  );
}

function MessageControls({
  message,
  isCurrentMessage,
  onRegenerate,
}: {
  message: Message;
  isCurrentMessage: boolean;
  onRegenerate?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    // Static for now
  };

  const handleDislike = () => {
    // Static for now
  };

  return (
    <div
      className={cn(
        "flex gap-4 pt-1.5 transition-opacity duration-200",
        isCurrentMessage ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      <button
        onClick={handleCopy}
        className="text-foreground hover:text-foreground/80 transition-all duration-200 p-0 border-0 bg-transparent cursor-pointer hover:scale-105 active:scale-105"
        title="Copy to clipboard"
        style={{ width: "20px", height: "20px" }}
      >
        {copied ? (
          <Check
            className="w-4 h-4"
            strokeWidth={2}
            style={{ minWidth: "16px", minHeight: "16px" }}
          />
        ) : (
          <Copy
            className="w-4 h-4"
            strokeWidth={2}
            style={{ minWidth: "16px", minHeight: "16px" }}
          />
        )}
      </button>
      {isCurrentMessage && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="text-foreground hover:text-foreground/80 transition-all duration-200 p-0 border-0 bg-transparent cursor-pointer hover:scale-105 active:scale-105"
          title="Regenerate response"
          style={{ width: "20px", height: "20px" }}
        >
          <RotateCcw
            className="w-4 h-4"
            strokeWidth={2}
            style={{ minWidth: "16px", minHeight: "16px" }}
          />
        </button>
      )}
      <button
        onClick={handleLike}
        className="text-foreground hover:text-foreground/80 transition-all duration-200 p-0 border-0 bg-transparent cursor-pointer hover:scale-105 active:scale-105"
        title="Like response"
        style={{ width: "20px", height: "20px" }}
      >
        <ThumbsUp
          className="w-4 h-4"
          strokeWidth={2}
          style={{ minWidth: "16px", minHeight: "16px" }}
        />
      </button>
      <button
        onClick={handleDislike}
        className="text-foreground hover:text-foreground/80 transition-all duration-200 p-0 border-0 bg-transparent cursor-pointer hover:scale-105 active:scale-105"
        title="Dislike response"
        style={{ width: "20px", height: "20px" }}
      >
        <ThumbsDown
          className="w-4 h-4"
          strokeWidth={2}
          style={{ minWidth: "16px", minHeight: "16px" }}
        />
      </button>
    </div>
  );
}
