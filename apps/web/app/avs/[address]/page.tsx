import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconUsers,
  IconServer,
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

interface AVSDetailData {
  address: string;
  metadataName: string;
  metadataDescription?: string;
  metadataLogo?: string;
  metadataWebsite?: string;
  metadataX?: string;
  metadataDiscord?: string;
  metadataTelegram?: string;
  totalStakers: number;
  totalOperators: number;
  maxApy: string;
  createdAtBlock: number;
  createdAt: string;
  updatedAt: string;
  shares?: any[];
}

async function getAVSDetails(address: string): Promise<AVSDetailData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/avs/${address}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching AVS details:", error);
    return null;
  }
}

export default async function AVSDetailPage({
  params,
}: {
  params: { address: string };
}) {
  const avs = await getAVSDetails(params.address);

  if (!avs) {
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
          {avs.metadataLogo && (
            <img
              src={avs.metadataLogo}
              alt={avs.metadataName}
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{avs.metadataName}</h1>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              {avs.address}
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
                href={`https://etherscan.io/address/${avs.address}`}
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
              {avs.totalStakers.toLocaleString()}
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
              {avs.totalOperators.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max APY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(avs.maxApy) > 0 ? (
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
      {avs.metadataDescription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {avs.metadataDescription}
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
              <p className="text-sm">{formatDate(avs.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-sm">{formatDate(avs.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created At Block
              </p>
              <p className="text-sm font-mono">
                {avs.createdAtBlock.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Shares
              </p>
              <p className="text-sm">{avs.shares?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
