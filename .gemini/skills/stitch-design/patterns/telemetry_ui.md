# Telemetry & Data Visualization UI

How to present numbers and graphs so they look engineered, not like a generic Excel chart.

## 1. The Micro-Chart (Sparkline)
- Do not use massive charts for simple trends. 
- Embed small, borderless SVG line graphs directly inside stat cards or table rows. 
- Use a single solid color for the line (e.g., `stroke-green-500`) with no axes and no gridlines.

## 2. Monospace Metadata
- Whenever displaying numbers, IP addresses, hashes, or timestamps, always use a `font-mono` class. 
- This ensures numerical data aligns perfectly vertically, improving scannability.

## 3. High-Contrast Status Badges
- Status is critical information. 
- **Active/Healthy:** `bg-green-500/10 text-green-500 border border-green-500/20`
- **Error/Critical:** `bg-red-500/10 text-red-500 border border-red-500/20`
- **Pending/Warning:** `bg-yellow-500/10 text-yellow-500 border border-yellow-500/20`
- Keep them small (`text-xs`), pill-shaped (`rounded-full`), and prominently placed next to the entity they describe.

## 4. The "Ledger" Table
- For dense data, avoid striped rows (`bg-gray-50`). 
- Instead, use a pure monochrome table with a 1px `border-b` on every row. 
- Rely on hover states (`hover:bg-zinc-900/50`) to help the user track their place.
