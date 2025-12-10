"use server";

// Types for EigenLayer data
export interface AVSAnalysis {
  risk_score: "low" | "medium" | "high";
  overall_score: number;
  recommendation: string;
  executive_summary: string;
}

export interface AVSData {
  address: string;
  metadataName: string;
  metadataDescription?: string;
  metadataLogo?: string;
  metadataWebsite?: string;
  metadataDiscord?: string;
  metadataTelegram?: string;
  metadataX?: string;
  totalStakers: number;
  totalOperators: number;
  maxApy: string;
  createdAtBlock: number;
  updatedAtBlock: number;
  createdAt: string;
  updatedAt: string;
  shares?: any[];
  analysis?: AVSAnalysis | null;
  lastAnalyzedAt?: Date | null;
}

export interface OperatorData {
  address: string;
  metadataName?: string;
  metadataDescription?: string;
  metadataLogo?: string;
  metadataWebsite?: string;
  metadataDiscord?: string;
  metadataTelegram?: string;
  metadataX?: string;
  totalStakers: number;
  totalAvs: number;
  maxApy?: string;
  createdAtBlock: number;
  updatedAtBlock: number;
  createdAt: string;
  updatedAt: string;
  shares?: any[];
}

export async function fetchAVSData(): Promise<AVSData[]> {
  try {
    // Use absolute URLs for internal API routes
    // In production, use NEXT_PUBLIC_APP_URL, otherwise construct from headers
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // Fetch monitored AVS with analysis from database
    const monitoredResponse = await fetch(
      `${baseUrl}/api/monitored/avs?chainId=1`,
      {
        next: { revalidate: 60 },
        cache: "no-store",
      }
    );

    // Fetch EigenExplorer data for display metrics
    const eigenResponse = await fetch(`${baseUrl}/api/avs?chainId=1`, {
      next: { revalidate: 300 },
    });

    if (!eigenResponse.ok) {
      console.error("Failed to fetch AVS data from EigenExplorer API");
      return [];
    }

    const eigenResult = await eigenResponse.json();
    const eigenData = eigenResult?.data || [];

    // Get monitored AVS with analysis
    let monitoredData: any[] = [];
    if (monitoredResponse.ok) {
      const monitoredResult = await monitoredResponse.json();
      monitoredData = monitoredResult?.data || [];
    }

    // Merge EigenExplorer data with analysis data
    const mergedData = eigenData.map((eigenAVS: any) => {
      const monitored = monitoredData.find(
        (m) => m.address.toLowerCase() === eigenAVS.address.toLowerCase()
      );
      return {
        ...eigenAVS,
        analysis: monitored?.analysis || null,
        lastAnalyzedAt: monitored?.lastAnalyzedAt || null,
      };
    });

    console.log("AVS data fetched:", mergedData.length, "items");
    return mergedData;
  } catch (error) {
    console.error("Error fetching AVS data:", error);
    return [];
  }
}

export async function fetchOperatorsData(): Promise<OperatorData[]> {
  try {
    // Use absolute URLs for internal API routes
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const response = await fetch(`${baseUrl}/api/operators?chainId=1`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch operators data from API");
      return [];
    }

    const result = await response.json();
    const data = result?.data || [];
    console.log("Operators data fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("Error fetching operators data:", error);
    return [];
  }
}
