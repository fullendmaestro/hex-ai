import { z } from "zod";

/**
 * Structured Output Schemas for AVS Analysis Workflow
 *
 * These schemas enforce JSON validation and provide TypeScript type safety
 */

// ============================================================================
// Web Research Schema
// ============================================================================

export const WebResearchSchema = z.object({
  news_summary: z.string().describe("Summary of key news and updates"),
  tvl_data: z
    .object({
      current: z.string().describe("Current TVL value"),
      trend: z.string().describe("TVL trend (up/down/stable)"),
      change_7d: z.string().optional().describe("7-day change percentage"),
    })
    .describe("Total Value Locked data"),
  recent_developments: z
    .array(z.string())
    .describe("List of recent developments"),
  data_sources: z.array(z.string()).describe("List of data sources used"),
  github_activity: z
    .object({
      commits_30d: z.number().optional(),
      stars: z.number().optional(),
      forks: z.number().optional(),
    })
    .optional()
    .describe("GitHub activity metrics"),
});

export type WebResearch = z.infer<typeof WebResearchSchema>;

// ============================================================================
// Social Analysis Schema
// ============================================================================

export const SocialAnalysisSchema = z.object({
  sentiment: z
    .enum(["positive", "neutral", "negative"])
    .describe("Overall sentiment"),
  sentiment_score: z.number().min(0).max(100).describe("Sentiment score 0-100"),
  trust_level: z
    .enum(["high", "medium", "low"])
    .describe("Community trust level"),
  key_findings: z.array(z.string()).describe("Key findings from analysis"),
  red_flags: z.array(z.string()).describe("Red flags or concerns identified"),
  positive_signals: z.array(z.string()).describe("Positive community signals"),
  social_metrics: z
    .object({
      twitter_followers: z.number().optional(),
      discord_members: z.number().optional(),
      telegram_members: z.number().optional(),
    })
    .optional()
    .describe("Social media metrics"),
});

export type SocialAnalysis = z.infer<typeof SocialAnalysisSchema>;

// ============================================================================
// Risk Analysis Schema
// ============================================================================

export const CategoryScoreSchema = z.object({
  score: z.number().min(0).max(100).describe("Category risk score 0-100"),
  concerns: z.array(z.string()).describe("Specific concerns for this category"),
  weight: z.number().min(0).max(1).describe("Category weight in overall score"),
});

export const RiskAnalysisSchema = z.object({
  overall_risk_score: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall risk score 0-100"),
  risk_level: z
    .enum(["low", "medium", "high"])
    .describe("Risk level: Low (70-100), Medium (40-69), High (0-39)"),
  category_scores: z
    .object({
      technical: CategoryScoreSchema.describe(
        "Technical risk (30%): Security, audits, code quality"
      ),
      economic: CategoryScoreSchema.describe(
        "Economic risk (25%): TVL, tokenomics, sustainability"
      ),
      operational: CategoryScoreSchema.describe(
        "Operational risk (20%): Team, infrastructure, track record"
      ),
      market: CategoryScoreSchema.describe(
        "Market risk (15%): Competition, dependencies, adoption"
      ),
      systemic: CategoryScoreSchema.describe(
        "Systemic risk (10%): Ecosystem impact, contagion risk"
      ),
    })
    .describe("Breakdown by 5 risk categories"),
  critical_risks: z
    .array(z.string())
    .describe("Critical risks requiring immediate attention"),
  mitigating_factors: z
    .array(z.string())
    .describe("Factors that reduce overall risk"),
  audit_status: z
    .object({
      audited: z.boolean(),
      auditors: z.array(z.string()),
      audit_date: z.string().optional(),
    })
    .optional()
    .describe("Security audit information"),
});

export type RiskAnalysis = z.infer<typeof RiskAnalysisSchema>;

// ============================================================================
// Final Aggregated Summary Schema
// ============================================================================

export const AVSAnalysisSummarySchema = z.object({
  avs_address: z.string().describe("AVS contract address"),
  avs_name: z.string().describe("AVS name"),
  chain_id: z.number().describe("Chain ID (1=mainnet, 17000=holesky)"),
  timestamp: z.string().describe("Analysis timestamp (ISO 8601)"),
  executive_summary: z
    .string()
    .describe("2-3 sentence executive summary of the analysis"),
  key_strengths: z
    .array(z.string())
    .describe("Main strengths identified (3-5 items)"),
  key_weaknesses: z
    .array(z.string())
    .describe("Main weaknesses identified (3-5 items)"),
  risk_score: z.enum(["low", "medium", "high"]).describe("Final risk rating"),
  overall_score: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall health score 0-100"),
  recommendation: z
    .string()
    .describe("Overall recommendation for users and investors"),
  detailed_analysis: z
    .string()
    .describe("Comprehensive narrative analysis (500-1000 words)"),
  web_research_summary: WebResearchSchema.describe(
    "Web research component results"
  ),
  social_analysis_summary: SocialAnalysisSchema.describe(
    "Social analysis component results"
  ),
  risk_analysis_summary: RiskAnalysisSchema.describe(
    "Risk analysis component results"
  ),
  next_review_date: z
    .string()
    .optional()
    .describe("Recommended next review date"),
  confidence_score: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Confidence in the analysis (based on data availability)"),
});

export type AVSAnalysisSummary = z.infer<typeof AVSAnalysisSummarySchema>;

// ============================================================================
// Export Types for Database Storage
// ============================================================================

/**
 * The analysis field in the database will directly store AVSAnalysisSummary
 * No wrapper needed - the complete summary is stored as JSONB
 */
