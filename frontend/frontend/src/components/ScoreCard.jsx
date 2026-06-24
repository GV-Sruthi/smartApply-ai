function ScoreCard() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8">

      <div className="bg-white shadow rounded-xl p-6">
        <h2>Match Score</h2>

        <p className="text-4xl font-bold">
          82%
        </p>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2>ATS Score</h2>

        <p className="text-4xl font-bold">
          75%
        </p>
      </div>

    </div>
  );
}