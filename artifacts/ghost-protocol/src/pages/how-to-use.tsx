import { Link } from "wouter";
import { Ghost, Eye, FileText, BarChart2, ArrowRight, MessageSquareX, Zap, ShieldAlert, Skull, HelpCircle, Send } from "lucide-react";

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
          GhostProtocol is a memecoin built around one universal experience: being ignored.
          Here's everything you need to know to read the dashboard, log receipts, and understand what each number actually means.
        </p>
      </div>

      {/* What Is GhostProtocol */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Ghost className="w-4 h-4" />} label="THE BASICS" />
        <h2 className="text-3xl font-black">What is GhostProtocol?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              $GHOST is a memecoin that tracks the one thing everyone has in common — being left on read. 
              The smart contract watches for ghosting activity, measures how bad it is, and turns that pain into token mechanics.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every time someone gets ghosted, the ghosting level rises. When it rises enough, $GHOST gets burned (removed from supply forever), making each remaining token slightly more scarce.
            </p>
          </div>
          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              You can participate in two ways:
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Watch the live tracker</span> — see the ghosting level, heartbreak buildup, and relationship events in real time.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Log your receipts</span> — submit proof of being ghosted to raise the ghosting level and earn community clout.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Live Tracker */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<BarChart2 className="w-4 h-4" />} label="LIVE TRACKER" />
        <h2 className="text-3xl font-black">What do the numbers mean?</h2>
        <p className="text-muted-foreground font-mono text-sm">
          The tracker page shows four key readings at all times. Here's what each one tells you:
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <MetricExplainer
            icon={<Zap className="w-5 h-5 text-primary" />}
            name="GHOSTING LEVEL"
            short="How much ignoring has happened"
            description="This is the core number. It rises every time a ghosting event is logged — an ignored text, a read receipt with no reply, a conversation that just died. The higher this gets, the more $GHOST gets burned. Think of it as a collective measure of how ignored everyone is feeling right now."
            range="0 is fine. Anything above 0.5 is concerning. Above 0.9 means the vibe is fully dead."
          />
          <MetricExplainer
            icon={<MessageSquareX className="w-5 h-5 text-primary" />}
            name="HEARTBREAK BUILDUP"
            short="How long the pain has been piling up"
            description="This measures how long the ghosting level has stayed high without resolution. If someone's been ignored for days, the heartbreak buildup climbs. It amplifies the ghosting level — a brief cold shoulder is one thing, but a week of silence is another."
            range="Low is fine. Once it passes 0.5, feelings have been sitting unaddressed for a while."
          />
          <MetricExplainer
            icon={<Skull className="w-5 h-5 text-primary" />}
            name="NO RETURN CHANCE"
            short="Odds they're never texting back"
            description="A percentage showing how likely it is that the ghosting is permanent. Calculated from the ghosting level and how long it's been building. Below 30% and there's still hope. Above 60% and you should probably move on."
            range="Under 30% — they might come back. 60-80% — it's not looking good. 80%+ — you've been permanently ghosted."
          />
          <MetricExplainer
            icon={<ShieldAlert className="w-5 h-5 text-primary" />}
            name="DRIFTED APART"
            short="How far apart two people have grown"
            description="Measures the gap between two people's engagement scores — how much one person is putting in versus the other. If one person is texting and the other is silent, this number climbs. When it hits 100%, the connection is considered completely severed."
            range="Under 20% — still close. 40-70% — things are uneven. Above 80% — major drift, possibly permanent."
          />
        </div>
      </section>

      {/* Relationship Status */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Eye className="w-4 h-4" />} label="RELATIONSHIP STATUS" />
        <h2 className="text-3xl font-black">What are the status flags?</h2>
        <p className="text-muted-foreground font-mono text-sm">
          These four flags tell you what stage the relationship has reached. They're binary — either it's happened or it hasn't.
        </p>
        <div className="flex flex-col gap-3">
          <FlagExplainer
            label="STUCK ON THEM"
            meaning="The ghosting level crossed a point of no return. You can't unsee the read receipt. The contract is locked — this person is embedded in your brain."
            icon="🔒"
          />
          <FlagExplainer
            label="FEELINGS EXPOSED"
            meaning="The heartbreak buildup got so high that feelings slipped out — a double text, a voice note, something you probably regret. Emotionally compromised."
            icon="💬"
          />
          <FlagExplainer
            label="THEY BOUNCED"
            meaning="The drift became total. They left the chat — figuratively or literally. The connection has been severed by external forces (i.e., them deciding to ghost)."
            icon="👻"
          />
          <FlagExplainer
            label="IT'S OFFICIALLY OVER"
            meaning="The two people in question have permanently diverged. Two separate realities, on-chain, forever. There is no coming back from this flag."
            icon="💀"
          />
        </div>
      </section>

      {/* The Tea */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<MessageSquareX className="w-4 h-4" />} label="EVENT FEED" />
        <h2 className="text-3xl font-black">What's "The Tea"?</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Tea is a live feed of events the contract has logged. Every time something happens — someone submits a receipt, the ghosting level rises, a red flag is spotted — it shows up here in real time.
        </p>
        <div className="bg-card border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <p className="text-sm font-mono text-muted-foreground mb-2">COMMON EVENTS YOU'LL SEE:</p>
          <EventRow label="Getting More Distant" desc="The ghosting level went up — someone new got left on read." />
          <EventRow label="Feelings Piling Up" desc="The heartbreak buildup increased — the silence is lasting longer." />
          <EventRow label="Receipt Logged" desc="Someone submitted proof of being ghosted." />
          <EventRow label="Red Flag Spotted" desc="Unusual behavior detected — like a triple text at 3am with no reply." />
          <EventRow label="They Bounced" desc="A connection was officially severed — drifted too far apart to recover." />
          <EventRow label="Ghost Bag Growing" desc="Token rewards distributed to $GHOST holders." />
        </div>
      </section>

      {/* Logging a Receipt */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<FileText className="w-4 h-4" />} label="LOGGING RECEIPTS" />
        <h2 className="text-3xl font-black">How do I log a receipt?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Logging a receipt submits proof of your ghosting experience to the contract. It raises the ghosting level, logs an event in The Tea, and adds to the permanent on-chain record.
        </p>

        <div className="flex flex-col gap-4">
          <Step
            number={1}
            title="Go to Log Receipt"
            desc="Hit the Log Receipt link in the top nav, or click the button on the homepage."
          />
          <Step
            number={2}
            title="Get your proof hash"
            desc='Hit "Generate For Me" and the app will create a unique hash for you. This is your anonymous proof — no personal info attached, just a cryptographic fingerprint.'
          />
          <Step
            number={3}
            title="Rate how bad it was"
            desc="Score from 1 to 100. A 1 is a mild vibe check ignored. A 100 is a multi-paragraph heartfelt message, read at 11:43pm, with zero response."
          />
          <Step
            number={4}
            title="Describe what happened (optional)"
            desc={`Add context if you want — something like: Sent "we still on for tonight?" at 6pm. Read at 6:02pm. No response. It does not change anything mechanically but it goes into the permanent record.`}
          />
          <Step
            number={5}
            title="Submit"
            desc="Hit Submit and your receipt is logged permanently. The ghosting level rises, a new event appears in The Tea, and your pain is now on-chain forever."
          />
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-primary font-bold">NOTE:</span> Each proof hash can only be submitted once. If you try to submit the same one twice, the contract will reject it. Generate a fresh hash for each new receipt.
          </p>
        </div>
      </section>

      {/* Red Flags & Receipts */}
      <section className="flex flex-col gap-6">
        <SectionLabel icon={<Send className="w-4 h-4" />} label="QUICK REFERENCE" />
        <h2 className="text-3xl font-black">Glossary</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { term: "Ghosting Level", def: "The main measure of how much ignoring is happening. Higher = more ghosting, more burns." },
            { term: "Heartbreak Buildup", def: "How long the pain has been unresolved. Amplifies the ghosting level over time." },
            { term: "No Return Chance", def: "The probability (as a %) that the ghosting is permanent and they're never replying." },
            { term: "Drifted Apart", def: "How uneven the connection is — one side texting, the other side silent." },
            { term: "Receipts", def: "Proof of being ghosted that you submit. Raises the ghosting level when accepted." },
            { term: "Red Flags", def: "Unusual behavior patterns logged by the contract — triple texts, 3am messages, etc." },
            { term: "The Tea", def: "The live event feed showing everything the contract has logged in real time." },
            { term: "$GHOST", def: "The token. Gets burned when ghosting levels spike. Scarcer supply over time." },
            { term: "Stuck On Them", def: "Status flag — the ghosting level crossed the point of no return." },
            { term: "It's Officially Over", def: "Status flag — two people have permanently diverged. On-chain. Forever." },
          ].map(({ term, def }) => (
            <div key={term} className="bg-card border border-white/5 rounded-lg p-4">
              <p className="font-bold font-mono text-sm text-primary mb-1">{term}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{def}</p>
            </div>
          ))}
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
