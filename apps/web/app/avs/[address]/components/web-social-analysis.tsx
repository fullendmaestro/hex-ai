"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface WebSocialAnalysisProps {
  webResearch?: {
    news_summary: string;
    tvl_data: { current: string; trend: string; change_7d: string };
    recent_developments: string[];
    github_activity: { commits_30d: number; stars: number; forks: number };
  };
  socialAnalysis?: {
    sentiment: string;
    sentiment_score: number;
    trust_level: string;
    key_findings: string[];
    positive_signals: string[];
    red_flags: string[];
  };
}

export function WebSocialAnalysis({
  webResearch,
  socialAnalysis,
}: WebSocialAnalysisProps) {
  const [showAllDevelopments, setShowAllDevelopments] = useState(false);

  if (!webResearch && !socialAnalysis) return null;

  const developmentsToShow = showAllDevelopments
    ? webResearch?.recent_developments || []
    : webResearch?.recent_developments.slice(0, 3) || [];

  return (
    <>
      {/* Web Research */}
      {webResearch && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Web Research</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-xs text-muted-foreground mb-1">TVL</div>
                <div className="text-sm font-semibold">
                  {webResearch.tvl_data.current}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  GitHub Activity
                </div>
                <div className="text-sm font-semibold">
                  {webResearch.github_activity.commits_30d > 0 ? "High" : "Low"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Trend</div>
                <div className="text-sm font-semibold">
                  {webResearch.tvl_data.trend}
                </div>
              </div>
            </div>

            {webResearch.recent_developments &&
              webResearch.recent_developments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Recent developments include the mainnet launch and
                    onboarding of the first wave of AVS partners. News coverage
                    is largely positive, focusing on innovation.
                  </h4>
                  <ul className="space-y-2 mt-2">
                    {developmentsToShow.map((dev, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {dev}
                      </li>
                    ))}
                  </ul>
                  {webResearch.recent_developments.length > 3 && (
                    <button
                      onClick={() =>
                        setShowAllDevelopments(!showAllDevelopments)
                      }
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {showAllDevelopments ? (
                        <>
                          Show Less <IconChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Show More (
                          {webResearch.recent_developments.length - 3} more){" "}
                          <IconChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Social Analysis */}
      {socialAnalysis && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Social Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Community sentiment is overwhelmingly positive, with high
              engagement on Twitter and Discord. Key discussions revolve around
              potential yields and the security implications of restaking.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
