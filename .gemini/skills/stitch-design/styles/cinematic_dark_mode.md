# Cinematic Dark Mode

Cinematic dark mode is not just inverted colors; it's about lighting.

## Core Characteristics
- **Canvas vs. Surface:** The canvas is the absolute void (`#000000` or `#050505`). Surfaces (cards, modals) are elevated not by shadow, but by slight increases in lightness (`#111` or `#18181b`) and 1px borders.
- **Lighting/Glow:** Elements appear lit from behind. Use radial gradients or large, extremely blurred drop shadows with high saturation to create a "glow" behind important elements (like a hero image or primary button).
- **Texture:** Absolute blacks can cause banding on cheap monitors. Apply a 2-4% opacity SVG noise overlay to the entire screen.
- **Contrast Control:** Pure white text (`#ffffff`) on pure black is jarring. Use `#ededed` or `zinc-200` for primary text to reduce eye strain.

## Implementation Details (Tailwind)
- Background: `bg-black relative overflow-hidden`.
- The Glow: `<div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen" />`
- Cards: `bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm`.
