export default function UploadCard({
  resume,
  setResume,
  fileInputRef,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-2xl font-semibold mb-6">
        Upload Resume
      </h2>

      <div 
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) setResume(file);
        }}
        className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-3xl h-80 flex flex-col justify-center items-center cursor-pointer transition"
      >
 

        <div className="text-7xl mb-4">
          📄
        </div>

        <p className="font-semibold text-lg">
          Upload your Resume
        </p>

        <p className="text-gray-500">
          PDF or DOCX
        </p>

      </div>

      <input
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        ref={fileInputRef}
        onChange={(e)=>setResume(e.target.files[0])}
      />

      <button
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
        onClick={()=>fileInputRef.current.click()}
      >
        Browse Files
      </button>

      {resume && (

        <p className="mt-4 text-green-600 font-medium">
          ✅ {resume.name}
        </p>

      )}

    </div>
  );
}