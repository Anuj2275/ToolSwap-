import React from "react";

const Loader = () => {
  return (
    <div
      className="flex justify-center items-center min-h-[150px]"
      role="status"
      aria-label="Loading"
    >
      <span className="relative flex h-12 w-12">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-12 w-12 bg-blue-600"></span>
      </span>
    </div>
  );
};

export default Loader;
