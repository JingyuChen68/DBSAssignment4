import Link from "next/link";
import AuthForm from "../../components/AuthForm";

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <div className="auth-layout">
        <section className="auth-showcase">
          <p className="auth-kicker">Build your own live forecast board</p>
          <h1 className="auth-display">Create an account and start tracking cities in minutes.</h1>
          <p className="auth-copy">
            Save favorites, watch updates stream in, and keep a clean snapshot of the places you check most.
          </p>

          <div className="auth-stat-strip">
            <div className="auth-stat-card">
              <strong>50+</strong>
              <span>preloaded cities to choose from</span>
            </div>
            <div className="auth-stat-card">
              <strong>1 dashboard</strong>
              <span>for saved locations and live conditions</span>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <p className="auth-eyebrow">Start here</p>
            <h2 className="auth-title">Sign Up</h2>
            <p className="auth-subtitle">Create your account to start building a personal weather dashboard.</p>
            <AuthForm mode="signup" />
            <p className="auth-footer">
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
