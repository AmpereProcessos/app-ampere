import React from "react";

function FetchDataButton({ text, icon, handleClick }) {
	return (
		<div
			onClick={handleClick}
			className="flex items-center cursor-pointer border h-[41px] border-black text-black hover:bg-black hover:text-white font-bold p-2 rounded transition duration-300 ease-in-out hover:scale-105"
		>
			<p className="mr-2 text-sm">{text}</p>
			{icon}
		</div>
	);
}

export default FetchDataButton;
