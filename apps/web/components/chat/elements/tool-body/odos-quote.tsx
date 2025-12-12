"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { TrendingUp, ArrowRight } from "lucide-react";

interface OdosQuoteBodyProps {
  output: any;
  input?: any;
}

export function OdosQuoteBody({ output }: OdosQuoteBodyProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (value: string, decimals: number = 18) => {
    try {
      const num = BigInt(value);
      const divisor = BigInt(10 ** decimals);
      const wholePart = num / divisor;
      const remainder = num % divisor;

      const decimalPart = remainder.toString().padStart(decimals, "0");
      const trimmedDecimal = decimalPart.replace(/0+$/, "").slice(0, 6);

      if (trimmedDecimal === "") {
        return wholePart.toString();
      }

      return `${wholePart}.${trimmedDecimal}`;
    } catch (e) {
      return value;
    }
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

  const inTokens = parsedOutput?.inTokens || [];
  const inAmounts = parsedOutput?.inAmounts || [];
  const outTokens = parsedOutput?.outTokens || [];
  const outAmounts = parsedOutput?.outAmounts || [];
  const pathId = parsedOutput?.pathId || "";
  const gasEstimate = parsedOutput?.gasEstimate || "0";
  const network = parsedOutput?.network || "fraxtal";

  const inToken = inTokens[0] || "";
  const inAmount = inAmounts[0] || "0";
  const outToken = outTokens[0] || "";
  const outAmount = outAmounts[0] || "0";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Swap Quote</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        {/* From Token */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">From</span>
            <code className="text-xs font-mono bg-background px-2 py-0.5 rounded">
              {formatAddress(inToken)}
            </code>
          </div>
          <div className="text-xl font-semibold">{formatAmount(inAmount)}</div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* To Token */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">
              To (estimated)
            </span>
            <code className="text-xs font-mono bg-background/50 px-2 py-0.5 rounded">
              {formatAddress(outToken)}
            </code>
          </div>
          <div className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
            {formatAmount(outAmount)}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 gap-2 text-xs pt-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Gas Estimate:</span>
            <span className="font-mono">{gasEstimate}</span>
          </div>
          {pathId && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Path ID:</span>
              <code className="font-mono bg-muted px-2 py-0.5 rounded">
                {formatAddress(pathId)}
              </code>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
