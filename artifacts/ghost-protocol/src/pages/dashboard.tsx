import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { Activity, Clock, Lock, ShieldAlert, Wallet } from "lucide-react";
import { Link } from "wouter";
import { StoryActionStrip } from "@/components/story-action-strip";
import { formatWalletAddress, useWallet } from "@/hooks/use-wallet";
import { useGhostProtocolStats, useGhostedWalletState, useRecentEvidence } from "@/hooks/use-ghost-protocol";
import { formatEthAmount, formatGhostedAmount } from "@/lib/ghost-protocol-client";

function truncateHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function formatTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <div className="ghost-panel ghost-gradient-border ghost-sheen p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="ghost-label font-bold">{title}</h3>
        {icon}
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <span className="ghost-value">{value}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const wallet = useWallet();
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useGhostProtocolStats();
  const { data: recentStories, isLoading: isLoadingStories, error: storiesError } = useRecentEvidence();
  const { data: ghostedWalletState, isLoading: isLoadingGhostedWalletState } = useGhostedWalletState();

  if (isLoadingStats || isLoadingStories) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">READING THE CHAIN...</span>
        </div>
      </div>
    );
  }

  if (statsError || storiesError) {
    const message = statsError instanceof Error
      ? statsError.message
      : storiesError instanceof Error
        ? storiesError.message
        : "The local GhostProtocol contract did not respond.";

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-card border border-destructive/20 rounded-xl p-6 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h1 className="text-xl font-black">CHAIN READ FAILED</h1>
            <p className="text-sm text-muted-foreground font-mono">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const gaslightProgress = Math.min((stats.totalEvidence / 10) * 100, 100);
  const evidenceMetrics = [
    {
      title: "TOTAL RECEIPTS",
      value: String(stats.totalEvidence),
      description: "Every submission recorded on-chain.",
      icon: <Activity className="w-4 h-4 text-primary" />,
    },
    {
      title: "DIRECT RECEIPTS",
      value: String(stats.directEvidence),
      description: "Direct proof that paid a token reward.",
      icon: <ShieldAlert className="w-4 h-4 text-primary" />,
    },
    {
      title: "PROXY RECEIPTS",
      value: String(stats.proxyEvidence),
      description: "Stored on-chain, but no GHOSTED payout.",
      icon: <Clock className="w-4 h-4 text-muted-foreground" />,
    },
    {
      title: "DIRECT RECEIPT INDEX",
      value: String(stats.totalTruthAssertions),
      description: "Contract field named totalTruthAssertions; it increments on direct receipts.",
      icon: <Lock className="w-4 h-4 text-primary" />,
    },
  ];
  const revenueMetrics = [
    {
      title: "FEE REVENUE",
      value: `${formatEthAmount(stats.revenueCollected)} ETH`,
      description: "Total ETH collected from logging receipts.",
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: "TREASURY SENT",
      value: `${formatEthAmount(stats.treasuryDistributed)} ETH`,
      description: "30% of each submission fee forwarded out.",
      icon: <Wallet className="w-4 h-4 text-violet-400" />,
    },
    {
      title: "RETAINED TOTAL",
      value: `${formatEthAmount(stats.protocolRetainedRevenue)} ETH`,
      description: "Lifetime 70% fee share retained by GhostProtocol.",
      icon: <Wallet className="w-4 h-4 text-cyan-400" />,
    },
    {
      title: "WITHDRAWN TOTAL",
      value: `${formatEthAmount(stats.protocolWithdrawn)} ETH`,
      description: "Protocol ETH withdrawn to treasury by admin action.",
      icon: <Wallet className="w-4 h-4 text-orange-300" />,
    },
    {
      title: "LIVE BALANCE",
      value: `${formatEthAmount(stats.protocolBalance)} ETH`,
      description: "Current ETH still held by the contract.",
      icon: <Wallet className="w-4 h-4 text-sky-300" />,
    },
    {
      title: "GHOSTED PAID",
      value: `${formatGhostedAmount(stats.rewardedGhosted)} GHOSTED`,
      description: "Direct receipt payouts plus resolved truth wins.",
      icon: <Activity className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="ghost-panel ghost-gradient-border p-6 md:p-8 flex flex-col gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)]" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-3">
            <span className="ghost-kicker">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Live Contract State
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">READ THE RECEIPT BOARD</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              This dashboard is a contract readout, not a vibe simulator. It shows which receipts are logged,
              how fees are split, whether the 10-receipt milestone is live, and what recent stories cost to unlock.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="ghost-status-pill">
            <span className={`w-2 h-2 rounded-full ${stats.isPaused ? "bg-destructive" : "bg-primary animate-pulse"}`} />
            {stats.isPaused ? "PAUSED" : "LIVE"}
            </div>
            <div className="ghost-status-pill">
            <Wallet className="w-3 h-3 text-primary" />
            {wallet.account ? formatWalletAddress(wallet.account) : "NO WALLET"}
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-4">
          <div className="ghost-panel-soft p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="ghost-label mb-2">10-Receipt Milestone</p>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {stats.gaslightUnlocked ? "Milestone Reached" : "Milestone Loading"}
                </h2>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] ${stats.gaslightUnlocked ? "border-primary/35 bg-primary/12 text-primary" : "border-white/12 bg-white/[0.04] text-muted-foreground"}`}>
                {Math.min(stats.totalEvidence, 10)}/10 receipts
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The contract exposes this as a boolean once total evidence reaches 10. It is a milestone flag, not a payout bucket.
            </p>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary via-fuchsia-400 to-cyan-300 transition-all duration-700" style={{ width: `${gaslightProgress}%` }} />
            </div>
          </div>

          <div className="ghost-panel-soft p-5 flex flex-col gap-3">
            <p className="ghost-label">Quick Actions</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Want the loop to move? Log a fresh receipt or inspect the unlock economics before spending tokens or ETH.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/evidence" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                Log A Receipt
              </Link>
              <Link href="/how-to-use" className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.07]">
                Read The Mechanics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="ghost-label mb-2">Evidence Counters</p>
            <h2 className="text-2xl font-black tracking-tight">What The Contract Has Recorded</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {evidenceMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="ghost-label mb-2">Fee Flow</p>
          <h2 className="text-2xl font-black tracking-tight">Where The ETH And GHOSTED Are Going</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {revenueMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <div className="ghost-panel p-6 flex flex-col gap-4">
            <h2 className="ghost-label font-bold">Protocol Constants</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These are the live guardrails behind each receipt, story unlock, and truth stake.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="ghost-panel-soft p-3">
                <p className="text-muted-foreground mb-1">BASE STORY UNLOCK</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.baseUnlockPrice)} GHOSTED</p>
              </div>
              <div className="ghost-panel-soft p-3">
                <p className="text-muted-foreground mb-1">TRUTH STAKE</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.truthAssertionStake)} GHOSTED</p>
              </div>
              <div className="ghost-panel-soft p-3">
                <p className="text-muted-foreground mb-1">CRED UNLOCK FLOOR</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.credibilityUnlockThreshold, 0)} score</p>
              </div>
            </div>
          </div>

          <div className="ghost-panel p-6 flex flex-col gap-3">
            <h2 className="ghost-label font-bold">Connection Status</h2>
            <div className="text-sm font-mono text-muted-foreground flex flex-col gap-2">
              <span>Chain ID: {wallet.chainId ?? "unknown"}</span>
              <span>Connection: {wallet.isConnected ? "connected" : "not connected"}</span>
              <span>Wallet Mode: {wallet.connectionType}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 ghost-panel p-6 flex flex-col h-[720px]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <h2 className="ghost-label font-bold">Recent Receipts</h2>
              <p className="text-sm text-muted-foreground mt-1">Unlock cost, access state, and truth stakes for the latest stories.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-thin">
            {recentStories && recentStories.length > 0 ? (
              recentStories.map((story) => (
                <div key={story.evidence.proofHash} className="relative pl-6 pb-5 border-l border-white/12 last:pb-0 last:border-0">
                  <div className="absolute -left-[6px] top-1 h-3 w-3 rounded-full border border-primary/60 bg-primary/20 shadow-[0_0_16px_rgba(139,92,246,0.45)]" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <span className="text-sm font-bold text-primary font-mono tracking-wide">
                        {truncateHash(story.evidence.proofHash)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-[0.18em]">
                        {formatTimestamp(story.evidence.timestamp)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className={`rounded-full border px-2 py-1 ${story.evidence.isProxy ? "border-destructive/25 bg-destructive/8 text-destructive" : "border-primary/25 bg-primary/8 text-primary"}`}>
                        {story.evidence.isProxy ? "Proxy receipt" : "Direct receipt"}
                      </span>
                      <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-1">{story.evidence.dramaType || "general"}</span>
                      <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-1">severity {story.evidence.weight}</span>
                      <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-1">{story.truthAssertionCount} truth stakes</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="ghost-panel-soft p-3">
                        <p className="text-muted-foreground mb-1">Rewarded</p>
                        <p>{formatGhostedAmount(story.evidence.ghostedRewarded)} GHOSTED</p>
                      </div>
                      <div className="ghost-panel-soft p-3">
                        <p className="text-muted-foreground mb-1">Unlock Price</p>
                        <p>{formatGhostedAmount(story.story.unlockPriceTokens)} GHOSTED</p>
                      </div>
                      <div className="ghost-panel-soft p-3">
                        <p className="text-muted-foreground mb-1">Access</p>
                        <p>{story.story.isPublic ? "public" : story.canAccess ? "unlocked for this wallet" : "locked"}</p>
                      </div>
                    </div>
                    <StoryActionStrip
                      story={story}
                      account={wallet.account}
                      walletState={ghostedWalletState}
                      isWalletStateLoading={isLoadingGhostedWalletState}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm font-mono">No evidence has been submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}