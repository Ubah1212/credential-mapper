# 🌍 Credential Mapper

### Helping skilled refugees turn their qualifications and experience into new opportunities.

**PLP–ILO Mini-Hackathon 2026 | Credential Recognition & Skills Validation**

🔗 **Live Website:** https://credential-mapper.vercel.app/  
💻 **GitHub Repository:** https://github.com/Ubah1212/credential-mapper

---

## 💡 About the Project

Imagine spending years studying, earning qualifications and building professional skills, only to leave your home country and discover that proving those qualifications in a new country is not easy.

This is a challenge many refugees and displaced professionals face.

Some have lost their academic certificates. Others cannot contact their former schools or universities. Many simply do not know where to start or which organisation to approach.

This is the problem I wanted to address when building **Credential Mapper**.

Credential Mapper is a web-based application designed to help refugees and displaced professionals in Kenya understand how they can have their foreign qualifications assessed and recognised.

Instead of leaving users confused about what to do next, the platform guides them through a series of simple steps and provides a personalised recognition pathway based on their qualifications and available documents.

My goal is simple: to help people understand their options, recognise the value of their skills and take practical steps towards further education and employment.

## 🎯 The Problem We Are Solving

Refugees do not leave their knowledge, education and professional experience behind when they are displaced. However, accessing opportunities in a new country can be difficult when their qualifications are not recognised.

Some of the challenges include:

- Missing certificates or academic transcripts.
- Difficulty contacting previous schools and universities.
- Uncertainty about where to submit foreign qualifications.
- Language differences in academic documents.
- Differences in names across official documents.
- Limited information about alternative ways to demonstrate skills and experience.

These challenges can make it difficult for qualified people to continue their education or find work that matches their abilities.

## 🚀 How Credential Mapper Helps

Credential Mapper makes the first steps of the recognition process easier to understand.

Users provide information about their education, professional background and the documents they currently have. The application then uses its qualification-mapping engine to suggest relevant recognition pathways and practical next steps.

It helps users understand:

- Which Kenyan recognition or professional bodies may be relevant.
- What documents they already have.
- What documents they may still need.
- What alternative evidence they could explore.
- Which actions they can take next.

The platform does not make official recognition decisions. It helps users understand where to start and how to move forward.

## ⚙️ How It Works

Using Credential Mapper is designed to be straightforward.

### 1. Create Your Profile

The user starts by providing basic information, such as their country of origin, current location and whether they are seeking employment or further education.

### 2. Add Your Qualifications

The user enters their qualification title, institution, country and year of completion.

The application can recognise common English and French qualification titles and suggest a possible qualification level and professional field.

### 3. Check Your Documents

The user indicates which documents they have, such as certificates, transcripts and identification documents.

The application also considers situations where documents are missing, institutions cannot be reached or names do not match.

### 4. Generate Your Credential Map

Once the information is submitted, Credential Mapper creates a personalised result containing:

- A suggested recognition pathway.
- A document checklist.
- Missing-document information.
- A readiness assessment.
- Alternative evidence suggestions.
- Recommended next steps.
- Supporting source references.

The idea is to give every user a clearer starting point instead of expecting them to figure out the entire process alone.

## ✨ What Can You Do With Credential Mapper?

### For Applicants

- Create a personal qualification profile.
- Enter educational and professional information.
- Get suggestions for qualification levels and professional fields.
- Explore relevant recognition pathways.
- Identify missing documents.
- Explore alternative evidence options, including Recognition of Prior Learning (RPL), where applicable.
- Track progress through recommended actions.
- Copy or print a credential map.
- Download results in JSON format.

### For Caseworkers

Credential Mapper also includes a Records dashboard to help demonstrate how applicant information could be organised.

Caseworkers can:

- View saved applicant records.
- Check readiness statuses.
- Identify common documentation gaps.
- Monitor completed next steps.
- Open individual credential maps.
- Export records into CSV format.

Currently, these records are stored in the browser being used. Shared caseworker accounts and a central database are planned for future development.

## 🇰🇪 Understanding Kenya's Recognition System

One of the important parts of this project is helping users understand which organisations may be relevant to their qualifications.

Credential Mapper includes guidance involving organisations such as:

| Organisation | What it does |
|---|---|
| KNEC | Handles equation of certain foreign educational qualifications |
| CUE | Handles recognition and equation of foreign university qualifications |
| KNQA | Works on qualifications framework alignment and Recognition of Prior Learning |
| NCK | Regulates nursing professionals |
| KMPDC | Regulates medical and dental professionals |
| EBK | Regulates engineering professionals |
| TSC | Regulates teachers |

The appropriate organisation depends on the qualification and profession.

Users should always confirm the latest requirements directly with the relevant organisation.

## 🛠️ Technology Behind the Project

I built Credential Mapper using technologies that make it lightweight and suitable for further development.

- **React 18** – Builds the interactive user interface.
- **JavaScript** – Handles the qualification-mapping logic.
- **Vite 5** – Provides the development and build environment.
- **HTML5 and CSS3** – Structure and style the application.
- **Browser Local Storage** – Saves records locally.
- **Vercel** – Hosts the live application.

### Project Structure

```text
credential-mapper/
│
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Wizard.jsx
│   │   ├── Result.jsx
│   │   ├── Records.jsx
│   │   └── Sources.jsx
│   │
│   ├── data/
│   │   ├── samples.js
│   │   └── sources.js
│   │
│   ├── engine/
│   │   └── mapper.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── storage.js
│   └── styles.css
│
├── tests/
│   └── engine.test.js
│
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Privacy Matters

People using this platform may have sensitive personal and educational information. That is why the current prototype is designed to work without requiring users to create accounts or upload their academic documents.

Currently:

- No account registration is required.
- Users can use an alias.
- Academic and identity documents are not uploaded.
- Records are saved in the user's browser.
- No central database is required.

**A note about security:** Browser storage is not encrypted by the application. Anyone with access to the same browser profile may potentially view saved records. Users should avoid entering sensitive information on shared devices.

## 🧪 Testing

I included automated tests to check whether the qualification-mapping engine behaves as expected.

The tests cover qualification detection, recognition pathways, missing documents, alternative evidence, readiness calculations and source references.

**Current test result: 9 out of 9 tests passed.**

To run the tests:

```bash
npm test
```

To create a production build:

```bash
npm run build
```

## 💻 Run the Project Locally

Would you like to explore the code or contribute to the project? Follow these steps.

**1. Clone the repository**

```bash
git clone https://github.com/Ubah1212/credential-mapper.git
```

**2. Open the project folder**

```bash
cd credential-mapper
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

Open the local address shown in your terminal, usually:

```text
http://localhost:5173
```

## 🌱 What's Next?

Credential Mapper is currently a working MVP. There is still a lot of room to improve it, and I see several opportunities to make it more useful.

Some of the improvements I would like to work on include:

- **More languages:** Adding Somali, Kiswahili, Arabic and other languages to make the platform accessible to more refugees.
- **A secure database:** Allowing users to access their records across different devices.
- **Caseworker accounts:** Helping organisations manage cases through secure shared access.
- **Better recognition guidance:** Working with relevant organisations and experts to keep information accurate and updated.
- **Employer connections:** Exploring ways to help employers understand the skills and experience of displaced professionals.
- **Impact measurement:** Testing the platform with users and learning whether it genuinely makes the recognition journey easier.

These are future goals, not features that are already available in the current version.

## 🌍 The Bigger Picture

Credential Mapper is connected to two Sustainable Development Goals:

**SDG 4 – Quality Education**

Because everyone should have a fair opportunity to continue learning, regardless of their background or displacement experience.

**SDG 8 – Decent Work and Economic Growth**

Because skilled people deserve opportunities to use their education, knowledge and experience.

I believe that being displaced should not mean losing the opportunity to build a professional future.

## ⚠️ Important Disclaimer

Credential Mapper is an independent guidance tool. It does not issue certificates, officially recognise qualifications, grant professional registration or guarantee employment.

All suggested pathways should be verified with the relevant Kenyan authorities and professional bodies.

## 🤝 Project Information

**Project:** Credential Mapper  
**Programme:** Power Learn Project (PLP) – ILO Mini-Hackathon 2026  
**Track:** Credential Recognition & Skills Validation  
**Theme:** Unlocking Displaced Talent – Pathways for Skilled Refugees  
**Technology:** React, JavaScript and Vite  
**Deployment:** Vercel

🔗 **Try the application:** https://credential-mapper.vercel.app/

💻 **Explore the source code:** https://github.com/Ubah1212/credential-mapper

---

### A Final Thought

I built Credential Mapper around a simple belief: refugees and displaced professionals have skills, knowledge and potential that should not be overlooked simply because their qualifications are difficult to verify.

This project is my attempt to make that journey a little clearer, one step at a time.

**Skills do not disappear when people are displaced. Opportunities should not disappear either.** 🌍
