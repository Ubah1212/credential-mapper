import { useMemo, useState } from 'react';
import { LEVELS, FIELDS, DOCS, detectFromTitle, requiredDocs } from '../engine/mapper.js';

const STEPS = ['Profile', 'Qualification', 'Evidence', 'Review'];

const LOCATIONS = [
  { id: 'kakuma', label: 'Kakuma / Kalobeyei (Turkana)' },
  { id: 'dadaab', label: 'Dadaab (Garissa)' },
  { id: 'nairobi', label: 'Nairobi' },
  { id: 'other', label: 'Elsewhere in Kenya' },
];
const ID_DOCS = [
  { id: 'refugee_id', label: 'Refugee ID card' },
  { id: 'mandate', label: 'UNHCR mandate / proof of registration' },
  { id: 'asylum_pass', label: 'Asylum-seeker pass / waiting card' },
  { id: 'passport', label: 'National passport' },
  { id: 'none', label: 'None yet' },
];
const GOALS = [
  { id: 'work', label: 'Work in my profession' },
  { id: 'study', label: 'Further study' },
  { id: 'both', label: 'Both' },
];

function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function Choice({ name, options, value, onChange }) {
  return (
    <div className="choices" role="radiogroup">
      {options.map((o) => (
        <label key={o.id} className={value === o.id ? 'choice on' : 'choice'}>
          <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export default function Wizard({ initial, onSave, onCancel }) {
  const [rec, setRec] = useState(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState([]);
  const [autoNote, setAutoNote] = useState('');

  const set = (section, key, value) => setRec((r) => ({ ...r, [section]: { ...r[section], [key]: value } }));
  const p = rec.profile, q = rec.qualification, e = rec.evidence;

  function onTitle(title) {
    const d = detectFromTitle(title);
    setRec((r) => {
      const setLevel = !!d.level && (!r.qualification.level || r._autoLevel);
      const setField = !!d.field && (!r.qualification.field || r._autoField);
      return {
        ...r,
        qualification: {
          ...r.qualification,
          title,
          level: setLevel ? d.level : r.qualification.level,
          field: setField ? d.field : r.qualification.field,
          universityAwarded: setLevel && ['bachelor', 'pgdip', 'master', 'phd'].includes(d.level) ? true : r.qualification.universityAwarded,
        },
        _autoLevel: setLevel || r._autoLevel,
        _autoField: setField || r._autoField,
      };
    });
    const lv = LEVELS.find((l) => l.id === d.level)?.label.split(' (')[0];
    const fd = FIELDS.find((f) => f.id === d.field)?.label;
    setAutoNote(lv || fd ? `Detected: ${[lv, fd].filter(Boolean).join(' · ')}. Change below if that's wrong.` : '');
  }

  const docsToShow = useMemo(() => {
    // Show everything that could apply, with the ones required for this profile listed first.
    const req = requiredDocs({ ...rec, evidence: { ...e, docs: [] } });
    const rest = Object.keys(DOCS).filter((d) => !req.includes(d));
    return { req, rest };
  }, [rec, e]);

  function toggleDoc(id) {
    const has = e.docs.includes(id);
    set('evidence', 'docs', has ? e.docs.filter((d) => d !== id) : [...e.docs, id]);
  }

  function validate(s) {
    const errs = [];
    if (s === 0) {
      if (!p.location) errs.push('Choose where you are based.');
      if (!p.goal) errs.push('Choose your goal.');
    }
    if (s === 1) {
      if (!q.level) errs.push('Choose the qualification level.');
      if (!q.field) errs.push('Choose the field.');
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function finish() {
    if (!validate(0)) return setStep(0);
    if (!validate(1)) return setStep(1);
    const { _autoLevel, _autoField, ...clean } = rec;
    onSave(clean);
  }

  return (
    <div className="page narrow">
      <div className="wizard-head">
        <h1>Map a qualification</h1>
        <ol className="stepper" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'current' : i < step ? 'done' : ''}>
              <button type="button" onClick={() => (i < step || validate(step)) && setStep(i)} aria-current={i === step ? 'step' : undefined}>
                <span className="dot">{i < step ? '✓' : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {errors.length > 0 && (
        <div className="alert" role="alert">
          {errors.map((x) => <p key={x}>{x}</p>)}
        </div>
      )}

      <form className="card form" onSubmit={(ev) => { ev.preventDefault(); step === 3 ? finish() : next(); }}>
        {step === 0 && (
          <>
            <h2>About you</h2>
            <p className="muted">Only what the pathway needs. You can use a first name or an alias.</p>
            <div className="grid2">
              <Field label="Name or alias" htmlFor="alias">
                <input id="alias" value={p.alias} onChange={(ev) => set('profile', 'alias', ev.target.value)} placeholder="e.g. Amina" />
              </Field>
              <Field label="Country of origin" htmlFor="origin">
                <input id="origin" value={p.origin} onChange={(ev) => set('profile', 'origin', ev.target.value)} placeholder="e.g. South Sudan" />
              </Field>
            </div>
            <Field label="Where are you based now? *"><Choice name="loc" options={LOCATIONS} value={p.location} onChange={(v) => set('profile', 'location', v)} /></Field>
            <Field label="Identity document you hold" hint="You need a Refugee ID for the Class M work permit and for most recognition portals.">
              <Choice name="id" options={ID_DOCS} value={p.idDoc} onChange={(v) => {
                set('profile', 'idDoc', v);
                const docs = rec.evidence.docs.filter((d) => d !== 'id');
                set('evidence', 'docs', v && v !== 'none' && v !== 'asylum_pass' ? [...docs, 'id'] : docs);
              }} />
            </Field>
            <Field label="What is your goal? *"><Choice name="goal" options={GOALS} value={p.goal} onChange={(v) => set('profile', 'goal', v)} /></Field>
            <Field label="Languages you speak" htmlFor="langs">
              <input id="langs" value={p.languages} onChange={(ev) => set('profile', 'languages', ev.target.value)} placeholder="e.g. English, Arabic, Swahili" />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <h2>Your qualification</h2>
            <Field label="Qualification title, as written on the certificate" htmlFor="title" hint="English or French, e.g. “BSc Nursing”, “Licence en Droit”, “Diploma in Clinical Medicine”.">
              <input id="title" value={q.title} onChange={(ev) => onTitle(ev.target.value)} placeholder="e.g. Bachelor of Science in Civil Engineering" autoComplete="off" />
            </Field>
            {autoNote && <p className="auto-note" aria-live="polite">✨ {autoNote}</p>}
            <div className="grid2">
              <Field label="Level *" htmlFor="level">
                <select id="level" value={q.level} onChange={(ev) => { setRec((r) => ({ ...r, _autoLevel: false })); set('qualification', 'level', ev.target.value); }}>
                  <option value="">Select level…</option>
                  {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </Field>
              <Field label="Field *" htmlFor="field">
                <select id="field" value={q.field} onChange={(ev) => { setRec((r) => ({ ...r, _autoField: false })); set('qualification', 'field', ev.target.value); }}>
                  <option value="">Select field…</option>
                  {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}{f.regulated ? ' (licensed)' : ''}</option>)}
                </select>
              </Field>
            </div>
            {q.level === 'diploma' && (
              <label className="check">
                <input type="checkbox" checked={q.universityAwarded} onChange={(ev) => set('qualification', 'universityAwarded', ev.target.checked)} />
                This diploma was awarded by a university (CUE recognises university diplomas; KNEC equates other post-school certificates).
              </label>
            )}
            {q.level !== 'none' && (
              <div className="grid3">
                <Field label="Institution" htmlFor="inst"><input id="inst" value={q.institution} onChange={(ev) => set('qualification', 'institution', ev.target.value)} /></Field>
                <Field label="Country awarded" htmlFor="ctry"><input id="ctry" value={q.country} onChange={(ev) => set('qualification', 'country', ev.target.value)} /></Field>
                <Field label="Year" htmlFor="yr"><input id="yr" inputMode="numeric" value={q.year} onChange={(ev) => set('qualification', 'year', ev.target.value.replace(/[^0-9]/g, '').slice(0, 4))} /></Field>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2>Your evidence</h2>
            <p className="muted">Tick what you have now, even if it's damaged or only a photo. We'll suggest a route for anything missing.</p>
            {q.level !== 'none' && (
              <div className="grid3">
                <Field label="Language of documents">
                  <select value={e.docLanguage} onChange={(ev) => set('evidence', 'docLanguage', ev.target.value)}>
                    <option value="english">English</option>
                    <option value="french">French</option>
                    <option value="arabic">Arabic</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Same name on all documents?">
                  <select value={e.namesMatch} onChange={(ev) => set('evidence', 'namesMatch', ev.target.value)}>
                    <option value="yes">Yes</option>
                    <option value="no">No / spelling differs</option>
                  </select>
                </Field>
                <Field label="Can your institution be contacted?">
                  <select value={e.institutionReachable} onChange={(ev) => set('evidence', 'institutionReachable', ev.target.value)}>
                    <option value="yes">Yes</option>
                    <option value="unknown">Not sure</option>
                    <option value="no">No (closed, destroyed or unsafe)</option>
                  </select>
                </Field>
              </div>
            )}
            <fieldset className="docs">
              <legend>Needed for your pathway</legend>
              {docsToShow.req.map((id) => (
                <label key={id} className={e.docs.includes(id) ? 'doc on' : 'doc'}>
                  <input type="checkbox" checked={e.docs.includes(id)} onChange={() => toggleDoc(id)} />
                  <span>{DOCS[id].label}</span>
                </label>
              ))}
            </fieldset>
            <details className="more-docs">
              <summary>Other evidence I have (optional)</summary>
              <fieldset className="docs">
                {docsToShow.rest.map((id) => (
                  <label key={id} className={e.docs.includes(id) ? 'doc on' : 'doc'}>
                    <input type="checkbox" checked={e.docs.includes(id)} onChange={() => toggleDoc(id)} />
                    <span>{DOCS[id].label}</span>
                  </label>
                ))}
              </fieldset>
            </details>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Review</h2>
            <dl className="review">
              <dt>Person</dt><dd>{p.alias || 'Anonymous'}{p.origin && ` · ${p.origin}`} · {LOCATIONS.find((l) => l.id === p.location)?.label}</dd>
              <dt>Goal</dt><dd>{GOALS.find((g) => g.id === p.goal)?.label}</dd>
              <dt>Qualification</dt><dd>{q.title || '—'}</dd>
              <dt>Level · Field</dt><dd>{LEVELS.find((l) => l.id === q.level)?.label} · {FIELDS.find((f) => f.id === q.field)?.label}</dd>
              {q.level !== 'none' && <><dt>Awarded</dt><dd>{[q.institution, q.country, q.year].filter(Boolean).join(', ') || '—'}</dd></>}
              <dt>Documents held</dt><dd>{e.docs.length ? e.docs.map((d) => DOCS[d].label.split(' (')[0]).join('; ') : 'None yet'}</dd>
            </dl>
            <p className="hint">Saved only in this browser. You can edit or delete it at any time.</p>
          </>
        )}

        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}>{step === 0 ? 'Cancel' : '← Back'}</button>
          {step < 3 ? <button type="submit" className="btn primary">Continue →</button> : <button type="submit" className="btn primary">Generate my credential map</button>}
        </div>
      </form>
    </div>
  );
}
