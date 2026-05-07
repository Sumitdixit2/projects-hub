# Visual Consistency Checks

Visual consistency is what makes an interface feel like a unified product rather than a collection of disparate pages.

## 1. Token Verification
- Are all colors pulling from the defined palette variables, or are there arbitrary hex codes (`#1a2b3c`) floating around?
- Is the border radius consistent across all similar components (e.g., all cards are `rounded-xl`, all buttons are `rounded-md`)?

## 2. Typographic Alignment
- Ensure `h1` through `h6` scales consistently. 
- Are we using different font weights for the same type of element across different pages? A label should always be `medium` (500), not sometimes `medium` and sometimes `semibold`.

## 3. Interaction Consistency
- Does every button with the same visual style perform a similar class of action?
- Is the hover state identical across all primary buttons?
- Is the focus ring color the same throughout the application?

## 4. Iconography Audit
- Are all icons from the same set (e.g., Lucide, Heroicons, Phosphor)? 
- Never mix solid and outlined icons unless indicating active/inactive state.
- Ensure stroke width is exactly the same across every single icon.
