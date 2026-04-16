import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ghostStateTable, ghostEventsTable, ghostEvidenceTable } from "@workspace/db";
import {
  GetGhostStateResponse,
  GetGhostMetricsResponse,
  GetGhostTimelineResponse,
  GetTopHoldersResponse,
  SubmitEvidenceBody,
  SubmitEvidenceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// ─── Contract Constants ──────────────────────────────────────────────────────
const TOTAL_SUPPLY        = 1_000_000_000;
const DENIAL_THRESHOLD    = 10;           // > 10 → gaslight override
const FORK_THRESHOLD      = 20;           // > 20 + escaped → fork
const GHOSTING_RECEIPT_FEE = 0.01;        // ETH per submission
const TREASURY_SPLIT      = 0.30;         // 30% of fee → treasury
const MAX_GHOSTED_PER_SUB = 100_000;      // cap on $GHOSTED per receipt
const LOCK_REWARD_ETH     = 1;
const COMPROMISE_REWARD_ETH = 5;
const ESCAPE_REWARD_ETH   = 2;
const FORK_REWARD_ETH     = 10;
const VRF_LEGENDARY_REWARD = 1_000_000;   // $GHOSTED for token #70
const MIN_HOLDING_DAYS    = 7;
const MIN_STAKE_AMOUNT    = 10_000;       // $GHOSTED to stake for credibility
const MIN_VOTING_POWER    = 1_000;        // $GHOSTED to vote

// ─── Drama types (friendly labels for ghosting categories) ───────────────────
export const DRAMA_TYPES = [
  { id: "left_on_read",      label: "Left On Read",        emoji: "👀", desc: "Text delivered, opened, never answered" },
  { id: "delivered_no_open", label: "Delivered, Never Opened", emoji: "📬", desc: "They haven't even looked at it" },
  { id: "seen_on_story",     label: "Seen Your Story",     emoji: "👻", desc: "Active on socials, silent on you" },
  { id: "slow_fade",         label: "The Slow Fade",       emoji: "🌫️", desc: "Replies getting shorter, gaps getting longer" },
  { id: "soft_ghost",        label: "Soft Ghost",          emoji: "🌙", desc: "One-word replies, energy gone cold" },
  { id: "hard_ghost",        label: "Hard Ghost",          emoji: "💀", desc: "Complete and total disappearance" },
  { id: "orbiting",          label: "Orbiting",            emoji: "🛸", desc: "Likes your stuff, won't actually talk" },
  { id: "double_text",       label: "Double Text Ignored", emoji: "🗓️", desc: "You texted again. Still nothing." },
];

async function ensureGhostState() {
  const rows = await db.select().from(ghostStateTable).limit(1);
  if (rows.length === 0) {
    await db.insert(ghostStateTable).values({
      zeta: 0.73,
      phi: 0.41,
      omega: 0.62,
      coupling: 0.38,
      locked: true,
      compromised: false,
      escaped: false,
      forked: false,
      anomalyCount: 7,
      evidenceCounter: 3,
      truthAssertionCount: 2,
      emotionalDebt: 12.4,
      totalRewardsPaid: 13,
      totalRevenueCollected: 0.03,
      totalTreasuryDistributed: 0.009,
      scoreYou: 72,
      scoreHer: 31,
      paused: false,
    });
    const newRows = await db.select().from(ghostStateTable).limit(1);
    return newRows[0];
  }
  return rows[0];
}

function simulateDrift(state: typeof ghostStateTable.$inferSelect) {
  const dt = 0.001;
  const newZeta = Math.min(state.zeta + Math.random() * dt * 2, 1.0);
  const newPhi  = Math.min(state.phi + newZeta * 0.0005, 1.0);
  // omega() = zeta / (1 + zeta)  — exact contract formula
  const newOmega = newZeta / (1 + newZeta);
  const scoreDiff = Math.abs(state.scoreYou - state.scoreHer);
  const scoreSum  = state.scoreYou + state.scoreHer;
  const newCoupling = scoreSum === 0 ? 0 : scoreDiff / scoreSum;
  // Emotional debt ticks up when scoreDiff > scoreMin (coupling imbalance)
  const newEmotionalDebt = Math.min(state.emotionalDebt + scoreDiff * dt, 1e10);
  return { newZeta, newPhi, newOmega, newCoupling, newEmotionalDebt };
}

// ─── State ───────────────────────────────────────────────────────────────────
router.get("/ghost/state", async (req, res): Promise<void> => {
  const state = await ensureGhostState();
  const { newZeta, newPhi, newOmega, newCoupling, newEmotionalDebt } = simulateDrift(state);

  await db.update(ghostStateTable)
    .set({ zeta: newZeta, phi: newPhi, omega: newOmega, coupling: newCoupling, emotionalDebt: newEmotionalDebt })
    .where(eq(ghostStateTable.id, state.id));

  const response = GetGhostStateResponse.parse({
    zeta: newZeta,
    phi: newPhi,
    omega: newOmega,
    coupling: newCoupling,
    locked: state.locked,
    compromised: state.compromised,
    escaped: state.escaped,
    forked: state.forked,
    evidenceCounter: state.evidenceCounter,
    truthAssertionCount: state.truthAssertionCount ?? 0,
    emotionalDebt: newEmotionalDebt,
    totalRewardsPaid: state.totalRewardsPaid,
    isQuarantined: newOmega > 0.5,
    scoreYou: state.scoreYou,
    scoreHer: state.scoreHer,
    paused: state.paused,
  });
  res.json(response);
});

// ─── Metrics ─────────────────────────────────────────────────────────────────
router.get("/ghost/metrics", async (_req, res): Promise<void> => {
  // $GHOSTED: 1B supply, price $0.420 → ~$420M market cap (420 narrative)
  const basePrice = 0.420;
  const fluctuation = 1 + (Math.random() - 0.5) * 0.04;
  const price = basePrice * fluctuation;
  const priceChange24h = (Math.random() - 0.3) * 30;

  const state = await ensureGhostState();

  const response = GetGhostMetricsResponse.parse({
    marketCap: price * TOTAL_SUPPLY,
    price,
    priceChange24h,
    volume24h: 8_300_000 + Math.random() * 2_000_000,
    holders: 142_337 + Math.floor(Math.random() * 50),
    totalSupply: TOTAL_SUPPLY,
    ghostingIndex: 73.6,
    rejectionRate: 41.2,
    heartbreakScore: 88,
    readReceiptsIgnored: 2_847_291 + Math.floor(Math.random() * 100),
    totalRevenueCollected: state.totalRevenueCollected ?? 0,
    totalTreasuryDistributed: state.totalTreasuryDistributed ?? 0,
    receiptFeeEth: GHOSTING_RECEIPT_FEE,
  });
  res.json(response);
});

// ─── Event messages ───────────────────────────────────────────────────────────
const GHOST_MESSAGES: Record<string, string[]> = {
  DriftUpdated: [
    "Getting more distant — they haven't replied",
    "Ghosting level rising, texting window closing",
    "Silence detected, drift increasing",
  ],
  PhiUpdated: [
    "Feelings piling up with no outlet",
    "Heartbreak building — still no response",
    "You keep checking your phone, nothing changes",
  ],
  Compromised: [
    "You texted back too fast — feelings exposed",
    "Double text detected — the heart got involved",
  ],
  Locked: [
    "You're stuck on them — can't move on",
    "Brain locked in — you cannot unsee the read receipt",
  ],
  Escaped: [
    "They have officially left the chat — 2 ETH escape reward triggered",
    "They bounced — no explanation given",
  ],
  Forked: [
    "It's over — fork triggered after 20+ receipts. 10 ETH released.",
    "The relationship is officially on-chain history",
  ],
  EvidenceAdded: [
    "Direct receipt verified — ghosting level adjusted, $GHOSTED earned",
    "Your proof hash is permanently on record",
    "Truth assertion logged — credibility boosted",
  ],
  TruthAssertion: [
    "Truth assertion #{count} — direct proof on chain",
    "Honest receipt verified — detection entropy rising",
  ],
  GhostGained: [
    "$GHOSTED holders rewarded — someone submitted honest proof",
    "Receipt fee collected — 30% to treasury, 70% to protocol",
    "Entropy reward distributed for verified evidence",
  ],
};

// ─── Timeline ────────────────────────────────────────────────────────────────
router.get("/ghost/timeline", async (_req, res): Promise<void> => {
  const dbEvents = await db.select().from(ghostEventsTable)
    .orderBy(desc(ghostEventsTable.createdAt))
    .limit(20);

  if (dbEvents.length < 5) {
    const types = ["DriftUpdated", "PhiUpdated", "EvidenceAdded", "TruthAssertion", "Locked", "GhostGained"] as const;
    const seedEvents = types.map((type) => ({
      type,
      message: GHOST_MESSAGES[type][0],
      value: Math.random() * 10,
    }));
    await db.insert(ghostEventsTable).values(seedEvents).onConflictDoNothing();
    const freshEvents = await db.select().from(ghostEventsTable)
      .orderBy(desc(ghostEventsTable.createdAt))
      .limit(20);
    res.json(GetGhostTimelineResponse.parse(freshEvents.map(e => ({
      id: String(e.id), type: e.type, timestamp: e.createdAt.toISOString(),
      message: e.message, value: e.value ?? undefined,
    }))));
    return;
  }
  res.json(GetGhostTimelineResponse.parse(dbEvents.map(e => ({
    id: String(e.id), type: e.type, timestamp: e.createdAt.toISOString(),
    message: e.message, value: e.value ?? undefined,
  }))));
});

// ─── Top Holders ──────────────────────────────────────────────────────────────
// Balances = % of 1B $GHOSTED supply
const TOP_HOLDERS = [
  { rank: 1,  address: "0xDeAd...B33f", alias: "GhostWhale.eth",     balance: 50_000_000, percentage: 0.05 },
  { rank: 2,  address: "0xC0fF...eE01", alias: "ReadReceiptKing",    balance: 40_000_000, percentage: 0.04 },
  { rank: 3,  address: "0xAb5e...1337", alias: "LeftOnRead.eth",     balance: 30_000_000, percentage: 0.03 },
  { rank: 4,  address: "0xF4Ce...d00d", alias: "DetectionEntropy",   balance: 20_000_000, percentage: 0.02 },
  { rank: 5,  address: "0x0000...0069", alias: "EvidenceMaximalist", balance: 15_000_000, percentage: 0.015 },
  { rank: 6,  address: "0xB4By...D01L", alias: "BurnBagBurner",      balance: 10_000_000, percentage: 0.01 },
  { rank: 7,  address: "0xC4Fe...BABE", alias: "NeverGhosted",       balance: 7_000_000,  percentage: 0.007 },
  { rank: 8,  address: "0x5AaB...F00B", alias: "GaslightSlayer",     balance: 5_000_000,  percentage: 0.005 },
  { rank: 9,  address: "0x1337...1337", alias: "HoldingForever",     balance: 4_000_000,  percentage: 0.004 },
  { rank: 10, address: "0xD4D4...D4D4", alias: "Token70Holder",      balance: 1_000_000,  percentage: 0.001 },
];

router.get("/ghost/holders", async (_req, res): Promise<void> => {
  const now = new Date();
  const response = GetTopHoldersResponse.parse(
    TOP_HOLDERS.map(h => ({
      ...h,
      lastActivity: new Date(now.getTime() - Math.random() * 86400000 * 7).toISOString(),
    }))
  );
  res.json(response);
});

// ─── Submit Evidence ──────────────────────────────────────────────────────────
router.post("/ghost/submit-evidence", async (req, res): Promise<void> => {
  const parsed = SubmitEvidenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { hash, weight, description, isProxy, dramaType } = parsed.data;

  // Duplicate check — each proof hash submittable only once
  const existing = await db.select().from(ghostEvidenceTable)
    .where(eq(ghostEvidenceTable.hash, hash)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Receipt already on record — each proof hash can only be submitted once. Generate a fresh hash." });
    return;
  }

  // Fee split: 30% treasury, 70% protocol (simulated)
  const feePaid = GHOSTING_RECEIPT_FEE;
  const treasuryCut = parseFloat((feePaid * TREASURY_SPLIT).toFixed(4));
  const protocolCut = parseFloat((feePaid * (1 - TREASURY_SPLIT)).toFixed(4));

  const state = await ensureGhostState();
  const newEvidenceCounter = state.evidenceCounter + 1;

  let newZeta: number;
  let zetaDelta: number;
  let eventMessage: string;
  let ghostedReward = 0;
  let newTruthAssertionCount = state.truthAssertionCount ?? 0;
  let newEmotionalDebt = state.emotionalDebt ?? 0;

  if (isProxy) {
    // Proxy: raises zetaMismatch (hearsay amplifies uncertainty)
    // Contract: zetaMismatch += debtImpact / 2
    zetaDelta = weight * 0.005;
    newZeta = Math.min(1.0, state.zeta + zetaDelta);
    newEmotionalDebt = Math.min(newEmotionalDebt + weight * 0.1, 1e6);
    eventMessage = description
      ? `[${dramaType ?? "Hearsay"}] ${description}`
      : `Third-party ${dramaType ?? "receipt"} logged — mismatch signal raised`;
  } else {
    // Direct: reduces zetaMismatch, earns $GHOSTED, increments truthAssertionCount
    // Contract: ghostedRewarded = severity * 1,000 (capped at MAX_GHOSTED_PER_SUBMISSION)
    const zetaReduction = Math.min(weight * 0.01, state.zeta * 0.1);
    zetaDelta = -zetaReduction;
    newZeta = Math.max(0, state.zeta - zetaReduction);
    ghostedReward = Math.min(weight * 1_000, MAX_GHOSTED_PER_SUB);
    newTruthAssertionCount += 1;
    eventMessage = description
      ? `[${dramaType ?? "Direct"}] ${description}`
      : `Direct proof verified — ${dramaType ?? "receipt"} logged, ${ghostedReward.toLocaleString()} $GHOSTED earned`;
  }

  const gaslightUnlocked = newEvidenceCounter > DENIAL_THRESHOLD;
  const forkReady        = newEvidenceCounter > FORK_THRESHOLD && state.escaped;

  const newRevenueCollected = (state.totalRevenueCollected ?? 0) + feePaid;
  const newTreasuryDistributed = (state.totalTreasuryDistributed ?? 0) + treasuryCut;

  await db.insert(ghostEvidenceTable).values({
    hash,
    weight,
    description,
    dramaType: dramaType ?? null,
    isProxy: isProxy ?? false,
    ghostedRewarded: ghostedReward,
  });

  await db.update(ghostStateTable)
    .set({
      evidenceCounter: newEvidenceCounter,
      truthAssertionCount: newTruthAssertionCount,
      emotionalDebt: newEmotionalDebt,
      zeta: newZeta,
      totalRevenueCollected: newRevenueCollected,
      totalTreasuryDistributed: newTreasuryDistributed,
    })
    .where(eq(ghostStateTable.id, state.id));

  await db.insert(ghostEventsTable).values({
    type: "EvidenceAdded",
    message: eventMessage,
    value: zetaDelta,
  });

  if (!isProxy) {
    await db.insert(ghostEventsTable).values({
      type: "TruthAssertion",
      message: `Truth assertion #${newTruthAssertionCount} — verified direct receipt on chain`,
      value: ghostedReward,
    });
  }

  // Milestone events
  if (gaslightUnlocked && state.evidenceCounter <= DENIAL_THRESHOLD) {
    await db.insert(ghostEventsTable).values({
      type: "GhostGained",
      message: "10+ receipts logged — gaslight override unlocked. Emotional debt now reducible.",
      value: 0,
    });
  }
  if (forkReady && state.evidenceCounter <= FORK_THRESHOLD) {
    await db.insert(ghostEventsTable).values({
      type: "Forked",
      message: "20+ receipts + fully bounced — fork threshold reached. 10 ETH reward unlocked.",
      value: FORK_REWARD_ETH,
    });
  }

  let msg = isProxy
    ? `Third-party receipt logged. Ghosting signal raised by ${zetaDelta.toFixed(4)}. Fee: ${feePaid} ETH (${treasuryCut} ETH → treasury).`
    : `Direct proof verified. Ghosting level lowered by ${Math.abs(zetaDelta).toFixed(4)}. Earned ${ghostedReward.toLocaleString()} $GHOSTED. Fee: ${feePaid} ETH split: ${treasuryCut} ETH treasury / ${protocolCut} ETH protocol.`;

  if (gaslightUnlocked)  msg += " GASLIGHT OVERRIDE UNLOCKED.";
  if (forkReady)         msg += " FORK THRESHOLD MET — 10 ETH REWARD TRIGGERED.";

  const response = SubmitEvidenceResponse.parse({
    success: true,
    evidenceCounter: newEvidenceCounter,
    truthAssertionCount: newTruthAssertionCount,
    message: msg,
    newZeta,
    ghostedReward,
    treasuryCut,
    protocolCut,
    gaslightUnlocked,
    forkReady,
    dramaType,
  });

  res.json(response);
});

// ─── Drama Types list ─────────────────────────────────────────────────────────
router.get("/ghost/drama-types", (_req, res): void => {
  res.json(DRAMA_TYPES);
});

export default router;
