import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 300000);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function pollWeather() {
  console.log("Starting weather poll at", new Date().toISOString());

  const { data: cities, error: cityError } = await supabase
    .from("favorite_cities")
    .select("user_id, city_name, latitude, longitude");

  if (cityError) {
    console.error("Failed to read favorite cities:", cityError.message);
    return;
  }

  if (!cities || cities.length === 0) {
    console.log("No favorite cities found.");
    return;
  }

  for (const city of cities) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,wind_speed_10m,weather_code`;
      const response = await fetch(url);
      const json = await response.json();
      const current = json.current;

      if (!current) {
        console.error("No current weather found for", city.city_name);
        continue;
      }

      const { error: upsertError } = await supabase
        .from("weather_updates")
        .upsert(
          {
            user_id: city.user_id,
            city_name: city.city_name,
            temperature: current.temperature_2m,
            windspeed: current.wind_speed_10m,
            weather_code: current.weather_code,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: "user_id,city_name"
          }
        );

      if (upsertError) {
        console.error("Failed to update weather for", city.city_name, upsertError.message);
      } else {
        console.log("Updated weather for", city.city_name);
      }
    } catch (error) {
      console.error("Worker error for", city.city_name, error);
    }
  }
}

async function main() {
  await pollWeather();
  setInterval(async () => {
    await pollWeather();
  }, pollIntervalMs);
}

main();
