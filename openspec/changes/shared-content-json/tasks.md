## 1. Content model

- [ ] 1.1 Draft `src/content.json` with the factual skeleton: `profile` (name, positioning line, years-of-experience, contact.email, contact.github, contact.linkedin, contact.site).
- [ ] 1.2 Add `career` as an ordered array of stops, each with a stable key (e.g. `norfolk`, `navsea`, `ssr`, `accenture`, `x1-telemetry`, `fort-robotics`, `xumo`, `x1`) plus company, role, location, startDate, endDate, and a `facts` object for quantified values (30M devices, −80% vulns, +200% delivery, 84% issue reduction, Java 8→25, etc.).
- [ ] 1.3 Add `projects` as an ordered array (featured then legacy), each with a stable key, name, year, `stack` (array), `url` (nullable), `stat` (headline), and `tier: "featured" | "legacy"`. Include myInkwell, SpendWatch, taskr, MCP server, Rehuman, Workflow Manager, and the five legacy items (SSR, Alpine Knives, Brody's, self-hosted infra, Burwell).
- [ ] 1.4 Add `skills` grouped by category and `education` as an ordered array (JHU 2022, Virginia Tech 2012, TU Darmstadt 2016).
- [ ] 1.5 Ensure legacy projects carry no `url` (per the earlier decision to delink dead URLs) and that every entity has a stable key that is order-independent.
- [ ] 1.6 Write `openspec/changes/shared-content-json/content.schema.md` (or a JSON Schema file) documenting entities, required fields, key stability rule, and the featured/legacy classification — the contract the spec requires.

## 2. Build tool

- [ ] 2.1 Create root `package.json` (or extend if one exists) exposing `npm run build` and `npm run verify`, with no runtime dependencies.
- [ ] 2.2 Implement `build/build.mjs` (Node ≥18): read `content.json` + `src/experiences/*.html`, resolve `{{dotted.key}}` tokens, write generated pages to `src/*.html` with a `<!-- GENERATED … do not edit -->` banner.
- [ ] 2.3 Implement context-aware escaping: detect whether a token sits in HTML text, an HTML attribute, or a JS string literal, and escape accordingly.
- [ ] 2.4 Fail the build loudly on an unknown token (no matching key) and on any unresolved `{{…}}` remaining in output; report the offending token and file.
- [ ] 2.5 Implement `build/verify.mjs`: rebuild in memory and diff against committed `src/*.html`, exiting non-zero on any difference (catches stale or hand-edited output).
- [ ] 2.6 Add unit tests for the escaper against adversarial values (apostrophe, `&`, `<`, `>`, quotes) in all three contexts; run with `node --test`.

## 3. Migrate experiences (one at a time, keep the site live)

- [ ] 3.1 Create `src/experiences/` and move `01-departures.html` there; replace factual literals with tokens (leave voiced prose and presentation in place, tokenizing only embedded facts).
- [ ] 3.2 Run the build; diff the regenerated `src/01-departures.html` against the current committed page until only intended (fact-injection) differences remain. Verify locally, commit.
- [ ] 3.3 Migrate `02-blueprint.html` the same way (title-block fields, BOM, revision table); build, diff, verify, commit.
- [ ] 3.4 Migrate `03-telemetry.html` (event readouts, panel stats, channel matrix); build, diff, verify, commit.
- [ ] 3.5 Migrate `04-voyage.html` — facts embedded in the JS `stops` array and flyby data; build, diff, verify the sticky trajectory still pins, commit.
- [ ] 3.6 Migrate `05-arcade.html` — facts in the JS zone/`EVENTS` arrays and cartridge data; build, diff, verify level-select deep links, commit.

## 4. Verification & guardrails

- [ ] 4.1 Run the full `npm run build` and confirm no page contains a stray `{{` marker (smoke grep in the build or a test).
- [ ] 4.2 Headless-check all five generated pages: no console errors, reduced-motion fallbacks intact, self-contained (no network fetch for content), facts present in no-JS HTML.
- [ ] 4.3 Change a single fact in `content.json` (e.g. a stat value), rebuild, and confirm it propagates to every experience that references it with no page edits — the acceptance test for parity.
- [ ] 4.4 Wire `npm run verify` into a pre-commit hook so stale/hand-edited generated pages are caught before commit (CI via GitHub Actions deferred until the repo is pushed).

## 5. Deploy & document

- [ ] 5.1 Rebuild, commit the generated `src/*.html` plus templates, tool, and `content.json`; deploy with `docker compose up -d --build` and verify www.ryanwilk.com serves the generated pages unchanged.
- [ ] 5.2 Add a short `src/experiences/README.md` (or repo README note): edit `content.json` for facts, edit `experiences/*.html` for voice/layout, run `npm run build`, never hand-edit `src/*.html`.
