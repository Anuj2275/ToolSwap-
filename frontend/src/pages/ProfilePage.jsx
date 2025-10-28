import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader"; 

const AvatarPlaceholder = ({ name, size = "large" }) => {
  const sizeClasses = {
    small: "w-8 h-8 text-xs",
    medium: "w-10 h-10 text-sm",
    large: "w-24 h-24 text-3xl",
  };
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div
      className={`relative rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 flex items-center justify-center text-white font-semibold shadow-md ${sizeClasses[size]}`}
    >
      {initial}
      <span className="absolute bottom-0 right-1 block h-4 w-4 rounded-full bg-green-400 border-2 border-white dark:border-slate-700"></span>
    </div>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="max-w-md mx-auto mt-8 md:mt-12">
      {" "}
      {/* Centered, smaller max-width */}
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-xl overflow-hidden border border-border-light dark:border-border-dark p-6 md:p-8 transform transition-all duration-300 hover:shadow-2xl">
        {" "}
        {/* Added hover shadow */}
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <AvatarPlaceholder name={user.name} size="large" />
          <h1 className="mt-5 text-2xl font-bold text-text-light dark:text-text-dark">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            {user.email}
          </p>
        </div>
        {/* Action Buttons / Links */}
        <div className="space-y-3">
          {" "}
          {/* Reduced spacing */}
          {/* Placeholder links with icons */}
          {/* <button className="w-full flex items-center p-3 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-lg text-text-light dark:text-text-dark transition-colors text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-muted-light dark:text-muted-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings (Soon)
                     </button>
                      <button className="w-full flex items-center p-3 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-lg text-text-light dark:text-text-dark transition-colors text-sm font-medium">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-muted-light dark:text-muted-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        Reviews (Soon)
                     </button> */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 text-sm" // Adjusted focus offset for dark
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
