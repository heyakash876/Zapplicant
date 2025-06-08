import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!jobDescription.trim() || !resumeFile) {
      alert("Please provide job description and resume file");
      return;
    }

    // Save to localStorage (temp store)
    localStorage.setItem("jd", jobDescription);
    localStorage.setItem("resumeName", resumeFile.name);

    navigate("/interview");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Resume Voicebot</h1>

      <label className="block mb-2 font-semibold">Job Description</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <label className="block mb-2 font-semibold">Upload Resume</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleStart}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Start Interview
      </button>
    </div>
  );
}
