"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Button } from "@hex-ai/ui/components/button";
import { cn } from "@hex-ai/ui/lib/utils";
import { Lock, Send, Wallet, HelpCircle } from "lucide-react";

type SuggestedActionsProps = {
  onSend: (message: string) => void;
};

const suggestions = [
  {
    text: "Check my ETH balance",
    icon: Wallet,
  },
  {
    text: "Transfer 0.1 ETH to vitalik.eth",
    icon: Send,
  },
  {
    text: "Stake 0.1 ETH on Eigen Layer",
    icon: Lock,
  },
  {
    text: "What is the best AVS on Eigen Layer?",
    icon: HelpCircle,
  },
];

function PureSuggestedActions({ onSend }: SuggestedActionsProps) {
  return (
    <div className="px-6 py-4">
      <div className="grid w-full gap-2 grid-cols-1 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              key={suggestion.text}
              transition={{ delay: 0.05 * index }}
            >
              <Button
                className={cn(
                  "h-auto w-full whitespace-normal text-left justify-start gap-3 p-3",
                  "hover:bg-accent hover:text-accent-foreground transition-colors"
                )}
                onClick={() => onSend(suggestion.text)}
                variant="outline"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{suggestion.text}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
