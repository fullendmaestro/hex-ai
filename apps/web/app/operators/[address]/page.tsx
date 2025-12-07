import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconUsers,
  IconBuilding,
} from "@tabler/icons-react";
import { Button } from "@hex-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hex-ai/ui/components/card";

interface OperatorDetailData {
  address: string;
  metadataName: string;
  metadataDescription?: string;
  metadataLogo?: string;
  metadataWebsite?: string;
  metadataX?: string;
  metadataDiscord?: string;
  totalStakers: number;
  totalAvs: number;
  maxApy: string;
  createdAtBlock: number;
  createdAt: string;
  updatedAt: string;
  shares?: any[];
}

async function getOperatorDetails(
  address: string
): Promise<OperatorDetailData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/operators/${address}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching operator details:", error);
    return null;
  }
}

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const operator = await getOperatorDetails(address);

  if (!operator) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          {operator.metadataLogo && (
            <img
              src={operator.metadataLogo}
              alt={operator.metadataName}
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{operator.metadataName}</h1>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              {operator.address}
            </p>
            <div className="flex flex-wrap gap-2">
              {operator.metadataWebsite && (
                <a
                  href={operator.metadataWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-4 w-4" />
                    Website
                  </Button>
                </a>
              )}
              {operator.metadataX && (
                <a
                  href={operator.metadataX}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-4 w-4" />X (Twitter)
                  </Button>
                </a>
              )}
              {operator.metadataDiscord && (
                <a
                  href={operator.metadataDiscord}
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
                href={`https://etherscan.io/address/${operator.address}`}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stakers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operator.totalStakers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AVS</CardTitle>
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operator.totalAvs.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max APY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(operator.maxApy) > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  {parseFloat(operator.maxApy).toFixed(2)}%
                </span>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {operator.metadataDescription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {operator.metadataDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At
              </p>
              <p className="text-sm">{formatDate(operator.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm">{formatDate(operator.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At Block
              </p>
              <p className="text-sm font-mono">
                {operator.createdAtBlock.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Shares
              </p>
              <p className="text-sm">{operator.shares?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
