import Image from 'next/image';
import { useState, useEffect } from 'react';

import editor_plus from '@/public/editor_plus.svg';
import editor_minus from '@/public/editor_minus.svg';

interface AnswerEditorProps {
	answer: string;
	isCorrect: boolean;
}

export default function AnswerEditor({ answer, isCorrect }: AnswerEditorProps) {
	return (
		<div className="">
			{answer}
			<input type="checkbox" checked={isCorrect} />
		</div>
	);
}
