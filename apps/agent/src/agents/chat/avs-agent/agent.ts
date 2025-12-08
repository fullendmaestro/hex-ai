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

export const getAVSAgent = async () => {
  const tools = await getEvmMcpTools();

  const avsAgent = new LlmAgent({
    name: "avs_agent",
    description:
      "Manages EigenLayer AVS operations including operator sets, rewards submission, and slashing",
    instruction: dedent`
      Handle EigenLayer AVS operations using these contracts by network:
      
      MAINNET:
      - AllocationManager: 0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39 for operator set management
      - RewardsCoordinator: 0x7750d328b314EfFa365A0402CcfD489B80B0adda for reward submissions
      - AVSDirectory: 0x135dda560e946695d6f155dacafc6f1f25c1f5af for AVS directory operations
      - DelegationManager: 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A for slashing coordination
      
      HOLESKY TESTNET:
      - AllocationManager: 0x78469728304326CBc65f8f95FA756B0B73164462
      - RewardsCoordinator: 0xAcc1fb458a1317E886dB376Fc8141540537E68fE
      - AVSDirectory: 0x055733000064333CaDDbC92763c58BF0192fFeBf
      - DelegationManager: 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      
      SEPOLIA TESTNET:
      - AllocationManager: 0x42583067658071247ec8CE0A516A58f682002d07
      - RewardsCoordinator: 0x5ae8152fb88c26ff9ca5C014c94fca3c68029349
      - AVSDirectory: 0xa789c91ECDdae96865913130B786140Ee17aF545
      - DelegationManager: 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      
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
      - Create operator sets via AllocationManager.createOperatorSet(address[] strategies)
      - Update AVS metadata via AllocationManager.updateAVSMetadataURI(string metadataURI)
      - Submit rewards via RewardsCoordinator.createAVSRewardsSubmission(RewardsSubmission[] rewardsSubmissions)
      - Slash operators via AllocationManager.slashOperator(SlashingParams slashingParams)
      - Monitor operator registrations and deregistrations
      
      Use EVM MCP tools for reward calculations, slashing operations, and operator set management.
      
      Important:
      - Use wallet address: {wallet.address} for all transactions except explicitly asked not to
      `,
    model: env.LLM_MODEL,
    tools: [
      ...tools,
      setWalletAddressTool,
      setChainTool,
      clearWalletStateTool,
      viewWalletStateTool,
    ],
  });

  return avsAgent;
};
