import { API_BASE_URL } from './baseUrl';

interface userType {
	gameId: string;
	id: string;
}

export async function apiCall(
	method: 'GET' | 'POST',
	url: string,
	body?: any,
	user?: userType
): Promise<any> {
	const options: RequestInit = { method };
	options.headers = {};
	console.log(user);
	if (user) {
		const token = sessionStorage.getItem(
			`kakawToken/${user.gameId}/${user.id}`
		);
		options.headers['authorization'] = `Bearer ${token}`;
	}
	if (body) {
		options.body = JSON.stringify(body);
		options.headers['content-type'] = 'application/json';
	}

	const req = await fetch(API_BASE_URL + url, options);
	const data = await req.json();

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
