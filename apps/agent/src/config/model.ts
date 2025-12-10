import { createAzure } from "@ai-sdk/azure";
import type { LanguageModelV2 } from "@ai-sdk/provider";
import { env } from "../env";

/**
 * Creates and returns an Azure OpenAI model instance.
 *
 * Configures Azure OpenAI with credentials from environment variables and
 * returns a model instance using the specified deployment name.
 *
 * @returns Azure OpenAI model instance configured with the deployment
 */
export const getModel = (): LanguageModelV2 | string => {
  // Configure Azure OpenAI
  const azure = createAzure({
    resourceName: env.AZURE_OPENAI_RESOURCE_NAME,
    apiKey: env.AZURE_OPENAI_API_KEY,
  });

  // Return model with deployment name
  //   return env.LLM_MODEL;
  return azure(env.AZURE_DEPLOYMENT_NAME);
};
