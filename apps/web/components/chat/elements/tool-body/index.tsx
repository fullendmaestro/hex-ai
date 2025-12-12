import { NativeBalanceBody } from "./native-balance";
import { ERC20BalanceBody } from "./erc20-balance";
import { TransactionBuilderBody } from "./transaction-builder";
import { ChainInfoBody } from "./chain-info";
import { NFTInfoBody } from "./nft-info";
import { OdosQuoteBody } from "./odos-quote";
import { OdosSwapBody } from "./odos-swap";

const TOOL_BODY_COMPONENTS: Record<
  string,
  React.ComponentType<{ output: any; input?: any }>
> = {
  // Balance/Info tools
  get_balance: NativeBalanceBody,
  get_token_balance: ERC20BalanceBody,
  get_chain_info: ChainInfoBody,
  get_nft_info: NFTInfoBody,
  get_erc1155_balance: ERC20BalanceBody, // Reuse ERC20 component for similar structure

  // Transaction builder tools
  build_transfer_native: TransactionBuilderBody,
  build_transfer_erc20: TransactionBuilderBody,
  build_approve_token: TransactionBuilderBody,
  build_write_contract: TransactionBuilderBody,

  // ODOS liquidity tools
  ODOS_GET_QUOTE: OdosQuoteBody,
  ODOS_SWAP: OdosSwapBody,
};

/**
 * Get the appropriate tool body component for a given tool name
 * Returns null if no custom component exists for the tool
 */
export function getToolBodyComponent(
  toolName: string
): React.ComponentType<{ output: any; input?: any }> | null {
  return TOOL_BODY_COMPONENTS[toolName] || null;
}
