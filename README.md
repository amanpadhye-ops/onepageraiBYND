# OnePager AI — Bynd Take-Home Assignment

An AI system that generates sourced, confidence-tagged company one-pagers from a company name. Built for the Bynd AI Engineering Intern assignment.

---

## Setup

```bash
# 1. Install
npm install

# 2. Add your API key
cp .env.example .env
# Edit .env → ANTHROPIC_API_KEY=sk-ant-...

# 3. Run (dev: starts both server + frontend)
npm run dev

# Frontend → http://localhost:5173
# Backend  → http://localhost:3001
```

**Production build:**
```bash
npm run build   # compiles React to /dist
npm start       # serves /dist + API on port 3001
```

**Requirements:** Node 18+, Anthropic API key.

---

## Architecture

```
User enters company name
        │
        ▼
React frontend (Vite)
  SearchView → LoadingView → OnePager
        │
        │  POST /api/generate (Server-Sent Events)
        ▼
Express backend
  └─ Calls claude-opus-4-5
       └─ web_search_20250305 tool  (8–12 searches)
            └─ Synthesises into strict JSON schema
                 └─ Streams status events → SSE → frontend
```

**Key decisions:**

- **claude-opus-4-5** — better citation discipline than Sonnet/Haiku; worth the cost (~$0.30/query) when hallucination is the worst failure mode
- **Built-in web_search tool** — simplest integration; avoids external API keys
- **SSE over WebSockets** — one-directional streaming, no upgrade overhead
- **Strict JSON schema in system prompt** — null values for unverifiable data, never invented
- **Pre-baked outputs** in `/outputs/` — the two required companies are already researched and included

---

## Output Schema

Every claim carries `source { title, url }` and `confidence: HIGH | MEDIUM | LOW`.  
Financials use `null` for unverifiable figures — never estimated.  
`dataQuality.overall` is `RICH | MODERATE | SPARSE` — shown prominently in the UI.

---

## Company Outputs

Pre-generated outputs for both required companies are in `/outputs/`:

### `outputs/bharat-forge.json` — DATA RICH
Full financials (FY21–FY24, cross-verified across Motilal Oswal + ICICI Direct analyst reports), 4 verified products, 6 verified clients — all HIGH confidence from annual reports and official press releases.

### `outputs/brakes-india.json` — DATA SPARSE
Unlisted company, no IR site, MCA filings paywalled. The output shows:
- What *was* found: founding, divisions, capacity, brands, export share — all with sources
- What was *not* found: year-by-year financials, exact client names for exports — shown as `null`, not guessed
- `dataQuality.overall = "SPARSE"` with a clear warning in the UI

The contrast between the two outputs is intentional — it demonstrates the system's honesty handling, which is the core evaluation criterion.

---

## Deployment

Any Node host: **Railway**, **Render**, or **Fly.io**.

```bash
# Railway (simplest)
railway login
railway init
railway up
# Set ANTHROPIC_API_KEY in Railway dashboard
```

The Express server serves the built React frontend from `/dist` + the `/api/generate` endpoint on a single port.
