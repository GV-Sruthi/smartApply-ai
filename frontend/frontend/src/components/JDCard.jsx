export default function JDCard({ jd, setJd }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-2xl font-semibold mb-6">
        Job Description
      </h2>

      <textarea
        className="w-full h-80 border border-gray-300 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste Job Description Here..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

    </div>
  );
}