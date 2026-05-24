# Fullstack Logic Patterns: Data & State

## 1. Next.js Server Components (RSC)
- Use Server Components by default for data fetching to reduce client-side bundle size.
- Use `'use client'` only for components requiring interactivity or browser APIs.

## 2. Supabase & Auth Integration
- **Auth Flow**: Enforce server-side session checks in `middleware.ts`.
- **Data Fetching**: Use generated types for Supabase clients to ensure end-to-end type safety.
- **Error Handling**: Standardize API responses using a consistent structure (e.g., `{ data, error, status }`).

## 3. State Management
- Use `Zustand` for global UI state (modals, sidebars).
- Use `React Query` or `SWR` for server-state caching and synchronization.
