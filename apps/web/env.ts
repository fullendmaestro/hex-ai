import { config } from "dotenv";
import { z } from "zod";

config();

/**
 * Environment variable schema definition for the web app.
 *
 * Defines and validates required environment variables including:
 * - ADK_DEBUG: Optional debug mode flag (defaults to "false")
 * - GOOGLE_API_KEY: Required API key for Google/Gemini model access
 * - LLM_MODEL: LLM model to use (defaults to "gemini-2.5-flash")
 */
/**
export const envSchema = z.object({
  NEXT_PUBLIC_AGENT_API_URL: z
    .string()
    .url()
    .describe("Base URL for the Agent API")
    .default("http://localhost:8042"),
  EIGENEXPLORER_API_KEY: z
    .string()
    .describe("API key for EigenExplorer access"),
});
 */
/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
// export const env = envSchema.parse(process.env);
