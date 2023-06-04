import Head from 'next/head';

export default function NoMobileSupport() {
	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<Head>
				<title>404 - Kakaw!</title>
			</Head>
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
}
