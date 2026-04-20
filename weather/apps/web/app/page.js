import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">Realtime Weather Dashboard</p>
          <h1 className="landing-title">A sharper, calmer way to track the cities that matter to you.</h1>
          <p className="landing-subtitle">
            Sign in, save favorites, and watch weather updates refresh inside a single polished dashboard built on Supabase and realtime events.
          </p>

          <div className="landing-actions">
            <Link href="/signup" className="primary-button landing-button">
              Create Account
            </Link>
            <Link href="/login" className="landing-secondary-button">
              Log In
            </Link>
          </div>
        </div>

        <div className="landing-preview">
          <div className="landing-preview-card">
            <div className="landing-preview-top">
              <div>
                <p className="landing-preview-label">Today at a glance</p>
                <h2 className="landing-preview-title">Your cities, one clean feed</h2>
              </div>
              <span className="landing-badge">Live</span>
            </div>

            <div className="landing-preview-grid">
              <article className="landing-weather-tile">
                <span className="landing-weather-city">Chicago</span>
                <strong>67°F</strong>
                <span>Cloudy with light wind</span>
              </article>
              <article className="landing-weather-tile warm">
                <span className="landing-weather-city">Miami</span>
                <strong>82°F</strong>
                <span>Humid with scattered sun</span>
              </article>
              <article className="landing-weather-tile cool">
                <span className="landing-weather-city">Seattle</span>
                <strong>58°F</strong>
                <span>Drizzle expected later</span>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
