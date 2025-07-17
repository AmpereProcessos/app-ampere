import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

function AccessRequestsPage() {
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
	const [newAccessRequestModalIsOpen, setNewAccessRequestModalIsOpen] = useState<boolean>(false);
	return (
		<div className="flex grow flex-col bg-[#fff] p-6">
			<div className="flex flex-col items-center justify-between  gap-2 border-b border-gray-300 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">Projetos no estágio de engenharia</p>
					</div>
					{dropdownMenuVisible ? (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
				<div className="flex w-full items-center justify-end">
					<button
						// @ts-ignore
						onClick={() => handleCreateActivity({ info: newActivityHolder })}
						className='enabled:hover:text-white" whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800'
					>
						NOVO
					</button>
				</div>
			</div>
		</div>
	);
}

export default AccessRequestsPage;
