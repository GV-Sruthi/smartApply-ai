export default function Tabs({ activeTab, setActiveTab }) {

    const tabs = [
        "skills",
        "review",
        "roast"
    ];

    return (

        <div className="flex justify-center mt-10 mb-8">

            <div className="flex gap-3 bg-gray-100 p-2 rounded-2xl">

                {tabs.map((tab)=>(

                    <button

                        key={tab}

                        onClick={()=>setActiveTab(tab)}

                        className={`

                        px-8
                        py-3
                        rounded-xl
                        capitalize
                        font-semibold
                        transition-all
                        duration-300

                        ${
                            activeTab===tab

                            ?

                            "bg-black text-white shadow-lg"

                            :

                            "text-gray-700 hover:bg-white"

                        }

                        `}

                    >

                        {tab}

                    </button>

                ))}

            </div>

        </div>

    );

}