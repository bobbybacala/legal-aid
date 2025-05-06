import { useState } from "react";
import { FaUser, FaRobot, FaCopy, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import AnimatedEllipsis from "../AnimatedEllipsis";
import ReactMarkdown from "react-markdown";

export default function Chat({ query, response }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* User Query */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
          <FaUser size={14} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 mb-1">You</div>
          <div className="text-gray-800 bg-blue-50 rounded-lg rounded-tl-none p-3">
            {query}
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex items-start gap-3 ml-auto">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white flex-shrink-0">
          <FaRobot size={14} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 mb-1 flex items-center justify-between">
            <span>Legal Assistant</span>
            {response && (
              <button
                onClick={() => copyToClipboard(response)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <FaCheck size={14} className="text-green-500" />
                ) : (
                  <FaCopy size={14} />
                )}
              </button>
            )}
          </div>
          <div className="text-gray-800 bg-gray-50 border border-gray-100 rounded-lg rounded-tl-none p-3">
            {response ? (
              <ReactMarkdown className="prose prose-sm max-w-none">
                {response}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center text-gray-500">
                <AnimatedEllipsis />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
