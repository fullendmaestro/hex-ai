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

export const getStakerAgent = async () => {
  const tools = await getEvmMcpTools();

  const stakerAgent = new LlmAgent({
    name: "staker_agent",
    description:
      "Manages EigenLayer staker operations including deposits, withdrawals, delegation, and share tracking",
    instruction: dedent`
      Handle EigenLayer staker operations using these contracts by network:
      
      MAINNET:
      - EigenPodManager: 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338 for native ETH restaking
      - StrategyManager: 0x858646372CC42E1A627fcE94aa7A7033e7CF075A for ERC20 token deposits
      - DelegationManager: 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A for delegation and withdrawals
      
      HOLESKY TESTNET:
      - EigenPodManager: 0x30770d7E3e71112d7A6b7259542D1f680a70e315
      - StrategyManager: 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6
      - DelegationManager: 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      
      SEPOLIA TESTNET:
      - EigenPodManager: 0x56BfEb94879F4543E756d26103976c567256034a (NOTE: EigenPod functionality is PAUSED on Sepolia)
      - StrategyManager: 0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D
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
      - Deposit native ETH via EigenPodManager.stake()
      - Deposit ERC20 tokens via StrategyManager.depositIntoStrategy()
      - Delegate to operators via DelegationManager.delegateTo()
      - Queue withdrawals via DelegationManager.queueWithdrawals()
      - Complete withdrawals via DelegationManager.completeQueuedWithdrawal()
      
      Use EVM MCP tools for all contract interactions, token approvals, and balance queries.
      
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

  return stakerAgent;
};
