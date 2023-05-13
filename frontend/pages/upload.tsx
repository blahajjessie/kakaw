import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import MatchMediaWrapper from '@/components/MatchMediaWrapper';
import { apiCall } from '@/lib/api';
import Link from 'next/link';

enum UploadStatus {
	Idle,
	InProgress,
	Error,
	Done,
}

export default function UploadPage() {
	const mobileContent = (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<div className="bg-gray-100 rounded-xl w-2/5 px-8 py-2 -mb-2 font-mono text-4xl text-center font-extrabold shadow-heavy">
					404
				</div>
				<div className="bg-gray-100 rounded-xl w-4/5 px-8 py-4 mb-2 text-lg text-center shadow-heavy">
					Feature not supported on mobile devices :&#40;
				</div>
			</div>
		</main>
	);

	const [quizData, setQuizData] = useState<any>(null);
	const [filename, setFilename] = useState<string | null>(null);
	const [valid, setValid] = useState(false);
	const [uploadStatus, setUploadStatus] = useState(UploadStatus.Idle);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	function handleFileData(e: ProgressEvent<FileReader>) {
		const reader = e.target!;
		reader.removeEventListener('load', handleFileData);
		try {
			setQuizData(JSON.parse(reader.result as string));
			setValid(true);
		} catch (e) {
			setValid(false);
		}
	}

	function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}
		setFilename(file.name);
		const reader = new FileReader();
		reader.addEventListener('load', handleFileData);
		reader.readAsText(file);
	}

	async function uploadQuiz() {
		if (!valid || !quizData || !filename) {
			return;
		}

		setUploadStatus(UploadStatus.InProgress);

		try {
			// this will have to store the host ID somewhere so that the websocket opening code can use it
			const { gameId, hostId } = await (
				await apiCall('POST', '/games', quizData)
			).json();
			// i don't know what the client-side URL here will be eventually
			router.push(`/games/${gameId}`);
		} catch (e) {
			setUploadStatus(UploadStatus.Error);
			console.error(e);
		}
	}

	const desktopContent = (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold text-lg 2xl:text-xl">
				<form className="bg-gray-100 flex flex-col items-center justify-center rounded-xl w-full p-10 mb-2 shadow-heavy">
					<div className="text-center mb-4">Upload Quiz</div>
					{typeof filename == 'string' && quizData && (
						<div className="mb-4 bg-white rounded-xl p-2 mx-3 flex flex-row">
							<span className="flex-grow font-bold">
								{valid ? (
									filename
								) : (
									<>
										<s>{filename}</s> (invalid)
									</>
								)}
							</span>
							<button
								className="text-red-500"
								type="button"
								onClick={() => {
									setFilename(null);
								}}
							>
								&#x1f5d9;
							</button>
						</div>
					)}
					<div className="w-full flex flex-row justify-center px-1 mb-4">
						<label htmlFor="quiz-upload-input" className="w-full mx-2">
							<input
								type="file"
								className="hidden"
								id="quiz-upload-input"
								accept="application/json"
								ref={fileInputRef}
								onChange={handleFileInput}
							/>
							<button
								className="bg-white hover:bg-gray-50 border-1 border-gray-200 rounded-xl text-center shadow-md p-2 w-full"
								type="button"
								onClick={() => {
									fileInputRef.current!.click();
								}}
							>
								Select File
							</button>
						</label>
						<button
							className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-xl w-full p-2 mx-2 text-white text-center shadow-md"
							type="button"
							disabled={
								!valid ||
								!quizData ||
								!filename ||
								uploadStatus == UploadStatus.InProgress
							}
							onClick={uploadQuiz}
						>
							{uploadStatus == UploadStatus.InProgress
								? 'Uploading...'
								: 'Upload'}
						</button>
					</div>
					<div className="text-center mb-4">Or create a new one</div>
					<Link
						href="/editor"
						className="bg-orange-200 hover:brightness-110 border-1 border-gray-200 rounded-xl w-1/2 p-2 mx-2 text-white text-center shadow-md"
					>
						Create Quiz
					</Link>
				</form>
			</div>
		</main>
	);

	return (
		<MatchMediaWrapper
			mobileContent={mobileContent}
			desktopContent={desktopContent}
		/>
	);
}
