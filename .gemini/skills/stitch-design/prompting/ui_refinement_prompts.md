# UI Refinement Prompts

Use these prompts with Stitch's `edit_screens` or `generate_variants` tools to polish existing designs.

## 1. Hierarchy Fix
> "Analyze the current screen and fix the visual hierarchy. The primary CTA is currently blending in. Make the primary button a high-contrast solid color and change the secondary buttons to outline/ghost styles. Reduce the opacity of the secondary body text to `text-zinc-500` to make the headings stand out more. Increase the top margin of all `h2` elements to create better macro-whitespace."

## 2. Density Optimization
> "This dashboard is too spaced out. Increase the information density. Convert the padding on all cards from 24px to 16px. Reduce the text size of the table data to `sm` (14px). Tighten the leading on the headings. Make the sidebar narrower (240px max) and remove any unnecessary decorative icons."

## 3. Dark Mode Conversion
> "Convert this entire screen to a cinematic dark mode. Change the background canvas to `#09090b`. Change all card backgrounds to `#18181b`. Change all text to white, except for secondary text which should be `#a1a1aa`. Convert all heavy drop shadows into 1px solid borders (`#27272a`). Ensure any primary brand colors are adjusted to be slightly more vibrant to contrast against the dark background."
