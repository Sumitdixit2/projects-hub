# Bento Grid Patterns

The Bento Grid is the optimal way to present complex, multifaceted information on modern dashboards and landing pages.

## Core Rules
1. **Asymmetry is Mandatory:** Do not make a grid of 4 identically sized squares. A good bento grid has hierarchy (e.g., one large card spanning 2x2, two rectangular cards spanning 2x1, and two small 1x1 cards).
2. **Consistent Gap:** The gap between cards must be mathematically consistent. Usually `gap-4` (16px) or `gap-6` (24px).
3. **Corner Radii:** The outer radius of the container grid should generally match the inner radius of the cards, or the cards should have a slightly smaller radius to maintain concentricity.

## Stitch Prompt Strategy
> "Generate a Bento Grid layout. Container should be `grid-cols-3` or `grid-cols-4`. Make the top-left card the 'hero' card spanning 2 columns and 2 rows. Ensure all cards have identical `p-6` padding, a 1px border, and a subtle inner shadow. Fill the cards with abstract data visualizations, not text-heavy paragraphs."
