import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ApplicantPage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Simulate fetching jobs from localStorage or mock data
  useEffect(() => {
    // Try to get jobs from localStorage (if recruiter page stores them there)
    let jobsData = [];
    try {
      jobsData = JSON.parse(localStorage.getItem("postedJobs")) || [];
    } catch {
      jobsData = [];
    }
    // If not found, use mock data
    if (!jobsData.length) {
      jobsData = [
        { jobTitle: "Application Developer", jobDesc: " Assist in developing and maintaining Android applications.Collaborate with the team to design, develop, and debug mobile applications.Write clean, scalable, and efficient code.Test and debug applications to ensure optimal performance.Participate in code reviews and contribute to team knowledge sharing.Stay up-to-date with the latest industry trends and technologies.Currently pursuing or recently completed a degree in Computer Science, Information Technology, or a related field.Good understanding of Java/Kotlin and Android SDK.Familiarity with Android Studio, XML layouts, and RESTful APIs.Basic understanding of version control systems (e.g., Git).Eagerness to learn and a passion for mobile technologies.Good problem-solving and communication skills.Experience with Firebase, SQLite, or third-party libraries.Personal or academic projects published on GitHub or Play Store." },
        { jobTitle: "Software Engineer", jobDesc: " Research, conceive, and develop software applications to extend and improve on Google's product offering.Contribute to a wide variety of projects utilizing natural language processing, artificial intelligence, data compression, machine learning, and search technologies.Collaborate on scalability issues involving access to data and information.Solve challenges/problems that you are presented with.Bachelor's degree or equivalent practical experience.Experience working with Unix/Linux environments, distributed systems, machine learning, information retrieval, and TCP/IP.Experience programming in C, C++, Java, or Python." },
        { jobTitle: "Python Developer", jobDesc: " Assist in developing and maintaining Android applications.Collaborate with the team to design, develop, and debug mobile applications.Write clean, scalable, and efficient code.Test and debug applications to ensure optimal performance.Participate in code reviews and contribute to team knowledge sharing.Stay up-to-date with the latest industry trends and technologies.Currently pursuing or recently completed a degree in Computer Science, Information Technology, or a related field.Good understanding of Java/Kotlin and Android SDK.Familiarity with Android Studio, XML layouts, and RESTful APIs.Basic understanding of version control systems (e.g., Git).Eagerness to learn and a passion for mobile technologies.Good problem-solving and communication skills.Experience with Firebase, SQLite, or third-party libraries.Personal or academic projects published on GitHub or Play Store." },
        { jobTitle: "Data Analyst", jobDesc: " Research, conceive, and develop software applications to extend and improve on Google's product offering.Contribute to a wide variety of projects utilizing natural language processing, artificial intelligence, data compression, machine learning, and search technologies.Collaborate on scalability issues involving access to data and information.Solve challenges/problems that you are presented with.Bachelor's degree or equivalent practical experience.Experience working with Unix/Linux environments, distributed systems, machine learning, information retrieval, and TCP/IP.Experience programming in C, C++, Java, or Python." },
      ];
    }
    setJobs(jobsData);
  }, []);

  const handleJobClick = (job, idx) => {
    // Pass job info via state or params
    navigate(`/apply/${idx}`, { state: { job } });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card-dark rounded-2xl shadow-xl border border-gray-800 min-h-[80vh]">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-light">Available Jobs</h1>
      <div className="grid gap-4 mb-8">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="bg-bg-dark border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-primary transition"
            onClick={() => handleJobClick(job, idx)}
          >
            <div className="font-semibold text-lg text-primary-light">{job.jobTitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
