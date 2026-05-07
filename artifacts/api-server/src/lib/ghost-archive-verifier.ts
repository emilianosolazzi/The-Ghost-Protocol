import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  ghostProtocolAbi,
  ghostProtocolUiConstants,
} from "@workspace/ghost-contract";
import {
  createPublicClient,
  decodeFunctionData,
  getAddress,
  http,
  isAddress,
  isAddressEqual,
  parseEventLogs,
  type Address,
  type Hex,
} from "viem";

type GhostArchiveVerificationPayload = {
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
};

type GhostProtocolRuntimeConfig = {
  address: Address;
  rpcUrl: string;
  chainId: number | null;
};

type GhostArchiveVerificationResult = {
  reward: number;
  chainId: number | null;
};

let cachedRuntimeConfig: GhostProtocolRuntimeConfig | undefined;

export class GhostArchiveVerificationError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "GhostArchiveVerificationError";
    this.statusCode = statusCode;
  }
}

function parsePositiveInteger(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function findWorkspaceRoot() {
  let currentDirectory = process.cwd();

  while (true) {
    if (existsSync(path.join(currentDirectory, "pnpm-workspace.yaml"))) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      return null;
    }

    currentDirectory = parentDirectory;
  }
}

function readEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return {} as Record<string, string>;
  }

  const content = readFileSync(filePath, "utf8");
  const values: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

function readWorkspaceEnv() {
  const workspaceRoot = findWorkspaceRoot();
  if (!workspaceRoot) {
    return {} as Record<string, string>;
  }

  return {
    ...readEnvFile(path.join(workspaceRoot, ".env")),
    ...readEnvFile(path.join(workspaceRoot, ".env.local")),
  };
}

function firstConfiguredValue(env: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const processValue = process.env[key]?.trim();
    if (processValue) {
      return processValue;
    }

    const envFileValue = env[key]?.trim();
    if (envFileValue) {
      return envFileValue;
    }
  }

  return null;
}

function getRuntimeConfig(): GhostProtocolRuntimeConfig {
  if (cachedRuntimeConfig) {
    return cachedRuntimeConfig;
  }

  const env = readWorkspaceEnv();
  const rawAddress = firstConfiguredValue(env, ["GHOST_PROTOCOL_ADDRESS", "VITE_GHOST_PROTOCOL_ADDRESS"]);
  const rawRpcUrl = firstConfiguredValue(env, ["GHOST_PROTOCOL_RPC_URL", "VITE_GHOST_PROTOCOL_RPC_URL"]);
  const rawChainId = firstConfiguredValue(env, ["GHOST_PROTOCOL_CHAIN_ID", "VITE_GHOST_PROTOCOL_CHAIN_ID"]);

  if (!rawAddress || !isAddress(rawAddress) || !rawRpcUrl) {
    throw new GhostArchiveVerificationError(
      "Archive on-chain verification is not configured. Set GHOST_PROTOCOL_ADDRESS and GHOST_PROTOCOL_RPC_URL.",
      503,
    );
  }

  cachedRuntimeConfig = {
    address: getAddress(rawAddress),
    rpcUrl: rawRpcUrl,
    chainId: parsePositiveInteger(rawChainId ?? undefined),
  };

  return cachedRuntimeConfig;
}

function normaliseText(value: string) {
  return value.trim();
}

export async function verifyGhostArchiveSubmissionTransaction(
  payload: GhostArchiveVerificationPayload,
): Promise<GhostArchiveVerificationResult> {
  const config = getRuntimeConfig();

  if (payload.chainId !== null && config.chainId !== null && payload.chainId !== config.chainId) {
    throw new GhostArchiveVerificationError(
      `Archive chainId ${payload.chainId} does not match configured chain ${config.chainId}.`,
      400,
    );
  }

  const client = createPublicClient({
    transport: http(config.rpcUrl),
  });

  let transaction;
  let receipt;

  try {
    [transaction, receipt] = await Promise.all([
      client.getTransaction({ hash: payload.txHash as Hex }),
      client.getTransactionReceipt({ hash: payload.txHash as Hex }),
    ]);
  } catch {
    throw new GhostArchiveVerificationError(
      "Could not find the submitted transaction on the configured chain.",
      400,
    );
  }

  if (receipt.status !== "success") {
    throw new GhostArchiveVerificationError("Archive transaction did not succeed on-chain.", 400);
  }

  if (!transaction.to || !isAddressEqual(transaction.to, config.address)) {
    throw new GhostArchiveVerificationError("Archive transaction was not sent to the configured GhostProtocol contract.", 400);
  }

  if (!isAddressEqual(transaction.from, payload.submitter as Address)) {
    throw new GhostArchiveVerificationError("Archive transaction sender does not match the signed submitter address.", 400);
  }

  if (transaction.value !== ghostProtocolUiConstants.receiptFeeEth) {
    throw new GhostArchiveVerificationError("Archive transaction value does not match the configured GhostProtocol receipt fee.", 400);
  }

  const decodedCall = decodeFunctionData({
    abi: ghostProtocolAbi,
    data: transaction.input,
  });

  if (decodedCall.functionName !== "submitEvidence") {
    throw new GhostArchiveVerificationError("Archive transaction is not a GhostProtocol submitEvidence call.", 400);
  }

  const [
    proofHash,
    severity,
    description,
    dramaType,
    contentCid,
    isProxy,
  ] = decodedCall.args as readonly [Hex, bigint, string, string, string, boolean];

  if (proofHash.toLowerCase() !== payload.proofHash.toLowerCase()) {
    throw new GhostArchiveVerificationError("Archive proofHash does not match the on-chain submitEvidence call.", 400);
  }

  if (severity !== BigInt(payload.severity)) {
    throw new GhostArchiveVerificationError("Archive severity does not match the on-chain submitEvidence call.", 400);
  }

  if (description !== payload.description) {
    throw new GhostArchiveVerificationError("Archive description does not match the on-chain submitEvidence call.", 400);
  }

  if (normaliseText(dramaType) !== normaliseText(payload.dramaType)) {
    throw new GhostArchiveVerificationError("Archive dramaType does not match the on-chain submitEvidence call.", 400);
  }

  if (normaliseText(contentCid) !== normaliseText(payload.contentCid)) {
    throw new GhostArchiveVerificationError("Archive contentCid does not match the on-chain submitEvidence call.", 400);
  }

  if (isProxy !== payload.isProxy) {
    throw new GhostArchiveVerificationError("Archive isProxy flag does not match the on-chain submitEvidence call.", 400);
  }

  const evidenceLogs = parseEventLogs({
    abi: ghostProtocolAbi,
    eventName: "EvidenceSubmitted",
    logs: receipt.logs,
  });
  const receiptLogs = parseEventLogs({
    abi: ghostProtocolAbi,
    eventName: "GhostingReceiptSubmitted",
    logs: receipt.logs,
  });

  const matchingEvidenceLog = evidenceLogs.find((log) => {
    const args = log.args;
    return Boolean(
      args.proofHash &&
      args.submitter &&
      args.severity !== undefined &&
      args.isProxy !== undefined &&
      args.dramaType !== undefined &&
      args.ghostedRewarded !== undefined &&
      args.proofHash.toLowerCase() === payload.proofHash.toLowerCase() &&
      isAddressEqual(args.submitter, payload.submitter as Address) &&
      args.severity === BigInt(payload.severity) &&
      args.isProxy === payload.isProxy &&
      normaliseText(args.dramaType) === normaliseText(payload.dramaType)
    );
  });

  if (!matchingEvidenceLog) {
    throw new GhostArchiveVerificationError("Archive transaction receipt is missing the expected EvidenceSubmitted event.", 400);
  }

  const matchingReceiptLog = receiptLogs.find((log) => {
    const args = log.args;
    return Boolean(
      args.submitter &&
      args.proofHash &&
      args.feePaid !== undefined &&
      isAddressEqual(args.submitter, payload.submitter as Address) &&
      args.proofHash.toLowerCase() === payload.proofHash.toLowerCase() &&
      args.feePaid === ghostProtocolUiConstants.receiptFeeEth
    );
  });

  if (!matchingReceiptLog) {
    throw new GhostArchiveVerificationError("Archive transaction receipt is missing the expected GhostingReceiptSubmitted event.", 400);
  }

  const onChainReward = Number((matchingEvidenceLog.args.ghostedRewarded ?? 0n) / 10n ** 18n);
  if (onChainReward !== payload.reward) {
    throw new GhostArchiveVerificationError("Archive reward does not match the on-chain evidence reward.", 400);
  }

  return {
    reward: onChainReward,
    chainId: payload.chainId ?? config.chainId,
  };
}