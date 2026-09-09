import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP & new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/api/forgot-password`, { email });
      setMessage(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP. Please check email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/api/reset-password`, {
        email,
        otp: otp.trim(),
        password,
      });
      setMessage(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-7 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">
            {step === 1 ? "Forgot Password" : "Enter Verification OTP"}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {step === 1
              ? "Enter your email to receive a 6-digit reset OTP"
              : `Enter the 6-digit OTP sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Enter your registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              type="text"
              required
              maxLength="6"
              placeholder="Enter 6-Digit OTP (e.g. 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-center tracking-widest text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <input
              type="password"
              required
              minLength="8"
              placeholder="Enter New Password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify OTP & Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              ← Change Email or Resend OTP
            </button>
          </form>
        )}

        {message && (
          <p className="text-center text-xs font-medium text-orange-400 mt-1">
            {message}
          </p>
        )}

        <div className="text-center pt-2 border-t border-slate-800 mt-1">
          <Link to="/login" className="text-xs text-slate-400 hover:text-orange-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
