import { useState } from 'react';

export default function TimerSetter() {
	const [timerValue, setTimerValue] = useState(15);

	function updateTimerValue(newValue: number) {
		if (newValue < 1) {
			setTimerValue(1);
		} else if (newValue > 420) {
			setTimerValue(420);
		} else {
			setTimerValue(newValue);
		}
	}

	return (
		<div className="w-16 bg-gray-100 flex flex-row items-center justify-between font-normal text-sm p-0.5 rounded-lg xl:text-base 2xl:text-xl">
			<button
				className="w-5 h-5 bg-white flex items-center justify-center rounded-md"
				onClick={() => updateTimerValue(timerValue - 1)}
			>
				-
			</button>

			<div>{timerValue}</div>

			<button
				className="w-5 h-5 bg-white flex items-center justify-center rounded-md"
				onClick={() => updateTimerValue(timerValue + 1)}
			>
				+
			</button>
		</div>
	);
}
