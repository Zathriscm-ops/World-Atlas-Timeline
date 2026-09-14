import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = process.cwd();
const through = Number(process.argv[2] ?? 2);
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file).replace(/^\uFEFF/, ''));
const checks = [];
function check(id, action) {
  try {
    action();
    checks.push({ id, result: 'PASS' });
  } catch (error) {
    checks.push({ id, result: 'FAIL', error: error.message });
  }
}
const hash = (file) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
check('M001-preserved-evidence', () => {
  assert.equal(
    hash('GATED_DEVELOPMENT_MASTER_PLAN.md'),
    '6EB5D81750072AC32FA098ED5A66D73EFD4357CABF8C0561E39168FD551207B4',
  );
  assert.equal(
    hash('docs/archive/MASTER_PROJECT_PLAN_2026-09-14.md'),
    '7E180668416600DE8CC2D63DDAA8E35EB8C68A8BDE8FBFCF1A64B9A02C490E5B',
  );
  for (let section = 1; section <= 6; section++)
    assert.ok(read('PRODUCT_VISION.md').includes('## 1.0' + section));
  assert.equal(
    [...read('MVP_SCOPE.md').matchAll(/^\| [RDX]\d+ \| .+ \| (REQUIRED|DEFERRED|REJECTED) \|/gm)]
      .length,
    88,
  );
});
if (through >= 2)
  check('M002-thirty-classifications', () => {
    const data = json('data/fixtures/planning/ontology.json');
    assert.equal(data.types.length, 11);
    assert.equal(data.cases.length, 30);
    assert.equal(new Set(data.cases.map((item) => item.id)).size, 30);
    assert.equal(new Set(data.cases.map((item) => item.type)).size, 11);
    for (const item of data.cases) {
      assert.ok(data.types.includes(item.type));
      assert.ok(item.rationale.length >= 20);
      assert.equal(item.historical_publication_eligible, false);
      assert.equal(item.record_status, 'EDITORIAL_CLASSIFICATION_FIXTURE');
    }
  });
if (through >= 3)
  check('M003-chronology-contract', () => {
    const data = json('data/fixtures/planning/temporal.json');
    const format = (year) => (year <= 0 ? String(1 - year) + ' BCE' : String(year) + ' CE');
    const parse = (value) => {
      const match = /^([1-9]\d*) (BCE|CE)$/.exec(value);
      assert.ok(match, 'invalid era input');
      return match[2] === 'BCE' ? 1 - Number(match[1]) : Number(match[1]);
    };
    for (const item of data.year_cases) {
      assert.equal(parse(item.display), item.year);
      assert.equal(format(item.year), item.display);
    }
    for (let year = -10000; year <= 2026; year++) assert.equal(parse(format(year)), year);
    for (const value of data.invalid_inputs) assert.throws(() => parse(value));
    for (const item of data.interval_cases) {
      assert.ok(item.start < item.end);
      for (const year of item.active) assert.ok(item.start <= year && year < item.end);
      for (const year of item.inactive) assert.ok(!(item.start <= year && year < item.end));
    }
    const meaning = (e) =>
      Object.fromEntries(
        Object.entries(e).filter(([key]) => !['display', 'original'].includes(key)),
      );
    const pair = (a, b) => {
      assert.equal(a <= 0, b <= 0);
      return (
        String(a <= 0 ? 1 - a : a) + '–' + String(b <= 0 ? 1 - b : b) + (a <= 0 ? ' BCE' : ' CE')
      );
    };
    const displayExpression = (e) => {
      if (e.kind === 'approximate') return 'c. ' + format(e.year);
      if (e.kind === 'unknown') return 'Date unknown';
      if (e.kind === 'occurrence_window') return pair(e.earliest, e.latest);
      if (e.kind === 'duration') return pair(e.start, e.end - 1) + ' (duration)';
      if (e.kind === 'century') return String(e.number) + 'th century ' + e.era;
      if (e.kind === 'qualified_period') return e.qualifier + ' ' + e.period;
      throw new Error('Unsupported contract fixture');
    };
    const parseExpression = (text) => {
      if (text === 'Date unknown') return { kind: 'unknown', bounds: null };
      let match = /^c\. (.+)$/.exec(text);
      if (match)
        return { kind: 'approximate', year: parse(match[1]), precision: 'year', bounds: null };
      match = /^(\d+)–(\d+) (BCE|CE)( \(duration\))?$/.exec(text);
      if (match) {
        const a = parse(match[1] + ' ' + match[3]),
          b = parse(match[2] + ' ' + match[3]);
        return match[4]
          ? { kind: 'duration', start: a, end: b + 1, precision: 'year' }
          : { kind: 'occurrence_window', earliest: a, latest: b, precision: 'year' };
      }
      match = /^(\d+)th century (BCE|CE)$/.exec(text);
      if (match) {
        const n = Number(match[1]),
          era = match[2];
        return {
          kind: 'century',
          number: n,
          era,
          start: era === 'BCE' ? 1 - n * 100 : (n - 1) * 100 + 1,
          end: era === 'BCE' ? 1 - (n - 1) * 100 : n * 100 + 1,
        };
      }
      match = /^(early|mid|late) (.+ century (BCE|CE))$/.exec(text);
      if (match)
        return { kind: 'qualified_period', period: match[2], qualifier: match[1], bounds: null };
      throw new Error('Unsupported expression');
    };
    for (const expression of data.expressions) {
      assert.equal(displayExpression(expression), expression.display);
      assert.deepEqual(parseExpression(displayExpression(expression)), meaning(expression));
    }
    assert.equal(data.expressions.find((e) => e.kind === 'approximate').bounds, null);
    assert.equal(data.expressions.find((e) => e.kind === 'unknown').bounds, null);
    assert.notEqual(data.expressions[1].kind, data.expressions[2].kind);
    assert.deepEqual([data.expressions[3].start, data.expressions[3].end], [-499, -399]);
    const u = data.uncertain_duration;
    assert.deepEqual(u.possible, [u.start_min, u.end_max]);
    assert.deepEqual(u.certain, [u.start_max, u.end_min]);
    assert.equal(data.playback_unit, 'historical_years_per_real_second');
  });

if (through >= 4)
  check('M004-uncertainty-semantics', () => {
    const data = json('data/fixtures/planning/uncertainty.json');
    const validate = (item) => {
      assert.ok(['HIGH', 'MEDIUM', 'LOW', 'UNASSESSED'].includes(item.evidence));
      assert.ok(
        ['EXACT_AT_PRECISION', 'APPROXIMATE', 'BOUNDED', 'UNKNOWN'].includes(item.temporal),
      );
      assert.ok(item.rationale.length >= 15 && item.interpretation);
      if (
        [
          'people',
          'ethnic_group',
          'archaeological_culture',
          'civilization',
          'religion',
          'language',
        ].includes(item.entity_type)
      ) {
        assert.notEqual(item.role, 'control');
        assert.notEqual(item.style, 'hard-border');
      }
      if (item.spatial === 'UNKNOWN') assert.equal(item.style, 'unmapped');
      if (item.numeric_probability !== null)
        assert.ok(item.probability_model && item.calibration_source);
    };
    assert.equal(data.cases.length, 12);
    for (const item of data.cases) {
      if (item.expected_valid) validate(item);
      else assert.throws(() => validate(item), item.id);
    }
    assert.notEqual(data.cases[0].interpretation, data.cases[6].interpretation);
    assert.equal(data.cases[3].spatial, 'HIGH');
    assert.equal(data.cases[3].temporal, 'APPROXIMATE');
  });

if (through >= 5)
  check('M005-fact-provenance', () => {
    const data = json('data/fixtures/planning/provenance.json');
    const validate = (d) => {
      const sources = new Map(d.sources.map((s) => [s.id, s]));
      const citations = new Map(d.citations.map((c) => [c.id, c]));
      for (const source of d.sources) {
        assert.ok(source.title && source.creators.length && source.version && source.url);
        assert.ok(source.reliability_rationale.length > 20);
        assert.ok(Object.hasOwn(source, 'publication_date'));
      }
      for (const c of d.citations) {
        const s = sources.get(c.source_id);
        assert.ok(s && s.reliability !== 'AI_GENERATED');
        assert.ok(c.locator && c.locator.length > 5);
        if (c.consultation === 'DIRECT') assert.equal(s.directly_consulted, true);
        else assert.ok(sources.has(c.via_source_id));
      }
      for (const fact of d.claims) {
        assert.ok(fact.citation_ids.length > 0);
        for (const id of fact.citation_ids) assert.ok(citations.has(id));
        assert.ok(d.revisions.some((r) => r.id === fact.revision_id));
        assert.equal(fact.publication_status, 'RESEARCH_EXAMPLE_NOT_PUBLISHED');
      }
      for (const r of d.revisions) assert.ok(d.contributors.some((c) => c.id === r.contributor_id));
    };
    validate(data);
    const incompleteSource = structuredClone(data);
    delete incompleteSource.sources[0].reliability_rationale;
    assert.throws(() => validate(incompleteSource));
    assert.equal(data.claims.length, 6);
    assert.equal(data.citation_formats.length, 6);
    for (const mutation of [
      (d) => {
        d.claims[0].citation_ids = [];
      },
      (d) => {
        d.citations[0].source_id = 'missing';
      },
      (d) => {
        d.sources[0].reliability = 'AI_GENERATED';
      },
      (d) => {
        d.citations[6].consultation = 'DIRECT';
      },
      (d) => {
        d.citations[0].locator = '';
      },
    ]) {
      const invalid = structuredClone(data);
      mutation(invalid);
      assert.throws(() => validate(invalid));
    }
    const manifests = json('data/research/snapshot-manifest.json');
    assert.deepEqual(
      manifests.map((m) => m.year),
      [100, 200],
    );
    for (const m of manifests) {
      assert.match(m.sha256, /^[A-F0-9]{64}$/);
      assert.equal(m.production_eligible, false);
      assert.equal(m.roman_features[0].geometry_type, 'MultiPolygon');
    }
  });

if (through >= 6)
  check('M006-fail-closed-rights', () => {
    const p = json('data/fixtures/planning/licensing.json');
    assert.equal(p.classifications.length, 7);
    for (const r of p.inventory) {
      assert.ok(p.classifications.includes(r.classification));
      assert.ok(r.version && r.evidence_url && r.checked_at);
      assert.equal(r.production_eligible, false);
    }
    const admit = (r) => {
      assert.ok(p.allowed_classes.includes(r.classification));
      for (const k of p.required_fields) assert.ok(r[k], k);
      assert.equal(r.lineage_review, 'CLEARED');
      assert.equal(r.rights_review, 'CLEARED');
      assert.equal(r.historical_review, 'APPROVED');
      assert.match(r.content_hash, /^[a-f0-9]{64}$/);
      if (r.classification === 'ODbL') assert.equal(r.derivation_review, 'CLEARED');
    };
    const valid = Object.fromEntries(p.required_fields.map((k) => [k, 'fixture-only']));
    Object.assign(valid, {
      classification: 'CC-BY',
      lineage_review: 'CLEARED',
      rights_review: 'CLEARED',
      historical_review: 'APPROVED',
      content_hash: 'a'.repeat(64),
      derivation_review: 'CLEARED',
    });
    for (const c of p.allowed_classes) admit({ ...valid, classification: c });
    for (const c of ['UNKNOWN', 'RESTRICTED', 'INTERNAL TEST ONLY'])
      assert.throws(() => admit({ ...valid, classification: c }));
    for (const k of p.required_fields) {
      const r = { ...valid };
      delete r[k];
      assert.throws(() => admit(r), { name: 'AssertionError' });
    }
    assert.throws(() => admit({ ...valid, classification: 'ODbL', derivation_review: 'PENDING' }));
    assert.throws(() => admit({ ...valid, rights_review: 'PENDING' }));
  });

if (through >= 7)
  check('M007-architecture-decisions', () => {
    const a = json('data/fixtures/planning/architecture.json');
    assert.equal(a.decisions.length, 12);
    assert.equal(new Set(a.decisions.map((d) => d.id)).size, 12);
    for (const d of a.decisions) {
      assert.ok(d.reason.length > 30);
      assert.ok(read(d.adr).includes('Status: Accepted'));
      assert.match(d.implementation_module, /^M\d{3}$/);
    }
    assert.deepEqual(a.installed_by_m007, []);
    assert.deepEqual(a.reordered_future_group, ['M087', 'M086', 'M085']);
    assert.equal(a.no_current_order_exception, true);
  });

if (through >= 8)
  check('M008-measurable-budgets', () => {
    const b = json('data/fixtures/planning/budgets.json');
    assert.equal(b.status, 'TARGETS_NOT_RUNTIME_MEASUREMENTS');
    for (const value of Object.values(b.limits)) assert.ok(Number.isFinite(value) && value >= 0);
    assert.equal(b.limits.api_warm_p95_ms, 300);
    assert.equal(b.api_warm_comparison, 'strictly_less_than');
    assert.ok(299.999 < b.limits.api_warm_p95_ms);
    assert.ok(b.limits.temporal_branch_coverage_min >= 0.9);
    assert.ok(b.limits.project_branch_coverage_min >= 0.8);
    assert.equal(
      Object.values(b.cost.monthly_allocations).reduce((a, v) => a + v, 0),
      b.cost.monthly_total_ceiling,
    );
    assert.deepEqual(b.cost.actual_alert_percent, [50, 80, 100]);
    for (const key of [
      'invalid_published_geometry_max',
      'broken_relationship_max',
      'unsourced_published_claim_max',
      'unreviewed_ai_claim_max',
    ])
      assert.equal(b.limits[key], 0);
    const p95 = (values) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * 0.95) - 1];
    assert.equal(p95(Array.from({ length: 100 }, (_, i) => i + 1)), 95);
    assert.ok(p95(Array(100).fill(299)) < 300);
    assert.equal(p95(Array(100).fill(300)) < 300, false);
    assert.ok(
      ((b.limits.initial_transfer_gzip_bytes * 8) / (b.profiles.mobile.network_mbps * 1000000)) *
        1000 <
        b.limits.initial_load_p95_ms,
    );
    assert.equal(b.workload.api_measured_requests_per_endpoint, 1000);
  });

if (through >= 9)
  check('M009-fresh-clone-evidence', () => {
    const e = json('docs/progress/M009_INSTALL.json');
    assert.equal(e.result, 'PASS');
    assert.equal(e.repository_smoke, 'PASS');
    assert.equal(e.planning_regression, 'PASS');
    assert.equal(e.pnpm, '10.34.5');
    assert.match(e.tested_commit, /^[a-f0-9]{40}$/);
    assert.match(e.lock_sha256, /^[A-F0-9]{64}$/);
    for (const dir of ['apps', 'packages', 'database', 'data', 'infra', 'docs', 'scripts', 'tests'])
      assert.ok(fs.statSync(dir).isDirectory());
    assert.equal(json('package.json').private, true);
  });

if (through >= 10)
  check('M010-dependency-governance', () => {
    const p = json('package.json'),
      e = json('docs/progress/M010_INSTALL.json');
    assert.equal(p.packageManager, 'pnpm@10.34.5');
    assert.equal(p.engines.node, read('.node-version').trim());
    assert.ok(read('.npmrc').includes('engine-strict=true'));
    assert.ok(read('pnpm-workspace.yaml').includes('strictPeerDependencies: true'));
    for (const version of Object.values(p.devDependencies))
      assert.match(version, /^\d+\.\d+\.\d+$/);
    for (const alternate of ['package-lock.json', 'yarn.lock'])
      assert.equal(fs.existsSync(alternate), false);
    assert.equal(e.result, 'PASS');
    assert.equal(e.installs.length, 2);
    assert.equal(e.graph_equal, true);
    assert.equal(e.stale_lock_rejected, true);
    assert.equal(e.unsupported_node_rejected, true);
    assert.equal(e.installs[0].graph_sha256, e.installs[1].graph_sha256);
    assert.equal(e.installs[0].lock_sha256, e.installs[1].lock_sha256);
  });

if (through >= 11)
  check('M011-quality-toolchain-evidence', () => {
    const ts = json('tsconfig.json').compilerOptions;
    for (const flag of [
      'strict',
      'noUncheckedIndexedAccess',
      'exactOptionalPropertyTypes',
      'noImplicitReturns',
      'noUnusedLocals',
    ])
      assert.equal(ts[flag], true);
    assert.equal(ts.noEmit, true);
    const e = json('docs/progress/M011_TOOLCHAIN.json');
    assert.equal(e.result, 'PASS');
    assert.equal(e.baseline_typecheck, 'PASS');
    assert.equal(e.restored_typecheck, 'PASS');
    for (const name of ['type_errors', 'lint_errors', 'format_errors']) {
      assert.equal(e[name].detected, true);
      assert.notEqual(e[name].exit, 0);
    }
    assert.deepEqual(e.type_errors.diagnostics, ['TS2322', 'TS18047']);
    const installed = json('docs/progress/M011_INSTALL.json');
    assert.equal(installed.result, 'PASS');
    assert.equal(installed.graph_equal, true);
    assert.equal(installed.installs[0].graph_sha256, installed.installs[1].graph_sha256);
    assert.equal(installed.stale_lock_rejected, true);
    assert.equal(installed.unsupported_node_rejected, true);
    const audit = json('docs/progress/M011_AUDIT.json');
    assert.equal(audit.result, 'PASS');
    assert.equal(audit.vulnerabilities.high + audit.vulnerabilities.critical, 0);
  });

/* MODULE CHECKS */
const report = {
  through,
  checked_at_utc: new Date().toISOString(),
  checks,
  scope:
    'Planning contracts and recorded foundation evidence; no production GIS/application certification.',
};
fs.mkdirSync('docs/progress/checks', { recursive: true });
if (process.argv.includes('--record'))
  fs.writeFileSync(
    'docs/progress/checks/M' + String(through).padStart(3, '0') + '.json',
    JSON.stringify(report, null, 2) + '\n',
  );
for (const result of checks)
  process.stdout.write(
    result.result + ' ' + result.id + (result.error ? ': ' + result.error : '') + '\n',
  );
process.exitCode = checks.some((item) => item.result === 'FAIL') ? 1 : 0;
