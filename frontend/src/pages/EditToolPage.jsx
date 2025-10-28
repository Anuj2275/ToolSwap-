import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const EditToolPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [toolData, setToolData] = useState({
    name: "",
    category: "",
    description: "",
  });
  const [initialOwnerEmail, setInitialOwnerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTool = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/tools/${id}`);
        const { name, category, description, owner } = response.data;
        if (owner && owner.email) {
          setToolData({ name, category, description });
          setInitialOwnerEmail(owner.email);
        } else {
          throw new Error("Tool data is incomplete.");
        }
      } catch (err) {
        setError("Failed to load tool data. It might have been removed.");
        console.error("Fetch tool error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToolData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    if (user?.email !== initialOwnerEmail) {
      setError("You are not authorized to edit this tool.");
      setIsSubmitting(false);
      return;
    }

    const updatePayload = {
      name: toolData.name,
      category: toolData.category,
      description: toolData.description,
    };

    try {
      await api.put(`/tools/${id}`, updatePayload);
      toast.success("Tool updated successfully!");
      navigate("/my-tools");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update tool.";
      setError(message);
      toast.error(message);
      console.error("Update tool error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (
    error ||
    (user && initialOwnerEmail && user.email !== initialOwnerEmail)
  ) {
    const displayError =
      error || "You do not have permission to edit this tool.";
    return (
      <p className="text-red-600 dark:text-red-400 text-center mt-10">
        {displayError}
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-muted-light dark:text-muted-dark">
        Please log in to edit tools.
      </p>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8 md:mt-12 mb-10">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
        <h1 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark text-center">
          Edit Tool Details
        </h1>

        {error && (
          <p className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1.5"
            >
              Tool Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={toolData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition placeholder:text-muted-light dark:placeholder:text-muted-dark"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1.5"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={toolData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition placeholder:text-muted-light dark:placeholder:text-muted-dark"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={toolData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition placeholder:text-muted-light dark:placeholder:text-muted-dark"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-opacity duration-150 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditToolPage;
