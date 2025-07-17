import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { TbExternalLink, TbCheckbox } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import ModalBancoOS from "./ModalOrdemServico";
import dayjs from "dayjs";
function OSBlock({ order, clientName, index, projectID, getOSS }) {
	const [msg, setMsg] = useState({
		text: "",
		color: "",
	});
	const [closedDateHolder, setClosedDateHolder] = useState(order.dataDeFechamento);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalInfo, setModalInfo] = useState();
	// Utils
	// function validateVisibility(categoria, openOnly, closingDate) {
	//   if (openOnly) {
	//     if (closingDate != undefined) return "hidden";
	//     else return "";
	//   } else if (categories.length > 0) {
	//     if (!categories.includes(categoria)) return "hidden";
	//     else return "";
	//   } else {
	//     return "";
	//   }
	// }
	async function closeOS() {
		let { data } = await axios
			.post(`/api/projects/update/${projectID}`, {
				[`ordensDeServico.${index}.dataDeFechamento`]: new Date().toISOString(),
			})
			.catch((err) => alert("Houve um erro na comunicação com o servidor."));
		if (data) {
			setClosedDateHolder(new Date().toISOString());
			setMsg({ text: "Alterações feitas", color: "text-green-500" });
			// setTimeout(() => {
			//   getOSS();
			// }, 1000);
		}
	}
	function handleOpenModal(order) {
		setModalInfo(order);
		setModalIsOpen(true);
	}
	return (
		<div className="flex flex-col">
			<div className={`grid grid-cols-4 items-start border-b  border-gray-300 py-2 lg:grid-cols-6`}>
				<div className="hidden flex-col items-center justify-center lg:flex">
					<p className="text-xs text-gray-500">EMISSOR</p>
					<p className="text-xs font-bold uppercase text-gray-700">{order.usuarioEmissor}</p>
				</div>
				<div className="hidden flex-col items-center justify-center lg:flex">
					<p className="text-xs text-gray-500">CATEGORIA</p>
					<p className="text-xs font-bold text-gray-700">{order.categoria}</p>
				</div>
				<div className="flex flex-col items-center justify-center">
					<p className="text-xs text-gray-500">SERVIÇO</p>
					<p className="text-center text-xxs font-bold text-gray-700 lg:text-xs">{order.servicoExecutado}</p>
				</div>
				<div className="flex items-center justify-center">
					<Link href={`/ordens-de-servico/pdf/${projectID}?index=${order.index}`}>
						<button className="h-[30px] rounded border border-[#fead61] p-1 font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black">
							<TbExternalLink />
						</button>
					</Link>
				</div>
				<div className="flex items-center justify-center">
					{closedDateHolder ? (
						<div className="flex flex-col items-center justify-center">
							<p className="text-center text-xs text-gray-500">DATA DE FECHAMENTO</p>
							<p className="text-center text-xxs font-bold text-gray-700 lg:text-xs">{dayjs(closedDateHolder).add(4, "hour").format("DD/MM/YYYY")}</p>
						</div>
					) : (
						<button onClick={closeOS} className="h-[30px] rounded border border-green-500 p-1 font-bold text-green-500 hover:bg-green-500 hover:text-white">
							<TbCheckbox />
						</button>
					)}
				</div>
				<div className="flex flex-col items-center justify-center">
					<button onClick={() => handleOpenModal(order)} className="h-[30px] rounded border border-[#15599a] p-1 font-bold text-[#15599a] hover:bg-[#15599a] hover:text-white">
						<FiEdit />
					</button>
				</div>
			</div>
			{msg.text && <p className={`text-center text-xs italic ${msg.color}`}>{msg.text}</p>}
			{modalIsOpen && <ModalBancoOS info={modalInfo} index={index} clientName={clientName} projectID={projectID} setModalIsOpen={() => setModalIsOpen(false)} />}
		</div>
	);
}

export default OSBlock;
