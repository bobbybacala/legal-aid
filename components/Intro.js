import { FaScaleBalanced, FaLightbulb } from "react-icons/fa6";

export default function Intro() {
  return (
    <div className="card p-6 mb-6 bg-gradient-to-r from-white to-blue-50">
      <div className="flex items-center mb-3">
        <FaScaleBalanced className="text-blue-600 mr-2 text-xl" />
        <h2 className="text-xl font-semibold animated-gradient-text">
          Legal Aid Assistant
        </h2>
      </div>

      <p className="text-gray-700 mb-4">
        Your AI-powered legal assistant that analyzes contracts and legal cases
        to provide insightful guidance, just as if you were consulting with a
        legal professional.
      </p>

      <div className="flex items-start text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <FaLightbulb className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
        <p>
          Upload your legal documents below and start asking questions about
          terms, implications, compliance requirements, or potential issues.
        </p>
      </div>
    </div>
  );
}
