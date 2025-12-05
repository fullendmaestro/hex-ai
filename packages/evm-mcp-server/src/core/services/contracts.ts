import {
  type Address,
  type Hash,
  type Hex,
  type ReadContractParameters,
  type GetLogsParameters,
  type Log,
} from "viem";
import { getPublicClient, getWalletClient } from "./clients.js";
import { resolveAddress } from "./ens.js";

/**
 * Read from a contract for a specific network
 */
export async function readContract(
  params: ReadContractParameters,
  network = "ethereum"
) {
  const client = getPublicClient(network);
  return await client.readContract(params);
}

/**
 * Prepare a contract write transaction for a specific network
 */
export async function writeContract(
  fromAddress: Address,
  params: Record<string, any>,
  network = "ethereum"
): Promise<{
  to: Address;
  data: Hex;
  value?: bigint;
  chainId: number;
  from: Address;
  serialized: Hex;
}> {
  const { getChain } = await import("../chains.js");
  const chain = getChain(network);
  const { encodeFunctionData, serializeTransaction } = await import("viem");

  const data = encodeFunctionData({
    abi: params.abi,
    functionName: params.functionName,
    args: params.args,
  });

  const txRequest = {
    from: fromAddress,
    to: params.address as Address,
    data,
    value: params.value,
    chainId: chain.id,
  };

  // Serialize the transaction
  const serialized = serializeTransaction({
    to: txRequest.to,
    data: txRequest.data,
    value: txRequest.value,
    chainId: txRequest.chainId,
    type: "legacy",
  });

  return {
    ...txRequest,
    serialized,
  };
}

/**
 * Get logs for a specific network
 */
export async function getLogs(
  params: GetLogsParameters,
  network = "ethereum"
): Promise<Log[]> {
  const client = getPublicClient(network);
  return await client.getLogs(params);
}

/**
 * Check if an address is a contract
 * @param addressOrEns Address or ENS name to check
 * @param network Network name or chain ID
 * @returns True if the address is a contract, false if it's an EOA
 */
export async function isContract(
  addressOrEns: string,
  network = "ethereum"
): Promise<boolean> {
  // Resolve ENS name to address if needed
  const address = await resolveAddress(addressOrEns, network);

  const client = getPublicClient(network);
  const code = await client.getBytecode({ address });
  return code !== undefined && code !== "0x";
}

/**
 * Batch multiple contract read calls into a single RPC request using Multicall3
 * @param contracts Array of contract calls to batch
 * @param allowFailure If true, returns partial results even if some calls fail
 * @param network Network name or chain ID
 * @returns Array of results with status
 */
export async function multicall(
  contracts: Array<{
    address: Address;
    abi: any[];
    functionName: string;
    args?: any[];
  }>,
  allowFailure = true,
  network = "ethereum"
): Promise<any> {
  const client = getPublicClient(network);

  return await client.multicall({
    contracts: contracts as any,
    allowFailure,
  });
}
