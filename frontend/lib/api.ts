import { useState } from 'react';

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

export enum RequestState {
	Idle,
	InProgress,
	Complete,
	Errored,
}

export interface UseRequest {
	state: RequestState;
	response: any;
	// non-JSON responses, or JSON with ok==false, or HTTP codes outside 2xx are also errors
	error?: any;
	// call this function to send the request
	trigger: () => void;
}

export function useRequest(
	method: 'GET' | 'POST',
	url: string,
	body?: any
): UseRequest {
	const [state, setState] = useState(RequestState.Idle);
	const [response, setResponse] = useState<any>(undefined);
	const [error, setError] = useState<any>(undefined);

	async function sendRequest() {
		try {
			const req = await apiCall(method, url, body);
			const data = await req.json();

			if (data === null || typeof data != 'object') {
				throw new Error('Server responded with invalid JSON');
			} else if (!data.ok) {
				throw new Error(`Error from server: ${data.err}`);
			} else if (req.status < 200 || req.status >= 300) {
				throw new Error(
					`Invalid HTTP code from server: ${req.status} ${req.statusText}`
				);
			}

			setState(RequestState.Complete);
			setResponse(data);
		} catch (e) {
			setState(RequestState.Errored);
			setError(e);
		}
	}

	return {
		state,
		response,
		error,
		trigger() {
			if (state == RequestState.InProgress) return;
			setState(RequestState.InProgress);
			sendRequest();
		},
	};
}
