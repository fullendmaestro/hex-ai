"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Search, Bell } from "lucide-react";
import { Input } from "@hex-ai/ui/components/input";
import { Button } from "@hex-ai/ui/components/button";
import { Avatar, AvatarFallback } from "@hex-ai/ui/components/avatar";

export function HomeHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-3 sm:px-10">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4L8 10L20 16L32 10L20 4Z"
                  fill="#3B82F6"
                  fillOpacity="0.9"
                />
                <path d="M8 24L20 30L32 24V16L20 22L8 16V24Z" fill="#3B82F6" />
                <path
                  d="M20 16L14 19V25L20 28L26 25V19L20 16Z"
                  fill="#60A5FA"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Hex AI
            </h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          {/* RainbowKit Connect Button */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
