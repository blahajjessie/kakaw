import { useState } from 'react';

export const API_BASE_URL = 'http://localhost:8080';
export const WEBSOCKET_BASE_URL = 'ws://localhost:8080';

export async function apiCall(
	method: 'GET' | 'POST',
	url: string,
	body?: any
): Promise<any> {
	const options: RequestInit = { method };
	if (body) {
		options.body = JSON.stringify(body);
		options.headers = {
			'content-type': 'application/json',
		};
	}

	const req = await fetch(API_BASE_URL + url, options);
	const data = await req.json();
	console.dir(data);

	if (data === null || typeof data != 'object') {
		throw new Error('Server responded with invalid JSON');
	} else if (
		data.ok === false ||
		(typeof data.err != 'undefined' && data.err !== null)
	) {
		throw new Error(`Error from server: ${data.err}`);
	} else if (req.status < 200 || req.status >= 300) {
		throw new Error(
			`Invalid HTTP code from server: ${req.status} ${req.statusText}`
		);
	}

	return data;
}
