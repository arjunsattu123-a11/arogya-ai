-- ============================================
-- AROGYA AI - Supabase Database Schema
-- ============================================

-- Table 1: Drugs (Indian brands + prices)
CREATE TABLE drugs (
  id SERIAL PRIMARY KEY,
  generic_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'diabetes' or 'cardiac'
  price_inr NUMERIC NOT NULL,      -- price in Indian Rupees
  pack_size TEXT NOT NULL,         -- e.g. '10 tablets'
  on_nlem BOOLEAN DEFAULT FALSE,   -- National List of Essential Medicines
  dose_form TEXT,                  -- tablet, injection, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: Guidelines (RSSDI + CSI)
CREATE TABLE guidelines (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,            -- 'RSSDI 2022' or 'CSI 2019'
  condition TEXT NOT NULL,         -- 'type2_diabetes' or 'acs_stemi'
  recommendation TEXT NOT NULL,   -- the actual guideline text
  hba1c_threshold TEXT,            -- e.g. '>8%' (for diabetes only)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 3: Drug Interactions (safety checks)
CREATE TABLE drug_interactions (
  id SERIAL PRIMARY KEY,
  drug_a TEXT NOT NULL,
  drug_b TEXT NOT NULL,
  severity TEXT NOT NULL,          -- 'mild', 'moderate', 'severe'
  description TEXT NOT NULL,
  action_required TEXT
);

-- Table 4: Patient Reminders
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  drug_name TEXT NOT NULL,
  reminder_time TEXT NOT NULL,     -- e.g. '08:00 AM'
  frequency TEXT NOT NULL,         -- 'daily', 'twice daily'
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 5: Reminder Logs (track when emails were sent)
-- Like Gmail's "Sent" folder
CREATE TABLE reminder_logs (
  id SERIAL PRIMARY KEY,
  reminder_id INT REFERENCES reminders(id),
  sent_at TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'sent'
);

-- Add email column to reminders table
ALTER TABLE reminders ADD COLUMN patient_email TEXT;
