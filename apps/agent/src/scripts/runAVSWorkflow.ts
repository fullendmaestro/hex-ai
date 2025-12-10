import {
  getStoredAVSByChain,
  updateMonitoredAVS,
} from "@hex-ai/database/queries";
import dotenv from "dotenv";
import readline from "readline";
dotenv.config();

import { getAVSAnalysisWorkflow } from "../agents/workflow/avss-analysis/agent";
import type { AVSAnalysisSummary } from "../agents/workflow/avss-analysis/shared/schemas";

type ApprovalMode = "auto" | "approval" | "skip";

// Helper to prompt user for approval
async function promptUserApproval(
  avsName: string,
  index: number,
  total: number
): Promise<"proceed" | "skip" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      `\n[${index + 1}/${total}] Analyze ${avsName}? (y=yes, n=skip, a=auto-approve rest): `,
      (answer) => {
        rl.close();
        const response = answer.toLowerCase().trim();
        if (response === "a" || response === "auto") {
          resolve("auto");
        } else if (
          response === "n" ||
          response === "no" ||
          response === "skip"
        ) {
          resolve("skip");
        } else {
          resolve("proceed");
        }
      }
    );
  });
}

async function processAVS(
  monitoredAVSs: any[],
  currentAVS: any,
  index: number,
  total: number
) {
  console.log(
    `\n[${index + 1}/${total}] Processing ${currentAVS.name} (${currentAVS.address})...`
  );

  try {
    const { runner } = await getAVSAnalysisWorkflow(monitoredAVSs, currentAVS);
    const result = await runner.ask(
      `Analyze the AVS at address ${currentAVS.address} on chain ID ${currentAVS.chainId}. Provide a comprehensive summary of its risk profile and social sentiment.`
    );

    // Find the aggregator response
    const aggregatorResult = result.find(
      (r: any) => r.agent === "avs_workflow_aggregator"
    );

    if (!aggregatorResult || !aggregatorResult.response) {
      console.error(`  ❌ No aggregator response for ${currentAVS.name}`);
      return {
        success: false,
        avs: currentAVS.name,
        error: "No aggregator response",
      };
    }

    // Parse the JSON response
    let analysis: AVSAnalysisSummary;
    try {
      analysis = JSON.parse(aggregatorResult.response);
    } catch (parseError) {
      console.error(
        `  ❌ Failed to parse analysis for ${currentAVS.name}:`,
        parseError
      );
      return {
        success: false,
        avs: currentAVS.name,
        error: "JSON parse error",
      };
    }

    // Save to database
    await updateMonitoredAVS(currentAVS.id, {
      analysis: analysis,
      lastAnalyzedAt: new Date(),
    });

    console.log(`  ✅ Saved analysis for ${currentAVS.name}`);
    console.log(
      `     Risk Score: ${analysis.risk_score} | Overall Score: ${analysis.overall_score}`
    );
    console.log(
      `     Recommendation: ${analysis.recommendation.substring(0, 80)}...`
    );

    return { success: true, avs: currentAVS.name, analysis };
  } catch (error) {
    console.error(`  ❌ Error processing ${currentAVS.name}:`, error);
    return { success: false, avs: currentAVS.name, error: String(error) };
  }
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let mode: ApprovalMode = "approval"; // Default to approval mode

  if (args.includes("--auto") || args.includes("-a")) {
    mode = "auto";
  } else if (args.includes("--skip") || args.includes("-s")) {
    mode = "skip";
  }

  console.log(
    "🚀 Starting AVS Analysis Workflow for all monitored AVS on mainnet...\n"
  );
  console.log(
    `📋 Mode: ${mode === "auto" ? "Auto (no approval)" : mode === "skip" ? "Skip all" : "Approval required"}\n`
  );

  const monitoredAVSs = await getStoredAVSByChain(1);
  console.log(`📊 Found ${monitoredAVSs.length} monitored AVS to analyze\n`);

  if (monitoredAVSs.length === 0) {
    console.log("No AVS found to analyze. Exiting.");
    return;
  }

  if (mode === "skip") {
    console.log(
      "⏭️  Skip mode enabled. No analysis will be performed. Exiting."
    );
    return;
  }

  const results = [];
  const skipped = [];
  const startTime = Date.now();
  let autoApproveRemaining = mode === "auto";

  for (let i = 0; i < monitoredAVSs.length; i++) {
    const currentAVS = monitoredAVSs[i];

    // Check if user approval is needed
    if (!autoApproveRemaining) {
      const userDecision = await promptUserApproval(
        currentAVS.name,
        i,
        monitoredAVSs.length
      );

      if (userDecision === "skip") {
        console.log(`  ⏭️  Skipped ${currentAVS.name}`);
        skipped.push(currentAVS.name);
        continue;
      } else if (userDecision === "auto") {
        autoApproveRemaining = true;
        console.log(`  🤖 Auto-approval enabled for remaining AVS`);
      }
    }

    const result = await processAVS(
      monitoredAVSs,
      currentAVS,
      i,
      monitoredAVSs.length
    );
    results.push(result);

    // Add a small delay between requests to avoid rate limiting
    if (i < monitoredAVSs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log("\n" + "=".repeat(80));
  console.log("📈 ANALYSIS SUMMARY");
  console.log("=".repeat(80));
  console.log(`Total AVS: ${monitoredAVSs.length}`);
  console.log(`Processed: ${results.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`Duration: ${duration}s`);
  console.log("=".repeat(80));

  if (skipped.length > 0) {
    console.log("\n⏭️  Skipped AVS:");
    skipped.forEach((name) => console.log(`  - ${name}`));
  }

  if (failed > 0) {
    console.log("\n❌ Failed AVS:");
    results
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.avs}: ${r.error}`));
  }

  console.log("\n✅ Analysis workflow completed!");
}

main().catch(console.error);
