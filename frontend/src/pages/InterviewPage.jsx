import React, { useState, useEffect, useRef } from 'react';

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
  const jd = localStorage.getItem("jd");
  const resumeName = localStorage.getItem("resumeName");

  if (!jd || !resumeName) {
    alert("Missing job description or resume. Redirecting...");
    window.location.href = "/";
  }

  setJobDescription(jd);
  setResumeFile({ name: resumeName }); // mock for now
}, []);


  // Initialize Speech Recognition once
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer(transcript);
       setTimeout(() => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      askQuestion(nextIndex);
    } else {
      setCurrentQuestion("Thank you! That concludes the interview.");
      speakText("Thank you! That concludes the interview.");
    }
  }, 2000); // small delay after answer
};

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
  }, []);

  // Function to speak text aloud
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  // Start interview + ask first question + start listening
 const startInterview = () => {
  if (!jobDescription.trim() || !resumeFile) {
    alert('Please enter job description and upload a resume first!');
    return;
  }

  setInterviewStarted(true);
  setQuestionIndex(0);
  setUserAnswer('');
  askQuestion(0);
};
const askQuestion = (index) => {
  const question = questions[index];
  setCurrentQuestion(question);
  setUserAnswer('');
  speakText(question);

  if (recognitionRef.current) {
    recognitionRef.current.start();
  }
};


  const questions = [
  "Tell me about yourself.",
  "Why do you want this job?",
  "What are your strengths?",
  "Describe a challenge you overcame.",
  "Where do you see yourself in 5 years?"
];

const [questionIndex, setQuestionIndex] = useState(0);


  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Resume Voicebot Interview</h1>

      <label className="block mb-2 font-semibold">Paste Job Description:</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md mb-6"
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
      />

      <label className="block mb-2 font-semibold">Upload Resume (PDF/DOCX):</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files.length > 0) setResumeFile(e.target.files[0]);
        }}
        className="mb-4"
      />
      {resumeFile && <p className="mb-6 text-green-600">Uploaded: {resumeFile.name}</p>}

      <button
        onClick={startInterview}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
      >
        Start Interview
      </button>

      {interviewStarted && (
        <div className="mt-8 p-4 border border-blue-400 rounded-md bg-blue-50">
          <p className="text-xl font-medium">AI Question:</p>
          <p className="mt-2 text-lg italic">{currentQuestion}</p>

          <p className="mt-4 text-lg font-semibold">Your Answer:</p>
          <p className="mt-2 text-gray-700">{userAnswer || <i>Speak your answer aloud...</i>}</p>
        </div>
      )}
    </div>
  );
}
