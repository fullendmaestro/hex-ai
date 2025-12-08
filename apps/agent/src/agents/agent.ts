import { AgentBuilder } from "@iqai/adk";
import { env } from "../env";
import { getStakerAgent } from "./chat/stacker-agent/agent";
import { getOperatorAgent } from "./chat/operator-agent/agent";
import { getAVSAgent } from "./chat/avs-agent/agent";
import { getRewardsAgent } from "./chat/rewards-agent/agent";

/**
 * Creates and configures the EigenLayer coordinator agent.
 *
 * This agent serves as the main orchestrator that routes user requests to
 * specialized sub-agents based on the type of EigenLayer operation.
 * It coordinates between staking, operator, AVS, and rewards operations
 * across mainnet and testnet networks.
 *
 * @returns The fully constructed root agent instance ready to process requests
 */
export const getRootAgent = async () => {
  const stakerAgent = await getStakerAgent();
  const operatorAgent = await getOperatorAgent();
  const avsAgent = await getAVSAgent();
  const rewardsAgent = await getRewardsAgent();

  return AgentBuilder.create("eigenlayer_coordinator")
    .withDescription(
      "EigenLayer coordinator that delegates tasks to specialized agents for staking, operations, AVS management, and rewards."
    )
    .withInstruction(
      `Route user requests to the appropriate sub-agent based on the target network:
      
      MAINNET ADDRESSES:
      - Use staker agent for deposits/withdrawals via StrategyManager (0x858646372CC42E1A627fcE94aa7A7033e7CF075A) and EigenPodManager (0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338)
      - Use operator agent for registration/delegation via DelegationManager (0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A) and AllocationManager (0x948a420b8CC1d6BFd0B6087C2E7c344a2CD0bc39)
      - Use AVS agent for service management via AVSDirectory (0x135dda560e946695d6f155dacafc6f1f25c1f5af)
      - Use rewards agent for reward operations via RewardsCoordinator (0x7750d328b314EfFa365A0402CcfD489B80B0adda)
      
      HOLESKY TESTNET ADDRESSES:
      - StrategyManager: 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6
      - EigenPodManager: 0x30770d7E3e71112d7A6b7259542D1f680a70e315
      - DelegationManager: 0xA44151489861Fe9e3055d95adC98FbD462B948e7
      - AllocationManager: 0x78469728304326CBc65f8f95FA756B0B73164462
      - AVSDirectory: 0x055733000064333CaDDbC92763c58BF0192fFeBf
      - RewardsCoordinator: 0xAcc1fb458a1317E886dB376Fc8141540537E68fE
      
      SEPOLIA TESTNET ADDRESSES:
      - StrategyManager: 0x2E3D6c0744b10eb0A4e6F679F71554a39Ec47a5D
      - EigenPodManager: 0x56BfEb94879F4543E756d26103976c567256034a
      - DelegationManager: 0xD4A7E1Bd8015057293f0D0A557088c286942e84b
      - AllocationManager: 0x42583067658071247ec8CE0A516A58f682002d07
      - AVSDirectory: 0xa789c91ECDdae96865913130B786140Ee17aF545
      - RewardsCoordinator: 0x5ae8152fb88c26ff9ca5C014c94fca3c68029349
      
      Coordinate cross-agent workflows and handle error recovery. Use available EVM MCP tools for contract interactions.`
    )
    .withModel(env.LLM_MODEL)
    .withSubAgents([stakerAgent, operatorAgent, avsAgent, rewardsAgent])
    .build();
};
