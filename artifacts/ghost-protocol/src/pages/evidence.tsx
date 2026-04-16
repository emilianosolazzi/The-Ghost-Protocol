import { useState } from "react";
import { useSubmitEvidence, getGetGhostStateQueryKey, getGetGhostTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, FileText, Upload, Fingerprint, Activity } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  hash: z.string().min(1, "A proof hash is required").regex(/^0x[a-fA-F0-9]{64}$/, "Must be a valid proof hash starting with 0x"),
  weight: z.coerce.number().min(1).max(100),
  description: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function Evidence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: submitEvidence, isPending } = useSubmitEvidence();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hash: "",
      weight: 10,
      description: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    submitEvidence({ data }, {
      onSuccess: (result) => {
        if (result.success) {
          toast({
            title: "Receipt Logged",
            description: result.message,
          });
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
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
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
          Submit proof of being ignored. Every receipt you log raises the ghosting level and makes the contract stronger. They left you on read — now make it count.
        </p>
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
                  <FormMessage className="text-destructive font-mono text-xs" />
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
                    Higher score = more damage to the ghosting level. Use 100 for explicit read receipts with no response.
                  </p>
                  <FormMessage className="text-destructive font-mono text-xs" />
                </FormItem>
              )}
            />

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
                      placeholder='e.g., Sent "we still on for tonight?" at 6pm. Read at 6:02pm. No response.' 
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
      </div>
    </div>
  );
}
