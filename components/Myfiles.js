import { useEffect, useState } from "react";
import { FaFilter, FaFileAlt, FaGavel, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

export default function MyFiles({ setActiveFile, files = [], fileType }) {
  const [filterKey, setFilterKey] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]); // Initialize with an empty array
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setFilteredFiles(files.filter((file) => file.fileType === fileType)); // Filter files based on fileType
  }, [fileType, files]);

  // handle filter change
  const handleFilterKeyChange = (e) => {
    setFilterKey(e.target.value);
    setFilterValue(""); // Reset filter value when filter key changes
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  // calling the api to get the filtered files
  const applyFilter = async () => {
    if (!filterKey || !filterValue) {
      setFilteredFiles(files.filter((file) => file.fileType === fileType)); // Reset to all files if no filter is applied
      return;
    }

    try {
      const response = await fetch(
        `/api/filtered-files?fileType=${fileType}&filterKey=${filterKey}&filterValue=${filterValue}`
      );
      const data = await response.json();

      setFilteredFiles(data.files); // Update the filtered files state
    } catch (error) {
      console.log("Error fetching filtered files:", error);
    }
  };

  const getFileIcon = () => {
    return fileType === "contract" ? <FaFileAlt /> : <FaGavel />;
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">My Documents</h3>

        {fileType === "legal_case" && (
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="btn-outline text-sm py-1 px-2 flex items-center"
          >
            <FaFilter className="mr-1" />
            <span>Filter</span>
          </button>
        )}
      </div>

      {/* Render filtering options for legal cases */}
      {fileType === "legal_case" && isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
        >
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Filter By:
          </label>
          <select
            value={filterKey || "none"}
            onChange={handleFilterKeyChange}
            className="input mb-3"
          >
            <option value="none">Select Filter Type</option>
            <option value="caseTitle">Case Title</option>
            <option value="judge">Judge</option>
            <option value="date">Date</option>
            <option value="caseType">Case Type</option>
          </select>

          {filterKey && filterKey !== "none" && (
            <div className="space-y-3">
              {filterKey === "date" ? (
                <input
                  type="date"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  className="input"
                />
              ) : (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={`    Search by ${filterKey}...`}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    className="input pl-10"
                  />
                </div>
              )}
              <button onClick={applyFilter} className="btn btn-primary w-full">
                Apply Filter
              </button>
            </div>
          )}
        </motion.div>
      )}

      <div className="overflow-y-auto max-h-[350px] subtle-scroll">
        {filteredFiles.length > 0 ? (
          <div className="space-y-2 pb-2">
            {filteredFiles.map((file, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={index}
                onClick={() => setActiveFile(file)}
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all"
              >
                <div
                  className={`mr-3 text-${
                    fileType === "contract" ? "blue" : "orange"
                  }-500`}
                >
                  {getFileIcon()}
                </div>
                <div className="overflow-hidden">
                  <div className="font-medium text-gray-800 truncate">
                    {file.fileName}
                  </div>
                  {file.uploaded && (
                    <div className="text-xs text-gray-500">
                      {new Date(file.uploaded).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <div className="text-5xl mb-2 flex justify-center">
              {getFileIcon()}
            </div>
            <p className="text-sm">
              No {fileType === "contract" ? "contracts" : "legal cases"}{" "}
              available.
            </p>
            <p className="text-xs mt-1">Upload a document to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
