import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import SaveButton from "./utils/Buttons/SaveButton";
const MODAL_STYLES = {
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%,-50%)",
	backgroundColor: "#fff",
	minWidth: "40%",
	height: "87%",
	borderRadius: "10px",
	padding: "10px",
	zIndex: 1000,
};
const OVERLAY_STYLES = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: "rgba(0,0,0,.7)",
	zIndex: 1000,
};
function ModalCallADM({ open, setModalIsOpen, info, getCalls }) {
	const [modalInfo, setModalInfo] = useState(info);
	const [changes, setChanges] = useState({});
	const [message, setMessage] = useState({
		text: "",
		color: "",
	});
	function handleChanges(status) {
		let obj = { ...changes, status: status ? status : modalInfo.status };
		console.log(obj);
		axios
			.put("/api/chamados/adm/mainData", {
				id: info._id,
				changes: obj,
			})
			.then((res) => {
				getCalls();
				setMessage({ text: "Alterações feitas", color: "text-green-500" });
				setModalInfo(res.data.value);
			})
			.catch((err) =>
				setMessage({
					text: "Um erro ocorreu, por favor tente novamente.",
					color: "text-red-500",
				}),
			);
	}
	function getText(service) {
		if (service == "PAGAMENTO") {
			return "VALOR A PAGAR";
		}
		if (service == "COBRANÇA") {
			return "VALOR A COBRAR";
		}
	}
	console.log(modalInfo);
	return (
		<>
			<div style={OVERLAY_STYLES}>
				<div style={MODAL_STYLES}>
					<div className="flex flex-col h-full">
						<div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-300">
							<div className="flex items-center gap-x-2">
								<h1 className="text-[#15599a] pl-6  font-bold">{modalInfo.demanda}</h1>
								<p className="text-gray-500 text-center text-xs">#{modalInfo._id}</p>
							</div>
							<button>
								<VscChromeClose
									onClick={() => {
										setMessage({ text: "", color: "" });
										setModalIsOpen(false);
									}}
									style={{ color: "red" }}
								/>
							</button>
						</div>
						<div className="overflow-y-auto">
							<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-x-2 border border-gray-300 p-2 mt-4">
								<span className="text-center font-bold font-raleway">CLIENTE</span>
								<span className="grow text-center font-raleway">
									{modalInfo.nomeCliente} - #{modalInfo.codigoProjeto}
								</span>
							</div>
							<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-x-2 border border-gray-300 p-2 mt-4">
								<span className="text-center font-bold font-raleway">EMISSOR</span>
								<span className="grow text-center font-raleway">{modalInfo.usuarioEmissor}</span>
							</div>
							<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 border border-gray-300 p-2 mt-4">
								<span className="text-center font-bold font-raleway">ABERTURA</span>
								<span className="grow text-center font-raleway">{dayjs(modalInfo.dataAbertura).format("DD/MM/YYYY")}</span>
							</div>
							{modalInfo.dataDeConclusao && (
								<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 border border-gray-300 p-2 mt-4">
									<span className="text-center font-bold font-raleway">FECHAMENTO</span>
									<span className="grow text-center font-raleway">{dayjs(modalInfo.dataDeConclusao).format("DD/MM/YYYY")}</span>
								</div>
							)}

							<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 border border-gray-300 p-2 mt-4">
								<span className="text-center font-bold font-raleway">SERVIÇO</span>
								<span className="grow text-center font-raleway">{modalInfo.servico}</span>
							</div>
							{modalInfo.demanda == "PAGAMENTO" && (
								<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-x-2 border border-gray-300 p-2 mt-4">
									<span className="text-center font-bold font-raleway">NOME DO RECEBEDOR</span>
									<span className="grow text-center font-raleway">{modalInfo.nomeRecebedor}</span>
								</div>
							)}
							<div className="grid grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 gap-x-2 border border-gray-300 p-2 mt-4">
								<span className="text-center font-bold font-raleway">{getText(modalInfo.demanda)}</span>
								<span className="grow text-center font-raleway">{typeof modalInfo.valor == "number" ? `R$${modalInfo.valor.toFixed(2).replace(".", ",")}` : "VALOR NÃO DEFINIDO"}</span>
							</div>
							<div className="flex flex-col gap-x-2 border border-gray-300 p-2 mt-4">
								<span className="font-bold text-center font-raleway">OBSERVAÇÕES</span>
								<span className="grow text-center font-raleway text-sm bg-gray-100 p-4 italic">
									{modalInfo.observacoes ? (
										<ul className="text-xs font-bold text-center list-none">
											{modalInfo.observacoes.split("/").map((string, index) => (
												<li key={index}>{string}</li>
											))}
										</ul>
									) : (
										<p className="text-xs font-bold text-center">SEM OBSERVAÇÕES</p>
									)}
								</span>
							</div>
							<div className="flex flex-col gap-x-2 border border-gray-300 p-2 mt-4">
								<span className="font-bold text-center font-raleway">ANOTAÇÕES</span>
								<textarea
									value={modalInfo.anotacoes}
									onChange={(e) => {
										setChanges({ ...changes, anotacoes: e.target.value });
										setModalInfo({ ...modalInfo, anotacoes: e.target.value });
									}}
									placeholder="Digite aqui as anotações do chamado"
									className="outline-none placeholder:italic mt-1 rounded text-center text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit grow"
								/>
							</div>
							{modalInfo.dataDeConclusao ? (
								<div className="text-center">
									<button onClick={() => handleChanges("ABERTO")} className="p-3 font-raleway mt-4 hover:bg-[#f18701] hover:text-white font-bold rounded-lg bg-yellow-400">
										REABRIR CHAMADO
									</button>
								</div>
							) : (
								<div className="text-center">
									<button onClick={() => handleChanges("FINALIZADO")} className="p-3 font-raleway mt-4 hover:bg-[#06d6a0] hover:text-white font-bold rounded-lg bg-green-400">
										FINALIZAR CHAMADO
									</button>
								</div>
							)}
							{message.text && <p className={`text-center ${message.color} mt-2 italic`}>{message.text}</p>}
							<div className="flex items-center justify-center mt-2">
								<SaveButton text={"SALVAR"} icon={<FaSave />} handleClick={handleChanges} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ModalCallADM;
