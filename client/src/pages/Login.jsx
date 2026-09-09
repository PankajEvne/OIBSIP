import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {

      const response = await axios.post(
        `${API_URL}/auth/api/login`,
        form
      );

      setMessage("login successful!");

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));

      setTimeout(() => {
        if (response.data.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Unable to connect to server"
      );
    }
  };

  return (
    <div className='auth-container min-h-screen flex items-center justify-center bg-gray-50 p-10'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4'>
        <div className='text-center mb-2'>
          <h1 className='text-2xl font-bold text-gray-800'>Welcome Back 🍕</h1>
          <p className='text-gray-500 mt-1'>Login to your account</p>
        </div>

        <input
          type="email"
          name="email"
          placeholder='Enter your Email'
          required
          onChange={handleChange}
          value={form.email}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400'
        />

        <input
          type="password"
          name="password"
          placeholder='Enter your Password'
          minLength='8'
          required
          onChange={handleChange}
          value={form.password}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400'
        />

        <div className="flex justify-end text-xs">
          <Link to="/forgot-password" className="text-orange-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type='submit'
          className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1'
        >
          Login
        </button>

        {message && <p>{message}</p>}

        <span className='text-center text-gray-505 text-sm mt-2'>
          Don't have an Account?{' '}
          <Link to="/register" className='text-orange-500 font-medium hover:underline'>
            Register
          </Link>
        </span>

      </form>
    </div>
  )
}
