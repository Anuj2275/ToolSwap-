import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x400?text=Tool+Image";

const ToolDetailPage = () => {
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTool = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/tools/${id}`);
        setTool(response.data);
      } catch (err) {
        setError("Failed to load tool details. It might have been removed.");
        console.error("Fetch tool error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  const handleBookingRequest = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setBookingError("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setBookingError("End date must be after start date.");
      return;
    }
    if (new Date(startDate) < new Date()) {
      setBookingError("Start date must be in the future.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/bookings", {
        toolId: tool.id,
        startDate: startDate,
        endDate: endDate,
      });
      const success = "Booking request sent successfully!";
      setBookingSuccess(success);
      toast.success(success);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to send booking request.";

      setBookingError(message);
      toast.error(message);
      console.error("Booking request error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!tool) return <p className="text-center mt-10">Tool not found.</p>;

  const isOwner = user && tool.owner && user.email === tool.owner.email;
  const imageUrl =
    tool.imageUrl && tool.imageUrl.startsWith("http") ? tool.imageUrl : null;

  return (
    <div className="max-w-4xl mx-auto mt-8 md:mt-12 mb-10">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-xl overflow-hidden border border-border-light dark:border-border-dark">
        <div className="grid md:grid-cols-5 gap-0">
          {/* Image Column */}
          <div className="md:col-span-2 p-4 md:p-6 bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center">
            {" "}
            {/* Centered image */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={tool.name}
                className="max-w-full max-h-80 object-contain rounded-lg shadow-sm" // Max height, contain, shadow
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement
                    .querySelector(".placeholder-icon-detail")
                    ?.classList.remove("hidden");
                }}
              />
            ) : null}
            {/* Placeholder */}
            <div
              className={`placeholder-icon-detail w-full h-80 bg-gray-100 dark:bg-slate-600 rounded-lg flex items-center justify-center text-muted-light dark:text-muted-dark ${
                imageUrl ? "hidden" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
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
          </div>

          {/* Details Column */}
          <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {" "}
              {/* Info Block */}
              <span className="inline-block bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide">
                {" "}
                {/* Teal Accent */}
                {tool?.category || "Uncategorized"}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-light dark:text-text-dark mb-4">
                {tool?.name}
              </h1>
              {/* Owner Info */}
              <div className="flex items-center bg-gray-100 dark:bg-slate-700 p-3 rounded-lg mb-6 border border-border-light dark:border-border-dark shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600 dark:text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-light dark:text-text-dark">
                    {tool?.owner?.name || "Unknown Owner"}
                  </p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">
                    Tool Owner
                  </p>
                </div>
              </div>
              <h3 className="text-md font-semibold text-text-light dark:text-text-dark mb-2">
                Description
              </h3>
              <p className="text-muted-light dark:text-muted-dark text-sm mb-8 leading-relaxed">
                {tool?.description}
              </p>{" "}
              {/* Increased line height */}
            </div>

            {/* Action Block */}
            <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark">
              {" "}
              {/* Separator */}
              {/* Booking Form */}
              {token && !isOwner && (
                <form
                  onSubmit={handleBookingRequest}
                  className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-border-light dark:border-border-dark"
                >
                  <h3 className="text-lg font-semibold mb-4 text-text-light dark:text-text-dark">
                    Request This Tool
                  </h3>
                  {bookingError && (
                    <p className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-2 rounded mb-3 text-sm">
                      {bookingError}
                    </p>
                  )}
                  {bookingSuccess && (
                    <p className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 p-2 rounded mb-3 text-sm">
                      {bookingSuccess}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1"
                      >
                        From
                      </label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-md text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-xs font-medium text-muted-light dark:text-muted-dark mb-1"
                      >
                        To
                      </label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-md text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !!bookingSuccess}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {isSubmitting ? "Sending Request..." : "Send Request"}
                  </button>
                </form>
              )}
              {/* Prompt to Login */}
              {!token && !isOwner && (
                <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border border-teal-200 dark:border-teal-700 text-center">
                  <p className="text-teal-800 dark:text-teal-200 text-sm">
                    Please{" "}
                    <Link
                      to="/login"
                      className="font-semibold underline hover:opacity-80"
                    >
                      login
                    </Link>{" "}
                    or{" "}
                    <Link
                      to="/register"
                      className="font-semibold underline hover:opacity-80"
                    >
                      register
                    </Link>{" "}
                    to request this tool.
                  </p>
                </div>
              )}
              {/* Message for Owner */}
              {isOwner && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 text-center">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
                    This is your tool listing. Manage it from{" "}
                    <Link
                      to="/my-tools"
                      className="underline font-semibold hover:opacity-80"
                    >
                      My Tools
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
