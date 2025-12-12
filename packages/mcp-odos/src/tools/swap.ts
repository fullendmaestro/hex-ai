import { fraxtal } from "viem/chains";
import { isAddress } from "viem/utils";
import { z } from "zod";
import { AssembleService } from "../services/assemble.js";
import { ExecuteSwapService } from "../services/execute-swap.js";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import { getChainFromName } from "../utils/get-chain.js";

const swapParamsSchema = z.object({
  chain: z
    .string()
    .optional()
    .describe(
      "The blockchain network to execute the transaction on. uses fraxtal as default"
    )
    .default("fraxtal"),
  from: z
    .string()
    .refine(isAddress, { message: "Invalid from address" })
    .describe("The sender address that will sign the transaction"),
  fromToken: z
    .string()
    .refine(isAddress, { message: "Invalid fromToken address" })
    .describe("The token to swap from (address)."),
  toToken: z
    .string()
    .refine(isAddress, { message: "Invalid toToken address" })
    .describe("The token to swap to (address)."),
  amount: z
    .string()
    .regex(/^\d+$/, { message: "Amount must be a string in wei (no decimals)" })
    .describe("The amount of tokens to swap, in wei."),
  prettyFormat: z
    .boolean()
    .optional()
    .describe("Whether to pretty format the quote.")
    .default(true),
});

export const swapTool = {
  name: "ODOS_SWAP",
  description:
    "Build a swap transaction using Odos Router. Returns unsigned transaction data to be signed and submitted by the client. May also return an approval transaction if token allowance is required.",
  parameters: swapParamsSchema,
  execute: async (args: z.infer<typeof swapParamsSchema>) => {
    try {
      console.log("[ODOS_SWAP] Called...");
      const inputChain = args.chain.toLowerCase();

      const chainObject = getChainFromName(inputChain) ?? fraxtal;

      // Build-only mode: require a sender address to prepare unsigned txs
      const fromAddress = args.from;
      if (!fromAddress) {
        throw new Error("`from` address is required to build transactions.");
      }

      const walletService = new WalletService(undefined, chainObject);

      const getQuoteService = new GetQuoteActionService();
      const quote = await getQuoteService.execute(
        args.fromToken,
        args.toToken,
        chainObject.id,
        args.amount,
        fromAddress
      );

      if (quote instanceof Error || !quote.pathId) {
        return `Error fetching quote: ${quote instanceof Error ? quote.message : String(quote)}`;
      }

      const assembleService = new AssembleService();
      const txn = await assembleService.execute(quote.pathId, fromAddress);
      if (!txn) {
        return `Error assembling transaction: ${txn}`;
      }
      const executeSwapService = new ExecuteSwapService(walletService);

      try {
        // Build approval tx if required
        const approval = await executeSwapService.checkAndSetAllowance(
          quote.inTokens[0],
          BigInt(quote.inAmounts[0]),
          txn.to,
          fromAddress
        );

        // Build the unsigned swap transaction
        const builtSwap = await executeSwapService.execute(txn, fromAddress);

        if (args.prettyFormat) {
          const result: any = {
            network: chainObject.name,
            chainId: chainObject.id,
            quote: {
              inToken: quote.inTokens[0],
              inAmount: quote.inAmounts[0],
              outToken: quote.outTokens[0],
              outAmount: quote.outAmounts[0],
              pathId: quote.pathId,
            },
            message: "Transactions prepared. Sign and submit with your wallet.",
          };

          if (approval) {
            result.approvalTransaction = {
              from: approval.request.from,
              to: approval.request.to,
              data: approval.request.data,
              chainId: approval.request.chainId,
            };
            result.serializedApproval = approval.serialized;
            result.approvalRequired = true;
          } else {
            result.approvalRequired = false;
          }

          result.swapTransaction = {
            from: builtSwap.request.from,
            to: builtSwap.request.to,
            data: builtSwap.request.data,
            value: builtSwap.request.value?.toString(),
            gas: builtSwap.request.gas?.toString(),
            gasPrice: builtSwap.request.gasPrice?.toString(),
            nonce: builtSwap.request.nonce,
            chainId: builtSwap.request.chainId,
          };
          result.serializedSwap = builtSwap.serialized;

          return JSON.stringify(result, null, 2);
        }

        return JSON.stringify({ approval, swap: builtSwap }, null, 2);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "An unknown error occurred during the execution.";
        throw new Error(`Error building swap: ${message}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An unknown error occurred during the fetch.";
      console.error(`[ODOS_SWAP] Error: ${message}`);
      throw new Error(`Failed in swap process: ${message}`);
    }
  },
};
