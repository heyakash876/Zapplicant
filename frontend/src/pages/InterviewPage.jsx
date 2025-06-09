import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Simple keyword-based question generator
function generateQuestions(jobDesc, resumeText) {
  const jobKeywords = Array.from(
    new Set(
      (jobDesc || "")
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3)
    )
  );
  const resumeKeywords = Array.from(
    new Set(
      (resumeText || "")
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3)
    )
  );
  // Find overlap
  const overlap = jobKeywords.filter(kw => resumeKeywords.includes(kw));
  // Pick up to 3 overlap, 2 job-only
  const questions = [];
  overlap.slice(0, 3).forEach(kw => {
    questions.push(`Can you tell us more about your experience with "${kw}"?`);
  });
  jobKeywords
    .filter(kw => !overlap.includes(kw))
    .slice(0, 2)
    .forEach(kw => {
      questions.push(`How would you approach tasks involving "${kw}" in this role?`);
    });
  // Fallback
  if (questions.length === 0) {
    questions.push("Tell us about your most relevant experience for this job.");
    questions.push("Why are you interested in this position?");
  }
  return questions.slice(0, 5);
}

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { job, resumeText } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!job || !resumeText) {
      navigate("/applicant");
      return;
    }
    setQuestions(generateQuestions(job.jobDesc, resumeText));
  }, [job, resumeText, navigate]);

  const handleAnswer = (e) => {
    e.preventDefault();
    const form = e.target;
    const answer = form.answer.value.trim();
    if (!answer) return;
    setAnswers(prev => [...prev, answer]);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      form.reset();
    } else {
      setFinished(true);
    }
  };

  if (!job || !resumeText) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card-dark rounded-3xl shadow-2xl border border-gray-800 min-h-[60vh] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-primary-light text-center">AI Practice Interview</h1>
      <div className="mb-6 text-gray-300 text-center">
        {job.jobTitle && <div className="font-semibold mb-2">{job.jobTitle}</div>}
        <div className="text-sm text-gray-400 mb-2">Questions are tailored to your resume and this job.</div>
      </div>
      {!finished ? (
        <form onSubmit={handleAnswer} className="w-full flex flex-col items-center">
          <div className="text-lg font-semibold text-primary mb-4">{questions[current]}</div>
          <textarea
            name="answer"
            rows={3}
            className="w-full p-3 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary transition bg-bg-dark text-gray-100"
            placeholder="Type your answer here..."
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
          >
            {current + 1 === questions.length ? "Finish Interview" : "Next"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-4">Thank you for completing the interview!</div>
          <div className="mb-6 text-gray-300">Your answers have been recorded for your practice.</div>
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-dark transition"
            onClick={() => navigate("/applicant")}
          >
            Back to Jobs
          </button>
        </div>
      )}
    </div>
  );
}
