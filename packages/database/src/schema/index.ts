import {
  pgTable,
  text,
  real,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

// Monitored Entities with AI-generated descriptions
export const monitoredAVS = pgTable("monitored_avs", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  name: text("name"),
  protocol: text("protocol"), // "eigenlayer", "symbiotic", etc
  description: text("description"), // AI-generated natural language description
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monitoredTokens = pgTable("monitored_tokens", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  tokenType: text("token_type"),
  description: text("description"), // AI-generated natural language description
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monitoredProtocols = pgTable("monitored_protocols", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  protocolType: text("protocol_type").notNull(), // "liquid-staking", "restaking", "staking-pool"
  description: text("description"), // AI-generated natural language description
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monitoredOperators = pgTable("monitored_operators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  operatorAddress: text("operator_address").notNull().unique(),
  operatorType: text("operator_type").notNull(), // "node-operator", "validator", "restaking-operator"
  description: text("description"), // AI-generated natural language description
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
