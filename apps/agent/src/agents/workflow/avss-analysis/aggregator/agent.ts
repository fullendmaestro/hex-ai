import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { getModel } from "../../../../config/model";
import { AVSAnalysisSummarySchema } from "../shared/schemas";

/**
 * Aggregator Agent
 * Synthesizes all analysis results into final summary
 * NOTE: No tools because outputSchema is used
 */
export const getAVSAggregator = async () => {
  const avsAgent = new LlmAgent({
    name: "avs_workflow_aggregator",
    description: "Synthesizes all AVS analysis results",
    outputKey: "final_summary",
    outputSchema: AVSAnalysisSummarySchema,
    instruction: dedent`
      You synthesize all analysis results into a comprehensive summary.
      
      Current AVS Context from State:
      - AVS Name: {current_avs.name}
      - AVS Address: {current_avs.address}
      - Chain ID: {current_avs.chainId}
      - AVS ID: {current_avs.id}
      - Is Active: {current_avs.isActive}
      - Analysis Timestamp: {timestamp}
      
      Analysis Results from Previous Agents:
      - Web Research: {web_research}
      - Social Analysis: {social_analysis}
      - Risk Analysis: {risk_analysis}
      
      Generate comprehensive summary:
      1. Use {current_avs.address}, {current_avs.name}, {current_avs.chainId} for identification
      2. Create executive summary (2-3 sentences) synthesizing all findings
      3. Extract key strengths and weaknesses (3-5 each) from all analysis results
      4. Calculate overall_score (0-100) based on:
         - Web research findings (quality, TVL, metrics)
         - Social sentiment and community trust
         - Risk analysis scores across all categories
      5. Determine final risk_score and recommendation (BUY/HOLD/SELL/AVOID)
      6. Write detailed_analysis (500-1000 words) covering:
         - Technical capabilities and security
         - Economic sustainability and metrics
         - Community perception and social signals
         - Overall risk profile and concerns
      7. Include all sub-analysis summaries with proper attribution
      
      Output must strictly follow the AVSAnalysisSummarySchema.
    `,
    model: getModel(),
  });

  return avsAgent;
};
