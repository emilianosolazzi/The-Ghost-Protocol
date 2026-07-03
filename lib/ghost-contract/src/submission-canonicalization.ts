export type GhostSubmissionArchiveEntryInput = {
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
};

export type GhostSubmissionArchiveCanonicalPayload = {
  version: 1;
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
};

export type EvidenceProofHashInput = {
  severity: number;
  description: string;
  dramaType: string;
  contentCid: string;
  isProxy: boolean;
  submitter?: string | null;
  salt?: string | null;
};

export type EvidenceProofHashCanonicalPayload = {
  version: 1;
  severity: number;
  description: string;
  dramaType: string;
  contentCid: string;
  isProxy: boolean;
  submitter: string | null;
  salt: string;
};

export function canonicalizeGhostSubmissionArchiveEntry(
  entry: GhostSubmissionArchiveEntryInput,
): GhostSubmissionArchiveCanonicalPayload {
  return {
    version: 1,
    submitter: entry.submitter.toLowerCase(),
    proofHash: entry.proofHash.toLowerCase(),
    txHash: entry.txHash.toLowerCase(),
    severity: Math.trunc(entry.severity),
    description: entry.description,
    dramaType: entry.dramaType.trim().length > 0 ? entry.dramaType.trim() : "general",
    contentCid: entry.contentCid.trim(),
    isProxy: entry.isProxy,
    reward: entry.reward,
    chainId: entry.chainId === null ? null : Math.trunc(entry.chainId),
    submittedAt: Math.trunc(entry.submittedAt),
  };
}

export function buildGhostSubmissionArchiveMessage(entry: GhostSubmissionArchiveEntryInput) {
  return `GhostProtocol archive submission\n${JSON.stringify(canonicalizeGhostSubmissionArchiveEntry(entry))}`;
}

export function canonicalizeEvidenceProofHashInput(
  input: EvidenceProofHashInput,
): EvidenceProofHashCanonicalPayload {
  const submitter = input.submitter && input.submitter.trim().length > 0
    ? input.submitter.trim().toLowerCase()
    : null;

  return {
    version: 1,
    severity: Math.trunc(input.severity),
    description: input.description.trim(),
    dramaType: input.dramaType.trim().length > 0 ? input.dramaType.trim() : "general",
    contentCid: input.contentCid.trim(),
    isProxy: input.isProxy,
    submitter,
    salt: input.salt?.trim() ?? "",
  };
}

export function buildEvidenceProofHashMessage(input: EvidenceProofHashInput) {
  return `GhostProtocol evidence fingerprint\n${JSON.stringify(canonicalizeEvidenceProofHashInput(input))}`;
}
