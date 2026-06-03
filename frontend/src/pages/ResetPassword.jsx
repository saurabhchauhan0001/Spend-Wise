import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { email, otp, password });
      setMessage(data.message || "Password updated successfully");
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      navigate("/auth", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#a78bfa,transparent_34%),linear-gradient(135deg,#312e81,#020617)] p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white/95 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-950">Reset password</h1>
        <p className="mt-2 text-base leading-7 text-slate-500">
          Enter your email, OTP, and a new password.
        </p>

        {message && <p className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{message}</p>}
        {error && <p className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-600">{error}</p>}

        <input
          className="input mt-6 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="input mt-3 w-full"
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          inputMode="numeric"
          maxLength={6}
          required
        />
        <input
          className="input mt-3 w-full"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
        <input
          className="input mt-3 w-full"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          required
        />
        <button className="btn-primary mt-5 w-full justify-center" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </button>

        <Link to="/auth" className="mt-5 block text-center text-sm font-bold text-violet-700 transition hover:text-violet-900">
          Back to login
        </Link>
      </form>
    </div>
  );
}
