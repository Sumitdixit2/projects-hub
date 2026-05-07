# Navigation Systems

Navigation must be instantly recognizable but not visually dominant.

## 1. The Sticky Glass Header
- The standard for modern SaaS and Portfolios.
- **Layout:** A horizontal bar at the top of the viewport.
- **Styling:** `fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50`.
- **Content:** Logo on the left, links in the center, primary CTA on the right.

## 2. The Command Palette (Cmd+K)
- For complex applications, surface-level navigation is insufficient. 
- Every elite app must have a global search/command palette accessible via a keyboard shortcut.
- Visually, it should be a centered modal with a blurred backdrop, focusing entirely on a large text input and a list of results.

## 3. The Vertical Sidebar (Dashboards)
- For heavy operational tools.
- **Layout:** Pinned to the left side (`fixed left-0 h-screen`).
- **Styling:** Usually has a distinct background color (e.g., `bg-zinc-950` against a `bg-zinc-900` canvas) and a right border.
- **Behavior:** Collapsible on smaller screens, turning into an icon-only rail or a hamburger menu.

## 4. The Floating Pill
- Used in minimalist portfolios or specific landing page sections.
- **Layout:** A small, pill-shaped (`rounded-full`) navigation bar floating at the top center or bottom center of the screen, completely detached from the edges.
- **Styling:** Heavy drop shadow or backdrop blur to separate it from the scrolling content underneath.
