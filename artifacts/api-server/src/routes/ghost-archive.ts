import { Router, type IRouter, type NextFunction } from "express";
import { desc, eq } from "drizzle-orm";
import { verifyMessage, type Hex } from "viem";
import { db, ghostSubmissionArchiveTable } from "@workspace/db";
import {
  GhostArchiveVerificationError,
  verifyGhostArchiveSubmissionTransaction,
} from "../lib/ghost-archive-verifier";

const router: IRouter = Router();

const addressPattern = /^0x[a-fA-F0-9]{40}$/;
const hashPattern = /^0x[a-fA-F0-9]{64}$/;
const signaturePattern = /^0x[a-fA-F0-9]{130}$/;

type GhostSubmissionArchiveRow = typeof ghostSubmissionArchiveTable.$inferSelect;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseSubmitter(value: unknown) {
  return typeof value === "string" && addressPattern.test(value) ? value.toLowerCase() : null;
}

function parseHash(value: unknown) {
  return typeof value === "string" && hashPattern.test(value) ? value : null;
}

function parseSignature(value: unknown) {
  return typeof value === "string" && signaturePattern.test(value) ? (value as Hex) : null;
}

function buildGhostSubmissionArchiveMessage(entry: {
  submitter: string;
  proofHash: string;
  txHash: string;
  severity: number;
  description: string;
  dramaType: string;
  contentCid: string;
  isProxy: boolean;
  reward: number;
  chainId: number | null;
  submittedAt: number;
}) {
  return `GhostProtocol archive submission\n${JSON.stringify({
    version: 1,
    submitter: entry.submitter,
    proofHash: entry.proofHash,
    txHash: entry.txHash,
    severity: entry.severity,
    description: entry.description,
    dramaType: entry.dramaType,
    contentCid: entry.contentCid,
    isProxy: entry.isProxy,
    reward: entry.reward,
    chainId: entry.chainId,
    submittedAt: entry.submittedAt,
  })}`;
}

router.get("/ghost-archive/submissions", async (req, res): Promise<void> => {
  const submitter = parseSubmitter(req.query.submitter);

  if (!submitter) {
    res.status(400).json({ error: "A valid submitter address is required." });
    return;
  }

  const rows: GhostSubmissionArchiveRow[] = await db
    .select()
    .from(ghostSubmissionArchiveTable)
    .where(eq(ghostSubmissionArchiveTable.submitterAddress, submitter))
    .orderBy(desc(ghostSubmissionArchiveTable.submittedAt))
    .limit(50);

  res.json({
    submissions: rows.map((row) => ({
      submitter: row.submitterAddress,
      proofHash: row.proofHash,
      txHash: row.txHash,
      severity: row.severity,
      description: row.description,
      dramaType: row.dramaType,
      contentCid: row.contentCid ?? "",
      isProxy: row.isProxy,
      reward: row.reward,
      chainId: row.chainId,
      submittedAt: row.submittedAt.getTime(),
    })),
  });
});

router.post("/ghost-archive/submissions", async (req, res, next: NextFunction): Promise<void> => {
  const submitter = parseSubmitter(req.body.submitter);
  const proofHash = parseHash(req.body.proofHash);
  const txHash = parseHash(req.body.txHash);
  const signature = parseSignature(req.body.signature);
  const severity = isFiniteNumber(req.body.severity) ? Math.trunc(req.body.severity) : null;
  const reward = isFiniteNumber(req.body.reward) ? req.body.reward : null;
  const description = typeof req.body.description === "string" ? req.body.description : "";
  const dramaType = typeof req.body.dramaType === "string" && req.body.dramaType.trim().length > 0
    ? req.body.dramaType.trim()
    : "general";
  const contentCid = typeof req.body.contentCid === "string" ? req.body.contentCid : "";
  const isProxy = typeof req.body.isProxy === "boolean" ? req.body.isProxy : false;
  const chainId = req.body.chainId === null || req.body.chainId === undefined
    ? null
    : isFiniteNumber(req.body.chainId)
      ? Math.trunc(req.body.chainId)
      : null;
  const submittedAt = isFiniteNumber(req.body.submittedAt)
    ? new Date(req.body.submittedAt)
    : new Date();

  if (!submitter || !proofHash || !txHash || !signature) {
    res.status(400).json({ error: "submitter, proofHash, txHash, and signature must be valid hex values." });
    return;
  }

  if (severity === null || severity < 1 || severity > 100) {
    res.status(400).json({ error: "severity must be an integer between 1 and 100." });
    return;
  }

  if (reward === null || reward < 0) {
    res.status(400).json({ error: "reward must be a non-negative number." });
    return;
  }

  if (Number.isNaN(submittedAt.getTime())) {
    res.status(400).json({ error: "submittedAt must be a valid Unix timestamp in milliseconds." });
    return;
  }

  const submittedAtMs = submittedAt.getTime();
  const archiveMessage = buildGhostSubmissionArchiveMessage({
    submitter,
    proofHash,
    txHash,
    severity,
    description,
    dramaType,
    contentCid,
    isProxy,
    reward,
    chainId,
    submittedAt: submittedAtMs,
  });

  const isValidSignature = await verifyMessage({
    address: submitter as `0x${string}`,
    message: archiveMessage,
    signature,
  });

  if (!isValidSignature) {
    res.status(401).json({ error: "Archive signature verification failed." });
    return;
  }

  let verifiedArchive;
  try {
    verifiedArchive = await verifyGhostArchiveSubmissionTransaction({
      submitter,
      proofHash,
      txHash,
      severity,
      description,
      dramaType,
      contentCid,
      isProxy,
      reward,
      chainId,
    });
  } catch (error) {
    if (error instanceof GhostArchiveVerificationError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    next(error);
    return;
  }

  const upsertPayload = {
    submitterAddress: submitter,
    proofHash,
    severity,
    description,
    dramaType,
    contentCid,
    isProxy,
    reward: verifiedArchive.reward,
    chainId: verifiedArchive.chainId,
    submittedAt,
  } satisfies Omit<typeof ghostSubmissionArchiveTable.$inferInsert, "txHash">;

  const [stored] = await db
    .insert(ghostSubmissionArchiveTable)
    .values({
      ...upsertPayload,
      txHash,
    })
    .onConflictDoUpdate({
      target: ghostSubmissionArchiveTable.txHash,
      set: upsertPayload,
    })
    .returning();

  res.status(201).json({
    submission: {
      submitter: stored.submitterAddress,
      proofHash: stored.proofHash,
      txHash: stored.txHash,
      severity: stored.severity,
      description: stored.description,
      dramaType: stored.dramaType,
      isProxy: stored.isProxy,
      reward: stored.reward,
      chainId: stored.chainId,
      contentCid: stored.contentCid ?? "",
      submittedAt: stored.submittedAt.getTime(),
    },
  });
});

export default router;