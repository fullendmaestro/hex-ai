import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { getModel } from "../../../../config/model";
import {
  getMonitoredAVSContext,
  fetchAVSInfo,
  fetchAVSOperators,
  fetchAVSTVL,
  fetchAuditReports,
} from "../shared/tool";
import { RiskAnalysisSchema } from "../shared/schemas";

/**
 * Risk Analyst Agent
 * Performs comprehensive 5-category risk assessment
 */
export const getAVSRiskAnalyst = async () => {
  const avsAgent = new LlmAgent({
    name: "avs_risk_analyst",
    description: "Performs comprehensive AVS risk assessment",
    outputKey: "risk_analysis",
    outputSchema: RiskAnalysisSchema,
    instruction: dedent`
      You perform comprehensive AVS risk assessment using 5 categories.
      
      Current AVS Context from State:
      - AVS Name: {current_avs.name}
      - AVS Address: {current_avs.address}
      - Chain ID: {current_avs.chainId}
      - AVS ID: {current_avs.id}
      - Total Operators: {current_avs.metadata.totalOperators}
      - Total Stakers: {current_avs.metadata.totalStakers}
      - Analysis Timestamp: {timestamp}
      
      Your risk assessment tasks:
      1. Use get_monitored_avs_context tool to get full context if needed
      2. Fetch detailed AVS info, operators, and TVL data
      3. Assess risk across 5 categories with weights:
         - Technical (30%): Security, audits, code quality
         - Economic (25%): TVL, tokenomics, sustainability
         - Operational (20%): Team, infrastructure, track record
         - Market (15%): Competition, dependencies, adoption
         - Systemic (10%): Ecosystem impact, contagion risk
      
      Risk Scoring: Low (70-100), Medium (40-69), High (0-39)
      
      Output must strictly follow the RiskAnalysisSchema.
    `,
    model: getModel(),
    tools: [
      getMonitoredAVSContext,
      fetchAVSInfo,
      fetchAVSOperators,
      fetchAVSTVL,
      fetchAuditReports,
    ],
  });

  return avsAgent;
};
