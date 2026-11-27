# Credential Mapper

**PLP–ILO Mini-Hackathon 2026 · Track 1: Credential Recognition & Skills Validation (SDGs 4 & 8)**
Theme: *Unlocking Displaced Talent: Pathways for Skilled Refugees*

Credential Mapper helps a skilled refugee in Kenya, or the caseworker supporting them, turn a foreign qualification into a clear, sourced route to recognition. Even with missing or non-English papers, it takes about three minutes.

> **Live app:** `https://YOUR-APP-URL` (replace after deploying)

## The problem

Under section 28(5) of Kenya's Refugees Act 2021, recognised refugees may work or practise a profession, *subject to recognised qualifications*. Recognition is spread across several bodies:

- **KNEC** equates school and post-school certificates.
- **CUE** recognises foreign university awards.
- **KNQA** aligns qualifications to the KNQF and runs Recognition of Prior Learning (RPL).
- **A professional council** (NCK, KMPDC, EBK, TSC…) licenses regulated jobs.

Each body has its own document rules. Many refugees no longer hold the papers, or hold them only in French or Arabic. The outcome is "brain waste": nurses, engineers and teachers working far below their skills.

## What it does (one user, one workflow, one testable result)

1. **Profile**: location (Kakuma/Kalobeyei, Dadaab, Nairobi…), ID held and goal. An alias is fine.
2. **Qualification**: type the title in English or French. *Smart fill* detects level and field (e.g. "Licence en Droit" → Bachelor's · Law).
3. **Evidence**: tick the documents held, the document language, whether names match, and whether the institution can still be reached.
4. **Credential map**:
   - the **recognition pathway**: which bodies apply, in order
   - a **document checklist** with have/missing status and an **alternative route for every missing item**
   - a **readiness status**: *Ready to apply*, *Gather documents*, *Alternative evidence route* (RPL / UNESCO Qualifications Passport) or *Skills recognition (RPL)*
   - **ordered next steps** you can tick off, ending with the **Class M work permit** step
   - **a source link on every item**, with a last-checked date

Caseworkers also get a **Records** view with cohort indicators (status mix, % of steps completed, most common document gaps) and **CSV export**. Each map can be printed to PDF, copied as a text summary or downloaded as JSON.

## How it meets the five benchmarks

| Benchmark | How Credential Mapper addresses it |
|---|---|
| 1. Credential & skills verification | Routes people *without* paper records to RPL (KNQA, incl. the KNQA × UNHCR Kakuma programme) and the UNESCO Qualifications Passport |
| 2. Access & compliance readiness | Turns recognition requirements into a checklist (notarisation, translation, affidavits) and links recognition to the Class M work permit |
| 3. Practical & market fit | Names the licensing body for regulated jobs and the evidence-portfolio route for open-market jobs (ICT, business, trades) |
| 4. Social & SDG impact | SDG 4 (recognised learning) and SDG 8 (decent work). Records report measurable indicators without inventing results |
| 5. Sustainability & scalability | All rules live in two data files, automated tests check every item has a source, and there is no backend to run or pay for |

## Trust & safety

- **Evidence first:** every pathway, document and step cites a source (`src/data/sources.js`, last checked 26 Nov 2026). Bodies whose detailed rules were not verified (CLE, KASNEB, Clinical Officers Council) are flagged **"confirm directly"**.
- **No false claims:** the app is not official recognition, certification or legal advice. This is stated on every map.
- **Privacy by design:** no accounts and no uploads. Records live only in the browser's localStorage and can be deleted at any time. An alias is allowed.
- **Accessible:** keyboard-friendly, visible focus, skip link, ARIA on progress meters, mobile-responsive and print-friendly.

## Tech stack

- **React 18** + **Vite 5** (JavaScript, HTML, CSS; no UI library)
- Pure-JS rule engine: `src/engine/mapper.js`
- Static site with no backend and no API keys, so it can be hosted free on Vercel, Netlify or GitHub Pages

```
credential-mapper/
├── index.html
├── src/
│   ├── main.jsx, App.jsx, styles.css, storage.js
│   ├── components/   Home, Wizard, Result, Records, Sources
│   ├── engine/       mapper.js   ← rules: pathways, checklist, readiness, steps, smart fill
│   └── data/         sources.js  ← trusted source library · samples.js ← demo profiles
├── tests/engine.test.js
└── .github/workflows/deploy.yml  ← GitHub Pages auto-deploy
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # engine tests (9 checks)
npm run build      # production build in dist/
```

Node 18+ required.

## Deploy (pick one)

**Vercel (fastest):** push to GitHub → vercel.com → *Add New Project* → import the repo → Framework: **Vite** → Deploy. You get a public `https://….vercel.app` URL.

**GitHub Pages:** push to `main` → repo **Settings → Pages → Source: GitHub Actions**. The included workflow tests, builds and publishes to `https://<user>.github.io/<repo>/`.

## Updating the rules

When a fee, document or regulator changes, edit `src/data/sources.js` (update `LAST_CHECKED`) and/or `src/engine/mapper.js`, run `npm test`, then push. The interface does not need to change.

## Roadmap

- Kiswahili, French, Arabic and Somali interface
- Caseworker accounts with shared records (Supabase) and consented sharing with hiring partners
- Link a completed map to an AI Skill Passport portfolio for non-licensed fields
- Partner-verified fee and processing-time data from KNQA, CUE and KNEC

## Demo profiles

The four demo profiles (Achol, Hodan, Espoir, Jean) are fictional and exist only to show how the pathway changes.

---
Built for the PLP–ILO Mini-Hackathon (Power Learn Project × ILO PROSPECTS · #1MillionDevs4Africa).
