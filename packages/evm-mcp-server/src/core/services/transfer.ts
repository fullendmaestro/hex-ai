import {
  parseEther,
  parseUnits,
  type Address,
  type Hex,
  getContract,
} from "viem";
import { getPublicClient } from "./clients.js";
import { getChain } from "../chains.js";
import { resolveAddress } from "./ens.js";

// Standard ERC20 ABI for transfers
const erc20TransferAbi = [
  {
    inputs: [
      { type: "address", name: "to" },
      { type: "uint256", name: "amount" },
    ],
    name: "transfer",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { type: "address", name: "spender" },
      { type: "uint256", name: "amount" },
    ],
    name: "approve",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Standard ERC721 ABI for transfers
const erc721TransferAbi = [
  {
    inputs: [
      { type: "address", name: "from" },
      { type: "address", name: "to" },
      { type: "uint256", name: "tokenId" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ type: "uint256", name: "tokenId" }],
    name: "ownerOf",
    outputs: [{ type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC1155 ABI for transfers
const erc1155TransferAbi = [
  {
    inputs: [
      { type: "address", name: "from" },
      { type: "address", name: "to" },
      { type: "uint256", name: "id" },
      { type: "uint256", name: "amount" },
      { type: "bytes", name: "data" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { type: "address", name: "account" },
      { type: "uint256", name: "id" },
    ],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Prepare ETH transfer transaction data
 * @param fromAddress Sender's address
 * @param toAddressOrEns Recipient address or ENS name
 * @param amount Amount to send in ETH
 * @param network Network name or chain ID
 * @returns Transaction request object with serialized bytes
 */
export async function transferETH(
  fromAddress: Address,
  toAddressOrEns: string,
  amount: string, // in ether
  network = "ethereum"
): Promise<{
  to: Address;
  value: bigint;
  data?: Hex;
  chainId: number;
  from: Address;
  serialized: Hex;
}> {
  // Resolve ENS name to address if needed
  const toAddress = await resolveAddress(toAddressOrEns, network);
  const amountWei = parseEther(amount);
  const chain = getChain(network);

  const txRequest = {
    from: fromAddress,
    to: toAddress,
    value: amountWei,
    chainId: chain.id,
  };

  // Serialize the transaction
  const { serializeTransaction } = await import("viem");
  const serialized = serializeTransaction({
    to: txRequest.to,
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
 * Prepare ERC20 transfer transaction data
 * @param tokenAddressOrEns Token contract address or ENS name
 * @param fromAddress Sender's address
 * @param toAddressOrEns Recipient address or ENS name
 * @param amount Amount to send (in token units)
 * @param network Network name or chain ID
 * @returns Transaction request object and token details with serialized bytes
 */
export async function transferERC20(
  tokenAddressOrEns: string,
  fromAddress: Address,
  toAddressOrEns: string,
  amount: string,
  network: string = "ethereum"
): Promise<{
  to: Address;
  data: Hex;
  chainId: number;
  from: Address;
  serialized: Hex;
  amount: {
    raw: bigint;
    formatted: string;
  };
  token: {
    symbol: string;
    decimals: number;
  };
}> {
  // Resolve ENS names to addresses if needed
  const tokenAddress = (await resolveAddress(
    tokenAddressOrEns,
    network
  )) as Address;
  const toAddress = (await resolveAddress(toAddressOrEns, network)) as Address;

  // Get token details
  const publicClient = getPublicClient(network);
  const chain = getChain(network);
  const contract = getContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    client: publicClient,
  });

  // Get token decimals and symbol
  const decimals = await contract.read.decimals();
  const symbol = await contract.read.symbol();

  // Parse the amount with the correct number of decimals
  const rawAmount = parseUnits(amount, decimals);

  // Encode the function call
  const { encodeFunctionData, serializeTransaction } = await import("viem");
  const data = encodeFunctionData({
    abi: erc20TransferAbi,
    functionName: "transfer",
    args: [toAddress, rawAmount],
  });

  const txRequest = {
    from: fromAddress,
    to: tokenAddress,
    data,
    chainId: chain.id,
  };

  // Serialize the transaction
  const serialized = serializeTransaction({
    to: txRequest.to,
    data: txRequest.data,
    chainId: txRequest.chainId,
  });

  return {
    ...txRequest,
    serialized,
    amount: {
      raw: rawAmount,
      formatted: amount,
    },
    token: {
      symbol,
      decimals,
    },
  };
}

/**
 * Prepare ERC20 approval transaction data
 * @param tokenAddressOrEns Token contract address or ENS name
 * @param fromAddress Owner's address
 * @param spenderAddressOrEns Spender address or ENS name
 * @param amount Amount to approve (in token units)
 * @param network Network name or chain ID
 * @returns Transaction request object and token details with serialized bytes
 */
export async function approveERC20(
  tokenAddressOrEns: string,
  fromAddress: Address,
  spenderAddressOrEns: string,
  amount: string,
  network: string = "ethereum"
): Promise<{
  to: Address;
  data: Hex;
  chainId: number;
  from: Address;
  serialized: Hex;
  amount: {
    raw: bigint;
    formatted: string;
  };
  token: {
    symbol: string;
    decimals: number;
  };
}> {
  // Resolve ENS names to addresses if needed
  const tokenAddress = (await resolveAddress(
    tokenAddressOrEns,
    network
  )) as Address;
  const spenderAddress = (await resolveAddress(
    spenderAddressOrEns,
    network
  )) as Address;

  // Get token details
  const publicClient = getPublicClient(network);
  const chain = getChain(network);
  const contract = getContract({
    address: tokenAddress,
    abi: erc20TransferAbi,
    client: publicClient,
  });

  // Get token decimals and symbol
  const decimals = await contract.read.decimals();
  const symbol = await contract.read.symbol();

  // Parse the amount with the correct number of decimals
  const rawAmount = parseUnits(amount, decimals);

  // Encode the function call
  const { encodeFunctionData, serializeTransaction } = await import("viem");
  const data = encodeFunctionData({
    abi: erc20TransferAbi,
    functionName: "approve",
    args: [spenderAddress, rawAmount],
  });

  const txRequest = {
    from: fromAddress,
    to: tokenAddress,
    data,
    chainId: chain.id,
  };

  // Serialize the transaction
  const serialized = serializeTransaction({
    to: txRequest.to,
    data: txRequest.data,
    chainId: txRequest.chainId,
    type: "legacy",
  });

  return {
    ...txRequest,
    serialized,
    amount: {
      raw: rawAmount,
      formatted: amount,
    },
    token: {
      symbol,
      decimals,
    },
  };
}

/**
 * Prepare ERC721 NFT transfer transaction data
 * @param tokenAddressOrEns NFT contract address or ENS name
 * @param fromAddress Owner's address
 * @param toAddressOrEns Recipient address or ENS name
 * @param tokenId Token ID to transfer
 * @param network Network name or chain ID
 * @returns Transaction request object and token details with serialized bytes
 */
export async function transferERC721(
  tokenAddressOrEns: string,
  fromAddress: Address,
  toAddressOrEns: string,
  tokenId: bigint,
  network: string = "ethereum"
): Promise<{
  to: Address;
  data: Hex;
  chainId: number;
  from: Address;
  serialized: Hex;
  tokenId: string;
  token: {
    name: string;
    symbol: string;
  };
}> {
  // Resolve ENS names to addresses if needed
  const tokenAddress = (await resolveAddress(
    tokenAddressOrEns,
    network
  )) as Address;
  const toAddress = (await resolveAddress(toAddressOrEns, network)) as Address;

  // Get token metadata
  const publicClient = getPublicClient(network);
  const chain = getChain(network);
  const contract = getContract({
    address: tokenAddress,
    abi: erc721TransferAbi,
    client: publicClient,
  });

  // Get token name and symbol
  let name = "Unknown";
  let symbol = "NFT";

  try {
    [name, symbol] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
    ]);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
  }

  // Encode the function call
  const { encodeFunctionData, serializeTransaction } = await import("viem");
  const data = encodeFunctionData({
    abi: erc721TransferAbi,
    functionName: "transferFrom",
    args: [fromAddress, toAddress, tokenId],
  });

  const txRequest = {
    from: fromAddress,
    to: tokenAddress,
    data,
    chainId: chain.id,
  };

  // Serialize the transaction
  const serialized = serializeTransaction({
    to: txRequest.to,
    data: txRequest.data,
    chainId: txRequest.chainId,
    type: "legacy",
  });

  return {
    ...txRequest,
    serialized,
    tokenId: tokenId.toString(),
    token: {
      name,
      symbol,
    },
  };
}

/**
 * Prepare ERC1155 transfer transaction data
 * @param tokenAddressOrEns Token contract address or ENS name
 * @param fromAddress Owner's address
 * @param toAddressOrEns Recipient address or ENS name
 * @param tokenId Token ID to transfer
 * @param amount Amount to transfer
 * @param network Network name or chain ID
 * @returns Transaction request object with serialized bytes
 */
export async function transferERC1155(
  tokenAddressOrEns: string,
  fromAddress: Address,
  toAddressOrEns: string,
  tokenId: bigint,
  amount: string,
  network: string = "ethereum"
): Promise<{
  to: Address;
  data: Hex;
  chainId: number;
  from: Address;
  serialized: Hex;
  tokenId: string;
  amount: string;
}> {
  // Resolve ENS names to addresses if needed
  const tokenAddress = (await resolveAddress(
    tokenAddressOrEns,
    network
  )) as Address;
  const toAddress = (await resolveAddress(toAddressOrEns, network)) as Address;
  const chain = getChain(network);

  // Parse amount to bigint
  const amountBigInt = BigInt(amount);

  // Encode the function call
  // Encode the transfer function call
  const data = encodeFunctionData({
    abi: erc1155TransferAbi,
    functionName: "safeTransferFrom",
    args: [fromAddress, toAddress, tokenId, amount, "0x"],
  });

  const txRequest = {
    from: fromAddress,
    to: tokenAddress,
    data,
    chainId: chain.id,
  };

  // Serialize the transaction
  const serialized = serializeTransaction({
    to: txRequest.to,
    data: txRequest.data,
    chainId: txRequest.chainId,
    type: "legacy",
  });

  return {
    ...txRequest,
    serialized,
    tokenId: tokenId.toString(),
    amount,
  };
}
