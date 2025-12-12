import dedent from "dedent";
import { type Address, erc20Abi } from "viem";
import type { AssembleResponseTxn } from "../types.js";
import type { WalletService } from "./wallet.js";

export class ExecuteSwapService {
  private readonly NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";
  private readonly walletService: WalletService;

  constructor(walletService: WalletService) {
    this.walletService = walletService;
  }

  private requiresAllowance(tokenAddress: string): boolean {
    return tokenAddress.toLowerCase() !== this.NATIVE_TOKEN.toLowerCase();
  }

  /**
   * Build an approval transaction request if needed. Returns null when no approval required,
   * otherwise returns a transaction request + serialized payload.
   */
  async checkAndSetAllowance(
    tokenAddress: string,
    amount: bigint,
    spenderAddress: string,
    fromAddress: string
  ): Promise<null | { request: any; serialized: `0x${string}` }> {
    if (!this.requiresAllowance(tokenAddress)) {
      return null;
    }

    const publicClient = this.walletService.getPublicClient();

    try {
      const currentAllowance = await publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [fromAddress as Address, spenderAddress as Address],
      });

      if (currentAllowance >= amount) {
        return null;
      }

      const { request } = await publicClient.simulateContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress as Address, amount],
        account: fromAddress as Address,
      });
      const { serializeTransaction } = await import("viem");
      const reqAny = request as any;
      const chainId = publicClient.chain?.id ?? reqAny.chainId;
      const serialized = serializeTransaction({
        to: reqAny.to,
        data: reqAny.data,
        chainId,
        type: "legacy",
      });

      return { request: { ...reqAny, from: fromAddress, chainId }, serialized };
    } catch (error) {
      console.error("Error in allowance check/build:", error);
      throw error;
    }
  }

  /**
   * Build the main swap transaction (unsigned). Returns transaction request + serialized.
   */
  async execute(
    txn: AssembleResponseTxn,
    fromAddress: string
  ): Promise<{ request: any; serialized: `0x${string}` }> {
    const publicClient = this.walletService.getPublicClient();
    if (!publicClient) {
      throw new Error("Public client is not defined");
    }

    try {
      const chainId = publicClient.chain?.id ?? txn.chainId;

      const txRequest = {
        from: fromAddress,
        to: txn.to as Address,
        data: txn.data as `0x${string}`,
        value: BigInt(txn.value || "0"),
        gas: BigInt(txn.gas),
        gasPrice: BigInt(txn.gasPrice),
        nonce: txn.nonce,
        chainId,
      } as any;

      const { serializeTransaction } = await import("viem");
      const serialized = serializeTransaction({
        to: txRequest.to,
        data: txRequest.data,
        value: txRequest.value,
        gas: txRequest.gas,
        gasPrice: txRequest.gasPrice,
        nonce: txRequest.nonce,
        chainId: txRequest.chainId,
        type: "legacy",
      });

      return { request: txRequest, serialized };
    } catch (error) {
      console.error("Error building swap transaction:", error);
      throw error;
    }
  }

  formatWithConfirmation(
    txn: AssembleResponseTxn,
    built: { request: any; serialized: `0x${string}` }
  ): string {
    const publicClient = this.walletService.getPublicClient();
    const chainName = publicClient?.chain?.name ?? "unknown";

    const formattedSwap = dedent`
			💫 Swap Transaction Prepared (unsigned)
			- From: ${built.request.from}
			- To: ${txn.to}
			- Chain: ${chainName}
			- Gas Limit: ${txn.gas}
			- Gas Price: ${txn.gasPrice}
			- Nonce: ${txn.nonce}
			- Serialized (unsigned): ${built.serialized}
		`;

    return formattedSwap;
  }
}
