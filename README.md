# Arogya AI
## AI-powered medicine for Indian doctors
### Made by Arjun

---

## What this does
Doctor opens the app, selects a patient, and gets medicine recommendations with:
- Indian drug prices (from 1mg.com)
- Safety checks for kidney disease, heart failure, drug interactions
- RSSDI 2022 rules for diabetes
- CSI 2019 rules for cardiac patients
- Cheaper essential medicines shown first

---

## Folder structure
```
arogya-ai/
├── frontend/     — what the doctor sees (Next.js)
├── backend/      — the brain (Python)
├── supabase/     — database tables and data (SQL)
└── docs/         — data_sources.md (needed for evaluation)
```

---

## How to run

### Step 1 — Setup database (Supabase)
1. Go to supabase.com and create a free account
2. Create a new project
3. Open SQL Editor
4. Paste supabase/schema.sql and run it
5. Paste supabase/seed.sql and run it
6. Copy your Project URL and Key from Settings → API

### Step 2 — Start backend (Python)
```bash
cd backend
cp .env.example .env
# open .env and fill in your keys
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Check it works: open http://localhost:8000/health

### Step 3 — Start frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

---

## 6 test patients
| Patient | Issue | Expected result |
|---------|-------|----------------|
| Ramu | HbA1c too high | Add second medicine |
| Savitri | Kidney disease | Stop Metformin |
| Suresh | Heart failure | Stop Pioglitazone |
| Lakshmi | Low budget | Cheap essential medicines only |
| Venkat | Very high HbA1c | Start insulin |
| Priya | Post heart attack | Continue dual medicines |

---

## Before demo day
Open 1mg.com and check prices for:
- Teneligliptin (Tenepure 20mg)
- Empagliflozin (Jardiance 10mg)
- Metformin (Glycomet 500mg)

Update in Supabase if prices changed. Evaluators check this live.
