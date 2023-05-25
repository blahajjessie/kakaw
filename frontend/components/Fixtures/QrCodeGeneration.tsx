import React from 'react';
import { useQRCode } from 'next-qrcode';
import { WEBPAGE_BASE_URL } from '@/lib/baseUrl';

export default function Qr(gameId: string) {
	const { Canvas } = useQRCode();
	return (
		<Canvas
			text={`${WEBPAGE_BASE_URL}/?code=${gameId}`}
			options={{
				level: 'M',
				margin: 2,
				scale: 4,
				width: 180,
				color: {
					dark: '#000000',
					light: '#FFFFFFFF',
				},
			}}
		/>
	);
}
