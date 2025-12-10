import { LlmAgent } from "@iqai/adk";

export const getOperatorsAnalysisWorkflow = async () => {
  const avsAgent = new LlmAgent({
    name: "",
    description: "",
  });

  return avsAgent;
};
