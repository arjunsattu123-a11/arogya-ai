# safety_engine.py
# Checks patient data and returns safety alerts
# Simple logic - no complex libraries needed

def run_safety_checks(condition, egfr, has_heart_failure, current_drugs, hba1c):
    """
    Check patient data for safety issues.
    Returns a list of alert messages.
    """
    alerts = []

    # ========================
    # eGFR (Kidney) checks
    # ========================
    if egfr is not None:
        if egfr < 30:
            alerts.append({
                "type": "danger",
                "title": "Severe Kidney Disease",
                "message": f"eGFR is {egfr}. Stop Metformin immediately. Avoid SGLT2 inhibitors. Dose-adjust all cardiac drugs."
            })
        elif egfr < 45:
            alerts.append({
                "type": "warning",
                "title": "Kidney Disease - Metformin Risk",
                "message": f"eGFR is {egfr}. Stop Metformin to prevent lactic acidosis. SGLT2 inhibitors not effective below eGFR 45."
            })
        elif egfr < 60:
            alerts.append({
                "type": "info",
                "title": "Mild Kidney Disease",
                "message": f"eGFR is {egfr}. Metformin can continue but monitor closely. Reduce Metformin dose."
            })

    # ========================
    # Heart Failure checks
    # ========================
    if has_heart_failure:
        alerts.append({
            "type": "warning",
            "title": "Heart Failure - Drug Selection",
            "message": "Patient has heart failure. Avoid Pioglitazone (causes fluid retention). Prefer SGLT2 inhibitors like Empagliflozin or Dapagliflozin."
        })

        # Glitazones are banned in heart failure
        if any("pioglitazone" in drug.lower() for drug in current_drugs):
            alerts.append({
                "type": "danger",
                "title": "STOP Pioglitazone - Heart Failure",
                "message": "Pioglitazone is contraindicated in heart failure. Stop this drug immediately."
            })

    # ========================
    # HbA1c checks
    # ========================
    if hba1c is not None:
        if hba1c > 10:
            alerts.append({
                "type": "warning",
                "title": "Very High HbA1c - Consider Insulin",
                "message": f"HbA1c is {hba1c}%. RSSDI 2022 recommends starting insulin when HbA1c is above 10%."
            })
        elif hba1c > 8:
            alerts.append({
                "type": "info",
                "title": "HbA1c Above Target - Add Second Drug",
                "message": f"HbA1c is {hba1c}%. RSSDI 2022 recommends adding a second drug to Metformin."
            })

    # ========================
    # Drug Interaction checks
    # ========================
    drug_interactions = check_interactions(current_drugs)
    alerts.extend(drug_interactions)

    return alerts


def check_interactions(current_drugs):
    """Check for known dangerous drug combinations."""
    alerts = []

    # Normalize drug names to lowercase for comparison
    drugs_lower = [d.lower() for d in current_drugs]

    # Known dangerous pairs
    interaction_rules = [
        {
            "drug_a": "metformin",
            "drug_b": "contrast",
            "severity": "danger",
            "message": "Patient is on Metformin. Stop Metformin 48 hours before any CT scan with contrast dye."
        },
        {
            "drug_a": "spironolactone",
            "drug_b": "ramipril",
            "severity": "warning",
            "message": "Spironolactone + Ramipril together can raise potassium dangerously. Check potassium blood test."
        },
        {
            "drug_a": "ticagrelor",
            "drug_b": "aspirin",
            "severity": "warning",
            "message": "Use only Aspirin 75mg with Ticagrelor. High-dose Aspirin reduces Ticagrelor effectiveness."
        },
        {
            "drug_a": "furosemide",
            "drug_b": "ramipril",
            "severity": "info",
            "message": "Furosemide + Ramipril can cause sudden BP drop. Start both at low doses."
        },
        {
            "drug_a": "empagliflozin",
            "drug_b": "furosemide",
            "severity": "info",
            "message": "SGLT2 inhibitor + Furosemide both remove water. Patient may get dehydrated in hot weather. Advise adequate water intake."
        },
    ]

    for rule in interaction_rules:
        if rule["drug_a"] in drugs_lower and rule["drug_b"] in drugs_lower:
            alerts.append({
                "type": rule["severity"],
                "title": f"Drug Interaction: {rule['drug_a'].title()} + {rule['drug_b'].title()}",
                "message": rule["message"]
            })

    return alerts


def calculate_egfr(creatinine, age, is_female=False):
    """
    CKD-EPI formula to calculate eGFR.
    Creatinine in mg/dL, age in years.
    Returns eGFR in mL/min/1.73m2.
    """
    # Simple MDRD formula (easy to understand)
    egfr = 175 * (creatinine ** -1.154) * (age ** -0.203)
    if is_female:
        egfr = egfr * 0.742
    return round(egfr, 1)


def calculate_cha2ds2_vasc(age, is_female, has_heart_failure, has_hypertension,
                            has_diabetes, had_stroke, has_vascular_disease):
    """
    CHA2DS2-VASc score for atrial fibrillation stroke risk.
    Returns score and recommendation.
    """
    score = 0

    # C - Congestive heart failure
    if has_heart_failure:
        score += 1
    # H - Hypertension
    if has_hypertension:
        score += 1
    # A2 - Age >= 75 (double points)
    if age >= 75:
        score += 2
    elif age >= 65:
        score += 1
    # D - Diabetes
    if has_diabetes:
        score += 1
    # S2 - Stroke/TIA history (double points)
    if had_stroke:
        score += 2
    # V - Vascular disease
    if has_vascular_disease:
        score += 1
    # Sc - Sex category (female)
    if is_female:
        score += 1

    # Recommendation based on score
    if score == 0:
        recommendation = "No anticoagulation needed"
    elif score == 1:
        recommendation = "Consider anticoagulation"
    else:
        recommendation = "Anticoagulation recommended (Warfarin or NOAC)"

    return {"score": score, "recommendation": recommendation}
