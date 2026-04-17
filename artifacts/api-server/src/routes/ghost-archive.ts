import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, ghostSubmissionArchiveTable } from "@workspace/db";

const router: IRouter = Router();

const addressPattern = /^0x[a-fA-F0-9]{40}$/;
const hashPattern = /^0x[a-fA-F0-9]{64}$/;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseSubmitter(value: unknown) {
  return typeof value === "string" && addressPattern.test(value) ? value.toLowerCase() : null;
}

function parseHash(value: unknown) {
  return typeof value === "string" && hashPattern.test(value) ? value : null;
}

router.get("/ghost-archive/submissions", async (req, res): Promise<void> => {
  const submitter = parseSubmitter(req.query.submitter);

  if (!submitter) {
    res.status(400).json({ error: "A valid submitter address is required." });
    return;
  }

  const rows = await db
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
      isProxy: row.isProxy,
      reward: row.reward,
      chainId: row.chainId,
      submittedAt: row.submittedAt.getTime(),
    })),
  });
});

router.post("/ghost-archive/submissions", async (req, res): Promise<void> => {
  const submitter = parseSubmitter(req.body.submitter);
  const proofHash = parseHash(req.body.proofHash);
  const txHash = parseHash(req.body.txHash);
  const severity = isFiniteNumber(req.body.severity) ? Math.trunc(req.body.severity) : null;
  const reward = isFiniteNumber(req.body.reward) ? req.body.reward : null;
  const description = typeof req.body.description === "string" ? req.body.description : "";
  const dramaType = typeof req.body.dramaType === "string" && req.body.dramaType.trim().length > 0
    ? req.body.dramaType.trim()
    : "general";
  const isProxy = typeof req.body.isProxy === "boolean" ? req.body.isProxy : false;
  const chainId = req.body.chainId === null || req.body.chainId === undefined
    ? null
    : isFiniteNumber(req.body.chainId)
      ? Math.trunc(req.body.chainId)
      : null;
  const submittedAt = isFiniteNumber(req.body.submittedAt)
    ? new Date(req.body.submittedAt)
    : new Date();

  if (!submitter || !proofHash || !txHash) {
    res.status(400).json({ error: "submitter, proofHash, and txHash must be valid hex values." });
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

  const [stored] = await db
    .insert(ghostSubmissionArchiveTable)
    .values({
      submitterAddress: submitter,
      proofHash,
      txHash,
      severity,
      description,
      dramaType,
      isProxy,
      reward,
      chainId,
      submittedAt,
    })
    .onConflictDoUpdate({
      target: ghostSubmissionArchiveTable.txHash,
      set: {
        submitterAddress: submitter,
        proofHash,
        severity,
        description,
        dramaType,
        isProxy,
        reward,
        chainId,
        submittedAt,
      },
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
      submittedAt: stored.submittedAt.getTime(),
    },
  });
});

export default router;