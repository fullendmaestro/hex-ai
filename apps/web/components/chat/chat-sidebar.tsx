"use client";

import { useState, useEffect } from "react";
import { Button } from "@hex-ai/ui/components/button";
import { cn } from "@hex-ai/ui/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useChat, type Message } from "@/hooks/use-chat";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

interface ChatSidebarProps {
  defaultOpen?: boolean;
  className?: string;
}

export function ChatSidebar({
  defaultOpen = false,
  className,
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { messages, input, setInput, isLoading, handleSubmit } = useChat();

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
          <div className="text-base font-medium">Hex AI Chat</div>
          <div className="flex items-center gap-1">
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

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden bg-background">
          {messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground px-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Ask something like "Tell me a joke" or "What's the weather
                  like today?"
                </p>
              </div>
            </div>
          ) : (
            <ChatMessages
              messages={messages.map((msg) => ({
                id: typeof msg.id === "string" ? parseInt(msg.id) || 0 : msg.id,
                type: msg.role === "user" ? "user" : "assistant",
                content: msg.content,
                timestamp: new Date(),
              }))}
              inProgress={isLoading}
              onRegenerate={() => {}}
            />
          )}
        </div>

        {/* Input Area */}
        <div className="bg-background pb-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSubmit}
            onStop={() => {}}
            placeholder="Message Hex AI..."
            inProgress={isLoading}
            disabled={false}
          />
        </div>
      </div>

      {/* Overlay for Chat */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
