import http.client
import json

def classify_weather(entry):
    temp = entry["main"].get("temprature", 0)
    wind_speed = entry["wind"].get("speed", 0)
    rain_amount = entry.get("rain", {}).get("amount", 0)
    clouds = entry["clouds"].get("cloudiness", 0)

    # Convert temperature to Celsius
    temp_c = temp - 273.15

    if rain_amount > 0.1:
        return "Rainy"
    elif wind_speed > 8:
        return "Windy"
    elif temp_c > 20 and wind_speed < 5 and rain_amount == 0 and clouds < 25:
        return "Sunny"
    else:
        return "Normal"

def fetch_weather_data(city_name):
    conn = http.client.HTTPSConnection("weather-api167.p.rapidapi.com")

    headers = {
        'x-rapidapi-key': "a31d685758mshcc43a1df0cef4f2p11dc79jsnbae07620a418",
        'x-rapidapi-host': "weather-api167.p.rapidapi.com",
        'Accept': "application/json"
    }

    location_query = city_name.replace(" ", "%20")
    api_path = f"/api/weather/forecast?place={location_query}&units=standard&lang=en&mode=json"

    conn.request("GET", api_path, headers=headers)
    res = conn.getresponse()

    if res.status != 200:
        print(f"Failed to fetch weather data. Status: {res.status}")
        print(res.read().decode("utf-8"))
        conn.close()
        return None

    raw_data = res.read()
    conn.close()
    return json.loads(raw_data.decode("utf-8"))

def print_classification_report(city, weather_data):
    forecast_list = weather_data.get("list", [])

    print(f"\n📍 Weather Forecast Classification for: {city}")
    print("-" * 55)
    for entry in forecast_list:
        dt_txt = entry.get("dt_txt", "N/A")
        temp = entry["main"].get("temprature", 0) - 273.15
        wind = entry["wind"].get("speed", 0)
        rain = entry.get("rain", {}).get("amount", 0)
        classification = classify_weather(entry)

        print(f"{dt_txt} | 🌡️ {temp:.1f}°C | 💨 {wind} m/s | 💧 {rain} mm → 🏷️ {classification}")
    print("-" * 55)

def main():
    city = input("Enter a city name (e.g., Coimbatore,IN): ").strip()
    weather_data = fetch_weather_data(city)

    if weather_data:
        print_classification_report(city, weather_data)

if __name__ == "__main__":
    main()
