import requests
import os
from datetime import datetime, timedelta
import time
from zoneinfo import ZoneInfo # Import the timezone library

# --- Configuration ---
# IMPORTANT: You must have a Google Maps API key with the "Distance Matrix API" enabled.
# For security, it's best to set this as an environment variable.
API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "AIzaSyDNxw_q4sHTDi6f2WSX7jG2KmDt7ACTPDg")

# Define the timezone for Coimbatore, India
INDIA_TZ = ZoneInfo("Asia/Kolkata")

# --- Location & Schedule Details ---
# In a real app, this would come from the machine's live GPS.
current_task_location = "11.0168,76.9558" # (Location of Task 1)

# Details for the next assigned task. The start time will be set dynamically.
next_task = {
    "location": "11.0198,76.9588", # (Location of Task 2 - now much closer for a short travel time)
    "start_time_str": "" # This will be calculated automatically
}

def get_travel_time(api_key, origin, destination):
    """
    Uses the Google Maps Distance Matrix API to get the ideal travel time.
    """
    if api_key == "YOUR_API_KEY_HERE":
        print("❌ Error: Please replace 'YOUR_API_KEY_HERE' with a valid Google Maps API key.")
        return None, None

    url = (
        "https://maps.googleapis.com/maps/api/distancematrix/json"
        f"?origins={origin}&destinations={destination}&key={api_key}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if data['status'] == 'OK' and data['rows'][0]['elements'][0]['status'] == 'OK':
            duration_seconds = data['rows'][0]['elements'][0]['duration']['value']
            distance_text = data['rows'][0]['elements'][0]['distance']['text']
            ideal_travel_time_minutes = duration_seconds / 60
            return int(ideal_travel_time_minutes) if ideal_travel_time_minutes >= 1 else 1, distance_text
        else:
            print(f"Error from API: {data.get('error_message', 'Unknown error')}")
            return None, None

    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return None, None

def generate_popup_message(travel_time_minutes, distance, next_task_start_time_str):
    """
    Creates the final message to be shown to the operator.
    """
    if travel_time_minutes is None:
        return "Could not calculate travel time."

    message = (
        f"*Time to Go!*\n\n"
        f"Your next task starts at *{next_task_start_time_str}*.\n\n"
        f"The location is *{distance}* away, which is an estimated *{travel_time_minutes} minute* trip.\n\n"
        f"It's time to head out now to arrive on schedule."
    )
    return message

# --- Main execution block ---
if _name_ == "_main_":
    print("System is running. Monitoring schedule for next task...")

    travel_time, distance = get_travel_time(API_KEY, current_task_location, next_task["location"])

    if travel_time is not None:
        # --- DYNAMIC TIME CALCULATION FOR TESTING (NOW TIMEZONE-AWARE) ---
        # Set the next task to start 5 minutes from the current time in India.
        now_in_india = datetime.now(INDIA_TZ)
        next_task_start_time = now_in_india + timedelta(minutes=5)
        next_task["start_time_str"] = next_task_start_time.strftime("%I:%M %p")
        # ---------------------------------------------

        # Calculate the ideal departure time based on the new start time
        ideal_departure_time = next_task_start_time - timedelta(minutes=travel_time)

        print(f"Next task starts at: {next_task_start_time.strftime('%I:%M %p')}")
        print(f"Estimated travel time: {travel_time} minutes")
        print(f"Ideal departure time: {ideal_departure_time.strftime('%I:%M %p')}")
        print("-----------------------------------")

        # --- NEW, MORE PRECISE WAITING LOGIC ---
        # Calculate how many seconds we need to wait until the ideal departure time.
        wait_seconds = (ideal_departure_time - datetime.now(INDIA_TZ)).total_seconds()

        if wait_seconds > 0:
            print(f"Waiting for {int(wait_seconds)} seconds until the ideal departure time...")
            time.sleep(wait_seconds)

        # Once the wait is over, trigger the pop-up immediately.
        print("\n🔔 TRIGGERING POP-UP! 🔔")
        print(f"Alert triggered at: {datetime.now(INDIA_TZ).strftime('%I:%M:%S %p')}")
        print("\n--- Pop-up Message for Operator ---")
        popup_message = generate_popup_message(travel_time, distance, next_task["start_time_str"])
        print(popup_message)
        print("-----------------------------------")