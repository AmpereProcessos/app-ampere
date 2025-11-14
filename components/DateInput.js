import React from "react";

function DateInput({ label, value, handleChange, editable }) {
	return (
		<div className="flex w-full flex-col items-center text-sm lg:w-[350px] lg:text-base">
			<span className="font-raleway text-center text-sm font-bold uppercase">{label}</span>
			<input
				className="text-primary/80 w-full text-center text-xs uppercase outline-hidden"
				type="date"
				readOnly={!editable}
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				onReset={() => handleChange(null)}
			/>
		</div>
	);
}

export default DateInput;
