import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {

            const response = await axios.post(
                "http://localhost:3000/auth/api/register",
                form
            );
            setMessage(response.data.message || "Registration successful! Please check your email to verify your account.");
            setForm({ name: "", email: "", password: "" }); // Clear form

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Unable to connect to server"
            );
        }
    };

    return (
        <div className="auth-container min-h-screen flex items-center justify-center bg-gray-50 p-10">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4"
            >

                <div className="text-center mb-2">

                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Account
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Join our pizza delivery platform
                    </p>

                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter your Full Name"
                    required
                    onChange={handleChange}
                    value={form.name}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    required
                    onChange={handleChange}
                    value={form.email}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    minLength="8"
                    required
                    onChange={handleChange}
                    value={form.password}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />

                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg"
                >
                    Register
                </button>

                {message && (
                    <p className="text-center">
                        {message}
                    </p>
                )}

                <span className="text-center text-gray-500 text-sm mt-2">

                    Already have an Account?{" "}

                    <Link
                        to="/login"
                        className="text-orange-500 font-medium hover:underline"
                    >
                        Login
                    </Link>

                </span>

            </form>

        </div>
    );
}