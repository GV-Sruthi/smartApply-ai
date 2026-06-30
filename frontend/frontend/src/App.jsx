import { useState, useRef } from "react";
import UploadCard from "./components/UploadCard";
import JDCard from "./components/JDCard";
import Loading from "./components/Loading";
import ScoreCard from "./components/ScoreCard";
import SkillList from "./components/SkillList";
import ResultCard from "./components/ResultCard";
import AnalyzeButton from "./components/AnalyzeButton";
import Tabs from "./components/Tabs";
import SkillsTab from "./components/SkillsTab";
import ReviewTab from "./components/ReviewTab";
import RoastTab from "./components/RoastTab";

function App() {
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("skills");


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

          <UploadCard
            resume={resume}
            setResume={setResume}
            fileInputRef={fileInputRef}
          />

          {/* JD Section */}

          <JDCard
            jd={jd}
            setJd={setJd}
          />

        </div>

        {!loading && (
            <AnalyzeButton
                onClick={handleAnalyze}
                loading={loading}
            />
        )}

        {loading && <Loading />}

        {analysis && (

        <div className="mt-10">
          <div className="grid md:grid-cols-2 gap-6">

            <ScoreCard
                title="ATS Score"
                score={analysis.ats_score}
            />

            <ScoreCard
                title="Match Score"
                score={analysis.match_score}
            />

          </div>

          <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
          />

          {activeTab==="skills" && (
              <SkillsTab analysis={analysis}/>
          )}

          {activeTab==="review" && (
              <ReviewTab analysis={analysis}/>
          )}

          {activeTab==="roast" && (
              <RoastTab analysis={analysis}/>
          )}

        </div>

    )}

      </div>

    </div>
  );
}

export default App;