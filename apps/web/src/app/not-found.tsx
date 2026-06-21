import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-foreground selection:bg-primary/30 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-border rounded-xl p-8 relative z-10 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-8 h-8 bg-destructive/10 border border-destructive/20 rounded-md flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-destructive" />
          </div>
          <h1 className="text-[14px] font-mono font-semibold tracking-widest text-foreground uppercase">
            RESOURCE_NOT_FOUND
          </h1>
          <p className="text-[13px] text-muted-foreground mt-2 text-center">
            The requested operational entity could not be resolved.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Status</label>
            <div className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] font-mono text-destructive">
              404
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors text-[13px] flex items-center justify-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
