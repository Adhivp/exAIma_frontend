import { useState } from "react";

export default function ProctoringPage() {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/exAIma_logo.png" alt="exAIma Logo" className="h-8 " />
          <h2 className="text-2xl text-green-600">exAIma</h2>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="max-w-5xl flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-5xl font-bold text-gray-900">
              <span className="text-green-600">AI Powered</span> Proctor <br />
              Exams, Anywhere Anytime
            </h2>
            <p className="text-gray-600 mt-4">
              exAIma Provides Secure, AI Powered proctoring to
              safeguard exam integrity
            </p>
            <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg">
              Sign-in
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg">
              Sign-up
            </button>
          </div>
        </div>
          
          {/* Image Section */}
          <div className="flex-1 mt-8 md:mt-0 md:ml-8">
            <img
              src="/exam_home.png"
              alt="Proctoring Illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
