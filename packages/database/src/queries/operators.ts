import { eq, and } from "drizzle-orm";
import { db } from "@hex-ai/database/client";
import { monitoredOperators } from "@hex-ai/database/schema";

export type MonitoredOperator = typeof monitoredOperators.$inferSelect;
export type NewMonitoredOperator = typeof monitoredOperators.$inferInsert;

// Get all monitored operators
export async function getAllMonitoredOperators() {
  return await db
    .select()
    .from(monitoredOperators)
    .where(eq(monitoredOperators.isActive, true));
}

// Get monitored operators by chain ID
export async function getMonitoredOperatorsByChain(chainId: number) {
  return await db
    .select()
    .from(monitoredOperators)
    .where(
      and(
        eq(monitoredOperators.chainId, chainId),
        eq(monitoredOperators.isActive, true)
      )
    );
}

// Get monitored operator by address
export async function getMonitoredOperatorByAddress(address: string) {
  return await db
    .select()
    .from(monitoredOperators)
    .where(eq(monitoredOperators.address, address));
}

// Create new monitored operator
export async function createMonitoredOperator(operator: NewMonitoredOperator) {
  return await db.insert(monitoredOperators).values(operator).returning();
}

// Update monitored operator
export async function updateMonitoredOperator(
  id: string,
  updates: Partial<NewMonitoredOperator>
) {
  return await db
    .update(monitoredOperators)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(monitoredOperators.id, id))
    .returning();
}

// Delete (soft delete) monitored operator
export async function deleteMonitoredOperator(id: string) {
  return await db
    .update(monitoredOperators)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(monitoredOperators.id, id))
    .returning();
}

// Bulk insert monitored operators
export async function bulkInsertMonitoredOperators(
  operatorsList: NewMonitoredOperator[]
) {
  return await db
    .insert(monitoredOperators)
    .values(operatorsList)
    .onConflictDoNothing()
    .returning();
}
