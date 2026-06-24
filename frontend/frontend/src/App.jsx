import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { TailSpin } from "react-loader-spinner";


function App() {
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleAnalyze = async () => {
    setLoading(true);
    if (!resume) {
      console.error("Please select a resume file");
      return;
    }

    if (!jd || !jd.trim()) {
      console.error("Please paste a Job Description");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jd);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      console.log("FULL DATA:", data);
      console.log("ANALYSIS:", data.analysis);
      console.log("TYPE:", typeof data.analysis);

      setAnalysis(data.analysis);
    } 
    catch (err) {
      console.error("Analyze error:", err);
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-10">

      <div className="max-w-7xl mx-auto">


        <h1 className="text-5xl font-bold text-center mb-1">
          SmartApply AI 🚀
        </h1>

        <p className="text-center text-gray-600 text-lg mb-4">
          Upload your resume and compare it against any Job Description
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Resume Upload */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Upload Resume
            </h2>

            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-3xl h-80 flex flex-col justify-center items-center transition-all cursor-pointer">

              <div className="text-7xl mb-4">
                ☁️
              </div>

              <p className="font-semibold text-lg">
                Drag & Drop Resume
              </p>

              <p className="text-gray-500 mt-2">
                PDF, DOCX supported
              </p>
            </div>
            <div>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                   setResume(e.target.files[0]);
                }}
              />
              <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
        onClick={() => fileInputRef.current.click()}>
                Browse Files
              </button>
              {resume && (
                <p className="mt-4 text-green-600 font-medium">
                  ✅ {resume.name}
                </p>
              )}

            </div>

          </div>

          {/* JD Section */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Job Description
            </h2>

            <textarea
              className="w-full h-80 border border-gray-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste Job Description Here..."  value={jd}
              onChange={(e) => setJd(e.target.value)}
            />

          </div>

        </div>

        <div className="flex justify-center mt-10">

          <button onClick={handleAnalyze} className="bg-black hover:scale-105 transition text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg">
            Analyze Resume
          </button>

        </div>

        {loading && (
          <div className="flex justify-center items-center gap-3 mt-4">
            <TailSpin
              height={30}
              width={30}
            />
            <span className="font-medium text-blue-600">
              Analyzing Resume...
            </span>
          </div>
        )}

        {analysis && (
          <div className="mt-10">

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold">
                  ATS Score
                </h3>

                <p className="text-5xl mt-4">
                  {analysis.ats_score}%
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold">
                  Match Score
                </h3>

                <p className="text-5xl mt-4">
                  {analysis.match_score}%
                </p>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div className="bg-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">
                  Missing Skills
                </h3>

                <ul>
                  {analysis.missing_skills.map((skill, index) => (
                    <li key={index}>
                      ❌ {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">
                  Matching Skills
                </h3>

                <ul>
                  {analysis.matching_skills.map((skill, index) => (
                    <li key={index}>
                      ✅ {skill}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl mt-6">

              <h3 className="text-xl font-bold mb-4">
                Recommendation
              </h3>

              <p>
                {analysis.recommendation}
              </p>

            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl mt-6">

              <h3 className="text-xl font-bold mb-4">
                
              </h3>

              <div className="prose max-w-none">
                <ReactMarkdown>
                  {analysis.resume_roast}
                </ReactMarkdown>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default App;