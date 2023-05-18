export default function TimerSetter() {
	return (
		<div className="w-16 bg-gray-100 flex flex-row items-center justify-between font-normal text-sm p-0.5 rounded-lg xl:text-base 2xl:text-xl">
			<button className="w-5 h-5 bg-white flex items-center justify-center rounded-md">
				-
			</button>
			<div>15</div>
			<button className="w-5 h-5 bg-white flex items-center justify-center rounded-md">
				+
			</button>
		</div>
	);
}
