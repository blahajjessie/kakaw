const nextJest = require('next/jest');

const createJestConfig = nextJest({
	dir: './',
});

const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverageFrom: [
		'<rootDir>/lib/**',
		'<rootDir>/pages/**',
		'<rootDir>/components/**',
		'!<rootDir>/pages/_app.tsx',
    '!<rootDir>/pages/_document.tsx',
	],
	testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
