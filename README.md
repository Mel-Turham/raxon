# Raxon

Raxon is an open-source crypto trading and portfolio app built with the Next.js App Router. It combines live market data, a real-time trading view, portfolio analytics, and an AI assistant in one interface.

Live demo: [raxon.melturham.me](https://raxon.melturham.me)

## What is real and what is simulated

| Real                                                                | Simulated                                                 |
| ------------------------------------------------------------------- | --------------------------------------------------------- |
| Market prices, movers, sectors, stats and news                      | Sign-in and sign-up (nothing is stored)                   |
| Trade order book, trades, ticker and candles, streamed in real time | Account balances, trade history and orders (demo account) |
| Fear & Greed index and long/short sentiment                         | Placing orders, deposits, withdrawals, swaps, transfers   |
| Raxon AI answers, grounded in live market data                      | Integrations, automations, notifications and the OTC desk |
| Portfolio and analytics charts, valued at real historical prices    |                                                           |

The demo account holds a fixed portfolio and a year of deterministic trades executed at real daily Binance prices, so every page shows consistent figures without a real exchange account.

## Product surface

| Route                          | Capability                                                          |
| ------------------------------ | ------------------------------------------------------------------- |
| `/`                            | Sign-in demo, with a one-time notice explaining the demo            |
| `/register`                    | Sign-up demo                                                        |
| `/dashboard`                   | Balance, portfolio value, KPIs, market leaders, gainers, top assets |
| `/markets`                     | Live tickers, movers, sectors, news, insights, sentiment and stats  |
| `/trade`                       | Real-time chart, order book, trades, order form and orders          |
| `/portfolio`                   | Metrics, value history, holdings, watchlist and converter           |
| `/analytics`                   | Realized P&L, performance, allocation and trade statistics          |
| `/otc`                         | Indicative quotes for large trades                                  |
| `/ai`                          | Raxon AI chat with live market insights                             |
| `/ai/integrations`             | Integration catalog                                                 |
| `/ai/integrations/automations` | Alert and signal automations                                        |

## Data sources

All providers below have a free tier and only Groq needs a key.

| Provider                                                                         | Used for                                                         | Key      |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| [CoinGecko](https://www.coingecko.com/en/api)                                    | Prices, market caps, movers, sectors, global stats               | Optional |
| [Binance public data](https://developers.binance.com/docs/binance-spot-api-docs) | Trade REST and WebSocket streams, historical prices, spot quotes | No       |
| Binance Futures                                                                  | Perpetual quotes and long/short sentiment                        | No       |
| [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/)            | Fear & Greed index                                               | No       |
| CoinDesk, Cointelegraph, Decrypt RSS                                             | Market news                                                      | No       |
| [Groq](https://console.groq.com)                                                 | AI chat, AI signals and news sentiment                           | Required |

Raxon AI falls back through `gpt-oss-120b`, `gpt-oss-20b` and `qwen3.8-27b` when a model is retired, rate limited or unavailable, and tells the user when the free quota is used up.

## Technology

| Area                 | Stack                            |
| -------------------- | -------------------------------- |
| Framework            | Next.js 16 App Router            |
| UI runtime           | React 19, TypeScript strict mode |
| Data fetching        | TanStack React Query, axios      |
| Styling              | Tailwind CSS 4                   |
| UI primitives        | Base UI and shadcn components    |
| Forms and validation | React Hook Form, Zod             |
| Visualization        | Visx, D3                         |
| AI rendering         | react-markdown, remark-gfm       |
| Icons                | Hugeicons                        |
| Package manager      | Bun (`bun.lock`)                 |

## Local development

### Prerequisites

- Node.js 20.9 or later
- Bun
- A free [Groq API key](https://console.groq.com/keys) for Raxon AI

### Install and run

```bash
bun install
cp .env.example .env
bun run dev
```

Set `GROQ_API_KEY` in `.env`, then open [http://localhost:3000](http://localhost:3000).

The sign-in form is pre-filled with the public demo credentials `demo@raxon.app` / `DemoPass&2025`. They are not real credentials.

### Commands

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `bun run dev`       | Start the development server.                      |
| `bun run build`     | Create a production build.                         |
| `bun run start`     | Serve the production build.                        |
| `bun run lint`      | Run ESLint.                                        |
| `bun run typecheck` | Run TypeScript without emitting files.             |
| `bun run format`    | Format all `*.ts` and `*.tsx` files with Prettier. |

## Configuration

Every variable is listed in [`.env.example`](./.env.example). They are validated at startup by `shared/config/env.ts` (public) and `shared/config/env.server.ts` (server only); the app refuses to start and names the missing variable when one is absent.

| Variable                      | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | Canonical URL for metadata, Open Graph and sitemap        |
| `NEXT_PUBLIC_TEST_EMAIL`      | Demo sign-in email                                        |
| `NEXT_PUBLIC_TEST_PASSWORD`   | Demo sign-in password                                     |
| `NEXT_PUBLIC_BINANCE_API_URL` | Binance public REST API (also called from the browser)    |
| `NEXT_PUBLIC_BINANCE_WS_URL`  | Binance public WebSocket streams                          |
| `BINANCE_FUTURES_API_URL`     | Binance Futures API for perpetuals and sentiment          |
| `COINGECKO_API_URL`           | CoinGecko API                                             |
| `COINGECKO_API_KEY`           | Optional CoinGecko demo key for a higher rate limit       |
| `FEAR_GREED_API_URL`          | Fear & Greed API                                          |
| `NEWS_RSS_FEEDS`              | Comma-separated `Source\|url` news feeds                  |
| `GROQ_API_URL`                | Groq OpenAI-compatible API                                |
| `GROQ_API_KEY`                | Groq API key                                              |
| `GROQ_MODEL`                  | Optional preferred model, tried before the fallback chain |
| `MOCK_API_LATENCY_MS`         | Delay for simulated features, `800` in development        |

`NEXT_PUBLIC_*` values are bundled into client code, so they must never hold secrets.

## Deployment

The app deploys to Vercel as is. `vercel.json` pins functions to `fra1` (Frankfurt) because Binance Futures rejects requests from US regions. Set the variables from `.env.example` in the Vercel project, and mark `GROQ_API_KEY` as sensitive.

## Architecture

The code is organized by product capability. Each feature owns its UI, data access, types, constants and actions; cross-feature infrastructure lives in `shared/`.

```text
app/                         Routing and composition root
├── (auth)/                  Sign-in and registration
├── (dashboard)/             Application shell and product routes
├── (ai-assistant)/          Raxon AI routes
├── api/                     Route handlers for client refetches and AI chat
├── layout.tsx               Root document, fonts and metadata
└── providers.tsx            React Query, theme and tooltip providers

features/                    Product capabilities
├── accounts/  ai/  analytics/  app-shell/  auth/  dashboard/
├── integrations/  markets/  notifications/  otc/  portfolio/
└── search/  trade/  wallet/

shared/                      Cross-feature infrastructure and UI
├── account/                 Demo account source, valuation and FIFO P&L
├── api/                     HTTP clients for each provider
├── charts/                  Reusable chart primitives
├── components/              Shared atoms and molecules
├── config/                  Configuration and validated env
├── hooks/                   Shared hooks, including the Binance stream
├── lib/                     General-purpose utilities
└── providers/               Query client and server prefetch

components/ui/               shadcn primitives
```

### Data flow

```text
Server component ── prefetch (React Query) ──► HydrationBoundary ──► client component
                                                                         │
             /api route handler ◄── axios refetch (keys stay server-side) ┘
Binance WebSocket ──► React Query cache (Trade) / live price context (Markets)
```

- Server sections prefetch with direct loaders and hand the cache to the client through `HydrationBoundary`.
- Client components read the same query keys and refetch through `app/api/*`, so provider keys never reach the browser.
- Upstream responses are cached with Next's data cache through axios' fetch adapter.

### Dependency rules

```text
app      → public feature APIs, feature server loaders (route handlers), shared
features → own internals, shared, public APIs of other features
shared   → shared code and external packages; never features
```

The main TypeScript aliases are `@/*`, `@shared/*` and `@features/*`.

## Engineering status

- TypeScript strict mode is enabled and `bun run typecheck` passes.
- `bun run lint` currently fails to start: `typescript-eslint` does not support TypeScript 7 yet.
- There is no automated test suite yet.

## License

Raxon is released under the [MIT License](./LICENSE).
