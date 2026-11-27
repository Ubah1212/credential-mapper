




Credential Mapper
PLP–ILO Mini-Hackathon 2026 · Track 1: Credential Recognition & Skills Validation · SDGs 4 and 8
Theme: Unlocking Displaced Talent: Pathways for Skilled Refugees

Credential Mapper is a web-based guidance tool that helps skilled refugees and the caseworkers supporting them in Kenya understand possible routes for having foreign qualifications assessed. A user enters a profile, qualification and the evidence they currently hold. The application then produces a suggested recognition pathway, a document checklist, a readiness status and practical next steps.

Resource	Link
Live application	credential-mapper.vercel.app
Source repository	github.com/Ubah1212/credential-mapper
Project status: Hackathon MVP / prototype. Credential Mapper provides navigation guidance; it does not issue qualification recognition, certification, professional registration, work permits or legal advice.

The problem
Applicants with qualifications earned outside Kenya may need to navigate more than one assessment or professional body. The relevant route depends on the qualification level and field. The process can be difficult to understand when certificates are missing, the awarding institution cannot be reached, documents are in another language, or names differ between records.

The project is based on the problem framing in the PLP–ILO Mini-Hackathon brief and the Kenyan recognition bodies referenced in the application's source library. Its purpose is to make the first steps easier to understand—not to replace decisions made by the relevant authorities.

How it works
The user follows a four-stage workflow:

Profile — enter a name or alias, country of origin, location in Kenya, identity document held, languages and goal (work, study or both).
Qualification — enter the award title, institution, awarding country and year. The smart-fill helper looks for supported English and French keywords and patterns to suggest a qualification level and field. The user can review and change those suggestions.
Evidence — indicate document language, whether names match, whether the institution is reachable and which documents or evidence are held.
Credential map — review the suggested pathway, held/missing document checklist, readiness status, alternative-evidence suggestions and ordered next steps.
What the map contains
Suggested pathway: relevant assessment bodies and, where applicable, a professional regulator.
Document checklist: required items marked as held or missing.
Alternative evidence: guidance for selected missing items, such as contacting the institution, explaining a name difference, preparing work references or asking about RPL / the UNESCO Qualifications Passport where relevant.
Readiness status: Ready to apply, Gather documents, Alternative evidence route or Skills recognition (RPL).
Progress actions: next steps can be marked as complete.
Supporting references: source tags are provided for relevant pathway bodies, next steps and alternative-evidence recommendations. The Sources page provides the wider source library.
The readiness percentage is the proportion of checklist items marked as held. It is not a probability of recognition, an equivalency score or a prediction of an authority's decision. The Home page's “about three minutes” wording is an intended workflow estimate, not a measured user-study result.

Recognition pathways represented
The rules engine uses the entered qualification level and field to suggest relevant Kenyan bodies. Depending on the profile, these can include:

KNEC — foreign school and certain post-school certificate equation.
CUE — recognition and equation of foreign university awards.
KNQA — alignment and validation to the Kenya National Qualifications Framework (KNQF), and Recognition of Prior Learning (RPL).
Professional regulators — examples in the current rules include NCK, KMPDC, EBK and TSC.
Other professional bodies — CLE, KASNEB / ICPAK and the Clinical Officers Council appear in relevant routes with a confirm directly qualification where detailed requirements were not verified in this version.
The rules are navigation suggestions, not a guarantee that an authority will accept an application or that the displayed sequence is mandatory in every case. References to RPL and the UNESCO Qualifications Passport are prompts to ask the relevant organisations about eligibility and availability; the app does not submit applications or integrate with those organisations.

Features
Applicant experience
Four-step guided mapping flow.
Keyword-based English and French qualification-title suggestions.
User-editable qualification level and professional field.
Evidence checklist tailored to the entered profile.
Readiness status and document-completion percentage.
Alternative-evidence suggestions for selected missing documents.
Progress checkboxes for ordered next steps.
Edit answers and regenerate a map.
Copy a text summary, download the map as JSON, or print / save it as PDF through the browser.
Records / caseworker view
View multiple records saved in the current browser profile.
See readiness-status counts, document gaps and next-step completion indicators for those records.
Identify the three most common missing-document categories in the current records.
Open or delete an individual record.
Export the current browser's records as CSV.
Records are not shared across users or devices. The Records page is a local, single-browser view, not a multi-user case-management system.

Demonstration profiles
The application includes four fictional sample profiles: Achol, Hodan, Espoir and Jean. They are illustrative test data, not real applicants, testimonials or evidence of user outcomes.

Privacy, safety and limitations
The current prototype is intentionally lightweight:

No account or sign-in is required.
Identity or qualification document files are not uploaded by the application.
Records are saved in the browser's localStorage for the browser profile and device in use. They are not synchronised to a server or shared with another caseworker.
This application does not encrypt local-storage records. Anyone with access to the same browser profile may be able to view them. Avoid entering sensitive personal information on shared devices; use fictional demo profiles during public demonstrations and delete records when finished.
If browser storage is unavailable, the application can continue in memory for the current session, but records may not persist after the page is closed.
There is no backend, central database, account system, role-based access, audit log or partner administration panel in this MVP.
The application does not verify documents, contact institutions, submit applications, make official equivalency decisions or guarantee access to a job, permit or professional licence.
Requirements, fees, portals and programme availability can change. Users should confirm details with the named authorities before relying on a suggested route or paying a fee.
No pilot adoption, recognition, employment or user-outcome figures are claimed. These would need to be measured in a properly designed pilot.
Technology and architecture
Frontend: React 18, JavaScript, HTML and CSS.
Build tooling: Vite 5.
Mapping logic: a pure JavaScript rules engine in src/engine/mapper.js.
Source data: source links and support notes in src/data/sources.js.
Demo data: fictional profiles in src/data/samples.js.
Persistence and exports: browser storage and download helpers in src/storage.js.
UI: components in src/components/ (Home, Wizard, Result, Records and Sources).
Tests: Node.js assertions in tests/engine.test.js.
See ARCHITECTURE.md for the application structure and data flow.

credential-mapper/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── docs/
│   ├── ARCHITECTURE.md
│   └── SUBMISSION.md
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Wizard.jsx
│   │   ├── Result.jsx
│   │   ├── Records.jsx
│   │   └── Sources.jsx
│   ├── data/
│   │   ├── samples.js
│   │   └── sources.js
│   ├── engine/
│   │   └── mapper.js
│   ├── App.jsx
│   ├── main.jsx
│   ├── storage.js
│   └── styles.css
├── tests/
│   └── engine.test.js
├── index.html
├── package.json
└── vite.config.js
Run locally
Prerequisite: Node.js 18 or later. The GitHub Actions workflows use Node.js 20.

git clone https://github.com/Ubah1212/credential-mapper.git
cd credential-mapper
npm ci
npm run dev
Vite prints the local development URL in the terminal (normally http://localhost:5173).

Available scripts
Command	Purpose
npm run dev	Start the Vite development server.
npm test	Run the mapping-engine test suite.
npm run build	Build the production site into dist/.
npm run preview	Preview the production build locally.
Before submitting a change, run:

npm ci
npm test
npm run build
Deployment
The live project is published at credential-mapper.vercel.app. The project uses Vite and can be deployed to Vercel or another static host that supports a Vite build. The included ci.yml workflow checks changes on GitHub; the existing deploy.yml workflow is an optional GitHub Pages deployment path when GitHub Pages is configured for the repository.

For Vercel, import the GitHub repository as a project and use the standard Vite settings:

Framework preset: Vite
Build command: npm run build
Output directory: dist
Install command: npm ci
Maintaining recognition rules and sources
The current guidance is maintained in code:

Edit src/engine/mapper.js to change qualification patterns, pathway selection, document requirements, readiness logic, alternatives or next steps.
Edit src/data/sources.js to change source URLs, supporting notes, verification labels or LAST_CHECKED.
Edit src/data/samples.js only for fictional demonstration profiles.
When guidance changes:

Check the requirement directly with the relevant official body.
Update the supporting source entry and its verification status / last-checked date.
Update the related mapping rule if needed.
Add or update tests for the affected cases.
Run npm test and npm run build.
Review the suggested pathway and wording before merging and redeploying.
The source library in this project snapshot records 26 November 2026 as its last-checked date. Do not advance that date unless the referenced guidance has actually been rechecked.

Roadmap
These are planned improvements, not current MVP capabilities:

Kiswahili, French, Arabic and Somali interface translations.
Consent-based user accounts and shared caseworker records across devices.
A secure backend with role-based access, encryption, retention and deletion controls, and audit logs.
A partner review process for changes to recognition rules and source references.
Employer-facing skill portfolios for fields that do not require professional licensing.
Partner-verified fees and processing-time information.
Pilot evaluation of usability, time to first clear pathway, evidence-gap resolution and progress toward recognition or employment.
Contributing
Bug reports, corrections to source references and carefully scoped improvements are welcome. Please read CONTRIBUTING.md before opening a pull request.

Built for the PLP–ILO Mini-Hackathon 2026 (Power Learn Project × ILO PROSPECTS) · Track 1: Credential Recognition & Skills Validation · SDGs 4 and 8.





