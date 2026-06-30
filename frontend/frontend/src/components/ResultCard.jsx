function ResultCard({ text, icon }) {
  return (

    <div className="flex items-start gap-3 mb-3">

      <span className="text-xl">
        {icon}
      </span>

      <p>
        {text}
      </p>

    </div>

  );
}

export default ResultCard;