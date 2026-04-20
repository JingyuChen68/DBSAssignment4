import Link from "next/link";
import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <section className="auth-showcase">
          <p className="auth-kicker">Forecasts that feel current</p>
          <h1 className="auth-display">Log in and pick up your weather feed instantly.</h1>
          <p className="auth-copy">
            Follow the cities you care about, get fresh realtime updates, and keep everything in one calm dashboard.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span className="auth-feature-value">Realtime sync</span>
              <span className="auth-feature-label">Fresh weather cards land automatically</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-value">Global cities</span>
              <span className="auth-feature-label">From Chicago to Singapore in one list</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-value">Personal dashboard</span>
              <span className="auth-feature-label">Your saved locations, your updates, your session</span>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <p className="auth-eyebrow">Welcome back</p>
            <h2 className="auth-title">Log In</h2>
            <p className="auth-subtitle">Use your account to continue to the dashboard.</p>
            <AuthForm mode="login" />
            <p className="auth-footer">
              Need an account?{" "}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
