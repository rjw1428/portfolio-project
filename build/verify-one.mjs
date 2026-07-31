// Verify ONE template in memory without touching shared public/*.html output.
// Renders src/experiences/<name> and checks it equals public/<name> except the banner.
// Usage: node build/verify-one.mjs 03-telemetry.html
import { renderTemplate, readContent } from './lib.mjs';
import { readFileSync } from 'node:fs';

const name = process.argv[2];
if (!name) {
  console.error('usage: node build/verify-one.mjs <file.html>');
  process.exit(2);
}

let out;
try {
  out = renderTemplate(readFileSync(`src/experiences/${name}`, 'utf8'), readContent(), name);
} catch (e) {
  console.error('RENDER ERROR: ' + e.message);
  process.exit(1);
}

const orig = readFileSync(`public/${name}`, 'utf8');
const outNoBanner = out.replace(/\n<!-- GENERATED from experiences\/[^\n]*-->/, '');

if (outNoBanner === orig) {
  const tokens = (readFileSync(`src/experiences/${name}`, 'utf8').match(/\{\{/g) || []).length;
  console.log(`OK — rebuild matches original (banner-only diff). ${tokens} tokens.`);
  process.exit(0);
}

let k = 0;
while (k < outNoBanner.length && k < orig.length && outNoBanner[k] === orig[k]) k++;
console.error(`MISMATCH at char ${k} (a token resolved to something other than the original literal):`);
console.error('  rebuilt : ' + JSON.stringify(outNoBanner.slice(Math.max(0, k - 45), k + 45)));
console.error('  original: ' + JSON.stringify(orig.slice(Math.max(0, k - 45), k + 45)));
process.exit(1);
