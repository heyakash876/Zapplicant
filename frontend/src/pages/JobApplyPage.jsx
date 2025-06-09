import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

export default function JobApplyPage() {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || null);
  const [resumeFile, setResumeFile] = useState(null);
  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [resumeText, setResumeText] = useState(""); // add this line

  useEffect(() => {
    if (!job) {
      // Fallback: get job from localStorage by index
      try {
        const jobs = JSON.parse(localStorage.getItem("postedJobs")) || [];
        setJob(jobs[jobId]);
      } catch {
        setJob(null);
      }
    }
  }, [job, jobId]);

  const handleResumeUpload = (e) => {
    if (e.target.files.length > 0) setResumeFile(e.target.files[0]);
  };

  // Helper to extract text from any file type
  const extractTextFromFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "txt") {
      return await file.text();
    }
    if (ext === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + " ";
      }
      return text;
    }
    if (ext === "docx") {
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return value;
    }
    // For unsupported types, try to read as text (may not work for binary files)
    try {
      return await file.text();
    } catch {
      return "";
    }
  };

  // Save application to localStorage
  const saveApplication = (resumeName) => {
    const apps = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    apps.push({
      jobIdx: Number(jobId),
      name: applicantName,
      resumeName: resumeName || (resumeFile && resumeFile.name) || "",
      date: new Date().toISOString(),
    });
    localStorage.setItem("jobApplications", JSON.stringify(apps));
  };

  // Only TXT and PDF parsing
  const parseAndScoreResume = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first!");
      return;
    }
    const text = await extractTextFromFile(resumeFile);
    if (!text || !text.trim()) {
      alert("Could not extract text from this file type.");
      return;
    }
    setResumeText(text); // save for interview
    const resumeTextLower = text.toLowerCase();
    const jobText = (job.jobDesc || "").toLowerCase();

    const stopwords = [
      "the", "and", "a", "to", "of", "in", "for", "on", "with", "as", "by", "is", "at", "an", "be", "or", "are", "from", "that", "this", "will", "you"
    ];
    const jobKeywords = Array.from(
      new Set(
        jobText
          .replace(/[^a-zA-Z0-9 ]/g, " ")
          .split(/\s+/)
          .filter(w => w.length > 2 && !stopwords.includes(w))
      )
    );
    let matched = 0;
    jobKeywords.forEach(kw => {
      if (resumeTextLower.includes(kw)) matched++;
    });
    const score = jobKeywords.length === 0 ? 0 : Math.round((matched / jobKeywords.length) * 100);

    setScore(score);
    setShowScore(true);
    saveApplication(resumeFile.name);
    setTimeout(() => setShowScore(false), 5000);
  };

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-gray-200">
        <p className="text-lg">Job not found.</p>
        <button className="mt-6 text-primary underline hover:text-primary-light transition" onClick={() => navigate("/applicant")}>
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-[#232336] via-[#18181b] to-[#09090b] rounded-3xl shadow-2xl border border-gray-800 min-h-[60vh] flex flex-col">
      {/* ATS Score Popup */}
      {showScore && (
        <div className="fixed top-8 right-8 z-50">
          <div className="bg-card-dark border border-primary px-8 py-6 rounded-xl shadow-lg flex flex-col items-center min-w-[220px]">
            <span className="font-bold text-primary-light text-lg mb-2">ATS Score</span>
            <span className="text-3xl font-extrabold text-green-400 mb-1">{score}%</span>
            <span className="text-gray-300 text-sm mb-4">Your resume matches {score}% of the job description keywords.</span>
            {score >= 75 && (
              <button
                className="mt-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
                onClick={() => navigate("/interview", {
                  state: {
                    job,
                    resumeText,
                  }
                })}
              >
                Practice Small Interview
              </button>
            )}
            {score < 75 && (
              <span className="text-xs text-red-400 mt-2">Score must be 75% to unlock interview.</span>
            )}
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-primary-light tracking-tight">{job.jobTitle}</h1>
        <div className="h-1 w-16 bg-primary rounded mb-4"></div>
        <p className="mb-0 text-lg text-gray-200 leading-relaxed">{job.jobDesc}</p>
      </div>
      <div className="bg-card-dark rounded-2xl shadow-inner p-6 border border-gray-700 flex flex-col gap-4">
        <label className="block font-semibold text-gray-200 text-lg mb-1">Your Name (optional)</label>
        <input
          type="text"
          value={applicantName}
          onChange={e => setApplicantName(e.target.value)}
          className="mb-2 p-2 rounded bg-bg-dark border border-gray-700 text-gray-100"
          placeholder="Enter your name"
        />
        <label className="block font-semibold text-gray-200 text-lg mb-1">Upload Your Resume</label>
        <input
          type="file"
          onChange={handleResumeUpload}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition bg-bg-dark text-gray-100"
        />
        {resumeFile && (
          <div className="text-green-400 text-sm">Uploaded: {resumeFile.name}</div>
        )}
        <div className="flex gap-4 mt-4">
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
            onClick={parseAndScoreResume}
          >
            Submit Resume & Get ATS Score
          </button>
          <button
            className="text-gray-400 underline hover:text-primary-light transition px-2"
            onClick={() => navigate("/applicant")}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
