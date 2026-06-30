export default function SkillsTab({ analysis }) {

    return(

        <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white rounded-3xl shadow p-6">

                <h2 className="text-xl font-bold mb-4">
                    ✅ Matching Skills
                </h2>

                <ul className="space-y-2">

                    {(analysis.matching_skills || []).map((skill,index)=>(

                        <li key={index}>

                            {skill}

                        </li>

                    ))}

                </ul>

            </div>

            <div className="bg-white rounded-3xl shadow p-6">

                <h2 className="text-xl font-bold mb-4">
                    ❌ Missing Skills
                </h2>

                <ul className="space-y-2">

                    {(analysis.missing_skills || []).map((skill,index)=>(

                        <li key={index}>

                            {skill}

                        </li>

                    ))}

                </ul>

            </div>

        </div>

    )

}