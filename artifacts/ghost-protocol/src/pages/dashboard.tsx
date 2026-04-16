import { useGetGhostState, useGetGhostMetrics, useGetGhostTimeline, useGetTopHolders, getGetGhostStateQueryKey, getGetGhostMetricsQueryKey, getGetGhostTimelineQueryKey, getGetTopHoldersQueryKey } from "@workspace/api-client-react";
import { Activity, Skull, Zap, AlertTriangle, Clock, Users, Hash, ShieldAlert, Coins, TrendingUp, Lock, HeartCrack, Vault, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

const EVENT_LABELS: Record<string, string> = {
  DriftUpdated: "Getting More Distant",
  PhiUpdated: "Feelings Stacking Up",
  Compromised: "Feelings Exposed",
  Locked: "Stuck On Them",
  Escaped: "They Bounced",
  Forked: "It's Over",
  EvidenceAdded: "Receipt Logged",
  TruthAssertion: "Truth Assertion On-Chain",
  Anomaly: "Red Flag Spotted",
  GhostGained: "$GHOSTED Bag Growing",
};

export function Dashboard() {
  const { data: state, isLoading: isLoadingState } = useGetGhostState({ query: { queryKey: getGetGhostStateQueryKey() } });
  const { data: metrics, isLoading: isLoadingMetrics } = useGetGhostMetrics({ query: { queryKey: getGetGhostMetricsQueryKey() } });
  const { data: timeline, isLoading: isLoadingTimeline } = useGetGhostTimeline({ query: { queryKey: getGetGhostTimelineQueryKey() } });
  const { data: holders, isLoading: isLoadingHolders } = useGetTopHolders({ query: { queryKey: getGetTopHoldersQueryKey() } });

  if (isLoadingState || isLoadingTimeline || isLoadingHolders || isLoadingMetrics) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">CONNECTING TO THE VOID...</span>
        </div>
      </div>
    );
  }

  if (!state) return null;

  // Evidence threshold progress
  const gaslightUnlocked = state.evidenceCounter > 10;
  const forkReady = state.evidenceCounter > 20;
  const gaslightProgress = Math.min((state.evidenceCounter / 10) * 100, 100);
  const forkProgress = Math.min((state.evidenceCounter / 20) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">WHAT'S THE VIBE</h1>
          <p className="text-muted-foreground font-mono text-sm">LIVE TRACKER — WATCHING EVERY MOVE (OR LACK THEREOF)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-card border border-white/10 rounded-md font-mono text-xs">
            <span className={`w-2 h-2 rounded-full ${state.paused ? 'bg-destructive' : 'bg-primary animate-pulse'}`} />
            {state.paused ? 'ON PAUSE' : 'WATCHING'}
          </div>
          {state.isQuarantined && (
            <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/30 text-destructive rounded-md font-mono text-xs">
              <ShieldAlert className="w-3 h-3" />
              FULLY GHOSTED
            </div>
          )}
        </div>
      </div>

      {/* Token metrics strip */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-card border border-white/5 rounded-lg p-4 sm:col-span-1">
            <p className="font-mono text-xs text-muted-foreground mb-1">$GHOSTED PRICE</p>
            <p className="text-xl font-black">${metrics.price.toFixed(4)}</p>
            <p className={`font-mono text-xs mt-1 ${metrics.priceChange24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {metrics.priceChange24h >= 0 ? '+' : ''}{metrics.priceChange24h.toFixed(2)}% 24h
            </p>
          </div>
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">MARKET CAP</p>
            <p className="text-xl font-black">${(metrics.marketCap / 1_000_000).toFixed(1)}M</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">420M narrative</p>
          </div>
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">TOTAL SUPPLY</p>
            <p className="text-xl font-black">1B</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">$GHOSTED</p>
          </div>
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">HOLDERS</p>
            <p className="text-xl font-black">{metrics.holders.toLocaleString()}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">wallets ghosted</p>
          </div>
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">RECEIPT FEE</p>
            <p className="text-xl font-black">{metrics.receiptFeeEth} ETH</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">per submission</p>
          </div>
          <div className="bg-card border border-emerald-500/10 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">TOTAL FEES</p>
            <p className="text-xl font-black text-emerald-400">{metrics.totalRevenueCollected.toFixed(4)} ETH</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">all time revenue</p>
          </div>
          <div className="bg-card border border-violet-500/10 rounded-lg p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">TREASURY</p>
            <p className="text-xl font-black text-violet-400">{metrics.totalTreasuryDistributed.toFixed(4)} ETH</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">30% to community</p>
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard 
          title="GHOSTING LEVEL" 
          value={state.zeta.toFixed(4)} 
          icon={<Zap className="w-4 h-4 text-primary" />} 
          description="How much you've been ignored"
        />
        <MetricCard 
          title="HEARTBREAK BUILDUP" 
          value={state.phi.toFixed(4)} 
          icon={<Activity className="w-4 h-4 text-primary" />} 
          description="Feelings piling up over time"
        />
        <MetricCard 
          title="NO RETURN CHANCE" 
          value={`${(state.omega * 100).toFixed(1)}%`} 
          icon={<Skull className="w-4 h-4 text-primary" />} 
          description="Odds they're never texting back"
        />
        <MetricCard 
          title="DRIFTED APART" 
          value={`${(state.coupling * 100).toFixed(1)}%`} 
          icon={<AlertTriangle className="w-4 h-4 text-primary" />} 
          description="How far apart you two have grown"
        />
        <MetricCard 
          title="EMOTIONAL DEBT" 
          value={state.emotionalDebt.toFixed(2)} 
          icon={<HeartCrack className="w-4 h-4 text-destructive" />} 
          description="Accumulated unprocessed feelings"
        />
        <MetricCard 
          title="TRUTH ASSERTIONS" 
          value={String(state.truthAssertionCount ?? 0)} 
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} 
          description="Verified direct receipts on chain"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status + Rewards Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-6">
            <h3 className="font-bold font-mono text-sm text-muted-foreground">RELATIONSHIP STATUS</h3>
            
            <div className="flex flex-col gap-3">
              <StatusFlag label="STUCK ON THEM" active={state.locked} reward="1 ETH" />
              <StatusFlag label="FEELINGS EXPOSED" active={state.compromised} reward="5 ETH" />
              <StatusFlag label="THEY BOUNCED" active={state.escaped} reward="2 ETH" />
              <StatusFlag label="IT'S OFFICIALLY OVER" active={state.forked} reward="10 ETH" />
            </div>
            
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">TOTAL RECEIPTS</p>
                <p className="text-2xl font-black">{state.evidenceCounter}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">DIRECT PROOFS</p>
                <p className="text-2xl font-black text-emerald-400">{state.truthAssertionCount ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Detection entropy thresholds */}
          <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-bold font-mono text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="w-3 h-3" /> DETECTION ENTROPY
            </h3>
            
            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className={gaslightUnlocked ? 'text-primary' : 'text-muted-foreground'}>
                  {gaslightUnlocked ? '✓ GASLIGHT OVERRIDE' : 'GASLIGHT OVERRIDE'}
                </span>
                <span>{Math.min(state.evidenceCounter, 10)}/10</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${gaslightProgress}%` }} />
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1">10+ receipts → emotional debt reducible by 33%</p>
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs mb-2">
                <span className={forkReady ? 'text-primary' : 'text-muted-foreground'}>
                  {forkReady ? '✓ FORK READY' : 'FORK THRESHOLD'}
                </span>
                <span>{Math.min(state.evidenceCounter, 20)}/20</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${forkProgress}%` }} />
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1">20+ receipts → fork system, 10 ETH released</p>
            </div>
          </div>

          {/* VRF Legendary */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <h3 className="font-bold font-mono text-sm text-primary">VRF LEGENDARY REWARD</h3>
            </div>
            <p className="font-mono text-xs text-muted-foreground">Token #70 — "Ghosted Memories" collection. Block 91812, Bitcoin Exchange Era, July 2010. First verified ghost on-chain.</p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="font-mono text-xs text-muted-foreground">REWARD</span>
              <span className="font-mono text-sm font-black text-primary">1,000,000 $GHOSTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">STATUS</span>
              <span className="font-mono text-xs text-yellow-400">UNCLAIMED</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-bold font-mono text-sm text-muted-foreground">THE TEA — WHAT HAPPENED</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin">
            {timeline?.map((event) => (
              <div key={event.id} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0 last:border-0">
                <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-primary/20 border border-primary/50" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary font-mono">
                      {EVENT_LABELS[event.type] ?? event.type}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {format(new Date(event.timestamp), "HH:mm:ss.SSS")}
                    </span>
                  </div>
                  <p className="text-sm">{event.message}</p>
                  {event.value !== undefined && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      IMPACT: {event.value > 0 ? '+' : ''}{event.value.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TGE Allocation */}
      <div className="bg-card border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-bold font-mono text-sm text-muted-foreground">$GHOSTED TGE ALLOCATION — 1,000,000,000 TOKENS</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Community & Entropy Rewards", pct: "50%", tokens: "500M", color: "bg-primary" },
            { label: "Liquidity Pool (DEX)", pct: "20%", tokens: "200M", color: "bg-purple-400" },
            { label: "Ecosystem & Development", pct: "15%", tokens: "150M", color: "bg-violet-500" },
            { label: "Team (12-month lock)", pct: "10%", tokens: "100M", color: "bg-fuchsia-500" },
            { label: "VRF Legendary & Airdrops", pct: "5%", tokens: "50M", color: "bg-pink-500" },
          ].map((alloc) => (
            <div key={alloc.label} className="flex flex-col gap-2">
              <div className={`h-1.5 rounded-full ${alloc.color}`} />
              <p className="text-2xl font-black">{alloc.pct}</p>
              <p className="font-mono text-xs text-muted-foreground">{alloc.label}</p>
              <p className="font-mono text-xs text-primary">{alloc.tokens} $GHOSTED</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Holders */}
      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-bold font-mono text-sm text-muted-foreground">BIGGEST $GHOSTED HOLDERS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-white/5 text-muted-foreground">
              <tr>
                <th className="p-4 font-normal">RANK</th>
                <th className="p-4 font-normal">NAME / WALLET</th>
                <th className="p-4 font-normal">$GHOSTED HELD</th>
                <th className="p-4 font-normal">% OF SUPPLY</th>
                <th className="p-4 font-normal">LAST SEEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {holders?.map((holder) => (
                <tr key={holder.address} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-muted-foreground">{holder.rank}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-primary" />
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {holder.alias || `${holder.address.substring(0, 6)}...${holder.address.substring(holder.address.length - 4)}`}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{holder.balance.toLocaleString()} $GHOSTED</td>
                  <td className="p-4">{(holder.percentage * 100).toFixed(2)}%</td>
                  <td className="p-4 text-muted-foreground">
                    {format(new Date(holder.lastActivity), "MMM d, HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-mono text-xs font-bold text-muted-foreground tracking-wider">{title}</h3>
        {icon}
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground mt-2 font-mono">{description}</span>
      </div>
    </div>
  );
}

function StatusFlag({ label, active, reward }: { label: string, active: boolean, reward: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01]">
      <div className="flex flex-col">
        <span className="font-mono text-xs">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{reward} reward</span>
      </div>
      <div className={`px-2 py-1 rounded text-xs font-bold font-mono ${active ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted-foreground'}`}>
        {active ? 'YES' : 'NO'}
      </div>
    </div>
  );
}
