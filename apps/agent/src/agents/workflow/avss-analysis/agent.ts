import { AVS } from "@hex-ai/database/queries";

import { AgentBuilder } from "@iqai/adk";
import { getModel } from "../../../config/model";
import { getAVSWebResearcher } from "./web-researcher/agent";
import { getAVSSocialAnalyst } from "./social-analyst/agent";
import { getAVSRiskAnalyst } from "./risk-analyst/agent";
import { getAVSAggregator } from "./aggregator/agent";
import type { AVSAnalysisSummary } from "./shared/schemas";

/**
 * AVS Analysis Workflow
 *
 * Orchestrates multi-agent analysis of a single AVS:
 * 1. Parallel research (web + social + risk)
 * 2. Aggregate results into final summary
 * 3. Returns structured AVSAnalysisSummary
 *
 * Note: This workflow runs for each monitored AVS
 */
export const getAVSAnalysisWorkflow = async (
  monitoredAVSs: AVS[],
  currentAVS: AVS
) => {
  const webResearcher = await getAVSWebResearcher();
  const socialAnalyst = await getAVSSocialAnalyst();
  const riskAnalyst = await getAVSRiskAnalyst();
  const aggregator = await getAVSAggregator();

  return AgentBuilder.create("avs_analysis_workflow")
    .asSequential([
      // Phase 1: Parallel analysis
      await AgentBuilder.create("parallel_analysis")
        .asParallel([webResearcher, socialAnalyst, riskAnalyst])
        .build()
        .then((built) => built.agent),

      // Phase 2: Aggregate results
      aggregator,
    ])
    .withQuickSession({
      state: {
        monitored_avs_list: monitoredAVSs,
        current_avs: currentAVS,
        timestamp: new Date().toISOString(),
      },
    })
    .build();
};

/**
 * Type-safe wrapper for AVS Analysis Workflow
 * Returns properly typed result
 */
export type AVSAnalysisWorkflowResult = AVSAnalysisSummary;
