# Stitch to Next.js Pipeline

Optimizing Stitch designs for the Next.js App Router architecture.

## 1. Server Components by Default
- The vast majority of a Stitch-generated landing page or dashboard layout should be React Server Components (RSC).
- Do not add `"use client"` to the top of the page.

## 2. Isolate Interactivity
- Look at the Stitch design. Which parts actually require JavaScript? (e.g., a tab switcher, a command palette, a complex animated chart).
- Extract *only* those specific pieces into separate files and mark them with `"use client"`.
- Example: The `DashboardPage` is a server component that fetches data, but it imports a `<ClientChart data={data} />` component.

## 3. Layouts and Routing
- Use Next.js `layout.tsx` for the consistent structural elements identified in the Stitch design (e.g., the Sidebar, the Top Navigation).
- The `page.tsx` should only contain the content specific to that view.

## 4. Font Optimization
- Stitch designs rely heavily on specific typography. 
- Use `next/font/google` or `next/font/local` to load the exact fonts (e.g., Inter, Geist) at build time, ensuring zero layout shift and maximum performance.

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
```
