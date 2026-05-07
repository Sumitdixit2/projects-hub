# Composition Rules

Composition is the invisible scaffolding of the interface. It dictates how elements relate to each other in space.

## 1. The Spatial Grid
- Always anchor designs to a column grid (usually 12 columns on desktop, 4 on mobile). 
- Elements should span intentional numbers of columns.
- **Bento Grids:** Use asymmetrical bento grids for dashboards and feature sections to present multiple pieces of data without vertical fatigue.

## 2. The F-Pattern and Z-Pattern Optimization
- Guide the user's eye deliberately. 
- High-priority anchors (Logos, primary headings) go top-left or center.
- Primary actions (CTAs, login) go top-right or immediately following the hero statement.

## 3. Intentional Asymmetry
- Perfectly centered layouts feel static and dated. 
- Offset text blocks against large graphical elements or code blocks.
- If the text is on the left, balance the visual weight with a dense component or interactive widget on the right.

## 4. Visual Anchoring
- Every section needs a visual anchor—the heaviest element in that section.
- If everything is heavy, nothing is. Ensure that supporting text and secondary buttons explicitly defer (via lower opacity, smaller size, or lighter weight) to the anchor.

## 5. The Rule of Proximity
- Elements that are logically related must be visually grouped closer together than they are to unrelated elements.
- Example: The margin below a section heading (`h2`) should be significantly smaller than the margin above it.

## 6. Bleed and Containment
- Know when to break the container. 
- While text should remain constrained for readability (e.g., `max-w-prose`), visual elements like background grids, decorative gradients, or marquee scrolls should bleed to the edge of the viewport to create immersion.
