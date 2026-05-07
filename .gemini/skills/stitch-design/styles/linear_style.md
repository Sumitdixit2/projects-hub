# Linear Style Guide

Linear is the gold standard for high-density, engineering-focused design.

## Core Characteristics
- **Color Palette:** Pure black background (`#000000`) with very dark gray surface panels (`#111111` to `#161616`). Off-white text. Extremely sparse use of primary brand colors.
- **Typography:** Inter or a similar geometric sans-serif. Tight tracking on headings.
- **Borders:** Pervasive use of crisp, 1px `#222222` borders to delineate *everything*.
- **Shadows:** No drop shadows. Depth is created via borders and extremely subtle inset shadows.
- **Density:** High. Small fonts (`13px` or `14px` base), tight padding, minimal macro whitespace.
- **Motion:** Instantaneous.

## Implementation Details (Tailwind)
- Background: `bg-black`
- Panels: `bg-[#111] border border-[#222]`
- Primary Text: `text-[#f2f2f2]`
- Secondary Text: `text-[#888888]`
- Accents: Bright, desaturated neon (e.g., a pure violet or cyan) used only for focus states or critical status badges.
