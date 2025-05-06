import { useState } from "react";
import toast from "react-hot-toast";
import { FaCog, FaSpinner } from "react-icons/fa";

export default function FileNotProcessedAlert({ id }) {
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("File processing has started. This may take a minute.");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to process file");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("An error occurred while processing the file");
      setProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
        {processing ? (
          <FaSpinner className="animate-spin" size={24} />
        ) : (
          <FaCog size={24} />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Document Needs Processing
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        This document needs to be processed before you can ask questions about
        it. Processing may take a minute or two.
      </p>
      <button
        onClick={handleProcess}
        disabled={processing}
        className={`btn ${
          processing ? "bg-gray-400 cursor-not-allowed" : "btn-primary"
        } flex items-center`}
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Process Document"
        )}
      </button>
    </div>
  );
}
