# Dashboard Prompting

Generating dense, usable dashboards requires strict constraints on Stitch.

## 1. The Command Center Dashboard
> "Design a dense SaaS dashboard interface in dark mode. The layout consists of a slim vertical sidebar on the left (with minimal monochrome icons and small text) and a main content area. The main area uses an asymmetrical bento grid. Include one large primary chart card (spanning full width) with a subtle glowing line graph. Below it, a 3-column bento layout featuring 'Server Status', 'Recent Logs', and 'Active Users'. Use `bg-zinc-950` for the canvas and `bg-zinc-900` for the cards. All cards must have a 1px `border-zinc-800`. Use monospace fonts for all numerical data. Avoid heavy shadows; rely on borders for separation."

## 2. The Clean Vercel-Style Settings Panel
> "Design a settings and configuration dashboard for a web app. The aesthetic is extremely clean and minimalist. White mode (or very light gray `bg-gray-50`). The layout is a centered, max-width column. Each settings section is a card with a 1px `border-gray-200`, pure white background, and a subtle shadow (`shadow-sm`). Inside the cards, use a list of key-value pairs or toggle switches. Typography should be inter/sans-serif. Keep paddings generous (e.g., 24px). Buttons should be small and geometric."

## 3. The Telemetry / Analytics View
> "Design a data-heavy analytics dashboard. Dark mode. The top section should feature a row of 4 'stat cards'—each containing a label, a large number, and a small green/red percentage indicator. Below that, a massive data table. The table rows should have a 1px bottom border, no background color on rows, and use high contrast for the primary column and low opacity (`text-zinc-500`) for metadata columns. Include a sticky header for the table with a backdrop blur effect."
