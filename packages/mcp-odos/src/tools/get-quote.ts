import { fraxtal } from "viem/chains";
import { isAddress } from "viem/utils";
import { z } from "zod";
import { GetQuoteActionService } from "../services/get-quote.js";
import { WalletService } from "../services/wallet.js";
import { getChainFromName } from "../utils/get-chain.js";

const getQuoteParamsSchema = z.object({
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
    .describe("The sender address used for quoting"),
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

export const getQuoteTool = {
  name: "ODOS_GET_QUOTE",
  description:
    "Get a quote for a swap or exchange operation. This is a read-only operation that returns pricing information without executing any transactions.",
  parameters: getQuoteParamsSchema,
  execute: async (args: z.infer<typeof getQuoteParamsSchema>) => {
    try {
      const inputChain = args.chain.toLowerCase();

      const chainObject = getChainFromName(inputChain) ?? fraxtal;

      const fromAddress = args.from;
      if (!fromAddress) {
        throw new Error("`from` address is required to build transactions.");
      }

      const walletService = new WalletService(undefined, chainObject);

      console.log(
        `[ODOS_GET_QUOTE] Using chain: ${chainObject} (${chainObject.id})`
      );
      console.log(fromAddress ?? "No wallet address provided");

      const service = new GetQuoteActionService();

      const quote = await service.execute(
        args.fromToken,
        args.toToken,
        chainObject.id,
        args.amount,
        fromAddress
      );
      if (quote instanceof Error) {
        return `Error fetching quote: ${quote.message}`;
      }

      return args.prettyFormat
        ? service.format(quote)
        : JSON.stringify(quote, null, 2);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching quote.";
      console.error(`[ODOS_GET_QUOTE] Error: ${message}`);
      throw new Error(`Failed to fetch quote: ${message}`);
    }
  },
};
