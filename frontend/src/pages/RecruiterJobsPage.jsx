import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const jobsData = JSON.parse(localStorage.getItem("postedJobs")) || [];
      setJobs(jobsData);
    } catch {
      setJobs([]);
    }
    // Fetch applications from localStorage (if you store them)
    try {
      const apps = JSON.parse(localStorage.getItem("jobApplications")) || [];
      setApplications(apps);
    } catch {
      setApplications([]);
    }
  }, []);

  const handleDelete = (idx) => {
    const updatedJobs = jobs.filter((_, i) => i !== idx);
    setJobs(updatedJobs);
    localStorage.setItem("postedJobs", JSON.stringify(updatedJobs));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark">
      <div className="max-w-2xl w-full bg-card-dark rounded-3xl shadow-2xl p-10 border border-gray-800">
        <h1 className="text-3xl font-extrabold mb-8 text-primary-light text-center">All Job Postings</h1>
        {jobs.length === 0 ? (
          <div className="text-gray-400 text-center">No jobs posted yet.</div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="border border-primary/20 bg-bg-dark p-5 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-primary-light">{job.jobTitle}</div>
                  <div className="text-gray-300 mt-2">{job.jobDesc}</div>
                  {/* Show applications for this job */}
                  <div className="mt-3">
                    <div className="text-sm text-gray-400 font-semibold mb-1">Applications:</div>
                    {applications.filter(app => app.jobIdx === idx).length === 0 ? (
                      <div className="text-xs text-gray-500">No applications yet.</div>
                    ) : (
                      <ul className="list-disc ml-5">
                        {applications
                          .filter(app => app.jobIdx === idx)
                          .map((app, i) => (
                            <li key={i} className="text-xs text-gray-300">
                              {app.name ? <span className="font-semibold">{app.name}:</span> : null} {app.resumeName}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition self-start md:self-center"
                  onClick={() => handleDelete(idx)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-10">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
            onClick={() => navigate("/recruiter")}
          >
            Back to Recruiter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
