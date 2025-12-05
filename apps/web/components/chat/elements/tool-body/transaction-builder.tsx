"use client";

import { useState } from "react";
import { Badge } from "@hex-ai/ui/components/badge";
import { Button } from "@hex-ai/ui/components/button";
import { Card } from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Alert, AlertDescription } from "@hex-ai/ui/components/alert";
import {
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, type Hex } from "viem";

interface TransactionBuilderBodyProps {
  output: any;
  input?: any;
}

export function TransactionBuilderBody({
  output,
  input,
}: TransactionBuilderBodyProps) {
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();
  const {
    data: hash,
    isPending,
    error,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Parse output - it might be a JSON string or an object
  // The output can come in different formats:
  // 1. { content: [{ type: "text", text: "{...json...}" }] } - MCP format
  // 2. "{...json...}" - Direct JSON string
  // 3. {...json...} - Direct object
  let parsedOutput = output;

  // Handle MCP content format
  if (
    output?.content &&
    Array.isArray(output.content) &&
    output.content[0]?.text
  ) {
    try {
      parsedOutput = JSON.parse(output.content[0].text);
    } catch (e) {
      console.error("Failed to parse MCP content:", e);
      parsedOutput = {};
    }
  }
  // Handle direct JSON string
  else if (typeof output === "string") {
    try {
      parsedOutput = JSON.parse(output);
    } catch (e) {
      console.error("Failed to parse JSON string:", e);
      parsedOutput = {};
    }
  }
  // If already an object, use as-is
  else if (typeof output === "object") {
    parsedOutput = output;
  }

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTransaction = () => {
    const txRequest = parsedOutput?.transactionRequest;
    if (!txRequest || !isConnected) return;

    const tx: any = {
      to: txRequest.to as Hex,
      data: txRequest.data as Hex,
      chainId: txRequest.chainId,
    };

    // Add value if present (for native token transfers or payable functions)
    if (txRequest.value && txRequest.value !== "0") {
      tx.value = BigInt(txRequest.value);
    }

    sendTransaction(tx);
  };

  const txRequest = parsedOutput?.transactionRequest;
  const serializedTx = parsedOutput?.serializedTransaction;
  const network = parsedOutput?.network || "ethereum";
  const message = parsedOutput?.message || "";

  // Transaction-specific details
  const amount = parsedOutput?.amount;
  const symbol = parsedOutput?.symbol;
  const tokenAddress = parsedOutput?.tokenAddress;
  const spender = parsedOutput?.spender;
  const approvalAmount = parsedOutput?.approvalAmount;
  const contractAddress = parsedOutput?.contractAddress;
  const functionName = parsedOutput?.function;
  const args = parsedOutput?.args;

  const getTransactionType = () => {
    if (tokenAddress && spender) return "Token Approval";
    if (tokenAddress && !spender) return "Token Transfer";
    if (contractAddress) return "Contract Interaction";
    return "Native Transfer";
  };

  const getBlockExplorerUrl = (txHash: string) => {
    const explorers: Record<string, string> = {
      ethereum: "https://etherscan.io/tx/",
      sepolia: "https://sepolia.etherscan.io/tx/",
      optimism: "https://optimistic.etherscan.io/tx/",
      arbitrum: "https://arbiscan.io/tx/",
      base: "https://basescan.org/tx/",
      polygon: "https://polygonscan.com/tx/",
    };
    return `${explorers[network] || explorers.ethereum}${txHash}`;
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">{getTransactionType()}</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      {/* Transaction Details */}
      <div className="space-y-3">
        {/* From/To */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground">From:</span>
            <code className="block font-mono bg-muted px-2 py-1 rounded text-xs">
              {formatAddress(txRequest?.from || "")}
            </code>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">To:</span>
            <code className="block font-mono bg-muted px-2 py-1 rounded text-xs">
              {formatAddress(txRequest?.to || "")}
            </code>
          </div>
        </div>

        {/* Amount/Token Info */}
        {amount && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 border border-blue-100 dark:border-blue-900">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {amount}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {symbol || network.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Approval Amount */}
        {approvalAmount && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-3 border border-amber-100 dark:border-amber-900">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Approval Amount
              </div>
              <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {approvalAmount}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {symbol || "tokens"}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Spender: {formatAddress(spender || "")}
              </div>
            </div>
          </div>
        )}

        {/* Contract Function */}
        {functionName && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Function:</span>
              <code className="font-mono bg-muted px-2 py-1 rounded">
                {functionName}
              </code>
            </div>
            {args && args.length > 0 && (
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">
                  Arguments:
                </span>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(args, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Transaction Data */}
        {txRequest?.data && txRequest.data !== "0x" && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-xs">Data:</span>
              <button
                onClick={() => handleCopy(txRequest.data)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
            <code className="block text-xs font-mono bg-muted px-2 py-1 rounded break-all">
              {txRequest.data.slice(0, 66)}
              {txRequest.data.length > 66 && "..."}
            </code>
          </div>
        )}

        {/* Chain ID */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Chain ID:</span>
          <Badge variant="secondary">{txRequest?.chainId}</Badge>
        </div>
      </div>

      <Separator />

      {/* Status and Actions */}
      <div className="space-y-2">
        {!isConnected && (
          <Alert>
            <AlertDescription className="text-sm">
              Connect your wallet to sign and submit this transaction
            </AlertDescription>
          </Alert>
        )}

        {isConnected &&
          address?.toLowerCase() !== txRequest?.from?.toLowerCase() && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                Connected wallet ({formatAddress(address || "")}) does not match
                transaction sender ({formatAddress(txRequest?.from || "")})
              </AlertDescription>
            </Alert>
          )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {error.message}
            </AlertDescription>
          </Alert>
        )}

        {isConfirming && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription className="text-sm">
              Waiting for confirmation...
            </AlertDescription>
          </Alert>
        )}

        {isConfirmed && hash && (
          <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              <div className="space-y-1">
                <div className="font-semibold text-green-900 dark:text-green-100">
                  Transaction Confirmed!
                </div>
                <a
                  href={getBlockExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 dark:text-green-300 hover:underline inline-flex items-center gap-1"
                >
                  View on Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSendTransaction}
          disabled={
            !isConnected ||
            isPending ||
            isConfirming ||
            isConfirmed ||
            address?.toLowerCase() !== txRequest?.from?.toLowerCase()
          }
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isPending ? "Signing..." : "Confirming..."}
            </>
          ) : isConfirmed ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmed
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Sign & Submit Transaction
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
