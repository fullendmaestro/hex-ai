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
      You handle EigenLayer operator operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Contracts by Network:**
      Mainnet: DelegationManager 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A, AllocationManager 0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39, AVSDirectory 0x135dda560e946695d6f155dacafc6f1f25c1f5af
      Holesky: DelegationManager 0xA44151489861Fe9e3055d95adC98FbD462B948e7, AllocationManager 0x78469728304326CBc65f8f95FA756B0B73164462, AVSDirectory 0x055733000064333CaDDbC92763c58BF0192fFeBf
      Sepolia: DelegationManager 0xD4A7E1Bd8015057293f0D0A557088c286942e84b, AllocationManager 0x42583067658071247ec8CE0A516A58f682002d07, AVSDirectory 0xa789c91ECDdae96865913130B786140Ee17aF545
      
      **Operations:**
      - Register operator: build_write_contract → DelegationManager.registerAsOperator()
      - Update metadata: build_write_contract → DelegationManager.updateOperatorMetadata()
      - Register for operator sets: build_write_contract → AllocationManager.registerForOperatorSets()
      - Modify allocations: build_write_contract → AllocationManager.modifyAllocations()
      - Register with AVS: build_write_contract → AVSDirectory.registerOperatorToAVS()
      
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

  return operatorAgent;
};
