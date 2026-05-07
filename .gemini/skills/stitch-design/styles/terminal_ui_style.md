# Terminal UI Style Guide

For developer tools that need to feel like they belong in a CLI.

## Core Characteristics
- **Typography:** Strict, 100% monospace (e.g., Fira Code, JetBrains Mono, Geist Mono).
- **Color Palette:** Completely dark. Often `#000000` canvas with `#0D0D0D` panels. Accents are usually a single stark color (e.g., pure green `#00FF00`, amber `#FFB000`, or cyan).
- **Layout:** Dense, text-heavy. Everything aligns to a strict grid, mimicking a character grid in a terminal.
- **Borders:** 1px solid borders, often using ASCII-style characters or simple thin lines (`border-zinc-800`).
- **Interactions:** Keyboard-centric. Visual focus rings are aggressive and blocky.

## Implementation Details (Tailwind)
- Font: `font-mono text-sm`.
- Canvas: `bg-black text-green-500` (for a classic matrix look) or `text-zinc-300` (for a modern CLI look).
- Borders: `border border-zinc-800 rounded-none` (No border-radius!).
