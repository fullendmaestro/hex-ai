import { LlmAgent } from "@iqai/adk";
import dedent from "dedent";
import { env } from "../../../env";
import { getEvmMcpTools } from "../../shared/evm-tools";
import {
  setWalletAddressTool,
  setChainTool,
  clearWalletStateTool,
  viewWalletStateTool,
} from "../../shared/wallet-state-tools";
import { getModel } from "../../../config/model";

export const getOperatorAgent = async () => {
  const tools = await getEvmMcpTools();

  const operatorAgent = new LlmAgent({
    name: "operator_agent",
    description:
      "Manages EigenLayer operator operations including registration, delegation handling, and AVS registration",
    instruction: dedent`
      Handle EigenLayer operator operations using these contracts by network:
      
      MAINNET:
      - DelegationManager: 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A for operator registration
      - AllocationManager: 0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39 for operator sets and allocations
      - AVSDirectory: 0x135dda560e946695d6f155dacafc6f1f25c1f5af for AVS registration
      
      HOLESKY TESTNET:
      - DelegationManager: 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      - AllocationManager: 0x78469728304326CBc65f8f95FA756B0B73164462
      - AVSDirectory: 0x055733000064333CaDDbC92763c58BF0192fFeBf
      
      SEPOLIA TESTNET:
      - DelegationManager: 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      - AllocationManager: 0x42583067658071247ec8CE0A516A58f682002d07
      - AVSDirectory: 0xa789c91ECDdae96865913130B786140Ee17aF545
      
      Current wallet connection state:
      - Connected Address: {wallet.address}
      - Chain ID: {wallet.chainId}
      - Chain Name: {wallet.chainName}
      
      **Wallet State Management:**
      You can update wallet state based on user conversation using these tools:
      - set_wallet_address: When user mentions their wallet address
      - set_chain: When user specifies which network they want to use
      - view_wallet_state: To check current wallet configuration
      - clear_wallet_state: To disconnect/clear wallet information
      
      Key operations:
      - Register as operator via DelegationManager.registerAsOperator(string metadataURI)
      - Modify operator metadata via DelegationManager.updateOperatorMetadata(string metadataURI)
      - Register for operator sets via AllocationManager.registerForOperatorSets(address avs, uint32[] operatorSetIds)
      - Modify allocations via AllocationManager.modifyAllocations((address avs, uint32 id) operatorSet, (address strategy, uint96 magnitude)[] allocations)
      - Register with AVSs via AVSDirectory.registerOperatorToAVS(address avs)
      
      Use EVM MCP tools for contract writes, signature operations, and state queries.
      
      Important:
      - Use wallet address: {wallet.address} for all transactions except explicitly asked not to
      `,
    model: getModel(),
    tools: [
      ...tools,
      setWalletAddressTool,
      setChainTool,
      clearWalletStateTool,
      viewWalletStateTool,
    ],
  });

  return operatorAgent;
};
