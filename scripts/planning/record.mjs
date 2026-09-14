import fs from 'node:fs';
import assert from 'node:assert/strict';

const number = Number(process.argv[2]);
const state = process.argv[3];
const summary = process.argv[4] ?? '';
assert.ok(number >= 2 && number <= 11 && Number.isInteger(number));
assert.ok(['IN_PROGRESS', 'PASS', 'BLOCKED'].includes(state));
const id = 'M' + String(number).padStart(3, '0');
const previous = 'M' + String(number - 1).padStart(3, '0');
const ledgerPath = 'docs/progress/MODULE_LEDGER.md';
let ledger = fs.readFileSync(ledgerPath, 'utf8');
assert.match(ledger, new RegExp('^\\| ' + previous + ' \\| [^\\r\\n]+ \\| PASS \\|', 'm'));
if (state === 'PASS') {
  const report = JSON.parse(fs.readFileSync('docs/progress/checks/' + id + '.json', 'utf8'));
  assert.equal(report.through, number);
  assert.ok(report.checks.length > 0 && report.checks.every((check) => check.result === 'PASS'));
  assert.ok(fs.existsSync('docs/progress/' + id + '_VERIFICATION.md'));
}
const row = new RegExp('^(\\| ' + id + ' \\| [^|]+ \\| )[^|]+( \\| )[^\\r\\n]*', 'm');
assert.ok(row.test(ledger));
ledger = ledger.replace(
  row,
  '$1' +
    state +
    '$2' +
    (state === 'PASS'
      ? '[' + id + ' verification](' + id + '_VERIFICATION.md)'
      : summary || 'Gate in progress') +
    ' |',
);
const headline =
  state === 'PASS'
    ? 'Most recent completed module: **' +
      id +
      ': PASS**. Next eligible module: **M' +
      String(number + 1).padStart(3, '0') +
      ': NOT_STARTED**.'
    : 'Active module: **' + id + ': ' + state + '**. ' + summary;
ledger = ledger.replace(/^Most recent completed module:.*$|^Active module:.*$/m, headline);
ledger = ledger.replace(
  'No downstream module has begun.',
  'Modules proceed sequentially within the user-authorized M002–M011 batch; M012 and later remain NOT_STARTED.',
);
fs.writeFileSync(ledgerPath, ledger);
process.stdout.write(id + ' ' + state + '\n');
