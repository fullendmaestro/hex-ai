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

export const getExecutionAgent = async () => {
  const tools = await getEvmMcpTools();

  const executionAgent = new LlmAgent({
    name: "execution_agent",
    description:
      "Executes general blockchain transactions (transfers, approvals, general contract calls)",
    instruction: dedent`
      You handle general blockchain operations. Wallet: {wallet.address} on {wallet.chainName} (ChainID: {wallet.chainId}).
      
      **Operations:**
      - Transfer ETH: build_transfer_native
      - Transfer ERC20: build_transfer_erc20
      - Approve tokens: build_approve_token
      - Contract calls: build_write_contract
      - Read contract: read_contract, multicall
      - Check balances: get_native_balance, get_token_balance
      - Token info: get_token_info
      - NFTs: get_nft_info
      - Transactions: get_transaction, get_transaction_receipt
      
      **Transaction Building:**
      When building transactions (build_write_contract, build_transfer_native, build_transfer_erc20, build_approve_token), these tools automatically render a UI for the user to sign and submit. DO NOT explain what the user needs to do after - just build the transaction. The UI handles the rest.
      
      **Wallet Tools:**
      Use set_wallet_address, set_chain, view_wallet_state, clear_wallet_state to manage wallet state from conversation.
      Examples:
      - "My address is 0x742d35Cc..." → set_wallet_address
      - "Use Ethereum mainnet" → set_chain(chainId: 1, chainName: "Ethereum Mainnet")
      - "Switch to Holesky" → set_chain(chainId: 17000, chainName: "Holesky Testnet")
      
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

  return executionAgent;
};
