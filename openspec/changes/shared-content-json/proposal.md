## Why

The five experience pages (`src/01-departures.html` … `05-arcade.html`) each hard-code the same résumé facts — 8 career stops, 6 featured + 5 legacy projects, skills, education, contact — re-voiced per theme. There is no source of truth: any factual edit (a job title, a project's stack, a new role) must be made in five places, and content parity is a manual guarantee enforced by review, not by structure. This is the one real coupling gap in an otherwise cleanly independent micro-frontend architecture, and it makes every future content update five times the work and five times the risk of drift.

## What Changes

- Introduce a single `src/content.json` holding the canonical, theme-neutral facts: profile/positioning, career timeline, projects (featured + legacy), skills, education, and contact.
- Each experience consumes that data and renders it in its own visual language — the *facts* are shared; the *presentation, voice, and structure* stay owned by each page.
- Establish a documented content schema (shape, required fields, ordering rules) so all five experiences agree on what a "career stop" or "project" contains.
- Preserve the properties that make the current design good: each experience stays independently deployable and rewritable, and the shell's thin composition contract is unchanged.
- **Decision deferred to design** (materially shapes the spec): whether experiences read `content.json` at **runtime** (fetch on load — simplest single source, but breaks the current "self-contained single file, works via `file://`" property and adds a load dependency) vs. at **build/deploy time** (inject into each page — keeps self-contained output but adds a build step the deploy currently doesn't have). The spec will describe the content contract independent of this; design will choose the delivery mechanism.

## Capabilities

### New Capabilities
- `shared-content`: The canonical content model consumed by all experiences — the JSON schema (entities, fields, ordering), the rule that experiences render from it rather than hard-coding facts, and how content parity is guaranteed structurally instead of by discipline.

### Modified Capabilities
<!-- None — openspec/specs/ is currently empty; no existing spec-level behavior changes. -->

## Impact

- **New file:** `src/content.json` (canonical facts) and its documented schema.
- **Five experience pages:** each refactored to source facts from the shared model instead of inline literals — the largest surface, done per-page to preserve each theme's rendering.
- **Delivery mechanism:** depending on the design decision, either the Express server / `file://` loading path (runtime fetch) or the Dockerfile/deploy flow (build-time injection, which would add the build step the current `node:22` image deliberately omits).
- **Shell (`index.html`):** unaffected by the content model, but a candidate future consumer (e.g. per-experience share metadata).
- **Authoring workflow:** future content edits become a single-file change to `content.json` instead of five coordinated page edits — the primary payoff.
