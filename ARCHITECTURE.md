# Architecture

> Note: counts in prose below ("five experiences") predate the sixth experience
> (06-gridiron, added 2026-07). The tables are current.

This document explains how the portfolio site is put together and gives step-by-step
playbooks for the common content changes: **editing a bullet, adding a bullet, adding a
job, adding a project, and adding a whole new experience.** It is written to be read by a
human and to be followed by an LLM making those changes. Read the **Mental model** and
**Invariants** sections before editing anything.

---

## 1. Mental model

The site is one entry page that, on load, drops the visitor into **one of five self-contained
"experiences"** chosen at random. Each experience is the same résumé told in a completely
different visual metaphor. There is a sixth thing — the shell — that picks and frames them.

The five experiences and their theme:

| # | File | Name | Metaphor |
|---|------|------|----------|
| 01 | `public/01-departures.html` | Departures | Split-flap airport/train departures board |
| 02 | `public/02-blueprint.html` | Blueprint | Engineering drawing that assembles as you scroll |
| 03 | `public/03-telemetry.html` | Telemetry | A live instrument monitoring its own reader |
| 04 | `public/04-voyage.html` | Voyage | Deep-space trajectory; jobs = gravity assists, projects = planets, skills = constellations |
| 05 | `public/05-arcade.html` | Arcade | 16-bit platformer; jobs = level zones, projects = cartridges |
| 06 | `public/06-gridiron.html` | Gridiron | Night-game football; career = one scroll-driven drive down the field, projects = playbook diagrams, skills = depth chart |

Two facts drive everything below:

1. **Facts are single-sourced; voice and layout are not.** Every résumé fact (company,
   title, dates, metrics, project stack, URLs, contact, education) lives once in
   `src/content.json`. But each experience *re-voices* those facts in its own tone and
   renders them in bespoke markup (split-flap cells, an SVG flight path with hand-tuned
   coordinates, a scroll-driven platformer with per-zone pixel positions). **There is no
   generic "loop over the career list."** Presentation is unique per page and hand-built.

2. **`content.json` guarantees the facts match across all five; it does not render anything.**
   Changing a fact in `content.json` keeps the five pages from *disagreeing*, but the visible
   sentence a reader sees is authored inside each experience. So most content changes touch
   **both** `content.json` **and** each experience that shows that content.

If you internalize nothing else: **`content.json` = the truth; each experience = a hand-drawn
retelling of that truth.**

---

## 2. Repository map

```
src/                    ← SOURCE ONLY — never served.
  content.json          ← CANONICAL FACTS. The one source of truth. Edit here first.
  experiences/          ← TEMPLATES (tokenized source), one per experience.
    01-departures.html  ← builds → public/01-departures.html (same for 02–06)

public/                 ← the served docroot (committed).
  index.html            ← the shell: random-assigns an experience, renders the switcher pill
  01-departures.html    ← served experience page  ┐
  02-blueprint.html     ← served experience page  │ These are what visitors load.
  03-telemetry.html     ← served experience page  │ ALL SIX are GENERATED from
  04-voyage.html        ← served experience page  │ src/experiences/ — see §4/§5.
  05-arcade.html        ← served experience page  │ Never hand-edit them.
  06-gridiron.html      ← served experience page  ┘
  gallery.html          ← dev index linking all experiences directly (not part of the shell)
  404.html, sitemap.xml, robots.txt, favicon.svg, og-image.png
                        ← hand-authored/static files: edit these in place, no build needed.

build/
  lib.mjs               ← zero-dependency build library: token resolver + escapers + orchestration
  build.mjs             ← `npm run build` — renders every template in experiences/ → public/
  verify.mjs            ← `npm run verify` — fails if a generated public/*.html is stale/hand-edited
  verify-one.mjs        ← verify a single page in memory without writing (dev helper)
  lib.test.mjs          ← `npm test` — unit tests for the escapers and resolver

server/                 ← its own CommonJS package (Express 5). Serves public/ statically.
  index.js              ← static file server + /api/metrics; listens on PORT (default 3201)
Dockerfile              ← copies public/ + server/, installs express, runs the server. No build step.
docker-compose.yml      ← builds the image, maps 3201:3201, PORT=3201
openspec/               ← the spec/design history for the content-model migration
  changes/shared-content-json/design.md   ← the authoritative rationale for §4 (worth reading)
```

---

## 3. Runtime: how a visit works

- The shell (`index.html`) holds a JS array `EXPERIENCES` (id, name, file, accent color). On
  load it either honors a `?exp=<id>` deep link or picks one at random, runs a brief "boot
  roulette" animation, then loads that experience file into an `<iframe>`. A switcher pill
  lets the visitor shuffle or step through the five. Nothing is persisted.
- Each experience is a **single self-contained HTML file** — inline CSS and JS, no external
  dependencies, no shared runtime, openable directly via `file://`. This is a hard constraint
  (see Invariants).
- The server just serves `public/` as static files with `Cache-Control: no-cache` on HTML.
  `src/` (content.json, templates) is never served.
- Deploy is `docker compose up -d --build`. The Dockerfile copies the **already-generated**
  `public/` — there is no build step in the image — so generated pages must be built and
  committed *before* deploy (see §4).

---

## 4. The content model (build pipeline)

Source of truth is `src/content.json`. Pages that have been *migrated* are generated from a
template:

```
src/content.json  +  src/experiences/NN.html  ──(npm run build)──►  public/NN.html (committed)
   (facts)              (template w/ {{tokens}})                        (served output)
```

### Token language

Inside a template, `{{dotted.path}}` marks an injection point. At build time the resolver
walks `content.json` by that path and substitutes the **literal value**, escaped for its
surrounding context.

- **Object paths:** `{{profile.contact.email}}` → walks properties.
- **Array by stable key:** arrays of objects each carry a `key`. A non-numeric segment
  matches that key: `{{career.x1.role}}` finds the career entry whose `key` is `"x1"`.
  (A numeric segment like `career.7` indexes positionally, but **prefer keys** — they
  survive reordering.)
- **Array of primitives joins with `", "`:** `{{projects.myinkwell.stack}}` →
  `"Angular, Python FastAPI, AWS, …"`.
- **Filters:** `{{profile.contact.email | upper}}` (case transforms: `upper`, `lower`) and
  explicit context overrides `| html | attr | js | raw`. Context is auto-detected (HTML text
  vs. attribute value vs. inside `<script>`) and escaped accordingly; the override is only for
  the rare case the detector can't see (e.g. a value built into a JS string).
- The template — not the JSON — owns any padding/truncation for fixed-width displays
  (split-flap columns, board widths).

### Which facts get tokenized vs. hand-voiced

Per the design (`openspec/changes/shared-content-json/design.md`), `content.json` holds three
tiers, and templates decide how much to inject:

1. **Atomic facts** (dates, `stack[]`, `metrics` values, URLs, names, years) — always injected
   as tokens so they can never drift.
2. **Neutral `summary` / `highlights` prose** — reference text. **Featured/current** content is
   re-voiced by hand in each template (atomic facts still injected as tokens); **low-stakes**
   content (legacy projects, minor bullets) MAY render the neutral prose verbatim via a token
   so we don't write five voicings of "Alpine Knives — an e-commerce platform."
3. Theme voice never lives in `content.json`.

> **Consequence for editing:** changing a `highlights` string in `content.json` updates the
> *canonical* fact and any place that renders it verbatim, but the **re-voiced** sentence a
> reader sees in a featured experience is separate text inside that experience — you must edit
> it there too.

### Build & verify

```bash
npm run build     # renders experiences/*.html → public/*.html
npm run verify    # rebuilds in memory, fails if any committed public/*.html differs (stale/hand-edited)
npm test          # escaper + resolver unit tests
node build/verify-one.mjs 01-departures.html   # check one page without writing
```

Every generated file starts with a banner:
`<!-- GENERATED from experiences/NN + content.json — do not edit; run npm run build -->`.
The build **fails hard** on an unknown/misspelled token or an unterminated `{{`.

---

## 5. Migration status — READ THIS BEFORE EDITING A PAGE

The content-model migration is **partial and ongoing**. Not every experience is a template
yet. Check `src/experiences/` for the file:

| Experience | Template exists? | So you edit… |
|------------|------------------|--------------|
| 01-departures | ✅ `src/experiences/01-departures.html` | the **template**, then `npm run build` |
| 02-blueprint | ✅ `src/experiences/02-blueprint.html` | the **template**, then `npm run build` |
| 03-telemetry | ✅ `src/experiences/03-telemetry.html` | the **template**, then `npm run build` |
| 04-voyage | ✅ `src/experiences/04-voyage.html` | the **template**, then `npm run build` |
| 05-arcade | ✅ `src/experiences/05-arcade.html` | the **template**, then `npm run build` |
| 06-gridiron | ✅ `src/experiences/06-gridiron.html` | the **template**, then `npm run build` |

**Rule:** if `src/experiences/<file>` exists, that page is generated — never hand-edit
`public/<file>` (the banner warns you); edit the template and rebuild. If it does **not** exist,
the page in `public/` is hand-authored and you edit it directly. When in doubt, `ls src/experiences/`
and check for the `GENERATED` banner at the top of the `public/` file.

Even in the migrated page (01), note that only atomic facts (project names/URLs, education,
contact) are tokenized so far; the career bullets are still authored prose. Don't assume a
token exists for something — search the template.

---

## 6. Where each experience renders its career stops

There is no shared list, so to add/edit a job you locate the theme-specific structure in each
file. Anchors to search for:

- **01 Departures** — split-flap board rows (`.flap-line`, the plate/flap markup). Career
  stops are board rows.
- **02 Blueprint** — the `#career` sheet, "Assembly sequence" (`career-h`); each stop is a
  drawing glyph that reveals on scroll (search the company name).
- **03 Telemetry** — event cards / trace (`#ev-card`, `.panel`); the career is a signal trace,
  each stop an event.
- **04 Voyage** — the `STOPS`, `NAMES`, `YEARS`, `RADII`, `VF`, `VV` JS arrays (near the
  bottom `<script>`) drive planet placement on the SVG flight path, and each stop has an
  `.assist-card` `<article data-stop="N">` in the markup. Adding a stop means extending the
  arrays **and** adding a card **and** possibly re-tuning the SVG path `d=` fractions.
- **05 Arcade** — level "zones" with per-zone pixel positions, plus a no-JS **"Full career
  content: source of truth"** block (~line 990) that must also be kept accurate.
- **06 Gridiron** — each stop is an `<article class="play">` in `.plays-col` with
  `data-from`/`data-to` yardage (yards from own goal, 0–100) driving the scroll engine.
  Adding a stop means adding a card **and** re-planning the drive's yardage so the gains
  still sum own-20 → opp-5 (see the `data-from`/`data-to` chain); the field SVG, scorebug,
  and mini-field all derive from those attributes. Down/quarter/clock live in `data-dd`,
  `data-q`, `data-clock`.

Each of these is hand-tuned (coordinates, glyph counts, column widths). Expect to adjust
layout, not just paste a row.

---

## 7. Playbooks

For every playbook: **start in `content.json`**, then propagate to each experience, then
`npm run build && npm run verify` (build/verify are no-ops for pages without a template but
run them anyway). Preview locally by serving `public/` (e.g. `PORT=3202 node server/index.js`)
and opening the page, or open the file directly.

### A. Edit an existing job bullet or metric

1. In `content.json`, find the `career` entry by `key` and edit the specific `highlights[]`
   string and/or `metrics[]` `{label,value}`.
2. In **each experience**, find where that job is rendered (§6) and update the **re-voiced**
   copy of that bullet/metric to match the new fact. The JSON edit does not change the visible
   prose in a featured experience — the wording there is theme-owned.
3. Preserve each theme's voice — reword, don't paste the neutral sentence. Keep the *fact*
   (numbers, names) identical to `content.json`.
4. If the experience has a template, edit the template; then `npm run build`. Run `npm run verify`.

### B. Add a bullet to an existing job

1. Add the new string to that career entry's `highlights[]` in `content.json`.
2. Decide it's worth showing (each experience curates — not every bullet appears in every
   theme). Where you want it, add a re-voiced line in that experience's structure for that job.
3. Watch fixed-size layouts: a split-flap board row, a level zone, or a planet card may have a
   bullet budget — adding one can overflow. Adjust the theme's layout as needed.
4. Build (if templated) + verify.

### C. Add a new job (career entry)

This is the highest-touch change because every experience places career stops by hand.

1. **`content.json`** — add a new object to `career[]` in chronological position with a unique
   `key` and all fields: `company, role, location, start (YYYY-MM), end (YYYY-MM or null),
   current (bool), summary, metrics[], highlights[]`. Match the existing shape exactly. Set the
   previous "current" job's `current:false` and `end` date if this new one is now current.
2. **Each experience** — add the stop to its bespoke structure (§6). Concretely, expect to:
   - **Departures:** add a board row.
   - **Blueprint:** add a glyph to the assembly sequence and its reveal wiring.
   - **Telemetry:** add an event to the trace/cards.
   - **Voyage:** add an entry to `STOPS`/`NAMES`/`YEARS`/`RADII`/`VF`/`VV`, add an
     `.assist-card` article, and re-check the SVG path fractions and label spacing so planets
     don't crowd (labels are hand-tuned — see the label sizing/offset code).
   - **Arcade:** add a level zone (with pixel positions) **and** update the no-JS "source of
     truth" career block.
3. Update counts and copy that state a number of stops (e.g. voyage's "eight gravity assists"
   in the `<meta>`/hero, arcade level counts).
4. Build (templated pages) + verify. Preview **all five** — a new stop is exactly the kind of
   change that breaks one theme's spacing.

### D. Add a project

1. **`content.json`** — add to `projects[]` with a unique `key` and: `name, tier
   ("featured"|"legacy"), year, url (or null), stat, summary, stack[]`.
2. **Featured** projects usually get bespoke treatment in each experience (voyage renders
   featured projects as planets with orbiting-moon tech labels; other themes have their own
   project surfaces). **Legacy** projects are typically listed more plainly and may render the
   neutral `summary` verbatim. Add the project where each experience surfaces projects.
3. If featured in Voyage, that means a new planet + its moon (`stack`) labels + layout tuning.
4. Build + verify + preview.

### E. Add a new experience (a sixth theme)

1. **Create the page.** Author a new self-contained HTML file `public/06-<name>.html` — inline
   CSS/JS, no external deps, `file://`-openable, content present in markup for SEO/no-JS.
   Reuse an existing experience as a starting point for the `<head>`/meta/accessibility
   conventions. Render career/projects/skills/education in the new metaphor, keeping every
   **fact** consistent with `content.json`.
   - Optionally author it as a **template** from the start: put tokens in
     `src/experiences/06-<name>.html`, use `{{...}}` for atomic facts, and `npm run build`
     to emit `public/06-<name>.html`. This is the preferred direction for new work.
2. **Register it in the shell** (`public/index.html`): add an entry to the `EXPERIENCES` array
   `{ id, name, file: '06-<name>.html', color }`, and add a matching
   `body[data-exp="<id>"] { --accent: <color>; }` rule so the switcher pill themes correctly.
3. **Add it to `gallery.html`** as another `a.card` (and add a `.c6`/`.c7` accent class).
4. **SEO plumbing:** add the page to `sitemap.xml`. Give it its own OG/Twitter meta.
5. Build + verify + preview via the shell (shuffle until it appears, or `?exp=<id>`).

---

## 8. Invariants (do not break these)

- **`content.json` is the single source of truth for facts.** Any fact shown on a page must
  match it. Fix a wrong fact there first, then propagate to the experiences.
- **Never hand-edit a generated `public/*.html`** (one with the `GENERATED` banner / a template in
  `src/experiences/`). Edit the template and rebuild; `npm run verify` enforces this.
- **Every experience stays self-contained:** inline CSS/JS only, no external requests, no shared
  runtime, openable via `file://`. No build-time bundler for the pages themselves.
- **Facts single-sourced, voice/layout theme-owned.** Never move theme prose or presentation
  data (glyphs, path coordinates, zone positions, accent colors) into `content.json`.
- **The deploy image has no build step** — it serves committed `public/`. Always
  `npm run build && npm run verify` and commit the regenerated pages before deploying.
- **Preserve SEO/no-JS:** content lives in the HTML, not fetched at runtime. Arcade keeps an
  explicit no-JS "source of truth" block — keep it in sync.
- **A content change should stay a small edit to `content.json` plus deliberate per-theme
  retellings** — not five silently diverging copies. If you find yourself changing a fact in
  one page only, stop and update `content.json` and the others.

---

## 9. Quick command reference

```bash
npm run build     # experiences/*.html → public/*.html
npm run verify    # fail if committed output is stale/hand-edited
npm test          # escaper/resolver unit tests
node build/verify-one.mjs <file.html>          # check one page without writing

# local preview (server serves public/ statically)
PORT=3202 node server/index.js                 # http://localhost:3202/04-voyage.html
                                               # (or just open public/<file>.html via file://)

# deploy
docker compose up -d --build                   # builds image from committed public/, serves on :3201
```
