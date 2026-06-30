export default function ReviewTab({ analysis }){

    return(

        <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-bold mb-5">

                Resume Review

            </h2>

            <p className="leading-8">

                {analysis.recommendation}

            </p>

        </div>

    )

}