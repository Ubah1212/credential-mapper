// Fictional demo profiles for testing and live demos. They are not real people.
export const SAMPLES = [
  {
    key: 'nurse',
    label: 'Nurse · South Sudan · Kakuma',
    record: {
      profile: { alias: 'Achol (demo)', origin: 'South Sudan', location: 'kakuma', idDoc: 'refugee_id', goal: 'work', languages: 'English, Dinka, Arabic' },
      qualification: { title: 'Bachelor of Science in Nursing', level: 'bachelor', field: 'nursing', institution: 'University of Juba', country: 'South Sudan', year: '2016', universityAwarded: true },
      evidence: { docs: ['cert', 'id', 'prereq'], docLanguage: 'english', namesMatch: 'yes', institutionReachable: 'yes' },
    },
  },
  {
    key: 'engineer',
    label: 'Civil engineer · Somalia · Dadaab · no papers',
    record: {
      profile: { alias: 'Hodan (demo)', origin: 'Somalia', location: 'dadaab', idDoc: 'refugee_id', goal: 'work', languages: 'Somali, English, Arabic' },
      qualification: { title: 'BSc Civil Engineering', level: 'bachelor', field: 'engineering', institution: 'Mogadishu University', country: 'Somalia', year: '2012', universityAwarded: true },
      evidence: { docs: ['id', 'experience'], docLanguage: 'english', namesMatch: 'no', institutionReachable: 'no' },
    },
  },
  {
    key: 'teacher',
    label: 'Teacher · DR Congo · Nairobi · French documents',
    record: {
      profile: { alias: 'Espoir (demo)', origin: 'DR Congo', location: 'nairobi', idDoc: 'refugee_id', goal: 'work', languages: 'French, Swahili, Lingala' },
      qualification: { title: 'Licence en Pédagogie appliquée', level: 'bachelor', field: 'teaching', institution: 'Université de Kinshasa', country: 'DR Congo', year: '2014', universityAwarded: true },
      evidence: { docs: ['cert', 'transcript', 'prereq', 'id', 'licence'], docLanguage: 'french', namesMatch: 'yes', institutionReachable: 'yes' },
    },
  },
  {
    key: 'electrician',
    label: 'Electrician · Burundi · Kalobeyei · skills only',
    record: {
      profile: { alias: 'Jean (demo)', origin: 'Burundi', location: 'kakuma', idDoc: 'refugee_id', goal: 'work', languages: 'Kirundi, French, Swahili' },
      qualification: { title: 'Electrical installation (self-taught, 8 years)', level: 'none', field: 'trades', institution: '', country: 'Burundi', year: '', universityAwarded: false },
      evidence: { docs: ['id', 'portfolio'], docLanguage: 'other', namesMatch: 'yes', institutionReachable: 'unknown' },
    },
  },
];
