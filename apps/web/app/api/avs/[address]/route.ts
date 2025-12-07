import { NextResponse } from "next/server";
import { EIGENEXPLORER_API_URL } from "@/config/api";
import { EIGENEXPLORER_API_KEY } from "@/config/key";

const headers = {
  "Content-Type": "application/json",
  ...(EIGENEXPLORER_API_KEY && { "x-api-token": EIGENEXPLORER_API_KEY }),
};

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Fetch AVS details from EigenExplorer
    const response = await fetch(`${EIGENEXPLORER_API_URL}/avs/${address}`, {
      headers,
      next: { revalidate: 60 }, // Revalidate every minute for detail pages
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "AVS not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to fetch AVS details" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AVS detail API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
