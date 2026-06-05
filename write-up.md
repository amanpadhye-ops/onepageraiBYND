# Write-Up

## What I built

A web app that takes a company name and returns a structured one-pager — overview, financials, products, clients — with every claim traced to a real source URL and a confidence level (HIGH / MEDIUM / LOW). The output matches the four-quadrant structure of the GPIL example.

The pipeline: React frontend → Express backend → claude-opus-4-5 with the built-in web_search tool → strict JSON schema → SSE streams status updates back to the user while Claude searches. The frontend renders the result in the same layout as the sample PPTX.

**Pre-baked outputs for both required companies are in `/outputs/`.** Since the system runs live web searches, I've included the actual results so the evaluator can inspect them directly without needing to run the system.

---

## What worked

**Citation discipline** is solid for listed companies. Bharat Forge has extensive public disclosures — annual reports, credit rating reports, BSE filings, analyst notes — and the system finds and cites them correctly. All financial figures in the Bharat Forge output are cross-verified across at least two independent sources before appearing.

**Honest gap handling** works well for Brakes India. The system correctly identifies that MCA filings are paywalled, finds no publicly available year-by-year financials, and returns `null` values with a clear explanation rather than inventing numbers. The `SPARSE` quality label is surfaced prominently in the UI. This is the more important result to evaluate — the Bharat Forge output shows what the system *can* do; the Brakes India output shows what it *won't* do.

**The UX flow** — search → live research log → one-pager — makes the 30–60 second wait feel transparent. Watching the search count increment tells the user the system is actually working, not stalling.

---

## What doesn't work well

**Paywalled data is a hard wall.** MCA filings, Tofler, Prowess, and Bloomberg are inaccessible to a web search tool. For most unlisted Indian companies, audited financials simply can't be retrieved. This is real — not a system failure, but it means the product is fundamentally more useful for listed companies.

**Financial year consistency.** Indian press sometimes mixes standalone vs. consolidated figures, or calendar year vs. fiscal year, without flagging it. The system doesn't always catch this. The Bharat Forge financials use consolidated figures throughout, but I had to verify this manually across sources.

**Client confidence.** For Brakes India, the clients listed (Maruti, Hyundai, Tata) come from secondary aggregators like ZoomInfo — not official press releases. They're marked MEDIUM for this reason. A production system would require a higher bar.

---

## What I'd build next

1. **Financial data API** — Screener.in has a documented API for listed companies; integrating it would give clean, structured financials without scraping. For unlisted companies, a Tofler or MCA direct integration would unlock the paywalled filings.

2. **Logo / image pipeline** — Clearbit or Brandfetch for client logos; product image search via a dedicated image API. The current UI uses placeholder icons.

3. **PPTX export** — render the output directly into a PowerPoint matching the GPIL template. This is one `python-pptx` script away.

4. **Source ranking** — weight sources before synthesis: filings > IR pages > credit rating reports > analyst reports > news. Currently Claude decides this implicitly; making it explicit would improve consistency.

5. **Caching** — cache research results by company name + date in Redis. Repeat queries on the same company shouldn't cost another $0.30 and 60 seconds.

---

## Cost and latency

Each query runs 8–12 web searches and generates ~2,000 tokens of JSON. At claude-opus-4-5 pricing, a single query costs approximately $0.25–0.40. Latency is 30–60 seconds for data-rich companies, 45–75 seconds for data-sparse ones (more searches, less to synthesise).

For a product with high query volume, switching to Sonnet for the synthesis step (keeping Opus only if citation quality degrades measurably) would reduce cost by ~5x. I didn't do this here because the assignment weights honesty and citation quality over cost.
