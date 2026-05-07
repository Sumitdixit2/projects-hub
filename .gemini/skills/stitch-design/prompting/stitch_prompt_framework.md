# The Stitch Prompting Framework

To generate elite interfaces, you must construct prompts that provide Stitch with explicit constraints. Do not ask for "a beautiful dashboard." Ask for a specific layout geometry, visual language, and interaction model.

## The 5-Part Prompt Structure

### 1. Context & Persona
Define the vibe.
*   *Example:* "Design a dark-mode SaaS dashboard for a developer-focused infrastructure product, inspired by Vercel and Linear."

### 2. Layout Geometry
Dictate the spatial arrangement.
*   *Example:* "Use an asymmetrical bento grid layout with a dense 12-column underlying structure. The primary feature card should span 8 columns, with secondary telemetry cards spanning 4 columns on the right."

### 3. Visual Language & Theming
Specify colors, borders, and depth.
*   *Example:* "Use a strictly monochromatic slate color palette with a single bright neon cyan accent for active states. All cards must have a 1px solid `border-zinc-800` and no drop shadows. Background must be `bg-zinc-950`."

### 4. Typographic Hierarchy
Constrain the text styles.
*   *Example:* "Use a neo-grotesque sans-serif. Headings must be tightly tracked. Body text must be `text-zinc-400`. Use monospace font for all numbers, badges, and code snippets."

### 5. Interaction & Component Details
Define the interactive elements.
*   *Example:* "Buttons should be small, geometric, and pill-shaped. Include a subtle glassmorphism (`backdrop-blur-md`) effect on the top sticky navigation bar."

---

## Negative Prompting
Stitch will sometimes default to consumer-friendly styles. Explicitly forbid them:
*   "DO NOT use large, rounded corner radii (keep to 4px max)."
*   "DO NOT use heavy drop shadows."
*   "DO NOT center-align the hero text; keep everything strictly left-aligned."
*   "DO NOT use illustrative graphics or generic vector art; use abstract geometric shapes or code snippets instead."
