"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";
import { Badge } from "@hex-ai/ui/components/badge";

interface RiskAnalysisSectionProps {
  riskAnalysis: {
    risk_level: string;
    overall_risk_score: number;
    audit_status: {
      audited: boolean;
      auditors: string[];
    };
    critical_risks: string[];
    mitigating_factors: string[];
    category_scores: {
      [key: string]: { score: number; weight: number; concerns: string[] };
    };
  };
}

export function RiskAnalysisSection({
  riskAnalysis,
}: RiskAnalysisSectionProps) {
  const [showAllRisks, setShowAllRisks] = useState(false);
  const [showAllFactors, setShowAllFactors] = useState(false);

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Risk Analysis</CardTitle>

        {/* Risk and Audit Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20">
            {riskAnalysis.risk_level || "High Risk"}
          </Badge>
          {riskAnalysis.audit_status.audited && (
            <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/20">
              Audited
            </Badge>
          )}
        </div>

        {/* Critical Risks & Mitigating Factors */}
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          {riskAnalysis.critical_risks.length > 0 && (
            <p>
              <strong className="text-foreground">Critical Risks:</strong>{" "}
              {showAllRisks
                ? riskAnalysis.critical_risks.join(", ")
                : riskAnalysis.critical_risks.slice(0, 3).join(", ")}
              {riskAnalysis.critical_risks.length > 3 && !showAllRisks && "..."}
              {riskAnalysis.critical_risks.length > 3 && (
                <button
                  onClick={() => setShowAllRisks(!showAllRisks)}
                  className="ml-2 text-xs text-blue-500 hover:underline"
                >
                  {showAllRisks ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          )}

          {riskAnalysis.mitigating_factors.length > 0 && (
            <p>
              <strong className="text-foreground">Mitigating Factors:</strong>{" "}
              {showAllFactors
                ? riskAnalysis.mitigating_factors.join(", ")
                : riskAnalysis.mitigating_factors.slice(0, 3).join(", ")}
              {riskAnalysis.mitigating_factors.length > 3 &&
                !showAllFactors &&
                "..."}
              {riskAnalysis.mitigating_factors.length > 3 && (
                <button
                  onClick={() => setShowAllFactors(!showAllFactors)}
                  className="ml-2 text-xs text-blue-500 hover:underline"
                >
                  {showAllFactors ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
          )}
        </div>

        {/* Category Scores Table */}
        {Object.keys(riskAnalysis.category_scores).length > 0 && (
          <div className="w-full mt-2">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2 pr-2 font-medium">Category</th>
                  <th className="py-2 pl-2 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(riskAnalysis.category_scores).map(
                  ([category, data]) => (
                    <tr key={category} className="text-foreground">
                      <td className="py-2 pr-2 capitalize">{category}</td>
                      <td className="py-2 pl-2 text-right font-semibold">
                        {data.score}/100
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
