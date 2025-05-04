export default function Footer() {
    return (
        <footer className="mt-72 w-full bg-neutral-800 text-white py-4">
            <div className="max-w-screen-xl mx-auto text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Legal Ai-d. All rights reserved.
                </p>
                <p className="text-sm">
                    Built with ❤️ by <b>TY IT A Group 2</b>.
                </p>
            </div>
        </footer>
    );
}