import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";
import { Badge } from "@hex-ai/ui/components/badge";

interface ScoreCardsProps {
  riskScore: "low" | "medium" | "high";
  overallScore: number;
  confidenceScore: number;
  recommendation: string;
}

export function ScoreCards({
  riskScore,
  overallScore,
  confidenceScore,
  recommendation,
}: ScoreCardsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-600 dark:bg-green-500 text-white";
      case "medium":
        return "bg-yellow-600 dark:bg-yellow-500 text-white";
      case "high":
        return "bg-red-600 dark:bg-red-500 text-white";
      default:
        return "bg-gray-600 dark:bg-gray-500 text-white";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-card border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Risk Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Confidence Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{confidenceScore}%</div>
        </CardContent>
      </Card>

      <Card className="bg-blue-600 dark:bg-blue-500 text-white border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-white/90">
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recommendation}</div>
        </CardContent>
      </Card>
    </div>
  );
}
