import { McpToolset } from "@iqai/adk";

// Create MCP toolset wrapper for ODOS transaction builder server
const toolset = new McpToolset({
  name: "ODOS Transaction Server",
  description: "MCP server for preparing Odos swap transactions (unsigned)",
  transport: {
    mode: "stdio",
    command: "node",
    args: ["../../packages/mcp-odos/dist/index.js"],
    env: {},
  },
});

export const getOdosMcpTools = async () => {
  try {
    const tools = await toolset.getTools();
    return tools;
  } catch (err) {
    console.error("Failed to initialize ODOS MCP tools:", err);
    throw err;
  }
};

export default getOdosMcpTools;
