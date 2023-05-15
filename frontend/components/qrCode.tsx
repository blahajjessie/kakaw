import React from 'react';
import { useQRCode } from 'next-qrcode';
import { API_BASE_URL } from '@/lib/api'

export default function qr() {
	const { Canvas } = useQRCode();
	return (
		<Canvas
			text={`${API_BASE_URL}`}
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
