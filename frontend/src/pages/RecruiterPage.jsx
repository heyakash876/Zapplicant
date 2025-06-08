import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RecruiterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [postedJobs, setPostedJobs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [timerWidth, setTimerWidth] = useState(100);
  const timerRef = useRef();
  const navigate = useNavigate();

  const handlePost = () => {
    if (!jobTitle.trim() || !jobDesc.trim()) {
      alert("Please fill in all fields");
      return;
    }
    const newJobs = [...postedJobs, { jobTitle, jobDesc }];
    setPostedJobs(newJobs);
    setJobTitle("");
    setJobDesc("");
    setShowPopup(true);
    setTimerWidth(100);
    // Save to localStorage for applicant page
    localStorage.setItem("postedJobs", JSON.stringify(newJobs));
  };

  useEffect(() => {
    // Load jobs from localStorage on mount
    try {
      const jobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
      setPostedJobs(jobs);
    } catch {
      setPostedJobs([]);
    }
  }, []);

  useEffect(() => {
    if (showPopup) {
      timerRef.current = setInterval(() => {
        setTimerWidth(prev => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            setShowPopup(false);
            return 0;
          }
          return prev - 2;
        });
      }, 30);
      return () => clearInterval(timerRef.current);
    }
  }, [showPopup]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark transition-colors duration-300">
      {/* Popup */}
      {showPopup && (
        <div className="fixed top-8 right-8 z-50">
          <div className="bg-card-light dark:bg-bg-dark text-green-400 px-6 py-4 rounded-xl shadow-lg flex items-center min-w-[220px] relative border border-green-700">
            <span className="font-semibold">Job posted successfully!</span>
            <div
              className="absolute left-0 bottom-0 h-1 bg-green-400 rounded-b-xl transition-all duration-75"
              style={{ width: `${timerWidth}%` }}
            />
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl bg-card-light dark:bg-bg-dark rounded-3xl shadow-2xl p-10 transition-colors duration-300 relative flex flex-col min-h-[650px] border border-gray-800">
        <h1 className="text-4xl font-extrabold mb-8 text-primary-light dark:text-primary-light tracking-tight text-center drop-shadow">
          Recruiter Job Posting
        </h1>
        {/* Top buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className="px-5 py-2 rounded-xl border border-primary-dark bg-primary-dark text-white font-semibold shadow hover:bg-primary hover:border-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Applicants Ranking
          </button>
          <button
            className="px-5 py-2 rounded-xl border border-gray-700 bg-bg-dark text-primary-light font-semibold shadow hover:bg-gray-900 hover:border-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => navigate("/recruiter/jobs")}
          >
            Job Postings
          </button>
        </div>
        {/* Job form card */}
        <div className="bg-card-dark rounded-2xl shadow-inner p-6 mb-8 border border-gray-700">
          {/* Job Title input */}
          <input
            className="w-full p-3 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary transition bg-bg-dark text-gray-100 placeholder:text-primary"
            placeholder="Job Title"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
          />
          {/* Job Description textarea */}
          <textarea
            className="w-full p-3 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary transition resize-none bg-bg-dark text-gray-100 placeholder:text-primary"
            placeholder="Paste or type job description here"
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            rows={6}
          />
          {/* Post Job button at bottom right */}
          <div className="flex justify-end">
            <button
              className="px-7 py-2 rounded-xl border border-primary bg-primary text-white font-semibold shadow-lg hover:bg-primary-dark hover:border-primary-dark transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={handlePost}
            >
              Post Job
            </button>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>
        {/* Posted Jobs */}
        {/* ...existing code... */}
      </div>
    </div>
  );
}
