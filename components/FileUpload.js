import { useState } from 'react';
import toast from "react-hot-toast";

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let selectedFile = e.target.files[0];
            console.log('Selected file:', {
                name: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size
            });

            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed');
                e.target.value = null;
                return;
            }
            setFile(selectedFile);
            toast.success('File selected successfully');
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        
        // Log the file object before appending
        console.log('File object before upload:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Append the file with 'file' as the field name to match backend expectation
        formData.append('file', file);

        try {
            // Log the FormData (note: FormData cannot be directly logged)
            for (let pair of formData.entries()) {
                console.log('FormData entry:', pair[0], pair[1]);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            // Log the raw response
            console.log('Raw response:', response);

            // Try to get the response content
            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }

            toast.success(result.message || 'File uploaded successfully');
            
            // Reset the form
            setFile(null);
            const fileInput = document.getElementById('formFile');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Upload error details:', error);
            toast.error(error.message || "An error occurred during file upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-3 p-4 bg-white rounded-lg shadow">
            <div className="space-y-4">
                <label
                    htmlFor="formFile"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-600"
                >
                    Upload a PDF File
                </label>
                
                <div className="relative">
                    <input
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-200 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-500 dark:file:bg-neutral-700 dark:file:text-neutral-400 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                        accept=".pdf,application/pdf"
                    />
                </div>

                {file && (
                    <div className="text-sm text-neutral-600">
                        Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={uploading || !file}
                        className={`
                            inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                            ${uploading || !file 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
                            }
                        `}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            'Upload PDF'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}