"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const CITY_OPTIONS = [
  // United States
  { city_name: "Chicago", latitude: 41.8781, longitude: -87.6298, region: "United States" },
  { city_name: "New York", latitude: 40.7128, longitude: -74.0060, region: "United States" },
  { city_name: "Los Angeles", latitude: 34.0522, longitude: -118.2437, region: "United States" },
  { city_name: "Seattle", latitude: 47.6062, longitude: -122.3321, region: "United States" },
  { city_name: "Austin", latitude: 30.2672, longitude: -97.7431, region: "United States" },
  { city_name: "Boston", latitude: 42.3601, longitude: -71.0589, region: "United States" },
  { city_name: "Miami", latitude: 25.7617, longitude: -80.1918, region: "United States" },
  { city_name: "San Francisco", latitude: 37.7749, longitude: -122.4194, region: "United States" },
  { city_name: "San Diego", latitude: 32.7157, longitude: -117.1611, region: "United States" },
  { city_name: "Denver", latitude: 39.7392, longitude: -104.9903, region: "United States" },
  { city_name: "Phoenix", latitude: 33.4484, longitude: -112.0740, region: "United States" },
  { city_name: "Dallas", latitude: 32.7767, longitude: -96.7970, region: "United States" },
  { city_name: "Houston", latitude: 29.7604, longitude: -95.3698, region: "United States" },
  { city_name: "Atlanta", latitude: 33.7490, longitude: -84.3880, region: "United States" },
  { city_name: "Washington DC", latitude: 38.9072, longitude: -77.0369, region: "United States" },

  // North America
  { city_name: "Toronto", latitude: 43.6532, longitude: -79.3832, region: "North America" },
  { city_name: "Vancouver", latitude: 49.2827, longitude: -123.1207, region: "North America" },
  { city_name: "Montreal", latitude: 45.5017, longitude: -73.5673, region: "North America" },
  { city_name: "Mexico City", latitude: 19.4326, longitude: -99.1332, region: "North America" },

  // Europe
  { city_name: "London", latitude: 51.5072, longitude: -0.1276, region: "Europe" },
  { city_name: "Paris", latitude: 48.8566, longitude: 2.3522, region: "Europe" },
  { city_name: "Berlin", latitude: 52.5200, longitude: 13.4050, region: "Europe" },
  { city_name: "Rome", latitude: 41.9028, longitude: 12.4964, region: "Europe" },
  { city_name: "Madrid", latitude: 40.4168, longitude: -3.7038, region: "Europe" },
  { city_name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, region: "Europe" },
  { city_name: "Dublin", latitude: 53.3498, longitude: -6.2603, region: "Europe" },
  { city_name: "Prague", latitude: 50.0755, longitude: 14.4378, region: "Europe" },
  { city_name: "Vienna", latitude: 48.2082, longitude: 16.3738, region: "Europe" },
  { city_name: "Athens", latitude: 37.9838, longitude: 23.7275, region: "Europe" },

  // Asia
  { city_name: "Tokyo", latitude: 35.6762, longitude: 139.6503, region: "Asia" },
  { city_name: "Seoul", latitude: 37.5665, longitude: 126.9780, region: "Asia" },
  { city_name: "Beijing", latitude: 39.9042, longitude: 116.4074, region: "Asia" },
  { city_name: "Shanghai", latitude: 31.2304, longitude: 121.4737, region: "Asia" },
  { city_name: "Hong Kong", latitude: 22.3193, longitude: 114.1694, region: "Asia" },
  { city_name: "Taipei", latitude: 25.0330, longitude: 121.5654, region: "Asia" },
  { city_name: "Singapore", latitude: 1.3521, longitude: 103.8198, region: "Asia" },
  { city_name: "Bangkok", latitude: 13.7563, longitude: 100.5018, region: "Asia" },
  { city_name: "Manila", latitude: 14.5995, longitude: 120.9842, region: "Asia" },
  { city_name: "Mumbai", latitude: 19.0760, longitude: 72.8777, region: "Asia" },

  // Oceania
  { city_name: "Sydney", latitude: -33.8688, longitude: 151.2093, region: "Oceania" },
  { city_name: "Melbourne", latitude: -37.8136, longitude: 144.9631, region: "Oceania" },
  { city_name: "Auckland", latitude: -36.8509, longitude: 174.7645, region: "Oceania" },

  // South America
  { city_name: "São Paulo", latitude: -23.5505, longitude: -46.6333, region: "South America" },
  { city_name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, region: "South America" },
  { city_name: "Lima", latitude: -12.0464, longitude: -77.0428, region: "South America" },

  // Africa
  { city_name: "Cairo", latitude: 30.0444, longitude: 31.2357, region: "Africa" },
  { city_name: "Cape Town", latitude: -33.9249, longitude: 18.4241, region: "Africa" },
  { city_name: "Nairobi", latitude: -1.2921, longitude: 36.8219, region: "Africa" }
];

function weatherLabel(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Stormy";
  return "Unknown";
}

function weatherEmoji(code) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌍";
}

function formatUpdatedAt(value) {
  if (!value) return "No recent update";
  const date = new Date(value);
  return date.toLocaleString();
}

export default function DashboardClient({ user }) {
  const router = useRouter();
  const hasUser = Boolean(user?.id);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [weatherUpdates, setWeatherUpdates] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("Chicago");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const groupedCities = useMemo(() => {
    const groups = {};
    for (const city of CITY_OPTIONS) {
      if (!groups[city.region]) groups[city.region] = [];
      groups[city.region].push(city);
    }
    return groups;
  }, []);

  async function loadDashboardData() {
    if (!hasUser) {
      setFavoriteCities([]);
      setWeatherUpdates([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: citiesData, error: citiesError } = await supabase
      .from("favorite_cities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const { data: weatherData, error: weatherError } = await supabase
      .from("weather_updates")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (citiesError) {
      console.error("Error loading favorite cities:", citiesError);
    } else {
      setFavoriteCities(citiesData || []);
    }

    if (weatherError) {
      console.error("Error loading weather updates:", weatherError);
    } else {
      setWeatherUpdates(weatherData || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!hasUser) {
      return;
    }

    loadDashboardData();

    const channel = supabase
      .channel(`weather-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weather_updates"
        },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hasUser, user?.id]);

  if (!hasUser) {
    return (
      <main className="dashboard-shell">
        <div className="dashboard-overlay" />

        <section className="dashboard-content">
          <div className="hero-card">
            <p className="eyebrow">Session required</p>
            <h1 className="hero-title">Please log in to view your dashboard.</h1>
            <p className="hero-subtitle">
              Your weather feed is tied to your account, so head back to authentication first.
            </p>
            <div className="landing-actions" style={{ marginTop: 24 }}>
              <Link href="/login" className="primary-button landing-button">
                Go to Login
              </Link>
              <Link href="/signup" className="landing-secondary-button">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  async function handleAddCity(event) {
    event.preventDefault();
    setMessage("");

    const selectedCity = CITY_OPTIONS.find(
      (city) => city.city_name === selectedCityName
    );

    if (!selectedCity) {
      setMessage("Please choose a valid city.");
      return;
    }

    const alreadyAdded = favoriteCities.some(
      (city) => city.city_name === selectedCity.city_name
    );

    if (alreadyAdded) {
      setMessage("That city is already in your favorites.");
      return;
    }

    const { error } = await supabase.from("favorite_cities").insert({
      user_id: user.id,
      city_name: selectedCity.city_name,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude
    });

    if (error) {
      console.error("Error adding city:", error);
      setMessage("Could not add city.");
      return;
    }

    setMessage(`Added ${selectedCity.city_name}. The worker will update weather soon.`);
    loadDashboardData();
  }

  async function handleRemoveCity(cityId, cityName) {
    setMessage("");

    const { error: deleteFavoriteError } = await supabase
      .from("favorite_cities")
      .delete()
      .eq("id", cityId)
      .eq("user_id", user.id);

    if (deleteFavoriteError) {
      console.error("Error removing favorite city:", deleteFavoriteError);
      setMessage("Could not remove city.");
      return;
    }

    const { error: deleteWeatherError } = await supabase
      .from("weather_updates")
      .delete()
      .eq("user_id", user.id)
      .eq("city_name", cityName);

    if (deleteWeatherError) {
      console.error("Error removing weather row:", deleteWeatherError);
    }

    setMessage(`Removed ${cityName}.`);
    loadDashboardData();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="dashboard-shell">
      <div className="dashboard-overlay" />

      <section className="dashboard-content">
        <div className="hero-card">
          <div>
            <p className="eyebrow">Live weather, personalized for you</p>
            <h1 className="hero-title">Your Weather Dashboard</h1>
            <p className="hero-subtitle">Signed in as {user.email}</p>
          </div>

          <button className="secondary-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        <div className="summary-grid">
          <div className="mini-card">
            <span className="mini-label">Favorite Cities</span>
            <span className="mini-value">{favoriteCities.length}</span>
          </div>
          <div className="mini-card">
            <span className="mini-label">Live Weather Cards</span>
            <span className="mini-value">{weatherUpdates.length}</span>
          </div>
          <div className="mini-card">
            <span className="mini-label">Realtime Status</span>
            <span className="mini-value">On</span>
          </div>
        </div>

        <section className="content-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">Personalize your feed</p>
              <h2 className="section-title">Add Favorite City</h2>
            </div>
          </div>

          <form className="city-form" onSubmit={handleAddCity}>
            <select
              className="city-select"
              value={selectedCityName}
              onChange={(event) => setSelectedCityName(event.target.value)}
            >
              {Object.entries(groupedCities).map(([region, cities]) => (
                <optgroup key={region} label={region}>
                  {cities.map((city) => (
                    <option key={city.city_name} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button type="submit" className="primary-button">
              Add City
            </button>
          </form>

          {message ? <p className="status-message">{message}</p> : null}
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">Your saved list</p>
              <h2 className="section-title">Favorite Cities</h2>
            </div>
          </div>

          {favoriteCities.length === 0 ? (
            <p className="empty-text">No cities yet. Add one above to get started.</p>
          ) : (
            <div className="chip-grid">
              {favoriteCities.map((city) => (
                <div key={city.id} className="city-chip-card">
                  <div>
                    <p className="chip-title">{city.city_name}</p>
                    <p className="chip-subtitle">Saved to your personal dashboard</p>
                  </div>
                  <button
                    className="danger-button"
                    onClick={() => handleRemoveCity(city.id, city.city_name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">Updated by your Railway worker</p>
              <h2 className="section-title">Live Weather Updates</h2>
            </div>
          </div>

          {loading ? (
            <p className="empty-text">Loading weather data...</p>
          ) : weatherUpdates.length === 0 ? (
            <p className="empty-text">
              No weather data yet. Add a city and wait for the worker to poll.
            </p>
          ) : (
            <div className="weather-grid">
              {weatherUpdates.map((item) => (
                <article key={item.id} className="weather-card">
                  <div className="weather-card-top">
                    <div>
                      <p className="weather-city">{item.city_name}</p>
                      <p className="weather-condition">
                        {weatherEmoji(item.weather_code)} {weatherLabel(item.weather_code)}
                      </p>
                    </div>
                    <div className="weather-temp">
                      {item.temperature !== null && item.temperature !== undefined
                        ? `${Math.round(item.temperature)}°C`
                        : "--"}
                    </div>
                  </div>

                  <div className="weather-meta-grid">
                    <div className="meta-pill">
                      <span className="meta-label">Wind</span>
                      <span className="meta-value">
                        {item.windspeed !== null && item.windspeed !== undefined
                          ? `${item.windspeed} km/h`
                          : "--"}
                      </span>
                    </div>

                    <div className="meta-pill">
                      <span className="meta-label">Code</span>
                      <span className="meta-value">{item.weather_code ?? "--"}</span>
                    </div>
                  </div>

                  <p className="updated-at">
                    Last updated: {formatUpdatedAt(item.updated_at)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
