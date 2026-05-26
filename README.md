\# 🌏 Arogya AI 🇮🇳

\### AI-powered medicine recommendations for Indian doctors

\*\*Made by Arjun\*\*



\



\## 📋 Project Purpose



Indian doctors face a big problem — generic AI tools give medicine names that:

\- Are not available in Indian pharmacies

\- Do not show Indian brand names or ₹ prices

\- Do not follow RSSDI 2022 or CSI 2019 Indian guidelines

\- Do not check for kidney disease or heart failure before recommending



\*\*Arogya AI solves this.\*\*



It gives doctors:

\- Indian brand names with exact ₹ prices from 1mg.com

\- Safety checks — kidney function (eGFR), heart failure, drug interactions

\- Recommendations following RSSDI 2022 (diabetes) and CSI 2019 (cardiac) guidelines

\- Cheapest NLEM (essential medicines) shown first

\- WhatsApp QR reminder — doctor scans, patient gets medicine schedule on WhatsApp



\---



\## 🛠️ Tech Stack



| Part | Technology |

|------|-----------|

| Frontend | Next.js 14, React, Tailwind CSS, TypeScript |

| Backend | Python, FastAPI, Uvicorn |

| Database | Supabase (PostgreSQL) |

| AI | Language Model API |

| Reminder | WhatsApp QR Code (free, no API needed) |

| Safety Engine | Custom Python — eGFR, HF flags, drug interactions |



\---



\## 🏗️ Project Structure


arogya-ai/

├── frontend/

│   ├── app/

│   │   └── page.tsx          ← main doctor UI

│   └── components/

│       ├── PatientSelector.tsx   ← 6 test patients

│       ├── ResponsePanel.tsx     ← AI recommendation

│       ├── SafetyAlerts.tsx      ← red/yellow warnings

│       ├── CostComparison.tsx    ← cheap vs costly

│       └── ReminderForm.tsx      ← WhatsApp QR reminder

├── backend/

│   ├── main.py               ← FastAPI server

│   ├── safety\_engine.py      ← eGFR, HF, drug checks

│   ├── prompt\_composer.py    ← India-specific AI prompt

│   └── database.py           ← Supabase connection

├── supabase/

│   ├── schema.sql            ← 4 tables

│   └── seed.sql              ← 30 drugs + 16 guidelines

└── docs/

└── data\_sources.md       ← required for evaluation



\---



\## 📊 Database



\### Drugs (30 total)

\- 15 Diabetes medicines — Metformin, Teneligliptin, Empagliflozin, Insulin etc.

\- 15 Cardiac medicines — Aspirin, Clopidogrel, Ticagrelor, Atorvastatin etc.

\- All with Indian brand names and ₹ prices from 1mg.com

\- NLEM (essential medicine) flag for each drug



\### Guidelines (16 total)

\- 8 RSSDI 2022 rules for Type 2 Diabetes

\- 8 CSI 2019 rules for STEMI/ACS Cardiac



\---



\## 🧠 Safety Engine



| Check | What it does |

|-------|-------------|

| eGFR check | eGFR < 45 → stop Metformin alert |

| Heart failure | Avoid Pioglitazone, prefer Empagliflozin |

| Drug interactions | Metformin + Contrast, Spironolactone + Ramipril etc. |

| HbA1c check | Above 8% → add second drug, above 10% → start insulin |



\---



\## 👥 6 Test Patients



| Patient | Condition | Key Issue | Expected Result |

|---------|-----------|-----------|----------------|

| Ramu (Auto Driver) | Diabetes | HbA1c 8.5%, low budget | Add Teneligliptin |

| Savitri (Housewife) | Diabetes | eGFR 40 — kidney disease | Stop Metformin |

| Suresh (IT Engineer) | Both | Heart failure + Pioglitazone | Stop Pioglitazone |

| Lakshmi (Farmer) | Cardiac | Post-STEMI, low budget | NLEM medicines only |

| Venkat (Retired) | Diabetes | HbA1c 10.5% | Start insulin |

| Priya (Teacher) | Cardiac | Post-ACS, dual antiplatelet | Continue current |



\---



\## 📱 WhatsApp Reminder Feature

\*\*Completely free — no SMS cost, no API key needed.\*\*



\---



\## 🚀 How to Run



\### Step 1 — Setup Supabase

1\. Go to supabase.com → create free account

2\. Create new project

3\. Open SQL Editor

4\. Run `supabase/schema.sql`

5\. Run `supabase/seed.sql`

6\. Copy Project URL and anon key from Settings → API



\### Step 2 — Start Backend

```bash

cd arogya-ai/backend



\# Create .env file

copy .env.example .env

\# Open .env and fill in your Supabase URL and key



\# Install packages

py -3.12 -m pip install -r requirements.txt



\# Start server

py -3.12 -m uvicorn main:app --port 8000

```



Test: open `http://localhost:8000/health` → should show `{"status":"ok"}`



\### Step 3 — Start Frontend

```bash

cd arogya-ai/frontend



\# Install packages

npm install



\# Start

npm run dev

```



Open `http://localhost:3000`



\---



\## 📁 Data Sources



| Source | Used for |

|--------|---------|

| 1mg.com | Indian drug prices (checked fresh before demo) |

| RSSDI 2022 | Type 2 diabetes guidelines |

| CSI 2019 | STEMI/ACS cardiac guidelines |

| NLEM 2022 — mohfw.gov.in | Essential medicines list |



\---


\## 👨‍💻 Made by Arjun



Built as part of healthcare AI project.

Stack: Next.js + FastAPI + Supabase + WhatsApp QR





