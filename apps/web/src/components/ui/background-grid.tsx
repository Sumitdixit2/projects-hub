import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  className?: string;
}

export function BackgroundGrid({ className }: BackgroundGridProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-0",
        // Soft vignette blending that is less aggressive
        "[mask-image:radial-gradient(ellipse_120%_120%_at_50%_0%,#000_40%,transparent_100%)]",
        className
      )}
    >
      {/* Primary Grid: 64px spacing, 0.08 opacity for slightly more visibility */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Secondary Layered Grid: 256px spacing, 0.04 opacity for structural depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16rem_16rem]" />
    </div>
  );
}
