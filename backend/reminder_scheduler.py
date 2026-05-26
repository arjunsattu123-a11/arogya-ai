# reminder_scheduler.py
# Works like Gmail scheduled email
# Checks every minute - if reminder time matches, sends email to patient
# Made by Arjun
# Run this separately: python reminder_scheduler.py

import schedule
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from database import get_client

# Email settings - fill these in .env file
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")    # your gmail address
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD")  # gmail app password


def send_email(to_email, patient_name, drug_name, frequency):
    """
    Send a medicine reminder email to the patient.
    Works exactly like a scheduled Gmail.
    """
    try:
        # Build the email
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg["Subject"] = f"Medicine Reminder - {drug_name}"

        # Email body - simple and clear
        body = f"""
Hello {patient_name},

This is your medicine reminder from Arogya AI.

Medicine : {drug_name}
Time     : Take it now
Schedule : {frequency}

Please take your medicine on time.
Missing doses can affect your health.

---
This reminder was set by your doctor.
Arogya AI - AI-powered medicine for Indian doctors
        """

        msg.attach(MIMEText(body, "plain"))

        # Connect to Gmail and send
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"[{datetime.now()}] Email sent to {patient_name} at {to_email}")
        return True

    except Exception as e:
        print(f"[{datetime.now()}] Failed to send email: {str(e)}")
        return False


def check_and_send_reminders():
    """
    This runs every minute.
    Checks if any reminder time matches current time.
    If yes - sends the email.
    Same logic as Gmail scheduled send.
    """
    # Get current time like "08:00 AM"
    now = datetime.now().strftime("%I:%M %p")
    print(f"[{datetime.now()}] Checking reminders for time: {now}")

    try:
        client = get_client()

        # Get all active reminders from database
        response = (
            client.table("reminders")
            .select("*")
            .eq("status", "active")
            .eq("reminder_time", now)
            .execute()
        )

        reminders = response.data

        if not reminders:
            return  # No reminders due right now

        print(f"Found {len(reminders)} reminder(s) to send")

        for reminder in reminders:
            # Send the email
            success = send_email(
                to_email=reminder["patient_email"],
                patient_name=reminder["patient_name"],
                drug_name=reminder["drug_name"],
                frequency=reminder["frequency"]
            )

            if success:
                # Log that this reminder was sent today
                client.table("reminder_logs").insert({
                    "reminder_id": reminder["id"],
                    "sent_at": datetime.now().isoformat(),
                    "status": "sent"
                }).execute()

    except Exception as e:
        print(f"Error checking reminders: {str(e)}")


# Run the scheduler
if __name__ == "__main__":
    print("Arogya AI Reminder Scheduler started")
    print("Checking every minute for scheduled reminders...")
    print("Works like Gmail scheduled send")

    # Check every minute
    schedule.every(1).minutes.do(check_and_send_reminders)

    # Keep running forever (like a background service)
    while True:
        schedule.run_pending()
        time.sleep(30)  # wait 30 seconds between checks
