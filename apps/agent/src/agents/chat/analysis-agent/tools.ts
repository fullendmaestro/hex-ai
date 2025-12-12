import { createTool } from "@iqai/adk";
import * as z from "zod";
import { env } from "../../../env";

export const fetchMonitoredAVSByChainTool = createTool({
  name: "fetch_monitored_avs_by_chain",
  description: "Fetch monitored AVS entries for a given chain from the web API",
  schema: z.object({
    chainId: z.number().describe("Chain ID (e.g., 1 for mainnet)"),
  }),
  fn: async ({ chainId }) => {
    try {
      const url = new URL(`${env.WEB_APP_URL}/api/monitored/avs`);
      url.searchParams.set("chainId", chainId.toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result: any = await response.json();
      return {
        success: true,
        count: result.meta?.total || result.data?.length || 0,
        data: result.data,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredAVSByAddressTool = createTool({
  name: "fetch_monitored_avs_by_address",
  description: "Fetch monitored AVS by address from the web API",
  schema: z.object({
    address: z.string().describe("AVS contract address"),
  }),
  fn: async ({ address }) => {
    try {
      const url = `${env.WEB_APP_URL}/api/monitored/avs/${address.toLowerCase()}`;

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return { success: true, count: 0, data: [] };
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      return { success: true, count: 1, data: [result] };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredOperatorsByChainTool = createTool({
  name: "fetch_monitored_operators_by_chain",
  description: "Fetch monitored operators for a chain from the web API",
  schema: z.object({
    chainId: z.number().describe("Chain ID (e.g., 1 for mainnet)"),
  }),
  fn: async ({ chainId }) => {
    try {
      const url = new URL(`${env.WEB_APP_URL}/api/operators`);
      url.searchParams.set("chainId", chainId.toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result: any = await response.json();
      return {
        success: true,
        count: result.meta?.total || result.data?.length || 0,
        data: result.data,
      };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});

export const fetchMonitoredOperatorByAddressTool = createTool({
  name: "fetch_monitored_operator_by_address",
  description: "Fetch a monitored operator by address from the web API",
  schema: z.object({
    address: z.string().describe("Operator address"),
  }),
  fn: async ({ address }) => {
    try {
      const url = `${env.WEB_APP_URL}/api/operators/${address.toLowerCase()}`;

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return { success: true, count: 0, data: [] };
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      return { success: true, count: 1, data: [result] };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  },
});
