function SkillList({ title, skills, type }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl">
      <h3 className="text-xl font-bold mb-4">
        {title}
      </h3>

      <ul className="space-y-2">
        {skills.map((skill, index) => (
          <li key={index}>
            {type === "good" ? "✅" : "❌"} {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SkillList;