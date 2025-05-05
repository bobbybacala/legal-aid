import React from 'react'

const LegalCaseDocMetaDataModal = ({isOpen, onClose, metaData, onMetadataChange, onSubmit}) => {
    // if not open return null
    if (!isOpen) {
        return null
    }

    // create the form div for the modal, pass the onMetadataChange function in the onChange event of the input fields
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <form className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Enter Legal Case Metadata</h2>
                <div className="space-y-2">
                    <input
                        type="text"
                        name="caseTitle"
                        placeholder="Case Title"
                        value={metaData.caseTitle}
                        onChange={onMetadataChange}
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="text"
                        name="judge"
                        placeholder="Judge"
                        value={metaData.judge}
                        onChange={onMetadataChange}
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={metaData.date}
                        onChange={onMetadataChange}
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="text"
                        name="caseType"
                        placeholder="Case Type (e.g., Civil, Criminal)"
                        value={metaData.caseType}
                        onChange={onMetadataChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default LegalCaseDocMetaDataModal
