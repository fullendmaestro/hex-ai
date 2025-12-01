import { McpAtp, AgentBuilder, McpToolset } from "@iqai/adk";
// Create ATP toolset with wrapper function
const toolset = new McpToolset({
  name: "EVM Transaction Server",
  description:
    "MCP server for executing blockchain transactions on EVM-compatible networks",
  transport: {
    mode: "stdio",
    command: "node",
    args: ["../../packages/evm-mcp-server/build/index.js"],
    env: {
      EVM_PRIVATE_KEY: process.env.EVM_PRIVATE_KEY || "",
    },
  },
});

export const getEvmMcpTools = async () => {
  try {
    const tools = await toolset.getTools();
    return tools;
  } catch (err) {
    console.error("Failed to initialize MCP tools:", err);
    throw err;
  }
};
