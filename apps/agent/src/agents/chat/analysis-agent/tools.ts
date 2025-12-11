import { createTool } from "@iqai/adk";
import * as z from "zod";
import {
  getStoredAVSByChain,
  getMonitoredAVSByAddress,
} from "@hex-ai/database/queries";
import {
  getMonitoredOperatorsByChain,
  getMonitoredOperatorByAddress,
} from "@hex-ai/database/queries";

export const fetchMonitoredAVSByChainTool = createTool({
  name: "fetch_monitored_avs_by_chain",
  description:
    "Fetch monitored AVS entries for a given chain from the database",
  schema: z.object({
    chainId: z.number().describe("Chain ID (e.g., 1 for mainnet)"),
  }),
  fn: async ({ chainId }) => {
    try {
      const rows = await getStoredAVSByChain(chainId);
      return { success: true, count: rows.length, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredAVSByAddressTool = createTool({
  name: "fetch_monitored_avs_by_address",
  description: "Fetch monitored AVS by address from the database",
  schema: z.object({
    address: z.string().describe("AVS contract address"),
  }),
  fn: async ({ address }) => {
    try {
      const rows = await getMonitoredAVSByAddress(address);
      return { success: true, count: rows.length, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredOperatorsByChainTool = createTool({
  name: "fetch_monitored_operators_by_chain",
  description: "Fetch monitored operators for a chain from the database",
  schema: z.object({
    chainId: z.number().describe("Chain ID (e.g., 1 for mainnet)"),
  }),
  fn: async ({ chainId }) => {
    try {
      const rows = await getMonitoredOperatorsByChain(chainId);
      return { success: true, count: rows.length, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredOperatorByAddressTool = createTool({
  name: "fetch_monitored_operator_by_address",
  description: "Fetch a monitored operator by address from the database",
  schema: z.object({
    address: z.string().describe("Operator address"),
  }),
  fn: async ({ address }) => {
    try {
      const rows = await getMonitoredOperatorByAddress(address);
      return { success: true, count: rows.length, data: rows };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});
