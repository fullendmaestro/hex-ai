import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getStakerAgent } from "./chat/stacker-agent/agent";
import { getOperatorAgent } from "./chat/operator-agent/agent";
import { getAVSAgent } from "./chat/avs-agent/agent";
import { getRewardsAgent } from "./chat/rewards-agent/agent";
import { getModel } from "../config/model";
import { getExecutionAgent } from "./chat/execution-agent/agent";
import { getAnalysisAgent } from "./chat/analysis-agent/agent";

/**
 * Creates and configures the EigenLayer coordinator agent.
 *
 * This agent serves as the main orchestrator that routes user requests to
 * specialized sub-agents based on the type of EigenLayer operation.
 * It coordinates between staking, operator, AVS, and rewards operations
 * across mainnet and testnet networks.
 *
 * @returns The fully constructed root agent instance ready to process requests
 */
export const getRootAgent = async () => {
  const stakerAgent = await getStakerAgent();
  const operatorAgent = await getOperatorAgent();
  const avsAgent = await getAVSAgent();
  const rewardsAgent = await getRewardsAgent();
  const executionAgent = await getExecutionAgent();
  const analysisAgent = await getAnalysisAgent();

  return AgentBuilder.create("hex_agents_coordinator")
    .withDescription(
      "Hex agents coordinator that delegates tasks to specialized agents for evm transactions, staking, operations, AVS management, and rewards."
    )
    .withInstruction(
      `Route requests to the appropriate specialized sub-agent. Use the execution agent for EVM transactions, the analysis agent for AVS/operator data and insights, and the staker/operator/AVS/rewards agents for their respective domains. Keep responses concise and use tools for data fetching.`
    )
    .withModel(getModel())
    .withSubAgents([
      executionAgent,
      stakerAgent,
      operatorAgent,
      avsAgent,
      rewardsAgent,
      analysisAgent,
    ])
    .build();
};
