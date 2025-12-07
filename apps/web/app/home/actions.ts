"use server";

// Types for EigenLayer data
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/avs?chainId=1`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Failed to fetch AVS data from API");
      return [];
    }

    const result = await response.json();
    const data = result?.data || [];
    console.log("AVS data fetched:", data.length, "items");
    return data;
  } catch (error) {
    console.error("Error fetching AVS data:", error);
    return [];
  }
}

export async function fetchOperatorsData(): Promise<OperatorData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
