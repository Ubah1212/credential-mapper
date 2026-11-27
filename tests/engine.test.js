// Run with: npm test. Plain Node assertions, no test framework needed.
import assert from 'node:assert/strict';
import { detectFromTitle, mapRecord, emptyRecord } from '../src/engine/mapper.js';
import { SAMPLES } from '../src/data/samples.js';
import { SOURCES } from '../src/data/sources.js';

let passed = 0;
const t = (name, fn) => { fn(); passed++; console.log('  ✓', name); };
const build = (r) => ({ ...emptyRecord(), ...r });

console.log('Credential Mapper engine tests');

t('detects level + field from English titles', () => {
  assert.deepEqual(detectFromTitle('Bachelor of Science in Nursing'), { level: 'bachelor', field: 'nursing' });
  assert.deepEqual(detectFromTitle('MSc Computer Science'), { level: 'master', field: 'ict' });
  assert.deepEqual(detectFromTitle('Diploma in Clinical Medicine'), { level: 'diploma', field: 'clinical' });
  assert.deepEqual(detectFromTitle('MBChB'), { level: 'bachelor', field: 'medicine' });
});

t('detects level + field from French titles', () => {
  assert.deepEqual(detectFromTitle('Licence en Droit'), { level: 'bachelor', field: 'law' });
  assert.deepEqual(detectFromTitle('Diplôme d\'Ingénieur civil'), { level: 'bachelor', field: 'engineering' });
});

t('nurse sample → CUE + KNQA + NCK, gather documents', () => {
  const m = mapRecord(build(SAMPLES.find((s) => s.key === 'nurse').record));
  const ids = m.bodies.map((b) => b.id);
  assert.ok(ids.includes('cue') && ids.includes('knqa') && ids.includes('nck'));
  assert.equal(m.readiness.status, 'gather');
  assert.ok(m.checklist.some((d) => d.id === 'goodStanding' && !d.have));
});

t('engineer without papers + unreachable institution → alternative route with UQP & RPL', () => {
  const m = mapRecord(build(SAMPLES.find((s) => s.key === 'engineer').record));
  assert.equal(m.readiness.status, 'alternative');
  const stepIds = m.steps.map((s) => s.id);
  assert.ok(stepIds.includes('rpl') && stepIds.includes('uqp') && stepIds.includes('ebk'));
  assert.ok(m.checklist.some((d) => d.id === 'nameAffidavit'), 'name mismatch adds affidavit');
});

t('French documents require a certified translation', () => {
  const m = mapRecord(build(SAMPLES.find((s) => s.key === 'teacher').record));
  const tr = m.checklist.find((d) => d.id === 'translation');
  assert.ok(tr && !tr.have && tr.alternative);
  assert.ok(m.bodies.some((b) => b.id === 'tsc'));
});

t('skills-only profile → RPL, no KNEC/CUE', () => {
  const m = mapRecord(build(SAMPLES.find((s) => s.key === 'electrician').record));
  assert.equal(m.readiness.status, 'rpl');
  assert.deepEqual(m.bodies.map((b) => b.id), ['rpl']);
});

t('secondary certificate → KNEC, not CUE', () => {
  const r = build({ qualification: { ...emptyRecord().qualification, level: 'secondary', field: 'other' } });
  const ids = mapRecord(r).bodies.map((b) => b.id);
  assert.ok(ids.includes('knec') && !ids.includes('cue'));
});

t('every step, body and alternative cites a known source', () => {
  for (const s of SAMPLES) {
    const m = mapRecord(build(s.record));
    [...m.steps, ...m.bodies, ...m.checklist.map((c) => c.alternative).filter(Boolean)]
      .forEach((x) => assert.ok(SOURCES[x.source], `missing source ${x.source} in ${s.key}`));
  }
});

t('fully documented applicant is ready to apply', () => {
  const r = build(SAMPLES.find((s) => s.key === 'nurse').record);
  r.evidence = { ...r.evidence, docs: ['cert', 'transcript', 'prereq', 'id', 'notarised', 'licence', 'goodStanding'] };
  assert.equal(mapRecord(r).readiness.status, 'ready');
  assert.equal(mapRecord(r).readiness.pct, 100);
});

console.log(`\n${passed} tests passed`);
