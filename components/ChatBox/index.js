import { MdSend, MdAttachFile } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChooseFileAlert from "@/components/ChatBox/ChooseFileAlert";
import ReadyAlert from "@/components/ChatBox/ReadyAlert";
import Chat from "@/components/ChatBox/Chat";
import FileNotProcessedAlert from "@/components/ChatBox/FileNotProcessedAlert";
import AnimatedEllipsis from "../AnimatedEllipsis";

export default function ChatBox({ activeFile, setActiveFile, fileType }) {
	const divRef = useRef(null);
	const [chat, setChat] = useState([]);
	const [query, setQuery] = useState();
	const [id, setId] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef(null);

	const scrollToBottom = () => {
		if (divRef.current) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	};

	// when filetype is changed, set the active file to null
	useEffect(() => {
		setActiveFile(null);
	}, [fileType])


	// clear the chat when the active file changes
	useEffect(() => {
		setChat([]);
	}, [activeFile])


	useEffect(() => {
		scrollToBottom();
		console.log("msg added");
	}, [chat.length]);

	const addChat = (query, response, id) => {
		setChat((prevState) => [
			...prevState,
			{
				query,
				response,
			},
		]);

		setQuery(query);
		setId(id);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const query = e.target.query.value;
		const id = e.target.id.value;

		if (!query.trim()) return;

		e.target.query.value = "";
		if (inputRef.current) {
			inputRef.current.focus();
		}

		console.log(query, id);
		setIsLoading(true);
		addChat(query, null, id);
	};

	const updateLastChat = (query, response) => {
		console.log("--old chat--", chat);
		const oldChats = [...chat];
		oldChats.pop();
		setChat([
			...oldChats,
			{
				query,
				response,
			},
		]);
		setIsLoading(false);
	};

	useEffect(() => {
		const fetchChatResponse = async () => {
			try {
				let response = await fetch("/api/query", {
					method: "POST",
					body: JSON.stringify({ query, id }),
					headers: {
						"Content-type": "application/json",
					},
				});

				if (response.ok) {
					response = await response.json();
					updateLastChat(query, response.response);
				} else {
					response = await response.json();
					toast.error(response.message);
					setIsLoading(false);
				}
			} catch (error) {
				toast.error("Failed to get response. Please try again.");
				setIsLoading(false);
			}
		};

		if (query) {
			fetchChatResponse().then(() => console.log("response received"));
		}
	}, [query]);

	return (
		<div className="card flex flex-col h-full">
			<div className="px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center">
				<div className="flex-1 font-medium truncate">
					{activeFile ? (
						<div className="flex items-center">
							<MdAttachFile className="mr-2" />
							{activeFile.fileName}
						</div>
					) : (
						"Select a document to start chatting"
					)}
				</div>
				{activeFile && activeFile.isProcessed && (
					<div className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
						Ready
					</div>
				)}
			</div>

			<div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-white">
				<div
					className="flex-1 h-full p-4 overflow-y-auto subtle-scroll"
					style={{ maxHeight: "calc(100vh - 55px)", overflowY: "auto"}}
					ref={divRef}
				>
					{activeFile ? (
						!activeFile.isProcessed ? (
							<FileNotProcessedAlert id={activeFile._id} />
						) : chat.length > 0 ? (
							<div className="space-y-4 pb-2">
								{chat.map(({ query, response }, index) => (
									<Chat key={index} query={query} response={response} />
								))}
								{isLoading && (
									<div className="flex items-center space-x-2 text-gray-500 ml-10">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
											<AnimatedEllipsis />
										</div>
										<div>AI is thinking...</div>
									</div>
								)}
							</div>
						) : (
							<ReadyAlert fileId={activeFile._id} fileType={fileType} />
						)
					) : (
						<ChooseFileAlert />
					)}
				</div>
			</div>

			<form onSubmit={handleSubmit} className="p-3 border-t bg-white">
				<div className="flex items-center gap-2">
					<input
						ref={inputRef}
						name="query"
						className="input py-3 pr-10"
						placeholder={
							activeFile
								? "Ask anything about your document..."
								: "Select a document first"
						}
						disabled={!activeFile || !activeFile.isProcessed || isLoading}
					/>
					<input
						name="id"
						value={activeFile ? activeFile._id : ""}
						hidden
						readOnly
					/>
					<button
						type="submit"
						disabled={!activeFile || !activeFile.isProcessed || isLoading}
						className={`btn-primary p-3 rounded-full flex items-center justify-center ${!activeFile || !activeFile.isProcessed || isLoading
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-blue-700"
							}`}
					>
						<MdSend size={20} />
					</button>
				</div>
			</form>
		</div>
	);
}
