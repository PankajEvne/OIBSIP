import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/api/verify-email/${token}`);
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link might be invalid or expired.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to connect to the server.");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Verifying your email, please wait...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">✅</span>
            <p className="text-green-600 font-semibold text-lg">{message}</p>
            <Link
              to="/login"
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl">❌</span>
            <p className="text-red-500 font-semibold text-lg">{message}</p>
            <Link
              to="/login"
              className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
