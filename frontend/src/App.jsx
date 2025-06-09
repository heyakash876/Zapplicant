import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecruiterPage from "./pages/RecruiterPage";
import RecruiterJobsPage from "./pages/RecruiterJobsPage";
import ApplicantPage from "./pages/ApplicantPage";
import JobApplyPage from "./pages/JobApplyPage";
import InterviewPage from "./pages/InterviewPage";

// Remove popup logic entirely, just provide routes
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
        <Route path="/applicant" element={<ApplicantPage />} />
        <Route path="/apply/:jobId" element={<JobApplyPage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}
