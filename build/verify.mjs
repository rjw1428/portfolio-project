// Verifies committed src/*.html match a fresh rebuild from templates + content.json.
// Exits non-zero on any stale or hand-edited generated page.
import { verifyAll, listTemplates } from './lib.mjs';

try {
  if (listTemplates().length === 0) {
    console.log('No templates in src/experiences yet — nothing to verify.');
    process.exit(0);
  }
  const problems = verifyAll();
  if (problems.length) {
    console.error('\nVerification failed:\n  - ' + problems.join('\n  - ') + '\n\nRun `npm run build` and commit the result.\n');
    process.exit(1);
  }
  console.log('Verified: all generated pages match their templates + content.json.');
} catch (err) {
  console.error('\nVerification errored:\n' + err.message + '\n');
  process.exit(1);
}
