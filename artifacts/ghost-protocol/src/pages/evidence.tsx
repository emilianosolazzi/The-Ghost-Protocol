import { useState } from "react";
import { useSubmitEvidence, getGetGhostStateQueryKey, getGetGhostTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, FileText, Upload, Fingerprint, Activity, AlertTriangle, CheckCircle2, Coins } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  hash: z.string().min(1, "A proof hash is required").regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid proof hash starting with 0x"),
  weight: z.coerce.number().min(1).max(100),
  description: z.string().optional(),
  isProxy: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function Evidence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: submitEvidence, isPending } = useSubmitEvidence();
  const [lastReward, setLastReward] = useState<number | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hash: "",
      weight: 10,
      description: "",
      isProxy: false,
    }
  });

  const watchWeight = form.watch("weight");
  const watchIsProxy = form.watch("isProxy");
  const estimatedReward = watchIsProxy ? 0 : Math.floor(watchWeight * 1000);

  const onSubmit = (data: FormValues) => {
    submitEvidence({ data }, {
      onSuccess: (result) => {
        if (result.success) {
          setLastReward(result.ghostedReward ?? 0);
          let title = "Receipt Logged";
          let desc = result.message;
          if (result.gaslightUnlocked) title = "Gaslight Override Unlocked!";
          if (result.forkReady) title = "Fork Threshold Reached!";
          toast({ title, description: desc });
          form.reset();
          queryClient.invalidateQueries({ queryKey: getGetGhostStateQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGhostTimelineQueryKey() });
        } else {
          toast({
            variant: "destructive",
            title: "Could Not Log Receipt",
            description: result.message,
          });
        }
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not reach the contract. Please try again."
        });
      }
    });
  };

  const generateRandomHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)];
    form.setValue('hash', hash);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 text-primary">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black mb-4">LOG YOUR RECEIPT</h1>
        <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto">
          Submit proof of being ignored. Direct receipts lower the ghosting level and earn you $GHOSTED.
          Get to 10+ receipts to unlock the gaslight override. 20+ triggers the fork — and 10 ETH in rewards.
        </p>
      </div>

      {/* Detection Entropy Explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> DIRECT RECEIPT
          </div>
          <p className="text-xs text-muted-foreground font-mono">You saw it yourself — screenshot, read receipt, or direct proof. <span className="text-primary">Lowers ghosting level</span>. Earns <span className="text-primary">$GHOSTED</span>.</p>
        </div>
        <div className="bg-card border border-destructive/20 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-destructive font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> PROXY / THIRD-PARTY
          </div>
          <p className="text-xs text-muted-foreground font-mono">Heard it from a friend or saw indirect activity. <span className="text-destructive">Raises ghosting level</span>. Earns no $GHOSTED — unverified hearsay.</p>
        </div>
      </div>

      <div className="bg-card border border-white/10 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="hash"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                      <Fingerprint className="w-3 h-3" /> YOUR PROOF HASH
                    </FormLabel>
                    <button 
                      type="button" 
                      onClick={generateRandomHash}
                      className="text-xs font-mono text-primary hover:text-white transition-colors"
                    >
                      GENERATE FOR ME
                    </button>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="0x... (your read receipt turned into a hash)" 
                      className="font-mono bg-background border-white/10 focus-visible:ring-primary/50" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground font-mono mt-2">Each hash is unique and can only be submitted once — no double-dipping.</p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            {/* isProxy toggle */}
            <FormField
              control={form.control}
              name="isProxy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground mb-2 block">
                    RECEIPT TYPE
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange(false)}
                      className={`p-3 rounded-lg border text-left transition-all ${!field.value ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}
                    >
                      <p className="font-mono text-xs font-bold mb-1">DIRECT</p>
                      <p className="font-mono text-xs opacity-70">I saw it myself</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      className={`p-3 rounded-lg border text-left transition-all ${field.value ? 'border-destructive bg-destructive/10 text-destructive' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}
                    >
                      <p className="font-mono text-xs font-bold mb-1">THIRD PARTY</p>
                      <p className="font-mono text-xs opacity-70">Heard from someone else</p>
                    </button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3" /> HOW BAD WAS IT? (1 = mild, 100 = devastating)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={100} 
                      className="font-mono bg-background border-white/10 focus-visible:ring-primary/50" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground font-mono mt-2">
                    Higher score = more impact on the ghosting level. Use 100 for an explicit read receipt with zero response.
                  </p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            {/* Reward preview */}
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${watchIsProxy ? 'border-destructive/20 bg-destructive/5' : 'border-primary/20 bg-primary/5'}`}>
              <Coins className={`w-4 h-4 flex-shrink-0 ${watchIsProxy ? 'text-destructive' : 'text-primary'}`} />
              <div>
                <p className="font-mono text-xs font-bold mb-0.5">
                  {watchIsProxy ? 'NO $GHOSTED REWARD' : `ESTIMATED REWARD: ${estimatedReward.toLocaleString()} $GHOSTED`}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {watchIsProxy 
                    ? 'Proxy receipts log the mismatch but earn nothing — the contract only rewards direct proof.'
                    : `Direct receipts earn weight × 1,000 $GHOSTED. Max 100,000 per submission.`}
                </p>
              </div>
            </div>

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
                      placeholder='e.g. Sent "we still on for tonight?" at 6pm. Read at 6:02pm. No response for 3 days.' 
                      className="resize-none h-24 bg-background border-white/10 focus-visible:ring-primary/50 text-sm" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full h-14 mt-8 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  LOGGING YOUR RECEIPT...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  SUBMIT YOUR RECEIPT
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </>
              )}
            </button>
          </form>
        </Form>

        {lastReward !== null && lastReward > 0 && (
          <div className="mt-6 p-4 rounded-lg border border-primary/30 bg-primary/5 text-center">
            <p className="font-mono text-xs text-muted-foreground mb-1">LAST SUBMISSION EARNED</p>
            <p className="text-2xl font-black text-primary">{lastReward.toLocaleString()} $GHOSTED</p>
          </div>
        )}
      </div>

      {/* Reward unlock thresholds */}
      <div className="mt-8 bg-card border border-white/5 rounded-xl p-6">
        <h3 className="font-mono text-xs font-bold text-muted-foreground mb-4">ETH REWARD SCHEDULE (CONTRACT)</h3>
        <div className="space-y-3">
          {[
            { event: "STUCK ON THEM", trigger: "Ghosting level crosses lock threshold", reward: "1 ETH" },
            { event: "FEELINGS EXPOSED", trigger: "Heartbreak buildup exceeds critical level", reward: "5 ETH" },
            { event: "THEY BOUNCED",  trigger: "Drift exceeds overlap — they're gone", reward: "2 ETH" },
            { event: "IT'S OVER", trigger: "20+ receipts + fully bounced = fork triggered", reward: "10 ETH" },
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
