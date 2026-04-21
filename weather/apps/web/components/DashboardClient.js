"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, supabaseConfigError } from "../lib/supabase";

const CITY_OPTIONS = [
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
  { city_name: "Toronto", latitude: 43.6532, longitude: -79.3832, region: "North America" },
  { city_name: "Vancouver", latitude: 49.2827, longitude: -123.1207, region: "North America" },
  { city_name: "Montreal", latitude: 45.5017, longitude: -73.5673, region: "North America" },
  { city_name: "Mexico City", latitude: 19.4326, longitude: -99.1332, region: "North America" },
  { city_name: "London", latitude: 51.5072, longitude: -0.1276, region: "Europe" },
  { city_name: "Paris", latitude: 48.8566, longitude: 2.3522, region: "Europe" },
  { city_name: "Berlin", latitude: 52.52, longitude: 13.405, region: "Europe" },
  { city_name: "Rome", latitude: 41.9028, longitude: 12.4964, region: "Europe" },
  { city_name: "Madrid", latitude: 40.4168, longitude: -3.7038, region: "Europe" },
  { city_name: "Amsterdam", latitude: 52.3676, longitude: 4.9041, region: "Europe" },
  { city_name: "Dublin", latitude: 53.3498, longitude: -6.2603, region: "Europe" },
  { city_name: "Prague", latitude: 50.0755, longitude: 14.4378, region: "Europe" },
  { city_name: "Vienna", latitude: 48.2082, longitude: 16.3738, region: "Europe" },
  { city_name: "Athens", latitude: 37.9838, longitude: 23.7275, region: "Europe" },
  { city_name: "Tokyo", latitude: 35.6762, longitude: 139.6503, region: "Asia" },
  { city_name: "Seoul", latitude: 37.5665, longitude: 126.978, region: "Asia" },
  { city_name: "Beijing", latitude: 39.9042, longitude: 116.4074, region: "Asia" },
  { city_name: "Shanghai", latitude: 31.2304, longitude: 121.4737, region: "Asia" },
  { city_name: "Hong Kong", latitude: 22.3193, longitude: 114.1694, region: "Asia" },
  { city_name: "Taipei", latitude: 25.033, longitude: 121.5654, region: "Asia" },
  { city_name: "Singapore", latitude: 1.3521, longitude: 103.8198, region: "Asia" },
  { city_name: "Bangkok", latitude: 13.7563, longitude: 100.5018, region: "Asia" },
  { city_name: "Manila", latitude: 14.5995, longitude: 120.9842, region: "Asia" },
  { city_name: "Mumbai", latitude: 19.076, longitude: 72.8777, region: "Asia" },
  { city_name: "Sydney", latitude: -33.8688, longitude: 151.2093, region: "Oceania" },
  { city_name: "Melbourne", latitude: -37.8136, longitude: 144.9631, region: "Oceania" },
  { city_name: "Auckland", latitude: -36.8509, longitude: 174.7645, region: "Oceania" },
  { city_name: "Sao Paulo", latitude: -23.5505, longitude: -46.6333, region: "South America" },
  { city_name: "Buenos Aires", latitude: -34.6037, longitude: -58.3816, region: "South America" },
  { city_name: "Lima", latitude: -12.0464, longitude: -77.0428, region: "South America" },
  { city_name: "Cairo", latitude: 30.0444, longitude: 31.2357, region: "Africa" },
  { city_name: "Cape Town", latitude: -33.9249, longitude: 18.4241, region: "Africa" },
  { city_name: "Nairobi", latitude: -1.2921, longitude: 36.8219, region: "Africa" }
];

export default function DashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [weatherRows, setWeatherRows] = useState([]);
  const [selectedCity, setSelectedCity] = useState(CITY_OPTIONS[0].city_name);
  const [message, setMessage] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Checking your session...");

  const cityLookup = useMemo(() => {
    const map = {};
    for (const city of CITY_OPTIONS) {
      map[city.city_name] = city;
    }
    return map;
  }, []);

  const groupedCities = useMemo(() => {
    const groups = {};
    for (const city of CITY_OPTIONS) {
      if (!groups[city.region]) groups[city.region] = [];
      groups[city.region].push(city);
    }
    return groups;
  }, []);

  async function loadData(userId) {
    const favoritesResult = await supabase
      .from("favorite_cities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    const weatherResult = await supabase
      .from("weather_updates")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!favoritesResult.error) {
      setFavorites(favoritesResult.data || []);
    }

    if (!weatherResult.error) {
      setWeatherRows(weatherResult.data || []);
    }
  }

  useEffect(() => {
    if (supabaseConfigError || !supabase) {
      setAuthChecked(true);
      setMessage(supabaseConfigError);
      return;
    }

    let mounted = true;

    async function loadUser() {
      const [{ data: sessionData }, { data: userData }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser()
      ]);

      if (!mounted) return;

      const currentUser = userData.user ?? sessionData.session?.user ?? null;

      if (!currentUser) {
        setUser(null);
        setAuthChecked(true);
        router.push("/login");
        return;
      }

      setUser(currentUser);
      setAuthChecked(true);
      setLoadingMessage("Loading your dashboard...");
      await loadData(currentUser.id);
    }

    loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const nextUser = session?.user ?? null;

      if (!nextUser) {
        setUser(null);
        setAuthChecked(true);
        router.push("/login");
        return;
      }

      setUser(nextUser);
      setAuthChecked(true);
      await loadData(nextUser.id);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!user || !supabase) return;

    const weatherChannel = supabase
      .channel(`weather-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weather_updates",
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          await loadData(user.id);
        }
      )
      .subscribe();

    const favoritesChannel = supabase
      .channel(`favorite-cities-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "favorite_cities",
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          await loadData(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(weatherChannel);
      supabase.removeChannel(favoritesChannel);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !supabase) return;

    const interval = setInterval(() => {
      loadData(user.id);
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  async function addFavoriteCity() {
    if (!user || !supabase) return;
    setMessage("");

    const city = cityLookup[selectedCity];

    const { error } = await supabase.from("favorite_cities").insert({
      user_id: user.id,
      city_name: city.city_name,
      latitude: city.latitude,
      longitude: city.longitude
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setFavorites((current) => {
      const exists = current.some((item) => item.city_name === city.city_name);
      if (exists) return current;
      return [
        ...current,
        {
          id: `temp-${city.city_name}`,
          user_id: user.id,
          city_name: city.city_name,
          latitude: city.latitude,
          longitude: city.longitude
        }
      ];
    });

    setMessage(`Added ${city.city_name}. Weather may take up to a minute to appear, depending on the worker poll interval.`);
    await loadData(user.id);
  }

  async function removeFavoriteCity(cityName) {
    if (!user || !supabase) return;
    setMessage("");

    const previousFavorites = favorites;
    const previousWeatherRows = weatherRows;

    setFavorites((current) => current.filter((city) => city.city_name !== cityName));
    setWeatherRows((current) => current.filter((row) => row.city_name !== cityName));

    const { error: favoriteDeleteError } = await supabase
      .from("favorite_cities")
      .delete()
      .eq("user_id", user.id)
      .eq("city_name", cityName);

    const { error: weatherDeleteError } = await supabase
      .from("weather_updates")
      .delete()
      .eq("user_id", user.id)
      .eq("city_name", cityName);

    if (favoriteDeleteError || weatherDeleteError) {
      setFavorites(previousFavorites);
      setWeatherRows(previousWeatherRows);
      setMessage(`Could not fully remove ${cityName}.`);
      await loadData(user.id);
      return;
    }

    setMessage(`Removed ${cityName}.`);
    await loadData(user.id);
  }

  async function removeWeatherUpdate(cityName) {
    if (!user || !supabase) return;
    setMessage("");

    const previousWeatherRows = weatherRows;
    setWeatherRows((current) => current.filter((row) => row.city_name !== cityName));

    const { error } = await supabase
      .from("weather_updates")
      .delete()
      .eq("user_id", user.id)
      .eq("city_name", cityName);

    if (error) {
      setWeatherRows(previousWeatherRows);
      setMessage(`Could not delete weather update for ${cityName}.`);
      return;
    }

    setMessage(`Deleted weather update for ${cityName}.`);
    await loadData(user.id);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!authChecked) {
    return (
      <main className="container space-y">
        <div className="card">
          <div className="title" style={{ fontSize: 28, marginBottom: 4 }}>Loading your dashboard...</div>
          <div className="small">{loadingMessage}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="title" style={{ fontSize: 28, marginBottom: 4 }}>Your Weather Dashboard</div>
            <div className="small">Signed in as {user?.email}</div>
          </div>
          <button className="button secondary" style={{ maxWidth: 140 }} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      <div className="card space-y">
        <h2>Add Favorite City</h2>
        <div className="row">
          <select
            className="input"
            style={{ flex: 1 }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
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
          <button className="button" style={{ maxWidth: 180 }} onClick={addFavoriteCity}>
            Add City
          </button>
        </div>
        {message ? <p className="small">{message}</p> : null}
      </div>

      <div className="card">
        <h2>Favorite Cities</h2>
        {favorites.length === 0 ? (
          <p className="small">No favorite cities yet.</p>
        ) : (
          <div className="grid">
            {favorites.map((city) => (
              <div key={city.id} className="card" style={{ padding: 16 }}>
                <h3>{city.city_name}</h3>
                <button className="button secondary" onClick={() => removeFavoriteCity(city.city_name)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Live Weather Updates</h2>
        {weatherRows.length === 0 ? (
          <p className="small">No weather data yet. Add a city and wait for the worker to poll.</p>
        ) : (
          <div className="grid">
            {weatherRows.map((row) => (
              <div key={row.id} className="card" style={{ padding: 16 }}>
                <h3>{row.city_name}</h3>
                <p>Temperature: {row.temperature ?? "-"}°C</p>
                <p>Wind Speed: {row.windspeed ?? "-"} km/h</p>
                <p>Weather Code: {row.weather_code ?? "-"}</p>
                <p className="small">
                  Last updated: {row.updated_at ? new Date(row.updated_at).toLocaleString() : "-"}
                </p>
                <button
                  className="button secondary"
                  style={{ marginTop: 12 }}
                  onClick={() => removeWeatherUpdate(row.city_name)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
