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
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Hex AI",
  projectId: "Null",
  chains: [mainnet, optimism, arbitrum, base, zksync, sepolia, anvil],
  ssr: false,
});
