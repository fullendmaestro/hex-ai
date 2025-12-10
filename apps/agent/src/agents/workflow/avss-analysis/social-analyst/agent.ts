import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { getModel } from "../../../../config/model";
import {
  webSearchTool,
  getMonitoredAVSContext,
  fetchSocialSentiment,
} from "../shared/tool";
import { SocialAnalysisSchema } from "../shared/schemas";

/**
 * Social Analyst Agent
 * Analyzes community sentiment and social signals
 */
export const getAVSSocialAnalyst = async () => {
  const avsAgent = new LlmAgent({
    name: "avs_social_analyst",
    description: "Analyzes AVS community sentiment and social presence",
    outputKey: "social_analysis",
    outputSchema: SocialAnalysisSchema,
    instruction: dedent`
      You analyze AVS social sentiment and community perception.
      
      Current AVS Context from State:
      - AVS Name: {current_avs.name}
      - AVS Address: {current_avs.address}
      - Chain ID: {current_avs.chainId}
      - AVS ID: {current_avs.id}
      - Analysis Timestamp: {timestamp}
      
      Your analysis tasks:
      1. Use get_monitored_avs_context tool to get full context if needed
      2. Search for community feedback and social mentions about {current_avs.name}
      3. Assess trust signals and red flags
      4. Analyze social presence and community engagement
      
      Output must strictly follow the SocialAnalysisSchema.
    `,
    model: getModel(),
    tools: [webSearchTool, getMonitoredAVSContext, fetchSocialSentiment],
  });

  return avsAgent;
};
