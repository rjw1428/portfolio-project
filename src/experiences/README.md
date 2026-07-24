# Experience templates

The five experience pages are **generated**. Do not edit `src/*.html` by hand — edit here and rebuild.

## Where things live

- `src/content.json` — the single source of truth for **facts** (career, projects, skills, education, contact, profile). Change a fact here and it updates in every experience.
- `src/experiences/*.html` — the **templates**. Each experience's layout, CSS, animation, and *voice* live here. Facts are referenced with `{{tokens}}`.
- `src/*.html` — the **generated, served pages**. Committed, but never hand-edited (each carries a `GENERATED` banner).

## Workflow

```bash
npm run build     # regenerate src/*.html from templates + content.json
npm run verify    # fail if any src/*.html is stale or hand-edited
npm test          # unit tests for the build (escaping, resolver, transforms)
```

Editing a **fact** → edit `src/content.json`, then `npm run build`.
Editing an experience's **look or wording** → edit its `src/experiences/*.html`, then `npm run build`.

## Token syntax

- `{{profile.contact.email}}` — dotted path into `content.json`.
- Arrays resolve by **stable key** (`{{career.x1.role}}`) or by index (`{{career.x1.metrics.0.value}}`). A primitive array like `stack` joins with `", "`.
- Auto-escaped by context: HTML text, HTML attribute, or JS string inside `<script>`.
- Transforms: `{{career.x1.company | upper}}`, `{{... | lower}}`.
- Context override / chaining: `{{... | attr}}`, `{{... | js}}`, `{{... | raw}}`, `{{... | upper | attr}}`.
- An unknown token or a value that doesn't match its context **fails the build** loudly.

## The facts-vs-voice line

Only facts that appear **verbatim** (optionally upper/lower-cased) are tokenized. Deliberately theme-voiced text stays literal in the template: abbreviations (`COMCAST · TELEMETRY`), reformatted numbers (`30 million`, prose `down 84%`), curated/re-separated stacks, and readouts using a Unicode minus. That's by design — facts single-source; voice stays plural.

Token counts today: departures 27 · blueprint 72 · telemetry 98 · voyage 36 · arcade 72.
