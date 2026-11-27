import { useMemo, useState } from 'react';
import { mapRecord, STATUS_META, FIELDS, DOCS } from '../engine/mapper.js';
import { downloadFile } from '../storage.js';

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export default function Records({ records, onOpen, onDelete, onNew }) {
  const [confirmId, setConfirmId] = useState(null);
  const rows = useMemo(() => records.map((r) => ({ r, m: mapRecord(r) })), [records]);

  const stats = useMemo(() => {
    const byStatus = {};
    const missing = {};
    let stepsDone = 0, stepsTotal = 0;
    rows.forEach(({ r, m }) => {
      byStatus[m.readiness.status] = (byStatus[m.readiness.status] || 0) + 1;
      m.checklist.filter((d) => !d.have).forEach((d) => (missing[d.id] = (missing[d.id] || 0) + 1));
      stepsTotal += m.steps.length;
      stepsDone += m.steps.filter((s) => r.progress?.[s.id]).length;
    });
    const topMissing = Object.entries(missing).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { byStatus, topMissing, stepsDone, stepsTotal };
  }, [rows]);

  function exportCsv() {
    const header = ['alias', 'origin', 'location', 'qualification', 'level', 'field', 'country', 'status', 'docs_held', 'docs_required', 'steps_done', 'steps_total', 'missing', 'updated'];
    const lines = rows.map(({ r, m }) => [
      r.profile.alias, r.profile.origin, r.profile.location, r.qualification.title, r.qualification.level, r.qualification.field, r.qualification.country,
      STATUS_META[m.readiness.status].label, m.readiness.held, m.readiness.total,
      m.steps.filter((s) => r.progress?.[s.id]).length, m.steps.length,
      m.checklist.filter((d) => !d.have).map((d) => d.id).join('; '), r.updatedAt || r.createdAt,
    ].map(csvCell).join(','));
    downloadFile('credential-mapper-records.csv', [header.join(','), ...lines].join('\n'), 'text/csv');
  }

  if (records.length === 0) {
    return (
      <div className="page narrow empty">
        <h1>No records yet</h1>
        <p className="muted">Records you map are saved in this browser, so a caseworker can track several candidates on one device.</p>
        <button className="btn primary lg" onClick={onNew}>Map a qualification →</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="records-head">
        <div>
          <h1>Records</h1>
          <p className="muted">Caseworker view: everyone mapped on this device, with cohort indicators.</p>
        </div>
        <div className="row-actions">
          <button className="btn ghost" onClick={exportCsv}>Export CSV</button>
          <button className="btn primary" onClick={onNew}>+ New mapping</button>
        </div>
      </div>

      <section className="stats" aria-label="Cohort indicators">
        <div className="stat"><b>{records.length}</b><span>candidates mapped</span></div>
        {Object.entries(STATUS_META).map(([k, v]) => (
          <div key={k} className={`stat ${v.tone}`}><b>{stats.byStatus[k] || 0}</b><span>{v.label}</span></div>
        ))}
        <div className="stat"><b>{stats.stepsTotal ? Math.round((stats.stepsDone / stats.stepsTotal) * 100) : 0}%</b><span>next steps completed</span></div>
      </section>
      {stats.topMissing.length > 0 && (
        <p className="insight">
          <b>Most common gaps:</b> {stats.topMissing.map(([id, n]) => `${DOCS[id].label.split(' (')[0]} (${n})`).join(' · ')}. This is where bridging support, fee waivers or partner verification would have the most effect.
        </p>
      )}

      <div className="table-wrap">
        <table className="records">
          <thead>
            <tr><th>Candidate</th><th>Qualification</th><th>Field</th><th>Status</th><th>Docs</th><th>Steps</th><th><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody>
            {rows.map(({ r, m }) => (
              <tr key={r.id}>
                <td><b>{r.profile.alias || 'Anonymous'}</b><small>{r.profile.origin}</small></td>
                <td>{r.qualification.title || '—'}<small>{r.qualification.country}</small></td>
                <td>{FIELDS.find((f) => f.id === r.qualification.field)?.label}</td>
                <td><span className={`status-pill sm ${STATUS_META[m.readiness.status].tone}`}>{STATUS_META[m.readiness.status].label}</span></td>
                <td>{m.readiness.held}/{m.readiness.total}</td>
                <td>{m.steps.filter((s) => r.progress?.[s.id]).length}/{m.steps.length}</td>
                <td className="actions">
                  <button className="btn sm primary" onClick={() => onOpen(r.id)}>Open</button>
                  {confirmId === r.id ? (
                    <>
                      <button className="btn sm danger" onClick={() => { onDelete(r.id); setConfirmId(null); }}>Confirm delete</button>
                      <button className="btn sm ghost" onClick={() => setConfirmId(null)}>Keep</button>
                    </>
                  ) : (
                    <button className="btn sm ghost" onClick={() => setConfirmId(r.id)} aria-label={`Delete ${r.profile.alias || 'record'}`}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
