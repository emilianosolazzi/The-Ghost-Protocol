import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Ghost, Activity, FileWarning, HelpCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet, formatWalletAddress } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { getGhostProtocolConfig } from "@/lib/ghost-protocol-config";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const wallet = useWallet();
  const config = getGhostProtocolConfig();
  const { toast } = useToast();

  const networkMismatch = Boolean(
    config.chainId && wallet.chainId && config.chainId !== wallet.chainId,
  );

  async function handleConnectWallet() {
    if (wallet.isConnected) {
      wallet.disconnect();
      return;
    }

    try {
      await wallet.connect();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Wallet Unavailable",
        description: error instanceof Error ? error.message : "Could not connect a wallet.",
      });
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-mono selection:bg-primary selection:text-white">
      <div className="noise-overlay" />
      
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/84 backdrop-blur-xl">
        <div className="container mx-auto px-4 min-h-16 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
              <Ghost className="w-6 h-6 text-primary relative z-10" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white group-hover:text-primary transition-colors">
              GHOST<span className="text-white/40">PROTOCOL</span>
            </span>
          </Link>
          
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              <Link href="/dashboard" className={`ghost-status-pill transition-colors ${location === '/dashboard' ? 'border-primary/35 bg-primary/12 text-primary' : 'text-muted-foreground hover:border-white/20 hover:text-white'}`}>
                <Activity className="w-4 h-4" />
                <span>DASHBOARD</span>
              </Link>
              <Link href="/evidence" className={`ghost-status-pill transition-colors ${location === '/evidence' ? 'border-primary/35 bg-primary/12 text-primary' : 'text-muted-foreground hover:border-white/20 hover:text-white'}`}>
                <FileWarning className="w-4 h-4" />
                <span>LOG RECEIPT</span>
              </Link>
              <Link href="/how-to-use" className={`ghost-status-pill transition-colors ${location === '/how-to-use' ? 'border-primary/35 bg-primary/12 text-primary' : 'text-muted-foreground hover:border-white/20 hover:text-white'}`}>
                <HelpCircle className="w-4 h-4" />
                <span>HOW IT WORKS</span>
              </Link>
            </nav>

            <div className="flex items-center gap-3 md:justify-end">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-white/12 bg-white/[0.04] text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${config.isConfigured ? "bg-primary" : "bg-amber-400"}`} />
                {config.isConfigured ? "Runtime Configured" : "Deployment Pending"}
              </div>
              <Button variant={networkMismatch ? "destructive" : "outline"} onClick={handleConnectWallet} className="min-w-40">
                <Wallet className="w-4 h-4" />
                {networkMismatch
                  ? "Wrong Network"
                  : wallet.isConnected
                    ? formatWalletAddress(wallet.account)
                    : wallet.connectionType === "hardhat-dev"
                      ? "Use Hardhat Wallet"
                      : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      <footer className="border-t border-white/10 py-8 mt-auto relative z-10 bg-background/90">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-xs uppercase tracking-widest flex flex-col items-center gap-4">
          <Ghost className="w-4 h-4 opacity-50" />
          <p>
            THE RECEIPT LEDGER FOR RELATIONSHIP DRIFT.<br/>
            IF YOU'RE READING THIS, THE CHAIN REMEMBERS WHAT THEY DID.
          </p>
        </div>
      </footer>
    </div>
  );
}
