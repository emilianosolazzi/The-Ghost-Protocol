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
  const newOmega = newZeta / (1 + newZeta);
  const scoreDiff = Math.abs(state.scoreYou - state.scoreHer);
  const scoreSum = state.scoreYou + state.scoreHer;
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
    isQuarantined: newOmega > 0.5,
    scoreYou: state.scoreYou,
    scoreHer: state.scoreHer,
    paused: state.paused,
  });

  res.json(response);
});

router.get("/ghost/metrics", async (_req, res): Promise<void> => {
  const basePrice = 0.000042;
  const fluctuation = 1 + (Math.random() - 0.5) * 0.04;
  const price = basePrice * fluctuation;
  const priceChange24h = (Math.random() - 0.3) * 30;

  const response = GetGhostMetricsResponse.parse({
    marketCap: price * 420_000_000_000,
    price,
    priceChange24h,
    volume24h: 8_300_000 + Math.random() * 2_000_000,
    holders: 142_337 + Math.floor(Math.random() * 50),
    totalSupply: 420_000_000_000,
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
  EvidenceAdded: [
    "Read receipt logged to the chain",
    "Screenshot accepted as proof",
    "Your receipt is now permanently on record",
  ],
  Anomaly: [
    "Red flag: triple text with zero response",
    "Red flag: message sent at 3am — no reply",
    "Unusual silence pattern detected — they saw it",
  ],
  GhostGained: [
    "Ghost holders rewarded — someone just got ghosted",
    "Treasury growing — more ignored texts incoming",
  ],
};

router.get("/ghost/timeline", async (_req, res): Promise<void> => {
  const dbEvents = await db.select().from(ghostEventsTable)
    .orderBy(desc(ghostEventsTable.createdAt))
    .limit(20);

  if (dbEvents.length < 5) {
    const types = ["DriftUpdated", "PhiUpdated", "EvidenceAdded", "Anomaly", "Locked", "GhostGained"] as const;
    const seedEvents = types.map((type, i) => ({
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

const TOP_HOLDERS = [
  { rank: 1, address: "0xDeAd...B33f", alias: "GhostWhale.eth", balance: 21_000_000_000, percentage: 5.0 },
  { rank: 2, address: "0xC0fF...eE01", alias: "ReadReceiptKing", balance: 16_800_000_000, percentage: 4.0 },
  { rank: 3, address: "0xAb5e...1337", alias: "LeftOnRead.eth", balance: 12_600_000_000, percentage: 3.0 },
  { rank: 4, address: "0xF4Ce...d00d", alias: "ZetaMaximalist", balance: 8_400_000_000, percentage: 2.0 },
  { rank: 5, address: "0x0000...0069", alias: "PhiCalculator", balance: 6_300_000_000, percentage: 1.5 },
  { rank: 6, address: "0xB4By...D01L", alias: "Anomaly7", balance: 4_200_000_000, percentage: 1.0 },
  { rank: 7, address: "0xC4Fe...BABE", alias: "NeverGhosted", balance: 2_940_000_000, percentage: 0.7 },
  { rank: 8, address: "0x5AaB...F00B", alias: "OmegaThreshold", balance: 2_100_000_000, percentage: 0.5 },
  { rank: 9, address: "0x1337...1337", alias: "EvidenceCollector", balance: 1_680_000_000, percentage: 0.4 },
  { rank: 10, address: "0xD4D4...D4D4", alias: "CompromisedSoul", balance: 1_260_000_000, percentage: 0.3 },
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

  const { hash, weight, description } = parsed.data;

  const existing = await db.select().from(ghostEvidenceTable)
    .where(eq(ghostEvidenceTable.hash, hash))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: "Evidence hash already submitted" });
    return;
  }

  await db.insert(ghostEvidenceTable).values({ hash, weight, description });

  const state = await ensureGhostState();
  const newEvidenceCounter = state.evidenceCounter + 1;
  const zetaReduction = Math.min(weight * 0.01, state.zeta * 0.1);
  const newZeta = Math.max(0, state.zeta - zetaReduction);

  await db.update(ghostStateTable)
    .set({ evidenceCounter: newEvidenceCounter, zeta: newZeta })
    .where(eq(ghostStateTable.id, state.id));

  await db.insert(ghostEventsTable).values({
    type: "EvidenceAdded",
    message: description ?? `Evidence ${hash.slice(0, 8)}... submitted`,
    value: weight,
  });

  const response = SubmitEvidenceResponse.parse({
    success: true,
    evidenceCounter: newEvidenceCounter,
    message: `Evidence accepted. Zeta reduced by ${zetaReduction.toFixed(4)}`,
    newZeta,
  });

  res.json(response);
});

export default router;
