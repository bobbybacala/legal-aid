import FileUpload from "@/components/FileUpload";
import MyFiles from "@/components/Myfiles";
import Intro from "@/components/Intro";
import ChatBox from "@/components/ChatBox";
import Footer from "@/components/Footer";
import { useState } from "react";
import useMyFiles from "@/apiHooks/useMyFiles";
import Head from "next/head";
import { FaScaleBalanced } from "react-icons/fa6";

export default function Home() {
  const [activeFile, setActiveFile] = useState(null);
  const [fileType, setFileType] = useState("contract"); // Default to 'contract'
  const { files, isError, isLoading } = useMyFiles();

  const handleFileTypeChange = (type) => {
    setFileType(type);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            Loading your legal documents...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Legal Aid - AI-Powered Legal Document Assistant</title>
        <meta
          name="description"
          content="Get AI-powered help with your legal documents and contracts"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-0 py-4 flex items-center">
            <FaScaleBalanced className="text-blue-600 mr-3 text-2xl" />
            <h1 className="text-2xl md:text-3xl font-bold animated-gradient-text">
              Legal Ai-d
            </h1>
          </div>
        </header>

        <main className="flex-1 max-w-screen-xl w-full mx-auto px-5 lg:px-0 py-6 mb-8">
          <div className="grid md:grid-cols-[38%_62%] gap-6">
            <div className="space-y-6">
              <Intro />
              <FileUpload onFileTypeChange={handleFileTypeChange} />
              <MyFiles
                setActiveFile={setActiveFile}
                files={files}
                fileType={fileType}
              />
            </div>

            <div className="min-h-[500px]">
              <ChatBox activeFile={activeFile} fileType={fileType} setActiveFile={setActiveFile} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
