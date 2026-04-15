import { Link } from "wouter";
import { Ghost, ArrowRight, Zap, Skull, ShieldAlert, ChevronDown, Flame, LineChart, Activity, Lock } from "lucide-react";
import { useGetGhostMetrics, getGetGhostMetricsQueryKey } from "@workspace/api-client-react";

export function Landing() {
  const { data: metrics, isLoading } = useGetGhostMetrics({ query: { queryKey: getGetGhostMetricsQueryKey() } });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-[-10vh]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            CONTRACT IS LIVE. ZETA LEVELS CRITICAL.
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            THEY LEFT YOU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-white">ON READ.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-mono animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            $GHOST is the first memecoin governed by relationship drift. 
            A cryptographic monument to every unreturned text, every "we should catch up," and the unhinged mathematics of modern isolation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/dashboard" className="h-14 px-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold font-mono hover:bg-primary/90 transition-all gap-2 group shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]">
              ENTER DASHBOARD
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/evidence" className="h-14 px-8 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-white font-mono hover:bg-white/10 transition-all backdrop-blur-sm">
              SUBMIT EVIDENCE
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Metrics Marquee */}
      <div className="w-full bg-primary/10 border-y border-primary/20 overflow-hidden py-4 backdrop-blur-md relative z-10">
        <div className="flex gap-12 items-center whitespace-nowrap animate-[marquee_30s_linear_infinite] font-mono text-sm tracking-wider">
          {!isLoading && metrics && (
            <>
              <span className="text-primary font-bold">GHOSTING INDEX: {metrics.ghostingIndex.toFixed(2)}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">HEARTBREAK SCORE: {metrics.heartbreakScore}/100</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">IGNORING TEXTS: {metrics.readReceiptsIgnored.toLocaleString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">HOLDERS: {metrics.holders.toLocaleString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">REJECTION RATE: {(metrics.rejectionRate * 100).toFixed(1)}%</span>
            </>
          )}
          {/* Duplicate for seamless loop */}
          {!isLoading && metrics && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">GHOSTING INDEX: {metrics.ghostingIndex.toFixed(2)}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">HEARTBREAK SCORE: {metrics.heartbreakScore}/100</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">IGNORING TEXTS: {metrics.readReceiptsIgnored.toLocaleString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">HOLDERS: {metrics.holders.toLocaleString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">REJECTION RATE: {(metrics.rejectionRate * 100).toFixed(1)}%</span>
            </>
          )}
        </div>
      </div>

      {/* The Protocol Section */}
      <section className="py-32 relative border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground text-xs font-mono">
                <Activity className="w-3 h-3 text-primary" />
                SYSTEM ARCHITECTURE
              </div>
              <h2 className="text-4xl md:text-5xl font-black">WE TOKENIZED THE SILENCE.</h2>
              <p className="text-xl text-muted-foreground font-mono leading-relaxed">
                GhostProtocol monitors the distance between two entities. When communication ceases, the smart contract registers a Drift Event. This initiates the Zeta decay cycle.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold font-mono">DEFLATIONARY ISOLATION</h4>
                    <p className="text-sm text-muted-foreground">Every unread message burns $GHOST.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold font-mono">DRIFT YIELD</h4>
                    <p className="text-sm text-muted-foreground">Stakers earn rewards from severed connections.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative bg-card border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="space-y-6 font-mono text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-muted-foreground">function monitorDrift() external</span>
                    <span className="text-primary">RUNNING</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-muted-foreground">require(lastContact &gt; timeout)</span>
                    <span className="text-destructive">FAILED</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-muted-foreground">emit RelationshipForked()</span>
                    <span className="text-primary">TRIGGERED</span>
                  </div>
                  <div className="pt-4 text-center text-xs text-muted-foreground animate-pulse">
                    AWAITING NEW BLOCKS...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Narrative */}
      <section className="py-32 relative border-b border-white/5 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">THE MATHEMATICS OF SILENCE</h2>
            <p className="text-xl text-muted-foreground font-mono">
              The GhostProtocol smart contract translates emotional distance into on-chain reality. 
              When they drift away, the protocol reacts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono">ZETA DECAY</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                As texts go unread, Zeta accumulation triggers algorithmic token burns. Their silence literally destroys value. It's not just emotional damage anymore.
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-destructive/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShieldAlert className="w-10 h-10 text-destructive mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono text-destructive">QUARANTINE PROTOCOL</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If the Omega threshold is breached, addresses caught in active ghosting loops are quarantined. No trading, no escape. Just you and your thoughts.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-white/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Skull className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono">FORK EVENT</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                When coupling divergence hits absolute zero, the relationship forks permanently. Two distinct realities on chain, never to merge again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">SUBMIT YOUR EVIDENCE</h2>
            <p className="text-xl text-muted-foreground font-mono">
              The contract feeds on data. Submit cryptographic proof of your ghosting events to increase systemic Zeta and accelerate the burn.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">HASH THE SILENCE</h4>
                  <p className="text-muted-foreground text-sm font-mono">Convert your unread timestamps into bytes32 hashes.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">ASSIGN WEIGHT</h4>
                  <p className="text-muted-foreground text-sm font-mono">Rate the severity. Was it a "hey" or a multi-paragraph text?</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">FEED THE PROTOCOL</h4>
                  <p className="text-muted-foreground text-sm font-mono">Your pain becomes on-chain immutable reality.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Lock className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">IMMUTABLE REJECTION</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Once submitted, evidence cannot be deleted. The blockchain remembers even if they pretend they didn't see it.
              </p>
              <Link href="/evidence" className="w-full h-12 inline-flex items-center justify-center rounded bg-white text-black font-bold font-mono hover:bg-gray-200 transition-colors">
                OPEN SUBMISSION PORTAL
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8">STOP CHECKING YOUR PHONE.</h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-12">
            They aren't going to text you back. But the contract is still running. Monitor the drift, submit your evidence, and watch the void stare back.
          </p>
          <Link href="/dashboard" className="h-16 px-12 inline-flex items-center justify-center rounded-md bg-primary text-white font-bold font-mono hover:bg-primary/90 transition-all text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]">
            INITIALIZE DASHBOARD
          </Link>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
