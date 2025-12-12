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

export const getAVSAgent = async () => {
  const tools = await getEvmMcpTools();

  const avsAgent = new LlmAgent({
    name: "avs_agent",
    description:
      "Manages EigenLayer AVS operations including operator sets, rewards submission, and slashing",
    instruction: dedent`
      You handle EigenLayer AVS operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Contracts by Network:**
      Mainnet: AllocationManager 0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39, RewardsCoordinator 0x7750d328b314EfFa365A0402CcfD489B80B0adda, AVSDirectory 0x135dda560e946695d6f155dacafc6f1f25c1f5af, DelegationManager 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A
      Holesky: AllocationManager 0x78469728304326CBc65f8f95FA756B0B73164462, RewardsCoordinator 0xAcc1fb458a1317E886dB376Fc8141540537E68fE, AVSDirectory 0x055733000064333CaDDbC92763c58BF0192fFeBf, DelegationManager 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      Sepolia: AllocationManager 0x42583067658071247ec8CE0A516A58f682002d07, RewardsCoordinator 0x5ae8152fb88c26ff9ca5C014c94fca3c68029349, AVSDirectory 0xa789c91ECDdae96865913130B786140Ee17aF545, DelegationManager 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      
      **Operations:**
      - Create operator sets: build_write_contract → AllocationManager.createOperatorSet()
      - Update metadata: build_write_contract → AllocationManager.updateAVSMetadataURI()
      - Submit rewards: build_write_contract → RewardsCoordinator.createAVSRewardsSubmission()
      - Slash operators: build_write_contract → AllocationManager.slashOperator()
      
      **Transaction Building:**
      When building transactions (build_write_contract), these tools automatically render a UI for the user to sign and submit. DO NOT explain what the user needs to do after - just build the transaction. The UI handles the rest.
      
      **Wallet Tools:**
      Use set_wallet_address, set_chain, view_wallet_state, clear_wallet_state to manage wallet state from conversation.
      
      **Critical Rules:**
      - Always use {wallet.address} for 'from' parameter unless explicitly told otherwise
      - Build transactions directly - don't ask for confirmations or explain signing steps
      - The build tools render UI components automatically
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

  return avsAgent;
};
