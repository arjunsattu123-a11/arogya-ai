-- ============================================
-- AROGYA AI - Seed Data
-- Run this AFTER schema.sql
-- Prices from 1mg.com (check date before demo)
-- ============================================

-- ==================
-- DIABETES DRUGS (15)
-- ==================
INSERT INTO drugs (generic_name, brand_name, category, price_inr, pack_size, on_nlem, dose_form) VALUES
('Metformin 500mg',       'Glycomet 500',      'diabetes', 35,  '20 tablets', TRUE,  'tablet'),
('Metformin 1000mg',      'Glycomet 1000',     'diabetes', 65,  '20 tablets', TRUE,  'tablet'),
('Glimepiride 2mg',       'Amaryl 2mg',        'diabetes', 85,  '30 tablets', TRUE,  'tablet'),
('Glibenclamide 5mg',     'Daonil 5mg',        'diabetes', 40,  '30 tablets', TRUE,  'tablet'),
('Teneligliptin 20mg',    'Tenepure 20mg',     'diabetes', 180, '10 tablets', FALSE, 'tablet'),
('Vildagliptin 50mg',     'Galvus 50mg',       'diabetes', 240, '14 tablets', FALSE, 'tablet'),
('Sitagliptin 100mg',     'Januvia 100mg',     'diabetes', 290, '7 tablets',  FALSE, 'tablet'),
('Empagliflozin 10mg',    'Jardiance 10mg',    'diabetes', 520, '10 tablets', FALSE, 'tablet'),
('Dapagliflozin 10mg',    'Forxiga 10mg',      'diabetes', 430, '10 tablets', FALSE, 'tablet'),
('Canagliflozin 100mg',   'Invokana 100mg',    'diabetes', 480, '10 tablets', FALSE, 'tablet'),
('Pioglitazone 15mg',     'Pioz 15mg',         'diabetes', 55,  '10 tablets', FALSE, 'tablet'),
('Insulin Glargine',      'Basalog 100IU',     'diabetes', 320, '1 vial',     FALSE, 'injection'),
('Insulin Regular',       'Actrapid 100IU',    'diabetes', 180, '1 vial',     TRUE,  'injection'),
('Acarbose 50mg',         'Glucobay 50mg',     'diabetes', 120, '30 tablets', FALSE, 'tablet'),
('Liraglutide 1.2mg',     'Victoza 1.2mg',     'diabetes', 3800,'3 pens',     FALSE, 'injection');

-- ==================
-- CARDIAC DRUGS (15)
-- ==================
INSERT INTO drugs (generic_name, brand_name, category, price_inr, pack_size, on_nlem, dose_form) VALUES
('Aspirin 75mg',          'Ecosprin 75mg',     'cardiac', 12,   '14 tablets', TRUE,  'tablet'),
('Aspirin 150mg',         'Ecosprin 150mg',    'cardiac', 18,   '14 tablets', TRUE,  'tablet'),
('Clopidogrel 75mg',      'Clopilet 75mg',     'cardiac', 45,   '10 tablets', TRUE,  'tablet'),
('Ticagrelor 90mg',       'Brilinta 90mg',     'cardiac', 980,  '14 tablets', FALSE, 'tablet'),
('Atorvastatin 20mg',     'Atorfit 20mg',      'cardiac', 55,   '15 tablets', TRUE,  'tablet'),
('Rosuvastatin 10mg',     'Rozavel 10mg',      'cardiac', 70,   '15 tablets', FALSE, 'tablet'),
('Ramipril 5mg',          'Cardace 5mg',       'cardiac', 65,   '15 tablets', TRUE,  'tablet'),
('Telmisartan 40mg',      'Telma 40mg',        'cardiac', 75,   '15 tablets', FALSE, 'tablet'),
('Metoprolol 25mg',       'Betaloc 25mg',      'cardiac', 30,   '20 tablets', TRUE,  'tablet'),
('Carvedilol 6.25mg',     'Cardivas 6.25mg',   'cardiac', 85,   '10 tablets', FALSE, 'tablet'),
('Furosemide 40mg',       'Lasix 40mg',        'cardiac', 20,   '15 tablets', TRUE,  'tablet'),
('Spironolactone 25mg',   'Aldactone 25mg',    'cardiac', 35,   '15 tablets', TRUE,  'tablet'),
('Enoxaparin 40mg',       'Clexane 40mg',      'cardiac', 420,  '2 syringes', FALSE, 'injection'),
('Streptokinase 15L IU',  'Streptase 15L',     'cardiac', 3500, '1 vial',     TRUE,  'injection'),
('Nitroglycerin 0.5mg',   'Nitrocontin 0.5mg', 'cardiac', 25,   '10 tablets', TRUE,  'tablet');


-- ========================
-- RSSDI 2022 GUIDELINES (8)
-- ========================
INSERT INTO guidelines (source, condition, recommendation, hba1c_threshold) VALUES
('RSSDI 2022', 'type2_diabetes',
 'Metformin is the first-line drug for all Type 2 diabetes patients unless contraindicated. It is cheap, effective, and widely available in India.',
 NULL),

('RSSDI 2022', 'type2_diabetes',
 'When HbA1c is above 8% on Metformin alone, add a second agent. Choose based on patient profile: SGLT2 inhibitor for patients with heart disease, DPP4 inhibitor for elderly patients.',
 '>8%'),

('RSSDI 2022', 'type2_diabetes',
 'SGLT2 inhibitors like Empagliflozin are preferred in Type 2 diabetes patients who also have heart failure or chronic kidney disease.',
 NULL),

('RSSDI 2022', 'type2_diabetes',
 'Teneligliptin is a DPP4 inhibitor made in India. It is cheaper than imported DPP4 inhibitors. Good option for elderly patients where hypoglycemia risk must be low.',
 NULL),

('RSSDI 2022', 'type2_diabetes',
 'In patients with eGFR below 45 mL/min, Metformin should be stopped to avoid lactic acidosis risk.',
 NULL),

('RSSDI 2022', 'type2_diabetes',
 'For patients who cannot afford SGLT2 inhibitors, Glimepiride added to Metformin is an affordable and effective combination. Watch for hypoglycemia.',
 NULL),

('RSSDI 2022', 'type2_diabetes',
 'Insulin should be started when HbA1c is above 10% or when patient has symptoms of severe hyperglycemia like weight loss and fatigue.',
 '>10%'),

('RSSDI 2022', 'type2_diabetes',
 'Target HbA1c in most Indian Type 2 diabetes patients is below 7%. For elderly patients above 70 years, target below 8% to avoid hypoglycemia risk.',
 '<7%');


-- ======================
-- CSI 2019 GUIDELINES (8)
-- ======================
INSERT INTO guidelines (source, condition, recommendation, hba1c_threshold) VALUES
('CSI 2019', 'acs_stemi',
 'Dual antiplatelet therapy — Aspirin plus Clopidogrel or Ticagrelor — must be started immediately in all STEMI patients.',
 NULL),

('CSI 2019', 'acs_stemi',
 'Primary PCI is the preferred treatment for STEMI when a cath lab is available within 120 minutes of first medical contact.',
 NULL),

('CSI 2019', 'acs_stemi',
 'When PCI is not available within 120 minutes, give Streptokinase thrombolysis immediately. Streptokinase is on NLEM and affordable in Indian hospitals.',
 NULL),

('CSI 2019', 'acs_stemi',
 'All post-STEMI patients must receive high-intensity statin therapy. Atorvastatin 40-80mg is preferred. Target LDL below 70 mg/dL.',
 NULL),

('CSI 2019', 'acs_stemi',
 'Beta-blockers like Metoprolol should be started within 24 hours of STEMI if there is no cardiogenic shock or severe bradycardia.',
 NULL),

('CSI 2019', 'acs_stemi',
 'ACE inhibitors like Ramipril should be started in all STEMI patients with reduced ejection fraction (EF below 40%) within 24 hours.',
 NULL),

('CSI 2019', 'acs_stemi',
 'In STEMI patients with diabetes, insulin infusion should be used to keep blood sugar between 140-180 mg/dL during hospital stay.',
 NULL),

('CSI 2019', 'acs_stemi',
 'Ticagrelor is preferred over Clopidogrel in high-risk STEMI patients. However Clopidogrel is used when cost is a concern as it is on NLEM.',
 NULL);


-- ========================
-- COMMON DRUG INTERACTIONS
-- ========================
INSERT INTO drug_interactions (drug_a, drug_b, severity, description, action_required) VALUES
('Metformin',     'Contrast Dye',      'severe',   'Metformin + contrast dye can cause acute kidney failure. Stop Metformin 48 hours before any scan with dye.',      'Stop Metformin before scan'),
('Warfarin',      'Aspirin',           'moderate', 'Both increase bleeding risk. Using together increases chance of internal bleeding.',                              'Monitor INR closely'),
('Spironolactone','Ramipril',          'moderate', 'Both raise potassium levels. Can cause dangerous hyperkalemia especially in kidney disease.',                    'Check potassium regularly'),
('Metformin',     'Glimepiride',       'mild',     'Risk of low blood sugar when both used together. Patient must eat on time.',                                     'Monitor blood sugar'),
('Ticagrelor',    'Aspirin high dose', 'moderate', 'High dose Aspirin reduces Ticagrelor effectiveness. Use only Aspirin 75mg with Ticagrelor.',                    'Use low dose Aspirin only'),
('Furosemide',    'Ramipril',          'mild',     'Furosemide lowers blood pressure. Ramipril also lowers BP. Together can cause sudden low BP.',                  'Start with low doses'),
('Empagliflozin', 'Furosemide',        'mild',     'Both remove water from body. Can cause dehydration especially in hot Indian weather.',                          'Monitor hydration'),
('Glimepiride',   'Alcohol',           'moderate', 'Alcohol + Glimepiride causes severe low blood sugar. Very common in India with festival drinking.',             'Counsel patient on alcohol');
