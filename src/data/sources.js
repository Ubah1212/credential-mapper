// Trusted source library. Every piece of guidance in the app links back to one of these.
// "verified": the claim was checked on the official page (or a reliable report of it) on LAST_CHECKED.
// "confirm": the body is the right one to contact, but detailed requirements were not verified here.

export const LAST_CHECKED = '2026-11-26';

export const SOURCES = {
  cue: {
    name: 'Commission for University Education (CUE): Recognition & Equation of Qualifications',
    url: 'https://imis.cue.or.ke/RecognitionAndEquationforQualifications/Home',
    supports:
      'CUE recognises and equates certificates, diplomas, degrees and postgraduate awards from foreign universities. Copies for foreigners are certified by an Advocate & Notary Public or the issuing university. It is a paid service.',
    status: 'verified',
  },
  knqa: {
    name: 'Kenya National Qualifications Authority (KNQA): Alignment & Validation FAQ',
    url: 'https://knqa.go.ke/faq/',
    supports:
      'Foreign qualifications are aligned to the KNQF (Levels 1–10) through the QAV portal (qa.knqa.go.ke). The FAQ lists the documents: certified certificates and transcripts plus prerequisites, an ID, a certified English translation, a thesis signature page for Master’s/PhD, and a name affidavit if names differ. Refugees are an RPL target group.',
    status: 'verified',
  },
  knqaRpl: {
    name: 'KNQA × UNHCR: Recognition of Prior Learning for displaced persons (Kakuma)',
    url: 'https://knqa.go.ke/?p=12590',
    supports:
      'KNQA and UNHCR run RPL for forcibly displaced people and host communities in Kakuma. Successful candidates are uploaded to the Kenya National Qualifications Database.',
    status: 'verified',
  },
  uqp: {
    name: 'KNQA: National policy for the UNESCO Qualifications Passport',
    url: 'https://knqa.go.ke/?p=12049',
    supports:
      'KNQA and UNESCO are developing a national policy framework to mainstream the UNESCO Qualifications Passport (UQP) for refugees into the KNQF. Availability to individuals should be confirmed.',
    status: 'verified',
  },
  knec: {
    name: 'KNEC: Equation of foreign school & post-school certificates (QMIS)',
    url: 'http://qmis.knec.ac.ke',
    supports:
      'KNEC equates school and post-school foreign certificates online via QMIS. The certificate must be from an accredited examining body, the applicant must meet the equivalent course entry requirements, and the awarding institution must confirm the certificate directly to KNEC.',
    status: 'verified',
  },
  nck: {
    name: 'Nursing Council of Kenya (NCK): Nurses trained outside Kenya',
    url: 'https://nckenya.com/registration/',
    supports:
      'NCK verifies the cadre with the foreign institution and the foreign board or council (the applicant facilitates this). Registration needs the NCK licensure exam, and basic BScN holders complete a one-year internship. A confidential report on professional status from the foreign council is required.',
    status: 'verified',
  },
  kmpdc: {
    name: 'Kenya Medical Practitioners & Dentists Council (KMPDC): Foreign-trained doctors',
    url: 'https://kmpdc.go.ke/foreign-trained-doctors/',
    supports:
      'Foreign-trained doctors with qualifications equivalent to MBChB or BDS sit Council exams (pre-registration or internship qualifying), held three times a year in January, April and September.',
    status: 'verified',
  },
  ebk: {
    name: 'Engineers Board of Kenya (EBK): Engineers Act 2011 & Engineers Rules 2019',
    url: 'https://new.kenyalaw.org/akn/ke/act/2011/43/eng@2022-12-31',
    supports:
      'EBK assesses engineering qualifications of foreign persons. The Rules provide for evaluation of foreign awards and temporary registration for foreign persons, and professional registration includes a professional interview.',
    status: 'verified',
  },
  tsc: {
    name: 'Teachers Service Commission (TSC): Teacher registration',
    url: 'https://tsc.go.ke/index.php/faqs-on-new-teacher-registration',
    supports:
      'Foreign nationals need an equated academic certificate, a registration certificate from the home jurisdiction, an authorisation letter from the Ministerial Vetting Committee and a work permit. Registration is applied for online.',
    status: 'verified',
  },
  classM: {
    name: 'Directorate of Immigration Services: Class M (Refugees) permit',
    url: 'https://immigration.go.ke/class-m-refugees/',
    supports:
      'The Class M permit is issued to people granted refugee status (and their spouses) who intend to take up employment or a trade. Section 28(5) of the Refugees Act 2021 grants the right to work, subject to recognised qualifications.',
    status: 'verified',
  },
  cle: {
    name: 'Council of Legal Education (CLE)',
    url: 'https://www.cle.or.ke',
    supports: 'Regulates legal education and admission to the Kenya School of Law. Foreign law-degree requirements were not verified here.',
    status: 'confirm',
  },
  kasneb: {
    name: 'KASNEB / ICPAK: Accountancy qualifications',
    url: 'https://www.kasneb.or.ke',
    supports: 'Examining body for CPA (K). Exemptions for foreign accountancy qualifications were not verified here.',
    status: 'confirm',
  },
  coc: {
    name: 'Clinical Officers Council (COC)',
    url: 'https://clinicalofficerscouncil.org',
    supports: 'Regulates clinical officers in Kenya. Requirements for foreign-trained applicants were not verified here.',
    status: 'confirm',
  },
  plp: {
    name: 'PLP–ILO Mini-Hackathon concept note: Unlocking Displaced Talent',
    url: 'https://docs.google.com/document/d/1YpCEvy3UMhmZcL5u5hlAX58Os8K_M94xT6TzV_BY_0U/edit?usp=sharing',
    supports: 'Track 1 problem statement and the five evaluation benchmarks.',
    status: 'verified',
  },
};
