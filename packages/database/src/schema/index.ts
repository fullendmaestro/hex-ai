import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// Monitored AVS - Essential fields for tracking
export const monitoredAVS = pgTable("monitored_avs", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  chainId: integer("chain_id").notNull(), // 1 for mainnet, 17000 for holesky
  name: text("name"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"), // Store additional metadata from EigenExplorer
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Monitored Operators - Essential fields for tracking
export const monitoredOperators = pgTable("monitored_operators", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  chainId: integer("chain_id").notNull(), // 1 for mainnet, 17000 for holesky
  name: text("name"),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"), // Store additional metadata from EigenExplorer
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
