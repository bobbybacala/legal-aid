import { FaFileAlt, FaArrowLeft } from "react-icons/fa";

export default function ChooseFileAlert() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
        <FaFileAlt size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Document Selected
      </h3>
      <p className="text-gray-600 max-w-md mb-4">
        Please select a document from your uploaded files to start a
        conversation with the legal assistant.
      </p>
      <div className="flex items-center text-blue-600 text-sm">
        <FaArrowLeft className="mr-2" />
        <span>Select a document from the list on the left</span>
      </div>
    </div>
  );
}
