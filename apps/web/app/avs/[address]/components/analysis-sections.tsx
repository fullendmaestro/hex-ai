"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";
import { IconThumbUp, IconAlertTriangle } from "@tabler/icons-react";

interface AnalysisSectionsProps {
  executiveSummary: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  detailedAnalysis: string;
}

export function AnalysisSections({
  executiveSummary,
  keyStrengths,
  keyWeaknesses,
  detailedAnalysis,
}: AnalysisSectionsProps) {
  const [showAllStrengths, setShowAllStrengths] = useState(false);
  const [showAllWeaknesses, setShowAllWeaknesses] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const strengthsToShow = showAllStrengths
    ? keyStrengths
    : keyStrengths.slice(0, 4);
  const weaknessesToShow = showAllWeaknesses
    ? keyWeaknesses
    : keyWeaknesses.slice(0, 4);

  return (
    <>
      {/* Executive Summary */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-[22px] font-bold">
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground leading-relaxed">
            {executiveSummary}
          </p>
        </CardContent>
      </Card>

      {/* Key Strengths & Weaknesses */}
      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1 border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <IconThumbUp className="h-5 w-5 text-green-500" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
              {strengthsToShow.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
            {keyStrengths.length > 4 && (
              <button
                onClick={() => setShowAllStrengths(!showAllStrengths)}
                className="mt-3 text-xs text-blue-500 hover:underline"
              >
                {showAllStrengths
                  ? "Show Less"
                  : `Show More (${keyStrengths.length - 4} more)`}
              </button>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
              Key Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-muted-foreground">
              {weaknessesToShow.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
            {keyWeaknesses.length > 4 && (
              <button
                onClick={() => setShowAllWeaknesses(!showAllWeaknesses)}
                className="mt-3 text-xs text-blue-500 hover:underline"
              >
                {showAllWeaknesses
                  ? "Show Less"
                  : `Show More (${keyWeaknesses.length - 4} more)`}
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-[22px] font-bold">
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-base text-muted-foreground leading-relaxed ${!showFullAnalysis ? "line-clamp-6" : ""}`}
          >
            {detailedAnalysis}
          </p>
          {detailedAnalysis.length > 300 && (
            <button
              onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              className="mt-3 text-xs text-blue-500 hover:underline"
            >
              {showFullAnalysis ? "Show Less" : "Show More"}
            </button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
