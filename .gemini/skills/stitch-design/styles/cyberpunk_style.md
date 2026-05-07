# Cyberpunk / Neo-Brutalist Style Guide

For interfaces that need to feel like high-octane hardware or futuristic operating systems.

## Core Characteristics
- **Color Palette:** High contrast. Deep black (`#000000`) paired with highly saturated, glowing neons (e.g., Cyberpunk Yellow `#FCEE09`, pure cyan `#00FFFF`, hot pink `#FF00FF`).
- **Typography:** Blocky, aggressive sans-serifs or monospace fonts. Often styled in uppercase.
- **Borders & Shapes:** Sharp corners only (`rounded-none`). Heavy, thick borders, or conversely, extremely thin, intricate drafting lines. 
- **Graphics:** Use of hash patterns (`///`), barcode motifs, crosshairs, and exposed "metadata" (e.g., displaying random hex codes or coordinates as decorative elements).
- **Motion:** Glitch effects, rapid transitions, and flickering cursors.

## Implementation Details (Tailwind)
- Background: `bg-black`.
- Primary Button: `bg-[#FCEE09] text-black font-bold uppercase rounded-none border-2 border-[#FCEE09] hover:bg-black hover:text-[#FCEE09]`.
- Decorative Elements: Add absolute positioned `div`s with `border-l` and `border-t` to look like targeting brackets around content blocks.
