"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface NativeBalanceBodyProps {
  output: any;
  input?: any;
}

export function NativeBalanceBody({ output }: NativeBalanceBodyProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (ether: string) => {
    const num = parseFloat(ether);
    if (num === 0) return "0.00";
    if (num < 0.000001) return "< 0.000001";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

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

  const balance = parsedOutput?.balance?.ether || "0";
  const wei = parsedOutput?.balance?.wei || "0";
  const address = parsedOutput?.address || "";
  const network = parsedOutput?.network || "ethereum";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Native Balance</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Address:</span>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {formatAddress(address)}
          </code>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formatBalance(balance)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {network === "ethereum" ? "ETH" : network.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Wei:</span>
          <code className="font-mono text-muted-foreground">
            {BigInt(wei).toLocaleString()}
          </code>
        </div>
      </div>
    </Card>
  );
}
