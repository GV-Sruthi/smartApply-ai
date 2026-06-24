function SkillsSection() {

  const missingSkills = [
    "Docker",
    "AWS",
    "Kubernetes"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">

      <h2 className="text-xl font-bold mb-4">
        Missing Skills
      </h2>

      <div className="flex gap-2 flex-wrap">

        {missingSkills.map(skill => (
          <span
            key={skill}
            className="bg-red-100 px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}

      </div>

    </div>
  );
}