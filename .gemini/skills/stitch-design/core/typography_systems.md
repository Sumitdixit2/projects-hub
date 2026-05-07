# Typography Systems

Typography is the interface. 90% of web design is manipulating text.

## 1. Font Selection
- **Primary Interface Font:** Choose geometric sans-serifs or neo-grotesques with excellent readability at small sizes (Inter, Roboto Flex, SF Pro, Geist).
- **Display Font (Optional):** For hero headers only, a font with more character (e.g., Cal Sans, Clash Display, or a highly customized serif).
- **Monospace:** Essential for tech/developer tools. Use for code, telemetry, badges, and metadata (Geist Mono, JetBrains Mono, Fira Code).

## 2. The Typographic Scale
- Stick to a strict scale. Do not invent sizes on the fly.
- `xs` (12px) - Metadata, timestamps, tiny badges.
- `sm` (14px) - Secondary text, dense dashboard tables.
- `base` (16px) - Standard body copy.
- `lg` (18px) - Emphasized body, intro text.
- `xl/2xl` (20-24px) - Card titles, section subheaders.
- `3xl/4xl` (30-36px) - Section headers.
- `5xl/7xl` (48-72px+) - Hero titles only.

## 3. Contrast via Weight and Opacity
- Avoid using pure black/white for all text.
- **Primary:** `text-white` or `text-zinc-900` for headings.
- **Secondary:** `text-zinc-400` or `text-zinc-500` for body copy. This contrast is critical for hierarchy.
- Use `medium` (500) or `semibold` (600) for structural elements (labels, buttons). Use `normal` (400) for prose.

## 4. Tracking (Letter-spacing)
- **Headings:** Track tighter (`tracking-tight` or `-0.02em`) as font size increases to make headlines feel like solid blocks.
- **All Caps:** If using uppercase for labels or kickers, track wider (`tracking-widest` or `0.1em`) to improve readability and add a premium feel.

## 5. Measure (Line length)
- Never let a line of body text exceed 65-75 characters. Use Tailwind's `max-w-prose` or `max-w-2xl` to constrain text blocks and prevent reading fatigue.
