import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { getEvmMcpTools } from "./tools";

/**
 * Creates and configures an execution agent specialized in executing blockchain transactions.
 *
 * This agent is equipped with tools to perform blockchain operations.
 * It uses the Gemini 2.5 Flash model for natural conversation flow and
 * can access execution-related tools for blockchain interactions.
 *
 * @returns A configured LlmAgent instance specialized for blockchain execution
 */
export const getExecutionAgent = async () => {
  const tools = await getEvmMcpTools();

  const executionAgent = new LlmAgent({
    name: "execution_agent",
    description: "executes blockchain transactions",
    model: env.LLM_MODEL,
    tools: [...tools],
  });

  return executionAgent;
};
