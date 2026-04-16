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

// Contract constants
const TOTAL_SUPPLY = 1_000_000_000;       // 1B $GHOSTED
const DENIAL_THRESHOLD = 10;              // evidenceCounter > 10 → gaslightUnlocked
const FORK_THRESHOLD = 20;               // evidenceCounter > 20 → forkReady
const LOCK_REWARD_ETH = 1;              // ETH paid when Locked triggers
const COMPROMISE_REWARD_ETH = 5;        // ETH paid when Compromised triggers
const ESCAPE_REWARD_ETH = 2;           // ETH paid when Escaped triggers
const FORK_REWARD_ETH = 10;            // ETH paid when Forked triggers
const VRF_LEGENDARY_REWARD = 1_000_000; // $GHOSTED for token #70

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
      totalRewardsPaid: 13,
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
  const newPhi = Math.min(state.phi + newZeta * 0.0005, 1.0);
  // omega() = zeta / (1 + zeta) — matches contract formula
  const newOmega = newZeta / (1 + newZeta);
  const scoreDiff = Math.abs(state.scoreYou - state.scoreHer);
  const scoreSum = state.scoreYou + state.scoreHer;
  // coupling() = abs(scoreYou, scoreHer) * SCALE / (scoreYou + scoreHer) — normalized to 0-1
  const newCoupling = scoreSum === 0 ? 0 : scoreDiff / scoreSum;

  return { newZeta, newPhi, newOmega, newCoupling };
}

router.get("/ghost/state", async (req, res): Promise<void> => {
  const state = await ensureGhostState();
  const { newZeta, newPhi, newOmega, newCoupling } = simulateDrift(state);

  await db.update(ghostStateTable)
    .set({ zeta: newZeta, phi: newPhi, omega: newOmega, coupling: newCoupling })
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
    anomalyCount: state.anomalyCount,
    evidenceCounter: state.evidenceCounter,
    totalRewardsPaid: state.totalRewardsPaid,
    // isQuarantined = omega() > OMEGA_THRESHOLD (0.5)
    isQuarantined: newOmega > 0.5,
    scoreYou: state.scoreYou,
    scoreHer: state.scoreHer,
    paused: state.paused,
  });

  res.json(response);
});

router.get("/ghost/metrics", async (_req, res): Promise<void> => {
  // $GHOSTED: 1B supply, price $0.420 → ~$420M market cap (420 narrative)
  const basePrice = 0.420;
  const fluctuation = 1 + (Math.random() - 0.5) * 0.04;
  const price = basePrice * fluctuation;
  const priceChange24h = (Math.random() - 0.3) * 30;

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
  });

  res.json(response);
});

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
    "They have officially left the chat",
    "They bounced — no explanation given",
  ],
  Forked: [
    "It's over — contract has forked, 10 ETH reward released",
    "The relationship is officially on-chain history",
  ],
  EvidenceAdded: [
    "Direct receipt logged — ghosting level reduced",
    "Screenshot accepted as proof — mismatch corrected",
    "Your receipt is now permanently on record",
  ],
  Anomaly: [
    "Red flag: triple text with zero response",
    "Red flag: message sent at 3am — no reply",
    "Unusual silence pattern detected — they saw it",
  ],
  GhostGained: [
    "$GHOSTED holders rewarded — someone just got ghosted",
    "Treasury growing — more ignored texts incoming",
  ],
};

router.get("/ghost/timeline", async (_req, res): Promise<void> => {
  const dbEvents = await db.select().from(ghostEventsTable)
    .orderBy(desc(ghostEventsTable.createdAt))
    .limit(20);

  if (dbEvents.length < 5) {
    const types = ["DriftUpdated", "PhiUpdated", "EvidenceAdded", "Anomaly", "Locked", "GhostGained"] as const;
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
      id: String(e.id),
      type: e.type,
      timestamp: e.createdAt.toISOString(),
      message: e.message,
      value: e.value ?? undefined,
    }))));
    return;
  }

  res.json(GetGhostTimelineResponse.parse(dbEvents.map(e => ({
    id: String(e.id),
    type: e.type,
    timestamp: e.createdAt.toISOString(),
    message: e.message,
    value: e.value ?? undefined,
  }))));
});

// Top holders: % of 1B $GHOSTED supply
const TOP_HOLDERS = [
  { rank: 1,  address: "0xDeAd...B33f", alias: "GhostWhale.eth",      balance: 50_000_000,  percentage: 0.05 },
  { rank: 2,  address: "0xC0fF...eE01", alias: "ReadReceiptKing",     balance: 40_000_000,  percentage: 0.04 },
  { rank: 3,  address: "0xAb5e...1337", alias: "LeftOnRead.eth",      balance: 30_000_000,  percentage: 0.03 },
  { rank: 4,  address: "0xF4Ce...d00d", alias: "DetectionEntropy",    balance: 20_000_000,  percentage: 0.02 },
  { rank: 5,  address: "0x0000...0069", alias: "EvidenceMaximalist",  balance: 15_000_000,  percentage: 0.015 },
  { rank: 6,  address: "0xB4By...D01L", alias: "Anomaly7",            balance: 10_000_000,  percentage: 0.01 },
  { rank: 7,  address: "0xC4Fe...BABE", alias: "NeverGhosted",        balance: 7_000_000,   percentage: 0.007 },
  { rank: 8,  address: "0x5AaB...F00B", alias: "GaslightSlayer",      balance: 5_000_000,   percentage: 0.005 },
  { rank: 9,  address: "0x1337...1337", alias: "EvidenceCollector",   balance: 4_000_000,   percentage: 0.004 },
  { rank: 10, address: "0xD4D4...D4D4", alias: "Token70Holder",       balance: 1_000_000,   percentage: 0.001 },
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

router.post("/ghost/submit-evidence", async (req, res): Promise<void> => {
  const parsed = SubmitEvidenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { hash, weight, description, isProxy } = parsed.data;

  const existing = await db.select().from(ghostEvidenceTable)
    .where(eq(ghostEvidenceTable.hash, hash))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: "Evidence hash already submitted — each proof hash can only be logged once" });
    return;
  }

  await db.insert(ghostEvidenceTable).values({ hash, weight, description });

  const state = await ensureGhostState();
  const newEvidenceCounter = state.evidenceCounter + 1;

  let newZeta: number;
  let zetaDelta: number;
  let eventMessage: string;

  if (isProxy) {
    // Proxy evidence: raises zetaMismatch (hearsay/third-party report amplifies uncertainty)
    // Matches contract: zetaMismatch += debtImpact / 2  where debtImpact = weight * proxyFactor / SCALE
    zetaDelta = weight * 0.005;
    newZeta = Math.min(1.0, state.zeta + zetaDelta);
    eventMessage = description ?? `Third-party receipt logged — ghosting signal intensified`;
  } else {
    // Direct evidence: reduces zetaMismatch (honest on-chain proof lowers drift)
    // Matches contract: reduction = weight > zetaMismatch ? zetaMismatch : weight (if !locked)
    const zetaReduction = Math.min(weight * 0.01, state.zeta * 0.1);
    zetaDelta = -zetaReduction;
    newZeta = Math.max(0, state.zeta - zetaReduction);
    eventMessage = description ?? `Direct receipt ${hash.slice(0, 8)}... logged — ghosting level reduced`;
  }

  // $GHOSTED reward: direct evidence earns more (rewards honest detection entropy)
  // Proxy earns zero — the contract doesn't mint for unverified hearsay
  const ghostedReward = isProxy ? 0 : Math.floor(weight * 1000);

  const gaslightUnlocked = newEvidenceCounter > DENIAL_THRESHOLD;
  const forkReady = newEvidenceCounter > FORK_THRESHOLD;

  await db.update(ghostStateTable)
    .set({ evidenceCounter: newEvidenceCounter, zeta: newZeta })
    .where(eq(ghostStateTable.id, state.id));

  await db.insert(ghostEventsTable).values({
    type: "EvidenceAdded",
    message: eventMessage,
    value: zetaDelta,
  });

  // Milestone events
  if (gaslightUnlocked && state.evidenceCounter <= DENIAL_THRESHOLD) {
    await db.insert(ghostEventsTable).values({
      type: "GhostGained",
      message: "10+ receipts logged — gaslight override unlocked. Emotional debt reducible.",
      value: 0,
    });
  }
  if (forkReady && state.evidenceCounter <= FORK_THRESHOLD) {
    await db.insert(ghostEventsTable).values({
      type: "Forked",
      message: "20+ receipts on record — fork threshold reached. 10 ETH fork reward unlocked.",
      value: FORK_REWARD_ETH,
    });
  }

  const responseMessage = isProxy
    ? `Third-party receipt logged. Ghosting level raised by ${zetaDelta.toFixed(4)} — hearsay amplifies uncertainty.`
    : `Direct receipt accepted. Ghosting level lowered by ${Math.abs(zetaDelta).toFixed(4)}. ${ghostedReward.toLocaleString()} $GHOSTED earned.${gaslightUnlocked ? " GASLIGHT OVERRIDE UNLOCKED." : ""}${forkReady ? " FORK THRESHOLD REACHED." : ""}`;

  const response = SubmitEvidenceResponse.parse({
    success: true,
    evidenceCounter: newEvidenceCounter,
    message: responseMessage,
    newZeta,
    ghostedReward,
    gaslightUnlocked,
    forkReady,
  });

  res.json(response);
});

export default router;
