# Core UI/UX Specification: Elite Systems

## Visual Ethos
Treat interface generation as engineering. Every element must serve a structural or navigational purpose. No "decoration" without function.

## 1. The Cinematic Dark Mode System
- **Base Palette**: Use neutral blacks/slates (e.g., `#09090b`) as the baseline to allow for elevation through lighter grays.
- **Drafting Lines**: Use crisp 1px borders (`border-zinc-800`) to separate semantic regions instead of heavy drop shadows.
- **Texture**: Apply subtle SVG noise overlays (opacity 0.02-0.04) to eliminate banding on dark backgrounds.

## 2. Structural Hierarchy
- **Asymmetry**: Use intentional asymmetry to create a cinematic reading rhythm.
- **Information Density**: Pack high density (telemetry, data) but use rigorous spacing (padding/margins) to prevent cognitive overload.
- **Typography as Anchor**: Establish hierarchy through font weight, tracking, and leading first. Font size is secondary.

## 3. Elevation & Depth (Post-Shadow Era)
- **Inner Shadows**: Use `inset 0 1px 0 rgba(255,255,255,0.1)` on cards for a premium physical feel.
- **Backdrop Blur**: Use `backdrop-filter: blur()` for sticky headers and modals to maintain context.
- **Interactive Feedback**: Motion and hover states must be immediate (under 200ms) and purposeful.
