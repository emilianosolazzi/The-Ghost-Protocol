import { useMemo, useState } from "react";
import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { CircleAlert, Coins, Flame, Globe2, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import type { Address } from "viem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  useApproveGhostedSpendTransaction,
  useAssertTruthTransaction,
  useMakeStoryPublicTransaction,
  useUnlockStoryByBurnTransaction,
  useUnlockStoryByCredibilityTransaction,
  useUnlockStoryWithEthTransaction,
} from "@/hooks/use-ghost-protocol";
import { useToast } from "@/hooks/use-toast";
import {
  formatEthAmount,
  formatGhostedAmount,
  type GhostedWalletState,
  type GhostStorySnapshot,
} from "@/lib/ghost-protocol-client";

type StoryActionStripProps = {
  story: GhostStorySnapshot;
  account: Address | null;
  walletState?: GhostedWalletState;
  isWalletStateLoading: boolean;
};

function sameAddress(left: Address | null, right: Address | null) {
  return Boolean(left && right && left.toLowerCase() === right.toLowerCase());
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function StoryActionStrip({ story, account, walletState, isWalletStateLoading }: StoryActionStripProps) {
  const { toast } = useToast();
  const [isTruthDialogOpen, setIsTruthDialogOpen] = useState(false);
  const truthStakeAmount = ghostProtocolUiConstants.truthAssertionStake;
  const unlockPrice = story.story.unlockPriceTokens;
  const storyCredibilityRequirement = BigInt(story.evidence.weight) * 10n ** 16n;
  const effectiveCredibilityRequirement = storyCredibilityRequirement > ghostProtocolUiConstants.credibilityUnlockThreshold
    ? storyCredibilityRequirement
    : ghostProtocolUiConstants.credibilityUnlockThreshold;

  const balance = walletState?.balance ?? 0n;
  const ethBalance = walletState?.ethBalance ?? 0n;
  const allowance = walletState?.allowance ?? 0n;
  const tokenCredibilityScore = walletState?.tokenCredibilityScore ?? 0n;
  const protocolCredibilityScore = walletState?.protocolCredibilityScore ?? 0n;
  const effectiveCredibilityScore = walletState?.effectiveCredibilityScore ?? 0n;
  const isSubmitter = sameAddress(account, story.story.submitter);
  const needsUnlockApproval = allowance < unlockPrice;
  const needsTruthApproval = allowance < truthStakeAmount;
  const canAffordUnlock = balance >= unlockPrice;
  const canAffordTruthStake = balance >= truthStakeAmount;
  const ethUnlockPrice = story.payouts.currentEthUnlockPrice;
  const canAffordEthUnlock = ethBalance >= ethUnlockPrice;
  const isLockedForWallet = !story.story.isPublic && !story.canAccess;
  const canUnlockByCredibility = Boolean(account) && isLockedForWallet && effectiveCredibilityScore >= effectiveCredibilityRequirement;
  const canMakePublic = Boolean(account) && isSubmitter && !story.story.isPublic;

  const { mutate: approveGhostedSpend, isPending: isApproving } = useApproveGhostedSpendTransaction();
  const { mutate: unlockStoryByBurn, isPending: isUnlockingByBurn } = useUnlockStoryByBurnTransaction();
  const { mutate: unlockStoryWithEth, isPending: isUnlockingWithEth } = useUnlockStoryWithEthTransaction();
  const { mutate: unlockStoryByCredibility, isPending: isUnlockingByCredibility } = useUnlockStoryByCredibilityTransaction();
  const { mutate: makeStoryPublic, isPending: isMakingPublic } = useMakeStoryPublicTransaction();
  const { mutate: assertTruth, isPending: isAssertingTruth } = useAssertTruthTransaction();

  const isAnyPending = isApproving || isUnlockingByBurn || isUnlockingWithEth || isUnlockingByCredibility || isMakingPublic || isAssertingTruth;

  const statusNotes = useMemo(() => {
    const notes: string[] = [];

    if (!account) {
      notes.push("Connect a wallet to check GHOSTED balance, allowance, and credibility before acting on a story.");
      return notes;
    }

    if (story.story.isPublic) {
      notes.push("This story is already public. Unlock actions are no longer needed, but truth staking still works.");
    } else if (story.canAccess) {
      notes.push("This wallet already has access to the private story.");
    } else {
      if (!canAffordUnlock) {
        notes.push(`Burn unlock needs ${formatGhostedAmount(unlockPrice)} GHOSTED. Current wallet balance: ${formatGhostedAmount(balance)}.`);
      } else if (needsUnlockApproval) {
        notes.push(`Burn unlock needs an approval for ${formatGhostedAmount(unlockPrice)} GHOSTED before the contract can pull tokens.`);
      }

      if (effectiveCredibilityScore < effectiveCredibilityRequirement) {
        notes.push(`Credibility unlock requires ${formatGhostedAmount(effectiveCredibilityRequirement, 0)} effective score. Current effective score: ${formatGhostedAmount(effectiveCredibilityScore, 0)}.`);
      }

      if (!canAffordEthUnlock) {
        notes.push(`ETH unlock costs ${formatEthAmount(ethUnlockPrice, 5)} ETH. Current wallet ETH: ${formatEthAmount(ethBalance, 5)}.`);
      }
    }

    if (!canAffordTruthStake) {
      notes.push(`Truth staking requires ${formatGhostedAmount(truthStakeAmount)} GHOSTED.`);
    } else if (needsTruthApproval) {
      notes.push(`Truth staking needs an approval for ${formatGhostedAmount(truthStakeAmount)} GHOSTED first.`);
    }

    if (canMakePublic) {
      notes.push("You submitted this receipt, so you can open the story for everyone.");
    }

    return notes;
  }, [
    account,
    balance,
    canAffordEthUnlock,
    canAffordTruthStake,
    canAffordUnlock,
    canMakePublic,
    effectiveCredibilityScore,
    effectiveCredibilityRequirement,
    ethBalance,
    ethUnlockPrice,
    needsTruthApproval,
    needsUnlockApproval,
    story.canAccess,
    story.story.isPublic,
    truthStakeAmount,
    unlockPrice,
  ]);

  function toastSuccess(title: string, transactionHash: string, description: string) {
    toast({
      title,
      description: `${description} Tx ${truncateHash(transactionHash)}.`,
    });
  }

  function toastFailure(title: string, error: unknown) {
    toast({
      variant: "destructive",
      title,
      description: error instanceof Error ? error.message : "The transaction could not be completed.",
    });
  }

  function handleApprove(amount: bigint, purpose: string) {
    approveGhostedSpend(amount, {
      onSuccess: (transactionHash) => {
        toastSuccess("Approval confirmed", String(transactionHash), `${purpose} approval is now live on-chain.`);
      },
      onError: (error) => {
        toastFailure("Approval failed", error);
      },
    });
  }

  function handleBurnUnlock() {
    unlockStoryByBurn(story.evidence.proofHash, {
      onSuccess: (transactionHash) => {
        toastSuccess("Story unlocked with GHOSTED", String(transactionHash), "The burn-path unlock is confirmed.");
      },
      onError: (error) => {
        toastFailure("Burn unlock failed", error);
      },
    });
  }

  function handleEthUnlock() {
    unlockStoryWithEth(story.evidence.proofHash, {
      onSuccess: (transactionHash) => {
        toastSuccess("Story unlocked with ETH", String(transactionHash), "The ETH unlock is confirmed.");
      },
      onError: (error) => {
        toastFailure("ETH unlock failed", error);
      },
    });
  }

  function handleCredibilityUnlock() {
    unlockStoryByCredibility(story.evidence.proofHash, {
      onSuccess: (transactionHash) => {
        toastSuccess("Story unlocked by credibility", String(transactionHash), "The credibility unlock is confirmed.");
      },
      onError: (error) => {
        toastFailure("Credibility unlock failed", error);
      },
    });
  }

  function handleMakePublic() {
    makeStoryPublic(story.evidence.proofHash, {
      onSuccess: (transactionHash) => {
        toastSuccess("Story is public now", String(transactionHash), "The receipt story is now open to everyone.");
      },
      onError: (error) => {
        toastFailure("Make public failed", error);
      },
    });
  }

  function handleTruthStake(believesReal: boolean) {
    assertTruth({ proofHash: story.evidence.proofHash, believesReal }, {
      onSuccess: (transactionHash) => {
        setIsTruthDialogOpen(false);
        toastSuccess(
          believesReal ? "Truth stake placed: real" : "Truth stake placed: fake",
          String(transactionHash),
          `Your ${formatGhostedAmount(truthStakeAmount)} GHOSTED truth stake is now recorded.`,
        );
      },
      onError: (error) => {
        toastFailure("Truth stake failed", error);
      },
    });
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-background/35 p-4 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="ghost-label mb-2">Story Actions</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use the live story state below to unlock, open, or stake on this receipt without leaving the dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-muted-foreground">
            ETH unlock {formatEthAmount(story.payouts.currentEthUnlockPrice, 5)}
          </span>
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-muted-foreground">
            token payouts {formatGhostedAmount(story.payouts.tokenPayouts)}
          </span>
          <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-muted-foreground">
            eth payouts {formatEthAmount(story.payouts.ethPayouts, 5)}
          </span>
        </div>
      </div>

      {account ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs font-mono">
          <div className="ghost-panel-soft p-3">
            <p className="text-muted-foreground mb-1">GHOSTED BALANCE</p>
            <p className="text-white">{isWalletStateLoading ? "checking..." : `${formatGhostedAmount(balance)} GHOSTED`}</p>
          </div>
          <div className="ghost-panel-soft p-3">
            <p className="text-muted-foreground mb-1">ALLOWANCE TO PROTOCOL</p>
            <p className="text-white">{isWalletStateLoading ? "checking..." : `${formatGhostedAmount(allowance)} GHOSTED`}</p>
          </div>
          <div className="ghost-panel-soft p-3">
            <p className="text-muted-foreground mb-1">EFFECTIVE CREDIBILITY</p>
            <p className="text-white">{isWalletStateLoading ? "checking..." : formatGhostedAmount(effectiveCredibilityScore, 0)}</p>
            {!isWalletStateLoading && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                token {formatGhostedAmount(tokenCredibilityScore, 0)} + protocol {formatGhostedAmount(protocolCredibilityScore, 0)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="ghost-panel-soft p-3 text-sm text-muted-foreground leading-relaxed">
          Connect a wallet to see your GHOSTED balance, approval state, and credibility before taking action.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isLockedForWallet && (
          <>
            <Button
              size="sm"
              variant={needsUnlockApproval ? "outline" : "default"}
              disabled={isAnyPending || !account || isWalletStateLoading || !canAffordUnlock}
              onClick={() => (needsUnlockApproval ? handleApprove(unlockPrice, "Burn unlock") : handleBurnUnlock())}
            >
              {isApproving && needsUnlockApproval ? <Spinner className="size-3.5" /> : <Flame className="size-3.5" />}
              {needsUnlockApproval ? `Approve ${formatGhostedAmount(unlockPrice)} GHOSTED` : "Unlock With GHOSTED"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={isAnyPending || !account || isWalletStateLoading || !canAffordEthUnlock}
              onClick={handleEthUnlock}
            >
              {isUnlockingWithEth ? <Spinner className="size-3.5" /> : <Wallet className="size-3.5" />}
              Unlock With {formatEthAmount(ethUnlockPrice, 5)} ETH
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={isAnyPending || !account || isWalletStateLoading || !canUnlockByCredibility}
              onClick={handleCredibilityUnlock}
            >
              {isUnlockingByCredibility ? <Spinner className="size-3.5" /> : <Sparkles className="size-3.5" />}
              Unlock With Credibility
            </Button>
          </>
        )}

        {canMakePublic && (
          <Button size="sm" variant="outline" disabled={isAnyPending} onClick={handleMakePublic}>
            {isMakingPublic ? <Spinner className="size-3.5" /> : <Globe2 className="size-3.5" />}
            Make Public
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          disabled={isAnyPending || !account || isWalletStateLoading || !canAffordTruthStake}
          onClick={() => setIsTruthDialogOpen(true)}
        >
          <ShieldCheck className="size-3.5" />
          Stake On Truth
        </Button>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        {statusNotes.map((note) => (
          <div key={note} className="flex items-start gap-2 leading-relaxed">
            <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>{note}</span>
          </div>
        ))}
      </div>

      <Dialog open={isTruthDialogOpen} onOpenChange={setIsTruthDialogOpen}>
        <DialogContent className="border-white/12 bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="font-mono text-base uppercase tracking-[0.18em]">Stake On This Receipt</DialogTitle>
            <DialogDescription className="leading-relaxed">
              Truth staking is a separate path from receipt submission. You stake {formatGhostedAmount(truthStakeAmount)} GHOSTED on whether this receipt is real.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs font-mono">
            <div className="ghost-panel-soft p-3">
              <p className="text-muted-foreground mb-1">TRUTH STAKE</p>
              <p>{formatGhostedAmount(truthStakeAmount)} GHOSTED</p>
            </div>
            <div className="ghost-panel-soft p-3">
              <p className="text-muted-foreground mb-1">ALLOWANCE</p>
              <p>{isWalletStateLoading ? "checking..." : `${formatGhostedAmount(allowance)} GHOSTED`}</p>
            </div>
            <div className="ghost-panel-soft p-3">
              <p className="text-muted-foreground mb-1">CURRENT STAKES</p>
              <p>{story.truthAssertionCount}</p>
            </div>
          </div>

          {needsTruthApproval ? (
            <div className="ghost-panel-soft p-4 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This wallet needs to approve {formatGhostedAmount(truthStakeAmount)} GHOSTED before the protocol can record a truth stake.
              </p>
              <Button disabled={isAnyPending || !account || isWalletStateLoading || !canAffordTruthStake} onClick={() => handleApprove(truthStakeAmount, "Truth stake")}>
                {isApproving ? <Spinner /> : <Coins className="size-4" />}
                Approve Truth Stake Spend
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button disabled={isAnyPending} onClick={() => handleTruthStake(true)}>
                {isAssertingTruth ? <Spinner /> : <ShieldCheck className="size-4" />}
                Stake: Receipt Is Real
              </Button>
              <Button variant="outline" disabled={isAnyPending} onClick={() => handleTruthStake(false)}>
                {isAssertingTruth ? <Spinner /> : <CircleAlert className="size-4" />}
                Stake: Receipt Is Fake
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsTruthDialogOpen(false)} disabled={isAnyPending}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}