# Engineering & Implementation Standards

## 1. Tailwind Translation Pipeline
- **Snap to Scale**: Never use arbitrary widths (e.g., `w-[312px]`). Snap to Tailwind scales (e.g., `w-80`) or use fluid `max-w` constraints.
- **Rings over Borders**: For interactive states, use `ring-1` instead of `border` to prevent layout shifting by 1px.
- **Typographic Pairings**: Always pair font size with line-height and tracking (e.g., `text-3xl leading-tight tracking-tight`).

## 2. Component Architecture (Next.js & React)
- **Thematic Variables**: Map hex colors in `tailwind.config.ts` using variables (`bg-background`, `border-border`) to ensure instant theme switching.
- **Responsive Fluidity**: Design must look engineered on 320px and 4K displays. Use fluid grids and avoid fixed widths.
- **Standard Stroke**: Use consistent icon stroke widths (1.5px or 2px). Icons must optically match text cap-height.
