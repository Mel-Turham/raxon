# Raxon

Raxon is a crypto-market and portfolio dashboard built with the Next.js App Router. It brings market discovery, portfolio monitoring, notifications, and trading workflows into a single application.

The current implementation is a **demonstration frontend**. Market and portfolio data are mocked, authentication is simulated, and trading operations do not execute against an exchange.

## Product surface

| Route         | Capability                                                         |
| ------------- | ------------------------------------------------------------------ |
| `/`           | Sign-in demonstration                                              |
| `/register`   | Account creation demonstration                                     |
| `/dashboard`  | Portfolio summary, market leaders, gainers, and recent activity    |
| `/markets`    | Market asset discovery and new listings                            |
| `/analytics`  | Portfolio performance, allocation, and trading analytics           |
| `/otc`        | Request indicative quotes for large over-the-counter trades        |
| `/portfolio`  | Holdings, history, watchlist, converter, and simulated exchange UI |
| `/trade`      | Market chart, order book, orders, and simulated trade activity     |
| Unknown route | Custom 404 page                                                    |

The application UI, document language, and route metadata are in English.

## Technology

| Area                 | Stack                                    |
| -------------------- | ---------------------------------------- |
| Framework            | Next.js 16 App Router                    |
| UI runtime           | React 19, TypeScript strict mode         |
| Styling              | Tailwind CSS 4                           |
| UI primitives        | Base UI and shadcn-compatible components |
| Forms and validation | React Hook Form, Zod                     |
| Visualization        | Visx, D3                                 |
| Icons                | Hugeicons                                |
| Package manager      | Bun (`bun.lock`)                         |

## Local development

### Prerequisites

- Node.js 20.9 or later
- Bun

### Install and run

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

The sign-in demonstration defaults to `demo@raxon.app` / `DemoPass&2025`. These are public demo values, not credentials. Do not use this flow for production authentication.

### Commands

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `bun run dev`       | Start the development server.                      |
| `bun run build`     | Create a production build.                         |
| `bun run start`     | Serve the production build.                        |
| `bun run lint`      | Run ESLint.                                        |
| `bun run typecheck` | Run TypeScript without emitting files.             |
| `bun run format`    | Format all `*.ts` and `*.tsx` files with Prettier. |

There is currently no automated test script.

## Architecture

The application is organized around product capabilities rather than technical layers. A feature owns its UI, data access, domain types, constants, mocks, and actions where applicable. Cross-feature primitives and utilities live in `shared/`.

```text
app/                         Next.js routing and composition root
├── (auth)/                  Sign-in and registration routes
├── (dashboard)/             Application shell and product routes
├── layout.tsx               Root document, fonts, and default metadata
├── providers.tsx            Client-side global providers
└── not-found.tsx            Application 404 UI

features/                    Product capabilities
├── app-shell/               Navigation and application shell
├── auth/                    Demo authentication flows
├── analytics/               Portfolio and trading analytics
├── otc/                     OTC desk and quote workflow
├── dashboard/               Summary and recent activity
├── markets/                 Market discovery
├── notifications/           Notification UI and actions
├── portfolio/               Holdings and portfolio tools
└── trade/                   Charts and trading workflows

shared/                      Cross-feature infrastructure and UI
├── api/                     Server-side request utility
├── charts/                  Reusable chart primitives and behavior
├── components/              Shared atoms and molecules
├── config/                  Application-wide configuration
├── hooks/                   Shared React hooks
├── lib/                     General-purpose utilities
├── providers/               Shared providers
└── types/                   Cross-feature types

components/ui/               UI primitives retained for the shadcn CLI
docs/                        Architecture decisions and supporting docs
```

### Composition and ownership

`app/` is the composition root. Route files own URL mapping and route metadata, then render a feature's public view. They should not own domain behavior or import feature internals.

```text
Route → public feature API → feature view → feature sections/components
                            ↘ shared primitives and utilities
```

Feature internals remain private by default. Each feature's root `index.ts` is its external API; internal `views/`, `mocks/`, helpers, and implementation details should not be imported by other features or routes.

### Dependency rules

```text
app      → public feature APIs, shared
features → own internals, shared, public APIs of other features when needed
shared   → shared code and external packages; never features
```

- Cross-feature dependencies must use the target feature's public entry point.
- Features must not depend on `app/`.
- `shared/` must not depend on features.
- Route files must not reach into feature internals.
- ESLint currently enforces these boundaries for the configured import patterns.

The main TypeScript aliases are `@/*`, `@shared/*`, and `@features/*`.

## Data and runtime model

Feature `api/` modules currently provide server-side data functions backed by feature-local mock datasets. `shared/api/request.ts` centralizes the simulated request delay. `MOCK_API_LATENCY_MS` overrides the delay; development defaults to 800 ms, and other environments default to no delay.

This is an integration seam, not a production data layer. Replacing the mocks requires explicit API contracts, failure handling, authorization, cache policy, and observability. The exchange and order flows are simulations and do not submit real transactions.

## Configuration and security notes

| Variable                    | Purpose                                  | Default                             |
| --------------------------- | ---------------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_TEST_EMAIL`    | Demo sign-in email                       | `demo@raxon.app`                    |
| `NEXT_PUBLIC_TEST_PASSWORD` | Demo sign-in password                    | `DemoPass&2025`                     |
| `MOCK_API_LATENCY_MS`       | Simulated request delay, in milliseconds | `800` in development; `0` otherwise |

The `NEXT_PUBLIC_*` values are bundled into client-side code by Next.js. They are intentionally non-secret demo values and must never contain production credentials. `.env.example` documents the demo configuration; the application also has defaults when these variables are absent.

`next.config.ts` configures response security headers. Production deployment should still validate those headers against the hosting platform, domain setup, and the application's actual integration requirements.

## Engineering status

- TypeScript strict mode is enabled.
- ESLint includes Next.js rules and import-boundary rules for `app`, `features`, and `shared`.
- The current lint run has no errors and reports four React Hooks warnings in three files; details are tracked in [CLEAN_CODE_REVIEW.md](./CLEAN_CODE_REVIEW.md).
- Typecheck and lint scripts are available.
- No automated test suite or test command is configured.
- CI enforcement, `dependency-cruiser`, and `knip` are still outstanding architecture work.

## Architecture references

- [Architecture plan](./ARCHITECTURE_PLAN.md)
- [ADR 0001: Feature-driven architecture](./docs/adr/0001-feature-driven-architecture.md)
- [Clean code review](./CLEAN_CODE_REVIEW.md)
