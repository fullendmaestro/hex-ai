import { NextResponse } from "next/server";
import {
  getMonitoredAVSByChain,
  getAllMonitoredAVS,
} from "@hex-ai/database/queries";
import { EIGENEXPLORER_API_URL } from "@/config/api";
import { EIGENEXPLORER_API_KEY } from "@/config/key";

// Mark this route as dynamic to prevent static optimization
export const dynamic = "force-dynamic";

const headers = {
  "Content-Type": "application/json",
  ...(EIGENEXPLORER_API_KEY && { "x-api-token": EIGENEXPLORER_API_KEY }),
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId");

    // Get monitored AVS from database
    const monitoredAVS = chainId
      ? await getMonitoredAVSByChain(parseInt(chainId))
      : await getAllMonitoredAVS();

    if (monitoredAVS.length === 0) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    // Extract addresses
    const addresses = monitoredAVS.map((avs) => avs.address);

    // Fetch data from EigenExplorer API for all monitored AVS
    const response = await fetch(
      `${EIGENEXPLORER_API_URL}/avs?withTvl=false&withCuratedMetadata=false&searchMode=contains&skip=0&take=100`,
      {
        headers,
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch AVS data from EigenExplorer");
      return NextResponse.json(
        { error: "Failed to fetch AVS data" },
        { status: response.status }
      );
    }

    const result = await response.json();
    const allAVSData = result?.data || [];

    // Filter to only monitored AVS
    const filteredData = allAVSData.filter((avs: any) =>
      addresses.includes(avs.address.toLowerCase())
    );

    return NextResponse.json({
      data: filteredData,
      meta: {
        total: filteredData.length,
        monitored: monitoredAVS.length,
      },
    });
  } catch (error) {
    console.error("Error in AVS API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
