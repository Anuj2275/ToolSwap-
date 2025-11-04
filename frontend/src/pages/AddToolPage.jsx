import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddToolPage = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        const mesg =
          "Invalid file type. Please select a JPG, JPEG, or PNG image.";
        setError(mesg);
        toast.error(mesg);
        setImageFile(null);
        setImagePreview("");
        e.target.value = null;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const mesg = "File is too large. Maximum size is 5MB.";
        setError(mesg);
        toast.err(mesg);
        setImageFile(null);
        setImagePreview("");
        e.target.value = null;
        return;
      }

      setError("");
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !category || !description) {
      setError("Please fill in all text fields.");
      return;
    }
    if (!imageFile) {
      setError("Please select an image for the tool.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    const toolData = { name, category, description };
    formData.append(
      "tool",
      new Blob([JSON.stringify(toolData)], {
        type: "application/json",
      })
    );

    formData.append("image", imageFile);

    try {
      await api.post("/tools", formData, {
        headers: {},
      });
      toast.success("Tool listed successfully!");
      navigate("/my-tools");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to list tool. Check console for details.";
      setError(message);
      toast.error(message);
      console.error(
        "Add tool error:",
        err.response?.data || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) return null;
  if (loading) return <Loader />;

  return (
    <div className="max-w-lg mx-auto mt-8 md:mt-12 mb-10">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
        <h1 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark text-center">
          List a New Tool
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Cordless Drill"
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="e.g., Power Tools"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Describe your tool..."
              className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:border-transparent transition placeholder:text-muted-light dark:placeholder:text-muted-dark"
            />
          </div>

          {/* --- Image Input --- */}
          <div>
            <label
              htmlFor="image-upload"
              className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1.5"
            >
              Tool Photo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-light dark:border-border-dark border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {!imagePreview ? (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-muted-light dark:text-muted-dark"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-muted-light dark:text-muted-dark justify-center">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-card-light dark:bg-card-dark rounded-md font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:ring-cyan-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                        />
                      </label>
                      {/* <p className="pl-1">or drag and drop</p> */}
                    </div>
                    <p className="text-xs text-muted-light dark:text-muted-dark">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </>
                ) : (
                  // Image Preview
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Tool preview"
                      className="mx-auto h-32 w-auto rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                        document.getElementById("image-upload").value = null;
                      }} // Reset
                      className="absolute top-1 right-1 bg-red-600/70 hover:bg-red-700/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />{" "}
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* --- End Image Input --- */}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-opacity duration-150 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Listing Tool..." : "List Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolPage;
