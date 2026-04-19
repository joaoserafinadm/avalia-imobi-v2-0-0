# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Avalia Imóbi** is a full-featured real estate valuation SaaS platform (pt-BR) built with Next.js 13. It provides property valuation workflows, client/user management, subscription billing, and PDF report generation.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint with Airbnb config
npm run email    # React Email dev server (src/emails/)
```

No test suite is configured.

## Architecture

### Directory Structure

- **`pages/`** — Next.js file-based routing. Each `.jsx` is a page, each folder in `pages/api/` is a backend endpoint group.
- **`pages/api/`** — All backend logic lives here (REST endpoints). Organized by domain: `auth/`, `valuation/`, `clientsManagement/`, `accountSetup/`, `mercadopago/`, etc.
- **`src/components/`** — Shared, reusable UI components (Modal, loading, menuBar, cropper, dropzone, etc.).
- **`src/layouts/mainLayout/`** — The primary app shell: Header, Background, Logo, Notifications, and modals.
- **`src/pages/`** — Feature-specific page components (mirrors `pages/` but contains the actual component logic).
- **`src/`** root-level domain folders — Feature components grouped by domain: `valuation/`, `addClient/`, `clientsManagement/`, `accountSetup/`, `index/` (dashboard), etc.
- **`src/emails/`** — React Email templates (auth, new user, password recovery, SAC).
- **`store/`** — Redux store with redux-persist. Slices: `Users/`, `Alerts/`, `NewClientForm/`, `ToggleBarStatus/`.
- **`utils/`** — Cross-cutting utilities: `api.ts` (Axios wrapper), `db.js` (MongoDB connection), `baseUrl.js`, `permissions.js`, `validateToken.js`, `mask.js`, `generatePdf.js`, `cloudinary.js`, `buscaCep.js`.
- **`lib/`** — External service wrappers: `stripe.js`, `mercado-pago.ts`, `products.js`.
- **`hooks/`** — Custom React hooks (e.g., `useMercadoPago.ts`).
- **`styles/`** — Global SCSS (`globals.scss`, `bgColors.scss`).

### Data Flow

1. Component calls Axios via `utils/api.ts` → `pages/api/[domain]/` endpoint
2. API route connects to MongoDB via `utils/db.js` (cached connection)
3. JWT token in cookies is validated via `utils/validateToken.js` on protected endpoints
4. Response flows back; global state is updated via Redux or local `useState`/SWR

### Authentication

- **Primary:** NextAuth.js (Google OAuth) configured in `pages/api/auth/[...nextauth].js`
- **Alternative:** Custom JWT tokens in cookies (`js-cookie`)
- **Route Guards:** `pages/_app.js` validates tokens and redirects to login if absent
- **Roles:** `utils/permissions.js` handles role-based access control

### State Management

- **Redux + redux-persist** for global state (user session, alerts, form state, UI toggles)
- **SWR** for data fetching with automatic caching
- **Local `useState`** for component-level state

### Payments

- **Stripe** — Primary subscription billing with webhook handling in `pages/api/accountSetup/`
- **Mercado Pago** — Alternative payment provider with its own checkout flow and webhooks in `pages/api/mercadopago/`

### Styling

- **SCSS Modules** (`.module.scss`) for component-scoped styles
- **Bootstrap 5** utilities + **MUI** components + **Ionic React** components
- **styled-components** for dynamic CSS-in-JS

### Key Integrations

| Integration | Purpose | Entry Point |
|---|---|---|
| MongoDB | Primary database | `utils/db.js` |
| Cloudinary | Image storage | `utils/cloudinary.js` |
| Resend / Nodemailer | Email delivery | `pages/api/notifications/` |
| Google Maps API | Location features | `@react-google-maps/api` |
| pdfmake / html2pdf | PDF report export | `utils/generatePdf.js` |
| Facebook Pixel | Analytics | `pages/_document.js` |
| Vercel Analytics | Web analytics | `pages/_app.js` |

## Environment Variables

Secrets are in `.env.local` (not committed). Required keys:

```
DATABASE_URL                          # MongoDB connection string
JWT_SECRET                            # JWT signing secret
NEXTAUTH_SECRET, NEXTAUTH_URL         # NextAuth config
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_WEBHOOK_SECRET
RESEND_API_KEY
```

## Important Conventions

- `utils/baseUrl.js` switches API base URL between production and development automatically — always use it for API calls rather than hardcoding URLs.
- TypeScript is present but only `strictNullChecks` is enabled; most files are `.jsx`.
- Path alias `@/*` resolves to the project root (configured in `tsconfig.json`).
- `reactStrictMode` is disabled in `next.config.js`.
- Brazilian Portuguese is the UI language; address lookup uses the CEP API via `utils/buscaCep.js`.
- Console statements are stripped in production via Next.js config.
