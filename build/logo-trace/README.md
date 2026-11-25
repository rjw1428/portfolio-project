# Logo tracer (07-light)

`src/experiences/07-light.html` draws each logo with strands of light. The
strands follow **outline loops** stored in the template's `var LOGOS = {...}`
block. Those loops are produced here, offline, in a browser.

- `sources/` — the logo files (SVG/PNG) for employers and schools.
- `trace.html` — rasterises every entry in its `SHAPES` list (a source file, or a
  small canvas drawing for the project/skills/contact glyphs), splits it by colour,
  follows each colour region's edge, smooths and simplifies it.
- `logos.json` — the last traced output (what is embedded in the template).

## Re-tracing (new logo, changed logo)

1. Drop the file in `sources/` and add `{ key:'name', src:'sources/name.svg' }` to
   `SHAPES` in `trace.html` (use `drop:` to ignore a background colour).
2. `cd build/logo-trace && python3 -m http.server 8791`, open
   `http://127.0.0.1:8791/trace.html`. The page previews every trace.
3. In the console: `copy(JSON.stringify(RESULT))`, save it as `logos.json`, and
   replace the `var LOGOS=...;` line in the template with it.
4. Point a section at it: `data-logo="name"`. `data-cols` recolours the logo's
   colour regions in order (see the `c` array for that logo); without it the
   strands are tinted left-to-right across `data-pal`.
   Optional `data-badge="#colour"` puts the logo inside a filled disc of that colour with
   a strand-wound rim (used for myInkwell); the rim takes the colour after the logo's last
   region in `data-cols`. The disc is added by the engine at runtime — the traced data is
   unchanged.
5. `npm run build`.

Output format per logo: `{ w, h, c:[region colours], l:[[regionIndex, x,y, x,y, ...], ...] }`
in a 1000-unit box; each loop is closed and wound with the ink on its right.
