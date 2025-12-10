import { NextResponse } from "next/server";
import { getMonitoredAVSByAddress } from "@hex-ai/database/queries";
import { EIGENEXPLORER_API_URL } from "@/config/api";
import { EIGENEXPLORER_API_KEY } from "@/config/key";

const headers = {
  "Content-Type": "application/json",
  ...(EIGENEXPLORER_API_KEY && { "x-api-token": EIGENEXPLORER_API_KEY }),
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Get monitored AVS from database (includes analysis)
    const [dbAVS] = await getMonitoredAVSByAddress(address.toLowerCase());

    if (!dbAVS) {
      return NextResponse.json(
        { error: "AVS not found in monitored list" },
        { status: 404 }
      );
    }

    // Fetch additional AVS details from EigenExplorer
    const response = await fetch(`${EIGENEXPLORER_API_URL}/avs/${address}`, {
      headers,
      next: { revalidate: 60 },
    });

    let eigenData = null;
    if (response.ok) {
      eigenData = await response.json();
    }

    // Merge database data (with analysis) and EigenExplorer data
    return NextResponse.json({
      ...dbAVS,
      eigenData,
    });
  } catch (error) {
    console.error("Error in monitored AVS detail API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
