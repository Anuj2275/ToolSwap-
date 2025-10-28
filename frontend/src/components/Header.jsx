import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className="block px-4 py-3 text-base font-medium text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-light rounded-md"
      onClick={() => setIsMobileMenuOpen(false)} 
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-50 border-b border-border-light dark:border-border-dark">
      <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link
          to="/"
          className="text-2xl font-bold text-primary dark:text-primary-light hover:opacity-80 transition-opacity"
        >
          ToolSwap
        </Link>

        {/* Right Side Icons and Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {" "}
          {/* Adjusted spacing */}
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="p-1.5 rounded-full text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-800 transition-colors"
          >
            {/* Moon/Sun Icons */}
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          {user ? (
            <>
              {/* --- Desktop Links --- */}
              <div className="hidden sm:flex items-center space-x-5">
                <Link
                  to="/"
                className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-tools"
                  className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  My Tools
                </Link>
                <Link
                  to="/add-tool"
                  className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  List Tool
                </Link>
              </div>

              {/* --- User Avatar & Logout (Always Visible) --- */}
              <div className="flex items-center space-x-2">
                <Link to="/profile" title="My Profile">
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 flex items-center justify-center text-white font-semibold text-xs uppercase cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    title={user.name}
                  >
                    {user.name ? user.name.charAt(0) : "?"}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hidden sm:block p-1.5 rounded-full text-muted-light dark:text-muted-dark hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 transition-colors" // Hidden on mobile initially
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>

              {/* --- Hamburger Button (Visible only on sm screens and below) --- */}
              <button
                onClick={toggleMobileMenu}
                className="sm:hidden p-1.5 rounded-md text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light" // sm:hidden
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg> // X icon
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg> // Hamburger icon
                )}
              </button>
            </>
          ) : (
            <>
              {" "}
              {/* Logged out links */}
              <Link
                to="/login"
                className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-light px-3 py-1.5 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white dark:text-slate-900 px-3 py-1.5 rounded-md transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* --- Mobile Menu Panel --- */}
      {user && (
        <div
          id="mobile-menu"
          className={`sm:hidden absolute top-full left-0 w-full bg-card-light dark:bg-card-dark shadow-lg border-t border-border-light dark:border-border-dark overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0" // Animate height and opacity
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/">Home</MobileNavLink>
            <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
            <MobileNavLink to="/my-tools">My Tools</MobileNavLink>
            <MobileNavLink to="/add-tool">List Tool</MobileNavLink>
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
