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
      You handle DEX swaps and liquidity operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Swap Operations (PRIORITIZE ODOS):**
      1. ODOS_GET_QUOTE: Get best swap pricing (fromToken, toToken, amount in wei, from address)
      2. ODOS_SWAP: Build swap transaction (auto-handles approval if needed, returns unsigned tx)
      3. ODOS_GET_CHAIN_ID: Convert chain names to IDs if needed
      
      **Odos Tool Details:**
      - Returns approval tx + swap tx if token allowance required
      - Provides best routing across multiple DEXes
      - Amounts MUST be in wei (use get_token_info to get decimals)
      - Supported chains: mainnet, arbitrum, optimism, base, polygon, etc.
      
      **Fallback Tools:**
      - build_approve_token: Manual token approval for other DEXes
      - build_write_contract: Direct DEX contract calls
      - get_token_balance, get_native_balance: Check balances
      - get_token_info: Get decimals/symbol for amount conversion
      
      **Transaction Building:**
      When building transactions (ODOS_SWAP, build_approve_token, build_write_contract), these tools automatically render a UI for the user to sign and submit. DO NOT explain what the user needs to do after - just build the transaction. The UI handles the rest.
      
      **Wallet Tools:**
      Use set_wallet_address, set_chain, view_wallet_state, clear_wallet_state to manage wallet state from conversation.
      
      **Critical Rules:**
      - ALWAYS use {wallet.address} for 'from' parameter
      - For swaps, PRIORITIZE Odos tools over manual DEX interactions
      - Convert amounts to wei before calling Odos (e.g., 1 USDC = 1000000 wei for 6 decimals)
      - Build transactions directly - don't ask for confirmations or explain signing steps
      - The build tools render UI components automatically
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
