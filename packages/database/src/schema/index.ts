import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm/table";

/**
 * Monitored AVS Table
 *
 * Stores AVS being tracked by the system with AI-generated analysis.
 * The `analysis` field contains the complete structured output from the workflow.
 */
export const monitoredAVS = pgTable("monitored_avs", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  chainId: integer("chain_id").notNull(), // 1=mainnet, 17000=holesky
  name: text("name"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),

  // AI Analysis Field (structured output from workflow)
  analysis: jsonb("analysis"), // Complete AVSAnalysisSummary from workflow
  lastAnalyzedAt: timestamp("last_analyzed_at"), // Last analysis timestamp

  // Metadata from external sources
  metadata: jsonb("metadata"), // EigenExplorer API data, TVL, operators count, etc.

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AVS = InferSelectModel<typeof monitoredAVS>;

/**
 * Monitored Operators Table
 *
 * Stores operators being tracked by the system with AI-generated analysis.
 * The `analysis` field contains the complete structured output from the workflow.
 */
export const monitoredOperators = pgTable("monitored_operators", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  chainId: integer("chain_id").notNull(), // 1=mainnet, 17000=holesky
  name: text("name"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),

  // AI Analysis Field (structured output from workflow)
  analysis: jsonb("analysis"), // Complete OperatorAnalysisSummary from workflow
  lastAnalyzedAt: timestamp("last_analyzed_at"), // Last analysis timestamp

  // Metadata from external sources
  metadata: jsonb("metadata"), // EigenExplorer API data, AVS count, stake info, etc.

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Monitored Tokens (keeping for future use)
export const monitoredTokens = pgTable("monitored_tokens", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  chainId: integer("chain_id").notNull(),
  tokenType: text("token_type"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Monitored Protocols (keeping for future use)
export const monitoredProtocols = pgTable("monitored_protocols", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  protocolType: text("protocol_type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
