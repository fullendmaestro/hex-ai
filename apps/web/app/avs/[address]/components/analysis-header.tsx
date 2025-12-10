"use client";

import Link from "next/link";
import {
  IconArrowLeft,
  IconExternalLink,
  IconFileTypePdf,
} from "@tabler/icons-react";
import { Button } from "@hex-ai/ui/components/button";
import { Badge } from "@hex-ai/ui/components/badge";

interface AnalysisHeaderProps {
  name: string;
  address: string;
  logo?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  riskScore?: "low" | "medium" | "high";
}

export function AnalysisHeader({
  name,
  address,
  logo,
  website,
  twitter,
  discord,
  riskScore,
}: AnalysisHeaderProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/home">
          <Button variant="ghost" size="sm">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            AVSs
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {logo && (
              <img
                src={logo}
                alt={name}
                className="h-16 w-16 rounded-lg object-cover border border-border"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">AVS Analysis: {name}</h1>
              <p className="text-sm text-muted-foreground mb-3">
                A comprehensive analysis of the {name} Actively Validated
                Service.
              </p>
              <div className="flex flex-wrap gap-2">
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <IconExternalLink className="mr-2 h-3 w-3" />
                      Website
                    </Button>
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <IconExternalLink className="mr-2 h-3 w-3" />X
                    </Button>
                  </a>
                )}
                {discord && (
                  <a href={discord} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <IconExternalLink className="mr-2 h-3 w-3" />
                      Discord
                    </Button>
                  </a>
                )}
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <IconExternalLink className="mr-2 h-3 w-3" />
                    Etherscan
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <IconFileTypePdf className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>
        </div>
      </div>
    </>
  );
}
