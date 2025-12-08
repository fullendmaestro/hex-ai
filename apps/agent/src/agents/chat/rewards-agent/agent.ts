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

export const getRewardsAgent = async () => {
  const tools = await getEvmMcpTools();

  const rewardsAgent = new LlmAgent({
    name: "rewards_agent",
    description:
      "Manages EigenLayer reward operations including claiming rewards and tracking earnings",
    instruction: dedent`
      Handle EigenLayer reward operations using these contracts by network:
      
      MAINNET:
      - RewardsCoordinator: 0x7750d328b314EfFa365A0402CcfD489B80B0adda for reward claiming
      - DelegationManager: 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A for delegation tracking
      - StrategyManager: 0x858646372CC42E1A627fcE94aa7A7033e7CF075A for strategy rewards
      - EigenPodManager: 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338 for native ETH rewards
      
      HOLESKY TESTNET:
      - RewardsCoordinator: 0xAcc1fb458a1317E886dB376Fc8141540537E68fE
      - DelegationManager: 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      - StrategyManager: 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6
      - EigenPodManager: 0x30770d7E3e71112d7A6b7259542D1f680a70e315
      
      SEPOLIA TESTNET:
      - RewardsCoordinator: 0x5ae8152fb88c26ff9ca5C014c94fca3c68029349
      - DelegationManager: 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      - StrategyManager: 0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D
      - EigenPodManager: 0x56BfEb94879F4543E756d26103976c567256034a
      
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
      - Claim rewards via RewardsCoordinator.processClaim(Claim claim, address recipient)
      - Set claimer via RewardsCoordinator.setClaimerFor(address claimer)
      - Query reward balances and earnings
      - Track delegation reward splits
      - Monitor reward submission events
      
      Use EVM MCP tools for reward claiming, balance queries, and event monitoring.
      
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

  return rewardsAgent;
};
