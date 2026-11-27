import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import Wizard from './components/Wizard.jsx';
import Result from './components/Result.jsx';
import Records from './components/Records.jsx';
import Sources from './components/Sources.jsx';
import { loadRecords, saveRecords } from './storage.js';
import { emptyRecord } from './engine/mapper.js';
import { SAMPLES } from './data/samples.js';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'new', label: 'New mapping' },
  { id: 'records', label: 'Records' },
  { id: 'sources', label: 'Sources' },
];

export default function App() {
  const [view, setView] = useState('home');
  const [records, setRecords] = useState(loadRecords);
  const [draft, setDraft] = useState(emptyRecord);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    saveRecords(records);
  }, [records]);
  useEffect(() => {
    // Braces matter: newer browsers return a Promise from scrollTo, which React would treat as a cleanup.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const active = records.find((r) => r.id === activeId);

  function startNew(sampleKey) {
    const base = emptyRecord();
    const sample = SAMPLES.find((s) => s.key === sampleKey);
    setDraft(sample ? { ...base, ...structuredClone(sample.record), id: base.id, createdAt: base.createdAt, progress: {} } : base);
    setView('new');
  }

  function saveDraft(rec) {
    setRecords((rs) => {
      const exists = rs.some((r) => r.id === rec.id);
      const stamped = { ...rec, updatedAt: new Date().toISOString() };
      return exists ? rs.map((r) => (r.id === rec.id ? stamped : r)) : [stamped, ...rs];
    });
    setActiveId(rec.id);
    setView('result');
  }

  function updateRecord(rec) {
    setRecords((rs) => rs.map((r) => (r.id === rec.id ? rec : r)));
  }

  function editRecord(rec) {
    setDraft(structuredClone(rec));
    setView('new');
  }

  function deleteRecord(id) {
    setRecords((rs) => rs.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  }

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar no-print">
        <button className="brand" onClick={() => setView('home')} aria-label="Credential Mapper home">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span>
            <strong>Credential Mapper</strong>
            <small>Pathways for skilled refugees · Kenya</small>
          </span>
        </button>
        <nav aria-label="Main">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={view === n.id || (n.id === 'records' && view === 'result') ? 'nav-btn active' : 'nav-btn'}
              aria-current={view === n.id ? 'page' : undefined}
              onClick={() => (n.id === 'new' ? startNew() : setView(n.id))}
            >
              {n.label}
              {n.id === 'records' && records.length > 0 && <span className="count">{records.length}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main id="main">
        {view === 'home' && <Home onStart={startNew} />}
        {view === 'new' && <Wizard key={draft.id} initial={draft} onSave={saveDraft} onCancel={() => setView('home')} />}
        {view === 'result' && active && (
          <Result record={active} onUpdate={updateRecord} onEdit={() => editRecord(active)} onBack={() => setView('records')} />
        )}
        {view === 'result' && !active && <Records records={records} onOpen={(id) => { setActiveId(id); setView('result'); }} onDelete={deleteRecord} onNew={() => startNew()} />}
        {view === 'records' && (
          <Records records={records} onOpen={(id) => { setActiveId(id); setView('result'); }} onDelete={deleteRecord} onNew={() => startNew()} />
        )}
        {view === 'sources' && <Sources />}
      </main>

      <footer className="footer no-print">
        <p>
          <strong>Not legal advice or official recognition.</strong> Credential Mapper explains pathways using public guidance (last checked 26 Nov 2026). Only the bodies named
          (CUE, KNQA, KNEC and the professional councils) can recognise a qualification. Always confirm current requirements and fees with them.
        </p>
        <p className="muted">PLP–ILO Mini-Hackathon 2026 · Track 1: Credential Recognition &amp; Skills Validation · SDGs 4 &amp; 8 · Data stays on this device.</p>
      </footer>
    </div>
  );
}
