import React from "react";
import { VscChromeClose } from "react-icons/vsc";
type NumberVirtualKeyboardProps = {
	handleClick: (x: number) => void;
	closeModal: () => void;
	dropLastNumber: () => void;
};
function NumberVirtualKeyboard({ closeModal, handleClick, dropLastNumber }: NumberVirtualKeyboardProps) {
	return (
		<div className="absolute left-[50%] top-[200px] z-[1000]  h-[260px] w-[300px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px]">
			<div className="flex h-full w-full flex-col gap-2">
				<div className="flex w-full items-center justify-between">
					<p className="text-sm text-gray-500">TECLADO VIRTUAL</p>
					<button onClick={closeModal} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
						<VscChromeClose style={{ color: "red" }} />
					</button>
				</div>
				<div className="grid w-full grid-cols-3 gap-2">
					<div onClick={() => handleClick(7)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>7</p>
					</div>
					<div onClick={() => handleClick(8)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>8</p>
					</div>
					<div onClick={() => handleClick(9)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>9</p>
					</div>
					<div onClick={() => handleClick(4)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>4</p>
					</div>
					<div onClick={() => handleClick(5)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>5</p>
					</div>
					<div onClick={() => handleClick(6)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>6</p>
					</div>
					<div onClick={() => handleClick(1)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>1</p>
					</div>
					<div onClick={() => handleClick(2)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>2</p>
					</div>
					<div onClick={() => handleClick(3)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>3</p>
					</div>
				</div>
				<div className="grid w-full grid-cols-3 gap-2">
					<div onClick={() => dropLastNumber()} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>LIMPAR</p>
					</div>
					<div onClick={() => handleClick(0)} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>0</p>
					</div>
					<div onClick={() => closeModal()} className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 p-3 text-sm shadow-sm hover:bg-blue-100">
						<p>ENTER</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NumberVirtualKeyboard;
