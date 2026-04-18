import {
  ghostProtocolAbi,
  ghostProtocolUiConstants,
} from "@workspace/ghost-contract";
import {
  createPublicClient,
  formatEther,
  formatUnits,
  http,
  type Address,
  type Hash,
  type Hex,
  type WalletClient,
} from "viem";
import { getGhostProtocolChain, getGhostProtocolConfig, type GhostProtocolRuntimeConfig } from "@/lib/ghost-protocol-config";

const ghostedTokenAbi = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "holder", type: "address" }],
    name: "credibilityScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type GhostProtocolDeployment = GhostProtocolRuntimeConfig & {
  hasBytecode: boolean;
};

export type GhostProtocolStats = {
  totalEvidence: number;
  directEvidence: number;
  proxyEvidence: number;
  totalTruthAssertions: number;
  rewardedGhosted: bigint;
  burnedGhosted: bigint;
  revenueCollected: bigint;
  treasuryDistributed: bigint;
  protocolRetainedRevenue: bigint;
  protocolWithdrawn: bigint;
  protocolBalance: bigint;
  gaslightUnlocked: boolean;
  isPaused: boolean;
};

export type GhostEvidenceRecord = {
  proofHash: Hex;
  timestamp: number;
  weight: number;
  isProxy: boolean;
  descriptionHash: Hex;
  dramaType: string;
  contentCid: string;
  submitter: Address;
  ghostedRewarded: bigint;
};

export type GhostStoryInfo = {
  unlockPriceTokens: bigint;
  timesUnlocked: number;
  isPublic: boolean;
  totalEarnedTokens: bigint;
  submitter: Address;
  severity: number;
};

export type GhostStoryPayoutInfo = {
  tokenPayouts: bigint;
  ethPayouts: bigint;
  currentEthUnlockPrice: bigint;
};

export type GhostStorySnapshot = {
  evidence: GhostEvidenceRecord;
  story: GhostStoryInfo;
  payouts: GhostStoryPayoutInfo;
  truthAssertionCount: number;
  hasUnlocked: boolean;
  canAccess: boolean;
};

export type GhostedWalletState = {
  tokenAddress: Address;
  balance: bigint;
  ethBalance: bigint;
  allowance: bigint;
  tokenCredibilityScore: bigint;
  protocolCredibilityScore: bigint;
  effectiveCredibilityScore: bigint;
};

export type SubmitEvidenceInput = {
  proofHash: Hex;
  severity: number;
  description: string;
  dramaType: string;
  contentCid: string;
  isProxy: boolean;
};

function assertConfiguredConfig() {
  const config = getGhostProtocolConfig();
  if (!config.address || !config.rpcUrl) {
    throw new Error("Set VITE_GHOST_PROTOCOL_ADDRESS and VITE_GHOST_PROTOCOL_RPC_URL before using the contract UI.");
  }

  return config as GhostProtocolRuntimeConfig & { address: Address; rpcUrl: string };
}

function getPublicClient() {
  const config = assertConfiguredConfig();
  return createPublicClient({
    chain: getGhostProtocolChain() ?? undefined,
    transport: http(config.rpcUrl),
  });
}

function truncateFraction(value: string, maximumFractionDigits: number) {
  const [whole, fraction = ""] = value.split(".");
  const trimmedFraction = fraction.slice(0, maximumFractionDigits).replace(/0+$/, "");
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

export function isProofHash(value: string): value is Hex {
  return /^0x[a-fA-F0-9]{64}$/.test(value.trim());
}

export function formatGhostedAmount(amount: bigint, maximumFractionDigits = 2) {
  return truncateFraction(formatUnits(amount, 18), maximumFractionDigits);
}

export function formatEthAmount(amount: bigint, maximumFractionDigits = 4) {
  return truncateFraction(formatEther(amount), maximumFractionDigits);
}

export function getExplorerTransactionUrl(hash: Hash) {
  const config = getGhostProtocolConfig();
  return config.explorerUrl ? `${config.explorerUrl}/tx/${hash}` : null;
}

export async function readGhostedTokenAddress() {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  return await client.readContract({
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "ghostedToken",
  }) as Address;
}

export async function readGhostedWalletState(account: Address): Promise<GhostedWalletState> {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  const tokenAddress = await readGhostedTokenAddress();
  const [balance, ethBalance, allowance, credibility] = await Promise.all([
    client.readContract({
      address: tokenAddress,
      abi: ghostedTokenAbi,
      functionName: "balanceOf",
      args: [account],
    }) as Promise<bigint>,
    client.getBalance({ address: account }),
    client.readContract({
      address: tokenAddress,
      abi: ghostedTokenAbi,
      functionName: "allowance",
      args: [account, config.address],
    }) as Promise<bigint>,
    client.readContract({
      address: config.address,
      abi: ghostProtocolAbi as any,
      functionName: "getUserCredibility",
      args: [account],
    }) as Promise<readonly [bigint, bigint, bigint]>,
  ]);

  return {
    tokenAddress,
    balance,
    ethBalance,
    allowance,
    tokenCredibilityScore: credibility[0],
    protocolCredibilityScore: credibility[1],
    effectiveCredibilityScore: credibility[2],
  };
}

export async function detectGhostProtocolDeployment(): Promise<GhostProtocolDeployment> {
  const config = getGhostProtocolConfig();
  if (!config.address || !config.rpcUrl) {
    return {
      ...config,
      hasBytecode: false,
    };
  }

  const client = getPublicClient();
  const bytecode = await client.getBytecode({ address: config.address });
  return {
    ...config,
    hasBytecode: Boolean(bytecode && bytecode !== "0x"),
  };
}

export async function readProtocolStats(): Promise<GhostProtocolStats> {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  const response = await client.readContract({
    address: config.address,
    abi: ghostProtocolAbi as any,
    functionName: "getProtocolStats",
  }) as unknown as readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean, boolean];

  return {
    totalEvidence: Number(response[0]),
    directEvidence: Number(response[1]),
    proxyEvidence: Number(response[2]),
    totalTruthAssertions: Number(response[3]),
    rewardedGhosted: response[4],
    burnedGhosted: response[5],
    revenueCollected: response[6],
    treasuryDistributed: response[7],
    protocolRetainedRevenue: response[8],
    protocolWithdrawn: response[9],
    protocolBalance: response[10],
    gaslightUnlocked: response[11],
    isPaused: response[12],
  };
}

async function readEvidenceRecord(client: ReturnType<typeof createPublicClient>, address: Address, proofHash: Hex) {
  const response = await client.readContract({
    address,
    abi: ghostProtocolAbi,
    functionName: "getEvidence",
    args: [proofHash],
  }) as readonly [bigint, bigint, boolean, Hex, string, string, Address, bigint];

  return {
    proofHash,
    timestamp: Number(response[0]),
    weight: Number(response[1]),
    isProxy: response[2],
    descriptionHash: response[3],
    dramaType: response[4],
    contentCid: response[5],
    submitter: response[6],
    ghostedRewarded: response[7],
  } satisfies GhostEvidenceRecord;
}

async function readStoryInfo(client: ReturnType<typeof createPublicClient>, address: Address, proofHash: Hex) {
  const response = await client.readContract({
    address,
    abi: ghostProtocolAbi,
    functionName: "getStoryUnlockInfo",
    args: [proofHash],
  }) as readonly [bigint, bigint, boolean, bigint, Address, bigint];

  return {
    unlockPriceTokens: response[0],
    timesUnlocked: Number(response[1]),
    isPublic: response[2],
    totalEarnedTokens: response[3],
    submitter: response[4],
    severity: Number(response[5]),
  } satisfies GhostStoryInfo;
}

async function readStoryPayoutInfo(client: ReturnType<typeof createPublicClient>, address: Address, proofHash: Hex) {
  const response = await client.readContract({
    address,
    abi: ghostProtocolAbi,
    functionName: "getStoryPayoutInfo",
    args: [proofHash],
  }) as readonly [bigint, bigint, bigint];

  return {
    tokenPayouts: response[0],
    ethPayouts: response[1],
    currentEthUnlockPrice: response[2],
  } satisfies GhostStoryPayoutInfo;
}

export async function readRecentEvidence(limit = 6, account: Address | null = null): Promise<GhostStorySnapshot[]> {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  const count = await client.readContract({
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "submittedProofHashesCount",
  }) as bigint;

  const total = Number(count);
  if (total === 0) {
    return [];
  }

  const start = total > limit ? total - limit : 0;
  const proofHashes = await client.readContract({
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "getSubmittedProofHashes",
    args: [BigInt(start), BigInt(limit)],
  }) as readonly Hex[];

  const snapshots = await Promise.all(
    [...proofHashes].reverse().map((proofHash) => readStorySnapshot(proofHash, account)),
  );

  return snapshots;
}

export async function readStorySnapshot(proofHash: Hex, account: Address | null): Promise<GhostStorySnapshot> {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  const [evidence, story, payouts, truthAssertionCount] = await Promise.all([
    readEvidenceRecord(client, config.address, proofHash),
    readStoryInfo(client, config.address, proofHash),
    readStoryPayoutInfo(client, config.address, proofHash),
    client.readContract({
      address: config.address,
      abi: ghostProtocolAbi,
      functionName: "getTruthAssertionCount",
      args: [proofHash],
    }) as Promise<bigint>,
  ]);

  let hasUnlocked = false;
  let canAccess = story.isPublic;

  if (account) {
    const accessState = await Promise.all([
      client.readContract({
        address: config.address,
        abi: ghostProtocolAbi,
        functionName: "hasUserUnlockedStory",
        args: [proofHash, account],
      }) as Promise<boolean>,
      client.readContract({
        address: config.address,
        abi: ghostProtocolAbi,
        functionName: "canUserAccessStory",
        args: [proofHash, account],
      }) as Promise<boolean>,
    ]);

    hasUnlocked = accessState[0];
    canAccess = accessState[1];
  }

  return {
    evidence,
    story,
    payouts,
    truthAssertionCount: Number(truthAssertionCount),
    hasUnlocked,
    canAccess,
  };
}

export async function previewUnlockPriceInEth(proofHash: Hex) {
  const config = assertConfiguredConfig();
  const client = getPublicClient();
  return await client.readContract({
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "previewUnlockPriceInEth",
    args: [proofHash],
  }) as bigint;
}

async function waitForReceipt(hash: Hash) {
  const client = getPublicClient();
  await client.waitForTransactionReceipt({ hash });
  return hash;
}

export async function submitEvidenceTransaction(
  walletClient: WalletClient,
  account: Address,
  input: SubmitEvidenceInput,
) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "submitEvidence",
    args: [input.proofHash, BigInt(input.severity), input.description, input.dramaType, input.contentCid, input.isProxy],
    value: ghostProtocolUiConstants.receiptFeeEth,
  });

  return waitForReceipt(hash);
}

export async function approveGhostedSpendTransaction(
  walletClient: WalletClient,
  account: Address,
  amount: bigint,
) {
  const tokenAddress = await readGhostedTokenAddress();
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: tokenAddress,
    abi: ghostedTokenAbi,
    functionName: "approve",
    args: [config.address, amount],
  });

  return waitForReceipt(hash);
}

export async function unlockStoryByBurnTransaction(walletClient: WalletClient, account: Address, proofHash: Hex) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "unlockStoryByBurn",
    args: [proofHash],
  });

  return waitForReceipt(hash);
}

export async function unlockStoryByCredibilityTransaction(walletClient: WalletClient, account: Address, proofHash: Hex) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "unlockStoryByCredibility",
    args: [proofHash],
  });

  return waitForReceipt(hash);
}

export async function unlockStoryWithEthTransaction(walletClient: WalletClient, account: Address, proofHash: Hex) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const value = await previewUnlockPriceInEth(proofHash);
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "unlockStoryWithETH",
    args: [proofHash],
    value,
  });

  return waitForReceipt(hash);
}

export async function assertTruthTransaction(
  walletClient: WalletClient,
  account: Address,
  proofHash: Hex,
  believesReal: boolean,
) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "assertTruth",
    args: [proofHash, believesReal],
  });

  return waitForReceipt(hash);
}

export async function makeStoryPublicTransaction(walletClient: WalletClient, account: Address, proofHash: Hex) {
  const config = assertConfiguredConfig();
  const chain = getGhostProtocolChain() ?? undefined;
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: config.address,
    abi: ghostProtocolAbi,
    functionName: "makeStoryPublic",
    args: [proofHash],
  });

  return waitForReceipt(hash);
}