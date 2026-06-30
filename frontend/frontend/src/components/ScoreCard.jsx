export default function ScoreCard({
    title,
    score,
}){

    return(

        <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-xl font-bold">

                {title}

            </h2>

            <p className="text-6xl font-bold text-blue-600 mt-5">

                {score}%

            </p>

        </div>

    )

}