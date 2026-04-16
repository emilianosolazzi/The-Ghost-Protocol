import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Ghost, Activity, FileWarning } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-mono selection:bg-primary selection:text-white">
      <div className="noise-overlay" />
      
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
              <Ghost className="w-6 h-6 text-primary relative z-10" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white group-hover:text-primary transition-colors">
              GHOST<span className="text-white/40">PROTOCOL</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className={`flex items-center gap-2 transition-colors hover:text-primary ${location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">LIVE TRACKER</span>
            </Link>
            <Link href="/evidence" className={`flex items-center gap-2 transition-colors hover:text-primary ${location === '/evidence' ? 'text-primary' : 'text-muted-foreground'}`}>
              <FileWarning className="w-4 h-4" />
              <span className="hidden sm:inline">LOG RECEIPT</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      <footer className="border-t border-white/5 py-8 mt-auto relative z-10 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-xs uppercase tracking-widest flex flex-col items-center gap-4">
          <Ghost className="w-4 h-4 opacity-50" />
          <p>
            THE SMART CONTRACT FOR RELATIONSHIP DRIFT.<br/>
            IF YOU'RE READING THIS, THEY'RE NOT TEXTING BACK.
          </p>
        </div>
      </footer>
    </div>
  );
}
