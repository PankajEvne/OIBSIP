import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/api/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired token/OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-slate-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-7 flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-xs mt-1">Enter your new password</p>
        </div>
        <input
          type="password"
          required
          minLength="8"
          placeholder="New Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        {message && <p className="text-center text-xs font-medium text-orange-400">{message}</p>}
        <div className="text-center pt-2 border-t border-slate-800">
          <Link to="/login" className="text-xs text-slate-400 hover:text-orange-500">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
