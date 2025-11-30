"use client";

// import { ConnectButton } from "@rainbow-me/rainbowkit";
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
            <div className="flex size-10 items-center justify-center rounded-full bg-foreground">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-background"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-foreground">Hex AI</h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          {/* RainbowKit Connect Button */}
          {/* <ConnectButton /> */}
        </div>
      </div>
    </header>
  );
}
