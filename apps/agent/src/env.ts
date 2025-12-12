import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema definition for the simple agent.
 *
 * Defines and validates required environment variables including:
 * - DEBUG: Optional debug mode flag (defaults to "false")
 * - GOOGLE_API_KEY: Required API key for Google/Gemini model access
 */
export const envSchema = z.object({
  ADK_DEBUG: z.coerce.boolean().default(false),
  GOOGLE_API_KEY: z.string(),
  LLM_MODEL: z.string().default("gemini-2.5-flash"),
  AZURE_OPENAI_API_KEY: z.string(),
  AZURE_OPENAI_RESOURCE_NAME: z.string(),
  AZURE_OPENAI_API_VERSION: z.string(),
  AZURE_DEPLOYMENT_NAME: z.string(),
  WEB_APP_URL: z.string().url(),
});

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env);
