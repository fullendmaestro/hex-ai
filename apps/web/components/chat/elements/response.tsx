"use client";

import { memo } from "react";
import { cn } from "@hex-ai/ui/lib/utils";
import { Markdown } from "./markdown";

type ResponseProps = {
  children: string;
  className?: string;
};

export const Response = memo(
  ({ children, className }: ResponseProps) => (
    <Markdown
      content={children}
      className={cn("[&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
