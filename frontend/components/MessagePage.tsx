import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';
import Link from 'next/link'

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
		        <Link href ="/">
				<Image
					alt="Kakaw logo"
					src={image}
					width={189}
					style={{
						maxWidth: '100%',
						height: 'auto',
					}}
				/>
			    </Link>
				<div className="text-orange-200 text-4xl text-center">{heading}</div>
				<div className="text-black text-2xl text-center">{body}</div>
			
				<div className="text-black text-2xl text-center">Click on Kakper to go back to the main page!</div>
			</div>
		</main>
	);
}
