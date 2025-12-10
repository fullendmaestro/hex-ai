import { notFound } from "next/navigation";
import { AnalysisHeader } from "./components/analysis-header";
import { ScoreCards } from "./components/score-cards";
import { AnalysisSections } from "./components/analysis-sections";
import { RiskAnalysisSection } from "./components/risk-analysis-section";
import { WebSocialAnalysis } from "./components/web-social-analysis";
import { IconClock } from "@tabler/icons-react";
import { Card, CardContent } from "@hex-ai/ui/components/card";

interface AVSAnalysis {
  avs_name: string;
  avs_address: string;
  chain_id: number;
  timestamp: string;
  risk_score: "low" | "medium" | "high";
  overall_score: number;
  confidence_score: number;
  executive_summary: string;
  key_strengths: string[];
  key_weaknesses: string[];
  recommendation: string;
  detailed_analysis: string;
  next_review_date: string;
  web_research_summary?: {
    news_summary: string;
    tvl_data: {
      current: string;
      trend: string;
      change_7d: string;
    };
    recent_developments: string[];
    data_sources: string[];
    github_activity: {
      commits_30d: number;
      stars: number;
      forks: number;
    };
  };
  social_analysis_summary?: {
    sentiment: string;
    sentiment_score: number;
    trust_level: string;
    key_findings: string[];
    positive_signals: string[];
    red_flags: string[];
  };
  risk_analysis_summary?: {
    risk_level: string;
    overall_risk_score: number;
    audit_status: {
      audited: boolean;
      auditors: string[];
    };
    critical_risks: string[];
    mitigating_factors: string[];
    category_scores: {
      technical?: { score: number; weight: number; concerns: string[] };
      economic?: { score: number; weight: number; concerns: string[] };
      operational?: { score: number; weight: number; concerns: string[] };
      market?: { score: number; weight: number; concerns: string[] };
      systemic?: { score: number; weight: number; concerns: string[] };
    };
  };
}

interface MonitoredAVSData {
  id: string;
  address: string;
  chainId: number;
  name: string | null;
  description: string | null;
  isActive: boolean;
  analysis: AVSAnalysis | null;
  lastAnalyzedAt: Date | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  eigenData?: any;
}

async function getMonitoredAVSDetails(
  address: string
): Promise<MonitoredAVSData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/monitored/avs/${address}`, {
      next: { revalidate: 60 },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching monitored AVS details:", error);
    return null;
  }
}

export default async function AVSDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const data = await getMonitoredAVSDetails(address);

  if (!data) {
    notFound();
  }

  const avs = data.eigenData || {};
  const analysis = data.analysis;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <AnalysisHeader
        name={data.name || avs.metadataName || "Unknown AVS"}
        address={data.address}
        logo={avs.metadataLogo}
        website={avs.metadataWebsite}
        twitter={avs.metadataX}
        discord={avs.metadataDiscord}
        riskScore={analysis?.risk_score}
      />

      {analysis ? (
        <>
          <ScoreCards
            riskScore={analysis.risk_score}
            overallScore={analysis.overall_score}
            confidenceScore={analysis.confidence_score}
            recommendation={analysis.recommendation.split("—")[0].trim()}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - 2 columns */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <AnalysisSections
                executiveSummary={analysis.executive_summary}
                keyStrengths={analysis.key_strengths}
                keyWeaknesses={analysis.key_weaknesses}
                detailedAnalysis={analysis.detailed_analysis}
              />
            </div>

            {/* Right side - 1 column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {analysis.risk_analysis_summary && (
                <RiskAnalysisSection
                  riskAnalysis={analysis.risk_analysis_summary}
                />
              )}

              <WebSocialAnalysis
                webResearch={analysis.web_research_summary}
                socialAnalysis={analysis.social_analysis_summary}
              />
            </div>
          </div>
        </>
      ) : (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <IconClock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Analysis Not Available
            </h3>
            <p className="text-muted-foreground">
              This AVS has not been analyzed yet. Analysis will be available
              after the next workflow run.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
