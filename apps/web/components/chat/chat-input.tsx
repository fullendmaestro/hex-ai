"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@hex-ai/ui/components/button";
import { Send, Square } from "lucide-react";
import { cn } from "@hex-ai/ui/lib/utils";
import { AutoResizingTextarea } from "./auto-resizing-textarea";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  inProgress?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  placeholder = "Type your message...",
  disabled = false,
  inProgress = false,
}: ChatInputProps) {
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled && !inProgress) {
      onSend(value.trim());
    }
  };

  const canSend = value.trim().length > 0 && !inProgress && !disabled;
  const canStop = inProgress && onStop;

  const handleClick = () => {
    if (canStop) {
      onStop();
    } else if (canSend) {
      handleSend();
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative rounded-[20px] border bg-background/50 backdrop-blur-sm",
          "border-border/50 min-h-[75px] mx-auto w-[95%] cursor-text",
          "flex flex-col justify-between p-3"
        )}
        onClick={() => textareaRef.current?.focus()}
      >
        <AutoResizingTextarea
          ref={textareaRef}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxRows={6}
          className={cn(
            "w-full bg-transparent border-0 outline-none resize-none",
            "text-[14px] leading-6 text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-0 p-0 m-0"
          )}
        />
        <div className="flex justify-end gap-1 pt-2">
          <button
            onClick={handleClick}
            disabled={!canSend && !canStop}
            className={cn(
              "p-0 cursor-pointer transition-all duration-200 border-0 bg-transparent",
              "w-6 h-6 flex items-center justify-center",
              canSend || canStop
                ? "text-foreground hover:scale-105"
                : "text-muted-foreground cursor-default"
            )}
            aria-label={inProgress ? "Stop generating" : "Send message"}
          >
            {inProgress ? (
              <Square
                className="h-6 w-6"
                strokeWidth={1.5}
                fill="currentColor"
              />
            ) : (
              <Send className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


