import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      login(
        {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        },
        response.data.token
      );
      toast.success("Login Successful!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials";
      setError(message);
      toast.error(message);
      console.error(`Login error ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-900 px-4 py-12">
      {" "}
      {/* Dark BG, padding */}
      <div className="w-full max-w-sm bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
        {" "}
        {/* Softer shadow */}
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 p-3 rounded-full shadow-lg mb-4">
            {" "}
            {/* Teal/Cyan Gradient */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">
            Welcome Back
          </h2>
          <p className="text-muted-light dark:text-muted-dark text-sm mt-1">
            Sign in to your ToolSwap account
          </p>
        </div>
        {error && (
          <p className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          {/* Increased spacing */}
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5"
              htmlFor="email"
            >
              {" "}
              {/* Adjusted spacing/color */}
              University Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-light dark:text-muted-dark"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@university.edu.in"
                className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark" // Dark mode styles
              />
            </div>
          </div>
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-muted-light dark:text-muted-dark"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.743-0.257A6 6 0 1118 8zM10 16a4 4 0 100-8 4 4 0 000 8z"
                    clipRule="evenodd"
                  />{" "}
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 100-20 10 10 0 000 20z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark" // Dark mode styles
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-opacity duration-150 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed" // Gradient button
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-muted-light dark:text-muted-dark text-sm mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary dark:text-primary-light hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
