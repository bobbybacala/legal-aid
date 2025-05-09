import { useState } from "react";
import toast from "react-hot-toast";
import LegalCaseDocMetaDataModal from "./LegalCaseDocMetaDataModal";
import {
	FaFileUpload,
	FaSpinner,
	FaFileContract,
	FaGavel,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function FileUpload({ onFileTypeChange }) {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [fileType, setFileType] = useState("contract"); // Default to 'contract'
	const [isModalOpen, setIsModalOpen] = useState(false); // state to control the modal for legal case metadata visibility
	const [legalCaseMetadata, setLegalCaseMetadata] = useState({
		caseTitle: "",
		judge: "",
		date: "",
		caseType: "",
	});

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			let selectedFile = e.target.files[0];
			console.log("Selected file:", {
				name: selectedFile.name,
				type: selectedFile.type,
				size: selectedFile.size,
			});

			if (selectedFile.type !== "application/pdf") {
				toast.error("Only PDF files are allowed");
				e.target.value = null;
				return;
			}
			setFile(selectedFile);
			toast.success("File selected successfully");
		}
	};

	const handleFileTypeChange = (e) => {
		setFileType(e.target.value);
		onFileTypeChange(e.target.value); // Notify parent component of file type change
	};

	const handleMetadataChange = (e) => {
		const { name, value } = e.target;
		setLegalCaseMetadata((prev) => ({ ...prev, [name]: value }));
	};

	const handleUploadClick = async () => {
		if (!file) {
			toast.error("Please select a file to upload");
			return;
		}

		// if the fileType is legal_case, open the metadata modal
		if (fileType === "legal_case") {
			setIsModalOpen(true);
		} else {
			uploadFile();
		}
	};

	// function to handle metadata submission from the modal
	const handleMetadataSubmit = async () => {
		// close the modal and upload the file
		setIsModalOpen(false);
		await uploadFile();
	};

	// function to actually upload the file
	const uploadFile = async () => {
		if (fileType === "legal_case") {
			// check if all legal case metadata is filled
			const { caseTitle, judge, date, caseType } = legalCaseMetadata;
			if (!caseTitle || !judge || !date || !caseType) {
				toast.error("Please fill all legal case metadata fields");
				return;
			}
		}

		setUploading(true);
		const formData = new FormData();

		// Log the file object before appending
		console.log("File object before upload:", {
			name: file.name,
			type: file.type,
			size: file.size,
		});

		// Append the file with 'file' as the field name to match backend expectation
		formData.append("file", file);
		formData.append("fileType", fileType);

		// if the fileType is legal_case, append the metadata
		if (fileType === "legal_case") {
			Object.entries(legalCaseMetadata).forEach(([key, value]) => {
				formData.append(key, value);
			});
		}

		try {
			// Log the FormData (note: FormData cannot be directly logged)
			for (let pair of formData.entries()) {
				console.log("FormData entry:", pair[0], pair[1]);
			}

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			// Log the raw response
			console.log("Raw response:", response);

			// Try to get the response content
			const result = await response.json();
			console.log("Response data:", result);

			if (!response.ok) {
				throw new Error(result.error || "Upload failed");
			}

			toast.success(result.message || "File uploaded successfully");

			// Reset the form
			setFile(null);
			setLegalCaseMetadata({
				caseTitle: "",
				judge: "",
				date: "",
				caseType: "",
			});
			const fileInput = document.getElementById("formFile");
			if (fileInput) fileInput.value = "";
		} catch (error) {
			console.error("Upload error details:", error);
			toast.error(error.message || "An error occurred during file upload.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="card p-6 mb-6">
			<h3 className="text-lg font-semibold mb-4">Upload Document</h3>

			{/* File Type Selection */}
			<div className="grid grid-cols-2 gap-3 mb-4">
				<label
					className={`flex items-center justify-center p-3 rounded-lg border ${fileType === "contract"
							? "bg-blue-50 border-blue-300 text-blue-800"
							: "bg-white border-gray-200 text-gray-600"
						} cursor-pointer transition-all`}
				>
					<input
						type="radio"
						name="fileType"
						value="contract"
						checked={fileType === "contract"}
						onChange={handleFileTypeChange}
						className="sr-only"
					/>
					<FaFileContract className="mr-2" />
					<span>Contract Documents</span>
				</label>

				<label
					className={`flex items-center justify-center p-3 rounded-lg border ${fileType === "legal_case"
							? "bg-orange-50 border-orange-300 text-orange-800"
							: "bg-white border-gray-200 text-gray-600"
						} cursor-pointer transition-all`}
				>
					<input
						type="radio"
						name="fileType"
						value="legal_case"
						checked={fileType === "legal_case"}
						onChange={handleFileTypeChange}
						className="sr-only"
					/>
					<FaGavel className="mr-2" />
					<span>Legal Cases</span>
				</label>
			</div>

			<div className="mb-4">
				<label
					htmlFor="formFile"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Select a PDF Document to Upload
				</label>

				<div className="relative">
					<input
						className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						type="file"
						id="formFile"
						onChange={handleFileChange}
						accept=".pdf,application/pdf"
					/>
				</div>
			</div>

			{file && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 flex items-center"
				>
					<FaFileUpload className="text-blue-600 mr-2" />
					<div>
						<div className="font-medium">{file.name}</div>
						<div className="text-gray-500">
							{(file.size / 1024 / 1024).toFixed(2)} MB
						</div>
					</div>
				</motion.div>
			)}

			<div className="flex justify-end">
				<button
					type="button"
					onClick={handleUploadClick}
					disabled={uploading || !file}
					className={`
                        btn flex items-center
                        ${uploading
							? "bg-gray-400 cursor-not-allowed"
							: !file
								? "btn-outline cursor-not-allowed opacity-70"
								: "btn-primary"
						}
                    `}
				>
					{uploading ? (
						<>
							<FaSpinner className="animate-spin mr-2" />
							Processing...
						</>
					) : (
						<>
							<FaFileUpload className="mr-2" />
							Upload Document
						</>
					)}
				</button>
			</div>

			{/* render the meta data modal if it's open */}
			<LegalCaseDocMetaDataModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
				}}
				metaData={legalCaseMetadata}
				onMetadataChange={handleMetadataChange}
				onSubmit={handleMetadataSubmit}
			/>
		</div>
	);
}
