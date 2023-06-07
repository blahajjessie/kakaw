export default function downloadQuiz(quiz: any) {
	// https://stackoverflow.com/a/30832210
	const file = new Blob([JSON.stringify(quiz)], {
		type: 'application/json',
	});
	const link = document.createElement('a');
	const url = URL.createObjectURL(file);
	link.href = url;
	link.download = 'kakaw-exported-quiz.json';
	document.body.appendChild(link);
	link.click();
	setTimeout(() => {
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, 0);
}
