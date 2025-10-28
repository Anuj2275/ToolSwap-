import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Invalid email format.";
    else if (!email.endsWith(".edu.in"))
      errors.email = "Must be a .edu.in email.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    return errors;
  };
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setError("");

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      login(
        {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
        },
        response.data.token
      );
      toast.success("Registration Successful!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-sm bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 p-3 rounded-full shadow-lg mb-4">
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
            Create Account
          </h2>
          <p className="text-muted-light dark:text-muted-dark text-sm mt-1">
            Join the ToolSwap community
          </p>
        </div>

        {error && (
          <p className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-lg ... transition ${
                validationErrors.name
                  ? "border-red-500 dark:border-red-600 ring-1 ring-red-500"
                  : "border-border-light dark:border-border-dark focus:ring-primary dark:focus:ring-primary-light"
              }`}
            />
          </div>
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5"
              htmlFor="email"
            >
              University Email (.edu.in)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@university.edu.in"
              className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark ${
                validationErrors.email
                  ? "border-red-500 dark:border-red-600 ring-1 ring-red-500"
                  : "border-border-light dark:border-border-dark focus:ring-primary dark:focus:ring-primary-light"
              } `}
            />
          </div>
          <div>
            <label
              className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5"
              htmlFor="password"
            >
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark ${
                validationErrors.password
                  ? "border-red-500 dark:border-red-600 ring-1 ring-red-500"
                  : "border-border-light dark:border-border-dark focus:ring-primary dark:focus:ring-primary-light"
              }`}
            />
            {validationErrors.password && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-opacity duration-150 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed" // Gradient button
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted-light dark:text-muted-dark text-sm mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary dark:text-primary-light hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
