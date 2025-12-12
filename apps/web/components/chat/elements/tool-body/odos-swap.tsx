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
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useChainId,
} from "wagmi";
import type { Hex } from "viem";

interface OdosSwapBodyProps {
  output: any;
  input?: any;
}

export function OdosSwapBody({ output, input }: OdosSwapBodyProps) {
  const [copied, setCopied] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const [currentStep, setCurrentStep] = useState<"approval" | "swap">(
    "approval"
  );
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  // Separate transaction hooks for approval and swap
  const {
    data: approvalHash,
    isPending: approvalPending,
    error: approvalError,
    sendTransaction: sendApproval,
    reset: resetApproval,
  } = useSendTransaction();

  const {
    data: swapHash,
    isPending: swapPending,
    error: swapError,
    sendTransaction: sendSwap,
  } = useSendTransaction();

  const { isLoading: approvalConfirming, isSuccess: approvalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  const { isLoading: swapConfirming, isSuccess: swapConfirmed } =
    useWaitForTransactionReceipt({
      hash: swapHash,
    });

  // Parse output
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendApproval = async () => {
    const approvalTx = parsedOutput?.approvalTransaction;
    if (!approvalTx || !isConnected) return;

    try {
      // Check if we need to switch chains
      if (chainId !== approvalTx.chainId) {
        setIsSwitchingChain(true);
        await switchChainAsync({ chainId: approvalTx.chainId });
        setIsSwitchingChain(false);
      }

      const tx: any = {
        to: approvalTx.to as Hex,
        data: approvalTx.data as Hex,
        chainId: approvalTx.chainId,
      };

      sendApproval(tx);
    } catch (error) {
      setIsSwitchingChain(false);
      console.error("Approval transaction error:", error);
    }
  };

  const handleSendSwap = async () => {
    const swapTx = parsedOutput?.swapTransaction;
    if (!swapTx || !isConnected) return;

    try {
      // Check if we need to switch chains
      if (chainId !== swapTx.chainId) {
        setIsSwitchingChain(true);
        await switchChainAsync({ chainId: swapTx.chainId });
        setIsSwitchingChain(false);
      }

      const tx: any = {
        to: swapTx.to as Hex,
        data: swapTx.data as Hex,
        chainId: swapTx.chainId,
      };

      if (swapTx.value && swapTx.value !== "0") {
        tx.value = BigInt(swapTx.value);
      }

      sendSwap(tx);
    } catch (error) {
      setIsSwitchingChain(false);
      console.error("Swap transaction error:", error);
    }
  };

  const getBlockExplorerUrl = (txHash: string) => {
    const network = parsedOutput?.network || "fraxtal";
    const baseUrls: Record<string, string> = {
      fraxtal: "https://fraxscan.com",
      ethereum: "https://etherscan.io",
      base: "https://basescan.org",
      arbitrum: "https://arbiscan.io",
      optimism: "https://optimistic.etherscan.io",
    };

    const baseUrl = baseUrls[network.toLowerCase()] || baseUrls.fraxtal;
    return `${baseUrl}/tx/${txHash}`;
  };

  const approvalTx = parsedOutput?.approvalTransaction;
  const swapTx = parsedOutput?.swapTransaction;
  const approvalRequired = parsedOutput?.approvalRequired || false;
  const network = parsedOutput?.network || "fraxtal";
  const message = parsedOutput?.message || "";
  const quote = parsedOutput?.quote || {};

  // Auto-switch to swap step after approval is confirmed
  if (approvalConfirmed && currentStep === "approval") {
    setTimeout(() => setCurrentStep("swap"), 500);
  }

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">Swap Transaction</h4>
        </div>
        <Badge variant="outline" className="capitalize">
          {network}
        </Badge>
      </div>

      <Separator />

      {/* Quote Summary */}
      {quote && (
        <div className="space-y-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Selling</span>
              <code className="text-xs font-mono bg-background px-2 py-0.5 rounded">
                {formatAddress(quote.inToken)}
              </code>
            </div>
            <div className="text-lg font-semibold">
              {formatAmount(quote.inAmount)}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">
                Receiving (min)
              </span>
              <code className="text-xs font-mono bg-background/50 px-2 py-0.5 rounded">
                {formatAddress(quote.outToken)}
              </code>
            </div>
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatAmount(quote.outAmount)}
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Approval Step */}
      {approvalRequired && (
        <>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  approvalConfirmed
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <h5 className="font-medium text-sm">Token Approval</h5>
            </div>

            {!approvalConfirmed && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to approve the router to spend your tokens before
                  swapping.
                </AlertDescription>
              </Alert>
            )}

            {approvalTx && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <code className="font-mono bg-muted px-2 py-0.5 rounded">
                    {formatAddress(approvalTx.to)}
                  </code>
                </div>
              </div>
            )}

            {!isConnected && (
              <Alert variant="destructive">
                <AlertDescription>
                  Please connect your wallet to proceed
                </AlertDescription>
              </Alert>
            )}

            {approvalError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {approvalError.message || "Failed to send approval"}
                </AlertDescription>
              </Alert>
            )}

            {approvalHash && !approvalConfirmed && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Waiting for approval confirmation...
                  <a
                    href={getBlockExplorerUrl(approvalHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View on Explorer
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {approvalConfirmed && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Approval successful! Proceed to swap.
                </AlertDescription>
              </Alert>
            )}

            {!approvalHash && !approvalConfirmed && (
              <Button
                onClick={handleSendApproval}
                disabled={!isConnected || approvalPending || isSwitchingChain}
                className="w-full"
                size="sm"
              >
                {isSwitchingChain ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Switching Network...
                  </>
                ) : approvalPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Approve Token
                  </>
                )}
              </Button>
            )}
          </div>

          <Separator />
        </>
      )}

      {/* Swap Step */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              swapConfirmed
                ? "bg-green-500 text-white"
                : approvalRequired && !approvalConfirmed
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground"
            }`}
          >
            {approvalRequired ? "2" : "1"}
          </div>
          <h5 className="font-medium text-sm">Execute Swap</h5>
        </div>

        {swapTx && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <code className="font-mono bg-muted px-2 py-0.5 rounded">
                {formatAddress(swapTx.to)}
              </code>
            </div>
            {swapTx.value && swapTx.value !== "0" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value:</span>
                <span className="font-mono">{formatAmount(swapTx.value)}</span>
              </div>
            )}
            {swapTx.gas && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Limit:</span>
                <span className="font-mono">{swapTx.gas}</span>
              </div>
            )}
          </div>
        )}

        {swapError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {swapError.message || "Failed to send swap transaction"}
            </AlertDescription>
          </Alert>
        )}

        {swapHash && !swapConfirmed && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Waiting for swap confirmation...
              <a
                href={getBlockExplorerUrl(swapHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
              >
                View on Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        {swapConfirmed && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 flex items-center justify-between">
              <span>Swap completed successfully!</span>
              <a
                href={getBlockExplorerUrl(swapHash!)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        {!swapHash && !swapConfirmed && (
          <Button
            onClick={handleSendSwap}
            disabled={
              !isConnected ||
              swapPending ||
              isSwitchingChain ||
              (approvalRequired && !approvalConfirmed)
            }
            className="w-full"
            size="sm"
          >
            {isSwitchingChain ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Switching Network...
              </>
            ) : swapPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming Swap...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Execute Swap
              </>
            )}
          </Button>
        )}
      </div>

      {message && (
        <>
          <Separator />
          <p className="text-xs text-muted-foreground">{message}</p>
        </>
      )}
    </Card>
  );
}
