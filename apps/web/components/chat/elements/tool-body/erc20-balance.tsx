"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Coins } from "lucide-react";

interface ERC20BalanceBodyProps {
  output: any;
  input?: any;
}

export function ERC20BalanceBody({ output }: ERC20BalanceBodyProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (value: string) => {
    const num = parseFloat(value);
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

  const balance = parsedOutput?.balance || {};
  const formatted = balance.formatted || "0";
  const symbol = balance.symbol || "TOKEN";
  const decimals = balance.decimals || 18;
  const raw = balance.raw || "0";
  const address = parsedOutput?.address || "";
  const tokenAddress = parsedOutput?.tokenAddress || "";
  const network = parsedOutput?.network || "ethereum";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">ERC20 Balance</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Wallet:</span>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {formatAddress(address)}
          </code>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Token:</span>
          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
            {formatAddress(tokenAddress)}
          </code>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {formatBalance(formatted)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{symbol}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground">Decimals:</span>
            <div className="font-mono">{decimals}</div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Raw:</span>
            <div className="font-mono truncate" title={raw}>
              {BigInt(raw).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
