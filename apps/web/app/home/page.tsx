"use client";

import React from "react";
import { ChatSidebar } from "@/components/chat";

export default function Page() {
  return (
    <main className="">
      <React.Suspense fallback={null}>
        <ChatSidebar />
      </React.Suspense>
    </main>
  );
}
