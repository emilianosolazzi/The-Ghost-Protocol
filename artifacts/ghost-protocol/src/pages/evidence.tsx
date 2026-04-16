import { useState } from "react";
import { useSubmitEvidence, getGetGhostStateQueryKey, getGetGhostTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldAlert, FileText, Upload, Fingerprint, Activity,
  AlertTriangle, CheckCircle2, Coins, Flame, Clock, Info
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Drama types matching the contract's CredibilityMetadata.dramaType field
const DRAMA_TYPES = [
  { id: "left_on_read",      label: "Left On Read",           emoji: "👀", desc: "Read. Silence." },
  { id: "delivered_no_open", label: "Delivered, Never Opened", emoji: "📬", desc: "Hasn't even looked" },
  { id: "seen_on_story",     label: "Seen Your Story",        emoji: "👻", desc: "Active everywhere, silent here" },
  { id: "slow_fade",         label: "The Slow Fade",          emoji: "🌫️", desc: "Replies dying off" },
  { id: "soft_ghost",        label: "Soft Ghost",             emoji: "🌙", desc: "One-word answers, vibes gone" },
  { id: "hard_ghost",        label: "Hard Ghost",             emoji: "💀", desc: "Complete disappearance" },
  { id: "orbiting",          label: "Orbiting",               emoji: "🛸", desc: "Likes but won't talk" },
  { id: "double_text",       label: "Double Text Ignored",    emoji: "🗓️", desc: "You texted twice, still nothing" },
];

const formSchema = z.object({
  hash:        z.string().min(1, "A proof hash is required").regex(/^0x[a-fA-F0-9]{64}$/, "Must start with 0x followed by 64 hex characters"),
  weight:      z.coerce.number().min(1).max(100),
  description: z.string().optional(),
  isProxy:     z.boolean().default(false),
  dramaType:   z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

// Fee constants (mirrors contract)
const RECEIPT_FEE_ETH = 0.01;
const TREASURY_SPLIT  = 0.30;  // 30% to treasury
const PROTOCOL_SPLIT  = 0.70;  // 70% stays in protocol
const MAX_GHOSTED     = 100_000;

export function Evidence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: submitEvidence, isPending } = useSubmitEvidence();
  const [lastResult, setLastResult] = useState<{ reward: number; dramaLabel: string } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { hash: "", weight: 50, description: "", isProxy: false, dramaType: "" },
  });

  const watchWeight   = form.watch("weight");
  const watchIsProxy  = form.watch("isProxy");
  const watchDrama    = form.watch("dramaType");
  const estimatedReward = watchIsProxy ? 0 : Math.min(watchWeight * 1_000, MAX_GHOSTED);

  const onSubmit = (data: FormValues) => {
    submitEvidence({ data }, {
      onSuccess: (result) => {
        if (result.success) {
          const dramaLabel = DRAMA_TYPES.find(d => d.id === data.dramaType)?.label ?? "Receipt";
          setLastResult({ reward: result.ghostedReward ?? 0, dramaLabel });
          let title = "Receipt Logged";
          if (result.forkReady)       title = "FORK THRESHOLD REACHED";
          else if (result.gaslightUnlocked) title = "Gaslight Override Unlocked";
          toast({ title, description: result.message });
          form.reset();
          queryClient.invalidateQueries({ queryKey: getGetGhostStateQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGhostTimelineQueryKey() });
        } else {
          toast({ variant: "destructive", title: "Could Not Log Receipt", description: result.message });
        }
      },
      onError: () => {
        toast({ variant: "destructive", title: "Connection Error", description: "Could not reach the contract. Try again." });
      },
    });
  };

  const generateHash = () => {
    const chars = "0123456789abcdef";
    let h = "0x";
    for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * chars.length)];
    form.setValue("hash", h);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 text-primary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black mb-3">LOG YOUR RECEIPT</h1>
        <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto leading-relaxed">
          Submit direct proof of being ignored. The contract verifies it, adjusts the ghosting level, and pays you in $GHOSTED.
          Each submission costs <span className="text-primary font-bold">0.01 ETH</span> — split between the treasury and the reward pool.
        </p>
      </div>

      {/* Fee breakdown banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-white/5 rounded-xl p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">RECEIPT FEE</p>
          <p className="font-black text-xl text-primary">0.01 ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">per submission</p>
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">TREASURY CUT</p>
          <p className="font-black text-xl">0.003 ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">30% → community</p>
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">PROTOCOL POOL</p>
          <p className="font-black text-xl">0.007 ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">70% → milestone rewards</p>
        </div>
      </div>

      {/* Direct vs Proxy explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> DIRECT — I SAW IT MYSELF
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Screenshot, read receipt, delivered message they never opened. <span className="text-primary">Lowers ghosting level.</span> Earns up to <span className="text-primary font-bold">100,000 $GHOSTED</span>. Counts as a Truth Assertion.</p>
        </div>
        <div className="bg-card border border-destructive/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-destructive font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> PROXY — HEARD FROM SOMEONE
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">A friend told you, you saw them active, indirect evidence. <span className="text-destructive">Raises ghosting mismatch.</span> Earns zero $GHOSTED — the contract only pays for verified proof.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-white/10 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

            {/* Drama Type */}
            <FormField
              control={form.control}
              name="dramaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground mb-3 block">
                    WHAT KIND OF GHOST IS THIS?
                  </FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DRAMA_TYPES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => field.onChange(field.value === d.id ? "" : d.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${field.value === d.id ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"}`}
                      >
                        <p className="text-lg mb-1">{d.emoji}</p>
                        <p className={`font-mono text-xs font-bold leading-tight ${field.value === d.id ? "text-primary" : ""}`}>{d.label}</p>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5 leading-tight">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Receipt Type toggle */}
            <FormField
              control={form.control}
              name="isProxy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground mb-3 block">
                    YOUR RELATIONSHIP TO THIS PROOF
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={`p-4 rounded-lg border text-left transition-all ${!field.value ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"}`}
                    >
                      <CheckCircle2 className={`w-4 h-4 mb-2 ${!field.value ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-mono text-sm font-bold">DIRECT</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">I witnessed it myself</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`p-4 rounded-lg border text-left transition-all ${field.value ? "border-destructive bg-destructive/10" : "border-white/10 hover:border-white/20"}`}
                    >
                      <AlertTriangle className={`w-4 h-4 mb-2 ${field.value ? "text-destructive" : "text-muted-foreground"}`} />
                      <p className="font-mono text-sm font-bold">THIRD PARTY</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">Someone else told me</p>
                    </button>
                  </div>
                </FormItem>
              )}
            />

            {/* Proof hash */}
            <FormField
              control={form.control}
              name="hash"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                      <Fingerprint className="w-3 h-3" /> PROOF HASH
                    </FormLabel>
                    <button type="button" onClick={generateHash} className="text-xs font-mono text-primary hover:text-white transition-colors">
                      GENERATE FOR ME
                    </button>
                  </div>
                  <FormControl>
                    <Input placeholder="0x... (unique fingerprint of your evidence)" className="font-mono bg-background border-white/10 focus-visible:ring-primary/50" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">Each hash can only be submitted once — duplicates are rejected on-chain.</p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            {/* Severity */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3" /> SEVERITY — HOW BAD WAS IT?
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        className="flex-1 accent-primary"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <span className="font-mono font-black text-2xl text-primary w-12 text-right">{field.value}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-muted-foreground mt-1">
                    <span>1 — mild vibe check ignored</span>
                    <span>100 — heartfelt message, read, zero reply</span>
                  </div>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            {/* Reward preview */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border ${watchIsProxy ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5"}`}>
              <Coins className={`w-5 h-5 flex-shrink-0 ${watchIsProxy ? "text-destructive" : "text-primary"}`} />
              <div className="flex-1">
                {watchIsProxy ? (
                  <>
                    <p className="font-mono text-xs font-bold text-destructive">NO $GHOSTED REWARD</p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">Proxy receipts raise the mismatch signal but earn nothing. Only direct proof is rewarded.</p>
                  </>
                ) : (
                  <>
                    <p className="font-mono text-xs font-bold">ESTIMATED REWARD: <span className="text-primary">{estimatedReward.toLocaleString()} $GHOSTED</span></p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      Formula: severity × 1,000, capped at 100,000. Higher credibility score = boosted reward.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground flex items-center gap-2 mb-2">
                    <FileText className="w-3 h-3" /> WHAT HAPPENED? (OPTIONAL)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g. Sent "we still on for tonight?" at 6pm. Read at 6:02pm. No response. 3 days later.'
                      className="resize-none h-24 bg-background border-white/10 focus-visible:ring-primary/50 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">Goes into the permanent on-chain record. A description hash is stored, not the text itself.</p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  LOGGING YOUR RECEIPT...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  SUBMIT — 0.01 ETH FEE REQUIRED
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </>
              )}
            </button>

          </form>
        </Form>

        {/* Last reward callout */}
        {lastResult && lastResult.reward > 0 && (
          <div className="mt-6 p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
            <p className="font-mono text-xs text-muted-foreground mb-1">LAST RECEIPT — {lastResult.dramaLabel} — EARNED</p>
            <p className="text-3xl font-black text-primary">{lastResult.reward.toLocaleString()} $GHOSTED</p>
          </div>
        )}
      </div>

      {/* Credibility mechanic explainer */}
      <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-mono text-sm font-bold">HOW CREDIBILITY WORKS</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your $GHOSTED tokens carry a credibility score — a reputation that grows when you hold and burn, and shrinks when you sell. 
          Higher credibility means your receipt severity gets <span className="text-white font-semibold">boosted by the contract</span>, 
          so the same ghosting event logs heavier and earns you more $GHOSTED.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">HOLD 7+ DAYS</p>
              <p className="font-mono text-xs text-muted-foreground">Loyalty bonus kicks in — credibility grows proportional to balance and hold time</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <Flame className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">BURN $GHOSTED</p>
              <p className="font-mono text-xs text-muted-foreground">5× credibility bonus per burned token — sacrifice earns trust, reduces supply</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">SELL = CREDIBILITY LOSS</p>
              <p className="font-mono text-xs text-muted-foreground">Selling tokens penalizes your score — proportional to how much you sold</p>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary font-bold">STAKE TO BOOST:</span> Stake 10,000+ $GHOSTED to unlock credibility metadata, 
            which gives your submissions a proof value multiplier. The higher your stake and credibility, the heavier your receipts hit.
          </p>
        </div>
      </div>

      {/* ETH reward schedule */}
      <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="font-mono text-sm font-bold text-muted-foreground">ETH MILESTONE REWARDS (CONTRACT)</h3>
        <div className="space-y-3">
          {[
            { event: "STUCK ON THEM",        trigger: "Ghosting level crosses the lock threshold",          reward: "1 ETH"  },
            { event: "FEELINGS EXPOSED",     trigger: "Heartbreak buildup exceeds critical accumulation",   reward: "5 ETH"  },
            { event: "THEY BOUNCED",         trigger: "Drift exceeds overlap — more distance than connection", reward: "2 ETH" },
            { event: "IT'S OFFICIALLY OVER", trigger: "20+ receipts + fully bounced = fork triggered",      reward: "10 ETH" },
          ].map((r) => (
            <div key={r.event} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <div>
                <p className="font-mono text-xs font-bold">{r.event}</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">{r.trigger}</p>
              </div>
              <span className="font-mono text-sm font-black text-primary ml-4 flex-shrink-0">{r.reward}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
