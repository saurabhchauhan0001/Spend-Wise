import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      setMessage(data.message || "OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#a78bfa,transparent_34%),linear-gradient(135deg,#312e81,#020617)] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950">Forgot password?</h1>
        <p className="mt-2 text-base leading-7 text-slate-500">
          Enter your email and we&apos;ll generate a one-time password for reset.
        </p>

        {!submitted ? (
          <>
            <input
              className="input mt-6 w-full"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="btn-primary mt-5 w-full justify-center" type="submit" disabled={loading}>
              {loading ? "Generating OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <div className="mt-6 space-y-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-700">
            <p>{message || `An OTP has been sent to ${email}.`}</p>
            <p className="text-xs font-medium text-emerald-700/80">
              Check your inbox or spam folder, then continue on the reset page.
            </p>
            <button
              type="button"
              className="block w-full rounded-xl bg-white px-3 py-2 text-center text-violet-700 underline decoration-violet-300 underline-offset-4"
              onClick={() => navigate("/reset-password", { state: { email } })}
            >
              Go to reset password
            </button>
          </div>
        )}

        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

        <Link to="/auth" className="mt-5 block text-center text-sm font-bold text-violet-700 transition hover:text-violet-900">
          Back to login
        </Link>
      </form>
    </div>
  );
}
