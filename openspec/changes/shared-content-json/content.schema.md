# content.json schema

Canonical, theme-neutral facts consumed by every experience. **Facts live here; voice and presentation live in the templates.** A value that appears in more than one experience is defined once here and never duplicated as a literal in a page.

## Top-level shape

```
{ _meta, profile, career[], projects[], skills[], education[] }
```

## `_meta`
- `note` (string) — human reminder of the file's purpose.
- `version` (number) — bump on a breaking shape change.

## `profile`
| field | type | required | notes |
|---|---|---|---|
| `name` | string | ✓ | |
| `positioning` | string | ✓ | the three-part title line |
| `yearsExperience` | string | ✓ | e.g. `"10+"` |
| `summary` | string | ✓ | neutral one-paragraph bio (canonical; themes may re-voice) |
| `contact.email` | string | ✓ | |
| `contact.github` / `linkedin` / `site` | string (URL) | ✓ | |

## `career[]` — ordered, oldest → newest
| field | type | required | notes |
|---|---|---|---|
| `key` | string | ✓ | **stable, unique, order-independent** (e.g. `x1`). Templates reference stops by key, never by index. |
| `company` | string | ✓ | |
| `role` | string | ✓ | |
| `location` | string | ✓ | |
| `start` | `"YYYY-MM"` | ✓ | |
| `end` | `"YYYY-MM"` \| `null` | ✓ | `null` = present |
| `current` | boolean | ✓ | exactly one stop SHALL be `true` |
| `concurrent` | boolean | — | optional; stop overlapped another (e.g. a side venture) |
| `summary` | string | ✓ | neutral one-liner |
| `metrics[]` | `{label, value}` | ✓ | atomic quantified facts — the render units for readouts / toasts / badges (may be empty) |
| `highlights[]` | string[] | ✓ | neutral factual bullets; embedded numbers/names also appear atomically in `metrics` |

## `projects[]` — ordered; featured first, then legacy
| field | type | required | notes |
|---|---|---|---|
| `key` | string | ✓ | stable, unique, order-independent |
| `name` | string | ✓ | |
| `tier` | `"featured"` \| `"legacy"` | ✓ | experiences use this, not a hard-coded list, to decide billing |
| `year` | string | ✓ | |
| `url` | string \| `null` | ✓ | **legacy projects SHALL be `null`** (dead/stale links were intentionally removed) |
| `stat` | string | ✓ | headline stat / label |
| `summary` | string | ✓ | neutral one-liner |
| `stack[]` | string[] | ✓ | tech stack |

## `skills[]`
Ordered groups: `{ group: string, items: string[] }`.

## `education[]` — ordered, newest → oldest
`{ key, institution, credential, detail: string|null, year }`.

## Rules
1. **Key stability** — every `career`, `project`, and `education` entry has a `key` that does not change when array order changes; token references resolve to keys, not positions.
2. **Facts only** — no theme-specific sentences, metaphors, or presentation values (glyphs, colors, positions) live here. Neutral `summary`/`highlights` are permitted as canonical, reusable, theme-neutral prose.
   - **Rendering policy (per design D6):** featured/current entities get full per-theme voicing in the template (neutral prose is reference only; inject atomic facts as tokens). Low-stakes entities (legacy projects, minor bullets) MAY emit the neutral `summary`/`highlights` verbatim via a token — an acceptable fallback so we don't author five voicings for small items.
3. **Single definition** — a fact used by more than one experience exists exactly once in this file.
4. **`tier` is authoritative** — featured/legacy classification comes from the data, not from page markup.
5. **Legacy URLs are null** — by prior decision; do not re-add.
