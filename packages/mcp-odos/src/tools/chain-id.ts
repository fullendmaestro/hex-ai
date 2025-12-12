import { z } from "zod";
import { getChainFromName } from "../utils/get-chain.js";

const chainIdSchema = z.object({
  chain: z.string().describe("The chain name to get the ID for"),
});

export const chainIdTool = {
  name: "ODOS_GET_CHAIN_ID",
  description:
    "Get the chain ID and details for a given chain name. This is a read-only utility operation that returns chain information.",
  parameters: chainIdSchema,
  execute: async (args: z.infer<typeof chainIdSchema>) => {
    try {
      console.log("[ODOS_GET_CHAIN_ID] Called...");

      const chain = getChainFromName(args.chain);
      return JSON.stringify(
        {
          chainName: chain.name,
          chainId: chain.id,
          nativeCurrency: chain.nativeCurrency,
        },
        null,
        2
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
