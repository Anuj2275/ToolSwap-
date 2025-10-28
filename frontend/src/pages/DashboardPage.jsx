import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/bookings/my-bookings");
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch your bookings.");
        console.error("Fetch bookings error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const originalBookings = [...bookings];
    setBookings((prevBookings) =>
      prevBookings.map((b) =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
    );

    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success("Status Updated Successfully");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(
        `Failed to update status: ${err.response?.data?.message || err.message}`
      );
      setBookings(originalBookings);
    }
  };

  if (loading) return <Loader />;
  if (error)
    return <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>;
  if (!user) return <p>Please log in.</p>;

  const myBorrowRequests = bookings.filter((b) => b.borrower?.id === user?.id);
  const incomingRequests = bookings.filter((b) => b.owner?.id === user?.id);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      {/* Add overall spacing */}
      <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
        Dashboard
      </h1>
      {/* Combined Card for requests */}
      <div className="bg-card-light dark:bg-card-dark p-6 md:p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
        {/* Section for Incoming Requests */}
        <div className="mb-10">
          {" "}
          {/* Increased margin bottom */}
          <h2 className="text-xl font-semibold mb-5 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-2">
            Incoming Requests ({incomingRequests.length})
          </h2>
          {incomingRequests.length > 0 ? (
            <ul className="space-y-4">
              {incomingRequests.map((booking) => {
                const toolImageUrl =
                  booking.tool?.imageUrl &&
                  booking.tool.imageUrl.startsWith("http")
                    ? booking.tool.imageUrl
                    : null;
                return (
                  <li
                    key={booking.id}
                    className="border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-500"
                  >
                    {" "}
                    {/* Added hover */}
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      {toolImageUrl ? (
                        <img
                          src={toolImageUrl}
                          alt={booking.tool?.name || "Tool"}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0 shadow-sm"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-md flex items-center justify-center text-xs text-muted-light dark:text-muted-dark flex-shrink-0 shadow-sm">
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
                        <p className="text-sm text-text-light dark:text-text-dark truncate">
                          Request from{" "}
                          <span className="font-semibold">
                            {booking.borrower?.name || "Unknown User"}
                          </span>{" "}
                          for{" "}
                          <Link
                            to={`/tool/${booking.tool?.id}`}
                            className="font-semibold text-primary dark:text-primary-light hover:underline"
                          >
                            {booking.tool?.name || "Deleted Tool"}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p className="text-xs mt-1">
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              booking.status === "PENDING"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : booking.status === "APPROVED"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    {booking.status === "PENDING" && (
                      <div className="flex space-x-2 mt-3 sm:mt-0 flex-shrink-0 self-end sm:self-center">
                        {" "}
                        {/* Align buttons */}
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking.id, "APPROVED")
                          }
                          className="bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-800/50 dark:hover:bg-green-700/60 dark:text-green-300 px-3 py-1 rounded-md text-xs font-medium transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking.id, "DECLINED")
                          }
                          className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-800/50 dark:hover:bg-red-700/60 dark:text-red-300 px-3 py-1 rounded-md text-xs font-medium transition-colors shadow-sm"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-light dark:text-muted-dark text-sm italic">
              No incoming requests to manage.
            </p>
          )}
        </div>

        {/* Section for My Borrow Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-5 text-text-light dark:text-text-dark border-b border-border-light dark:border-border-dark pb-2">
            My Requests ({myBorrowRequests.length})
          </h2>
          {myBorrowRequests.length > 0 ? (
            <ul className="space-y-4">
              {myBorrowRequests.map((booking) => {
                const toolImageUrl =
                  booking.tool?.imageUrl &&
                  booking.tool.imageUrl.startsWith("http")
                    ? booking.tool.imageUrl
                    : null;
                return (
                  <li
                    key={booking.id}
                    className="border border-border-light dark:border-border-dark bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between gap-4 transition-shadow hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-500"
                  >
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      {toolImageUrl ? (
                        <img
                          src={toolImageUrl}
                          alt={booking.tool?.name || "Tool"}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0 shadow-sm"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-md flex items-center justify-center text-xs text-muted-light dark:text-muted-dark flex-shrink-0 shadow-sm">
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
                        <p className="text-sm text-text-light dark:text-text-dark truncate">
                          You requested{" "}
                          <Link
                            to={`/tool/${booking.tool?.id}`}
                            className="font-semibold text-primary dark:text-primary-light hover:underline"
                          >
                            {booking.tool?.name || "Deleted Tool"}
                          </Link>{" "}
                          from{" "}
                          <span className="font-semibold">
                            {booking.owner?.name || "Unknown User"}
                          </span>
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p className="text-xs mt-1">
                          Status:{" "}
                          <span
                            className={`font-semibold ${
                              booking.status === "PENDING"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : booking.status === "APPROVED"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    {/* Optional Actions */}
                    {/* <div className="flex-shrink-0">...</div> */}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-light dark:text-muted-dark text-sm italic">
              You haven't made any borrow requests yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
