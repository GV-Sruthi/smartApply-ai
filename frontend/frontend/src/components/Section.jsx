function Section({ title, children }) {
  return (

    <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        {title}
      </h2>

      {children}

    </div>

  );
}

export default Section;