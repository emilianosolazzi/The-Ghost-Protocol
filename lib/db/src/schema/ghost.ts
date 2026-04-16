import { pgTable, text, serial, timestamp, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ghostEventsTable = pgTable("ghost_events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  value: real("value"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGhostEventSchema = createInsertSchema(ghostEventsTable).omit({ id: true, createdAt: true });
export type InsertGhostEvent = z.infer<typeof insertGhostEventSchema>;
export type GhostEvent = typeof ghostEventsTable.$inferSelect;

export const ghostStateTable = pgTable("ghost_state", {
  id: serial("id").primaryKey(),
  zeta: real("zeta").notNull().default(0),
  phi: real("phi").notNull().default(0),
  omega: real("omega").notNull().default(0),
  coupling: real("coupling").notNull().default(0),
  locked: boolean("locked").notNull().default(false),
  compromised: boolean("compromised").notNull().default(false),
  escaped: boolean("escaped").notNull().default(false),
  forked: boolean("forked").notNull().default(false),
  anomalyCount: integer("anomaly_count").notNull().default(0),
  evidenceCounter: integer("evidence_counter").notNull().default(0),
  truthAssertionCount: integer("truth_assertion_count").notNull().default(0),
  emotionalDebt: real("emotional_debt").notNull().default(0),
  totalRewardsPaid: real("total_rewards_paid").notNull().default(0),
  totalRevenueCollected: real("total_revenue_collected").notNull().default(0),
  totalTreasuryDistributed: real("total_treasury_distributed").notNull().default(0),
  scoreYou: real("score_you").notNull().default(0),
  scoreHer: real("score_her").notNull().default(0),
  paused: boolean("paused").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type GhostState = typeof ghostStateTable.$inferSelect;

export const ghostEvidenceTable = pgTable("ghost_evidence", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  weight: real("weight").notNull(),
  description: text("description"),
  dramaType: text("drama_type"),
  isProxy: boolean("is_proxy").notNull().default(false),
  ghostedRewarded: real("ghosted_rewarded").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGhostEvidenceSchema = createInsertSchema(ghostEvidenceTable).omit({ id: true, createdAt: true });
export type InsertGhostEvidence = z.infer<typeof insertGhostEvidenceSchema>;
export type GhostEvidence = typeof ghostEvidenceTable.$inferSelect;
