import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")


def get_client():
    from supabase import create_client
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise Exception("SUPABASE_URL and SUPABASE_KEY missing in .env file")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def get_drugs(category: str, budget: str = "all") -> list:
    client = get_client()
    query = client.table("drugs").select("*")
    if category != "both":
        query = query.eq("category", category)
    if budget == "low":
        query = query.lte("price_inr", 100)
    elif budget == "medium":
        query = query.lte("price_inr", 300)
    query = query.order("price_inr", desc=False)
    response = query.execute()
    return response.data


def get_guidelines(condition: str) -> list:
    client = get_client()
    if condition == "diabetes":
        db_condition = "type2_diabetes"
    elif condition == "cardiac":
        db_condition = "acs_stemi"
    else:
        return client.table("guidelines").select("*").execute().data
    return client.table("guidelines").select("*").eq("medical_condition", db_condition).execute().data


def save_reminder(reminder_data: dict) -> dict:
    client = get_client()
    response = client.table("reminders").insert(reminder_data).execute()
    if response.data:
        return response.data[0]
    return None