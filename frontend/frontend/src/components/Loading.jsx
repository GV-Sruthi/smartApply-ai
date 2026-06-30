import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function Loading(){

const steps=[
"Reading Resume...",
"Comparing Skills...",
"Calculating ATS...",
"Finding Missing Skills...",
"Generating AI Review...",
"Generating Resume Roast..."
];

const[index,setIndex]=useState(0);

useEffect(()=>{

const interval=setInterval(()=>{

setIndex(prev=>

prev===steps.length-1
?0
:prev+1

);

},1700);

return()=>clearInterval(interval);

},[]);

return(

<div className="flex flex-col items-center mt-10">

<TailSpin
height={45}
width={45}
/>

<p className="mt-6 text-xl font-semibold">

🤖 AI is thinking...

</p>

<p className="text-gray-500 mt-3 animate-pulse">

{steps[index]}

</p>

</div>

);

}