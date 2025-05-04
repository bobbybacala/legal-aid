import { useEffect, useState } from "react";

export default function MyFiles({ setActiveFile, files = [], fileType }) {

    const [filterKey, setFilterKey] = useState(null);
    const [filterValue, setFilterValue] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([])  // Initialize with an empty array

    useEffect(() => {
        setFilteredFiles(files.filter(file => file.fileType === fileType)); // Filter files based on fileType
    }, [fileType, files])


    // we can filter out the files based on the fileType
    // const filteredFiles = files.filter(file => file.fileType === fileType);

    // handle filter change
    const handleFilterKeyChange = (e) => {
        setFilterKey(e.target.value);
        setFilterValue(''); // Reset filter value when filter key changes
    }

    const handleFilterValueChange = (e) => {
        setFilterValue(e.target.value);
    };

    // now we can filter the files based on the filterKey and filterValue
    // calling the api to get the filtered files
    const applyFilter = async () => {
        if (!filterKey || !filterValue) {
            setFilteredFiles(files); // Reset to all files if no filter is applied
            return;
        }

        try {
            const response = await fetch(`/api/filtered-files?fileType=${fileType}&filterKey=${filterKey}&filterValue=${filterValue}`);
            const data = await response.json();

            setFilteredFiles(data.files); // Update the filtered files state
        } catch (error) {
            console.log('Error fetching filtered files:', error);
        }
    }

    return (
        <div>
            <h2>My Files</h2>

            {/* Render filtering options for legal cases */}
            {fileType === 'legal_case' && (
                <div className="mb-4 p-2 border rounded bg-gray-50">
                    <label className="block mb-2 font-medium">Filter By:</label>
                    <select
                        value={filterKey}
                        onChange={handleFilterKeyChange}
                        className="w-full border rounded p-2 mb-2"
                    >
                        <option value="none">None</option>
                        <option value="caseTitle">Case Title</option>
                        <option value="judge">Judge</option>
                        <option value="date">Date</option>
                        <option value="caseType">Case Type</option>
                    </select>

                    {filterKey !== 'none' && (
                        <div>
                            {filterKey === 'date' ? (
                                <input
                                    type="date"
                                    value={filterValue}
                                    onChange={handleFilterValueChange}
                                    className="w-full border rounded p-2 mb-2"
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder={`Enter ${filterKey}`}
                                    value={filterValue}
                                    onChange={handleFilterValueChange}
                                    className="w-full border rounded p-2 mb-2"
                                />
                            )}
                            <button
                                onClick={applyFilter}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Apply Filter
                            </button>
                        </div>
                    )}
                </div>
            )}

            {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveFile(file)}
                        className="block border-b w-full cursor-pointer rounded-lg p-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0"
                    >
                        {index + 1}. {file.fileName}
                    </div>
                ))
            ) : (
                <p>No files available for {fileType === 'contract' ? 'Contracts' : 'Legal Cases'}.</p>
            )}
        </div>
    );
}
