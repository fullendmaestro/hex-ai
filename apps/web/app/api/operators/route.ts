import { NextResponse } from "next/server";
import {
  getMonitoredOperatorsByChain,
  getAllMonitoredOperators,
} from "@hex-ai/database/queries";
import { EIGENEXPLORER_API_URL } from "@/config/api";
import { EIGENEXPLORER_API_KEY } from "@/config/key";

const headers = {
  "Content-Type": "application/json",
  ...(EIGENEXPLORER_API_KEY && { "x-api-token": EIGENEXPLORER_API_KEY }),
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId");

    // Get monitored operators from database
    const monitoredOperators = chainId
      ? await getMonitoredOperatorsByChain(parseInt(chainId))
      : await getAllMonitoredOperators();

    if (monitoredOperators.length === 0) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    // Extract addresses
    const addresses = monitoredOperators.map((op) => op.address);

    // Fetch data from EigenExplorer API for all operators
    const response = await fetch(
      `${EIGENEXPLORER_API_URL}/operators?withTvl=false&withCuratedMetadata=false&searchMode=contains&skip=0&take=100`,
      {
        headers,
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch operators data from EigenExplorer");
      return NextResponse.json(
        { error: "Failed to fetch operators data" },
        { status: response.status }
      );
    }

    const result = await response.json();
    const allOperatorsData = result?.data || [];

    // Filter to only monitored operators
    const filteredData = allOperatorsData.filter((op: any) =>
      addresses.includes(op.address.toLowerCase())
    );

    return NextResponse.json({
      data: filteredData,
      meta: {
        total: filteredData.length,
        monitored: monitoredOperators.length,
      },
    });
  } catch (error) {
    console.error("Error in operators API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
