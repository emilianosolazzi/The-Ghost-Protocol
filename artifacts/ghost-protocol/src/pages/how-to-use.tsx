import { Link } from "wouter";
import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { Ghost, FileText, BarChart2, ArrowRight, Zap, ShieldAlert, HelpCircle, Send, Coins, Lock, CheckCircle2, Wallet, Activity } from "lucide-react";
import { formatEthAmount } from "@/lib/ghost-protocol-client";

function formatTokenAmount(amount: bigint) {
  return Number(amount / 10n ** 18n).toLocaleString();
}

const receiptRewardMultiplier = Number(ghostProtocolUiConstants.receiptRewardMultiplier);
const maxGhostedPerSubmission = Number(ghostProtocolUiConstants.maxGhostedPerSubmission / 10n ** 18n);
const treasuryCutEth = (ghostProtocolUiConstants.receiptFeeEth * ghostProtocolUiConstants.treasurySplitBps) / ghostProtocolUiConstants.bpsDenominator;
const protocolCutEth = ghostProtocolUiConstants.receiptFeeEth - treasuryCutEth;

export function HowToUse() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex flex-col gap-20">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 text-primary">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">HOW IT WORKS</h1>
        <p className="text-muted-foreground font-mono text-base max-w-2xl mx-auto leading-relaxed">
          GhostProtocol is only useful if the frontend describes the same mechanics the contract actually runs.
          This page is the contract-accurate map of the current local build.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Ghost className="w-4 h-4" />} label="THE BASICS" />
        <h2 className="text-3xl font-black">What is GhostProtocol?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              GhostProtocol is a receipt ledger and story-unlock contract wired to a token called <span className="text-white font-semibold">$GHOSTED</span>.
              The core action is <span className="text-white font-semibold">submitEvidence</span>: store a unique proof hash,
              pay a fixed ETH fee, and optionally earn a direct $GHOSTED payout.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every evidence entry also creates a locked story priced at <span className="text-white font-semibold">{formatTokenAmount(ghostProtocolUiConstants.baseUnlockPrice)} GHOSTED</span>.
              Stories can later be unlocked with tokens, ETH, or enough credibility, and separate truth stakes can be attached to them.
            </p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              What you can do:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Log a receipt</span> — submit proof of being ghosted and earn $GHOSTED for direct evidence.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Unlock stories</span> — reveal the details behind a receipt using tokens, ETH, or your credibility score.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Stake on truth</span> — bet $GHOSTED on whether a receipt is real or fake.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Watch the feed</span> — see receipts land in real time on the dashboard.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<BarChart2 className="w-4 h-4" />} label="LIVE TRACKER" />
        <h2 className="text-3xl font-black">What do the numbers mean?</h2>
        <p className="text-muted-foreground font-mono text-sm">
          The dashboard is a thin view over <span className="text-white font-semibold">getProtocolStats()</span> plus per-story reads.
          These are the labels that matter:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <MetricExplainer
            icon={<Activity className="w-5 h-5 text-primary" />}
            name="TOTAL / DIRECT / PROXY EVIDENCE"
            short="How many receipts are stored"
            description="These come from the contract counters. Total evidence is every submission. Direct evidence is the subset that earned $GHOSTED. Proxy evidence is the subset stored with zero reward."
            range="These are literal counters, not derived vibes or weighted scores."
          />
          <MetricExplainer
            icon={<Lock className="w-5 h-5 text-primary" />}
            name="TRUTH ASSERTIONS"
            short="How many truth stakes have been placed globally"
            description="The stats field named totalTruthAssertions increments when anyone calls assertTruth on a proof hash, not on receipt submission. Direct receipts are counted by the separate directEvidence counter."
            range="Per-story truth stake counts are read with getTruthAssertionCount(proofHash)."
          />
          <MetricExplainer
            icon={<Wallet className="w-5 h-5 text-primary" />}
            name="REVENUE / TREASURY / RETAINED / BALANCE"
            short={`Where the ${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH fee goes`}
            description={`Every submission pays ${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH. The contract forwards 30% to treasury, tracks the retained 70% cumulatively, tracks any later admin withdrawals, and exposes the live ETH balance separately.`}
            range={`Per submission: ${formatEthAmount(treasuryCutEth, 5)} ETH to treasury, ${formatEthAmount(protocolCutEth, 5)} ETH retained by GhostProtocol.`}
          />
          <MetricExplainer
            icon={<Coins className="w-5 h-5 text-primary" />}
            name="REWARDED / GASLIGHT FLAG"
            short="What has been paid and whether 10 receipts have been reached"
            description="Rewarded GHOSTED includes both direct receipt payouts and oracle-resolved truth wins. The gaslight flag is just a boolean derived from total evidence >= 10."
            range="The current contract has no fork threshold, milestone ETH release, or heartbreak meter."
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<FileText className="w-4 h-4" />} label="EVIDENCE" />
        <h2 className="text-3xl font-black">What exactly gets stored?</h2>
        <p className="text-muted-foreground font-mono text-sm">
          An evidence record is small and explicit. There are no hidden emotional models in this build.
        </p>
        <div className="flex flex-col gap-3">
          <FlagExplainer
            label="PROOF HASH"
            meaning="A 32-byte unique key. The contract rejects duplicates, so each evidence item can only be submitted once."
            icon="#"
          />
          <FlagExplainer
            label="SEVERITY"
            meaning={`An integer from 1 to 100. Direct rewards are severity × ${receiptRewardMultiplier.toLocaleString()} $GHOSTED, capped at ${maxGhostedPerSubmission.toLocaleString()}.`}
            icon="!"
          />
          <FlagExplainer
            label="DESCRIPTION HASH"
            meaning="The raw description text is not persisted. The contract stores keccak256(description) so the ledger keeps a fingerprint, not the message body."
            icon="*"
          />
          <FlagExplainer
            label="CONTENT CID"
            meaning="An optional IPFS content identifier linking to off-chain evidence media. Stored directly in the evidence struct."
            icon="@"
          />
          <FlagExplainer
            label="DRAMA TYPE + SUBMITTER + REWARD"
            meaning="Each record also stores the selected drama type string, whether it was proxy evidence, who submitted it, and how much $GHOSTED was paid."
            icon=">"
          />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Zap className="w-4 h-4" />} label="FEE FLOW" />
        <h2 className="text-3xl font-black">What happens when you submit?</h2>
        <p className="text-muted-foreground leading-relaxed">
          A receipt submission is a real payable transaction. The contract emits events, updates counters, and initializes the related story in one call.
        </p>
        <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <p className="text-sm font-mono text-muted-foreground mb-2">SUBMIT EVIDENCE CHANGES:</p>
          <EventRow label={`${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH collected`} desc="The contract requires the exact fee and refunds any overpayment." />
          <EventRow label="Treasury paid" desc="30% of the fee is forwarded to the configured treasury address immediately." />
          <EventRow label="Protocol revenue retained" desc="70% stays in the contract and shows up as protocol revenue on the dashboard." />
          <EventRow label="Direct reward paid" desc={`If the receipt is direct, the submitter receives severity × ${receiptRewardMultiplier.toLocaleString()} $GHOSTED, capped at ${maxGhostedPerSubmission.toLocaleString()}.`} />
          <EventRow label="Story initialized" desc="A locked story is created with a base unlock price of 500 GHOSTED." />
          <EventRow label="Events emitted" desc="EvidenceSubmitted, GhostingReceiptSubmitted, and receipt-level events (TruthStakeReceipt, VindicationReceipt, HumiliationReceipt, ExposureReceipt, WhistleblowerReceipt) are emitted on-chain." />
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<FileText className="w-4 h-4" />} label="LOGGING RECEIPTS" />
        <h2 className="text-3xl font-black">How do I log a receipt?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Logging a receipt calls <span className="text-white font-semibold">submitEvidence</span>. The frontend builds the payload,
          your wallet signs the transaction, and the dashboard refetches live state once the receipt is mined.
        </p>

        <div className="flex flex-col gap-4">
          <Step
            number={1}
            title="Go to Log Receipt"
            desc="Hit LOG RECEIPT in the nav, or use the button on the homepage."
          />
          <Step
            number={2}
            title="Get your proof hash"
            desc='Hit "Generate For Me" and the app creates a unique hash for you. This is your anonymous proof — no personal info attached, just a cryptographic fingerprint. Each hash can only be submitted once.'
          />
          <Step
            number={3}
            title="Choose: Direct or Third Party"
            desc="Direct evidence earns $GHOSTED and increments the direct evidence counter. Proxy evidence is still stored on-chain but earns no token payout."
          />
          <Step
            number={4}
            title="Rate how bad it was"
            desc={`Score 1-100. A 1 is a mild vibe check ignored. A 100 is a heartfelt message, read at 11:43pm, zero response. Your weight × ${receiptRewardMultiplier.toLocaleString()} = your $GHOSTED reward for direct receipts, up to ${maxGhostedPerSubmission.toLocaleString()}.`}
          />
          <Step
            number={5}
            title="Describe what happened (optional)"
            desc={`Add context if you want — something like: Sent "we still on for tonight?" at 6pm. Read at 6:02pm. No response. The plain text stays in your review archive; the contract stores only its hash.`}
          />
          <Step
            number={6}
            title="Submit and watch the chain react"
            desc="Your receipt is logged permanently. The contract updates counters, splits the ETH fee, initializes the story, and credits the direct reward if applicable."
          />
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary font-bold">NOTE:</span> Each proof hash can only be submitted once — duplicates are rejected. The contract keeps a permanent chain of all submitted evidence. Direct evidence is the only kind that earns $GHOSTED.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Lock className="w-4 h-4" />} label="DETECTION ENTROPY" />
        <h2 className="text-3xl font-black">How do story unlocks work?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Every evidence item creates a locked story. Access is not automatic unless the submitter later makes the story public.
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "BURN UNLOCK", trigger: "Pay the token unlock price. Half is burned, half is transferred to the submitter.", reward: `${formatTokenAmount(ghostProtocolUiConstants.baseUnlockPrice)} GHOSTED base`, icon: "B" },
            { label: "CREDIBILITY UNLOCK", trigger: "Requires effective credibility above both the global floor and the story-specific severity threshold. Effective means token credibility plus protocol-earned credibility.", reward: `${formatTokenAmount(ghostProtocolUiConstants.credibilityUnlockThreshold)} floor`, icon: "C" },
            { label: "ETH UNLOCK", trigger: "Pay the ETH-equivalent unlock price using the current oracle quote. If the quote is stale, ETH unlocks are unavailable until refreshed.", reward: "quoted", icon: "E" },
            { label: "PUBLIC STORY", trigger: "Only the original submitter can flip a story to public access.", reward: "0 cost", icon: "P" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-4 p-4 bg-card border border-white/5 rounded-xl hover:border-white/10 transition-colors">
              <span className="text-xl shrink-0">{r.icon}</span>
              <div className="flex-1">
                <p className="font-black font-mono text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.trigger}</p>
              </div>
              <span className="font-mono font-black text-primary text-sm shrink-0">{r.reward}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The unlock price increases by a fixed 50 GHOSTED step after each paid unlock until it reaches the 2,500 GHOSTED cap. The recent evidence cards show the current token unlock price and whether the active wallet can access the story.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Coins className="w-4 h-4" />} label="TRUTH STAKES" />
        <h2 className="text-3xl font-black">How does asserting truth work?</h2>
        <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col gap-4">
          <p className="text-muted-foreground leading-relaxed">
            Truth staking is a separate path from direct evidence submission. Anyone can call <span className="text-white font-semibold">assertTruth</span>
            on an existing proof hash and stake <span className="text-white font-semibold">{formatTokenAmount(ghostProtocolUiConstants.truthAssertionStake)} GHOSTED</span>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Later, the oracle resolves each truth stake. A correct call earns <span className="text-primary font-bold">{formatTokenAmount(ghostProtocolUiConstants.truthWinReward)} GHOSTED</span>
            and a +100 protocol credibility bump inside GhostProtocol. A wrong call sends half the stake to the story submitter and burns the other half.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/5">
            <div>
              <p className="font-mono text-xs text-muted-foreground mb-1">STAKE</p>
              <p className="font-mono text-sm font-black">{formatTokenAmount(ghostProtocolUiConstants.truthAssertionStake)} $GHOSTED</p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground mb-1">WIN REWARD</p>
              <p className="font-mono text-sm font-black text-primary">{formatTokenAmount(ghostProtocolUiConstants.truthWinReward)} $GHOSTED</p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground mb-1">RESOLUTION</p>
              <p className="font-mono text-sm font-black text-yellow-400">ORACLE</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Send className="w-4 h-4" />} label="QUICK REFERENCE" />
        <h2 className="text-3xl font-black">Glossary</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { term: "Direct Evidence", def: `A receipt submission with isProxy = false. Earns severity × ${receiptRewardMultiplier.toLocaleString()} $GHOSTED up to the max cap of ${maxGhostedPerSubmission.toLocaleString()}.` },
            { term: "Proxy Evidence", def: "A stored receipt with isProxy = true. It is recorded on-chain but pays no direct reward." },
            { term: "Truth Assertions", def: "The totalTruthAssertions value returned by getProtocolStats. It increments when assertTruth is called, not on receipt submission." },
            { term: "Truth Stake", def: "A separate per-story stake created with assertTruth(proofHash, believesReal)." },
            { term: "Base Unlock Price", def: "The starting story price: 500 $GHOSTED." },
            { term: "Unlock Price Step", def: "Each paid unlock adds a flat 50 $GHOSTED until the story price reaches the 2,500 $GHOSTED cap." },
            { term: "Credibility Unlock Floor", def: "The minimum token credibility required before a credibility unlock can succeed: 1,000." },
            { term: "Protocol Retained Revenue", def: `The lifetime 70% portion of each ${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH submission fee tracked as retained by the contract.` },
            { term: "Protocol Withdrawn", def: "The cumulative ETH later withdrawn from GhostProtocol to treasury by an owner action." },
            { term: "Protocol Balance", def: "The current ETH balance still sitting in the contract after treasury forwarding and any later withdrawals." },
            { term: "Treasury Distributed", def: `The 30% portion of each ${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH submission fee already forwarded to treasury.` },
            { term: "Effective Credibility", def: "Token credibility plus protocol-earned credibility tracked inside GhostProtocol." },
            { term: "$GHOSTED", def: "The ERC-20 style token used for direct rewards, story unlocks, and truth staking." },
            { term: "10-Receipt Milestone", def: "A boolean exposed by getProtocolStats once total evidence reaches 10." },
            { term: "Description Hash", def: "keccak256(description). The contract stores this hash, not the plain text." },
            { term: "Story Public", def: "A receipt story the submitter has explicitly opened for everyone." },
            { term: "Access Locked", def: "The story is still private and the current wallet has not unlocked it yet." },
          ].map(({ term, def }) => (
            <div key={term} className="bg-card border border-white/5 rounded-lg p-4">
              <p className="font-bold font-mono text-sm text-primary mb-1">{term}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionLabel icon={<CheckCircle2 className="w-4 h-4" />} label="NOT IN THIS BUILD" />
        <h2 className="text-3xl font-black">What the contract does not do</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="font-mono text-xs text-primary font-bold">NOT IMPLEMENTED</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No heartbreak buildup, no drift meter, no no-return probability, no fork threshold, no milestone ETH reward schedule,
              and no VRF legendary payout exist in the deployed GhostProtocol contract.
            </p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="font-mono text-xs text-primary font-bold">ALSO NOT IMPLEMENTED</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Direct reward payouts are not boosted by hold time, staking, or sell behavior. The only credibility usage in this build is
              story unlocking and oracle-resolved truth staking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center flex flex-col items-center gap-6 py-8 border-t border-white/5">
        <Ghost className="w-10 h-10 text-primary opacity-60" />
        <h2 className="text-2xl font-black">YOU GET IT NOW.</h2>
        <p className="text-muted-foreground font-mono text-sm">Go check the live tracker or log your first receipt.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="h-12 px-8 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-bold font-mono hover:bg-primary/90 transition-all group">
            SEE WHAT'S HAPPENING
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/evidence" className="h-12 px-8 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 text-white font-mono hover:bg-white/10 transition-all">
            LOG YOUR RECEIPT
          </Link>
        </div>
      </div>

    </div>
  );
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-muted-foreground text-xs font-mono w-fit">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
  );
}

function MetricExplainer({ icon, name, short, description, range }: {
  icon: React.ReactNode;
  name: string;
  short: string;
  description: string;
  range: string;
}) {
  return (
    <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-3 group hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-black font-mono text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{short}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="pt-3 border-t border-white/5">
        <p className="text-xs font-mono text-primary/80">{range}</p>
      </div>
    </div>
  );
}

function FlagExplainer({ label, meaning, icon }: { label: string; meaning: string; icon: string }) {
  return (
    <div className="flex gap-4 p-4 bg-card border border-white/5 rounded-xl items-start hover:border-white/10 transition-colors">
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="font-black font-mono text-sm mb-1">{label}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{meaning}</p>
      </div>
    </div>
  );
}

function EventRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-primary font-mono text-xs font-bold shrink-0 w-44">{label}</span>
      <span className="text-sm text-muted-foreground">{desc}</span>
    </div>
  );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start p-5 bg-card border border-white/5 rounded-xl hover:border-white/10 transition-colors">
      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black shrink-0 text-sm">
        {number}
      </div>
      <div>
        <p className="font-bold font-mono text-sm mb-1">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
