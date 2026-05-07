# Spacing Systems

A rigorous spacing system is the defining characteristic of a professional interface. Without it, the design feels chaotic.

## 1. The 4pt / 8pt Grid System
- ALL margins, paddings, and heights must be multiples of 4 or 8 (e.g., 4, 8, 12, 16, 24, 32, 48, 64, 96, 128).
- *Never* use arbitrary values like 13px or 27px.

## 2. Micro vs. Macro Whitespace
- **Micro Whitespace:** The space between an icon and text inside a button, or the leading of a paragraph. Keep this tight (e.g., 4px, 8px) to establish strong grouping.
- **Macro Whitespace:** The space between major sections of a page. Be generous. Use `96px` or `128px` to give the user time to process the previous section before starting the next.

## 3. Padding Rhythm in Containers
- Cards and containers must have uniform padding, or intentional asymmetric padding.
- Standard Card: `p-6` (24px) on all sides.
- Dense Component: `p-4` (16px) or `p-3` (12px).

## 4. The "Inside-Out" Rule
- Padding inside an element should generally be equal to or less than the margin outside the element. 
- Inner space must not exceed outer space, or the container loses its bounding identity.

## 5. Typography Spacing (Leading)
- Headings require tight line-heights (`1.1` to `1.2` or Tailwind `leading-tight`).
- Body text requires breathable line-heights (`1.5` to `1.7` or Tailwind `leading-relaxed`).
- Margin bottom on paragraphs should equal the line-height for a perfect vertical rhythm.
