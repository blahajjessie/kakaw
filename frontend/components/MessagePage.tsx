import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';

export interface MessagePageProps {
	pageTitle: string;
	heading: string;
	body: string;
	image: StaticImageData;
}

export default function MessagePage({
	pageTitle,
	heading,
	body,
	image,
}: MessagePageProps) {
	return (
		<main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
			<Head>
				<title>{pageTitle} - Kakaw!</title>
			</Head>
			<div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
				<Image
					alt="Kakaw logo"
					src={image}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
				<div className="text-orange-200 text-4xl text-center">{heading}</div>
				<div className="text-black text-2xl text-center">{body}</div>
			</div>
		</main>
	);
}
