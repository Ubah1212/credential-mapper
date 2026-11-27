import { SAMPLES } from '../data/samples.js';

export default function Home({ onStart }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Track 1 · Credential Recognition &amp; Skills Validation</p>
          <h1>
            Turn a foreign qualification into a <em>clear route</em> to recognition in Kenya.
          </h1>
          <p className="lead">
            Enter one qualification and tick the documents you still have. In about three minutes you get the bodies that recognise it, a checklist of
            what's missing with a workaround for each item, and an ordered plan that cites every source.
          </p>
          <div className="hero-actions">
            <button className="btn primary lg" onClick={() => onStart()}>Map a qualification →</button>
            <a className="btn ghost lg" href="#demo">Try a demo profile</a>
          </div>
          <ul className="trust">
            <li>No account. Data stays on this device.</li>
            <li>Every result cites its official source.</li>
            <li>Designed for missing or non-English papers.</li>
          </ul>
        </div>
        <div className="hero-card" aria-hidden="true">
          <div className="mini-passport">
            <div className="mp-band">CREDENTIAL MAP</div>
            <div className="mp-body">
              <div className="mp-row"><span>Qualification</span><b>BSc Nursing</b></div>
              <div className="mp-row"><span>Awarded in</span><b>South Sudan</b></div>
              <div className="mp-row"><span>Pathway</span><b>CUE → KNQA → NCK</b></div>
              <div className="mp-meter"><i style={{ width: '43%' }} /></div>
              <div className="mp-status warn">Gather documents · 3 of 7</div>
            </div>
          </div>
        </div>
      </section>

      <section className="how">
        <h2>How it works</h2>
        <ol className="how-steps">
          <li><b>1. Profile</b><span>Where you are, your ID and your goal (work or study). An alias is fine.</span></li>
          <li><b>2. Qualification</b><span>Type the title in English or French. Level and field are detected automatically.</span></li>
          <li><b>3. Evidence</b><span>Tick the papers you hold, and say whether your institution can still be reached.</span></li>
          <li><b>4. Your map</b><span>Recognition bodies, a missing-document checklist, sourced next steps and progress tracking.</span></li>
        </ol>
      </section>

      <section id="demo" className="demo">
        <h2>Demo profiles</h2>
        <p className="muted">Fictional people, to show how the pathway changes with field, location and missing papers.</p>
        <div className="demo-grid">
          {SAMPLES.map((s) => (
            <button key={s.key} className="demo-card" onClick={() => onStart(s.key)}>
              <b>{s.record.profile.alias}</b>
              <span>{s.label}</span>
              <span className="link">Load profile →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="why">
        <div>
          <h2>Why it matters</h2>
          <p>
            Under section 28(5) of the Refugees Act 2021, recognised refugees may work or practise a profession, <em>subject to recognised qualifications</em>.
            Recognition is spread across several bodies: KNEC for school and post-school certificates, CUE for university awards, KNQA for KNQF alignment and
            Recognition of Prior Learning, and a professional council for licensed fields. A skilled professional can lose months working out where to begin.
          </p>
        </div>
        <div className="bench">
          <h3>Built against the hackathon benchmarks</h3>
          <ul>
            <li><b>Verification</b>: routes even without paper records (RPL, UNESCO Qualifications Passport)</li>
            <li><b>Readiness</b>: links recognition to the Class M work permit step</li>
            <li><b>Market fit</b>: covers the regulator for licensed jobs and the portfolio route for open ones</li>
            <li><b>SDG impact</b>: SDG 4 (recognised learning) and SDG 8 (decent work)</li>
            <li><b>Scalability</b>: rules live in one data file, with a caseworker records view and CSV export</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
