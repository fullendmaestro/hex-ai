import { NextResponse } from "next/server";
import {
  getMonitoredAVSByChain,
  getAllMonitoredAVS,
} from "@hex-ai/database/queries";

// Mark this route as dynamic to prevent static optimization
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId");

    // Get monitored AVS from database with analysis field
    const monitoredAVS = chainId
      ? await getMonitoredAVSByChain(parseInt(chainId))
      : await getAllMonitoredAVS();

    return NextResponse.json({
      data: monitoredAVS,
      meta: {
        total: monitoredAVS.length,
      },
    });
  } catch (error) {
    console.error("Error in monitored AVS API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
