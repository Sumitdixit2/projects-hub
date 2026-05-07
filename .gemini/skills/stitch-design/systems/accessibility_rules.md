# Accessibility Rules (A11y)

Elite design is universally accessible. A beautiful UI is worthless if users cannot navigate it.

## 1. Color Contrast
- Text must have a minimum contrast ratio of 4.5:1 against its background.
- Use tools to verify that `text-zinc-500` against `bg-zinc-950` passes AA requirements. If it doesn't, lighten the text.

## 2. Keyboard Navigation
- Every interactive element must be reachable via the `Tab` key.
- The visual focus state must be clear. Never set `outline: none` without providing a custom, highly visible focus ring (e.g., `focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`).

## 3. Semantic HTML
- Use `<button>` for actions and `<a>` for navigation. Do not use `<div onClick="...">`.
- Use proper heading hierarchy (`h1`, `h2`, `h3`) without skipping levels. The visual size can be altered with CSS, but the underlying semantics must be correct for screen readers.

## 4. ARIA Labels
- If an icon button has no visible text, it must have an `aria-label` or `sr-only` text explaining its function.

## 5. Motion Sensitivity
- Respect the `prefers-reduced-motion` media query. Disable or heavily simplify animations if the user has requested it.
