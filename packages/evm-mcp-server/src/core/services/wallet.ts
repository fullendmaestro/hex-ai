import { type Address, type Hex } from "viem";

/**
 * This module previously contained wallet configuration helpers.
 * All wallet configuration has been removed as transaction tools now
 * accept sender addresses as parameters instead of using a configured wallet.
 *
 * Clients are responsible for managing their own wallets and signing transactions.
 */
