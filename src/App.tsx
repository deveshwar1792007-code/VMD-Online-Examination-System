import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  LogIn,
  LogOut,
  Play,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type PublishedExam = {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  duration: number;
  questions: Question[];
};

type Result = {
  examTitle: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  performance: string;
  date: string;
  studentName: string;
  certificateId: string;
};

const subjects = [
  "Data Structures Fundamentals",
  "Operating Systems",
  "Advanced Programming",
  "Mathematical Transforms and Boundary Value Problems",
  "Computer Organization and Architecture",
];

const initialExams = [
  {
    id: 1,
    title: "Data Structures Fundamentals",
    subject: "Data Structures Fundamentals",
    questions: 20,
    duration: 30,
  },
  {
    id: 2,
    title: "Operating Systems",
    subject: "Operating Systems",
    questions: 20,
    duration: 30,
  },
  {
    id: 3,
    title: "Advanced Programming Practice",
    subject: "Advanced Programming",
    questions: 20,
    duration: 30,
  },
  {
    id: 4,
    title: "Mathematical Transforms and Boundary Value Problems",
    subject: "Mathematical Transforms and Boundary Value Problems",
    questions: 20,
    duration: 30,
  },
  {
    id: 5,
    title: "Computer Organization and Architecture",
    subject: "Computer Organization and Architecture",
    questions: 20,
    duration: 30,
  },
];

function App() {
  const [role, setRole] = useState<"student" | "teacher" | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [publishedExam, setPublishedExam] =
    useState<PublishedExam | null>(() => {
      const saved = localStorage.getItem("vmdPublishedExam");
      return saved ? JSON.parse(saved) : null;
    });

  const [results, setResults] = useState<Result[]>(() => {
    const saved = localStorage.getItem("vmdResults");
    return saved ? JSON.parse(saved) : [];
  });

  const [page, setPage] = useState<
    "dashboard" | "generator" | "exam" | "result"
  >("dashboard");

  const [selectedExam, setSelectedExam] =
    useState<PublishedExam | null>(null);

  const [lastResult, setLastResult] = useState<Result | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      setError("Please select Student or Teacher.");
      return;
    }

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setRole(null);
    setEmail("");
    setPassword("");
    setPage("dashboard");
  };

  const savePublishedExam = (exam: PublishedExam) => {
    setPublishedExam(exam);
    localStorage.setItem("vmdPublishedExam", JSON.stringify(exam));
  };

  const saveResult = (result: Result) => {
    const updated = [...results, result];
    setResults(updated);
    localStorage.setItem("vmdResults", JSON.stringify(updated));
  };

  if (!loggedIn) {
    return (
      <LoginPage
        role={role}
        setRole={setRole}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        error={error}
        onLogin={handleLogin}
      />
    );
  }

  if (role === "teacher") {
    return (
      <TeacherDashboard
        email={email}
        publishedExam={publishedExam}
        savePublishedExam={savePublishedExam}
        results={results}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}
      />
    );
  }

  return (
    <StudentDashboard
      email={email}
      publishedExam={publishedExam}
      results={results}
      selectedExam={selectedExam}
      setSelectedExam={setSelectedExam}
      lastResult={lastResult}
      setLastResult={setLastResult}
      saveResult={saveResult}
      onLogout={handleLogout}
      page={page}
      setPage={setPage}
    />
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage({
  role,
  setRole,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  onLogin,
}: {
  role: "student" | "teacher" | null;
  setRole: (value: "student" | "teacher") => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string;
  onLogin: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white mb-4">
            <GraduationCap size={34} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            VMD Online Examination
          </h1>

          <p className="text-slate-500 mt-2">
            Secure • Simple • Smart
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="text-slate-500 mt-1 mb-6">
            Login to continue
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                role === "student"
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <User size={25} />
              <span className="font-semibold">Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                role === "teacher"
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <Users size={25} />
              <span className="font-semibold">Teacher</span>
            </button>
          </div>

          <form onSubmit={onLogin}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-slate-300 rounded-lg py-3 px-4 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg py-3 px-4 pr-20 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 VMD Online Examination System
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TEACHER DASHBOARD
========================================================= */

function TeacherDashboard({
  email,
  publishedExam,
  savePublishedExam,
  results,
  onLogout,
  page,
  setPage,
}: {
  email: string;
  publishedExam: PublishedExam | null;
  savePublishedExam: (exam: PublishedExam) => void;
  results: Result[];
  onLogout: () => void;
  page: "dashboard" | "generator" | "exam" | "result";
  setPage: (
    value: "dashboard" | "generator" | "exam" | "result"
  ) => void;
}) {
  if (page === "generator") {
    return (
      <AIExamGenerator
        publishedExam={publishedExam}
        savePublishedExam={savePublishedExam}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  // -----------------------------
  // ANALYTICS CALCULATIONS
  // -----------------------------

  const totalAttempts = results.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          results.reduce((sum, result) => sum + result.percentage, 0) /
            totalAttempts
        )
      : 0;

  const highestScore =
    totalAttempts > 0
      ? Math.max(...results.map((result) => result.percentage))
      : 0;

  const passCount = results.filter(
    (result) => result.percentage >= 40
  ).length;

  const passPercentage =
    totalAttempts > 0
      ? Math.round((passCount / totalAttempts) * 100)
      : 0;

  const goodCount = results.filter(
    (result) => result.performance === "Good"
  ).length;

  const averageCount = results.filter(
    (result) => result.performance === "Average"
  ).length;

  const badCount = results.filter(
    (result) => result.performance === "Bad"
  ).length;

  // Subject-wise analytics
  const subjectStats = Array.from(
    new Set(results.map((result) => result.subject))
  ).map((subject) => {
    const subjectResults = results.filter(
      (result) => result.subject === subject
    );

    const average =
      subjectResults.length > 0
        ? Math.round(
            subjectResults.reduce(
              (sum, result) => sum + result.percentage,
              0
            ) / subjectResults.length
          )
        : 0;

    return {
      subject,
      attempts: subjectResults.length,
      average,
    };
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        title="VMD Online Examination"
        subtitle="Teacher Portal"
        email={email}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Teacher Dashboard 👨‍🏫
          </h2>

          <p className="text-slate-500 mt-2">
            Create, publish and analyze examinations.
          </p>
        </div>

        {/* TOP STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Published Exam"
            value={publishedExam ? "1" : "0"}
            icon={<BookOpen size={22} />}
          />

          <StatCard
            title="Questions"
            value={
              publishedExam
                ? String(publishedExam.questions.length)
                : "0"
            }
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Student Attempts"
            value={String(totalAttempts)}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Average Score"
            value={`${averageScore}%`}
            icon={<BarChart3 size={22} />}
          />
        </div>

        {/* AI GENERATOR + QUICK ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* AI EXAM GENERATOR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-5">
              <Sparkles size={25} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              AI Exam Generator
            </h3>

            <p className="text-slate-500 mt-2">
              Generate 20 multiple-choice questions using Groq AI.
            </p>

            <button
              onClick={() => setPage("generator")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Sparkles size={18} />
              Create AI Exam
            </button>
          </div>

          {/* QUICK ANALYTICS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-5">
              <BarChart3 size={25} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Exam Analytics
            </h3>

            <p className="text-slate-500 mt-2">
              Monitor student performance and examination results.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Highest Score
                </p>

                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {highestScore}%
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Pass Rate
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {passPercentage}%
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* PERFORMANCE OVERVIEW */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Performance Overview
              </h3>

              <p className="text-sm text-slate-500">
                Student performance classification
              </p>
            </div>
          </div>

          {totalAttempts === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">
                No student attempts yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* GOOD */}
              <div className="border border-green-200 bg-green-50 rounded-xl p-5">
                <p className="text-sm text-green-700 font-semibold">
                  Good Performance
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {goodCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Score ≥ 75%
                </p>
              </div>

              {/* AVERAGE */}
              <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-5">
                <p className="text-sm text-yellow-700 font-semibold">
                  Average Performance
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {averageCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Score 50% - 74%
                </p>
              </div>

              {/* BAD */}
              <div className="border border-red-200 bg-red-50 rounded-xl p-5">
                <p className="text-sm text-red-700 font-semibold">
                  Needs Improvement
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {badCount}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Score below 50%
                </p>
              </div>

            </div>
          )}
        </div>

        {/* SUBJECT ANALYTICS */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h3 className="text-xl font-bold text-slate-900">
            Subject-wise Analytics
          </h3>

          <p className="text-slate-500 mt-1 mb-6">
            Average performance for each examination subject.
          </p>

          {subjectStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">
                Subject analytics will appear after students complete exams.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {subjectStats.map((item) => (

                <div key={item.subject}>

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-semibold text-slate-800">
                      {item.subject}
                    </span>

                    <span className="font-bold text-blue-600">
                      {item.average}%
                    </span>

                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">

                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${item.average}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {item.attempts} attempt
                    {item.attempts !== 1 ? "s" : ""}
                  </p>

                </div>

              ))}

            </div>
          )}
        </div>

        {/* STUDENT RESULTS */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Student Results
              </h3>

              <p className="text-slate-500 mt-1">
                Detailed examination results.
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
              {totalAttempts} Attempts
            </div>

          </div>

          {results.length === 0 ? (

            <div className="text-center py-10">
              <Users
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="text-slate-400 mt-3">
                No student results available yet.
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {results.map((result, index) => (

                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h4 className="font-bold text-slate-900">
                        {result.examTitle}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        Student: {result.studentName}
                      </p>

                      <p className="text-sm text-slate-500">
                        Subject: {result.subject}
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Date: {result.date}
                      </p>

                    </div>

                    <div className="text-left md:text-right">

                      <p className="text-2xl font-bold text-blue-600">
                        {result.percentage}%
                      </p>

                      <p className="text-sm text-slate-500">
                        {result.score}/{result.total}
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          result.performance === "Good"
                            ? "bg-green-100 text-green-700"
                            : result.performance === "Average"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.performance}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}
        </div>

        {/* PUBLISHED EXAM */}
        {publishedExam && (

          <div className="mt-8 bg-white rounded-2xl border border-green-200 p-6 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle size={20} />
                  Published Exam
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {publishedExam.title}
                </h3>

                <p className="text-slate-500 mt-1">
                  {publishedExam.subject} •{" "}
                  {publishedExam.difficulty} •{" "}
                  {publishedExam.questions.length} Questions •{" "}
                  {publishedExam.duration} Minutes
                </p>

              </div>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

/* =========================================================
   AI EXAM GENERATOR
========================================================= */

function AIExamGenerator({
  publishedExam,
  savePublishedExam,
  onBack,
}: {
  publishedExam: PublishedExam | null;
  savePublishedExam: (exam: PublishedExam) => void;
  onBack: () => void;
}) {
  const [subject, setSubject] = useState(subjects[0]);
  const [difficulty, setDifficulty] = useState("Medium");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await fetch(
        "http://localhost:3001/api/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            difficulty,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to generate questions."
        );
      }

      let text = result.data;

      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(text);

      if (
        !parsed.questions ||
        !Array.isArray(parsed.questions)
      ) {
        throw new Error("Invalid question format received from AI.");
      }

      const validQuestions = parsed.questions
        .filter(
          (q: Question) =>
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.answer === "number"
        )
        .slice(0, 20);

      if (validQuestions.length === 0) {
        throw new Error("AI did not return valid questions.");
      }

      setQuestions(validQuestions);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate questions."
      );
    } finally {
      setLoading(false);
    }
  };

  const publishExam = () => {
    if (questions.length === 0) {
      setError("Generate questions before publishing.");
      return;
    }

    const exam: PublishedExam = {
      id: Date.now(),
      title: `AI Generated ${subject} Exam`,
      subject,
      difficulty,
      duration: 30,
      questions,
    };

    savePublishedExam(exam);

    alert("Exam published successfully!");

    onBack();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        title="VMD Online Examination"
        subtitle="AI Exam Generator"
        email="Teacher"
        onLogout={onBack}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-600 font-medium mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                AI Exam Generator
              </h2>

              <p className="text-slate-500">
                Generate and publish a 20-question examination.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subject
              </label>

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3"
              >
                {subjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={generateQuestions}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Sparkles size={18} />

              {loading
                ? "Generating..."
                : "Generate 20 Questions"}
            </button>

            {questions.length > 0 && (
              <button
                onClick={publishExam}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Publish Exam
              </button>
            )}
          </div>

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
              {error}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Review Questions
                </h3>

                <p className="text-slate-500">
                  Correct answers are visible only to the teacher.
                </p>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {questions.length} Questions
              </span>
            </div>

            <div className="space-y-5">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <h4 className="font-bold text-slate-900">
                      {index + 1}. {question.question}
                    </h4>

                    <span className="text-sm text-green-600 font-semibold whitespace-nowrap">
                      Answer:{" "}
                      {question.options[question.answer]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                    {question.options.map(
                      (option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`border rounded-lg p-3 ${
                            optionIndex === question.answer
                              ? "border-green-400 bg-green-50"
                              : "border-slate-200"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                            .
                          </span>{" "}
                          {option}

                          {optionIndex === question.answer && (
                            <span className="ml-2 text-green-600 text-sm font-semibold">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <strong>Teacher view:</strong> The correct answers
              are shown here for verification. Students will not
              see them during the examination.
            </div>
          </div>
        )}

        {publishedExam && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle size={20} />
              An exam is already published.
            </div>

            <p className="text-green-700 mt-1">
              {publishedExam.title}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

function StudentDashboard({
  email,
  publishedExam,
  results,
  selectedExam,
  setSelectedExam,
  lastResult,
  setLastResult,
  saveResult,
  onLogout,
  page,
  setPage,
}: {
  email: string;
  publishedExam: PublishedExam | null;
  results: Result[];
  selectedExam: PublishedExam | null;
  setSelectedExam: (exam: PublishedExam | null) => void;
  lastResult: Result | null;
  setLastResult: (result: Result | null) => void;
  saveResult: (result: Result) => void;
  onLogout: () => void;
  page: "dashboard" | "generator" | "exam" | "result";
  setPage: (
    value: "dashboard" | "generator" | "exam" | "result"
  ) => void;
}) {
  if (page === "exam" && selectedExam) {
    return (
     <ExamPage
  exam={selectedExam}
  studentName={email}
  onComplete={(result) => {
    saveResult(result);
    setLastResult(result);
    setPage("result");
  }}
/> 
    );
  }

  if (page === "result" && lastResult) {
    return (
      <ResultPage
        result={lastResult}
        onBack={() => setPage("dashboard")}
      />
    );
  }

  const completedCount = results.length;

  const average =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, result) => sum + result.percentage,
            0
          ) / results.length
        )
      : 0;

  const highestScore =
    results.length > 0
      ? Math.max(
          ...results.map(
            (result) => result.percentage
          )
        )
      : 0;

  const certificates = results.filter(
    (result) => result.percentage >= 40
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">

      <Header
        title="VMD Online Examination"
        subtitle="Student Portal"
        email={email}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* WELCOME */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, Student 👋
          </h2>

          <p className="text-slate-500 mt-2">
            Select an examination below to begin.
          </p>
        </div>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <StatCard
            title="Available Exams"
            value={publishedExam ? "1" : "0"}
            icon={<BookOpen size={22} />}
          />

          <StatCard
            title="Exams Completed"
            value={String(completedCount)}
            icon={<FileText size={22} />}
          />

          <StatCard
            title="Average Score"
            value={`${average}%`}
            icon={<BarChart3 size={22} />}
          />

          <StatCard
            title="Certificates"
            value={String(certificates)}
            icon={<Award size={22} />}
          />

        </div>

        {/* AVAILABLE EXAM */}

        {publishedExam ? (

          <div>

            <div className="mb-5">

              <h3 className="text-2xl font-bold text-slate-900">
                Available Examination
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Your teacher has published a new examination.
              </p>

            </div>

            <div className="max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5">
                <BookOpen size={24} />
              </div>

              <h4 className="text-xl font-bold text-slate-900">
                {publishedExam.title}
              </h4>

              <p className="text-sm text-blue-600 font-medium mt-1">
                {publishedExam.subject}
              </p>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">

                <span>
                  📝 {publishedExam.questions.length} Questions
                </span>

                <span>
                  ⏱️ {publishedExam.duration} Minutes
                </span>

                <span>
                  📊 {publishedExam.difficulty}
                </span>

              </div>

              <button
                onClick={() => {
                  setSelectedExam(publishedExam);
                  setPage("exam");
                }}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Start Exam
              </button>

            </div>

          </div>

        ) : (

          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <BookOpen
              size={45}
              className="mx-auto text-slate-300"
            />

            <h3 className="text-xl font-bold text-slate-800 mt-4">
              No Examination Available
            </h3>

            <p className="text-slate-500 mt-2">
              Your teacher has not published an examination yet.
            </p>

          </div>

        )}

        {/* RESULT HISTORY */}

        <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

              <h3 className="text-2xl font-bold text-slate-900">
                My Result History
              </h3>

              <p className="text-slate-500 mt-1">
                View your previous examination results.
              </p>

            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
              {completedCount} Exam
              {completedCount !== 1 ? "s" : ""}
            </div>

          </div>

          {results.length === 0 ? (

            <div className="text-center py-12">

              <FileText
                size={50}
                className="mx-auto text-slate-300"
              />

              <h4 className="text-lg font-semibold text-slate-700 mt-4">
                No Results Yet
              </h4>

              <p className="text-slate-400 mt-2">
                Complete an examination to see your results here.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {results.map((result, index) => (

                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <h4 className="text-lg font-bold text-slate-900">
                        {result.examTitle}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        Subject: {result.subject}
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Date: {result.date}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        Certificate ID: {result.certificateId}
                      </p>

                    </div>

                    <div className="text-left md:text-right">

                      <p className="text-3xl font-bold text-blue-600">
                        {result.percentage}%
                      </p>

                      <p className="text-sm text-slate-500">
                        {result.score}/{result.total}
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          result.performance === "Good"
                            ? "bg-green-100 text-green-700"
                            : result.performance === "Average"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result.performance}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* CERTIFICATE INFORMATION */}

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Award size={25} />
            </div>

            <div>

              <h3 className="font-bold text-lg text-slate-900">
                Certificates
              </h3>

              <p className="text-sm text-slate-500">
                Complete an examination to become eligible for a certificate.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
/* =========================================================
   EXAM PAGE
========================================================= */

function ExamPage({
  exam,
  studentName,
  onComplete,
}: {
  exam: PublishedExam;
  studentName: string;
  onComplete: (result: Result) => void;
}) 
 {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [tabSwitches, setTabSwitches] = useState(0);

  const submittedRef = useRef(false);

  // ---------------------------------------
  // RANDOMIZE QUESTIONS + OPTIONS
  // ---------------------------------------

  useEffect(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const copy = [...array];

      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
      }

      return copy;
    };

    const randomizedQuestions = shuffleArray(exam.questions).map(
      (question) => {
        const optionObjects = question.options.map(
          (option, index) => ({
            option,
            isCorrect: index === question.answer,
          })
        );

        const shuffledOptions = shuffleArray(optionObjects);

        return {
          ...question,
          options: shuffledOptions.map((item) => item.option),
          answer: shuffledOptions.findIndex(
            (item) => item.isCorrect
          ),
        };
      }
    );

    setQuestions(randomizedQuestions);
    setAnswers(new Array(randomizedQuestions.length).fill(-1));
  }, [exam]);

  // ---------------------------------------
  // TIMER
  // ---------------------------------------

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ---------------------------------------
  // TAB SWITCH DETECTION
  // ---------------------------------------

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        setTabSwitches((previous) => {
          const newCount = previous + 1;

          if (newCount >= 3) {
            setTimeout(() => {
              submitExam();
            }, 0);
          }

          return newCount;
        });
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // ---------------------------------------
  // FORMAT TIME
  // ---------------------------------------

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ---------------------------------------
  // SELECT ANSWER
  // ---------------------------------------

  const selectAnswer = (optionIndex: number) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = optionIndex;

    setAnswers(updatedAnswers);
  };

  // ---------------------------------------
  // SUBMIT EXAM
  // ---------------------------------------

  const submitExam = () => {
    if (submittedRef.current) {
      return;
    }

    if (questions.length === 0) {
      return;
    }

    submittedRef.current = true;

    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score++;
      }
    });

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    let performance = "Bad";

    if (percentage >= 75) {
      performance = "Good";
    } else if (percentage >= 50) {
      performance = "Average";
    }

    const result: Result = {
      examTitle: exam.title,
      subject: exam.subject,
      score,
      total: questions.length,
      percentage,
      performance,
      date: new Date().toLocaleDateString(),
      studentName: studentName,
      certificateId: `VMD-${Date.now()}`,
    };

    onComplete(result);
  };

  // ---------------------------------------
  // LOADING STATE
  // ---------------------------------------

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />

          <p className="text-slate-600 mt-4 font-semibold">
            Preparing your examination...
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Randomizing questions and options
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <Header
        title="VMD Online Examination"
        subtitle="Student Examination"
        email={studentName}
        onLogout={() => {}}
      />

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* EXAM HEADER */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {exam.title}
              </h2>

              <p className="text-slate-500 mt-1">
                {exam.subject} • {exam.questions.length} Questions
              </p>
            </div>

            {/* TIMER */}

            <div
              className={`px-5 py-3 rounded-xl font-bold text-lg ${
                timeLeft <= 60
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              ⏱ {formatTime(timeLeft)}
            </div>

          </div>

        </div>

        {/* TAB SWITCH WARNING */}

        {tabSwitches > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-6">

            <div className="flex items-center gap-2 font-semibold">
              ⚠️ Exam Monitoring
            </div>

            <p className="text-sm mt-1">
              Tab switching detected: {tabSwitches}/3
            </p>

            {tabSwitches >= 2 && (
              <p className="text-sm font-semibold mt-1">
                Another tab switch may automatically submit the exam.
              </p>
            )}

          </div>
        )}

        {/* QUESTION */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          {/* PROGRESS */}

          <div className="flex items-center justify-between mb-6">

            <span className="text-sm font-semibold text-slate-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-sm font-semibold text-blue-600">
              {Math.round(
                ((currentQuestion + 1) / questions.length) * 100
              )}
              %
            </span>

          </div>

          {/* PROGRESS BAR */}

          <div className="w-full bg-slate-200 rounded-full h-2 mb-8">

            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`,
              }}
            />

          </div>

          {/* QUESTION TEXT */}

          <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
            {question.question}
          </h3>

          {/* OPTIONS */}

          <div className="space-y-4 mt-8">

            {question.options.map((option, index) => {

              const selected =
                answers[currentQuestion] === index;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    selected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span className="font-medium">
                      {option}
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

          {/* NAVIGATION */}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">

            <button
              onClick={() =>
                setCurrentQuestion((previous) =>
                  Math.max(previous - 1, 0)
                )
              }
              disabled={currentQuestion === 0}
              className="px-5 py-3 rounded-lg border border-slate-300 font-semibold disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (

              <button
                onClick={submitExam}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Submit Exam
              </button>

            ) : (

              <button
                onClick={() =>
                  setCurrentQuestion((previous) =>
                    Math.min(
                      previous + 1,
                      questions.length - 1
                    )
                  )
                }
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Next →
              </button>

            )}

          </div>

        </div>

      </main>
    </div>
  );
}

/* =========================================================
   RESULT PAGE
========================================================= */
function ResultPage({
  result,
  onBack,
}: {
  result: Result;
  onBack: () => void;
}) {
  const certificateEligible = result.percentage >= 40;
const printResult = () => {
  window.print();
};
  const downloadCertificate = async () => {
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const width = 297;
    const height = 210;

    // Outer border
    pdf.setLineWidth(2);
    pdf.rect(10, 10, width - 20, height - 20);

    // Inner border
    pdf.setLineWidth(0.5);
    pdf.rect(15, 15, width - 30, height - 30);

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.text("VMD ONLINE EXAMINATION SYSTEM", width / 2, 40, {
      align: "center",
    });

    pdf.setFontSize(24);
    pdf.text("CERTIFICATE OF COMPLETION", width / 2, 58, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    pdf.text(
      "This certificate is proudly presented to",
      width / 2,
      78,
      {
        align: "center",
      }
    );

    // Student name/email
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);

    pdf.text(result.studentName || "Student", width / 2, 94, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    pdf.text(
      "for successfully completing the examination",
      width / 2,
      108,
      {
        align: "center",
      }
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);

    pdf.text(result.examTitle, width / 2, 121, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    pdf.text(
      `Score: ${result.score}/${result.total}`,
      width / 2,
      137,
      {
        align: "center",
      }
    );

    pdf.text(
      `Percentage: ${result.percentage}%`,
      width / 2,
      147,
      {
        align: "center",
      }
    );

    pdf.text(
      `Performance: ${result.performance}`,
      width / 2,
      157,
      {
        align: "center",
      }
    );

    pdf.setFontSize(11);

    pdf.text(
      `Certificate ID: ${result.certificateId}`,
      25,
      180
    );

    pdf.text(`Date: ${result.date}`, width - 25, 180, {
      align: "right",
    });

    pdf.setFont("helvetica", "italic");
    pdf.text(
      "VMD Online Examination System",
      width / 2,
      190,
      {
        align: "center",
      }
    );

    pdf.save(
      `VMD-Certificate-${result.certificateId}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header
        title="VMD Online Examination"
        subtitle="Examination Result"
        email={result.studentName || "Student"}
        onLogout={onBack}
      />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <CheckCircle
            size={65}
            className="mx-auto text-green-500"
          />

          <h2 className="text-3xl font-bold text-slate-900 mt-5">
            Examination Completed
          </h2>

          <p className="text-slate-500 mt-2">
            {result.examTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Score
              </p>

              <p className="text-3xl font-bold text-blue-600">
                {result.score}/{result.total}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Percentage
              </p>

              <p className="text-3xl font-bold text-purple-600">
                {result.percentage}%
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-5">
              <p className="text-sm text-slate-500">
                Performance
              </p>

              <p className="text-xl font-bold text-green-600 mt-2">
                {result.performance}
              </p>
            </div>
          </div>

          {certificateEligible ? (
            <div className="mt-8">
              <div className="border-4 border-yellow-400 bg-yellow-50 rounded-2xl p-8">
                <Award
                  size={55}
                  className="mx-auto text-yellow-600"
                />

                <h3 className="text-2xl font-bold text-slate-900 mt-4">
                  Certificate of Completion
                </h3>

                <p className="text-slate-600 mt-3">
                  Congratulations! You have successfully
                  completed the examination.
                </p>

                <div className="mt-5 space-y-1 text-slate-700">
                  <p>
                    <strong>Student:</strong>{" "}
                    {result.studentName}
                  </p>

                  <p>
                    <strong>Exam:</strong>{" "}
                    {result.examTitle}
                  </p>

                  <p>
                    <strong>Score:</strong>{" "}
                    {result.score}/{result.total}
                  </p>

                  <p>
                    <strong>Performance:</strong>{" "}
                    {result.performance}
                  </p>

                  <p>
                    <strong>Certificate ID:</strong>{" "}
                    {result.certificateId}
                  </p>
                </div>

                <button
                  onClick={downloadCertificate}
                  className="mt-7 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Award size={19} />
                  Download Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
              Your score does not currently meet the certificate
              eligibility requirement.
            </div>
          )}

         <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

  <button
    onClick={printResult}
    className="bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold"
  >
    🖨️ Print Result
  </button>

  <button
    onClick={onBack}
    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-lg font-semibold"
  >
    Back to Dashboard
  </button>

</div> 
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  title,
  subtitle,
  email,
  onLogout,
}: {
  title: string;
  subtitle: string;
  email: string;
  onLogout: () => void;
}) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={25} />
          </div>

          <div>
            <h1 className="font-bold text-lg text-slate-900">
              {title}
            </h1>

            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="font-semibold text-sm text-slate-800">
              {email}
            </p>
          </div>

          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-slate-600" />
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-1">
            {value}
          </p>
        </div>

        <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default App;
