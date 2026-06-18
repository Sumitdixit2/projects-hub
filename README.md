# Project Hub

**Project Hub** is an advanced operational telemetry and management platform designed for agencies. It provides a high-density, command-oriented workspace to track clients, projects, milestones, and system activities with a focus on perceived performance and technical professionalism.

---

## 🎯 Core Use Case

Project Hub serves as the central nervous system for agency operations. It allows agency owners and staff to manage their entire portfolio of clients and projects in one place. 

Unlike traditional SaaS dashboards, Project Hub is built with a **"Drafting Blueprint" aesthetic**—prioritizing data density, operational context, and workflow cognition over generic whitespace. It includes:
*   **Project & Milestone Tracking:** Real-time visibility into project lifecycles.
*   **Operational Telemetry:** Activity feeds and system load indicators.
*   **Multi-Role Access:** Dedicated interfaces for Admins (Owners/Developers) and read-only portals for Clients.

---

## 🏗️ System Architecture & Design

The project is structured as a **Monorepo** (using npm workspaces) to share types and configurations across the stack.

### Directory Structure
*   **`apps/web`**: The frontend Next.js application containing all user interfaces.
*   **`apps/api`**: The backend Node.js/Express REST API.
*   **`packages/shared`**: Shared TypeScript interfaces, Zod schemas, and utility functions used by both the web and API.

### Role-Based Access Control (RBAC)
The system operates under three primary contexts:
1.  **Agency:** The root tenant entity. Agencies register on the platform but do not have a dedicated UI; they serve as the organizational boundary.
2.  **Admin (Owner / Developer / Staff):** The operational users. They have full access to mutate state, create projects, assign milestones, and view system-wide activity.
3.  **Client:** The end-users who receive services from the Agency. They have a strict **read-only** portal to view their specific projects and milestone progress.

### Design Aesthetic (Vercel / Linear Hybrid)
The UI is strictly engineered to feel like a technical professional tool:
*   **Colors:** Deep black (`#000000`) backgrounds with monochromatic zinc and blue-600 palettes.
*   **Typography:** Monospace fonts for telemetry and data grids to ensure alignment.
*   **Loading States:** A systemic, non-blocking skeleton shimmer infrastructure (0.04 opacity) that preserves layout rhythm during async hydration.
*   **Resilience:** Graceful degradation on UI components (like StatusBadges) to prevent frontend crashes from backend enum drift.

---

## 🛠️ Tech Stack

### Frontend (`apps/web`)
*   **Framework:** Next.js (App Router), React 19
*   **Styling:** Tailwind CSS v4, Lucide React (Iconography)
*   **UI Components:** Radix UI, Base UI, Framer Motion (for micro-interactions)
*   **State Management:** Zustand (Client State)
*   **Forms & Validation:** React Hook Form + Zod
*   **Notifications:** Sonner

### Backend (`apps/api`)
*   **Framework:** Node.js, Express.js (v5)
*   **Database:** PostgreSQL (raw SQL queries via `pg-promise`)
*   **Authentication:** JWT (JSON Web Tokens), bcrypt
*   **Rate Limiting & Caching:** Redis (used for Token Bucket and IP-based rate limiting)
*   **Email/Notifications:** Resend

---

## 🚀 Local Development Setup

### Prerequisites
*   Node.js (v20+)
*   PostgreSQL
*   Redis (Running locally or via Docker)

### Installation

1.  **Clone the repository and install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    *   Create a `.env` file in `apps/api` and configure your database (`DATABASE_URL`), Redis, and JWT secrets.
    *   Create a `.env.local` file in `apps/web` for frontend environment variables (e.g., `NEXT_PUBLIC_API_URL`).

3.  **Start the Development Servers:**
    Run the following command from the root directory to start both the API and the Web app concurrently:
    ```bash
    npm run dev
    # Alternatively, you can start them individually:
    # cd apps/api && npm run dev
    # cd apps/web && npm run dev
    ```

---

## 🔒 Security & Hardening

*   **API Rate Limiting:** Granular rate limiting is enforced at the middleware level. Distinct limiters exist for authentication (IP-based), standard reads, and sensitive writes (Token Bucket).
*   **Defensive Rendering:** The frontend is hardened to never crash on unexpected backend payloads. Unknown statuses fallback to a neutral visual state.
*   **Strict Middleware:** API endpoints explicitly enforce authorization boundaries (e.g., `requireAdmin`, `isMyProject`) to prevent unauthorized data access across roles.
