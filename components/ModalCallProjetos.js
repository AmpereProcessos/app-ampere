import React, { useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { cities, projetistas } from "../utils/constants";
import axios from "axios";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
import { FaSave } from "react-icons/fa";
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
const statusStyles = {
	"AGUARDANDO CONCESSIONÁRIA": {
		textColor: "text-yellow-500",
		borderColor: "border-yellow-500",
	},
	"EM ANDAMENTO": {
		textColor: "text-[#15599a]",
		borderColor: "border-[#15599a]",
	},
	FINALIZADO: {
		textColor: "text-green-400",
		borderColor: "border-green-400",
	},
};
function ModalCallProjetos({ setModalIsOpen, info, getCalls, modalIsOpen }) {
	const [infoHolder, setInfo] = useState(info);
	const [changes, setChanges] = useState({});
	const [responsavel, setResponsavel] = useState(info.responsavel);
	const [notes, setNotes] = useState(info.anotacoes);

	const [message, setMessage] = useState({ text: "", color: "" });
	function resetMessage() {
		setTimeout(() => setMessage({ text: "", color: "" }), 2000);
	}
	function saveCallChanges(status, mode) {
		axios
			.post("/api/chamados/projetos/updateProjetos", {
				id: info._id,
				mudancas: {
					...changes,
				},
			})
			.then((res) => {
				setMessage({ text: res.data, color: "text-green-500" });
				resetMessage();
				getCalls();
			});
	}
	function closeCall() {
		axios
			.post("/api/chamados/projetos/updateProjetos", {
				id: info._id,
				mudancas: {
					...changes,
					status: "FINALIZADO",
					fechamento: new Date().toISOString(),
				},
			})
			.then((res) => {
				setMessage({ text: res.data, color: "text-green-500" });
				resetMessage();
				getCalls();
			});
	}
	function reopenCall() {
		axios
			.post("/api/chamados/projetos/updateProjetos", {
				id: info._id,
				mudancas: {
					...changes,
					status: null,
					fechamento: null,
				},
			})
			.then((res) => {
				setMessage({ text: res.data, color: "text-green-500" });
				resetMessage();
				getCalls();
			});
	}
	function deleteCall() {
		axios
			.put("/api/chamados/projetos/updateProjetos", {
				_id: info._id,
			})
			.then((res) => {
				setMessage({ text: res.data, color: "text-green-500" });
				getCalls();
			});
	}
	useEffect(() => {
		setMessage("");
	}, [notes, responsavel]);
	console.log(changes);
	return (
		<>
			<AnimatedModalWrapper modalIsOpen={modalIsOpen} width={"40%"} height={"87%"}>
				<div className="flex h-full flex-col">
					<div className="flex items-center justify-between border-b border-gray-300 px-2 pb-2 text-lg">
						<h1 className="pl-6 font-bold uppercase text-[#15599a]">{info.tipoDoChamado}</h1>
						<h1 className="text-center text-xs italic">{info._id}</h1>
						<button>
							<VscChromeClose
								onClick={() => {
									setMessage("");
									setModalIsOpen(false);
								}}
								style={{ color: "red" }}
							/>
						</button>
					</div>
					<div className="overscroll-y overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
						<div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-300 p-2 lg:flex-row">
							<span className="font-raleway font-bold">STATUS</span>
							<div className="flex grow justify-center gap-x-2">
								{infoHolder.status == "FINALIZADO" ? (
									<p
										className={`w-fit rounded-lg border p-3 text-center text-xs font-bold hover:opacity-100 ${statusStyles["FINALIZADO"].textColor} ${statusStyles["FINALIZADO"].borderColor}`}
									>
										FINALIZADO
									</p>
								) : (
									<>
										<p
											onClick={() => {
												setChanges({ ...changes, status: "EM ANDAMENTO" });
												setInfo({ ...infoHolder, status: "EM ANDAMENTO" });
											}}
											className={`${infoHolder.status != "EM ANDAMENTO" && "opacity-30"} w-fit cursor-pointer rounded-lg border p-3 text-center text-xs font-bold hover:opacity-100 ${
												statusStyles["EM ANDAMENTO"].textColor
											} ${statusStyles["EM ANDAMENTO"].borderColor}`}
										>
											EM ANDAMENTO
										</p>
										<p
											onClick={() => {
												setChanges({
													...changes,
													status: "AGUARDANDO CONCESSIONÁRIA",
												});
												setInfo({
													...infoHolder,
													status: "AGUARDANDO CONCESSIONÁRIA",
												});
											}}
											className={`${infoHolder.status != "AGUARDANDO CONCESSIONÁRIA" && "opacity-30"} w-fit cursor-pointer rounded-lg border p-3 text-center text-xs font-bold ${
												info && statusStyles["AGUARDANDO CONCESSIONÁRIA"].textColor
											} ${info && statusStyles["AGUARDANDO CONCESSIONÁRIA"].borderColor}`}
										>
											AGUARDANDO CONCESSIONÁRIA
										</p>
									</>
								)}
							</div>
						</div>
						<div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-300 p-2 lg:flex-row">
							<span className="text-center font-raleway font-bold">PROJETO</span>
							<input
								type={"text"}
								value={infoHolder.projeto}
								className={`w-full text-center text-sm uppercase text-gray-600 outline-none`}
								onChange={(e) => {
									setChanges({ ...changes, projeto: e.target.value });
									setInfo({
										...infoHolder,
										projeto: e.target.value.toUpperCase(),
									});
								}}
							/>
						</div>
						<div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-300 p-2 lg:flex-row">
							<span className="text-center font-raleway font-bold">ABERTURA</span>
							<p className="grow text-center font-raleway">{new Date(info.abertura).toLocaleString()}</p>
						</div>
						{info.fechamento && (
							<div className="mt-4 flex flex-col items-center gap-x-2 border border-gray-300 p-2 lg:flex-row">
								<span className="text-center font-raleway font-bold">FECHAMENTO</span>
								<p className="grow text-center font-raleway">{new Date(info.fechamento).toLocaleString()}</p>
							</div>
						)}
						<div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row">
							<span className="text-center font-bold">RESPONSÁVEL</span>
							<select
								value={responsavel}
								onChange={(e) => {
									setChanges({ ...changes, responsavel: e.target.value });
									setResponsavel(e.target.value);
								}}
								className="mt-2 grow text-center text-xs outline-none lg:mt-0"
							>
								{projetistas.map((projetista) => (
									<option key={projetista.label} value={projetista.nome}>
										{projetista.label}
									</option>
								))}
							</select>
						</div>
						<div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2">
							<span className="text-center font-raleway font-bold">DESCRIÇÃO DO PROBLEMA</span>
							<input
								type={"text"}
								value={infoHolder.observacoes}
								className={`italic] min-h-[50px] w-full bg-gray-100 p-4 text-center text-sm font-bold uppercase text-gray-600 outline-none`}
								onChange={(e) => {
									setChanges({ ...changes, observacoes: e.target.value });
									setInfo({
										...infoHolder,
										observacoes: e.target.value.toUpperCase(),
									});
								}}
							/>
						</div>
						<div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2">
							<span className="text-center font-raleway font-bold">ANOTAÇÕES</span>
							<textarea
								value={infoHolder.anotacoes ? infoHolder.anotacoes : ""}
								onChange={(e) => {
									setChanges({ ...changes, anotacoes: e.target.value });
									setInfo({ ...infoHolder, anotacoes: e.target.value });
								}}
								placeholder="Digite aqui as anotações do chamado"
								className="mt-1 h-fit min-h-[100px] grow resize-none rounded bg-gray-100 p-3 text-center text-sm outline-none placeholder:italic"
							/>
						</div>
						{message.text && <p className={`text-center ${message.color} mt-2 italic`}>{message.text}</p>}
						{infoHolder.status == "FINALIZADO" ? (
							<div className="text-center">
								<button
									onClick={() => {
										setInfo({ ...infoHolder, status: "EM ANDAMENTO" });
										reopenCall();
									}}
									className="mt-4 rounded-lg bg-yellow-400 p-3 font-raleway font-bold hover:bg-[#f18701] hover:text-white"
								>
									REABRIR CHAMADO
								</button>
							</div>
						) : (
							<>
								<div className="text-center">
									<button
										onClick={() => {
											setInfo({ ...infoHolder, status: "FINALIZADO" });
											closeCall();
										}}
										className="mt-4 rounded-lg bg-green-400 p-3 font-raleway font-bold hover:bg-[#06d6a0] hover:text-white"
									>
										FINALIZAR CHAMADO
									</button>
								</div>
								<div className="mt-3 flex items-center justify-center">
									<SaveButton text={"SALVAR"} icon={<FaSave />} handleClick={() => saveCallChanges(null, "ABERTO")} />
								</div>
							</>
						)}
						<div className="mt-6 flex justify-center">
							<button onClick={deleteCall} className="rounded bg-red-300 p-2 font-bold text-white hover:bg-red-600">
								EXCLUR CHAMADO
							</button>
						</div>
					</div>
				</div>
			</AnimatedModalWrapper>
		</>
	);
}

export default ModalCallProjetos;
