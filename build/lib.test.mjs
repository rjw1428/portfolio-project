import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlEsc, attrEsc, jsEsc, resolvePath, renderTemplate } from './lib.mjs';

// ---------- escapers ----------

test('htmlEsc escapes &, <, > in order', () => {
  assert.equal(htmlEsc('a & b < c > d'), 'a &amp; b &lt; c &gt; d');
  assert.equal(htmlEsc('Java 8 → 25 & <b>'), 'Java 8 → 25 &amp; &lt;b&gt;');
});

test('attrEsc escapes both quote styles', () => {
  assert.equal(attrEsc(`he said "hi" it's 5>3 & <`), 'he said &quot;hi&quot; it&#39;s 5&gt;3 &amp; &lt;');
});

test('jsEsc is safe inside any string delimiter and neutralizes </script>', () => {
  assert.equal(jsEsc(`a"b'c\`d`), `a\\"b\\'c\\\`d`);
  assert.equal(jsEsc('back\\slash'), 'back\\\\slash');
  // the critical XSS: a value containing </script> must not close the block
  assert.ok(!jsEsc('x</script>y').includes('</script>'));
  assert.equal(jsEsc('line1\nline2'), 'line1\\nline2');
});

// ---------- resolver ----------

const content = {
  profile: { name: 'Ryan Wilk', contact: { email: 'a@b.com', site: 'https://x.dev' } },
  career: [
    { key: 'x1', role: 'Principal', metrics: [{ label: 'vulns', value: '-80%' }], highlights: ['did a thing'] },
    { key: 'navsea', role: 'Tech V', metrics: [] },
  ],
  projects: [{ key: 'ink', name: 'myInkwell', stack: ['Angular', 'FastAPI', 'AWS'], url: null }],
};

test('resolves object properties and array-by-key', () => {
  assert.equal(resolvePath(content, 'profile.name'), 'Ryan Wilk');
  assert.equal(resolvePath(content, 'profile.contact.email'), 'a@b.com');
  assert.equal(resolvePath(content, 'career.x1.role'), 'Principal');
  assert.equal(resolvePath(content, 'career.navsea.role'), 'Tech V');
});

test('resolves array-by-index and nested metric values', () => {
  assert.equal(resolvePath(content, 'career.x1.metrics.0.value'), '-80%');
  assert.equal(resolvePath(content, 'career.x1.highlights.0'), 'did a thing');
});

test('joins primitive arrays and renders null as empty', () => {
  assert.equal(resolvePath(content, 'projects.ink.stack'), 'Angular, FastAPI, AWS');
  assert.equal(resolvePath(content, 'projects.ink.url'), '');
});

test('unknown paths throw', () => {
  assert.throws(() => resolvePath(content, 'profile.nope'));
  assert.throws(() => resolvePath(content, 'career.ghost.role'));
  assert.throws(() => resolvePath(content, 'projects.ink.stack.99'));
  assert.throws(() => resolvePath(content, 'career.x1.metrics')); // array of objects
});

// ---------- renderer / context detection ----------

test('detects HTML text, attribute, and JS-string contexts', () => {
  const c = { profile: { name: 'Tom & "Jerry"', contact: { site: 'https://x?a=1&b=2' } } };
  const html = renderTemplate(
    `<!doctype html><a href="{{profile.contact.site}}">{{profile.name}}</a><script>var n="{{profile.name}}";</script>`,
    c, 'ctx.html');
  assert.ok(html.includes('href="https://x?a=1&amp;b=2"'), 'attribute escaped');
  assert.ok(html.includes('>Tom &amp; "Jerry"</a>'), 'html text escaped (quotes stay literal in text)');
  assert.ok(html.includes('var n="Tom & \\"Jerry\\"";'), 'js string escaped');
});

test('explicit filter overrides detected context', () => {
  const c = { x: '<b>' };
  assert.ok(renderTemplate('<!doctype html>{{x | raw}}', c, 't').includes('<b>'));
  assert.ok(renderTemplate('<!doctype html>{{x | attr}}', c, 't').includes('&lt;b&gt;'));
});

test('unknown token fails the build with the offending token', () => {
  assert.throws(
    () => renderTemplate('<!doctype html>{{profile.missing}}', { profile: {} }, 'bad.html'),
    /Unknown token.*profile\.missing/s);
});

test('generated output carries the banner after the doctype', () => {
  const out = renderTemplate('<!doctype html>\n<title>x</title>', {}, '01.html');
  assert.match(out, /^<!doctype html>\n<!-- GENERATED from experiences\/01\.html/);
});

test('a value containing {{ does not create a false residual marker', () => {
  // resolved values are appended, not re-scanned, so this must succeed
  const out = renderTemplate('<!doctype html><p>{{v}}</p>', { v: 'use {{ like this }}' }, 't');
  assert.ok(out.includes('use {{ like this }}'));
});

// ---------- transforms (Option B) ----------

test('upper/lower transforms apply before escaping', () => {
  const c = { career: [{ key: 'x1', company: 'Comcast' }], x: 'A&B' };
  assert.ok(renderTemplate('<!doctype html>{{career.x1.company | upper}}', c, 't').endsWith('-->COMCAST'));
  assert.ok(renderTemplate('<!doctype html>{{career.x1.company | lower}}', c, 't').endsWith('-->comcast'));
  // transform runs, THEN html escape
  assert.ok(renderTemplate('<!doctype html>{{x | upper}}', c, 't').includes('A&amp;B'));
});

test('transform chains with an explicit context filter', () => {
  const c = { s: 'a"b' };
  assert.ok(renderTemplate('<!doctype html><i data-x="{{s | upper | attr}}">', c, 't').includes('data-x="A&quot;B"'));
});

test('unknown filter fails the build', () => {
  assert.throws(() => renderTemplate('<!doctype html>{{x | frobnicate}}', { x: 'y' }, 't'), /unknown filter "frobnicate"/);
});
