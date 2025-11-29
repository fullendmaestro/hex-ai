import { useState } from "react";
import { askAgent } from "@/app/_actions";

export type Message = {
  role: "user" | "agent";
  content: string;
  id: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () =>
    crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

  const handleSubmit = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await askAgent(textToSend);
      const agentMessage: Message = {
        id: generateId(),
        role: "agent",
        content: result,
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: "agent",
          content: "❌ Something went wrong.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
  };
}
