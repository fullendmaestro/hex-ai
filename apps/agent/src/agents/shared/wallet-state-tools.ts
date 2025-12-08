import { createTool } from "@iqai/adk";
import * as z from "zod";

/**
 * Shared tools for managing wallet state across all agents.
 * These tools allow agents to update wallet information based on user conversation
 * without requiring frontend wallet connection.
 */

/**
 * Tool to update the connected wallet address
 */
export const setWalletAddressTool = createTool({
  name: "set_wallet_address",
  description:
    "Set or update the wallet address in the session state when user provides it",
  schema: z.object({
    address: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/)
      .describe(
        "Ethereum wallet address (must start with 0x and be 42 characters)"
      ),
  }),
  fn: ({ address }, context) => {
    context.state.set("wallet.address", address);

    return {
      success: true,
      address,
      message: `Wallet address set to ${address}`,
    };
  },
});

/**
 * Tool to update the chain ID and name
 */
export const setChainTool = createTool({
  name: "set_chain",
  description:
    "Set the blockchain network (chain) the user wants to interact with",
  schema: z.object({
    chainId: z
      .number()
      .describe("Chain ID (e.g., 1 for Ethereum mainnet, 17000 for Holesky)"),
    chainName: z
      .string()
      .describe(
        "Human-readable chain name (e.g., 'Ethereum', 'Holesky', 'Polygon')"
      ),
  }),
  fn: ({ chainId, chainName }, context) => {
    context.state.set("wallet.chainId", chainId);
    context.state.set("wallet.chainName", chainName);

    return {
      success: true,
      chainId,
      chainName,
      message: `Chain set to ${chainName} (Chain ID: ${chainId})`,
    };
  },
});

/**
 * Tool to clear wallet state
 */
export const clearWalletStateTool = createTool({
  name: "clear_wallet_state",
  description: "Clear the wallet state (disconnect wallet)",
  schema: z.object({}),
  fn: (_, context) => {
    context.state.set("wallet.address", null);
    context.state.set("wallet.chainId", null);
    context.state.set("wallet.chainName", null);

    return {
      success: true,
      message: "Wallet state cleared",
    };
  },
});

/**
 * Tool to view current wallet state
 */
export const viewWalletStateTool = createTool({
  name: "view_wallet_state",
  description: "View the current wallet state (address and chain information)",
  schema: z.object({}),
  fn: (_, context) => {
    const address = context.state.get("wallet.address", null);
    const chainId = context.state.get("wallet.chainId", null);
    const chainName = context.state.get("wallet.chainName", null);

    return {
      wallet: {
        address,
        chainId,
        chainName,
      },
      connected: address !== null,
      message: address
        ? `Wallet ${address} connected on ${chainName || "Unknown"} (Chain ID: ${chainId || "Unknown"})`
        : "No wallet connected",
    };
  },
});

/**
 * Common chain configurations
 */
export const COMMON_CHAINS = {
  ethereum: { chainId: 1, chainName: "Ethereum Mainnet" },
  holesky: { chainId: 17000, chainName: "Holesky Testnet" },
  sepolia: { chainId: 11155111, chainName: "Sepolia Testnet" },
  polygon: { chainId: 137, chainName: "Polygon" },
  arbitrum: { chainId: 42161, chainName: "Arbitrum One" },
  optimism: { chainId: 10, chainName: "Optimism" },
  base: { chainId: 8453, chainName: "Base" },
};
