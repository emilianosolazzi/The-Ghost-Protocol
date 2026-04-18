/**
 * GhostProtocol dApp API Types
 * Version: 0.1.0
 * Aligned with Smart Contract + Database Schema
 */

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp?: string;
  version?: string;
}

// ─────────────────────────────────────────────────────────────
// GLOBAL PROTOCOL STATE (mirrors ghostStateTable + contract)
// ─────────────────────────────────────────────────────────────
export interface GhostState {
  // Core protocol counters (from contract)
  evidenceCounter: number;
  directEvidenceCount: number;
  proxyEvidenceCount: number;
  truthAssertionCount: number;

  totalGhostedRewarded: number;
  totalGhostedBurned: number;
  totalRevenueCollected: number;
  totalTreasuryDistributed: number;
  totalProtocolRevenue: number;

  // Narrative / Emotional Layer
  zeta: number;        // Total drift score
  phi: number;         // Phase accumulation
  omega: number;       // Quarantine probability (0-1)
  coupling: number;    // Coupling divergence (0-1)
  emotionalDebt: number;

  anomalyCount: number;

  // Status flags
  locked: boolean;
  compromised: boolean;
  escaped: boolean;
  forked: boolean;
  paused: boolean;

  // Reputation scores
  scoreYou: number;
  scoreHer: number;

  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// METRICS (for dashboard / public stats)
// ─────────────────────────────────────────────────────────────
export interface GhostMetrics {
  marketCap: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  totalSupply: number;

  // GhostProtocol-specific metrics
  ghostingIndex: number;           // % of people who have ghosted someone
  rejectionRate: number;           // Global ghosting to rejection ratio
  heartbreakScore: number;         // Community-aggregated 0-100
  readReceiptsIgnored: number;     // Simulated unread texts / drama level

  totalUnlocks: number;
  averageUnlockPrice: number;
}

// ─────────────────────────────────────────────────────────────
// EVENTS (aligned with contract events + DB table)
// ─────────────────────────────────────────────────────────────
export const GhostEventType = {
  EvidenceSubmitted: "EvidenceSubmitted",
  GhostingReceiptSubmitted: "GhostingReceiptSubmitted",
  StoryUnlocked: "StoryUnlocked",
  StoryMadePublic: "StoryMadePublic",
  TruthAsserted: "TruthAsserted",
  TruthResolved: "TruthResolved",
  UnlockPriceUpdated: "UnlockPriceUpdated",
  ProtocolCredibilityUpdated: "ProtocolCredibilityUpdated",
  ProtocolFunded: "ProtocolFunded",
  PauseStateUpdated: "PauseStateUpdated",
  // Narrative events
  DriftUpdated: "DriftUpdated",
  PhiUpdated: "PhiUpdated",
  Compromised: "Compromised",
  Locked: "Locked",
  Escaped: "Escaped",
  Forked: "Forked",
  Anomaly: "Anomaly",
  GhostGained: "GhostGained",
} as const;

export type GhostEventType = (typeof GhostEventType)[keyof typeof GhostEventType];

export interface GhostEvent {
  id: string;
  type: GhostEventType;
  proofHash?: string;           // Most events relate to a specific story
  address?: string;             // submitter / unlocker / assertor
  value?: number;               // amount (ETH, GHOSTED, credibility, etc.)
  message: string;
  timestamp: string;
  txHash?: string;
  blockNumber?: number;
}

// ─────────────────────────────────────────────────────────────
// EVIDENCE
// ─────────────────────────────────────────────────────────────
export interface EvidenceSubmission {
  /** bytes32 proof hash as 0x-prefixed hex string */
  proofHash: string;
  weight: number;                    // severity (1-100)
  description?: string;
  dramaType?: string;
  contentCid?: string;               // IPFS CID
  isProxy: boolean;
}

export interface EvidenceResult {
  success: boolean;
  proofHash: string;
  evidenceCounter: number;
  ghostedRewarded: number;
  message: string;
  newZeta?: number;
}

// ─────────────────────────────────────────────────────────────
// STORIES & UNLOCKS
// ─────────────────────────────────────────────────────────────
export interface LockedStory {
  proofHash: string;
  submitter: string;
  severity: number;
  unlockPrice: number;           // current price in GHOSTED tokens
  timesUnlocked: number;
  totalEarnedFromUnlocks: number;
  totalEthEarnings: number;
  isPublic: boolean;
  createdAt: string;
}

export interface StoryUnlock {
  proofHash: string;
  unlocker: string;
  method: "BURN" | "CREDIBILITY" | "ETH";
  costTokens?: number;
  costEth?: number;
  timestamp: string;
  txHash?: string;
}

// ─────────────────────────────────────────────────────────────
// TRUTH ASSERTIONS
// ─────────────────────────────────────────────────────────────
export interface TruthAssertion {
  proofHash: string;
  assertor: string;
  believesReal: boolean;
  stakeAmount: number;
  resolved: boolean;
  wasCorrect?: boolean;
  rewardReceived?: number;
  assertedAt: string;
  resolvedAt?: string;
}

// ─────────────────────────────────────────────────────────────
// HOLDERS / LEADERBOARDS
// ─────────────────────────────────────────────────────────────
export interface HolderEntry {
  rank: number;
  address: string;
  alias?: string;           // ENS or custom username
  balance: number;
  percentage: number;
  credibilityScore: number; // effective credibility
  lastActivity: string;
}

export interface CredibilityLeaderboardEntry extends HolderEntry {
  protocolCredibility: number;
  tokenCredibility: number;
}