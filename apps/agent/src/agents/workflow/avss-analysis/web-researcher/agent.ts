import { LlmAgent, GoogleSearch, HttpRequestTool } from "@iqai/adk";
import dedent from "dedent";
import { getModel } from "../../../../config/model";
import {
  webSearchTool,
  defiLlamaProtocolTool,
  getMonitoredAVSContext,
  fetchGitHubActivity,
} from "../shared/tool";
import { WebResearchSchema } from "../shared/schemas";

/**
 * Web Researcher Agent
 * Gathers web data, news, and DeFi metrics for AVS
 */
export const getAVSWebResearcher = async () => {
  const avsAgent = new LlmAgent({
    name: "avs_web_researcher",
    description: "Researches AVS from web sources and DeFi data",
    outputKey: "web_research",
    outputSchema: WebResearchSchema,
    instruction: dedent`
      You research AVS from web sources and DeFi protocols.
      
      Current AVS Context from State:
      - AVS Name: {current_avs.name}
      - AVS Address: {current_avs.address}
      - Chain ID: {current_avs.chainId}
      - AVS ID: {current_avs.id}
      - Analysis Timestamp: {timestamp}
      
      Your research tasks:
      1. Use get_monitored_avs_context tool to get full context if needed
      2. Perform 2-3 web searches for:
         - "{current_avs.name} EigenLayer news updates"
         - "{current_avs.name} TVL metrics performance"
         - "{current_avs.name} security audit"
      3. Fetch DeFi data if available (try common protocol names)
      4. Optionally check GitHub activity
      
      Output must strictly follow the WebResearchSchema.
    `,
    model: getModel(),
    tools: [
      new GoogleSearch(),
      new HttpRequestTool(),
      // webSearchTool,
      // defiLlamaProtocolTool,
      // getMonitoredAVSContext,
      fetchGitHubActivity,
    ],
  });

  return avsAgent;
};
