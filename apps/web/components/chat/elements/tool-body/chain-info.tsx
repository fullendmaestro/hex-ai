"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Network, Activity } from "lucide-react";

interface ChainInfoBodyProps {
  output: any;
  input?: any;
}

export function ChainInfoBody({ output }: ChainInfoBodyProps) {
  // Parse output - handle MCP content format
  let parsedOutput = output;
  if (
    output?.content &&
    Array.isArray(output.content) &&
    output.content[0]?.text
  ) {
    try {
      parsedOutput = JSON.parse(output.content[0].text);
    } catch (e) {
      parsedOutput = {};
    }
  } else if (typeof output === "string") {
    try {
      parsedOutput = JSON.parse(output);
    } catch (e) {
      parsedOutput = {};
    }
  }

  const network = parsedOutput?.network || "ethereum";
  const chainId = parsedOutput?.chainId || "";
  const blockNumber = parsedOutput?.blockNumber || "";
  const rpcUrl = parsedOutput?.rpcUrl || "";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Chain Information</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs">Chain ID</span>
            <div className="font-mono text-sm font-semibold">{chainId}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Latest Block
            </span>
            <div className="font-mono text-sm font-semibold">
              {parseInt(blockNumber).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">RPC Endpoint</span>
          <code className="block text-xs font-mono bg-muted px-2 py-1 rounded break-all">
            {rpcUrl}
          </code>
        </div>
      </div>
    </Card>
  );
}
