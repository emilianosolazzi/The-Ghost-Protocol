import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { Activity, Clock, Lock, ShieldAlert, Wallet } from "lucide-react";
import { formatWalletAddress, useWallet } from "@/hooks/use-wallet";
import { useGhostProtocolStats, useRecentEvidence } from "@/hooks/use-ghost-protocol";
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
    <div className="bg-card border border-white/5 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-mono text-xs font-bold text-muted-foreground tracking-wider">{title}</h3>
        {icon}
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground font-mono">{description}</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const wallet = useWallet();
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useGhostProtocolStats();
  const { data: recentStories, isLoading: isLoadingStories, error: storiesError } = useRecentEvidence();

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

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">WHAT&apos;S THE VIBE</h1>
          <p className="text-muted-foreground font-mono text-sm">LIVE HARDHAT TRACKER — REAL CONTRACT STATE, NO MOCKS</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 bg-card border border-white/10 rounded-md">
            <span className={`w-2 h-2 rounded-full ${stats.isPaused ? "bg-destructive" : "bg-primary animate-pulse"}`} />
            {stats.isPaused ? "PAUSED" : "LIVE"}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-card border border-white/10 rounded-md">
            <Wallet className="w-3 h-3 text-primary" />
            {wallet.account ? formatWalletAddress(wallet.account) : "NO WALLET"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL EVIDENCE"
          value={String(stats.totalEvidence)}
          description="All submissions recorded on-chain"
          icon={<Activity className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="DIRECT EVIDENCE"
          value={String(stats.directEvidence)}
          description="Direct on-chain submissions"
          icon={<ShieldAlert className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="PROXY EVIDENCE"
          value={String(stats.proxyEvidence)}
          description="On-chain submissions with no GHOSTED payout"
          icon={<Clock className="w-4 h-4 text-muted-foreground" />}
        />
        <MetricCard
          title="DIRECT ASSERTIONS"
          value={String(stats.totalTruthAssertions)}
          description="Global counter incremented by direct receipts"
          icon={<Lock className="w-4 h-4 text-primary" />}
        />
        <MetricCard
          title="REVENUE"
          value={`${formatEthAmount(stats.revenueCollected)} ETH`}
          description="Receipt fees collected"
          icon={<Wallet className="w-4 h-4 text-emerald-400" />}
        />
        <MetricCard
          title="TREASURY"
          value={`${formatEthAmount(stats.treasuryDistributed)} ETH`}
          description="Transferred to treasury"
          icon={<Wallet className="w-4 h-4 text-violet-400" />}
        />
        <MetricCard
          title="PROTOCOL POOL"
          value={`${formatEthAmount(stats.protocolRevenue)} ETH`}
          description="ETH retained by contract after treasury split"
          icon={<Wallet className="w-4 h-4 text-cyan-400" />}
        />
        <MetricCard
          title="REWARDED"
          value={`${formatGhostedAmount(stats.rewardedGhosted)} GHOSTED`}
          description="Direct receipt payouts plus resolved truth wins"
          icon={<Activity className="w-4 h-4 text-amber-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="font-bold font-mono text-sm text-muted-foreground">PROTOCOL CONSTANTS</h2>

            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className={stats.gaslightUnlocked ? "text-primary" : "text-muted-foreground"}>
                  {stats.gaslightUnlocked ? "GASLIGHT FLAG LIVE" : "GASLIGHT FLAG"}
                </span>
                <span>{Math.min(stats.totalEvidence, 10)}/10 receipts</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${gaslightProgress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                <p className="text-muted-foreground mb-1">BASE STORY UNLOCK</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.baseUnlockPrice)} GHOSTED</p>
              </div>
              <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                <p className="text-muted-foreground mb-1">TRUTH STAKE</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.truthAssertionStake)} GHOSTED</p>
              </div>
              <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                <p className="text-muted-foreground mb-1">CRED UNLOCK FLOOR</p>
                <p>{formatGhostedAmount(ghostProtocolUiConstants.credibilityUnlockThreshold, 0)} score</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-3">
            <h2 className="font-bold font-mono text-sm text-muted-foreground">CONNECTION STATUS</h2>
            <div className="text-sm font-mono text-muted-foreground flex flex-col gap-2">
              <span>Chain ID: {wallet.chainId ?? "unknown"}</span>
              <span>Connection: {wallet.isConnected ? "connected" : "not connected"}</span>
              <span>Wallet Mode: {wallet.connectionType}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-6 flex flex-col h-[480px]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="font-bold font-mono text-sm text-muted-foreground">RECENT EVIDENCE</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-4 scrollbar-thin">
            {recentStories && recentStories.length > 0 ? (
              recentStories.map((story) => (
                <div key={story.evidence.proofHash} className="relative pl-6 pb-4 border-l border-white/10 last:pb-0 last:border-0">
                  <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-primary/20 border border-primary/50" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <span className="text-xs font-bold text-primary font-mono">
                        {truncateHash(story.evidence.proofHash)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(story.evidence.timestamp)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span>{story.evidence.isProxy ? "PROXY" : "DIRECT"}</span>
                      <span>•</span>
                      <span>{story.evidence.dramaType || "general"}</span>
                      <span>•</span>
                      <span>severity {story.evidence.weight}</span>
                      <span>•</span>
                      <span>{story.truthAssertionCount} truth stakes</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                      <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-muted-foreground mb-1">Rewarded</p>
                        <p>{formatGhostedAmount(story.evidence.ghostedRewarded)} GHOSTED</p>
                      </div>
                      <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-muted-foreground mb-1">Unlock Price</p>
                        <p>{formatGhostedAmount(story.story.unlockPriceTokens)} GHOSTED</p>
                      </div>
                      <div className="rounded-md border border-white/5 bg-white/[0.02] p-3">
                        <p className="text-muted-foreground mb-1">Access</p>
                        <p>{story.story.isPublic ? "public" : story.canAccess ? "unlocked" : "locked"}</p>
                      </div>
                    </div>
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