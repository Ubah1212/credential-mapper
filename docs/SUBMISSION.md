# Submission: PLP–ILO Mini-Hackathon (due 27 Nov 2026)

**Project name:** Credential Mapper
**Track:** Track 1: Credential Recognition & Skills Validation (SDGs 4 & 8)
**Live app URL:** https://YOUR-APP-URL
**GitHub repository:** https://github.com/YOUR-USERNAME/credential-mapper

## Brief project summary

**Problem.** Skilled refugees in Kenya have the legal right to work under section 28(5) of the Refugees Act 2021, but only with *recognised* qualifications. Recognition is split across KNEC, CUE, KNQA and professional councils, each with its own document rules. Many refugees have lost their papers or hold them in French or Arabic, so nurses, engineers and teachers end up in "brain waste".

**Solution.** Credential Mapper is a free web app. A refugee or caseworker enters one qualification and ticks the documents they hold. In about three minutes they get a personal credential map:
- which bodies recognise the qualification, in order
- a missing-document checklist with an alternative route for each gap (certified translation, affidavit, institution verification, RPL or the UNESCO Qualifications Passport)
- a readiness status and ordered next steps, ending with the Class M work permit

Every item links to its official source with a last-checked date.

**Main workflow.** Profile → Qualification (smart fill detects level and field from English or French titles) → Evidence → Credential map. The map can be printed to PDF, copied or downloaded, and its steps ticked off as progress. A caseworker Records view shows cohort indicators and exports CSV.

**Technology.** React 18 + Vite (JavaScript, HTML, CSS), a transparent rule engine, automated tests, and static hosting with no backend, API keys or personal data leaving the device.

**Impact.** It shortens the first and most confusing step from "brain waste" to decent work (SDG 8) and recognised learning (SDG 4), and it gives people without papers a skills-based route. It scales across cohorts and counties (Kakuma, Kalobeyei, Dadaab, urban): rules live in one data file a partner can update, and the Records view measures where bridging support is most needed (most common document gaps).

## 2-minute demo script

1. **Problem (20s):** "Hodan is a civil engineer from Somalia living in Dadaab. Her university can't be reached and her name is spelled differently on her papers. Where does she start?"
2. **Live demo (60s):** Home → load *Hodan (demo)* → Continue through the steps → **Generate**. Show the *Alternative evidence route* status, the pathway (CUE → KNQA → EBK), and the checklist with a workaround for each missing item. Tick a step.
3. **Contrast (15s):** load *Espoir (demo)*, a teacher with French documents. The map adds a certified-translation requirement and the TSC route.
4. **Evidence (15s):** click any source tag, then open the Sources page. "Every line is sourced and dated, and we flag what we couldn't verify."
5. **Scale (10s):** Records → cohort indicators → Export CSV. "Rules live in one data file, so a partner can update them without code changes."
