import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "recruiter") {
      navigate("/recruiter");
    } else if (role === "applicant") {
      navigate("/applicant");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18181b] via-[#232336] to-[#09090b]">
      <div className="max-w-3xl mx-auto p-10 bg-card-dark rounded-3xl shadow-2xl border border-gray-800 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-primary-light tracking-tight">
          Welcome to Zapplicant
        </h1>
        <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">
          Your AI-powered platform for recruiters and applicants. Choose your role
          to get started.
        </p>
        {/* Role selection below description */}
        <div className="bg-card-dark p-10 rounded-2xl shadow-xl border border-gray-700 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-primary-light">
            Select Your Role
          </h2>
          <div className="flex gap-8">
            <button
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-primary-dark transition"
              onClick={() => handleSelect("applicant")}
            >
              Applicant
            </button>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-700 transition"
              onClick={() => handleSelect("recruiter")}
            >
              Recruiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
