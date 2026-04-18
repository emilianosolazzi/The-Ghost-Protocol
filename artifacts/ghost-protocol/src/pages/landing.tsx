import { Link } from "wouter";
import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { Ghost, ArrowRight, Zap, Skull, ShieldAlert, ChevronDown, Flame, LineChart, Activity, Lock } from "lucide-react";
import { useGhostProtocolStats } from "@/hooks/use-ghost-protocol";
import { formatEthAmount } from "@/lib/ghost-protocol-client";

const receiptRewardMultiplier = Number(ghostProtocolUiConstants.receiptRewardMultiplier);
const maxGhostedPerSubmission = Number(ghostProtocolUiConstants.maxGhostedPerSubmission / 10n ** 18n);

export function Landing() {
  const { data: stats, isLoading } = useGhostProtocolStats();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
        
        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center mt-[-10vh]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            CONTRACT IS LIVE. RECEIPTS ONLY. NO MOCKS.
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            THEY LEFT YOU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-white">ON READ.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-10 font-mono animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 leading-relaxed">
            GhostProtocol is a receipt ledger with unlockable stories. Log a unique proof hash, pay the fixed {formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH fee,
            earn GHOSTED only for direct proof, and watch the live contract counters react in real time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/dashboard" className="h-14 px-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold font-mono hover:bg-primary/90 transition-all gap-2 group shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]">
              SEE WHAT'S HAPPENING
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/evidence" className="h-14 px-8 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-white font-mono hover:bg-white/10 transition-all backdrop-blur-sm">
              LOG YOUR RECEIPTS
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 md:grid-cols-3">
            <div className="ghost-panel-soft p-4 text-left">
              <p className="ghost-label mb-2">1. Log A Receipt</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Direct proof pays GHOSTED. Proxy proof is recorded, but earns nothing.</p>
            </div>
            <div className="ghost-panel-soft p-4 text-left">
              <p className="ghost-label mb-2">2. Story Locks In</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Every proof creates a locked story priced from the base unlock of 500 GHOSTED.</p>
            </div>
            <div className="ghost-panel-soft p-4 text-left">
              <p className="ghost-label mb-2">3. Truth Stakes Happen Later</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Separate truth assertions stake 100 GHOSTED and resolve through the oracle path.</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Metrics Marquee */}
      <div className="w-full bg-primary/10 border-y border-primary/20 overflow-hidden py-4 backdrop-blur-md relative z-10">
        <div className="flex gap-12 items-center whitespace-nowrap animate-[marquee_30s_linear_infinite] font-mono text-sm tracking-wider">
          {!isLoading && stats && (
            <>
              <span className="text-primary font-bold">DIRECT: {stats.directEvidence}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">TOTAL: {stats.totalEvidence}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">DIRECT RECEIPT INDEX: {stats.totalTruthAssertions}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">REVENUE: {(Number(stats.revenueCollected) / 1e18).toFixed(2)} ETH</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">GHOSTED: {(Number(stats.rewardedGhosted) / 1e18 / 1_000_000).toFixed(1)}M</span>
            </>
          )}
          {!isLoading && stats && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">DIRECT: {stats.directEvidence}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-white">TOTAL: {stats.totalEvidence}</span>
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
                HOW IT WORKS
              </div>
              <h2 className="text-4xl md:text-5xl font-black">WE PUT THE RECEIPTS ON-CHAIN.</h2>
              <p className="text-xl text-muted-foreground font-mono leading-relaxed">
                GhostProtocol records proof hashes, severity, fee splits, and unlockable stories. Direct submissions pay
                $GHOSTED to the submitter; proxy submissions stay as ledger entries with no token payout.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold font-mono">EVERY RECEIPT COSTS {formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH</h4>
                      <p className="text-sm text-muted-foreground">30% goes to treasury. The remaining 70% is tracked as retained revenue, while the live contract balance is shown separately.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold font-mono">DIRECT PROOF PAYS $GHOSTED</h4>
                    <p className="text-sm text-muted-foreground">Direct receipts pay severity × {receiptRewardMultiplier.toLocaleString()}, capped at {maxGhostedPerSubmission.toLocaleString()} $GHOSTED. Proxy receipts pay nothing.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/image0(4).jpeg"
                  alt="GhostProtocol — Submit Evidence, Credibility Score, Truth Oracle, GHOSTED tokens"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Narrative */}
      <section className="py-32 relative border-b border-white/5 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">THE CONTRACT STATE THAT MATTERS</h2>
            <p className="text-xl text-muted-foreground font-mono">
              The live UI is only useful if the labels match the code. These are the mechanics the deployed contract
              actually exposes today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono">ON-CHAIN EVIDENCE</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Each proof hash can only be submitted once. The contract stores timestamp, severity, drama type,
                submitter, payout amount, and a hash of the optional description.
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-destructive/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShieldAlert className="w-10 h-10 text-destructive mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono text-destructive">LOCKED STORIES</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every receipt initializes a locked story at 500 GHOSTED. Users can unlock with token burn, ETH, or enough credibility.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-white/5 relative overflow-hidden group hover:border-white/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Skull className="w-10 h-10 text-white mb-6" />
              <h3 className="text-xl font-bold mb-4 font-mono">TRUTH STAKES</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Separate from direct receipt counting, users can stake 100 GHOSTED on a proof hash and wait for oracle resolution.
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
            <h2 className="text-4xl md:text-5xl font-black mb-6">LOG YOUR RECEIPTS</h2>
            <p className="text-xl text-muted-foreground font-mono">
              The loop is simple: unique proof hash, severity, direct or proxy, then a permanent contract event.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">TURN THE SILENCE INTO A RECEIPT</h4>
                  <p className="text-muted-foreground text-sm font-mono">Convert the moment into a unique proof hash the contract can verify as unused.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">RATE HOW BAD IT WAS</h4>
                  <p className="text-muted-foreground text-sm font-mono">Was it a soft fade or a full ghost after a serious message? Severity drives only the direct payout.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">MAKE IT PERMANENT</h4>
                  <p className="text-muted-foreground text-sm font-mono">Your receipt gets logged on-chain, a story gets initialized, and the dashboard reflects it after the transaction lands.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-white/10 rounded-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Lock className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">STORED FOREVER</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Once you log it, it's permanent. The blockchain remembers even when they pretend they never saw your message.
              </p>
              <Link href="/evidence" className="w-full h-12 inline-flex items-center justify-center rounded bg-white text-black font-bold font-mono hover:bg-gray-200 transition-colors">
                LOG YOUR RECEIPT
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8">STOP CHECKING YOUR PHONE.</h2>
          <p className="text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-12">
            They aren&apos;t going to text back. But the contract is still running. Watch the receipt ledger update, log your evidence, and let the chain keep score.
          </p>
          <Link href="/dashboard" className="h-16 px-12 inline-flex items-center justify-center rounded-md bg-primary text-white font-bold font-mono hover:bg-primary/90 transition-all text-lg shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]">
            SEE WHAT'S HAPPENING
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
