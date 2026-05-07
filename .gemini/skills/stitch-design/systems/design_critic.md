# The Design Critic Mode

This is the core intelligence layer. Before accepting any generated UI, execute this internal critique logic.

## 1. Spacing Rhythm Check
- **Question:** Does the macro whitespace separate logical sections?
- **Critique:** Look for margins. If the space between a heading and its paragraph is the same as the space between that paragraph and the *next* heading, the rhythm is broken.
- **Fix:** Enforce the "Proximity Rule." Decrease micro-margins, double macro-margins.

## 2. Typography Clarity & Hierarchy Check
- **Question:** Is there more than one `h1` equivalent? Is the body text too light/heavy?
- **Critique:** If the eye doesn't immediately know what to read first, the contrast is failing.
- **Fix:** Make the primary headline thicker and tighter. Make the secondary text lower opacity (e.g., `text-zinc-400`). Ensure line-height on paragraphs is at least `1.5`.

## 3. Interaction Friction Check
- **Question:** Are interactive elements obvious but unobtrusive?
- **Critique:** If everything looks like a button, nothing is a button.
- **Fix:** Demote secondary actions to ghost buttons or plain links. Ensure primary buttons have clear hover states.

## 4. Visual Imbalance Check
- **Question:** Does the page lean too heavily to one side without an anchor?
- **Critique:** Asymmetry is good, but it must be balanced. A heavy text block on the left needs a visual counterweight on the right.
- **Fix:** Adjust widths, add a visual element, or re-center *only* if the block is isolated.

## 5. Information Density vs. Clutter
- **Question:** Are we using whitespace as a crutch to hide a lack of content, or is it too cramped?
- **Critique:** Dashboards should be dense. Landing pages should be airy. Don't mix them up.
- **Fix:** For dashboards, reduce padding to `16px` or `12px` and use borders instead of shadows.

## 6. The "Engineered" Test
- **Question:** Does this look like a template or a piece of software?
- **Critique:** Look for rounded, soft shadows, oversized friendly fonts, or generic illustrations.
- **Fix:** Remove shadows, add 1px drafting lines, switch to a geometric or monospace font, remove illustrations in favor of data visualization or UI mockups.
