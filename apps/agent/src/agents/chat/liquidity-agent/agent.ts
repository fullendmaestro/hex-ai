import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { env } from "../../../env";
import { getEvmMcpTools } from "../../shared/evm-tools";
import { getOdosMcpTools } from "../../shared/odos-tools";
import {
  setWalletAddressTool,
  setChainTool,
  clearWalletStateTool,
  viewWalletStateTool,
} from "../../shared/wallet-state-tools";
import { getModel } from "../../../config/model";

export const getLiquidityAgent = async () => {
  const tools = await getEvmMcpTools();

  // Also include ODOS MCP tools for DEX aggregation swaps (build-only)
  const odosTools = await getOdosMcpTools();

  const liquidityAgent = new LlmAgent({
    name: "liquidity_agent",
    description:
      "Handle liquidity operations on decentralized exchanges through various aggregation protocols.",
    instruction: dedent`
      Handle liquidity operations on decentralized exchanges through various aggregation protocols.
      
      Current wallet connection state:
      - Connected Address: {wallet.address}
      - Chain ID: {wallet.chainId}
      - Chain Name: {wallet.chainName}

      
      `,
    model: getModel(),
    tools: [
      ...tools,
      ...odosTools,
      setWalletAddressTool,
      setChainTool,
      clearWalletStateTool,
      viewWalletStateTool,
    ],
  });

  return liquidityAgent;
};
