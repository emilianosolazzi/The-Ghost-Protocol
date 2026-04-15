import { useGetGhostState, useGetGhostTimeline, useGetTopHolders, getGetGhostStateQueryKey, getGetGhostTimelineQueryKey, getGetTopHoldersQueryKey } from "@workspace/api-client-react";
import { Activity, Skull, Zap, AlertTriangle, Clock, Users, Hash, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const { data: state, isLoading: isLoadingState } = useGetGhostState({ query: { queryKey: getGetGhostStateQueryKey() } });
  const { data: timeline, isLoading: isLoadingTimeline } = useGetGhostTimeline({ query: { queryKey: getGetGhostTimelineQueryKey() } });
  const { data: holders, isLoading: isLoadingHolders } = useGetTopHolders({ query: { queryKey: getGetTopHoldersQueryKey() } });

  if (isLoadingState || isLoadingTimeline || isLoadingHolders) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">CONNECTING TO VOID...</span>
        </div>
      </div>
    );
  }

  if (!state) return null;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">LIVE TELEMETRY</h1>
          <p className="text-muted-foreground font-mono text-sm">MONITORING CONTRACT STATE AND DRIFT ANOMALIES</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-card border border-white/10 rounded-md font-mono text-xs">
            <span className={`w-2 h-2 rounded-full ${state.paused ? 'bg-destructive' : 'bg-primary animate-pulse'}`} />
            {state.paused ? 'SYSTEM PAUSED' : 'SYSTEM ACTIVE'}
          </div>
          {state.isQuarantined && (
            <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/30 text-destructive rounded-md font-mono text-xs">
              <ShieldAlert className="w-3 h-3" />
              QUARANTINE LOCK
            </div>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="ZETA DRIFT" 
          value={state.zeta.toFixed(4)} 
          icon={<Zap className="w-4 h-4 text-primary" />} 
          description="Total systemic abandonment"
        />
        <MetricCard 
          title="PHI ACCUMULATION" 
          value={state.phi.toFixed(4)} 
          icon={<Activity className="w-4 h-4 text-primary" />} 
          description="Phase alignment decay"
        />
        <MetricCard 
          title="OMEGA PROBABILITY" 
          value={`${(state.omega * 100).toFixed(1)}%`} 
          icon={<Skull className="w-4 h-4 text-primary" />} 
          description="Quarantine threshold risk"
        />
        <MetricCard 
          title="COUPLING DIVERGENCE" 
          value={`${(state.coupling * 100).toFixed(1)}%`} 
          icon={<AlertTriangle className="w-4 h-4 text-primary" />} 
          description="Distance from absolute zero"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-6">
            <h3 className="font-bold font-mono text-sm text-muted-foreground">PROTOCOL FLAGS</h3>
            
            <div className="flex flex-col gap-4">
              <StatusFlag label="LOCKED" active={state.locked} />
              <StatusFlag label="COMPROMISED" active={state.compromised} />
              <StatusFlag label="ESCAPED" active={state.escaped} />
              <StatusFlag label="FORKED" active={state.forked} />
            </div>
            
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">EVIDENCE</p>
                <p className="text-2xl font-black">{state.evidenceCounter}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">ANOMALIES</p>
                <p className="text-2xl font-black text-destructive">{state.anomalyCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-xl p-6 flex flex-col h-[500px]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-bold font-mono text-sm text-muted-foreground">EVENT TIMELINE</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin">
            {timeline?.map((event) => (
              <div key={event.id} className="relative pl-6 pb-6 border-l border-white/10 last:pb-0 last:border-0">
                <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-primary/20 border border-primary/50" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary font-mono">{event.type}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {format(new Date(event.timestamp), "HH:mm:ss.SSS")}
                    </span>
                  </div>
                  <p className="text-sm">{event.message}</p>
                  {event.value !== undefined && (
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      DELTA: {event.value > 0 ? '+' : ''}{event.value.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Holders */}
      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="font-bold font-mono text-sm text-muted-foreground">TOP HOLDERS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-white/5 text-muted-foreground">
              <tr>
                <th className="p-4 font-normal">RANK</th>
                <th className="p-4 font-normal">ADDRESS / ALIAS</th>
                <th className="p-4 font-normal">BALANCE</th>
                <th className="p-4 font-normal">% TOTAL</th>
                <th className="p-4 font-normal">LAST ACTIVE</th>
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
                  <td className="p-4">{holder.balance.toLocaleString()} GHOST</td>
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

function StatusFlag({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01]">
      <span className="font-mono text-sm">{label}</span>
      <div className={`px-2 py-1 rounded text-xs font-bold font-mono ${active ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted-foreground'}`}>
        {active ? 'TRUE' : 'FALSE'}
      </div>
    </div>
  );
}
