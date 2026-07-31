// Zero-dependency build library for the shared-content model.
// Facts live in src/content.json; templates in src/experiences/*.html reference
// them with {{dotted.key}} tokens. This module resolves + escapes tokens and
// emits self-contained pages into public/. See openspec/changes/shared-content-json.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const PATHS = {
  content: join(ROOT, 'src', 'content.json'),
  experiences: join(ROOT, 'src', 'experiences'),
  out: join(ROOT, 'public'),
};

// ---------- escapers (one per injection context) ----------

export function htmlEsc(v) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function attrEsc(v) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Safe to drop inside a JS string literal of any delimiter (" ' `),
// and neutralizes </script> by escaping every '<'.
export function jsEsc(v) {
  return String(v)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/`/g, '\\`')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/</g, '\\x3C')
    .replace(/\x{2028}/g, "\\u2028")
    .replace(/\x{2029}/g, "\\u2029");
}

function escapeFor(value, ctx) {
  if (ctx === 'raw') return String(value);
  if (ctx === 'js') return jsEsc(value);
  if (ctx === 'attr') return attrEsc(value);
  return htmlEsc(value);
}

const CONTEXTS = new Set(['html', 'attr', 'js', 'raw']);

// Presentation transforms a template may request, e.g. {{career.x1.company | upper}}.
// The template still owns padding/truncation; these only change case.
export function applyTransform(value, name) {
  if (name === 'upper') return String(value).toUpperCase();
  if (name === 'lower') return String(value).toLowerCase();
  throw new Error(`unknown filter "${name}"`);
}

// ---------- token path resolver ----------
// Segments walk objects by property. In an array, a numeric segment indexes it;
// a non-numeric segment matches an element by its stable `key`. A path that
// resolves to an array of primitives is joined with ", " (handy for stacks).

export function resolvePath(content, path) {
  const segs = path.split('.').map((s) => s.trim()).filter(Boolean);
  let cur = content;
  for (const seg of segs) {
    if (cur == null) throw new Error(`null before segment "${seg}"`);
    if (Array.isArray(cur)) {
      if (/^\d+$/.test(seg)) {
        cur = cur[Number(seg)];
      } else if (cur.length && cur[0] && typeof cur[0] === 'object' && 'key' in cur[0]) {
        cur = cur.find((el) => el && el.key === seg);
      } else {
        throw new Error(`cannot index array by "${seg}"`);
      }
      if (cur === undefined) throw new Error(`no array element for "${seg}"`);
    } else if (typeof cur === 'object') {
      if (!(seg in cur)) throw new Error(`no property "${seg}"`);
      cur = cur[seg];
    } else {
      throw new Error(`cannot descend into primitive at "${seg}"`);
    }
  }
  if (Array.isArray(cur)) {
    if (cur.every((x) => typeof x === 'string' || typeof x === 'number')) return cur.join(', ');
    throw new Error('resolves to a non-primitive array');
  }
  if (cur !== null && typeof cur === 'object') throw new Error('resolves to an object, not a value');
  return cur == null ? '' : String(cur);
}

// ---------- template renderer with context detection ----------
// Single pass tracks whether each {{token}} sits in HTML text, an HTML
// attribute value, or inside a <script> block, and escapes accordingly.
// An explicit `{{ path | js }}` filter overrides the detected context.

export function renderTemplate(src, content, name) {
  const errors = [];
  let out = '';
  let i = 0;
  const n = src.length;
  let mode = 'text'; // 'text' | 'tag' | 'script'
  let quote = null; // active attribute quote while in 'tag'
  let pendingScript = false; // the tag being read is <script ...>
  let malformed = false; // saw an unterminated {{ in the template

  while (i < n) {
    if (src[i] === '{' && src[i + 1] === '{') {
      const end = src.indexOf('}}', i + 2);
      if (end !== -1) {
        const inner = src.slice(i + 2, end).trim();
        const parts = inner.split('|').map((s) => s.trim());
        const path = parts[0];
        const filters = parts.slice(1);
        const detected = mode === 'script' ? 'js' : mode === 'tag' && quote ? 'attr' : 'html';
        try {
          let value = resolvePath(content, path);
          let ctx = detected;
          for (const f of filters) {
            if (CONTEXTS.has(f)) ctx = f;
            else value = applyTransform(value, f); // throws on unknown filter
          }
          out += escapeFor(value, ctx);
        } catch (e) {
          errors.push(`${path} (${e.message})`);
        }
        i = end + 2;
        continue;
      }
      malformed = true; // unterminated {{ — flag it, then fall through as text
    }

    const c = src[i];
    if (mode === 'text') {
      if (c === '<') {
        mode = 'tag';
        quote = null;
        pendingScript = /^<script\b/i.test(src.slice(i, i + 8));
      }
    } else if (mode === 'tag') {
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") {
        quote = c;
      } else if (c === '>') {
        mode = pendingScript ? 'script' : 'text';
        pendingScript = false;
      }
    } else if (mode === 'script') {
      if (c === '<' && /^<\/script/i.test(src.slice(i, i + 9))) mode = 'text';
    }
    out += c;
    i += 1;
  }

  if (errors.length) {
    const err = new Error(`Unknown token(s) in ${name}:\n  - ${[...new Set(errors)].join('\n  - ')}`);
    err.tokens = errors;
    throw err;
  }
  if (malformed) throw new Error(`Unterminated {{ marker in ${name}`);
  return addBanner(out, name);
}

function addBanner(html, name) {
  const banner = `<!-- GENERATED from experiences/${name} + content.json — do not edit; run \`npm run build\` -->`;
  const m = html.match(/^\s*<!doctype html>/i);
  if (m) return html.slice(0, m[0].length) + '\n' + banner + html.slice(m[0].length);
  return banner + '\n' + html;
}

// ---------- orchestration ----------

export function readContent() {
  return JSON.parse(readFileSync(PATHS.content, 'utf8'));
}

export function listTemplates() {
  if (!existsSync(PATHS.experiences)) return [];
  return readdirSync(PATHS.experiences)
    .filter((f) => f.endsWith('.html'))
    .sort();
}

// Render every template in memory; returns [{ name, html }].
export function renderAll() {
  const content = readContent();
  return listTemplates().map((name) => ({
    name,
    html: renderTemplate(readFileSync(join(PATHS.experiences, name), 'utf8'), content, name),
  }));
}

export function buildAll() {
  const rendered = renderAll();
  for (const { name, html } of rendered) writeFileSync(join(PATHS.out, name), html);
  return rendered.map((r) => r.name);
}

// Returns a list of problems (empty = clean).
export function verifyAll() {
  const problems = [];
  for (const { name, html } of renderAll()) {
    const target = join(PATHS.out, name);
    if (!existsSync(target)) {
      problems.push(`${name}: generated output missing (run \`npm run build\`)`);
    } else if (readFileSync(target, 'utf8') !== html) {
      problems.push(`${name}: on-disk output differs from rebuild (stale or hand-edited)`);
    }
  }
  return problems;
}
