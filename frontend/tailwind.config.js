/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				results: "url('/results_background.svg')",
			},
			colors: {
				purple: {
					50: '#988DB5',
					100: '#674EA7',
					300: '#B497FF',
					350: '#E086FF',
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
					400: '#CCCCCC',
					500: '#B9B9B9',
				},
				red: {
					200: '#FF6663',
				},
				blue: {
					200: '#9EC1CF',
				},
				green: {
					200: '#9EE09E',
				},
				yellow: {
					200: '#FDFD97',
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
			textShadow: {
				DEFAULT: '0 2px 4px #00000080',
			},
		},
	},
	plugins: [
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'text-shadow': (value) => ({
						textShadow: value,
					}),
				},
				{ values: theme('textShadow') }
			);
		}),
	],
};
