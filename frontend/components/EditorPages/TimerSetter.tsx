import { useState, useEffect, useRef } from 'react';

const MIN_TIMER_VALUE = 1;
const MAX_TIMER_VALUE = 420;

interface TimerSetterProps {
	initTimerValue: number;
	onChange: (timerValue: number) => void;
}

export default function TimerSetter({
	initTimerValue,
	onChange,
}: TimerSetterProps) {
	const [timerValue, setTimerValue] = useState(initTimerValue);
	const [isIncrementing, setIsIncrementing] = useState(false);
	const [isDecrementing, setIsDecrementing] = useState(false);

	// Store references to timeout and interval for holding -/+ buttons
	let delayIntervalRef = useRef<NodeJS.Timeout>();
	let intervalRef = useRef<NodeJS.Timer>();

	// Incrementing/decrementing based on mouse down and mouse up events
	useEffect(() => {
		if (isIncrementing) {
			// Click + button: increment by 1
			setTimerValue((current) => current + 1);
			// Hold + button: keep incrementing
			delayIntervalRef.current = setTimeout(() => {
				intervalRef.current = setInterval(() => {
					setTimerValue((current) => current + 1);
				}, 100);
			}, 500);
		}

		if (isDecrementing) {
			// Click - button: decrement by 1
			setTimerValue((current) => current - 1);
			// Hold - button: keep decrementing
			delayIntervalRef.current = setTimeout(() => {
				intervalRef.current = setInterval(() => {
					setTimerValue((current) => current - 1);
				}, 100);
			}, 500);
		}
	}, [isIncrementing, isDecrementing]);

	// Stop if the minimum or maximum timer value is reached
	// or if user releases button
	useEffect(() => {
		if (
			(!isIncrementing && !isDecrementing) ||
			(timerValue === MIN_TIMER_VALUE && isDecrementing) ||
			(timerValue === MAX_TIMER_VALUE && isIncrementing)
		) {
			clearTimeout(delayIntervalRef.current);
			clearInterval(intervalRef.current);
			delayIntervalRef.current = undefined;
			intervalRef.current = undefined;
			onChange(timerValue);
		}
	}, [isIncrementing, isDecrementing]);

	// Handle release of held button, even if release happens outside of button
	useEffect(() => {
		window.addEventListener('mouseup', () => {
			setIsIncrementing(false);
			setIsDecrementing(false);
		});
	});

	function startIncrementing() {
		if (timerValue < MAX_TIMER_VALUE) {
			setIsIncrementing(true);
		}
	}

	function startDecrementing() {
		if (timerValue > MIN_TIMER_VALUE) {
			setIsDecrementing(true);
		}
	}

	return (
		<div className="w-20 h-full bg-gray-100 flex flex-row items-center justify-between font-normal text-base rounded-lg lg:text-lg lg:w-24 2xl:text-xl 2xl:w-28">
			<button
				className="w-4 h-4 bg-white flex items-center justify-center text-red-200 rounded-md ml-1 my-1 hover:brightness-95 active:brightness-90 lg:w-5 lg:h-5 2xl:w-7 2xl:h-7"
				onMouseDown={startDecrementing}
			>
				-
			</button>

			<div className="px-1 text-black">{timerValue}s</div>

			<button
				className="w-4 h-4 bg-white flex items-center justify-center text-green-200 rounded-md mr-1 my-1 hover:brightness-95 active:brightness-90 lg:w-5 lg:h-5 2xl:w-7 2xl:h-7"
				onMouseDown={startIncrementing}
			>
				+
			</button>
		</div>
	);
}
