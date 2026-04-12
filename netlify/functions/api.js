// netlify/functions/api.js
// Full resume scoring engine ported from scorer.py — no API key needed.

// ─── KEYWORD BANKS ────────────────────────────────────────────────────────────
const KEYWORD_BANKS = {
  // ── EXISTING ROLES (refined) ───────────────────────────────────────────────
  software: {
    technical: ["agile","git","api","rest","restful","ci/cd","unit testing","microservices","debugging","deployment","version control","docker","kubernetes","cloud","aws","azure","gcp","sql","nosql","algorithms","data structures","oop","object-oriented","typescript","python","java","javascript","node","react","angular","vue","devops","terraform","graphql","linux","bash","redis","kafka","system design","scalability","load balancing","caching","tdd","code review","pull request","serverless","event-driven"],
    soft: ["collaboration","communication","problem-solving","leadership","mentoring","ownership","initiative","adaptability","teamwork","critical thinking","attention to detail","self-motivated"],
    tools: ["jira","confluence","github","gitlab","jenkins","postman","vs code","figma","slack","linear","datadog","splunk","sonarqube","circleci","new relic","pagerduty"],
    action: ["built","developed","architected","engineered","deployed","optimized","refactored","designed","launched","implemented","maintained","integrated","automated","scaled","debugged","shipped","migrated","modernized","reduced","improved"],
  },
  product: {
    technical: ["budget management","p&l","forecasting","headcount","resource planning","kpi","okr","roadmap","strategic planning","project management","risk management","change management","performance management","process improvement","vendor management","stakeholder management","cross-functional","reporting","compliance","governance","scope management","capacity planning","workforce planning","cost reduction","operational efficiency","business case","quarterly review","metrics","roi","sla"],
    soft: ["leadership","communication","decision-making","delegation","accountability","conflict resolution","negotiation","mentoring","coaching","adaptability","strategic thinking","empathy","influence","integrity","vision"],
    tools: ["microsoft office","excel","powerpoint","slack","zoom","jira","confluence","asana","monday","notion","tableau","power bi","workday","sap","salesforce"],
    action: ["led","managed","directed","oversaw","spearheaded","built","grew","developed","established","launched","drove","aligned","championed","improved","reduced","scaled","restructured","hired","mentored","delivered"],
  },
  marketing: {
    technical: ["seo","sem","ppc","conversion rate","ctr","cpa","roas","brand awareness","content strategy","funnel","lead generation","crm","email marketing","social media","engagement","target audience","demand generation","account-based marketing","abm","marketing automation","google analytics","google ads","facebook ads","copywriting","campaign management","a/b testing","inbound","outbound","pipeline","mrr","attribution modeling","lifecycle marketing","performance marketing","organic traffic","paid media"],
    soft: ["creativity","communication","storytelling","collaboration","analytical thinking","leadership","adaptability","persuasion","attention to detail","project management"],
    tools: ["hubspot","marketo","salesforce","mailchimp","hootsuite","google analytics","semrush","ahrefs","canva","zapier","wordpress","google tag manager","klaviyo","pardot","drift"],
    action: ["launched","grew","increased","drove","managed","created","optimized","developed","executed","analyzed","generated","improved","built","crafted","coordinated","scaled","tested"],
  },
  data: {
    technical: ["machine learning","python","sql","data pipeline","model training","statistical analysis","data visualization","etl","feature engineering","regression","classification","clustering","neural network","deep learning","pandas","numpy","scikit-learn","tensorflow","pytorch","spark","hadoop","tableau","power bi","r","a/b testing","hypothesis testing","bigquery","snowflake","dbt","mlops","data wrangling","time series","nlp","causal inference","experimentation","dashboarding","data governance"],
    soft: ["analytical thinking","communication","problem-solving","collaboration","curiosity","attention to detail","stakeholder management","critical thinking","adaptability","initiative","ownership"],
    tools: ["jupyter","databricks","airflow","dbt","mlflow","looker","tableau","power bi","git","docker","mode","hex","streamlit"],
    action: ["built","developed","analyzed","modeled","predicted","optimized","cleaned","processed","trained","deployed","visualized","automated","identified","validated","designed","reduced","improved","surfaced","productionized"],
  },
  finance: {
    technical: ["financial modeling","forecasting","p&l","budget","variance analysis","roi","gaap","ifrs","audit","reconciliation","accounts payable","accounts receivable","dcf","risk management","compliance","financial statements","excel","vba","bloomberg","valuations","m&a","due diligence","capex","opex","cash flow","ebitda","financial analysis","reporting","three-statement model","sensitivity analysis","lbo","irr","npv","working capital","equity research"],
    soft: ["attention to detail","analytical thinking","communication","integrity","problem-solving","time management","leadership","stakeholder management","discretion","critical thinking"],
    tools: ["excel","sap","oracle","quickbooks","bloomberg","refinitiv","tableau","power bi","hyperion","workday","netsuite","adaptive"],
    action: ["analyzed","managed","forecasted","built","reduced","improved","reconciled","audited","prepared","developed","led","optimized","monitored","reported","evaluated","modeled"],
  },
  sales: {
    technical: ["crm","pipeline management","prospecting","lead generation","quota","revenue","account management","business development","cold calling","saas","b2b","b2c","negotiation","closing","upselling","cross-selling","sales cycle","territory management","forecasting","deal management","salesforce","outreach","cadence","annual recurring revenue","arr","mrr","win rate","average deal size","discovery call","demo","objection handling","solution selling"],
    soft: ["communication","persuasion","resilience","empathy","active listening","relationship building","time management","adaptability","motivation","coachability","competitive drive"],
    tools: ["salesforce","hubspot","outreach","salesloft","linkedin sales navigator","zoominfo","gong","chorus","pipedrive","slack","apollo","clari"],
    action: ["closed","generated","grew","built","managed","exceeded","negotiated","prospected","developed","achieved","led","increased","retained","expanded","sourced","accelerated"],
  },
  healthcare: {
    technical: ["patient care","clinical","ehr","emr","hipaa","epic","cerner","diagnostics","medication management","care coordination","evidence-based","protocols","icd","cpt","billing","coding","treatment planning","discharge planning","triage","documentation","quality improvement","case management","infection control","patient safety","telehealth","clinical trials","regulatory compliance","patient outcomes"],
    soft: ["compassion","communication","teamwork","attention to detail","critical thinking","empathy","time management","adaptability","professionalism","resilience","active listening"],
    tools: ["epic","cerner","meditech","athenahealth","allscripts","microsoft office","zoom","slack","dragon medical","pyxis"],
    action: ["managed","assessed","developed","coordinated","provided","implemented","documented","monitored","collaborated","educated","improved","delivered","facilitated","led","administered","reduced","streamlined","trained"],
  },
  general: {
    technical: ["project management","agile","stakeholder","budget","reporting","analysis","strategy","planning","documentation","research","implementation","process improvement","kpi","metrics","roi","compliance","risk management","quality assurance","training","vendor management","cross-functional","change management"],
    soft: ["leadership","communication","teamwork","problem-solving","adaptability","time management","initiative","collaboration","critical thinking","attention to detail","accountability"],
    tools: ["microsoft office","excel","word","powerpoint","google workspace","slack","zoom","trello","asana","monday","notion","salesforce"],
    action: ["led","managed","developed","implemented","improved","coordinated","analyzed","created","built","delivered","executed","established","supported","trained","facilitated"],
  },

  // ── NEW ROLES ──────────────────────────────────────────────────────────────
  web_developer: {
    technical: ["html5","css3","javascript","typescript","react","vue","angular","node.js","rest api","graphql","responsive design","git","webpack","vite","ci/cd","sql","nosql","docker","web performance","accessibility","wcag","jest","cypress","ui/ux","component library","state management","cross-browser compatibility","progressive web app","pwa","web security","oauth","jwt","agile","cloud deployment"],
    soft: ["problem-solving","collaboration","communication","attention to detail","adaptability","ownership","initiative","teamwork","continuous learning","time management"],
    tools: ["github","gitlab","vs code","figma","postman","jira","vercel","netlify","aws","azure","google cloud","storybook","linear","slack","chromatic"],
    action: ["built","developed","designed","deployed","optimized","refactored","integrated","implemented","launched","shipped","migrated","maintained","automated","improved","architected","debugged","styled","tested","reduced","accelerated"],
  },
  cybersecurity: {
    technical: ["penetration testing","vulnerability management","siem","incident response","risk assessment","zero trust","threat intelligence","identity and access management","iam","firewalls","ids","ips","intrusion detection","nist","iso 27001","soc 2","compliance","encryption","pki","malware analysis","forensics","ethical hacking","red team","blue team","soc","endpoint detection","edr","dlp","hipaa","pci-dss","gdpr","cloud security","owasp","python","bash scripting","security auditing","devsecops"],
    soft: ["analytical thinking","attention to detail","communication","problem-solving","integrity","adaptability","critical thinking","collaboration","discretion","resilience"],
    tools: ["splunk","qradar","crowdstrike","palo alto","wireshark","nessus","burp suite","metasploit","kali linux","snort","sentinel","microsoft defender","qualys","rapid7","tenable"],
    action: ["identified","mitigated","investigated","monitored","detected","responded","hardened","implemented","assessed","analyzed","remediated","documented","developed","automated","led","trained","reduced","enforced","architected","tested"],
  },
  cloud_computing: {
    technical: ["aws","azure","gcp","google cloud","terraform","kubernetes","docker","infrastructure as code","ci/cd","microservices","serverless","devops","auto-scaling","load balancing","vpc","networking","iam","rbac","cloud migration","cost optimization","high availability","disaster recovery","linux","python","bash","monitoring","observability","service mesh","cloud-native","multi-cloud","site reliability","sre","sla","platform engineering"],
    soft: ["problem-solving","collaboration","communication","adaptability","ownership","critical thinking","attention to detail","leadership","continuous learning","initiative"],
    tools: ["terraform","ansible","kubernetes","helm","datadog","prometheus","grafana","jenkins","github actions","argocd","cloudformation","pulumi","pagerduty","new relic","vault"],
    action: ["architected","deployed","automated","migrated","optimized","designed","built","implemented","managed","reduced","provisioned","monitored","scaled","engineered","secured","streamlined","improved","maintained","led","integrated"],
  },
  ai_ml: {
    technical: ["machine learning","deep learning","python","tensorflow","pytorch","nlp","natural language processing","llm","large language model","generative ai","transformers","rag","retrieval augmented generation","prompt engineering","fine-tuning","model training","neural network","computer vision","feature engineering","scikit-learn","pandas","numpy","mlops","a/b testing","statistical analysis","data preprocessing","embeddings","vector database","reinforcement learning","model evaluation","sql","cloud ml","sagemaker","vertex ai","azure ml"],
    soft: ["analytical thinking","curiosity","communication","problem-solving","collaboration","attention to detail","critical thinking","research mindset","adaptability","ownership"],
    tools: ["jupyter","hugging face","mlflow","wandb","databricks","airflow","dbt","docker","github","langchain","openai api","pinecone","weaviate","streamlit","fastapi"],
    action: ["trained","built","developed","deployed","optimized","fine-tuned","designed","researched","implemented","evaluated","improved","automated","analyzed","modeled","reduced","productionized","integrated","scaled","benchmarked","shipped"],
  },
  it_helpdesk: {
    technical: ["active directory","windows","macos","linux","troubleshooting","itil","hardware support","software support","vpn","remote support","office 365","microsoft 365","google workspace","tcp/ip","networking","ticketing system","sla","asset management","mobile device management","mdm","imaging","deployment","printer support","endpoint security","antivirus","patch management","password reset","user onboarding","escalation management","help desk","service desk","knowledge base"],
    soft: ["customer service","communication","patience","problem-solving","attention to detail","time management","teamwork","adaptability","empathy","active listening","multitasking"],
    tools: ["servicenow","jira service management","zendesk","freshdesk","teamviewer","anydesk","solarwinds","lansweeper","microsoft intune","jamf","connectwise","remedy"],
    action: ["resolved","supported","troubleshot","diagnosed","escalated","documented","configured","installed","managed","trained","maintained","onboarded","monitored","coordinated","improved","reduced","implemented","automated","responded","deployed"],
  },
  data_engineer: {
    technical: ["sql","python","etl","elt","data pipeline","apache spark","kafka","airflow","dbt","data warehouse","snowflake","bigquery","redshift","data modeling","dimensional modeling","data lakehouse","delta lake","aws","azure","gcp","data quality","data governance","streaming data","batch processing","rest api","nosql","mongodb","cassandra","pyspark","pandas","data catalog","data lineage","orchestration","infrastructure as code","ci/cd"],
    soft: ["problem-solving","collaboration","communication","attention to detail","analytical thinking","ownership","adaptability","critical thinking","stakeholder management","continuous learning"],
    tools: ["airflow","dbt","spark","kafka","databricks","snowflake","terraform","docker","kubernetes","github","git","fivetran","stitch","great expectations","prefect","dagster"],
    action: ["built","designed","developed","deployed","optimized","automated","engineered","migrated","integrated","maintained","implemented","reduced","scaled","monitored","orchestrated","modeled","improved","architected","processed","transformed"],
  },
  design: {
    technical: ["ux","ui","user experience","user interface","user research","usability testing","wireframing","prototyping","interaction design","visual design","information architecture","design systems","typography","color theory","accessibility","wcag","responsive design","mobile design","web design","brand identity","motion design","illustration","figma","sketch","adobe xd","invision","zeroheight","component library","design tokens","heuristic evaluation","a/b testing","conversion rate optimization","content strategy"],
    soft: ["creativity","empathy","communication","collaboration","problem-solving","attention to detail","storytelling","adaptability","critical thinking","time management","leadership","user advocacy"],
    tools: ["figma","sketch","adobe xd","adobe illustrator","adobe photoshop","invision","zeplin","miro","notion","jira","confluence","framer","principle","maze","hotjar","optimal workshop","lottie","storybook"],
    action: ["designed","created","built","developed","prototyped","tested","iterated","launched","delivered","improved","optimized","established","led","collaborated","defined","researched","crafted","simplified","elevated","validated"],
  },
};

const STRONG_VERBS = new Set(["spearheaded","orchestrated","architected","engineered","championed","launched","optimized","transformed","accelerated","galvanized","catalyzed","mobilized","pioneered","revolutionized","streamlined"]);

const ALL_ACTION_VERBS = new Set(["spearheaded","orchestrated","mentored","championed","directed","led","managed","supervised","built","developed","architected","engineered","deployed","launched","created","designed","implemented","optimized","streamlined","improved","enhanced","transformed","analyzed","evaluated","assessed","drove","delivered","executed","generated","achieved","exceeded","increased","reduced","decreased","grew","scaled","negotiated","collaborated","facilitated","trained","researched","presented","coordinated","established","defined","identified","automated","integrated","maintained","supported","contributed","owned","founded","pioneered","revamped","restructured","overhauled","migrated","resolved","troubleshot","diagnosed","hardened","mitigated","provisioned","productionized","benchmarked","fine-tuned","onboarded","remediated","modeled","processed","transformed","secured","monitored","enforced","shipped","styled","tested"]);

const ACTION_VERB_ALTERNATIVES = {
  Leadership:  ["Spearheaded","Orchestrated","Mentored","Championed","Directed","Galvanized","Mobilized"],
  Building:    ["Architected","Engineered","Deployed","Launched","Constructed","Devised","Instituted"],
  Improving:   ["Optimized","Streamlined","Accelerated","Enhanced","Transformed","Revamped","Elevated"],
  Analyzing:   ["Evaluated","Assessed","Diagnosed","Benchmarked","Modeled","Synthesized","Investigated"],
  Delivering:  ["Executed","Shipped","Produced","Generated","Achieved","Exceeded","Surpassed"],
};

const REWRITE_EXAMPLES = [
  { before: "Responsible for managing a team", after: "Led a cross-functional team of 8 engineers, improving sprint velocity by 34% over 6 months" },
  { before: "Worked on improving the website", after: "Redesigned core landing pages, boosting conversion rate by 22% and reducing bounce rate by 15%" },
  { before: "Helped with sales activities", after: "Generated $2.4M in new ARR by developing a targeted outbound strategy across 3 verticals" },
  { before: "Did data analysis projects", after: "Built predictive churn model using Python + scikit-learn, reducing customer attrition by 18% ($1.2M saved annually)" },
];

const WEIGHTS = { kw: 0.25, ach: 0.15, verbs: 0.10, contact: 0.10, skills: 0.15, exp: 0.15, edu: 0.05, fmt: 0.05 };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s\/\-]/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function extractBullets(text) {
  const bullets = [];
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line.length < 20) continue;
    if (/^[•\-*·–—]/.test(line) || /^\d+\./.test(line) || (line.length < 220 && /^[A-Z]/.test(line))) {
      bullets.push(line.replace(/^[•\-*·–—\s]+/, "").trim());
    }
  }
  return bullets;
}

function hasQuantification(line) {
  const patterns = [
    /\d+\s*%/,
    /\$[\d,]+/,
    /[\d,]+\s*(k\b|million|billion)/i,
    /\d+\s*(users|customers|clients|people|employees|team members)/i,
    /\d+\s*(projects|features|products|applications|services|tickets|incidents)/i,
    /\d+\s*(hours|days|weeks|months|years)/i,
    /(increased|decreased|reduced|improved|grew|saved|generated).{0,30}\d+/i,
    /\d+x\b/,
    /\bx\d+\b/,
  ];
  return patterns.some(p => p.test(line));
}

function detectContactInfo(text) {
  const norm = normalize(text);
  return {
    email:    /[\w.\-]+@[\w.\-]+\.\w+/.test(text),
    phone:    /\(?\d{3}\)?[\s\-\.]\d{3}[\s\-\.]\d{4}/.test(text),
    linkedin: norm.includes("linkedin"),
    location: /(new york|san francisco|chicago|austin|seattle|boston|remote|usa|[a-z]{2},\s*[a-z]{2})/i.test(text),
    name:     (text.trim().split("\n")[0] || "").trim().length > 3,
  };
}

function detectSections(text) {
  return {
    experience:   /experience|employment|work history|career/i.test(text),
    skills:       /skills|technical|competencies|expertise|proficiencies/i.test(text),
    education:    /education|degree|university|college|bachelor|master|phd|certification/i.test(text),
    summary:      /summary|objective|profile|about me/i.test(text),
    achievements: /achievements|accomplishments|awards|honors/i.test(text),
  };
}

// ─── SCORING ──────────────────────────────────────────────────────────────────
function scoreKeywords(resumeNorm, jdNorm, industry) {
  const bank = KEYWORD_BANKS[industry] || KEYWORD_BANKS.general;
  const allTerms = [...new Set(Object.values(bank).flat())];
  let sourceTerms = allTerms;
  if (jdNorm.length > 100) {
    const jdTerms = allTerms.filter(t => jdNorm.includes(t));
    sourceTerms = jdTerms.length >= 10 ? [...new Set(jdTerms)] : allTerms;
  }
  const found   = sourceTerms.filter(t => resumeNorm.includes(t));
  const missing = sourceTerms.filter(t => !resumeNorm.includes(t));
  const total   = Math.max(sourceTerms.length, 1);
  return { score: Math.min(Math.round((found.length / total) * 100), 100), found: found.slice(0,30), missing: missing.slice(0,30), total };
}

function scoreAchievements(text) {
  const bullets = extractBullets(text);
  if (!bullets.length) return { score: 20, quantified: [], vague: [], total: 0 };
  const quantified = bullets.filter(hasQuantification);
  const vague      = bullets.filter(b => !hasQuantification(b));
  const ratio      = quantified.length / bullets.length;
  const bonus      = quantified.length >= 3 ? 10 : 0;
  return { score: Math.min(Math.round(ratio * 100) + bonus, 100), quantified: quantified.slice(0,6), vague: vague.slice(0,6), total: bullets.length };
}

function scoreActionVerbs(text) {
  const bullets = extractBullets(text);
  const verbCounts = {};
  for (const bullet of bullets) {
    const clean = bullet.toLowerCase().replace(/^[\-•*\d.\s]+/, "").trim();
    const firstWord = (clean.split(/\s+/)[0] || "");
    if (ALL_ACTION_VERBS.has(firstWord)) verbCounts[firstWord] = (verbCounts[firstWord] || 0) + 1;
  }
  const unique      = Object.keys(verbCounts).length;
  const repeated    = Object.entries(verbCounts).filter(([,c]) => c > 2).map(([v,c]) => `${v} (×${c})`);
  const strongCount = Object.keys(verbCounts).filter(v => STRONG_VERBS.has(v)).length;
  let score = Math.min(unique * 8 + strongCount * 5, 100);
  score = Math.max(score - repeated.length * 8, 10);
  return { score: Math.round(score), verb_counts: verbCounts, repeated, unique };
}

function scoreContact(text) {
  const contact = detectContactInfo(text);
  const checks  = Object.values(contact);
  const score   = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  return { score, ...contact };
}

function scoreSkills(text, industry) {
  const norm     = normalize(text);
  const bank     = KEYWORD_BANKS[industry] || KEYWORD_BANKS.general;
  const sections = detectSections(text);
  let score      = sections.skills ? 30 : 0;
  const techFound  = bank.technical.filter(t => norm.includes(t)).length;
  const toolsFound = bank.tools.filter(t => norm.includes(t)).length;
  score += Math.min(techFound * 4, 50);
  score += Math.min(toolsFound * 4, 20);
  return { score: Math.min(score, 100), has_skills_section: sections.skills, tech_found: techFound, tools_found: toolsFound };
}

function scoreExperience(text) {
  const bullets   = extractBullets(text);
  const sections  = detectSections(text);
  const wordCount = countWords(text);
  const hasYears  = /\d{4}\s*[-–]\s*(\d{4}|present|current)/i.test(text);
  const hasTitles = /engineer|manager|analyst|developer|designer|director|lead|coordinator|specialist|consultant|architect|administrator|technician|scientist|security|cloud|devops|sre|helpdesk|help desk|support|full.?stack|front.?end|back.?end|web developer|software developer/i.test(text);
  let score = 0;
  if (sections.experience) score += 20;
  if (hasYears)            score += 20;
  if (hasTitles)           score += 15;
  score += Math.min(bullets.length * 5, 30);
  if (wordCount > 300)     score += 15;
  return { score: Math.min(score, 100), bullet_count: bullets.length, has_years: hasYears, has_titles: hasTitles, word_count: wordCount };
}

function scoreEducation(text) {
  const hasDegree = /bachelor|master|phd|doctorate|associate|b\.s\.|m\.s\.|m\.b\.a|b\.a\.|b\.e\.|b\.tech/i.test(text);
  const hasCert   = /certified|certification|certificate|license|credential|aws|azure|gcp|google cert|pmp|cpa|cfa|cissp|cism|cisa|ceh|comptia|security\+|network\+|a\+|cysa\+|ccna|ccnp|ccsp|oscp|tensorflow cert|coursera|udacity|itil|microsoft cert|terraform associate|kubernetes|ckad|cka/i.test(text);
  const hasSchool = /university|college|institute|school|bootcamp/i.test(text);
  let score = 0;
  if (hasDegree) score += 50;
  if (hasSchool) score += 20;
  if (hasCert)   score += 30;
  return { score: Math.min(score, 100), has_degree: hasDegree, has_cert: hasCert, has_school: hasSchool };
}

function scoreFormatting(text) {
  const lines     = text.split("\n");
  const wordCount = countWords(text);
  const avgLine   = lines.reduce((s, l) => s + l.length, 0) / Math.max(lines.length, 1);
  const allCaps   = lines.filter(l => l.length > 5 && l === l.toUpperCase() && /[A-Z]{4,}/.test(l)).length;
  const sections  = detectSections(text);
  const secCount  = Object.values(sections).filter(Boolean).length;
  let score = 50;
  if (wordCount >= 300 && wordCount <= 800) score += 20;
  else if (wordCount > 800)                 score += 5;
  if (avgLine < 120)  score += 15;
  if (allCaps < 5)    score += 15;
  score += secCount * 5;
  return { score: Math.min(score, 100), word_count: wordCount, sec_count: secCount };
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
function generateFeedback(scores) {
  const { kw, ach, verbs, contact, skills, exp, edu, fmt } = scores;

  const kwFeedback = () => {
    let explanation = kw.score < 50 ? `Only ${kw.found.length} of ${kw.total} key terms found — major gap.`
      : kw.score < 75 ? `Good start, but ${kw.missing.length} important terms are still missing.`
      : "Strong keyword alignment — most critical terms are present.";
    const recs = [];
    if (kw.missing.length) {
      const top5 = kw.missing.slice(0,5).join(", ");
      const more = kw.missing.length > 5 ? ` (+${kw.missing.length-5} more)` : "";
      recs.push(`Add these missing keywords: ${top5}${more}.`);
    }
    recs.push("Mirror the exact phrasing from the job description wherever possible.");
    recs.push("Add a dedicated 'Technical Skills' section listing all relevant technologies.");
    if (kw.missing.length > 8) recs.push("Consider tailoring this resume specifically for each application.");
    return { explanation, recs };
  };

  const achFeedback = () => {
    const total = Math.max(ach.total, 1);
    const pct   = Math.round((ach.quantified.length / total) * 100);
    const explanation = ach.total === 0
      ? "No bullet points detected — structure your experience with bullet points."
      : `${ach.quantified.length} of ${ach.total} bullet points (${pct}%) contain measurable outcomes.`;
    const recs = [];
    if (ach.vague.length) recs.push(`Add numbers to ${Math.min(ach.vague.length,5)} vague bullets.`);
    recs.push("Include percentages, dollar values, timeframes, or team sizes.");
    recs.push('Ask yourself: "How much? How many? By when?" for every bullet point.');
    if (ach.quantified.length < 3) recs.push("Aim for at least 5–7 quantified achievements across your resume.");
    return { explanation, recs };
  };

  const verbFeedback = () => {
    const repStr = verbs.repeated.length ? ` Repeated: ${verbs.repeated.join(", ")}.` : "";
    const explanation = verbs.unique === 0
      ? "No action verbs detected at the start of bullet points."
      : `${verbs.unique} unique action verb(s) found.${repStr}`;
    const recs = [];
    if (verbs.repeated.length) recs.push(`Replace repeated verbs (${verbs.repeated.join(", ")}) with stronger alternatives.`);
    recs.push("Begin every bullet point with a strong past-tense action verb.");
    recs.push("Use power verbs like Spearheaded, Architected, Orchestrated, Championed.");
    if (verbs.unique < 5) recs.push("Diversify your verbs — avoid starting multiple bullets with the same word.");
    return { explanation, recs };
  };

  const contactFeedback = () => {
    const missing = [];
    if (!contact.email)    missing.push("email");
    if (!contact.phone)    missing.push("phone number");
    if (!contact.linkedin) missing.push("LinkedIn URL");
    if (!contact.location) missing.push('location or "Remote"');
    const explanation = missing.length === 0
      ? "Header is complete with all key contact details."
      : `Missing from header: ${missing.join(", ")}.`;
    const recs = [];
    if (!contact.linkedin) recs.push("Add your LinkedIn profile URL — recruiters always check.");
    if (!contact.email)    recs.push("Include a professional email address.");
    if (!contact.location) recs.push('Add your city/state or "Remote".');
    recs.push("Keep contact info on one clean line at the very top.");
    return { explanation, recs };
  };

  const skillsFeedback = () => {
    const explanation = skills.has_skills_section
      ? `Skills section detected. ${skills.tech_found} technical and ${skills.tools_found} tool keywords found.`
      : "No dedicated Skills section found — this is a major gap.";
    const recs = [];
    if (!skills.has_skills_section) recs.push("Add a 'Technical Skills' or 'Core Competencies' section immediately.");
    recs.push("List skills in categories: Languages, Frameworks, Tools, Platforms, Soft Skills.");
    recs.push("Include all tools and technologies you are proficient in, even if used briefly.");
    if (skills.tech_found < 5) recs.push("Expand your technical skill set mentions throughout the resume.");
    return { explanation, recs };
  };

  const expFeedback = () => {
    let explanation;
    if (exp.has_years && exp.has_titles) {
      explanation = `Experience section well-structured. ${exp.bullet_count} bullet points found.`;
    } else {
      const parts = [];
      if (!exp.has_years)  parts.push("dates missing");
      if (!exp.has_titles) parts.push("job titles unclear");
      explanation = `Experience section needs improvement — ${parts.join(", ")}.`;
    }
    const recs = [];
    if (!exp.has_years)        recs.push("Add date ranges (MM/YYYY – MM/YYYY) to every role.");
    if (exp.bullet_count < 6)  recs.push("Add more bullet points per role — aim for 3–6 per position.");
    if (exp.word_count < 300)  recs.push("Resume seems short — expand descriptions for each role you held.");
    recs.push("List most recent experience first (reverse chronological order).");
    return { explanation, recs };
  };

  const eduFeedback = () => {
    const explanation = edu.has_degree
      ? `Degree detected.${edu.has_cert ? " Certifications also found — great!" : ""}`
      : `No degree detected. ${edu.has_cert ? "Certifications found." : "Consider adding certifications."}`;
    const recs = [];
    if (!edu.has_degree) recs.push("If you have a degree, make sure it's clearly listed with institution and year.");
    if (!edu.has_cert)   recs.push("Add relevant certifications (AWS, CompTIA, CISSP, Google, Azure, ITIL, etc.).");
    recs.push("Include GPA if above 3.5 and within the last 5 years.");
    recs.push("List relevant coursework or academic projects if early in career.");
    return { explanation, recs };
  };

  const fmtFeedback = () => {
    let explanation;
    if (fmt.word_count < 200)       explanation = "Resume appears very short — likely missing significant content.";
    else if (fmt.word_count > 900)  explanation = `Resume may be too long (${fmt.word_count} words) — aim for 400–700 words for most roles.`;
    else                            explanation = `Good length (${fmt.word_count} words). ${fmt.sec_count} main sections detected.`;
    const recs = [];
    if (fmt.word_count < 300) recs.push("Expand the resume — add more details about your roles and achievements.");
    if (fmt.word_count > 900) recs.push("Consider trimming — remove older or less relevant content.");
    recs.push("Use consistent formatting: same font, size, and spacing throughout.");
    recs.push("Use clear section headers (Experience, Skills, Education) in a consistent style.");
    if (fmt.sec_count < 3) recs.push("Add missing sections — at minimum: Contact, Experience, Skills, Education.");
    return { explanation, recs };
  };

  return { kw: kwFeedback(), ach: achFeedback(), verbs: verbFeedback(), contact: contactFeedback(), skills: skillsFeedback(), exp: expFeedback(), edu: eduFeedback(), fmt: fmtFeedback() };
}

// ─── OVERALL ──────────────────────────────────────────────────────────────────
function calcOverall(scores) {
  return Math.round(Object.entries(WEIGHTS).reduce((s, [k, w]) => s + scores[k].score * w, 0));
}

function getGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  return "F";
}

function buildExecutiveSummary(scores, overall) {
  const strengths = [], gaps = [];
  if (scores.kw.score      >= 70) strengths.push("strong keyword alignment"); else gaps.push("keyword gaps");
  if (scores.ach.score     >= 70) strengths.push("quantified achievements");  else gaps.push("lack of measurable outcomes");
  if (scores.verbs.score   >= 70) strengths.push("varied action verbs");      else gaps.push("weak action verbs");
  if (scores.skills.score  >= 70) strengths.push("solid skills section");     else gaps.push("underdeveloped skills section");
  if (scores.contact.score >= 80) strengths.push("complete contact info");    else gaps.push("incomplete header");
  let summary = `Overall score of ${overall}/100. `;
  if (strengths.length) summary += `Strengths: ${strengths.slice(0,2).join(", ")}. `;
  if (gaps.length)      summary += `Primary gaps: ${gaps.slice(0,2).join(", ")}.`;
  return summary.trim();
}

function generatePriorities(scores, feedbacks) {
  const items = [
    { label: "Add missing keywords",      detail: feedbacks.kw.recs[0]      || "Mirror job description language.", gain: Math.round((100 - scores.kw.score)      * 0.25 * 0.5), effort: "quick" },
    { label: "Quantify achievements",     detail: feedbacks.ach.recs[0]     || "Add numbers to vague bullets.",   gain: Math.round((100 - scores.ach.score)     * 0.15 * 0.6), effort: "major" },
    { label: "Strengthen action verbs",   detail: feedbacks.verbs.recs[0]   || "Replace weak openers.",           gain: Math.round((100 - scores.verbs.score)   * 0.10 * 0.7), effort: "quick" },
    { label: "Improve skills section",    detail: feedbacks.skills.recs[0]  || "Add a Technical Skills section.", gain: Math.round((100 - scores.skills.score)  * 0.15 * 0.5), effort: "quick" },
    { label: "Complete contact info",     detail: feedbacks.contact.recs[0] || "Add missing contact details.",    gain: Math.round((100 - scores.contact.score) * 0.10 * 0.8), effort: "quick" },
    { label: "Expand experience details", detail: feedbacks.exp.recs[0]     || "Add dates and more bullet points.",gain: Math.round((100 - scores.exp.score)    * 0.15 * 0.4), effort: "major" },
  ];
  return items.sort((a,b) => b.gain - a.gain).slice(0,5).map((item, i) => ({ ...item, rank: i+1 }));
}

function scoreResume(resumeText, jdText = "", industry = "general") {
  const resumeNorm = normalize(resumeText);
  const jdNorm     = normalize(jdText);
  const scores = {
    kw:      scoreKeywords(resumeNorm, jdNorm, industry),
    ach:     scoreAchievements(resumeText),
    verbs:   scoreActionVerbs(resumeText),
    contact: scoreContact(resumeText),
    skills:  scoreSkills(resumeText, industry),
    exp:     scoreExperience(resumeText),
    edu:     scoreEducation(resumeText),
    fmt:     scoreFormatting(resumeText),
  };
  const feedbacks = generateFeedback(scores);
  const overall   = calcOverall(scores);
  return {
    overall,
    grade:             getGrade(overall),
    executive_summary: buildExecutiveSummary(scores, overall),
    scores,
    feedbacks,
    priorities:        generatePriorities(scores, feedbacks),
    rewrite_examples:  REWRITE_EXAMPLES,
    verb_alternatives: ACTION_VERB_ALTERNATIVES,
  };
}

// ─── NETLIFY HANDLER ──────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type":                 "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };
  if (event.httpMethod !== "POST")    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid JSON body" }) }; }

  const resumeText = (body.resume || "").trim();
  const jdText     = (body.jd     || "").trim();
  const industry   = (body.industry || "general").trim();

  if (resumeText.length < 50) return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Resume text is too short. Please paste the full resume." }) };

  try {
    const result = scoreResume(resumeText, jdText, industry);
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: `Scoring failed: ${err.message}` }) };
  }
};
