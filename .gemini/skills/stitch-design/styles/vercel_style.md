# Vercel Style Guide

Vercel defines the modern, sleek, "clean" developer experience.

## Core Characteristics
- **Color Palette:** High-contrast monochrome. Pure white or pure black backgrounds. 
- **Typography:** Geist or Inter. Clean, highly legible, generous line height.
- **Borders:** Thin, elegant borders. Often using very light grays in light mode (`border-gray-200`) or dark grays in dark mode (`border-gray-800`).
- **Corner Radii:** Subtle rounding (`rounded-md` or `rounded-lg`). Not brutalist, but not pill-shaped either.
- **Gradients:** Very subtle mesh gradients or conic gradients used *only* as background accents behind hero sections.
- **Interactions:** Polished, smooth hovers (often changing border colors or applying a very light background wash).

## Implementation Details (Tailwind)
- Canvas (Light): `bg-white`
- Cards: `bg-white border border-gray-200 shadow-sm rounded-lg`
- Canvas (Dark): `bg-black`
- Cards (Dark): `bg-black border border-gray-800 rounded-lg`
- Primary Accent: Pure Vercel Blue (`#0070f3`) or high-contrast inverted text (white on black).
