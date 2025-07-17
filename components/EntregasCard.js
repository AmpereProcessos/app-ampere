import axios from "axios";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
function EntregasCard({ project, index }) {
	const [prevEntrega, setPrevEntrega] = useState(project.compra.previsaoEntrega);
	const [dataEntrega, setDataEntrega] = useState(project.compra.dataEntrega);
	const [msg, setMsg] = useState({
		text: "",
		color: "",
	});
	async function handleChanges() {
		axios
			.post(`/api/projects/update/${project._id}`, {
				"compra.previsaoEntrega": prevEntrega,
				"compra.dataEntrega": dataEntrega,
			})
			.then((res) => {
				setMsg({ text: "Alterações feitas", color: "text-green-500" });
			})
			.catch((err) =>
				setMsg({
					text: "Um erro ocorreu, por favor tente novamente",
					color: "text-red-500",
				}),
			);
	}
	return (
		<motion.div
			initial={{ opacity: 0, translateY: -20 }}
			animate={{ opacity: 1, translateY: 0 }}
			transition={{ duration: 0.3, delay: 0.01 * index }}
			className="flex w-full flex-col"
		>
			<div className="grid grid-cols-1 grid-rows-4 items-center gap-2 border border-gray-300 p-1 lg:grid-cols-10 lg:grid-rows-1">
				<p className="text-center font-bold text-[#15599a] lg:col-span-2 lg:text-start">
					{project.compra.fornecedor ? <strong className="font-semibold text-[#fead61]">({project.compra.fornecedor})</strong> : false} #{project.qtde} - {project.nomeDoContrato}
				</p>
				<div className="col-span-1 hidden flex-col items-center lg:flex">
					<p className="text-xs text-gray-600">NºMÓDULOS</p>
					<p className="text-xs text-gray-600">{project.sistema?.qtdeModulos}</p>
				</div>
				<div className="col-span-2 hidden flex-col items-center lg:flex">
					<p className="text-xs text-gray-600">FATURAMENTO</p>
					<p className={`text-gray-600 ${project.faturamento?.previsaoFaturamento?.length > 70 ? "text-xxs font-bold" : "text-xs"} text-center uppercase`}>
						{project.faturamento?.previsaoFaturamento ? project.faturamento?.previsaoFaturamento : "-"}
					</p>
				</div>
				<div className="col-span-2 hidden flex-col items-center lg:flex">
					<p className="text-xs text-gray-600">RASTREIO</p>
					<div className="w-full text-center">
						<p className={`max-w-full break-words text-gray-600 ${project.compra?.rastreio?.length > 70 ? "text-xxs font-bold" : "text-xxs"} text-center uppercase`}>
							{project.compra?.rastreio ? project.compra?.rastreio : "-"}
						</p>
					</div>
				</div>
				<div className="flex flex-col items-center lg:col-span-1">
					<p className="text-xs text-gray-600">PREV.ENTREGA</p>
					<input
						value={prevEntrega ? new Date(prevEntrega).toISOString().slice(0, 10) : 0}
						onChange={(e) => {
							console.log(e.target.value);
							setPrevEntrega(isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null);
						}}
						type="date"
						className="text-xs outline-none"
					/>
				</div>
				<div className="flex flex-col items-center lg:col-span-1">
					<p className="text-xs text-gray-600">DATA ENTREGA</p>
					<input
						value={dataEntrega ? new Date(dataEntrega).toISOString().slice(0, 10) : 0}
						onChange={(e) => {
							console.log(e.target.value);
							setDataEntrega(isNaN(e.target.value) ? new Date(e.target.value).toISOString() : null);
						}}
						type="date"
						className="text-xs outline-none"
					/>
				</div>
				<div className="col-span-1 flex items-center justify-center">
					<SaveButton text={"SALVAR"} icon={<FaSave />} handleClick={handleChanges} />
				</div>
			</div>
			{msg.text && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
		</motion.div>
	);
}

export default EntregasCard;
