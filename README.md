# Resume Scorer

I built this because most resume feedback tools either cost money, require an account, or give vague advice that isn't actually useful. This one runs entirely server-side, is free to use, and gives you specific, actionable recommendations.

---

## What it does

You paste your resume text and optionally a job description, select your industry, and the tool scores your resume across eight categories. Each category gets an individual score and a list of specific recommendations. At the end you get an overall score out of 100 and a prioritized list of the highest-impact changes you can make.

The eight scoring categories are:

**Keyword Match (25%)** — Checks how well your resume aligns with the job description and industry-standard terminology. If you provide a job description, scoring is based only on terms that appear in that JD. Otherwise it falls back to an industry keyword bank.

**Quantified Achievements (15%)** — Looks for numbers, percentages, dollar amounts, and other measurable outcomes in your bullet points. Bullet points without any metrics get flagged as vague.

**Action Verb Usage (10%)** — Checks whether your bullets start with strong past-tense action verbs and penalizes repetition. Rewards power verbs like "spearheaded", "architected", and "orchestrated".

**Contact and Header (10%)** — Verifies that your resume includes an email, phone number, LinkedIn URL, and location.

**Skills Section (15%)** — Checks for a dedicated skills section and counts how many relevant technical skills and tools are mentioned.

**Work Experience (15%)** — Looks for date ranges, job titles, bullet count, and overall word count to assess how well your experience is documented.

**Education and Certifications (5%)** — Detects degrees, schools, and certifications.

**Formatting (5%)** — Checks word count, number of sections, line length, and readability signals.

---

## Supported industries

Software engineering, product management, marketing, data science, finance, sales, design, healthcare, and a general fallback for everything else.

---

## Tech stack

- Frontend: vanilla HTML, CSS, and JavaScript — no frameworks
- Backend: JavaScript serverless function running on Netlify Functions
- Hosting: Netlify free tier
- No external APIs, no dependencies, no database

The scoring logic is entirely rule-based using regular expressions and keyword matching. It runs in a single serverless function that gets called when you hit the Analyze button.

---

## Running it locally

Clone the repo and install the Netlify CLI:

```bash
git clone https://github.com/drewsavino/resume-scorer1.git
cd resume-scorer1
npm install -g netlify-cli
netlify dev
```

Then open `http://localhost:8888` in your browser. The CLI runs the function and serves the static frontend together.

---

## Project structure

```
resume-scorer1/
├── netlify/
│   └── functions/
│       └── api.js          # Serverless function — all scoring logic lives here
├── static/
│   └── index.html          # Frontend
├── netlify.toml            # Routing and build config
├── requirements.txt        # Empty — no Python dependencies
├── runtime.txt             # Legacy Python version reference
└── README.md
```

---

## Customizing

To add keywords to an existing industry, find the `KEYWORD_BANKS` object in `netlify/functions/api.js` and add terms to the `technical`, `soft`, `tools`, or `action` arrays for that industry.

To add a new industry, add a new key to `KEYWORD_BANKS` with those four arrays, then add a corresponding `<option>` tag to the dropdown in `static/index.html`.

To adjust scoring weights, edit the `WEIGHTS` object near the bottom of `api.js`. Values should add up to 1.

---

## Limitations

The scoring is rule-based, not AI-powered, so it has the limitations that come with that. It cannot read formatting from PDF or Word files — you need to paste plain text. It may miss keywords that are phrased in an unusual way. And like any automated tool, a high score does not guarantee a good resume — it just means the resume covers the signals this tool knows how to check for.

---

## Deployment

The site deploys automatically from this repo via Netlify. Any push to `main` triggers a redeploy. Build settings are defined in `netlify.toml` — publish directory is `static`, build command is empty.
