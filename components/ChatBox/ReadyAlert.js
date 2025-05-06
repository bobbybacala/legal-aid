import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Printer } from "lucide-react";
import { FaCheckCircle, FaLightbulb } from "react-icons/fa";

// component for the compliance button
const ComplianceButton = ({ func, disabled }) => (
  <button
    onClick={func}
    className="ml-2 bg-green-500 hover:bg-green-600 text-xs text-white font-bold py-1 px-2 rounded-full disabled:bg-green-300 disabled:cursor-not-allowed"
  >
    {disabled ? "Checking Compliance..." : "Check Compliance"}
  </button>
);

// component for the summarise button
const SummariseButton = ({ func, disabled }) => (
  <button
    onClick={func}
    className="ml-2 bg-blue-500 hover:bg-blue-600 text-xs text-white font-bold py-1 px-2 rounded-full disabled:bg-blue-300 disabled:cursor-not-allowed"
  >
    {disabled ? "Summarising..." : "Summarise Case"}
  </button>
);

// compoenent for summary report
const SummaryReport = ({ summary, onClose }) => {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Generate the HTML content for printing
    const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Summary Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { margin-bottom: 20px; }
                    .summary { 
                        margin-bottom: 20px; 
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Summary Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
                <div class="summary">
                    <p>${summary}</p>
                </div>
            </body>
            </html>
        `;

    // Write content to the new window and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Print after images and resources are loaded
    printWindow.onload = function () {
      printWindow.print();
    };
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Summary Report</h2>
          <p className="text-sm text-gray-500">
            Generated on {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Print Report"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Close Report"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto max-h-[60vh]">
        <p>{summary}</p>
      </div>
    </div>
  );
};

const ComplianceResultCard = ({ result }) => {
  const getBgColor = (analysis) => {
    if (analysis.toLowerCase().includes("compliant")) return "bg-green-50";
    if (analysis.toLowerCase().includes("risky")) return "bg-yellow-50";
    if (analysis.toLowerCase().includes("noncompliant")) return "bg-red-50";
    return "bg-gray-50";
  };

  return (
    <div
      className={`mb-4 p-4 rounded-lg border ${getBgColor(result.analysis)}`}
    >
      <div className="font-semibold mb-2">Clause {result.clauseNumber}</div>
      <div className="text-sm mb-2">{result.text}</div>
      <div className="text-sm font-medium">Analysis: {result.analysis}</div>
    </div>
  );
};

const ComplianceResults = ({ results, onClose }) => {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Generate the HTML content for printing
    const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Compliance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { margin-bottom: 20px; }
                    .clause { 
                        margin-bottom: 20px; 
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    .compliant { background-color: #f0fdf4; }
                    .risky { background-color: #fefce8; }
                    .non-compliant { background-color: #fef2f2; }
                    .clause-number { font-weight: bold; margin-bottom: 10px; }
                    .clause-text { margin-bottom: 10px; }
                    .analysis { font-weight: 500; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Compliance Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
                ${results
                  .map((result) => {
                    const getClassName = (analysis) => {
                      if (analysis.toLowerCase().includes("compliant"))
                        return "compliant";
                      if (analysis.toLowerCase().includes("risky"))
                        return "risky";
                      if (analysis.toLowerCase().includes("non compliant"))
                        return "non-compliant";
                      return "";
                    };

                    return `
                        <div class="clause ${getClassName(result.analysis)}">
                            <div class="clause-number">Clause ${
                              result.clauseNumber
                            }</div>
                            <div class="clause-text">${result.text}</div>
                            <div class="analysis">Analysis: ${
                              result.analysis
                            }</div>
                        </div>
                    `;
                  })
                  .join("")}
            </body>
            </html>
        `;

    // Write content to the new window and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Print after images and resources are loaded
    printWindow.onload = function () {
      printWindow.print();
    };
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Compliance Results</h2>
          <p className="text-sm text-gray-500">
            Analysis completed {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Print Report"
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Close Results"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {results.map((result, index) => (
          <ComplianceResultCard key={index} result={result} />
        ))}
      </div>
    </div>
  );
};

export default function ReadyAlert({ fileId, fileType }) {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  useEffect(() => {
    // Set different suggested questions based on fileType
    if (fileType === "contract") {
      setSuggestedQuestions([
        "What are the main terms of this contract?",
        "Is there any problematic clause in this contract?",
        "What are my obligations under this contract?",
        "How can I terminate this contract?",
      ]);
    } else if (fileType === "legal_case") {
      setSuggestedQuestions([
        "What was the final judgment in this case?",
        "What precedent does this case establish?",
        "What were the key issues in this case?",
        "What were the main arguments presented?",
      ]);
    }
  }, [fileType]);

  // function which calls the check compliance API and sets the results state
  const checkCompliance = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/checkCompliance", {
        method: "POST",
        body: JSON.stringify({ id: fileId }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while checking compliance");
    } finally {
      setChecking(false);
    }
  };

  // function which calls the summarise case API and sets the summary state
  const summariseCase = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/summarise-case", {
        method: "POST",
        body: JSON.stringify({ id: fileId }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        toast.success("Summary generated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while summarising the case");
    } finally {
      setChecking(false);
    }
  };

  // set the summary & result state to null when the close button is clicked
  const handleClose = () => {
    setResults(null);
    setSummary(null);
  };

  if (results) {
    return <ComplianceResults results={results} onClose={handleClose} />;
  }

  if (summary) {
    return <SummaryReport summary={summary} onClose={handleClose} />;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
          <FaCheckCircle size={28} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Document Ready for Analysis
        </h3>
        <p className="text-gray-600 max-w-md mb-6 text-center">
          Your document has been processed. You can now ask questions about it.
        </p>

        <div className="w-full max-w-md mb-4">
          {fileType === "contract" && (
            <button
              onClick={checkCompliance}
              disabled={checking}
              className="btn btn-primary w-full mb-4"
            >
              {checking ? "Checking Compliance..." : "Check Compliance"}
            </button>
          )}

          {fileType === "legal_case" && (
            <button
              onClick={summariseCase}
              disabled={checking}
              className="btn btn-primary w-full mb-4"
            >
              {checking ? "Generating Summary..." : "Summarize Case"}
            </button>
          )}
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center mb-3">
            <FaLightbulb className="text-amber-500 mr-2" />
            <h4 className="font-medium">Suggested Questions</h4>
          </div>
          <div className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => {
                  const input = document.querySelector('input[name="query"]');
                  if (input) {
                    input.value = question;
                    input.focus();
                  }
                }}
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
