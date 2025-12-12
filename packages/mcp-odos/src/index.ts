#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chainIdTool } from "./tools/chain-id.js";
import { getQuoteTool } from "./tools/get-quote.js";
import { swapTool } from "./tools/swap.js";

const server = new Server(
  {
    name: "IQAI Odos MCP Server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools = [getQuoteTool, swapTool, chainIdTool];

// Manually define tool schemas for MCP compatibility
const toolSchemas = {
  ODOS_GET_QUOTE: {
    type: "object" as const,
    properties: {
      chain: {
        type: "string" as const,
        description:
          "The blockchain network to execute the transaction on. uses fraxtal as default",
      },
      from: {
        type: "string" as const,
        description: "The sender address used for quoting",
      },
      fromToken: {
        type: "string" as const,
        description: "The token to swap from (address).",
      },
      toToken: {
        type: "string" as const,
        description: "The token to swap to (address).",
      },
      amount: {
        type: "string" as const,
        description: "The amount of tokens to swap, in wei.",
      },
      prettyFormat: {
        type: "boolean" as const,
        description: "Whether to pretty format the quote.",
      },
    },
    required: ["from", "fromToken", "toToken", "amount"],
  },
  ODOS_SWAP: {
    type: "object" as const,
    properties: {
      chain: {
        type: "string" as const,
        description:
          "The blockchain network to execute the transaction on. uses fraxtal as default",
      },
      from: {
        type: "string" as const,
        description: "The sender address that will sign the transaction",
      },
      fromToken: {
        type: "string" as const,
        description: "The token to swap from (address).",
      },
      toToken: {
        type: "string" as const,
        description: "The token to swap to (address).",
      },
      amount: {
        type: "string" as const,
        description: "The amount of tokens to swap, in wei.",
      },
      prettyFormat: {
        type: "boolean" as const,
        description: "Whether to pretty format the quote.",
      },
    },
    required: ["from", "fromToken", "toToken", "amount"],
  },
  ODOS_GET_CHAIN_ID: {
    type: "object" as const,
    properties: {
      chain: {
        type: "string" as const,
        description: "The chain name to get the ID for",
      },
    },
    required: ["chain"],
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: toolSchemas[tool.name as keyof typeof toolSchemas],
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const args = request.params.arguments;

  try {
    let result: unknown;

    switch (toolName) {
      case "ODOS_GET_QUOTE": {
        const validatedArgs = getQuoteTool.parameters.parse(args);
        result = await getQuoteTool.execute(validatedArgs);
        break;
      }
      case "ODOS_SWAP": {
        const validatedArgs = swapTool.parameters.parse(args);
        result = await swapTool.execute(validatedArgs);
        break;
      }
      case "ODOS_GET_CHAIN_ID": {
        const validatedArgs = chainIdTool.parameters.parse(args);
        result = await chainIdTool.execute(validatedArgs);
        break;
      }
      default:
        throw new Error(`Tool not found: ${toolName}`);
    }

    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("✅ IQ Odos MCP Server running on stdio");
}

main().catch((error) => {
  console.error("❌ Failed to start IQ Odos MCP Server:", error);
  process.exit(1);
});
