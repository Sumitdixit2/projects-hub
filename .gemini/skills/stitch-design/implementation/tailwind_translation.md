# Tailwind Translation Pipeline

When translating Stitch-generated designs into code, enforce these strict Tailwind rules to maintain the "engineered" aesthetic.

## 1. Avoid Arbitrary Values
- Do not translate a Stitch mockup with `w-[312px]`.
- Snap it to the Tailwind scale: `w-72` (288px) or `w-80` (320px), or use responsive fluid widths (`w-full max-w-sm`).

## 2. Translate Depth to Borders
- If a mockup shows a subtle shadow on a dark mode card, *do not* use `shadow-lg`.
- Translate to: `bg-zinc-900 border border-zinc-800 shadow-none`.

## 3. Typographic Constraints
- A 32px font in a mockup becomes `text-3xl`.
- Always pair font size with line-height adjustments: `text-3xl leading-tight tracking-tight`.

## 4. The "Ring" over "Border" Trick
- For interactive states (like focus or selection on cards), use `ring` instead of `border` to prevent the layout from shifting by 1px when the border appears.
- Example: `hover:ring-1 hover:ring-zinc-700`.

## 5. CSS Variables for Theming
- Do not hardcode specific hex colors into every component (`bg-[#09090b]`). 
- Map them in `tailwind.config.ts`: `bg-background`, `border-border`, `text-primary`.
- This ensures the UI can flip between themes instantly.
