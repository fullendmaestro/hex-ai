"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  anvil,
  zksync,
  sepolia,
  holesky,
} from "wagmi/chains";

export default getDefaultConfig({
  appName: "Hex AI",
  projectId: "Null",
  chains: [mainnet, optimism, arbitrum, base, zksync, sepolia, holesky, anvil],
  ssr: false,
}) as any;
