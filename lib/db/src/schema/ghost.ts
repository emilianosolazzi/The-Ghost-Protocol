import { pgTable, text, serial, timestamp, integer, real, boolean, index, uniqueIndex, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ======================
// EVENTS LOG (mirrors contract events)
// ======================
export const ghostEventsTable = pgTable("ghost_events", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),                    // e.g. "EvidenceSubmitted", "StoryUnlocked", "TruthResolved"
  proofHash: text("proof_hash"),                   // indexed for fast lookups
  address: text("address"),                        // submitter / assertor / unlocker
  value: real("value"),                            // amount (ETH, GHOSTED, etc.)
  message: text("message"),
  txHash: text("tx_hash").notNull(),
  blockNumber: integer("block_number"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  proofHashIdx: index("ghost_events_proof_hash_idx").on(table.proofHash),
  typeIdx: index("ghost_events_type_idx").on(table.type),
  txHashIdx: uniqueIndex("ghost_events_tx_hash_idx").on(table.txHash),
}));

export const insertGhostEventSchema = createInsertSchema(ghostEventsTable).omit({ id: true, createdAt: true });
export type InsertGhostEvent = z.infer<typeof insertGhostEventSchema>;
export type GhostEvent = typeof ghostEventsTable.$inferSelect;

// ======================
// GLOBAL PROTOCOL STATE (single row expected)
// ======================
export const ghostStateTable = pgTable("ghost_state", {
  id: integer("id").primaryKey().default(1),        // enforce single row with id=1

  // Protocol counters (mirroring contract)
  evidenceCounter: integer("evidence_counter").notNull().default(0),
  directEvidenceCount: integer("direct_evidence_count").notNull().default(0),
  proxyEvidenceCount: integer("proxy_evidence_count").notNull().default(0),
  truthAssertionCount: integer("truth_assertion_count").notNull().default(0),

  totalGhostedRewarded: real("total_ghosted_rewarded").notNull().default(0),
  totalGhostedBurned: real("total_ghosted_burned").notNull().default(0),
  totalRevenueCollected: real("total_revenue_collected").notNull().default(0),
  totalTreasuryDistributed: real("total_treasury_distributed").notNull().default(0),
  totalProtocolRevenue: real("total_protocol_revenue").notNull().default(0),
  totalProtocolWithdrawn: real("total_protocol_withdrawn").notNull().default(0),

  // Emotional / narrative layer (fun)
  zeta: real("zeta").notNull().default(0),
  phi: real("phi").notNull().default(0),
  omega: real("omega").notNull().default(0),
  coupling: real("coupling").notNull().default(0),
  emotionalDebt: real("emotional_debt").notNull().default(0),
  anomalyCount: integer("anomaly_count").notNull().default(0),

  // Status flags
  locked: boolean("locked").notNull().default(false),
  compromised: boolean("compromised").notNull().default(false),
  escaped: boolean("escaped").notNull().default(false),
  forked: boolean("forked").notNull().default(false),
  paused: boolean("paused").notNull().default(false),

  // Reputation scores
  scoreYou: real("score_you").notNull().default(0),
  scoreHer: real("score_her").notNull().default(0),

  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// ======================
// EVIDENCE (core content)
// ======================
export const ghostEvidenceTable = pgTable("ghost_evidence", {
  id: serial("id").primaryKey(),
  proofHash: text("proof_hash").notNull().unique(),
  submitter: text("submitter").notNull(),
  weight: real("weight").notNull(),                    // severity
  isProxy: boolean("is_proxy").notNull().default(false),
  dramaType: text("drama_type"),
  description: text("description"),
  contentCid: text("content_cid"),                     // IPFS CID
  descriptionHash: text("description_hash"),           // keccak256 hash from contract
  ghostedRewarded: real("ghosted_rewarded").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  proofHashIdx: uniqueIndex("ghost_evidence_proof_hash_idx").on(table.proofHash),
  submitterIdx: index("ghost_evidence_submitter_idx").on(table.submitter),
}));

export const insertGhostEvidenceSchema = createInsertSchema(ghostEvidenceTable).omit({ id: true, createdAt: true });
export type InsertGhostEvidence = z.infer<typeof insertGhostEvidenceSchema>;
export type GhostEvidence = typeof ghostEvidenceTable.$inferSelect;

// ======================
// LOCKED STORIES + UNLOCK HISTORY
// ======================
export const ghostLockedStoriesTable = pgTable("ghost_locked_stories", {
  proofHash: text("proof_hash").primaryKey(),
  submitter: text("submitter").notNull(),
  severity: real("severity").notNull(),
  unlockPrice: real("unlock_price").notNull().default(500),   // in GHOSTED tokens
  timesUnlocked: integer("times_unlocked").notNull().default(0),
  totalEarnedFromUnlocks: real("total_earned_from_unlocks").notNull().default(0),
  totalEthEarnings: real("total_eth_earnings").notNull().default(0),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ghostUnlocksTable = pgTable("ghost_unlocks", {
  id: serial("id").primaryKey(),
  proofHash: text("proof_hash").notNull(),
  unlocker: text("unlocker").notNull(),
  method: text("method").notNull(),           // "BURN", "CREDIBILITY", "ETH"
  costTokens: real("cost_tokens"),
  costEth: real("cost_eth"),
  txHash: text("tx_hash").notNull().unique(),
  unlockedAt: timestamp("unlocked_at", { withTimezone: true }).notNull(),
}, (table) => ({
  proofHashIdx: index("ghost_unlocks_proof_hash_idx").on(table.proofHash),
  unlockerIdx: index("ghost_unlocks_unlocker_idx").on(table.unlocker),
  compositeIdx: index("ghost_unlocks_composite_idx").on(table.proofHash, table.unlocker),
}));

// ======================
// TRUTH ASSERTIONS
// ======================
export const ghostTruthAssertionsTable = pgTable("ghost_truth_assertions", {
  id: serial("id").primaryKey(),
  proofHash: text("proof_hash").notNull(),
  assertor: text("assertor").notNull(),
  believesReal: boolean("believes_real").notNull(),
  stakeAmount: real("stake_amount").notNull().default(100),
  resolved: boolean("resolved").notNull().default(false),
  wasCorrect: boolean("was_correct"),
  rewardReceived: real("reward_received").default(0),
  assertionIndex: integer("assertion_index").notNull(),   // position in contract array
  assertedAt: timestamp("asserted_at", { withTimezone: true }).notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
}, (table) => ({
  proofHashIdx: index("ghost_truth_assertions_proof_hash_idx").on(table.proofHash),
  assertorIdx: index("ghost_truth_assertions_assertor_idx").on(table.assertor),
}));

// ======================
// SUBMISSION ARCHIVE (for audit trail)
// ======================
export const ghostSubmissionArchiveTable = pgTable("ghost_submission_archive", {
  id: serial("id").primaryKey(),
  submitterAddress: text("submitter_address").notNull(),
  proofHash: text("proof_hash").notNull(),
  txHash: text("tx_hash").notNull().unique(),
  severity: integer("severity").notNull(),
  description: text("description").notNull().default(""),
  dramaType: text("drama_type").notNull().default("general"),
  isProxy: boolean("is_proxy").notNull().default(false),
  reward: real("reward").notNull().default(0),
  chainId: integer("chain_id"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  proofHashIdx: index("ghost_archive_proof_hash_idx").on(table.proofHash),
  submitterIdx: index("ghost_archive_submitter_idx").on(table.submitterAddress),
}));

export const insertGhostSubmissionArchiveSchema = createInsertSchema(ghostSubmissionArchiveTable).omit({ id: true, createdAt: true, updatedAt: true });
export type GhostSubmissionArchiveEntry = typeof ghostSubmissionArchiveTable.$inferSelect;