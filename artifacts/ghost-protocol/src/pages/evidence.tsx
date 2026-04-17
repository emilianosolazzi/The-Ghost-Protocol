import { useEffect, useState } from "react";
import { ghostProtocolUiConstants } from "@workspace/ghost-contract";
import { useStorySnapshot, useSubmitEvidence, useUnlockPricePreview } from "@/hooks/use-ghost-protocol";
import { useWallet } from "@/hooks/use-wallet";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatEthAmount, formatGhostedAmount, getExplorerTransactionUrl } from "@/lib/ghost-protocol-client";
import {
  fetchGhostSubmissionArchive,
  normaliseGhostSubmissionArchiveEntry,
  saveGhostSubmissionArchive,
  type GhostSubmissionArchiveEntry,
} from "@/lib/ghost-submission-archive";
import type { Hash, Hex } from "viem";
import {
  ShieldAlert, FileText, Upload, Fingerprint, Activity,
  AlertTriangle, CheckCircle2, Coins, Info, Copy, Database, ExternalLink
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Drama type labels stored with each on-chain Evidence record.
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

const LOCAL_SUBMISSIONS_STORAGE_KEY = "ghost-protocol.local-submissions";
const LOCAL_SUBMISSIONS_LIMIT = 8;
const receiptRewardMultiplier = Number(ghostProtocolUiConstants.receiptRewardMultiplier);
const maxGhostedPerSubmission = Number(ghostProtocolUiConstants.maxGhostedPerSubmission / 10n ** 18n);
const treasuryCutEth = (ghostProtocolUiConstants.receiptFeeEth * ghostProtocolUiConstants.treasurySplitBps) / ghostProtocolUiConstants.bpsDenominator;
const protocolCutEth = ghostProtocolUiConstants.receiptFeeEth - treasuryCutEth;

function truncateValue(value: string, leading = 10, trailing = 8) {
  if (value.length <= leading + trailing) {
    return value;
  }

  return `${value.slice(0, leading)}...${value.slice(-trailing)}`;
}

function readLocalSubmissions(): GhostSubmissionArchiveEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(LOCAL_SUBMISSIONS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normaliseGhostSubmissionArchiveEntry)
      .filter((entry): entry is GhostSubmissionArchiveEntry => entry !== null)
      .slice(0, LOCAL_SUBMISSIONS_LIMIT);
  } catch {
    return [];
  }
}

function writeLocalSubmissions(entries: GhostSubmissionArchiveEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    LOCAL_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(entries.slice(0, LOCAL_SUBMISSIONS_LIMIT)),
  );
}

function mergeSubmissionRecords(...groups: GhostSubmissionArchiveEntry[][]) {
  const entriesByTxHash = new Map<string, GhostSubmissionArchiveEntry>();

  for (const group of groups) {
    for (const entry of group) {
      const key = entry.txHash.toLowerCase();
      const existing = entriesByTxHash.get(key);

      if (!existing) {
        entriesByTxHash.set(key, entry);
        continue;
      }

      entriesByTxHash.set(key, {
        ...existing,
        ...entry,
        description: entry.description.length >= existing.description.length ? entry.description : existing.description,
        submittedAt: Math.max(existing.submittedAt, entry.submittedAt),
      });
    }
  }

  return [...entriesByTxHash.values()].sort((left, right) => right.submittedAt - left.submittedAt);
}

export function Evidence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { account, chainId } = useWallet();
  const { mutate: submitEvidence, isPending } = useSubmitEvidence();
  const [lastResult, setLastResult] = useState<{ reward: number; dramaLabel: string } | null>(null);
  const [localSubmissions, setLocalSubmissions] = useState<GhostSubmissionArchiveEntry[]>([]);
  const [remoteSubmissions, setRemoteSubmissions] = useState<GhostSubmissionArchiveEntry[]>([]);
  const [archiveStatus, setArchiveStatus] = useState<"idle" | "syncing" | "ready" | "unavailable">("idle");
  const [archiveStatusMessage, setArchiveStatusMessage] = useState("Connect a wallet to sync submitted messages across devices.");

  useEffect(() => {
    setLocalSubmissions(readLocalSubmissions());
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!account) {
      setRemoteSubmissions([]);
      setArchiveStatus("idle");
      setArchiveStatusMessage("Connect a wallet to sync submitted messages across devices.");
      return () => {
        cancelled = true;
      };
    }

    setArchiveStatus("syncing");
    setArchiveStatusMessage("Syncing your off-chain message archive.");

    fetchGhostSubmissionArchive(account)
      .then((entries) => {
        if (cancelled) {
          return;
        }

        setRemoteSubmissions(entries);
        setArchiveStatus("ready");
        setArchiveStatusMessage(
          entries.length > 0
            ? "Archive synced. Your submitted messages are available across devices when the API is reachable."
            : "Archive ready. New submissions will sync across devices when the API is reachable.",
        );
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setRemoteSubmissions([]);
        setArchiveStatus("unavailable");
        setArchiveStatusMessage("Remote archive unavailable. Local review still works in this browser.");
      });

    return () => {
      cancelled = true;
    };
  }, [account]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { hash: "", weight: 50, description: "", isProxy: false, dramaType: "" },
  });

  const watchWeight   = form.watch("weight");
  const watchIsProxy  = form.watch("isProxy");
  const watchHash = form.watch("hash");
  const watchDramaType = form.watch("dramaType");
  const estimatedReward = watchIsProxy ? 0 : Math.min(watchWeight * receiptRewardMultiplier, maxGhostedPerSubmission);
  const mergedSubmissions = mergeSubmissionRecords(localSubmissions, remoteSubmissions);
  const remoteSubmissionKeys = new Set(remoteSubmissions.map((submission) => submission.txHash.toLowerCase()));
  const selectedDrama = DRAMA_TYPES.find((dramaType) => dramaType.id === watchDramaType) ?? null;
  const storySnapshot = useStorySnapshot(watchHash.trim());
  const unlockPricePreview = useUnlockPricePreview(watchHash.trim());
  const existingStory = storySnapshot.data;
  const isKnownProofHash = Boolean(existingStory && existingStory.evidence.timestamp > 0);

  const clearLocalSubmissions = () => {
    writeLocalSubmissions([]);
    setLocalSubmissions([]);
  };

  async function copyToClipboard(label: string, value: string) {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }

      await navigator.clipboard.writeText(value);
      toast({ title: `${label} copied`, description: `${label} copied to your clipboard.` });
    } catch {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: `Could not copy ${label.toLowerCase()} in this browser context.`,
      });
    }
  }

  const onSubmit = (data: FormValues) => {
    if (!account) {
      toast({ variant: "destructive", title: "Wallet Not Connected", description: "Please connect your wallet first." });
      return;
    }

    submitEvidence({
      proofHash: data.hash as Hex,
      severity: data.weight,
      description: data.description || "",
      dramaType: data.dramaType || "general",
      isProxy: data.isProxy,
    }, {
      onSuccess: (transactionHash) => {
        const dramaLabel = DRAMA_TYPES.find(d => d.id === data.dramaType)?.label ?? "Receipt";
        const nextEntry: GhostSubmissionArchiveEntry = {
          submitter: account,
          proofHash: data.hash as Hex,
          txHash: String(transactionHash) as Hash,
          severity: data.weight,
          description: data.description?.trim() ?? "",
          dramaType: data.dramaType || "general",
          isProxy: data.isProxy,
          reward: estimatedReward,
          chainId: chainId ?? null,
          submittedAt: Date.now(),
        };
        const nextLocalSubmissions = [nextEntry, ...readLocalSubmissions()].slice(0, LOCAL_SUBMISSIONS_LIMIT);

        writeLocalSubmissions(nextLocalSubmissions);
        setLocalSubmissions(nextLocalSubmissions);
        setLastResult({ reward: estimatedReward, dramaLabel });

        void saveGhostSubmissionArchive(nextEntry)
          .then(() => {
            setRemoteSubmissions((currentEntries) => mergeSubmissionRecords(currentEntries, [nextEntry]));
            setArchiveStatus("ready");
            setArchiveStatusMessage("Archive synced. This submission is available across devices.");
          })
          .catch(() => {
            setArchiveStatus("unavailable");
            setArchiveStatusMessage("Remote archive unavailable. This submission is still saved locally in this browser.");
          });

        toast({
          title: "Receipt Logged On-Chain",
          description: "Your evidence has been submitted. A review copy is saved below and will sync remotely when the archive API is reachable.",
        });
        form.reset();
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        toast({ variant: "destructive", title: "Transaction Failed", description: (error as Error).message || "Could not submit evidence." });
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
        <p className="text-muted-foreground font-mono text-sm max-w-2xl mx-auto leading-relaxed">
          Turn one ignored moment into a contract event. The protocol records your proof hash, splits the fee, creates a locked story,
          and only pays <span className="text-primary font-bold">$GHOSTED</span> if the proof is direct.
          Each submission costs <span className="text-primary font-bold">{formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH</span>.
        </p>
      </div>

      <div className="ghost-panel ghost-gradient-border p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="ghost-label mb-2">Before You Sign</p>
            <h2 className="text-2xl font-black tracking-tight">What This Transaction Actually Does</h2>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-[0.18em] ${watchIsProxy ? "border-destructive/25 bg-destructive/8 text-destructive" : "border-primary/25 bg-primary/8 text-primary"}`}>
            {watchIsProxy ? "Proxy proof" : "Direct proof"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="ghost-panel-soft p-4">
            <p className="ghost-label mb-2">Fee Split</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {formatEthAmount(treasuryCutEth, 5)} ETH goes to treasury and {formatEthAmount(protocolCutEth, 5)} ETH stays in the protocol.
            </p>
          </div>
          <div className="ghost-panel-soft p-4">
            <p className="ghost-label mb-2">Reward Preview</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {watchIsProxy ? "Proxy receipts are stored but pay zero GHOSTED." : `Direct reward preview: ${estimatedReward.toLocaleString()} GHOSTED, based on severity only.`}
            </p>
          </div>
          <div className="ghost-panel-soft p-4">
            <p className="ghost-label mb-2">Story Effect</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every receipt initializes or references a locked story. The current base unlock is {formatGhostedAmount(ghostProtocolUiConstants.baseUnlockPrice)} GHOSTED.
            </p>
          </div>
        </div>
      </div>

      {/* Fee breakdown banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="ghost-panel-soft p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">RECEIPT FEE</p>
          <p className="font-black text-xl text-primary">{formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">per submission</p>
        </div>
        <div className="ghost-panel-soft p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">TREASURY CUT</p>
          <p className="font-black text-xl">{formatEthAmount(treasuryCutEth, 5)} ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">30% → community</p>
        </div>
        <div className="ghost-panel-soft p-4 text-center">
          <p className="font-mono text-xs text-muted-foreground mb-1">PROTOCOL POOL</p>
          <p className="font-black text-xl">{formatEthAmount(protocolCutEth, 5)} ETH</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">70% → retained by contract</p>
        </div>
      </div>

      {/* Direct vs Proxy explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="ghost-panel-soft border-primary/20 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> DIRECT — I SAW IT MYSELF
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Screenshot, read receipt, delivered message they never opened. Earns up to <span className="text-primary font-bold">{maxGhostedPerSubmission.toLocaleString()} $GHOSTED</span> and increments the contract&apos;s direct receipt index.</p>
        </div>
        <div className="ghost-panel-soft border-destructive/20 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-destructive font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> PROXY — HEARD FROM SOMEONE
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">A friend told you, you saw them active, indirect evidence. It is still stored on-chain, but it earns zero $GHOSTED and does not count as direct proof.</p>
        </div>
      </div>

      {/* Form */}
      <div className="ghost-panel ghost-gradient-border p-6 md:p-8 relative overflow-hidden shadow-2xl">
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
                        className={`ghost-sheen p-3 rounded-xl border text-left transition-all ${field.value === d.id ? "border-primary bg-primary/12 shadow-[0_0_20px_rgba(139,92,246,0.14)]" : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"}`}
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
                      className={`p-4 rounded-xl border text-left transition-all ${!field.value ? "border-primary bg-primary/12 shadow-[0_0_20px_rgba(139,92,246,0.14)]" : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"}`}
                    >
                      <CheckCircle2 className={`w-4 h-4 mb-2 ${!field.value ? "text-primary" : "text-muted-foreground"}`} />
                      <p className="font-mono text-sm font-bold">DIRECT</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">I witnessed it myself</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`p-4 rounded-xl border text-left transition-all ${field.value ? "border-destructive bg-destructive/10 shadow-[0_0_18px_rgba(239,68,68,0.12)]" : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"}`}
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
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">Each hash can only be submitted once. If this proof already exists, the contract will reject the transaction.</p>
                  {watchHash.trim().length > 0 && (
                    <div className={`mt-3 rounded-xl border p-3 ${isKnownProofHash ? "border-destructive/20 bg-destructive/8" : watchHash.trim().match(/^0x[a-fA-F0-9]{64}$/) ? "border-primary/20 bg-primary/8" : "border-white/10 bg-white/[0.03]"}`}>
                      <p className="font-mono text-xs font-bold mb-1">
                        {isKnownProofHash
                          ? "KNOWN PROOF HASH"
                          : watchHash.trim().match(/^0x[a-fA-F0-9]{64}$/)
                            ? "HASH SHAPE LOOKS VALID"
                            : "WAITING FOR A FULL 32-BYTE HASH"}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                        {isKnownProofHash
                          ? "This proof hash already points to an on-chain story. Reusing it will fail, so generate a fresh unique fingerprint before signing."
                          : watchHash.trim().match(/^0x[a-fA-F0-9]{64}$/)
                            ? "The format is correct. The final success still depends on uniqueness and the wallet transaction completing."
                            : "Use 0x plus 64 hex characters. The app can generate one for you if you just need a unique placeholder for testing."}
                      </p>
                    </div>
                  )}
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
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-primary to-fuchsia-400 transition-all duration-300" style={{ width: `${field.value}%` }} />
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
            <div className={`flex items-center gap-4 p-4 rounded-xl border ${watchIsProxy ? "border-destructive/20 bg-destructive/5" : "border-primary/20 bg-primary/5"}`}>
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
                      Formula: severity × {receiptRewardMultiplier.toLocaleString()}, capped at {maxGhostedPerSubmission.toLocaleString()}. This contract does not boost receipt rewards with credibility.
                    </p>
                  </>
                )}
              </div>
            </div>

            {(selectedDrama || unlockPricePreview.data || existingStory) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="ghost-panel-soft p-4">
                  <p className="ghost-label mb-2">Selected Drama</p>
                  <p className="text-sm font-semibold text-white">{selectedDrama ? `${selectedDrama.emoji} ${selectedDrama.label}` : "No drama tag yet"}</p>
                  <p className="text-xs text-muted-foreground mt-2">{selectedDrama ? selectedDrama.desc : "Choose one to give the receipt better context in the ledger."}</p>
                </div>
                <div className="ghost-panel-soft p-4">
                  <p className="ghost-label mb-2">ETH Unlock Preview</p>
                  <p className="text-sm font-semibold text-white">
                    {unlockPricePreview.data ? `${formatEthAmount(unlockPricePreview.data, 5)} ETH` : "No existing story yet"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Shown only when the proof hash already maps to a story in the contract.</p>
                </div>
                <div className="ghost-panel-soft p-4">
                  <p className="ghost-label mb-2">Current Access State</p>
                  <p className="text-sm font-semibold text-white">
                    {existingStory ? (existingStory.story.isPublic ? "Public story" : existingStory.canAccess ? "Unlocked for this wallet" : "Locked story") : "Will initialize on submit"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Existing proof hashes can preview story state; new ones create a fresh locked story.</p>
                </div>
              </div>
            )}

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
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">The contract stores only a description hash. This page keeps a readable review copy locally and syncs it to the off-chain archive when the API is reachable.</p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isPending || isKnownProofHash}
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
                  {isKnownProofHash ? "PROOF ALREADY EXISTS — GENERATE A FRESH HASH" : `SUBMIT — ${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH FEE REQUIRED`}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </>
              )}
            </button>

          </form>
        </Form>

        {/* Last reward callout */}
        {lastResult && lastResult.reward > 0 && (
          <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/5 text-center shadow-[0_0_24px_rgba(139,92,246,0.14)]">
            <p className="font-mono text-xs text-muted-foreground mb-1">LAST RECEIPT — {lastResult.dramaLabel} — EARNED</p>
            <p className="text-3xl font-black text-primary">{lastResult.reward.toLocaleString()} $GHOSTED</p>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-background/40 p-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-mono text-sm font-bold">REVIEW SUBMITTED MESSAGE</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                GhostProtocol only keeps the description hash on-chain. This page keeps a local copy, adds copy actions
                for the saved receipt, and syncs messages across devices when the archive API is reachable.
              </p>
            </div>
            {localSubmissions.length > 0 && (
              <button
                type="button"
                onClick={clearLocalSubmissions}
                className="font-mono text-xs text-muted-foreground transition-colors hover:text-white"
              >
                CLEAR LOCAL CACHE
              </button>
            )}
          </div>

          <div className={`rounded-lg border p-4 flex items-start gap-3 ${archiveStatus === "ready" ? "border-primary/20 bg-primary/5" : archiveStatus === "unavailable" ? "border-destructive/20 bg-destructive/5" : "border-white/10 bg-white/[0.02]"}`}>
            <Database className={`w-4 h-4 mt-0.5 shrink-0 ${archiveStatus === "unavailable" ? "text-destructive" : "text-primary"}`} />
            <div className="space-y-1">
              <p className="font-mono text-xs font-bold">
                {archiveStatus === "ready"
                  ? "ARCHIVE SYNC ACTIVE"
                  : archiveStatus === "syncing"
                    ? "SYNCING ARCHIVE"
                    : archiveStatus === "unavailable"
                      ? "ARCHIVE OFFLINE"
                      : "ARCHIVE IDLE"}
              </p>
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">{archiveStatusMessage}</p>
            </div>
          </div>

          {mergedSubmissions.length > 0 ? (
            <div className="space-y-3">
              {mergedSubmissions.map((submission) => {
                const isSynced = remoteSubmissionKeys.has(submission.txHash.toLowerCase());
                const dramaLabel = DRAMA_TYPES.find((dramaType) => dramaType.id === submission.dramaType)?.label ?? submission.dramaType;
                const explorerUrl = getExplorerTransactionUrl(submission.txHash);

                return (
                  <div key={`${submission.txHash}-${submission.submittedAt}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                        <span>{new Date(submission.submittedAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>{submission.isProxy ? "PROXY" : "DIRECT"}</span>
                        <span>•</span>
                        <span>{dramaLabel}</span>
                        <span>•</span>
                        <span>severity {submission.severity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[11px] px-2 py-1 rounded border ${isSynced ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.03] text-muted-foreground"}`}>
                          {isSynced ? "SYNCED" : "LOCAL"}
                        </span>
                        <span className={`font-mono text-xs font-bold ${submission.reward > 0 ? "text-primary" : "text-muted-foreground"}`}>
                          {submission.reward > 0 ? `${submission.reward.toLocaleString()} $GHOSTED` : "no token payout"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="font-mono text-xs text-muted-foreground">MESSAGE</p>
                      <p className="text-sm leading-relaxed break-words text-white/90">
                        {submission.description || "No description text was entered for this submission."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                      <div className="rounded-md border border-white/10 bg-background/50 p-3">
                        <p className="text-muted-foreground mb-1">PROOF HASH</p>
                        <p className="break-all">{truncateValue(submission.proofHash)}</p>
                      </div>
                      <div className="rounded-md border border-white/10 bg-background/50 p-3">
                        <p className="text-muted-foreground mb-1">TX HASH</p>
                        <p className="break-all">{truncateValue(submission.txHash)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("Message", submission.description || "")}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono text-muted-foreground transition-colors hover:text-white hover:border-white/20"
                      >
                        <Copy className="w-3 h-3" />
                        COPY MESSAGE
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("Proof hash", submission.proofHash)}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono text-muted-foreground transition-colors hover:text-white hover:border-white/20"
                      >
                        <Copy className="w-3 h-3" />
                        COPY PROOF
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("Transaction hash", submission.txHash)}
                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-mono text-muted-foreground transition-colors hover:text-white hover:border-white/20"
                      >
                        <Copy className="w-3 h-3" />
                        COPY TX
                      </button>
                      {explorerUrl && (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-[11px] font-mono text-primary transition-colors hover:bg-primary/10"
                        >
                          <ExternalLink className="w-3 h-3" />
                          VIEW TX
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              No submission history yet. Submit a receipt from this wallet and the message will appear here.
            </p>
          )}

          <p className="border-t border-white/5 pt-3 font-mono text-xs text-muted-foreground">
            Local review stays available in this browser. Cross-device review requires the archive API to be running; if it is offline, on-chain data still only preserves the description hash.
          </p>
        </div>
      </div>

      {/* Credibility mechanic explainer */}
      <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="font-mono text-sm font-bold">WHAT CREDIBILITY DOES IN THIS BUILD</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          GhostProtocol reads a <span className="text-white font-semibold">credibility score</span> from the token contract, but it
          does not use credibility to boost direct receipt rewards. In the current contract, credibility only affects
          story unlocking and oracle-resolved truth staking outcomes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <ShieldAlert className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">CREDIBILITY UNLOCKS STORIES</p>
              <p className="font-mono text-xs text-muted-foreground">Unlocking by credibility requires at least a 1,000 score floor and a matching story-specific minimum.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <Coins className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">CORRECT TRUTH CALLS PAY OUT</p>
              <p className="font-mono text-xs text-muted-foreground">A correctly resolved truth stake pays 200 $GHOSTED and adds +100 credibility to the assertor.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono text-xs font-bold mb-0.5">RECEIPT REWARDS STAY FLAT</p>
              <p className="font-mono text-xs text-muted-foreground">Direct receipt payouts only depend on severity. They are not multiplied by credibility in this contract.</p>
            </div>
          </div>
        </div>
        <div className="pt-2 border-t border-white/5">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="text-primary font-bold">IMPORTANT:</span> Hold-time boosts, sell penalties, and staking multipliers are not implemented in the current GhostProtocol contract.
          </p>
        </div>
      </div>

      {/* Protocol pool explainer */}
      <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        <h3 className="font-mono text-sm font-bold text-muted-foreground">WHAT THE PROTOCOL POOL DOES</h3>
        <div className="space-y-3">
          {[
            { event: "FEE COLLECTION", trigger: "Every submitEvidence call collects the configured receipt fee.", value: `${formatEthAmount(ghostProtocolUiConstants.receiptFeeEth, 4)} ETH` },
            { event: "TREASURY SPLIT", trigger: "30% is forwarded to treasury immediately.", value: `${formatEthAmount(treasuryCutEth, 5)} ETH` },
            { event: "CONTRACT RETENTION", trigger: "70% stays in GhostProtocol as protocol revenue.", value: `${formatEthAmount(protocolCutEth, 5)} ETH` },
            { event: "ETH STORY UNLOCKS", trigger: "unlockStoryWithETH pays the current ETH-equivalent unlock price to the submitter", value: "dynamic" },
          ].map((r) => (
            <div key={r.event} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01]">
              <div>
                <p className="font-mono text-xs font-bold">{r.event}</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">{r.trigger}</p>
              </div>
              <span className="font-mono text-sm font-black text-primary ml-4 flex-shrink-0">{r.value}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          There are no milestone ETH releases, heartbreak thresholds, or fork payouts in the deployed contract.
        </p>
      </div>

    </div>
  );
}
