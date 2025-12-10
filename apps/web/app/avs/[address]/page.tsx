import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconUsers,
  IconServer,
  IconShieldCheck,
  IconAlertTriangle,
  IconTrendingUp,
  IconClock,
  IconActivity,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { Badge } from "@hex-ai/ui/components/badge";
import { Button } from "@hex-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";
import { Separator } from "@hex-ai/ui/components/separator";
import { Progress } from "@hex-ai/ui/components/progress";

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

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/home">
          <Button variant="ghost" className="mb-4">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-start gap-6">
          {avs.metadataLogo && (
            <img
              src={avs.metadataLogo}
              alt={data.name || avs.metadataName || "AVS"}
              className="h-24 w-24 rounded-full object-cover border-2 border-border"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">
                {data.name || avs.metadataName || "Unknown AVS"}
              </h1>
              {analysis && (
                <Badge
                  className={`${getRiskColor(analysis.risk_score)} font-semibold uppercase`}
                >
                  {analysis.risk_score} Risk
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              {data.address}
            </p>
            <div className="flex flex-wrap gap-2">
              {avs.metadataWebsite && (
                <a
                  href={avs.metadataWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    Website
                  </Button>
                </a>
              )}
              {avs.metadataX && (
                <a
                  href={avs.metadataX}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-4 w-4" />X (Twitter)
                  </Button>
                </a>
              )}
              {avs.metadataDiscord && (
                <a
                  href={avs.metadataDiscord}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    Discord
                  </Button>
                </a>
              )}
              <a
                href={`https://etherscan.io/address/${data.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  Etherscan
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {analysis ? (
        <>
          {/* Executive Summary */}
          <Card className="mb-6 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconActivity className="h-5 w-5" />
                AI Analysis Summary
              </CardTitle>
              <CardDescription>
                Last analyzed: {formatDate(data.lastAnalyzedAt!)} • Next review:{" "}
                {formatDate(analysis.next_review_date)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                {analysis.executive_summary}
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">
                  Recommendation:{" "}
                  <span className={getScoreColor(analysis.overall_score)}>
                    {analysis.recommendation}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Score
                </CardTitle>
                <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}
                >
                  {analysis.overall_score}/100
                </div>
                <Progress value={analysis.overall_score} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Confidence Level
                </CardTitle>
                <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${getScoreColor(analysis.confidence_score)}`}
                >
                  {analysis.confidence_score}%
                </div>
                <Progress value={analysis.confidence_score} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Risk Level
                </CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge
                  className={`text-lg px-4 py-2 ${getRiskColor(analysis.risk_score)} uppercase font-bold`}
                >
                  {analysis.risk_score}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {analysis.risk_analysis_summary?.audit_status.audited
                    ? "Audited"
                    : "Not Audited"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <IconCircleCheck className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.key_strengths.map((strength, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">
                        •
                      </span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <IconCircleX className="h-5 w-5" />
                  Key Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.key_weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-red-600 dark:text-red-400 mt-1">
                        •
                      </span>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Risk Analysis Details */}
          {analysis.risk_analysis_summary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Risk Analysis Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Scores */}
                {Object.entries(
                  analysis.risk_analysis_summary.category_scores
                ).map(([category, data]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold capitalize">
                        {category} Risk
                      </h4>
                      <span
                        className={`font-bold ${getScoreColor(data.score)}`}
                      >
                        {data.score}/100
                      </span>
                    </div>
                    <Progress value={data.score} />
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      {data.concerns.slice(0, 2).map((concern, idx) => (
                        <li key={idx} className="list-disc">
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Critical Risks */}
                {analysis.risk_analysis_summary.critical_risks.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
                      Critical Risks
                    </h4>
                    <ul className="space-y-2">
                      {analysis.risk_analysis_summary.critical_risks.map(
                        (risk, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex gap-2 items-start"
                          >
                            <IconAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span>{risk}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Mitigating Factors */}
                {analysis.risk_analysis_summary.mitigating_factors.length >
                  0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                      Mitigating Factors
                    </h4>
                    <ul className="space-y-2">
                      {analysis.risk_analysis_summary.mitigating_factors.map(
                        (factor, idx) => (
                          <li
                            key={idx}
                            className="text-sm flex gap-2 items-start"
                          >
                            <IconCircleCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{factor}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social Analysis */}
          {analysis.social_analysis_summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Social Sentiment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Sentiment Score
                      </span>
                      <span className="font-bold">
                        {analysis.social_analysis_summary.sentiment_score}/100
                      </span>
                    </div>
                    <Progress
                      value={analysis.social_analysis_summary.sentiment_score}
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Trust Level: </span>
                    <Badge className="ml-2">
                      {analysis.social_analysis_summary.trust_level}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Positive Signals
                    </h4>
                    <ul className="text-sm space-y-1">
                      {analysis.social_analysis_summary.positive_signals
                        .slice(0, 3)
                        .map((signal, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            • {signal}
                          </li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Red Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.social_analysis_summary.red_flags.map(
                      (flag, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <IconAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{flag}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Web Research Summary */}
          {analysis.web_research_summary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Web Research Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">News Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {analysis.web_research_summary.news_summary}
                  </p>
                </div>

                {analysis.web_research_summary.tvl_data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Current TVL
                      </p>
                      <p className="text-sm font-medium">
                        {analysis.web_research_summary.tvl_data.current}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Trend
                      </p>
                      <p className="text-sm font-medium">
                        {analysis.web_research_summary.tvl_data.trend}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        7D Change
                      </p>
                      <p className="text-sm font-medium">
                        {analysis.web_research_summary.tvl_data.change_7d}
                      </p>
                    </div>
                  </div>
                )}

                {analysis.web_research_summary.github_activity && (
                  <div>
                    <h4 className="font-semibold mb-2">GitHub Activity</h4>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Commits (30d):
                        </span>{" "}
                        <span className="font-medium">
                          {
                            analysis.web_research_summary.github_activity
                              .commits_30d
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Stars:</span>{" "}
                        <span className="font-medium">
                          {analysis.web_research_summary.github_activity.stars}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Forks:</span>{" "}
                        <span className="font-medium">
                          {analysis.web_research_summary.github_activity.forks}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {analysis.web_research_summary.recent_developments &&
                  analysis.web_research_summary.recent_developments.length >
                    0 && (
                    <div>
                      <h4 className="font-semibold mb-2">
                        Recent Developments
                      </h4>
                      <ul className="space-y-2">
                        {analysis.web_research_summary.recent_developments.map(
                          (dev, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground"
                            >
                              • {dev}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {analysis.detailed_analysis}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mb-8">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stakers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avs.totalStakers?.toLocaleString() || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Operators
            </CardTitle>
            <IconServer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avs.totalOperators?.toLocaleString() || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max APY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avs.maxApy && parseFloat(avs.maxApy) > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  {parseFloat(avs.maxApy).toFixed(2)}%
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {(data.description || avs.metadataDescription) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {data.description || avs.metadataDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </p>
              <p className="text-sm">
                {avs.createdAt ? formatDate(avs.createdAt) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm">
                {avs.updatedAt ? formatDate(avs.updatedAt) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At Block
              </p>
              <p className="text-sm font-mono">
                {avs.createdAtBlock?.toLocaleString() || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Chain ID
              </p>
              <p className="text-sm">
                {data.chainId === 1 ? "Mainnet" : `Chain ${data.chainId}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
