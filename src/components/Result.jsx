import { useMemo, useState } from 'react';
import { mapRecord, STATUS_META, LEVELS, FIELDS } from '../engine/mapper.js';
import { SOURCES, LAST_CHECKED } from '../data/sources.js';
import { downloadFile } from '../storage.js';

function SourceTag({ id }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <a className={`src ${s.status}`} href={s.url} target="_blank" rel="noopener noreferrer" title={s.supports}>
      {s.status === 'confirm' ? '⚠ Confirm: ' : 'Source: '}
      {s.name.split(':')[0]}
    </a>
  );
}

function summaryText(record, m) {
  const q = record.qualification;
  const lines = [
    `CREDENTIAL MAP: ${record.profile.alias || 'Candidate'}`,
    `${q.title || LEVELS.find((l) => l.id === q.level)?.label} (${[q.institution, q.country, q.year].filter(Boolean).join(', ')})`,
    `Status: ${STATUS_META[m.readiness.status].label} (${m.readiness.held}/${m.readiness.total} documents)`,
    '',
    'Pathway: ' + m.bodies.map((b) => b.name.split(':')[0]).join(' → '),
    '',
    'Missing documents:',
    ...m.checklist.filter((d) => !d.have).map((d) => `- ${d.label}: ${d.alternative?.text || ''}`),
    '',
    'Next steps:',
    ...m.steps.map((s, i) => `${i + 1}. ${s.title}${record.progress?.[s.id] ? ' [done]' : ''}`),
    '',
    `Guidance checked ${LAST_CHECKED}. Not official recognition. Confirm with each body.`,
  ];
  return lines.join('\n');
}

export default function Result({ record, onUpdate, onEdit, onBack }) {
  const m = useMemo(() => mapRecord(record), [record]);
  const [copied, setCopied] = useState(false);
  const meta = STATUS_META[m.readiness.status];
  const q = record.qualification;
  const doneCount = m.steps.filter((s) => record.progress?.[s.id]).length;
  const usedSources = [...new Set([...m.bodies, ...m.steps, ...m.checklist.map((c) => c.alternative).filter(Boolean)].map((x) => x.source))];

  function toggleStep(id) {
    onUpdate({ ...record, progress: { ...record.progress, [id]: !record.progress?.[id] }, updatedAt: new Date().toISOString() });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summaryText(record, m));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      downloadFile('credential-map.txt', summaryText(record, m), 'text/plain');
    }
  }

  return (
    <div className="page">
      <div className="result-actions no-print">
        <button className="btn ghost" onClick={onBack}>← All records</button>
        <div className="spacer" />
        <button className="btn ghost" onClick={onEdit}>Edit answers</button>
        <button className="btn ghost" onClick={copy}>{copied ? 'Copied ✓' : 'Copy summary'}</button>
        <button className="btn ghost" onClick={() => downloadFile(`credential-map-${(record.profile.alias || 'record').replace(/\W+/g, '-')}.json`, JSON.stringify({ record, map: m, lastChecked: LAST_CHECKED }, null, 2))}>Download JSON</button>
        <button className="btn primary" onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <article className="passport">
        <header className="pp-band">
          <div>
            <p className="pp-kicker">CREDENTIAL MAP · KENYA</p>
            <h1>{record.profile.alias || 'Candidate'}</h1>
            <p>{[record.profile.origin, record.profile.languages].filter(Boolean).join(' · ')}</p>
          </div>
          <div className={`status-pill ${meta.tone}`}>{meta.label}</div>
        </header>

        <div className="pp-grid">
          <div className="pp-cell"><span>Qualification</span><b>{q.title || LEVELS.find((l) => l.id === q.level)?.label}</b></div>
          <div className="pp-cell"><span>Field</span><b>{FIELDS.find((f) => f.id === q.field)?.label}</b></div>
          <div className="pp-cell"><span>Awarded</span><b>{[q.institution, q.country, q.year].filter(Boolean).join(', ') || '—'}</b></div>
          <div className="pp-cell">
            <span>Document readiness</span>
            <div className="meter" role="meter" aria-valuenow={m.readiness.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Document readiness">
              <i style={{ width: `${m.readiness.pct}%` }} />
            </div>
            <b>{m.readiness.held} of {m.readiness.total} documents · {m.readiness.pct}%</b>
          </div>
        </div>
        <p className={`status-blurb ${meta.tone}`}>{meta.blurb}</p>
      </article>

      <section className="block">
        <h2>Your recognition pathway</h2>
        <ol className="pathway">
          {m.bodies.map((b, i) => (
            <li key={b.id}>
              <span className="pw-num">{i + 1}</span>
              <div>
                <b>{b.name}</b>
                <p>{b.role}</p>
                <SourceTag id={b.source} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="two-col">
        <section className="block">
          <h2>Document checklist</h2>
          <ul className="checklist">
            {m.checklist.map((d) => (
              <li key={d.id} className={d.have ? 'have' : 'missing'}>
                <span className="ck" aria-hidden="true">{d.have ? '✓' : '!'}</span>
                <div>
                  <b>{d.label}</b>
                  <span className="sr-only">{d.have ? 'You have this' : 'Missing'}</span>
                  {d.critical && !d.have && <em className="tag">Key document</em>}
                  {d.alternative && (
                    <>
                      <p>{d.alternative.text}</p>
                      <SourceTag id={d.alternative.source} />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="block">
          <h2>
            Next steps <small className="muted">{doneCount}/{m.steps.length} done</small>
          </h2>
          <ol className="steps">
            {m.steps.map((s) => (
              <li key={s.id} className={record.progress?.[s.id] ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={!!record.progress?.[s.id]} onChange={() => toggleStep(s.id)} />
                  <b>{s.title}</b>
                </label>
                <p>{s.detail}</p>
                <SourceTag id={s.source} />
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="block sources-used">
        <h2>Evidence behind this map</h2>
        <ul>
          {usedSources.map((id) => (
            <li key={id}>
              <a href={SOURCES[id].url} target="_blank" rel="noopener noreferrer">{SOURCES[id].name}</a>
              {SOURCES[id].status === 'confirm' && <em className="tag warn">confirm directly</em>}
              <p>{SOURCES[id].supports}</p>
            </li>
          ))}
        </ul>
        <p className="disclaimer">
          Last checked {LAST_CHECKED}. This map explains public guidance. It is <b>not</b> official recognition, certification or legal advice, and fees and
          requirements change. A caseworker or the named body should review it before you pay any fee.
        </p>
      </section>
    </div>
  );
}
