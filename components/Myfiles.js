import { useState } from "react";

export default function MyFiles({ setActiveFile, files = [] }) {
    return (
        <div>
            <h2>My Files</h2>
            {Array.isArray(files) ? (
                files.map((file, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveFile(file)}
                        className="block border-b w-full cursor-pointer rounded-lg p-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0"
                    >
                        {index + 1}. {file.fileName}
                    </div>
                ))
            ) : (
                <p>No files available.</p>
            )}
        </div>
    );
}
