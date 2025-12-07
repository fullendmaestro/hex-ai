import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@hex-ai/ui/components/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";

interface SummaryCardsProps {
  totalAVS: number;
  totalOperators: number;
  totalStakers: number;
  avgApy: number;
}

export function SummaryCards({
  totalAVS,
  totalOperators,
  totalStakers,
  avgApy,
}: SummaryCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total AVS</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAVS.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Operators</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOperators.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Stakers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalStakers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Growing
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average APY</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {avgApy > 0 ? `${avgApy.toFixed(2)}%` : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {avgApy > 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {avgApy > 0 ? "Available" : "N/A"}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
