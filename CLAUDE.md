# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CosyCosa2** is the website for **Cosy Casa**, a luxury concierge and property management service for short-term vacation rentals in South Corsica (Porto-Vecchio, Lecci, Pinarello). The stack is React (frontend) + FastAPI/MongoDB (backend), with Beds24 as the external property management system.

## Common Commands

### Frontend (from `frontend/`)
```bash
yarn start          # Dev server (Create React App via Craco)
yarn build          # Production build
yarn test           # Run tests
```

### Backend (from `backend/`)
```bash
uvicorn server:app --reload --port 8000   # Dev server
pytest tests/                              # Run all tests
pytest tests/test_cosycasa_api.py         # Run single test file
python backend_test.py                     # Run test runner script
```

## Architecture

### Frontend (`frontend/src/`)
- **Router:** React Router v7 — `App.js` defines all routes. `/admin` is rendered without Navbar/Footer; all other routes get the full layout wrapper.
- **API client:** `lib/api.js` — Axios wrapper pointing to `REACT_APP_BACKEND_URL`. All backend calls go through here.
- **UI:** Shadcn/ui (new-york style) + Tailwind CSS. Path alias `@/` maps to `src/`. Component config in `components.json`.
- **i18n:** `i18n/index.js` — i18next with FR/EN/ES/IT support and browser language detection.
- **SEO:** `react-helmet-async` is **disabled** (causes blank page bug). Meta tags are static in `public/index.html`.

### Backend (`backend/server.py`)
- Single monolithic FastAPI file (~2400 lines). All routes, models, and business logic are in one file.
- **API prefix:** `/api`
- **Admin auth:** Password-based via `POST /api/admin/login`. Default password: `orso2024`.
- **Scheduled job:** APScheduler runs Beds24 sync on a configurable interval (default: 1 hour).

### Database (MongoDB)
- Database name: `cosycasa`
- Key collections: `properties`, `categories`, `site_settings`, `bookings`, `blog`, `contacts`
- Connected via `motor` (async driver). Connection string from `MONGO_URL` env var.

### External Integrations
- **Beds24** — Property management system. Properties are synced via `POST /api/sync/beds24`. Availability and pricing are fetched per-property. All synced properties default to `is_active: false` (must be manually activated in admin).
- **Cloudinary** — Image storage. Images uploaded via `POST /api/upload/image`.
- **Brevo (Sendinblue)** — Transactional email for contact form and bookings.

## Environment Variables

**Backend `.env`:**
```
MONGO_URL=
DB_NAME=cosycasa
BEDS24_TOKEN=
BEDS24_REFRESH_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=hello@conciergerie-cosycasa.fr
ADMIN_PASSWORD=orso2024
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Frontend `.env`:**
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Design System

Defined in `design_guidelines.json`. Key rules:
- **No gradients** — forbidden throughout.
- **Typography:** `Cormorant Garamond` (serif headings) + `Manrope` (sans-serif body).
- **Colors:** Primary `#2e2e2e`, background `#ffffff`, surfaces `#f9f9f9`/`#f0f0f0`.
- **Corners:** All buttons and cards are square (no border-radius).
- **Glassmorphism:** Only on sticky/fixed headers.
- **Smooth scroll:** Lenis is mandatory — do not replace with native scroll.
- **Section spacing:** `py-24` / `py-32`.
- **Image hover:** Scale `1.05x`.

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.js` | Route definitions |
| `frontend/src/lib/api.js` | Axios API client |
| `frontend/src/i18n/index.js` | i18next setup + translation strings |
| `frontend/src/pages/AdminPage.jsx` | Full admin interface (~73KB) |
| `backend/server.py` | Entire backend (routes, models, logic) |
| `memory/PRD.md` | Product requirements and feature backlog |
| `design_guidelines.json` | Brand identity and design tokens |
| `test_result.md` | Testing protocol and current status |

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->