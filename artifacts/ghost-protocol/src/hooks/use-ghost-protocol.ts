import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, Hex, WalletClient } from "viem";
import { useWallet } from "@/hooks/use-wallet";
import { getGhostProtocolConfig } from "@/lib/ghost-protocol-config";
import {
  assertTruthTransaction,
  detectGhostProtocolDeployment,
  isProofHash,
  makeStoryPublicTransaction,
  previewUnlockPriceInEth,
  readProtocolStats,
  readRecentEvidence,
  readStorySnapshot,
  submitEvidenceTransaction,
  unlockStoryByBurnTransaction,
  unlockStoryByCredibilityTransaction,
  unlockStoryWithEthTransaction,
  type SubmitEvidenceInput,
} from "@/lib/ghost-protocol-client";

const ghostProtocolQueryKey = ["ghostProtocol"] as const;

async function ensureWalletReady(
  account: Address | null,
  connect: () => Promise<Address>,
  chainId: number | null,
  switchChain: (targetChainId: number) => Promise<void>,
) {
  const config = getGhostProtocolConfig();
  let activeAccount = account;

  if (!activeAccount) {
    activeAccount = await connect();
  }

  if (config.chainId && chainId !== config.chainId) {
    await switchChain(config.chainId);
  }

  return activeAccount;
}

function createWriteMutation<TVariables>(
  mutationFn: (walletClient: WalletClient, account: Address, variables: TVariables) => Promise<unknown>,
) {
  return function useGhostWriteMutation() {
    const queryClient = useQueryClient();
    const wallet = useWallet();

    return useMutation({
      mutationFn: async (variables: TVariables) => {
        const activeAccount = await ensureWalletReady(
          wallet.account,
          wallet.connect,
          wallet.chainId,
          wallet.switchChain,
        );

        return mutationFn(wallet.getWalletClient(), activeAccount, variables);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ghostProtocolQueryKey });
      },
    });
  };
}

export function useGhostProtocolDeployment() {
  const config = getGhostProtocolConfig();
  return useQuery({
    queryKey: [...ghostProtocolQueryKey, "deployment", config.address, config.rpcUrl, config.chainId],
    queryFn: detectGhostProtocolDeployment,
    staleTime: 30_000,
  });
}

export function useGhostProtocolStats() {
  const config = getGhostProtocolConfig();
  return useQuery({
    queryKey: [...ghostProtocolQueryKey, "stats", config.address],
    queryFn: readProtocolStats,
    enabled: config.isConfigured,
    staleTime: 15_000,
  });
}

export function useRecentEvidence(limit = 6) {
  const config = getGhostProtocolConfig();
  return useQuery({
    queryKey: [...ghostProtocolQueryKey, "recentEvidence", config.address, limit],
    queryFn: () => readRecentEvidence(limit),
    enabled: config.isConfigured,
    staleTime: 15_000,
  });
}

export function useStorySnapshot(proofHashInput: string) {
  const config = getGhostProtocolConfig();
  const wallet = useWallet();
  const proofHash = isProofHash(proofHashInput.trim()) ? (proofHashInput.trim() as Hex) : null;

  return useQuery({
    queryKey: [...ghostProtocolQueryKey, "story", config.address, proofHash, wallet.account],
    queryFn: () => readStorySnapshot(proofHash as Hex, wallet.account),
    enabled: config.isConfigured && proofHash !== null,
    staleTime: 10_000,
  });
}

export function useUnlockPricePreview(proofHashInput: string) {
  const config = getGhostProtocolConfig();
  const proofHash = isProofHash(proofHashInput.trim()) ? (proofHashInput.trim() as Hex) : null;

  return useQuery({
    queryKey: [...ghostProtocolQueryKey, "unlockPricePreview", config.address, proofHash],
    queryFn: () => previewUnlockPriceInEth(proofHash as Hex),
    enabled: config.isConfigured && proofHash !== null,
    staleTime: 10_000,
  });
}

export const useSubmitEvidenceTransaction = createWriteMutation<SubmitEvidenceInput>(
  submitEvidenceTransaction,
);

// Alias for shorter name used in pages
export const useSubmitEvidence = useSubmitEvidenceTransaction;

export const useUnlockStoryByBurnTransaction = createWriteMutation<Hex>(
  unlockStoryByBurnTransaction,
);

export const useUnlockStoryByCredibilityTransaction = createWriteMutation<Hex>(
  unlockStoryByCredibilityTransaction,
);

export const useUnlockStoryWithEthTransaction = createWriteMutation<Hex>(
  unlockStoryWithEthTransaction,
);

export const useMakeStoryPublicTransaction = createWriteMutation<Hex>(
  makeStoryPublicTransaction,
);

export const useAssertTruthTransaction = createWriteMutation<{ proofHash: Hex; believesReal: boolean }>(
  async (walletClient, account, variables) => {
    return assertTruthTransaction(walletClient, account, variables.proofHash, variables.believesReal);
  },
);