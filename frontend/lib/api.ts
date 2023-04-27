export const API_BASE_URL = 'http://localhost:8080';
export const WEBSOCKET_BASE_URL = 'ws://localhost:8080';

export function apiCall(
	method: 'GET' | 'POST',
	url: string,
	body?: any
): Promise<Response> {
	const options: RequestInit = { method };
	if (body) {
		options.body = JSON.stringify(body);
		options.headers = {
			'content-type': 'application/json',
		};
	}

	return fetch(API_BASE_URL + url, options);

}

