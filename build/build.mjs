// Builds the experience pages: src/experiences/*.html -> public/*.html
import { buildAll, listTemplates } from './lib.mjs';

try {
  if (listTemplates().length === 0) {
    console.log('No templates in src/experiences yet — nothing to build.');
    process.exit(0);
  }
  const names = buildAll();
  console.log(`Built ${names.length} page(s): ${names.join(', ')}`);
} catch (err) {
  console.error('\nBuild failed:\n' + err.message + '\n');
  process.exit(1);
}
