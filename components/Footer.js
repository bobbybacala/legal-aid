import Link from "next/link";
import { FaGithub, FaLinkedin, FaScaleBalanced } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full mt-auto">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FaScaleBalanced className="text-2xl mr-2 text-blue-400" />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              Legal Ai-d
            </span>
          </div>

          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Legal Ai-d. TY IT-A Group 2.
          </div>
        </div>
      </div>
    </footer>
  );
}
