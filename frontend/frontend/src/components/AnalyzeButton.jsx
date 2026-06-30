export default function AnalyzeButton({ onClick, loading }) {
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-300
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:scale-105 hover:bg-gray-900"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Resume 🚀"}
      </button>
    </div>
  );
}