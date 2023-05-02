/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				purple: {
					50: '#988DB5',
					100: '#674EA7',
					500: '#584290',
				},
				orange: {
					50: '#FEB144',
					200: '#FF7200',
				},
				gray: {
					100: '#D9D9D9',
					200: '#AEAEAE',
					300: '#4B5563',
				},
			},
			boxShadow: {
				heavy: '0px 4px 4px rgba(0, 0, 0, 0.25)',
			},
			fontFamily: {
				mono: [
					'"Roboto Mono"',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'Consolas',
					'"Liberation Mono"',
					'"Courier New"',
					'monospace',
				],
			},
		},
	},
	plugins: [],
};
