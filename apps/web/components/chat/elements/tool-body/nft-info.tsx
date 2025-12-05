"use client";

import { Badge } from "@hex-ai/ui/components/badge";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Image as ImageIcon } from "lucide-react";

interface NFTInfoBodyProps {
  output: any;
  input?: any;
}

export function NFTInfoBody({ output }: NFTInfoBodyProps) {
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

  const contract = parsedOutput?.contract || "";
  const tokenId = parsedOutput?.tokenId || "";
  const owner = parsedOutput?.owner || "";
  const name = parsedOutput?.name || "Unknown";
  const symbol = parsedOutput?.symbol || "NFT";
  const tokenURI = parsedOutput?.tokenURI || "";
  const network = parsedOutput?.network || "ethereum";

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">NFT Information</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-3 border border-purple-100 dark:border-purple-900">
          <div className="text-center">
            <div className="text-lg font-bold">{name}</div>
            <div className="text-sm text-muted-foreground">{symbol}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Token ID: {tokenId}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Contract:</span>
            <code className="font-mono bg-muted px-2 py-1 rounded">
              {formatAddress(contract)}
            </code>
          </div>

          {owner && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Owner:</span>
              <code className="font-mono bg-muted px-2 py-1 rounded">
                {formatAddress(owner)}
              </code>
            </div>
          )}

          {tokenURI && (
            <div className="space-y-1">
              <span className="text-muted-foreground">Token URI:</span>
              <code className="block font-mono bg-muted px-2 py-1 rounded break-all text-xs">
                {tokenURI}
              </code>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
