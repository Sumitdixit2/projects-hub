# Responsive Rules

Elite interfaces do not break; they reflow intelligently.

## 1. Mobile-First Foundation
- Start with a single-column layout for mobile (`w-full`).
- Expand into multi-column layouts only at specific breakpoints (e.g., `md:grid-cols-2`, `lg:grid-cols-3`).

## 2. Fluid Typography
- Use responsive font sizing. 
- A hero title might be `text-4xl` on mobile, but `md:text-6xl` or `lg:text-7xl` on desktop.

## 3. Component Switching
- Sometimes a layout cannot simply scale down.
- A dense data table on desktop should be replaced by a stacked card list on mobile. Hide the table (`hidden md:table`) and show the cards (`block md:hidden`).

## 4. Touch Targets
- On mobile, all interactive elements must have a minimum touch target size of 44x44px. 
- Add padding to small icons so they are easy to tap.

## 5. Navigation Reflow
- Convert horizontal nav bars into hamburger menus or bottom sheets on mobile. 
- Bottom tabs are superior for mobile applications as they are within thumb reach.
