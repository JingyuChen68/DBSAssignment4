"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let result;

    if (isSignup) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    setMessage(isSignup ? "Account created. Please log in if needed." : "Logged in successfully.");
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label className="auth-label" htmlFor={`${mode}-email`}>
          Email address
        </label>
        <input
          id={`${mode}-email`}
          className="auth-input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <div className="auth-label-row">
          <label className="auth-label" htmlFor={`${mode}-password`}>
            Password
          </label>
          {isSignup ? <span className="auth-meta">Use at least 6 characters</span> : null}
        </div>
        <input
          id={`${mode}-password`}
          className="auth-input"
          type="password"
          placeholder={isSignup ? "Create a secure password" : "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="primary-button auth-submit" type="submit" disabled={loading}>
        {loading ? "Working..." : isSignup ? "Create Account" : "Log In"}
      </button>

      {message ? (
        <p className={`auth-message ${message.toLowerCase().includes("success") || message.toLowerCase().includes("created") ? "success" : "error"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
