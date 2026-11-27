// Credential Mapper rule engine: pure, transparent, testable.
// Input: a record { profile, qualification, evidence }.
// Output: pathway bodies, a document checklist (have / missing / alternative), ordered next steps and a readiness status.
// Every output item carries a `source` id from data/sources.js so the UI can show evidence next to each result.

export const LEVELS = [
  { id: 'secondary', label: 'Secondary school certificate (O-level, A-level, Baccalauréat…)' },
  { id: 'tvet_cert', label: 'Vocational / technical certificate' },
  { id: 'diploma', label: 'Diploma (college or technical)' },
  { id: 'bachelor', label: "Bachelor's degree / Licence" },
  { id: 'pgdip', label: 'Postgraduate diploma or certificate' },
  { id: 'master', label: "Master's degree" },
  { id: 'phd', label: 'Doctorate (PhD)' },
  { id: 'none', label: 'No formal qualification: skills from work experience' },
];

export const FIELDS = [
  { id: 'nursing', label: 'Nursing / Midwifery', regulated: true },
  { id: 'medicine', label: 'Medicine / Dentistry', regulated: true },
  { id: 'clinical', label: 'Clinical medicine (Clinical Officer)', regulated: true },
  { id: 'engineering', label: 'Engineering', regulated: true },
  { id: 'teaching', label: 'Teaching / Education', regulated: true },
  { id: 'law', label: 'Law', regulated: true },
  { id: 'accounting', label: 'Accounting / Finance', regulated: true },
  { id: 'ict', label: 'ICT / Software / Data', regulated: false },
  { id: 'business', label: 'Business / Management / Social sciences', regulated: false },
  { id: 'trades', label: 'Skilled trade (electrical, plumbing, tailoring, mechanics…)', regulated: false },
  { id: 'other', label: 'Other', regulated: false },
];

export const DOCS = {
  cert: { label: 'Original certificate / degree award', critical: true },
  transcript: { label: 'Academic transcript or results slip', critical: true },
  prereq: { label: 'Prerequisite (entry) certificates, e.g. secondary school certificate' },
  id: { label: 'Identification (Refugee ID, mandate certificate or passport)', critical: true },
  notarised: { label: 'Copies certified by an Advocate & Notary Public or the issuing institution' },
  translation: { label: 'Certified English translation (translator stamp/letterhead)' },
  thesis: { label: 'Signed thesis/dissertation signature page' },
  nameAffidavit: { label: 'Affidavit or deed poll explaining name differences' },
  licence: { label: 'Home-country professional licence / registration certificate' },
  goodStanding: { label: 'Confidential report / letter of good standing from home regulator' },
  experience: { label: 'Employment letters or work references' },
  portfolio: { label: 'Work samples / portfolio (photos, code, projects)' },
};

// Lightweight "smart fill": detect level and field from a free-text qualification title.
// Covers English and French terms common among refugees hosted in Kenya.
const LEVEL_PATTERNS = [
  ['phd', /\b(ph\.?\s?d|doctorat(e)?\b(?!.*medic)|dphil)\b/i],
  ['master', /\b(master|m\.?sc|m\.?a\b|mba|m\.?ed|maîtrise|maitrise|llm|mph)\b/i],
  ['pgdip', /\b(post\s?-?graduate|pgd|pg\s?dip)/i],
  ['bachelor', /\b(bachelor|b\.?sc|bsc|b\.?a\b|b\.?ed|b\.?com|beng|b\.?eng|llb|mbchb|mbbs|bds|licence|licenciatura|ingénieur|ingenieur|doctor of medicine|\bmd\b)/i],
  ['diploma', /\b(diploma|diplôme|graduat|higher national|hnd)\b/i],
  ['secondary', /\b(secondary|o-?level|a-?level|baccalaur|high school|kcse|igcse|gcse|certificat d.?études|exetat|diplôme d.?état)/i],
  ['tvet_cert', /\b(certificate|certificat|artisan|craft|vocational|trade test)\b/i],
];

const FIELD_PATTERNS = [
  ['nursing', /(nurs|midwi|infirmi|sage-?femme)/i],
  ['clinical', /(clinical officer|clinical medicine|technicien.*santé)/i],
  ['medicine', /(mbchb|mbbs|medicine|médecine|medecine|surgery|dental|dentist|\bbds\b|\bmd\b|doctor of medicine)/i],
  ['engineering', /(engineer|ingénieur|ingenieur|génie|genie|\bbeng\b|b\.eng)/i],
  ['teaching', /(educat|teach|pédagog|pedagog|enseign|\bb\.?ed\b|\bm\.?ed\b)/i],
  ['law', /(\blaw\b|\bllb\b|\bllm\b|droit|legal|juris)/i],
  ['accounting', /(account|finance|comptab|audit|\bcpa\b|\bacca\b)/i],
  ['ict', /(comput|software|informati|\bict\b|\bit\b|data|network|programm|cyber)/i],
  ['trades', /(electric|plumb|tailor|mechanic|weld|carpent|mason|beauty|cosmet|hairdress)/i],
  ['business', /(business|management|commerce|economics|économie|sociolog|admin|marketing|\bmba\b)/i],
];

export function detectFromTitle(title = '') {
  const t = title.trim();
  if (!t) return { level: null, field: null };
  const level = LEVEL_PATTERNS.find(([, re]) => re.test(t))?.[0] ?? null;
  const field = FIELD_PATTERNS.find(([, re]) => re.test(t))?.[0] ?? null;
  return { level, field };
}

const UNIVERSITY = ['bachelor', 'pgdip', 'master', 'phd'];

function isUniversity(level) {
  return UNIVERSITY.includes(level);
}

// Which recognition / regulatory bodies apply?
export function pathwayBodies(q) {
  const bodies = [];
  if (q.level === 'none') {
    bodies.push({ id: 'rpl', name: 'KNQA: Recognition of Prior Learning (RPL)', role: 'Assess & certify skills from work', source: 'knqa' });
    return bodies;
  }
  if (q.level === 'secondary' || q.level === 'tvet_cert' || (q.level === 'diploma' && !q.universityAwarded)) {
    bodies.push({ id: 'knec', name: 'KNEC: Equation of foreign certificates (QMIS)', role: 'Equate school / post-school certificate', source: 'knec' });
  }
  if (isUniversity(q.level) || (q.level === 'diploma' && q.universityAwarded)) {
    bodies.push({ id: 'cue', name: 'CUE: Recognition & Equation of Qualifications', role: 'Recognise & equate university award', source: 'cue' });
  }
  bodies.push({ id: 'knqa', name: 'KNQA: Alignment & Validation to KNQF', role: 'Assign a KNQF level (often requested by employers)', source: 'knqa' });

  const regulators = {
    nursing: { id: 'nck', name: 'Nursing Council of Kenya (NCK)', role: 'Licence to practise as a nurse/midwife', source: 'nck' },
    medicine: { id: 'kmpdc', name: 'KMPDC', role: 'Council exams + registration to practise', source: 'kmpdc' },
    engineering: { id: 'ebk', name: 'Engineers Board of Kenya (EBK)', role: 'Evaluation of foreign award + registration', source: 'ebk' },
    teaching: { id: 'tsc', name: 'Teachers Service Commission (TSC)', role: 'Registration as a teacher', source: 'tsc' },
    law: { id: 'cle', name: 'Council of Legal Education (CLE)', role: 'Route to the Kenyan Bar (confirm directly)', source: 'cle' },
    accounting: { id: 'kasneb', name: 'KASNEB / ICPAK', role: 'Exemptions & CPA(K) route (confirm directly)', source: 'kasneb' },
    clinical: { id: 'coc', name: 'Clinical Officers Council', role: 'Registration to practise (confirm directly)', source: 'coc' },
  };
  if (regulators[q.field]) bodies.push(regulators[q.field]);
  return bodies;
}

// Build the required-document list for this person.
export function requiredDocs(record) {
  const { qualification: q, evidence: e } = record;
  const req = new Set();
  if (q.level === 'none') {
    ['id', 'experience', 'portfolio'].forEach((d) => req.add(d));
    return [...req];
  }
  ['cert', 'transcript', 'id'].forEach((d) => req.add(d));
  if (q.level !== 'secondary') req.add('prereq');
  if (isUniversity(q.level) || q.level === 'diploma') req.add('notarised');
  if (e.docLanguage && e.docLanguage !== 'english') req.add('translation');
  if (q.level === 'master' || q.level === 'phd') req.add('thesis');
  if (e.namesMatch === 'no') req.add('nameAffidavit');
  if (['nursing', 'medicine', 'clinical', 'teaching', 'engineering'].includes(q.field)) {
    req.add('licence');
  }
  if (['nursing', 'medicine', 'clinical'].includes(q.field)) req.add('goodStanding');
  return [...req];
}

// Alternative-evidence suggestions for each missing document.
function alternativeFor(docId, record) {
  const reachable = record.evidence.institutionReachable;
  switch (docId) {
    case 'cert':
    case 'transcript':
      return reachable === 'yes'
        ? { text: 'Request a replacement or a direct verification letter from your institution. KNEC and NCK both expect the awarding body to confirm awards directly.', source: docId === 'cert' ? 'knec' : 'knqa' }
        : { text: 'Institution unreachable: ask KNQA/UNHCR whether a UNESCO Qualifications Passport evaluation is open to you, or apply for RPL to have your skills assessed instead.', source: 'uqp' };
    case 'prereq':
      return { text: 'Ask KNQA whether RPL or a KNEC qualifying test can stand in for a missing entry certificate.', source: 'knqa' };
    case 'id':
      return { text: 'Follow up your Refugee ID with the Department of Refugee Services. It is also needed for the Class M work permit.', source: 'classM' };
    case 'notarised':
      return { text: 'Have copies certified by an Advocate & Notary Public, or by the issuing institution. This applies to foreign applicants at both CUE and KNQA.', source: 'cue' };
    case 'translation':
      return { text: 'Get a translation from a certified translator, stamped or on letterhead. KNQA requires it for non-English documents.', source: 'knqa' };
    case 'thesis':
      return { text: 'Request a copy from your supervisor or university library, or from the online thesis repository.', source: 'knqa' };
    case 'nameAffidavit':
      return { text: 'Swear an affidavit or deed poll that explains the name difference.', source: 'knqa' };
    case 'licence':
    case 'goodStanding':
      return record.qualification.field === 'nursing'
        ? { text: 'Contact your home-country nursing council by email. NCK expects the applicant to facilitate verification with the foreign board.', source: 'nck' }
        : { text: 'Contact your home-country regulator or professional body by email for a copy or a verification letter. Keep any photo or scan you have as supporting evidence.', source: 'knqa' };
    case 'experience':
    case 'portfolio':
      return { text: 'Collect references from NGO supervisors or employers, plus photos or samples of your work. RPL assessors use this evidence.', source: 'knqaRpl' };
    default:
      return null;
  }
}

export function checklist(record) {
  const have = new Set(record.evidence.docs || []);
  return requiredDocs(record).map((id) => ({
    id,
    label: DOCS[id].label,
    critical: !!DOCS[id].critical,
    have: have.has(id),
    alternative: have.has(id) ? null : alternativeFor(id, record),
  }));
}

export function readiness(record) {
  const list = checklist(record);
  const total = list.length || 1;
  const held = list.filter((d) => d.have).length;
  const pct = Math.round((held / total) * 100);
  const missingCore = list.filter((d) => ['cert', 'transcript'].includes(d.id) && !d.have).length;
  let status;
  if (record.qualification.level === 'none') status = 'rpl';
  else if (missingCore === 2 || (missingCore >= 1 && record.evidence.institutionReachable === 'no')) status = 'alternative';
  else if (held < total) status = 'gather';
  else status = 'ready';
  return { pct, held, total, status };
}

export const STATUS_META = {
  ready: { label: 'Ready to apply', tone: 'good', blurb: 'You hold every document on the checklist. You can start the recognition application now.' },
  gather: { label: 'Gather documents', tone: 'warn', blurb: 'The pathway is clear, but a few documents are missing. The checklist gives a way to get each one.' },
  alternative: { label: 'Alternative evidence route', tone: 'alt', blurb: 'Your core certificate or transcript is missing and hard to replace. Start with skills-based recognition (RPL / UNESCO Qualifications Passport) while you keep pursuing the paperwork.' },
  rpl: { label: 'Skills recognition (RPL)', tone: 'alt', blurb: 'No formal certificate is needed. RPL assesses skills from work and can lead to full or partial certification.' },
};

// Ordered, sourced next steps.
export function nextSteps(record) {
  const { qualification: q, profile: p } = record;
  const bodies = pathwayBodies(q).map((b) => b.id);
  const r = readiness(record);
  const steps = [];

  if (r.status !== 'ready' && r.status !== 'rpl') {
    steps.push({ id: 'prep', title: 'Close document gaps', detail: 'Work through the missing items on your checklist. Each one shows an alternative route.', source: 'knqa' });
  }
  if (r.status === 'alternative' || r.status === 'rpl') {
    steps.push({ id: 'rpl', title: 'Apply for Recognition of Prior Learning (RPL)', detail: 'KNQA lists refugees as an RPL target group. Outcomes are full certification, partial certification or referral to gap training.' + (p.location === 'kakuma' ? ' In Kakuma, KNQA runs RPL with UNHCR, so ask the UNHCR Kakuma office.' : ' Ask UNHCR or your NGO caseworker about the next RPL assessment near you.'), source: p.location === 'kakuma' ? 'knqaRpl' : 'knqa' });
    if (q.level !== 'none') {
      steps.push({ id: 'uqp', title: 'Ask about a UNESCO Qualifications Passport', detail: 'Kenya (KNQA with UNESCO) is building a national policy for the UQP, which assesses qualifications with missing documents through a structured interview. Ask KNQA or UNHCR whether evaluations are open.', source: 'uqp' });
    }
  }
  if (bodies.includes('knec')) {
    steps.push({ id: 'knec', title: 'Apply for KNEC equation on QMIS', detail: 'Apply online at qmis.knec.ac.ke. Your awarding institution must confirm the certificate directly to KNEC. Manual applications are not accepted.', source: 'knec' });
  }
  if (bodies.includes('cue')) {
    steps.push({ id: 'cue', title: 'Apply to CUE for recognition & equation', detail: 'Register on the CUE IMIS portal and upload certified copies of your award, transcripts and entry certificates. It is a paid service, so check the current fee schedule.', source: 'cue' });
  }
  if (bodies.includes('knqa')) {
    steps.push({ id: 'knqa', title: 'Align your qualification to the KNQF (KNQA)', detail: 'Create an Individual account on qa.knqa.go.ke, add your qualification, upload certified attachments, accept the declaration and pay the evaluation fee.', source: 'knqa' });
  }
  const reg = {
    nck: { title: 'Register with the Nursing Council of Kenya', detail: 'NCK verifies your cadre with your foreign institution and council, and you help facilitate this. Then sit the NCK licensure exam. Basic BScN holders complete a one-year internship.' },
    kmpdc: { title: 'Sit KMPDC Council exams', detail: 'Pre-registration and internship qualifying exams run in January, April and September. Apply through KMPDC (reg.lic@kmpdc.go.ke for temporary registration).' },
    ebk: { title: 'Apply to EBK for evaluation of your foreign award', detail: 'EBK assesses engineering qualifications of foreign persons. Foreign persons may apply for temporary registration (Form EBK 5). Professional registration includes a professional interview.' },
    tsc: { title: 'Register with the Teachers Service Commission', detail: 'You will need your equated certificate, registration from your home jurisdiction, a Ministerial Vetting Committee letter and a work permit. Apply on TSC online.' },
    cle: { title: 'Contact the Council of Legal Education', detail: 'Ask about the route for foreign law degrees to the Kenya School of Law. Not verified in this tool, so confirm directly.' },
    kasneb: { title: 'Ask KASNEB about exemptions', detail: 'Ask which CPA(K) papers your foreign accountancy qualification exempts you from. Not verified in this tool, so confirm directly.' },
    coc: { title: 'Contact the Clinical Officers Council', detail: 'Ask about registration for foreign-trained clinical officers. Not verified in this tool, so confirm directly.' },
  };
  bodies.filter((b) => reg[b]).forEach((b) => steps.push({ id: b, ...reg[b], source: b }));

  if (p.goal !== 'study') {
    steps.push({ id: 'classM', title: 'Apply for a Class M work permit', detail: 'Section 28(5) of the Refugees Act 2021 gives recognised refugees the right to work, subject to recognised qualifications. Formal employment needs a Class M permit, and a Refugee ID is required to apply.', source: 'classM' });
  }
  if (!FIELDS.find((f) => f.id === q.field)?.regulated) {
    steps.push({ id: 'portfolio', title: 'Build an evidence portfolio for employers', detail: 'Your field is not licensed, so employers judge demonstrated skills. Pair the equation letter with project evidence and references.', source: 'plp' });
  }
  return steps;
}

export function mapRecord(record) {
  return {
    bodies: pathwayBodies(record.qualification),
    checklist: checklist(record),
    readiness: readiness(record),
    steps: nextSteps(record),
  };
}

export function emptyRecord() {
  return {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    profile: { alias: '', origin: '', location: '', idDoc: '', goal: 'work', languages: '' },
    qualification: { title: '', level: '', field: '', institution: '', country: '', year: '', universityAwarded: false },
    evidence: { docs: [], docLanguage: 'english', namesMatch: 'yes', institutionReachable: 'unknown' },
    progress: {},
  };
}
