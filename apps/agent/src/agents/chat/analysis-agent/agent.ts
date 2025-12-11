import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { env } from "../../../env";
import { getEvmMcpTools } from "../../shared/evm-tools";
import { getModel } from "../../../config/model";
import {
  fetchMonitoredAVSByChainTool,
  fetchMonitoredAVSByAddressTool,
  fetchMonitoredOperatorsByChainTool,
  fetchMonitoredOperatorByAddressTool,
} from "./tools";

export const getAnalysisAgent = async () => {
  const tools = await getEvmMcpTools();

  const analysisAgent = new LlmAgent({
    name: "analysis_agent",
    description:
      "Analyze EigenLayer AVS and operator metadata from the database",
    instruction: `Provide concise analysis and fetch requested AVS/operator records from the database using the available tools. Use the database tools for authoritative data and external APIs only when needed.`,
    model: getModel(),
    tools: [
      fetchMonitoredAVSByChainTool,
      fetchMonitoredAVSByAddressTool,
      fetchMonitoredOperatorsByChainTool,
      fetchMonitoredOperatorByAddressTool,
      ...tools,
    ],
  });

  return analysisAgent;
};
