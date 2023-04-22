export function gen(len: number, used: Array<string>) {
	let result = '';
	const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const char_len = char.length;

	do {
		// generate code
		for (let i = 0; i < len; i++) {
			result += char.charAt(Math.floor(Math.random() * char_len));
		}

		// checks for duplicates
		if (used.includes(result)) {
			result = '';
		}
	} while (result == '');

	used.push(result);
	return result;
}

export function fin(code: string, used: Array<string>) {
	const index = used.indexOf(code);
	used.splice(index, 1);
}
