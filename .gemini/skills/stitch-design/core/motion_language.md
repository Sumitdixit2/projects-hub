# Motion Language

Motion in elite interfaces is not about animation for the sake of it; it is about spatial awareness, feedback, and perceived performance.

## 1. The 200ms Rule
- UI interactions (hovers, clicks, dropdowns) should resolve in 150ms to 200ms. 
- Anything longer feels sluggish. The interface must keep up with the user's thought process.

## 2. Easing Curves
- Never use linear easing.
- Use `ease-out` for things entering the screen (they start fast and decelerate to their final position).
- Use `ease-in` for things leaving the screen (they start slow and accelerate out of view).
- Spring physics (via Framer Motion) are preferred for drag, drop, and modal interactions to feel physical and natural.

## 3. Micro-Interactions
- **Hover States:** Buttons should not just change color; they should subtly translate (e.g., `-translate-y-[1px]`) or apply an inner glow.
- **Active States:** Provide immediate tactile feedback on click (e.g., `scale-95`).
- **Focus Rings:** Ensure highly visible, animated focus rings for keyboard navigation.

## 4. Scroll Choreography
- Elements should fade and subtly translate up (`opacity-0 translate-y-4` to `opacity-100 translate-y-0`) as they enter the viewport.
- Stagger the entrance of children in a list or grid to create a cascading, "rendered in real-time" effect.

## 5. Restraint
- If an animation distracts from the content, remove it.
- Motion should draw attention to state changes, not act as a permanent decorative element.
