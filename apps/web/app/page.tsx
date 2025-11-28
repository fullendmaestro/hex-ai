import React from "react";
import { Button } from "@hex-ai/ui/components/button";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>

      <React.Suspense fallback={null}>
        <ChatSidebar defaultOpen={false} />
      </React.Suspense>
    </div>
  );
}
