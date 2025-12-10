import { createTool } from "@iqai/adk";
import { z } from "zod";
import axios from "axios";

// ============================================================================
// Web Search Tools
// ============================================================================

export const webSearchTool = createTool({
  name: "web_search",
  description: "Search the web for AVS-related information, news, and updates",
  schema: z.object({
    query: z.string().describe("Search query"),
  }),
  fn: async ({ query }, { state }) => {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    if (!TAVILY_API_KEY) {
      return {
        results: [
          {
            title: `Mock: ${query}`,
            content: `Mock search result for: ${query}`,
            url: "https://example.com",
          },
        ],
      };
    }

    try {
      const response = await axios.post("https://api.tavily.com/search", {
        api_key: TAVILY_API_KEY,
        query,
        max_results: 3,
      });
      return { results: response.data.results || [] };
    } catch (error) {
      return { results: [], error: "Search failed" };
    }
  },
});

// ============================================================================
// DeFi Data Tools
// ============================================================================

export const defiLlamaProtocolTool = createTool({
  name: "defillama_protocol",
  description: "Fetch protocol TVL and metrics from DeFiLlama",
  schema: z.object({
    protocol: z.string().describe("Protocol slug (e.g., 'eigenlayer')"),
  }),
  fn: async ({ protocol }) => {
    try {
      const response = await axios.get(
        `https://api.llama.fi/protocol/${protocol}`
      );
      return {
        tvl: response.data.tvl,
        chainTvls: response.data.chainTvls,
        change_7d: response.data.change_7d,
        category: response.data.category,
      };
    } catch (error) {
      return { error: "Protocol not found" };
    }
  },
});

// ============================================================================
// Database Tools
// ============================================================================

export const getMonitoredAVSContext = createTool({
  name: "get_monitored_avs_context",
  description:
    "Get context from state about all monitored AVS including chain ID",
  schema: z.object({}),
  fn: async ({}, { state }) => {
    return {
      monitored_avs_list: state.get("monitored_avs_list") || [],
      current_avs: state.get("current_avs") || null,
      current_avs_address: state.get("current_avs_address"),
      current_avs_name: state.get("current_avs_name"),
      current_avs_chain_id: state.get("current_avs_chain_id") || 1,
      current_avs_id: state.get("current_avs_id"),
      timestamp: state.get("timestamp"),
    };
  },
});

export const saveAVSAnalysisTool = createTool({
  name: "save_avs_analysis",
  description: "Save AVS analysis to database (structured output)",
  schema: z.object({
    avs_id: z.string().describe("AVS database ID"),
    analysis: z.any().describe("Complete AVSAnalysisSummary object"),
  }),
  fn: async ({ avs_id, analysis }) => {
    console.log(`[TODO] Save analysis for AVS ${avs_id}`);
    return {
      success: true,
      avs_id,
      saved: true,
      message: "Analysis saved to database",
    };
  },
});

// ============================================================================
// Eigen Explorer API Tools (Placeholders)
// ============================================================================

export const fetchAVSInfo = createTool({
  name: "fetch_avs_info",
  description: "Fetch AVS info from Eigen Explorer API",
  schema: z.object({
    address: z.string().describe("AVS contract address"),
    chainId: z.number().describe("Chain ID (1=mainnet, 17000=holesky)"),
  }),
  fn: async ({ address, chainId }) => {
    // TODO: Implement Eigen Explorer API call
    // API endpoint pattern: https://api.eigenexplorer.com/api/v1/${chainId}/avs/${address}
    return { success: true, address, chainId, data: "AVS basic info" };
  },
});

export const fetchAVSOperators = createTool({
  name: "fetch_avs_operators",
  description: "Fetch AVS operators from Eigen Explorer API",
  schema: z.object({
    address: z.string().describe("AVS contract address"),
    chainId: z.number().describe("Chain ID (1=mainnet, 17000=holesky)"),
  }),
  fn: async ({ address, chainId }) => {
    // TODO: Implement Eigen Explorer API call
    // API endpoint pattern: https://api.eigenexplorer.com/api/v1/${chainId}/avs/${address}/operators
    return { success: true, address, chainId, operators: [] };
  },
});

export const fetchAVSTVL = createTool({
  name: "fetch_avs_tvl",
  description: "Fetch AVS total value locked",
  schema: z.object({
    address: z.string().describe("AVS contract address"),
    chainId: z.number().describe("Chain ID (1=mainnet, 17000=holesky)"),
  }),
  fn: async ({ address, chainId }) => {
    // TODO: Implement TVL calculation from Eigen Explorer or on-chain data
    // API endpoint pattern: https://api.eigenexplorer.com/api/v1/${chainId}/avs/${address}/tvl
    return { success: true, address, chainId, tvl: "0" };
  },
});

// ============================================================================
// Additional Tool Placeholders
// ============================================================================

// GitHub API Tool
export const fetchGitHubActivity = createTool({
  name: "fetch_github_activity",
  description: "Fetch GitHub repository activity and commits",
  schema: z.object({
    repo: z.string().describe("GitHub repo (owner/repo)"),
  }),
  fn: async ({ repo }) => {
    // TODO: Implement GitHub API integration
    return { repo, commits: 0, stars: 0, forks: 0 };
  },
});

// Twitter/X API Tool
export const fetchSocialSentiment = createTool({
  name: "fetch_social_sentiment",
  description: "Fetch social media sentiment and mentions",
  schema: z.object({
    query: z.string().describe("Search query"),
  }),
  fn: async ({ query }) => {
    // TODO: Implement Twitter/X API integration
    return { query, sentiment: "neutral", mentions: 0 };
  },
});

// Audit Reports Tool
export const fetchAuditReports = createTool({
  name: "fetch_audit_reports",
  description: "Fetch security audit reports",
  schema: z.object({
    project: z.string().describe("Project name"),
  }),
  fn: async ({ project }) => {
    // TODO: Implement audit report fetching
    return { project, audits: [] };
  },
});
