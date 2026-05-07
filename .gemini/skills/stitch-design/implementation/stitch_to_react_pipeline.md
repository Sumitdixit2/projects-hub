# Stitch to React Pipeline

How to extract a static Stitch design and translate it into a modular React codebase.

## 1. Identify the Component Boundaries
Before writing any code, look at the generated Stitch screen and draw imaginary boxes around the logical units.
- What is the Layout wrapper?
- What is a reusable Card?
- What is a primitive (Button, Badge)?

## 2. Extract Primitives First
Start from the inside out. 
1. Recreate the specific Button style.
2. Recreate the Typography styles (Headers, Paragraphs).
3. Recreate the Badges or small UI elements.
*Use `shadcn/ui` as a base if possible, and override the tailwind classes to match the Stitch design exactly.*

## 3. Build the Molecules
Combine the primitives into the larger blocks.
- Build the `FeatureCard` using the primitive `Card`, `Typography`, and `Icon`.
- Ensure all margins *inside* the card are handled by a Flexbox or Grid layout (`flex flex-col gap-4`).

## 4. Assemble the Layout
Construct the main page.
- Wrap everything in the master grid or flex container.
- Import the molecules and map over data to render them.

## 5. Add Interactivity
Stitch provides static mocks. You must add the logic.
- Add `useState` for toggles, tabs, and modals.
- Implement the Framer Motion animations for entrances and hovers.
