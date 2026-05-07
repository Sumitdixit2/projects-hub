# Visual Language System

The visual language defines the fundamental aesthetic parameters that separate consumer-grade UI from elite, startup-grade interfaces.

## 1. Color Strategy (Monochrome + Accent)
- **Base:** Neutral palettes (slate, zinc, true black, or pure white) that recede into the background.
- **Accents:** High-chroma, saturated accents (e.g., Vercel blue, Stripe blurple, Cyberpunk neon) used *sparingly*—only for primary CTAs or critical telemetry states.
- **Dark Mode Default:** Assume cinematic dark mode as the baseline. Use off-blacks (e.g., `#09090b`) to allow for elevation through lighter grays.

## 2. Border and Drafting Lines
- **1px Rule:** Interfaces should feel drafted. Use crisp 1px borders to separate semantic regions instead of relying solely on background colors or heavy shadows.
- **Subtle Radii:** Corner radii should feel deliberate. `0px` (brutalist), `4px-8px` (professional/SaaS), `16px-24px` (Apple-esque consumer). Avoid mixing paradigms.

## 3. Elevation & Depth (The Post-Shadow Era)
- Avoid heavy drop shadows. Create depth through:
  - **Borders:** A 1px border on a dark background separates elements cleanly.
  - **Inner Shadows:** A subtle `inset 0 1px 0 rgba(255,255,255,0.1)` on cards gives them a premium, physical feel.
  - **Backdrop Blur:** Use glassmorphism (`backdrop-filter: blur()`) for sticky headers, command palettes, and modals to maintain context without losing focus.

## 4. Texture and Noise
- Apply extremely subtle SVG noise overlays (opacity `0.02` to `0.04`) to solid dark backgrounds to eliminate banding and give the interface a tactile, cinematic quality.
- Use subtle linear or radial gradients that fade into the background color to draw attention to hero sections without feeling "colorful."

## 5. Iconography
- Strict, consistent stroke widths (usually `1.5px` or `2px`).
- No filled icons unless representing an active state.
- Icon size should optically match the cap height of the adjacent text.
