# prompt_composer.py
# Builds the prompt that is sent to the AI
# Made by Arjun

def build_prompt(patient, drugs, guidelines, safety_alerts):
    drug_text = format_drugs(drugs)
    guideline_text = format_guidelines(guidelines)
    alert_text = format_alerts(safety_alerts)

    prompt = f"""
You are an experienced Indian doctor helping choose the best medicine for a patient.
You must recommend medicines that are:
1. Safe for this patient based on kidney function and heart condition
2. Affordable - prefer government approved essential medicines when possible
3. Following Indian medical guidelines
4. Available in Indian pharmacies with correct brand names and prices in rupees

---
PATIENT DETAILS:
- Name: {patient['name']}
- Age: {patient['age']} years
- Condition: {patient['condition']}
- HbA1c: {patient.get('hba1c', 'Not provided')}%
- Kidney function (eGFR): {patient.get('egfr', 'Not provided')} mL/min
- Heart Failure: {'Yes' if patient.get('has_heart_failure') else 'No'}
- Current medicines: {', '.join(patient.get('current_drugs', [])) or 'None'}
- Budget: {patient.get('budget', 'low')}

---
SAFETY WARNINGS - YOU MUST ADDRESS THESE:
{alert_text}

---
AVAILABLE MEDICINES WITH INDIAN PRICES:
{drug_text}

---
GUIDELINES TO FOLLOW:
{guideline_text}

---
Write your answer like a doctor writes a prescription note.
Use this format:

RECOMMENDED MEDICINES:
1. [Generic Name] — Brand: [Brand Name] — Price: [price in rupees] — Dose: [dose]
   Reason: [why this medicine for this patient]

WHAT TO CHECK REGULARLY:
- [point 1]
- [point 2]

ADVICE FOR PATIENT:
- [advice in simple language, think about Indian food and lifestyle]

MONTHLY COST:
Total per month: [calculate and show in rupees]

If a cheaper essential medicine works, recommend that.
If you chose a costly medicine, explain why it is needed for this patient.
"""
    return prompt


def format_drugs(drugs):
    if not drugs:
        return "No medicines found."
    lines = []
    for drug in drugs:
        tag = "Essential Medicine (cheaper)" if drug.get("on_nlem") else "Not an essential medicine"
        lines.append(
            f"- {drug['generic_name']} | Brand: {drug['brand_name']} | "
            f"Price: Rs.{drug['price_inr']} per {drug['pack_size']} | {tag}"
        )
    return "\n".join(lines)


def format_guidelines(guidelines):
    if not guidelines:
        return "No guidelines loaded."
    lines = []
    for g in guidelines:
        lines.append(f"[{g['source']}] {g['recommendation']}")
    return "\n".join(lines)


def format_alerts(alerts):
    if not alerts:
        return "No safety warnings for this patient."
    lines = []
    for alert in alerts:
        prefix = "WARNING" if alert["type"] == "danger" else "NOTE"
        lines.append(f"{prefix} - {alert['title']}: {alert['message']}")
    return "\n".join(lines)
