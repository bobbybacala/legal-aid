import { useState } from "react";
import toast from "react-hot-toast";
import { X, Printer } from "lucide-react";

const ComplianceButton = ({ func, disabled }) => (
	<button
		onClick={func}
		className="ml-2 bg-green-500 hover:bg-green-600 text-xs text-white font-bold py-1 px-2 rounded-full disabled:bg-green-300 disabled:cursor-not-allowed"
	>
		{disabled ? "Checking Compliance..." : "Check Compliance"}
	</button>
);

const ComplianceResultCard = ({ result }) => {
	const getBgColor = (analysis) => {
		if (analysis.toLowerCase().includes('compliant')) return 'bg-green-50';
		if (analysis.toLowerCase().includes('risky')) return 'bg-yellow-50';
		if (analysis.toLowerCase().includes('non compliant')) return 'bg-red-50';
		return 'bg-gray-50';
	};

	return (
		<div className={`mb-4 p-4 rounded-lg border ${getBgColor(result.analysis)}`}>
			<div className="font-semibold mb-2">Clause {result.clauseNumber}</div>
			<div className="text-sm mb-2">{result.text}</div>
			<div className="text-sm font-medium">Analysis: {result.analysis}</div>
		</div>
	);
};

const ComplianceResults = ({ results, onClose }) => {
	const handlePrint = () => {
		// Create a new window for printing
		const printWindow = window.open('', '_blank');

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
                ${results.map(result => {
			const getClassName = (analysis) => {
				if (analysis.toLowerCase().includes('compliant')) return 'compliant';
				if (analysis.toLowerCase().includes('risky')) return 'risky';
				if (analysis.toLowerCase().includes('non compliant')) return 'non-compliant';
				return '';
			};

			return `
                        <div class="clause ${getClassName(result.analysis)}">
                            <div class="clause-number">Clause ${result.clauseNumber}</div>
                            <div class="clause-text">${result.text}</div>
                            <div class="analysis">Analysis: ${result.analysis}</div>
                        </div>
                    `;
		}).join('')}
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
					<p className="text-sm text-gray-500">Analysis completed {new Date().toLocaleString()}</p>
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

export default function ReadyAlert({ fileId }) {
	const [checking, setChecking] = useState(false);
	const [results, setResults] = useState(null);

	const checkCompliance = async () => {
		setChecking(true);
		try {
			const response = await fetch("/api/checkCompliance", {
				method: 'POST',
				body: JSON.stringify({ id: fileId }),
				headers: {
					'Content-type': 'application/json'
				}
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

	const handleClose = () => {
		setResults(null);
	};

	if (results) {
		return <ComplianceResults results={results} onClose={handleClose} />;
	}

	return (
		<div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
			<p className="font-bold">Start Chatting</p>
			<p className="text-sm">
				Your file is ready, start the conversation!
				<ComplianceButton func={checkCompliance} disabled={checking} />
			</p>
		</div>
	);
}