import quiz from '../documentation/test-quizzes/13s.json';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { QuizQuestion } from './src/quiz';

function Question(
	props: QuizQuestion & {
		pointDefault: number;
		timeDefault: number;
		index: number;
	}
) {
	return (
		<section>
			<h2>
				{props.index + 1}. {props.questionText}
			</h2>
			<p>
				<small>
					{props.points ?? props.pointDefault} points,{' '}
					{props.time ?? props.timeDefault} seconds
				</small>
			</p>
			{props.note && <p>{props.note}</p>}
			<ol>
				{props.answerTexts.map((answer, index) => (
					<li key={index}>
						{props.explanations ? (
							<details>
								<summary
									className={
										props.correctAnswers.includes(index)
											? 'answer correct'
											: 'answer'
									}
								>
									{answer}
								</summary>
								{props.explanations[index]}
							</details>
						) : (
							<span
								className={
									props.correctAnswers.includes(index)
										? 'answer correct'
										: 'answer'
								}
							>
								{answer}
							</span>
						)}
					</li>
				))}
			</ol>
		</section>
	);
}

const tree = (
	<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>{`${quiz.meta.title} | Kakaw Quiz`}</title>
			<style
				dangerouslySetInnerHTML={{
					__html: `
				main {
					max-width: 800px;
					margin: auto;
					font-family: system-ui;
				}

				body.answers-shown .answer {
					color: #800000;
				}

				body.answers-shown .answer.correct {
					color: #008000;
					font-weight: bold;
				}

				body.answers-shown .answer.correct:after {
					content: ' (correct)';
				}
			`,
				}}
			/>
		</head>
		<body>
			<main>
				<h1>{quiz.meta.title}</h1>
				<p>Quiz by {quiz.meta.author}</p>
				<p>
					<label htmlFor="answer-toggle">
						<input type="checkbox" id="answer-toggle" defaultChecked={false} />
						Show correct answers
					</label>
				</p>
				<article>
					{quiz.questions.map((q, index) => (
						<Question
							{...q}
							pointDefault={quiz.meta.pointDefault}
							timeDefault={quiz.meta.timeDefault}
							index={index}
							key={index}
						/>
					))}
				</article>
			</main>
			<script
				dangerouslySetInnerHTML={{
					__html: `
				const checkbox = document.getElementById('answer-toggle');
				function handler() {
					if (checkbox.checked) {
						document.body.classList.add('answers-shown');
					} else {
						document.body.classList.remove('answers-shown');
					}
				}
				handler();
				checkbox.onclick = handler;
			`,
				}}
			/>
		</body>
	</html>
);

console.log('<!doctype html>' + renderToString(tree));
