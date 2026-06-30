import ReactMarkdown from "react-markdown";

export default function RoastTab({ analysis }){

    return(

        <div className="bg-white rounded-3xl shadow p-8">

            <ReactMarkdown>

                {analysis.resume_roast}

            </ReactMarkdown>

        </div>

    )

}