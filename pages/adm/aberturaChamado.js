import Image from "next/image";
import React, { useState, useEffect } from "react";
import Logo from "../../utils//images/logo-texto-azul-vertical.png";
import Select from "react-select";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "../../components/utils/LoadingPage";
function AberturaChamadoADM() {
	const router = useRouter();
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/auth/signin");
		},
	});

	const [clients, setClients] = useState([]);
	const [callInfo, setCallInfo] = useState({
		nomeCliente: null,
		codigoProjeto: null,
		demanda: "NÃO DEFINIDO",
		servico: "",
		observacoes: "",
		valor: null,
	});
	const [msg, setMsg] = useState({
		text: "",
		color: "",
	});
	function getClients() {
		axios.get("/api/projects/todos").then((res) => setClients(res.data));
	}
	function getText(value) {
		if (value == "PAGAMENTO") {
			return "VALOR A SER PAGO";
		} else if (value == "COBRANÇA") {
			return "VALOR A COBRAR";
		} else {
			return "VALOR";
		}
	}
	useEffect(() => {
		if (session?.user) {
			getClients();
		}
	}, [session]);
	function createCall() {
		if (validateInputs()) {
			axios
				.post("/api/chamados/adm/mainData", {
					...callInfo,
					usuarioEmissor: session.user.nome,
				})
				.then((res) => {
					setCallInfo({
						...callInfo,
						demanda: "NÃO DEFINIDO",
						servico: "",
						observacoes: "",
						valor: 0,
					});
					setMsg({ text: "Chamado criado", color: "text-green-500" });
				});
		}
	}
	function validateInputs() {
		if (!callInfo.nomeCliente) {
			setMsg({
				text: "Por favor, preencha o nome do cliente",
				color: "text-red-500",
			});
			return false;
		}
		if (callInfo.demanda == "NÃO DEFINIDO") {
			setMsg({
				text: "Por favor, preencha o tipo de demanda",
				color: "text-red-500",
			});
			return false;
		}
		if (!callInfo.valor) {
			setMsg({ text: "Por favor, preencha o valor", color: "text-red-500" });
			return false;
		}
		if (callInfo.servico.trim().length < 4) {
			setMsg({
				text: "Por favor, preencha o serviço prestado",
				color: "text-red-500",
			});
			return false;
		}
		if (callInfo.demanda == "PAGAMENTO" && callInfo.nomeRecebedor.trim().length < 3) {
			setMsg({
				text: "Por favor, preencha o nome do recebedor",
				color: "text-red-500",
			});
		}
		return true;
	}
	console.log(callInfo);
	if (status == "loading") return <LoadingPage />;
	if (status == "authenticated") {
		return (
			<section className="flex min-h-[100vh] items-center justify-center bg-[#fff]">
				<div className="flex w-[40%] flex-col items-center rounded border border-[#15599a] bg-[#fff] p-4">
					<h1 className="mt-2 text-center font-bold text-[#15599a]">ABERTURA DE CHAMADOS - FINANCEIRO</h1>
					<div className="mt-2 grid w-full grid-cols-1 grid-rows-2 items-center lg:grid-cols-2 lg:grid-rows-1">
						<span className="font-bold">NOME DO CLIENTE</span>
						<div className={"grow"}>
							<Select
								isMulti={false}
								placeholder="NOME DO CLIENTE"
								onChange={(e) =>
									setCallInfo({
										...callInfo,
										nomeCliente: e.value.nome,
										codigoProjeto: e.value.qtde,
									})
								}
								options={clients.map((cliente) => {
									return {
										label: cliente.nomeDoContrato,
										value: {
											qtde: cliente.qtde,
											nome: cliente.nomeDoContrato,
										},
									};
								})}
							/>
						</div>
					</div>
					<div className="mt-2 grid w-full grid-cols-1 grid-rows-2 items-center lg:grid-cols-2 lg:grid-rows-1">
						<span className="font-bold">DEMANDA</span>
						<select
							value={callInfo.demanda}
							onChange={(e) => setCallInfo({ ...callInfo, demanda: e.target.value })}
							className="h-[36px] grow border border-gray-300 text-center outline-none"
						>
							<option>PAGAMENTO</option>
							<option>COBRANÇA</option>
							<option>NÃO DEFINIDO</option>
						</select>
					</div>
					<div className="mt-2 grid w-full grid-cols-1 grid-rows-2 items-center lg:grid-cols-2 lg:grid-rows-1">
						<span className="font-bold">SERVIÇO</span>
						<input
							value={callInfo.servico}
							onChange={(e) =>
								setCallInfo({
									...callInfo,
									servico: e.target.value.toUpperCase(),
								})
							}
							className="font-sm h-[36px] border border-gray-300 p-2 text-center outline-none"
						/>
					</div>
					<div className="mt-2 grid w-full grid-cols-1 grid-rows-2 items-center lg:grid-cols-2 lg:grid-rows-1">
						<span className="font-bold">{getText(callInfo.demanda)}</span>
						<input
							type={"number"}
							value={callInfo.valor}
							onChange={(e) =>
								setCallInfo({
									...callInfo,
									valor: Number(e.target.value),
								})
							}
							className="font-sm h-[36px] border border-gray-300 p-2 text-center outline-none"
						/>
					</div>
					{callInfo.demanda == "PAGAMENTO" && (
						<div className="mt-2 grid w-full grid-cols-1 grid-rows-2 items-center lg:grid-cols-2 lg:grid-rows-1">
							<span className="font-bold">NOME DO RECEBEDOR</span>
							<input
								value={callInfo.nomeRecebedor ? callInfo.nomeRecebedor : ""}
								onChange={(e) =>
									setCallInfo({
										...callInfo,
										nomeRecebedor: e.target.value.toUpperCase(),
									})
								}
								className="font-sm h-[36px] border border-gray-300 p-2 text-center outline-none"
							/>
						</div>
					)}
					<div className="mt-1 grid w-full grid-cols-1 grid-rows-2 items-center">
						<span className="text-center font-bold">OBSERVAÇÕES</span>
						<textarea
							value={callInfo.observacoes}
							placeholder={"OBSERVAÇÕES ADICIONAIS AQUI..."}
							onChange={(e) =>
								setCallInfo({
									...callInfo,
									observacoes: e.target.value.toUpperCase(),
								})
							}
							className="font-sm resize-none border border-gray-300 bg-gray-100 p-2 text-center outline-none"
						/>
					</div>
					{msg.text && <p className={`${msg.color} my-1 italic`}>{msg.text}</p>}
					<div className="mt-2 flex justify-center">
						<button onClick={createCall} className="rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white">
							ABRIR CHAMADO
						</button>
					</div>
				</div>
			</section>
		);
	}
}

export default AberturaChamadoADM;
