import { SOURCES, LAST_CHECKED } from '../data/sources.js';

export default function Sources() {
  return (
    <div className="page narrow">
      <h1>Source library</h1>
      <p className="lead">
        Every pathway, document and step in Credential Mapper links to one of these sources. All were last checked on <b>{LAST_CHECKED}</b>. Entries marked
        <em className="tag warn">confirm directly</em> name the right body, but their detailed requirements were not verified for this version.
      </p>
      <ul className="source-list">
        {Object.entries(SOURCES).map(([id, s]) => (
          <li key={id} className="card">
            <div className="src-head">
              <a href={s.url} target="_blank" rel="noopener noreferrer"><b>{s.name}</b></a>
              {s.status === 'confirm' ? <em className="tag warn">confirm directly</em> : <em className="tag good">verified</em>}
            </div>
            <p>{s.supports}</p>
            <code>{s.url}</code>
          </li>
        ))}
      </ul>
      <div className="card note">
        <h2>Keeping it current</h2>
        <p>
          All rules live in two files: <code>src/data/sources.js</code> and <code>src/engine/mapper.js</code>. A partner such as KNQA, UNHCR or an NGO
          caseworker team can update a fee, document or regulator in one place and redeploy, without touching the interface. The automated tests
          (<code>npm test</code>) fail if any guidance item loses its source.
        </p>
      </div>
    </div>
  );
}
