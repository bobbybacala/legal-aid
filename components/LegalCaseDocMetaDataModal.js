import { useEffect } from "react";
import {
  FaTimes,
  FaGavel,
  FaCalendarAlt,
  FaUser,
  FaFolder,
} from "react-icons/fa";

export default function LegalCaseDocMetaDataModal({
  isOpen,
  onClose,
  metaData,
  onMetadataChange,
  onSubmit,
}) {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Prevent clicking inside modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-blue-50">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaGavel className="mr-2 text-blue-600" />
            Legal Case Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-4">
          <p className="text-gray-600 mb-4">
            Please provide details about this legal case document to help with
            organization and retrieval.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaFolder className="mr-2 text-blue-500" />
                Case Title
              </label>
              <input
                type="text"
                name="caseTitle"
                value={metaData.caseTitle}
                onChange={onMetadataChange}
                className="input"
                placeholder="e.g., Smith v. Johnson"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Judge
              </label>
              <input
                type="text"
                name="judge"
                value={metaData.judge}
                onChange={onMetadataChange}
                className="input"
                placeholder="e.g., Hon. Robert Williams"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={metaData.date}
                onChange={onMetadataChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Type
              </label>
              <select
                name="caseType"
                value={metaData.caseType}
                onChange={onMetadataChange}
                className="input"
                required
              >
                <option value="">Select a case type</option>
                <option value="civil">Civil</option>
                <option value="criminal">Criminal</option>
                <option value="family">Family</option>
                <option value="corporate">Corporate</option>
                <option value="intellectual_property">
                  Intellectual Property
                </option>
                <option value="tax">Tax</option>
                <option value="other">Other</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="btn btn-outline mr-2">
            Cancel
          </button>
          <button onClick={onSubmit} className="btn btn-primary">
            Continue Upload
          </button>
        </div>
      </div>
    </div>
  );
}
