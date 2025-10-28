import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const MyToolsPage = () => {
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyTools = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/tools/my-tools");
        setMyTools(response.data);
      } catch (err) {
        setError("Failed to fetch your tools. Please try again.");
        console.error("Fetch my tools error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTools();
  }, [user]);

  const handleDelete = async (toolIdToDelete) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tool? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/tools/${toolIdToDelete}`);
      setMyTools((prevTools) =>
        prevTools.filter((tool) => tool.id !== toolIdToDelete)
      );
      toast.success("Tool deleted successfully!");
    } catch (err) {
      toast.err(
        `Failed to delete tool: ${err.response?.data?.message || err.message}`
      );
      console.error("Delete tool error:", err);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>;
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-3 sm:mb-0">
          My Tools
        </h1>
        <Link
          to="/add-tool"
          className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 hover:opacity-90 shadow-md hover:shadow-lg text-sm" // Gradient button
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          List New Tool
        </Link>
      </div>

      {myTools.length > 0 ? (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
          <ul className="divide-y divide-border-light dark:divide-border-dark">
            {myTools.map((tool) => {
              const toolImageUrl =
                tool.imageUrl && tool.imageUrl.startsWith("http")
                  ? tool.imageUrl
                  : null;
              return (
                <li
                  key={tool.id}
                  className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {" "}
                  {/* Adjusted gap/padding */}
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    {toolImageUrl ? (
                      <img
                        src={toolImageUrl}
                        alt={tool.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 shadow-sm"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-xs text-muted-light dark:text-muted-dark flex-shrink-0 shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          {" "}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <Link to={`/tool/${tool.id}`} className="group">
                        <h3
                          className="text-md font-semibold text-text-light dark:text-text-dark truncate group-hover:text-primary dark:group-hover:text-primary-light transition-colors"
                          title={tool.name}
                        >
                          {tool.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-light dark:text-muted-dark mt-0.5">
                        {tool.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 sm:mt-0 flex-shrink-0 self-end sm:self-center">
                    <Link
                      to={`/edit-tool/${tool.id}`}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-800/50 dark:hover:bg-yellow-700/60 dark:text-yellow-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm" // Adjusted style and padding
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tool.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-800/50 dark:hover:bg-red-700/60 dark:text-red-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm" // Adjusted style and padding
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="bg-card-light dark:bg-card-dark p-10 rounded-xl shadow-xl border border-border-light dark:border-border-dark text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-muted-light dark:text-muted-dark"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7c0-.53.181-1.03.504-1.445M20 7c0-.53-.181-1.03-.504-1.445M12 11V3m0 18v-8"
            />
          </svg>{" "}
          {/* Database Icon */}
          <p className="mt-4 text-muted-light dark:text-muted-dark">
            You haven't listed any tools yet.
          </p>
          <Link
            to="/add-tool"
            className="mt-6 inline-block bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-300 hover:opacity-90 shadow-md hover:shadow-lg text-sm"
          >
            List Your First Tool
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyToolsPage;
