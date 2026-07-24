# PostHog post-wizard report

The wizard has completed a PostHog integration for this Node.js Express portfolio server. The `posthog-node` SDK was installed in `server/`, environment variables were written to `server/.env`, and `server/index.js` was updated to initialize a singleton PostHog client, capture three meaningful server-side events via a `res.on('finish')` hook and explicit handlers, add exception tracking via the built-in Express error handler helper, and flush gracefully on SIGINT/SIGTERM.

| Event name | Description | File |
|---|---|---|
| `experience_served` | Fired when the server sends a portfolio experience page to a visitor, capturing which themed experience was viewed. | `server/index.js` |
| `gallery_viewed` | Fired when the gallery page (which lists all five experiences) is served — top of the experience-selection funnel. | `server/index.js` |
| `page_not_found` | Fired when the server returns a 404, recording the requested path so broken links can be identified. | `server/index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on visitor behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/527110/dashboard/1901422)
- **Insight** — [Portfolio experience serves (wizard)](https://us.posthog.com/project/527110/insights/45n1Jfy1) — total experience page serves over time
- **Insight** — [Experience serves by type (wizard)](https://us.posthog.com/project/527110/insights/RR7zYpRd) — which of the five experiences is served most, broken down by name
- **Insight** — [404 errors over time (wizard)](https://us.posthog.com/project/527110/insights/8pJ2iV6K) — 404s broken down by path so broken links are visible

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
