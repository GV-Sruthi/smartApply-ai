function RoastCard() {
  if (!analysis) return null;
  return (
    <div className="bg-yellow-100 p-6 rounded-xl mt-6">

      <h2 className="font-bold text-xl">
        Resume Roast 🔥
      </h2>

      <p className="mt-3">
        Your resume lists React,
        but there is no strong React project
        proving your expertise.
      </p>

    </div>
  );
}