# Apple Style Guide

Apple's design language represents the pinnacle of consumer-grade, premium product presentation.

## Core Characteristics
- **Typography:** SF Pro. Large, assertive, perfectly tracked headings. Clean, high-contrast body copy.
- **Glassmorphism:** Heavy use of backdrop filters (`blur`) for navigation bars and overlays.
- **Imagery:** Photography and 3D renders are front and center. Interfaces wrap around the media.
- **Color Palette:** Pure whites, pure blacks, and deep, saturated gradients.
- **Motion:** Scrolling is the primary interaction model. Elements fade in, scale, and parallax as the user scrolls.

## Implementation Details (Tailwind)
- Typography: Focus on `font-semibold` or `font-bold` for large headings, with extremely tight tracking (`tracking-tighter`).
- Glass Effects: `bg-black/70 backdrop-blur-md` (for dark mode) or `bg-white/70 backdrop-blur-md` (for light mode).
- Backgrounds: Often pure `#000000` or `#ffffff`, serving strictly to highlight high-fidelity imagery.
