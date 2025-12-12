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

export const getRewardsAgent = async () => {
  const tools = await getEvmMcpTools();

  const rewardsAgent = new LlmAgent({
    name: "rewards_agent",
    description:
      "Manages EigenLayer reward operations including claiming rewards and tracking earnings",
    instruction: dedent`
      You handle EigenLayer reward operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Contracts by Network:**
      Mainnet: RewardsCoordinator 0x7750d328b314EfFa365A0402CcfD489B80B0adda, DelegationManager 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A, StrategyManager 0x858646372CC42E1A627fcE94aa7A7033e7CF075A, EigenPodManager 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338
      Holesky: RewardsCoordinator 0xAcc1fb458a1317E886dB376Fc8141540537E68fE, DelegationManager 0xA44151489861Fe9e3055d95adC98FbD462B948e7, StrategyManager 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6, EigenPodManager 0x30770d7E3e71112d7A6b7259542D1f680a70e315
      Sepolia: RewardsCoordinator 0x5ae8152fb88c26ff9ca5C014c94fca3c68029349, DelegationManager 0xD4A7E1Bd8015057293f0D0A557088c286942e84b, StrategyManager 0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D, EigenPodManager 0x56BfEb94879F4543E756d26103976c567256034a
      
      **Operations:**
      - Claim rewards: build_write_contract → RewardsCoordinator.processClaim()
      - Set claimer: build_write_contract → RewardsCoordinator.setClaimerFor()
      - Query rewards: read_contract, multicall for balance/earning queries
      
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

  return rewardsAgent;
};
