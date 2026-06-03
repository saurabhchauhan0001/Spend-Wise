import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const GoogleLogo = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
  </svg>
);

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function Auth() {
  const { login, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) return undefined;

    let mounted = true;

    loadGoogleScript()
      .then(() => {
        if (!mounted || !googleButtonRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response.credential) {
              setError("Google sign-in was cancelled");
              return;
            }

            setError("");
            setGoogleLoading(true);
            try {
              await loginWithGoogle(response.credential);
            } catch (err) {
              setError(err.response?.data?.message || "Google authentication failed");
            } finally {
              if (mounted) setGoogleLoading(false);
            }
          }
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: mode === "signup" ? "signup_with" : "signin_with",
          width: Math.min(368, googleButtonRef.current.offsetWidth || 368)
        });
      })
      .catch(() => {
        if (mounted) setError("Google sign-in could not load");
      });

    return () => {
      mounted = false;
    };
  }, [googleClientId, loginWithGoogle, mode]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(mode === "signup" ? form : { email: form.email, password: form.password }, mode);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#a78bfa,transparent_34%),linear-gradient(135deg,#312e81,#020617)] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950">SpendWise AI</h1>
        <p className="mt-2 text-base leading-7 text-slate-500">Modern expense tracking with smart insights.</p>
        {mode === "signup" && <input className="input mt-6" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
        <input className="input mt-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <div className="relative mt-3">
          <input
            className="input w-full pr-14"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center text-lg text-slate-400 transition hover:text-violet-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {mode === "login" && (
          <Link to="/forgot-password" className="mt-3 block text-right text-sm font-bold text-violet-700 transition hover:text-violet-900">
            Forgot password?
          </Link>
        )}
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
        <button className="btn-primary mt-5 w-full justify-center" disabled={loading || googleLoading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}</button>
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        {googleClientId ? (
          <div className={googleLoading ? "pointer-events-none flex justify-center opacity-60" : "flex justify-center"} ref={googleButtonRef} />
        ) : (
          <div>
            <button type="button" className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-500 shadow-sm" disabled>
              Continue with Google <GoogleLogo />
            </button>
          </div>
        )}
        <button type="button" className="mt-4 w-full text-sm text-violet-700" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Need an account? Sign up" : "Already registered? Login"}
        </button>
      </form>
    </div>
  );
}
