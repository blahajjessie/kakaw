import React from 'react';
import { useQRCode } from 'next-qrcode';

export default function qr(hostId: string) {
	const { Canvas } = useQRCode();
	return (
		<Canvas
			text={`https://localhost:3000/?hostId=${hostId}`}
			options={{
				level: 'M',
				margin: 3,
				scale: 4,
				width: 200,
				color: {
					dark: '#010599FF',
					light: '#FFBF60FF',
				},
			}}
		/>
	);
}
