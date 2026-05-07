import { getAddress, isAddress, type Address, type Hash, type Hex, type WalletClient } from "viem";
import { getGhostProtocolConfig } from "@/lib/ghost-protocol-config";

export type GhostSubmissionArchiveEntry = {
  submitter: Address;
  proofHash: Hex;
  txHash: Hash;
  severity: number;
  description: string;
  dramaType: string;
  contentCid: string;
  isProxy: boolean;
  reward: number;
  chainId: number | null;
  submittedAt: number;
};

type GhostSubmissionArchivePayload = {
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

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isHex64(value: unknown): value is `0x${string}` {
  return typeof value === "string" && /^0x[a-fA-F0-9]{64}$/.test(value);
}

export function normaliseGhostSubmissionArchiveEntry(value: unknown): GhostSubmissionArchiveEntry | null {
  if (!isObject(value)) {
    return null;
  }

  const submitterValue = value.submitter;
  const proofHashValue = value.proofHash;
  const txHashValue = value.txHash;
  const severityValue = value.severity;
  const rewardValue = value.reward;
  const submittedAtValue = value.submittedAt;

  if (!isAddress(typeof submitterValue === "string" ? submitterValue : "")) {
    return null;
  }

  if (!isHex64(proofHashValue) || !isHex64(txHashValue)) {
    return null;
  }

  if (typeof severityValue !== "number" || !Number.isFinite(severityValue)) {
    return null;
  }

  if (typeof rewardValue !== "number" || !Number.isFinite(rewardValue)) {
    return null;
  }

  if (typeof submittedAtValue !== "number" || !Number.isFinite(submittedAtValue)) {
    return null;
  }

  const chainIdValue = value.chainId;

  return {
    submitter: getAddress(submitterValue as string),
    proofHash: proofHashValue,
    txHash: txHashValue,
    severity: Math.trunc(severityValue),
    description: typeof value.description === "string" ? value.description : "",
    dramaType: typeof value.dramaType === "string" && value.dramaType.trim().length > 0
      ? value.dramaType.trim()
      : "general",
    contentCid: typeof value.contentCid === "string" ? value.contentCid : "",
    isProxy: typeof value.isProxy === "boolean" ? value.isProxy : false,
    reward: rewardValue,
    chainId: typeof chainIdValue === "number" && Number.isFinite(chainIdValue)
      ? Math.trunc(chainIdValue)
      : null,
    submittedAt: submittedAtValue,
  };
}

function canonicaliseGhostSubmissionArchiveEntry(entry: GhostSubmissionArchiveEntry): GhostSubmissionArchivePayload {
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

export function buildGhostSubmissionArchiveMessage(entry: GhostSubmissionArchiveEntry) {
  return `GhostProtocol archive submission\n${JSON.stringify(canonicaliseGhostSubmissionArchiveEntry(entry))}`;
}

function getGhostArchiveApiUrl() {
  const configuredUrl = import.meta.env.VITE_GHOST_ARCHIVE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const contractConfig = getGhostProtocolConfig();
  if (contractConfig.chainId === 31337) {
    return "http://127.0.0.1:3000/api/ghost-archive";
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin.replace(/\/+$/, "")}/api/ghost-archive`;
  }

  return "/api/ghost-archive";
}

export async function fetchGhostSubmissionArchive(submitter: Address) {
  const response = await fetch(
    `${getGhostArchiveApiUrl()}/submissions?submitter=${encodeURIComponent(submitter)}`,
  );

  if (!response.ok) {
    throw new Error(`Archive request failed with status ${response.status}.`);
  }

  const payload = await response.json() as { submissions?: unknown };
  if (!Array.isArray(payload.submissions)) {
    return [];
  }

  return payload.submissions
    .map(normaliseGhostSubmissionArchiveEntry)
    .filter((entry): entry is GhostSubmissionArchiveEntry => entry !== null);
}

export async function saveGhostSubmissionArchive(
  entry: GhostSubmissionArchiveEntry,
  walletClient: WalletClient,
) {
  const payload = canonicaliseGhostSubmissionArchiveEntry(entry);
  const signature = await walletClient.signMessage({
    account: entry.submitter,
    message: buildGhostSubmissionArchiveMessage(entry),
  });

  const response = await fetch(`${getGhostArchiveApiUrl()}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(`Archive write failed with status ${response.status}.`);
  }
}