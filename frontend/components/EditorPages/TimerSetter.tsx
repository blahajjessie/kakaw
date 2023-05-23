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
		} else if (isDecrementing) {
			// Click - button: decrement by 1
			setTimerValue((current) => current - 1);
			// Hold - button: keep decrementing
			delayIntervalRef.current = setTimeout(() => {
				intervalRef.current = setInterval(() => {
					setTimerValue((current) => current - 1);
				}, 100);
			}, 500);
		} else {
			// Clear timeout and interval if both isIncrementing and
			// isDecrementing are set to false
			clearTimeout(delayIntervalRef.current);
			clearInterval(intervalRef.current);
			delayIntervalRef.current = undefined;
			intervalRef.current = undefined;
		}
	}, [isIncrementing, isDecrementing]);

	// Stop if the minimum or maximum timer value is reached
	useEffect(() => {
		if (
			(timerValue === MIN_TIMER_VALUE && isDecrementing) ||
			(timerValue === MAX_TIMER_VALUE && isIncrementing)
		) {
			clearTimeout(delayIntervalRef.current);
			clearInterval(intervalRef.current);
			delayIntervalRef.current = undefined;
			intervalRef.current = undefined;
		}
	}, [timerValue, isIncrementing, isDecrementing]);

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

	// Handle release of mouse hold, even if release is outside of button
	window.addEventListener('mouseup', () => {
		setIsIncrementing(false);
		setIsDecrementing(false);
		onChange(timerValue);
	});

	return (
		<div className="h-full bg-gray-100 flex flex-row items-center justify-between font-normal text-base rounded-lg lg:text-lg 2xl:text-xl">
			<button
				className="w-4 h-4 bg-white flex items-center justify-center text-red-200 rounded-md ml-1 my-1 hover:brightness-95 active:brightness-90 lg:w-5 lg:h-5 2xl:w-7 2xl:h-7"
				onMouseDown={startDecrementing}
			>
				-
			</button>

			<div className="px-1">{timerValue}s</div>

			<button
				className="w-4 h-4 bg-white flex items-center justify-center text-green-200 rounded-md mr-1 my-1 hover:brightness-95 active:brightness-90 lg:w-5 lg:h-5 2xl:w-7 2xl:h-7"
				onMouseDown={startIncrementing}
			>
				+
			</button>
		</div>
	);
}
