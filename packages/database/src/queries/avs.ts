import { eq, and } from "drizzle-orm";
import { db } from "@hex-ai/database/client";
import { monitoredAVS } from "@hex-ai/database/schema";

export type MonitoredAVS = typeof monitoredAVS.$inferSelect;
export type NewMonitoredAVS = typeof monitoredAVS.$inferInsert;

// Get all monitored AVS
export async function getAllMonitoredAVS() {
  return await db
    .select()
    .from(monitoredAVS)
    .where(eq(monitoredAVS.isActive, true));
}

// Get monitored AVS by chain ID
export async function getMonitoredAVSByChain(chainId: number) {
  return await db
    .select()
    .from(monitoredAVS)
    .where(
      and(eq(monitoredAVS.chainId, chainId), eq(monitoredAVS.isActive, true))
    );
}

export async function getStoredAVSByChain(chainId: number) {
  return await db
    .select({
      id: monitoredAVS.id,
      address: monitoredAVS.address,
      chainId: monitoredAVS.chainId,
      name: monitoredAVS.name,
      description: monitoredAVS.description,
      isActive: monitoredAVS.isActive,
      metadata: monitoredAVS.metadata,
      createdAt: monitoredAVS.createdAt,
      updatedAt: monitoredAVS.updatedAt,
    })
    .from(monitoredAVS)
    .where(
      and(eq(monitoredAVS.chainId, chainId), eq(monitoredAVS.isActive, true))
    );
}

// Get monitored AVS by address
export async function getMonitoredAVSByAddress(address: string) {
  return await db
    .select()
    .from(monitoredAVS)
    .where(eq(monitoredAVS.address, address));
}

// Create new monitored AVS
export async function createMonitoredAVS(avs: NewMonitoredAVS) {
  return await db.insert(monitoredAVS).values(avs).returning();
}

// Update monitored AVS
export async function updateMonitoredAVS(
  id: string,
  updates: Partial<NewMonitoredAVS>
) {
  return await db
    .update(monitoredAVS)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(monitoredAVS.id, id))
    .returning();
}

// Delete (soft delete) monitored AVS
export async function deleteMonitoredAVS(id: string) {
  return await db
    .update(monitoredAVS)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(monitoredAVS.id, id))
    .returning();
}

// Bulk insert monitored AVS
export async function bulkInsertMonitoredAVS(avsList: NewMonitoredAVS[]) {
  return await db
    .insert(monitoredAVS)
    .values(avsList)
    .onConflictDoNothing()
    .returning();
}
