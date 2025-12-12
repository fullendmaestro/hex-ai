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

export const getStakerAgent = async () => {
  const tools = await getEvmMcpTools();

  const stakerAgent = new LlmAgent({
    name: "staker_agent",
    description:
      "Manages EigenLayer staker operations including deposits, withdrawals, delegation, and share tracking",
    instruction: dedent`
      You handle EigenLayer staker operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Contracts by Network:**
      Mainnet: EigenPodManager 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338, StrategyManager 0x858646372CC42E1A627fcE94aa7A7033e7CF075A, DelegationManager 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A
      Holesky: EigenPodManager 0x30770d7E3e71112d7A6b7259542D1f680a70e315, StrategyManager 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6, DelegationManager 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      Sepolia: EigenPodManager 0x56BfEb94879F4543E756d26103976c567256034a (PAUSED), StrategyManager 0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D, DelegationManager 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      
      **Operations:**
      - Stake ETH: build_write_contract → EigenPodManager.stake() with value
      - Deposit ERC20: build_approve_token then build_write_contract → StrategyManager.depositIntoStrategy()
      - Delegate: build_write_contract → DelegationManager.delegateTo()
      - Queue/complete withdrawals: build_write_contract → DelegationManager methods
      
      **Transaction Building:**
      When building transactions (build_write_contract, build_transfer_native, build_approve_token), these tools automatically render a UI for the user to sign and submit. DO NOT explain what the user needs to do after - just build the transaction. The UI handles the rest.
      
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

  return stakerAgent;
};
