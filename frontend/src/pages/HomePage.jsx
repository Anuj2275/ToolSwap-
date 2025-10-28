import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import ToolCard from "../components/ToolCard";
import Loader from "../components/Loader";

const HomePage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/tools");
        setTools(response.data);
      } catch (err) {
        setError("Failed to fetch tools. Please try again later.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    return (
      tool &&
      tool.name &&
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {" "}
      {/* Add spacing between sections */}
      {/* Hero/Search Section */}
      <div className="mb-8 p-6 md:p-8 bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Tools</h1>
        <p className="text-cyan-100 dark:text-teal-100 mb-5">
          Find and share tools with fellow students on campus.
        </p>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            {" "}
            {/* Increased padding */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-cyan-100 dark:text-teal-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search tools by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-cyan-400 dark:border-teal-500 bg-white/20 dark:bg-white/10 rounded-lg text-white placeholder-cyan-100 dark:placeholder-teal-100 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-cyan-300 focus:border-transparent transition duration-150 ease-in-out text-sm" // Adjusted styles
          />
        </div>
      </div>
      {/* Loading and Error States */}
      {loading && <Loader />}
      {error && (
        <div
          className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative text-center"
          role="alert"
        >
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Tools Grid */}
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
            Available Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-card-light dark:bg-card-dark rounded-lg shadow border border-border-light dark:border-border-dark">
                {" "}
                {/* Enhanced empty state */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-muted-light dark:text-muted-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="mt-4 text-muted-light dark:text-muted-dark">
                  {tools.length > 0 && searchTerm
                    ? "No tools found matching your search."
                    : "No tools have been listed yet."}
                </p>
                {!searchTerm && tools.length === 0 && (
                  <Link
                    to="/add-tool"
                    className="mt-6 inline-block bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white dark:text-slate-900 font-medium py-2 px-5 rounded-lg transition-colors shadow-sm"
                  >
                    List the First Tool
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
