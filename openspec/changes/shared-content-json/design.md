## Context

The five experience pages are independently-authored, self-contained HTML files with inline CSS/JS. They each hard-code the same résumé facts, re-voiced per theme, and each weaves those facts into bespoke markup — split-flap cells, an SVG trajectory with hand-tuned path fractions, a scroll-scrubbed platformer with per-zone x-positions and pixel props, title-block drawing sheets, telemetry readouts. There is no generic "list of career stops" rendered by a loop; presentation is unique per page.

Current deploy is deliberately build-free: the `node:22` Docker image copies `src/` and runs Express; `docker compose up -d --build` is the whole pipeline. The site is live at `www.ryanwilk.com`, so the migration must not take it down.

The delivery mechanism is decided (per proposal's open decision): **build-time injection.** Facts live in one `content.json`; a build bakes them into the pages as literal text so the output stays self-contained, works via `file://`, and keeps content in the HTML for crawlers and no-JS readers.

## Goals / Non-Goals

**Goals:**
- One canonical source (`content.json`) for the factual skeleton that must never drift across experiences: names, titles, dates, project stacks, quantified stats, URLs, contact, education, positioning line.
- A build step that injects those facts into each experience, emitting final HTML identical in shape to today's pages (self-contained, content-in-markup).
- Preserve every current property: each experience independently rewritable, no shared runtime, `file://`-openable output, SEO/no-JS intact, deploy stays simple.
- Make content parity **structural** (a wrong fact is fixed once) instead of **disciplinary** (five coordinated edits).

**Non-Goals:**
- Sharing *prose*. The re-voiced descriptions ("First chair at the helm" vs "PROMOTED TO PRINCIPAL +5000 XP") are intentionally theme-owned and stay in the templates.
- Sharing *presentation* data (glyphs, path fractions, zone positions, accent colors) — these are theme-specific and stay in the templates.
- A generic render engine or component framework. This is factual injection into bespoke markup, not templating away the designs.
- Runtime fetch, a client-side content store, or changes to the shell's composition contract.
- Touching the archived CRA app.

## Decisions

**D1 — Delivery: build-time injection** *(chosen by user over runtime fetch)*
Rationale: keeps output self-contained and `file://`-openable, keeps facts as literal HTML text (SEO + no-JS preserved — the reason to reject runtime fetch for a portfolio), and adds no runtime dependency or loading/empty states. Cost accepted: a build step, and the served pages become generated artifacts.

**D2 — Scope of sharing: the factual skeleton only**
`content.json` holds what is identical across all five and dangerous when wrong: profile/positioning line; career stops (company, role/title, location, start/end dates, and the quantified facts — "30M devices", "−80% vulns"); projects (name, year, stack[], url, headline stat, featured|legacy); skills (grouped); education; contact (email, github, linkedin, site). It does **not** hold the per-theme prose or presentation. Each experience's template references shared facts by key and supplies its own voicing and layout around them.
Alternatives considered: (a) put everything including prose in JSON with per-theme variants — rejected, it fights the design intent and bloats the schema; (b) share nothing, keep as-is — rejected, that's the status quo problem.

**D3 — Injection mechanism: named tokens with context-aware escaping**
Templates mark injection points with explicit tokens (e.g. `{{contact.email}}`, `{{career.x1.stat}}`). The build substitutes literal values, escaping per surrounding context — HTML text, HTML attribute, or JS string literal inside `<script>`. Values are plain strings/numbers; where a value feeds a fixed-width display (split-flap cells, board columns) the template, not the JSON, owns padding/truncation.
Alternatives considered: (a) `data-content="key"` DOM attributes filled at build — cleaner for HTML but doesn't reach facts embedded in JS arrays (arcade `EVENTS`, voyage stops), so it wouldn't be uniform; (b) inject a `const CONTENT = {…}` object and render client-side — recreates the no-JS/SEO regression of runtime fetch, defeating D1. Tokens are the one mechanism that works uniformly across HTML/attr/JS-literal contexts and yields static output.

**D4 — Source vs. output: `src/experiences/*.html` are templates; `src/*.html` are generated and committed**
Templates (with tokens) become the source of truth; the build writes the final pages into `src/`. Generated files are committed so the Docker image and deploy stay exactly as they are today — no Node build tooling in the production image, `docker compose up -d --build` unchanged, and the served output stays reviewable in diffs. Each generated file carries a header comment: `<!-- GENERATED from experiences/NN + content.json — do not edit; run npm run build -->`.
Alternatives considered: add a multi-stage Docker build that generates at image-build time — cleaner (no generated files in git) but reintroduces the build stage the current image deliberately omits and puts build tooling in the prod path; deferred as a possible later move. A CI/pre-commit check that fails on stale generated output is a recommended complement (see Risks).

**D5 — Build tool: a single zero-dependency Node script**
`build/build.mjs` (Node ≥ 18, no npm dependencies) reads `content.json` + `src/experiences/*.html`, substitutes tokens, writes `src/*.html`, and errors loudly on an unknown or unfilled token. A `package.json` at repo root exposes `npm run build`. Rationale: minimal surface, nothing to audit or keep updated, matches the "no framework" ethos of the pages themselves.

**D6 — Neutral prose is a permitted verbatim fallback** *(chosen by user)*
`content.json` carries three fact tiers per entity: (1) atomic structured facts — dates, `stack[]`, `metrics` values, urls; (2) neutral `summary`/`highlights` prose; (3) nothing else (theme voice never lives here). Templates decide, per entity, how much to voice:
- **Featured and current content** gets full per-theme voicing — the neutral prose is reference only, and the visible sentence is authored in the template with atomic facts injected as tokens (the D3 mechanism).
- **Low-stakes content** (legacy projects, minor bullets) MAY render the neutral `summary`/`highlights` verbatim via a token, so we do not author five voicings for "Alpine Knives — an e-commerce platform."
This keeps authoring effort where it matters while still single-sourcing the low-stakes prose. The neutral prose remains theme-neutral (D2 unchanged); "verbatim fallback" means a template chooses to emit it as-is, not that the JSON gains any theme-specific content.

## Risks / Trade-offs

- **Unfilled or misspelled token silently ships blank** → build fails hard on any token with no matching key, and on any `{{…}}` left in output; a smoke check greps generated files for stray `{{`.
- **Context escaping bug (a value with quotes/`<`/`&` breaks HTML or JS)** → escape per context at injection; unit-cover the escaper with adversarial values (apostrophes, ampersands, angle brackets) before migrating real pages.
- **Someone hand-edits a generated `src/*.html` and the fix is lost on next build** → header banner on every generated file + a `verify` script (also CI-able) that rebuilds and diffs against committed output, failing if they differ.
- **Fixed-width theme displays (split-flap columns) break if a shared value changes length** → JSON stores the raw fact; the template owns padding/truncation to its cell convention, so length changes degrade gracefully within one theme rather than corrupting the board.
- **Migration risk to a live site** → migrate one experience at a time; each converts to a template + regenerates to a byte-comparable page before moving on (see plan).
- **Trade-off accepted:** generated files in git make those diffs noisy on content changes. Mitigated by the fact that content changes are now *supposed* to be single-file edits to `content.json`; the regenerated page diffs are the expected mechanical consequence, and the banner + verify step keep intent clear.

## Migration Plan

1. **Author `content.json`** from the current résumé facts (source of truth already captured in memory) + document its schema (the `specs` artifact).
2. **Build the tool** (`build/build.mjs`, `npm run build`, escaper unit tests) with a throwaway sample template before touching real pages.
3. **Convert one experience** (start with `01-departures.html`, the simplest content layout): copy to `src/experiences/01-departures.html`, replace factual literals with tokens, run the build, and diff the regenerated `src/01-departures.html` against the live version until only intended differences remain. Commit, redeploy, verify live.
4. **Repeat per experience** — 02→05 — one at a time, keeping the site fully working throughout. Voyage and Arcade are last (facts embedded in JS arrays and positioned props — highest token density).
5. **Add the `verify` step** and wire it into pre-commit/CI once all five are converted.
6. **Rollback:** each experience is an isolated commit; reverting one restores its hand-authored page with zero effect on the others or on `content.json`.

## Open Questions

- Do we also route the **shell's per-experience share metadata** (OG title/description per page) through `content.json`, or leave the OG block template-owned for now? (Leaning: leave for a follow-up; not required for parity.)
- Should the `verify` check run in **pre-commit**, **CI (GitHub Actions)**, or both — and does that wait until the repo is actually pushed to GitHub (currently local-only)?
- Is a **build stage in the Dockerfile** (D4 alternative) worth adopting once the flow is proven, to drop generated files from git?
