import React, { useState } from "react";
import { cidadesAtendidas, tiposSolicitacaoVisitaTecnica } from "../utils/constants";
import NumberFloatingInput from "./NumberFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
function FormVisitaTecnicaUm({ dados, setDados, images, setImages, avancar, uploadImages, sendStatus }) {
	const [msg, setMsg] = useState({
		text: "",
		color: "",
	});

	const [dadosInversores, setDadosInvesores] = useState({
		marca: "",
		qtde: 0,
		pot: 0,
	});
	const [dadosModulos, setDadosModulos] = useState({
		marca: "",
		qtde: 0,
		pot: 0,
	});
	const [arrModulos, setArrModulos] = useState([]);
	const [arrInv, setArrInv] = useState([]);
	function formatPhone(value) {
		if (!value) return "";
		value = value.replace(/\D/g, "");
		value = value.replace(/(\d{2})(\d)/, "($1) $2");
		value = value.replace(/(\d)(\d{4})$/, "$1-$2");
		return value;
	}
	async function findCPF(field) {
		axios.get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`).then((res) => {
			if (res.data.erro) {
				console.log(res.data.erro);
				return;
			} else {
				setDados({
					...dados,
					bairro: res.data.bairro,
					cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase()) ? res.data.localidade.toUpperCase() : "ITUIUTABA",
					logradouro: res.data.logradouro,
				});
			}
		});
	}
	function formatCEP(cep) {
		cep = cep
			.replace(/\D/g, "")
			.replace(/(\d{5})(\d)/, "$1-$2")
			.replace(/(-\d{3})\d+?$/, "$1");
		return cep;
	}
	function validateFields() {
		if (dados.nomeVendedor == "NÃO DEFINIDO") {
			setMsg({
				text: "Por favor, preencha o vendedor.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.telefoneVendedor.trim().length < 9) {
			setMsg({
				text: "Por favor, preencha o telefone do vendedor.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.nomeDoCliente.trim().length < 3) {
			setMsg({
				text: "Por favor, preencha o nome do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.telefoneDoCliente.trim().length < 9) {
			setMsg({
				text: "Por favor, preencha o telefone do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (!dados.codigoSVB) {
			setMsg({
				text: "Por favor, preencha o código SVB.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.cidade == "NÃO DEFINIDO") {
			setMsg({
				text: "Por favor, preencha a cidade do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.bairro.trim().length < 3) {
			setMsg({
				text: "Por favor, preencha o bairro do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.logradouro.trim().length < 3) {
			setMsg({
				text: "Por favor, preencha o logradouro do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (!dados.numeroResidencia) {
			setMsg({
				text: "Por favor, preencha o número da residência do cliente.",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.tipoDeSolicitacao != "ORÇAMENTAÇÃO") {
			if (dados.tipoInversor == "NÃO DEFINIDO") {
				setMsg({
					text: "Por favor, preencha o tipo do inversor.",
					color: "text-red-500",
				});
				return false;
			}
			if (!dados.qtdeInversor) {
				setMsg({
					text: "Por favor, preencha a quantidade de inversor(es).",
					color: "text-red-500",
				});
				return false;
			}
			if (!dados.potInversor) {
				setMsg({
					text: "Por favor, preencha a potência do(s) inversor(es).",
					color: "text-red-500",
				});
				return false;
			}
			if (dados.marcaInversor.trim().length < 2) {
				setMsg({
					text: "Por favor, preencha a marca do(s) inversor(es).",
					color: "text-red-500",
				});
				return false;
			}
			if (!dados.qtdeModulos) {
				setMsg({
					text: "Por favor, preencha a quantidade de módulos.",
					color: "text-red-500",
				});
				return false;
			}
			if (!dados.potModulos) {
				setMsg({
					text: "Por favor, preencha a potência dos módulos.",
					color: "text-red-500",
				});
				return false;
			}
			if (dados.marcaModulos.trim() < 2) {
				setMsg({
					text: "Por favor, preencha a marca dos módulos.",
					color: "text-red-500",
				});
				return false;
			}
		}

		if (dados.tipoDeLaudo == "NÃO DEFINIDO") {
			setMsg({
				text: "Por favor, preencha o tipo de laudo a ser requisitado",
				color: "text-red-500",
			});
			return false;
		}
		if (dados.tipoDeSolicitacao == "NÃO DEFINIDO") {
			setMsg({
				text: "Por favor, preencha o tipo de solicitação.",
				color: "text-red-500",
			});
			return false;
		}
		if (!images.localizacao) {
			setMsg({
				text: "Por favor, anexe um comprovante da sua localização.",
				color: "text-red-500",
			});
			return false;
		}
		setMsg({ text: "", color: "" });
		return true;
	}
	function handleConclusion() {
		if (validateFields()) {
			uploadImages();
		}
	}
	function goToNext() {
		if (validateFields()) {
			console.log(validateFields());
			avancar();
		}
	}
	function addInversor() {
		arrInv.push(dadosInversores);
		setArrInv((arrInv) => [...arrInv]);
		let marcaArr = arrInv.map((i) => i.marca);
		let qtdeArr = arrInv.map((i) => i.qtde);
		let potArr = arrInv.map((i) => i.pot);
		let joinedMarcaArr = marcaArr.join("/");
		let joinedQtdeArr = qtdeArr.join("/");
		let joinedPotArr = potArr.join("/");
		setDados({
			...dados,
			marcaInversor: joinedMarcaArr,
			qtdeInversor: joinedQtdeArr,
			potInversor: joinedPotArr,
		});
	}
	function addModulos() {
		arrModulos.push(dadosModulos);
		setArrModulos((arrModulos) => [...arrModulos]);
		let marcaArr = arrModulos.map((i) => i.marca);
		let qtdeArr = arrModulos.map((i) => i.qtde);
		let potArr = arrModulos.map((i) => i.pot);
		let joinedMarcaArr = marcaArr.join("/");
		let joinedQtdeArr = qtdeArr.join("/");
		let joinedPotArr = potArr.join("/");
		setDados({
			...dados,
			marcaModulos: joinedMarcaArr,
			qtdeModulos: joinedQtdeArr,
			potModulos: joinedPotArr,
		});
	}
	console.log(dados);
	return (
		<div className="bg-background flex w-full flex-col border border-[#15599a] p-4 shadow-lg">
			<div className="flex flex-col flex-wrap justify-around gap-2 p-2 lg:grid lg:grid-cols-3">
				<h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">SOBRE O CLIENTE</h1>
				<div className="flex items-center justify-center">
					<TextFloatingInput
						label={"NOME DO CLIENTE"}
						editable={true}
						width={"450px"}
						value={dados.nomeDoCliente}
						handleChange={(value) => setDados({ ...dados, nomeDoCliente: value.toUpperCase() })}
					/>
				</div>
				<div className="flex items-center justify-center">
					<TextFloatingInput
						label={"TELEFONE DO CLIENTE"}
						editable={true}
						width={"450px"}
						value={dados.telefoneDoCliente}
						handleChange={(value) => setDados({ ...dados, telefoneDoCliente: formatPhone(value) })}
					/>
				</div>
				<div className="flex items-center justify-center">
					<TextFloatingInput
						label={"CÓDIGO DO PROJETO SVB"}
						editable={true}
						width={"450px"}
						value={dados.codigoSVB ? dados.codigoSVB : ""}
						handleChange={(value) => setDados({ ...dados, codigoSVB: value })}
					/>
				</div>
			</div>
			<div className="mt-2 flex flex-wrap justify-around gap-2">
				<SelectFloatingInput
					label={"CIDADE"}
					editable={true}
					width={"450px"}
					value={dados.cidade}
					options={[
						{ label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
						...cidadesAtendidas.map((cidade) => {
							return { label: cidade, value: cidade };
						}),
					]}
					handleChange={(value) => setDados({ ...dados, cidade: value })}
				/>
				<TextFloatingInput
					label={"CEP"}
					editable={true}
					width={"450px"}
					value={dados.cep}
					handleChange={(value) => setDados({ ...dados, cep: formatCEP(value) })}
				/>
				<button onClick={() => findCPF()} className="flex h-[30px] items-center rounded bg-[#fead61] p-1">
					<AiOutlineSearch />
				</button>
				<TextFloatingInput
					label={"BAIRRO"}
					editable={true}
					width={"450px"}
					value={dados.bairro}
					handleChange={(value) => setDados({ ...dados, bairro: value.toUpperCase() })}
				/>
				<TextFloatingInput
					label={"LOGRADOURO"}
					editable={true}
					width={"450px"}
					value={dados.logradouro}
					handleChange={(value) => setDados({ ...dados, logradouro: value.toUpperCase() })}
				/>
				<NumberFloatingInput
					label={"N°RESIDÊNCIA"}
					editable={true}
					width={"450px"}
					value={dados.numeroResidencia}
					handleChange={(value) => setDados({ ...dados, numeroResidencia: Number(value) })}
					min={0}
					step={1}
				/>
			</div>
			<div className="mt-2 flex flex-col">
				<h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">EQUIPAMENTO</h1>
				<div className="flex w-full items-center justify-center">
					<SelectFloatingInput
						label={"TIPO DE TOPOLOGIA"}
						editable={true}
						width={"450px"}
						value={dados.tipoInversor}
						options={[
							{ label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
							{ label: "MICRO-INVERSOR", value: "MICRO-INVERSOR" },
							{ label: "INVERSOR", value: "INVERSOR" },
							{ label: "OTIMIZADOR", value: "OTIMIZADOR" },
						]}
						handleChange={(value) => setDados({ ...dados, tipoInversor: value })}
					/>
				</div>

				<div className="border-primary/20 flex flex-col border-t p-2">
					<h1 className="mt-2 text-center text-sm font-bold text-[#15599a]">ADICIONE MICRO/INVERSORES</h1>
					<div className="mb-1 flex flex-col px-2">
						<p className="text-center text-xs italic">Você agora pode adicionar micro/inversores de potência e/ou marca diferentes.</p>
						<p className="text-center text-xs font-bold text-[#fead61] italic">Preencha as informações do micro/inversor e clique em adicionar.</p>
					</div>

					<div className="mt-3 flex flex-col gap-x-2 gap-y-1 lg:grid lg:grid-cols-4">
						<div className="flex items-center justify-center">
							<TextFloatingInput
								label={"MARCA DO INVERSOR/MICRO"}
								editable={true}
								value={dadosInversores.marca}
								handleChange={(value) =>
									setDadosInvesores({
										...dadosInversores,
										marca: value.toUpperCase(),
									})
								}
							/>
						</div>
						<div className="flex items-center justify-center">
							<NumberFloatingInput
								label={"QTDE INVERSOR/MICRO"}
								editable={true}
								value={dadosInversores.qtde}
								handleChange={(value) => setDadosInvesores({ ...dadosInversores, qtde: value })}
								min={0}
								step={1}
							/>
						</div>
						<div className="flex items-center justify-center">
							<NumberFloatingInput
								label={"POTÊNCIA INVERSOR/MICRO"}
								unit={"W"}
								editable={true}
								value={dadosInversores.pot}
								handleChange={(value) => setDadosInvesores({ ...dadosInversores, pot: value })}
							/>
						</div>
						<div className="flex items-center justify-center">
							<div
								onClick={addInversor}
								className="flex h-fit cursor-pointer items-center justify-center rounded bg-green-300 p-2 text-white hover:bg-green-500"
							>
								<MdOutlineAddCircle style={{ fontSize: "15px" }} />
							</div>
						</div>
					</div>
				</div>
				{arrInv.length > 0 && (
					<div className="mt-2 flex flex-col font-bold">
						<h1 className="text-center text-xs text-[#15599a]">INVERSORES ADICIONADOS</h1>
						{arrInv.map((inv, index) => (
							<div key={index} className="my-1 flex items-center justify-around">
								<p className="text-xs font-bold">{inv.marca}</p>
								<p className="text-xs font-bold">{inv.qtde} UN</p>
								<p className="text-xs font-bold">{inv.pot} W</p>
								<button
									onClick={() => {
										let arr = arrInv;
										arr.splice(index, 1);
										let marcaArr = arrInv.map((i) => i.marca);
										let qtdeArr = arrInv.map((i) => i.qtde);
										let potArr = arrInv.map((i) => i.pot);
										let joinedMarcaArr = marcaArr.join("/");
										let joinedQtdeArr = qtdeArr.join("/");
										let joinedPotArr = potArr.join("/");
										setDados({
											...dados,
											marcaInversor: joinedMarcaArr,
											qtdeInversor: joinedQtdeArr,
											potInversor: joinedPotArr,
										});
										setArrInv([...arr]);
									}}
									className="rounded bg-red-500 p-1"
								>
									<FiDelete />
								</button>
							</div>
						))}
					</div>
				)}
				{dados.tipoInversor == "OTIMIZADOR" && (
					<div className="mt-2 flex flex-wrap justify-around gap-2 p-2">
						<TextFloatingInput
							label={"MARCA DO OTIMIZADOR"}
							editable={true}
							value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
							handleChange={(value) => setDados({ ...dados, marcaOtimizador: value.toUpperCase() })}
						/>
						<NumberFloatingInput
							label={"QTDE DE OTIMIZADORES"}
							editable={true}
							value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
							handleChange={(value) => setDados({ ...dados, qtdeOtimizador: Number(value) })}
							min={0}
							step={1}
						/>
						<NumberFloatingInput
							label={"POTÊNCIA DO(S) OTIMIZADOR(ES"}
							unit={"W"}
							editable={true}
							value={dados.potOtimizador ? dados.potOtimizador : null}
							handleChange={(value) => setDados({ ...dados, potOtimizador: Number(value) })}
						/>
					</div>
				)}
				<div className="border-primary/20 flex flex-col border-t p-2">
					<h1 className="mt-2 text-center text-sm font-bold text-[#15599a]">ADICIONE MÓDULOS</h1>
					<div className="mb-1 flex flex-col px-2">
						<p className="text-center text-xs italic">Você agora pode adicionar módulos de potência e/ou marca diferentes.</p>
						<p className="text-center text-xs font-bold text-[#fead61] italic">Preencha as informações do módulos e clique em adicionar.</p>
					</div>
					<div className="mt-3 flex flex-col gap-x-2 gap-y-1 lg:grid lg:grid-cols-4">
						<div className="flex items-center justify-center">
							<TextFloatingInput
								label={"MARCA DOS MÓDULOS"}
								editable={true}
								value={dadosModulos.marca}
								handleChange={(value) =>
									setDadosModulos({
										...dadosModulos,
										marca: value.toUpperCase(),
									})
								}
							/>
						</div>
						<div className="flex items-center justify-center">
							<NumberFloatingInput
								label={"Nº DE MÓDULOS"}
								editable={true}
								value={dadosModulos.qtde}
								handleChange={(value) => setDadosModulos({ ...dadosModulos, qtde: Number(value) })}
								min={0}
								step={1}
							/>
						</div>
						<div className="flex items-center justify-center">
							<NumberFloatingInput
								label={"POTÊNCIA DOS MÓDULOS"}
								unit={"W"}
								editable={true}
								value={dadosModulos.pot}
								handleChange={(value) => setDadosModulos({ ...dadosModulos, pot: Number(value) })}
							/>
						</div>
						<div className="flex items-center justify-center">
							<div
								onClick={addModulos}
								className="flex h-fit cursor-pointer items-center justify-center rounded bg-green-300 p-2 text-white hover:bg-green-500"
							>
								<MdOutlineAddCircle style={{ fontSize: "15px" }} />
							</div>
						</div>
					</div>
				</div>
				{arrModulos.length > 0 && (
					<div className="mt-2 flex flex-col font-bold">
						<h1 className="text-center text-xs text-[#15599a]">MÓDULOS ADICIONADOS</h1>
						{arrModulos.map((inv, index) => (
							<div key={index} className="mt-3 flex flex-col gap-x-2 gap-y-1 lg:grid lg:grid-cols-4">
								<p className="text-center text-xs font-bold">{inv.marca}</p>
								<p className="text-center text-xs font-bold">{inv.qtde} UN</p>
								<p className="text-center text-xs font-bold">{inv.pot} W</p>
								<div className="flex items-center justify-center">
									<button
										onClick={() => {
											let arr = arrModulos;
											arr.splice(index, 1);
											let marcaArr = arrModulos.map((i) => i.marca);
											let qtdeArr = arrModulos.map((i) => i.qtde);
											let potArr = arrModulos.map((i) => i.pot);
											let joinedMarcaArr = marcaArr.join("/");
											let joinedQtdeArr = qtdeArr.join("/");
											let joinedPotArr = potArr.join("/");
											setDados({
												...dados,
												marcaModulos: joinedMarcaArr,
												qtdeModulos: joinedQtdeArr,
												potModulos: joinedPotArr,
											});
											setArrModulos([...arr]);
										}}
										className="rounded bg-red-500 p-1"
									>
										<FiDelete />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<div className="mt-2 flex w-full flex-col items-center self-center px-2">
				<span className="font-raleway text-center text-sm font-bold uppercase">OBSERVAÇÕES PARA VISITA</span>
				<textarea
					placeholder={"Descrição aqui.."}
					value={dados.obsVisita}
					onChange={(e) => setDados({ ...dados, obsVisita: e.target.value })}
					className="border-primary/80 h-[80px] w-full resize-none border bg-gray-200 p-2 text-center outline-hidden"
				/>
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-2">
				<SelectFloatingInput
					label={"TIPO DE LAUDO"}
					editable={true}
					width={"450px"}
					value={dados.tipoDeLaudo}
					options={[
						{ label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
						{
							label: "ESTUDO SIMPLES (36 HORAS)",
							value: "ESTUDO SIMPLES (36 HORAS)",
						},
						{
							label: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
							value: "ESTUDO INTERMEDIÁRIO (48 HORAS)",
						},
						{
							label: "ESTUDO COMPLEXO (72 HORAS)",
							value: "ESTUDO COMPLEXO (72 HORAS)",
						},
					]}
					handleChange={(value) => setDados({ ...dados, tipoDeLaudo: value })}
				/>
				<SelectFloatingInput
					label={"TIPO DE SOLICITAÇÃO"}
					editable={true}
					width={"450px"}
					value={dados.tipoDeSolicitacao}
					options={tiposSolicitacaoVisitaTecnica}
					handleChange={(value) => setDados({ ...dados, tipoDeSolicitacao: value })}
				/>
			</div>
			<div className="flex w-fit flex-col items-center self-center">
				<label className="ml-2 text-center font-bold text-[#15599a]" htmlFor="propostaComercial">
					PRINT A TELA E ENVIE SUA LOCALIZAÇÃO
				</label>
				<div className="bg-primary/20 relative mt-2 flex h-fit items-center justify-center rounded-lg border-2 border-dotted border-blue-700 p-2">
					<div className="absolute">
						{images.localizacao ? (
							<div className="flex flex-col items-center">
								<i className="fa fa-folder-open fa-4x text-blue-700"></i>
								<span className="block text-center font-normal text-gray-400">{images.localizacao.file.name}</span>
							</div>
						) : (
							<div className="flex flex-col items-center">
								<i className="fa fa-folder-open fa-4x text-blue-700"></i>
								<span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
							</div>
						)}
					</div>
					<input
						onChange={(e) =>
							setImages({
								...images,
								localizacao: {
									title: "LOCALIZAÇÃO",
									file: e.target.files[0],
								},
							})
						}
						className="h-full w-full opacity-0"
						type="file"
						accept=".png, .jpeg, .pdf, .tif, .tiff, .jpg, .raw"
					/>
				</div>
			</div>
			{msg.text && <p className={`text-center text-sm italic ${msg.color}`}>{msg.text}</p>}
			{["VISITA TÉCNICA IN LOCO - URBANA", "ALTERAÇÃO DE PROJETO", "AUMENTO DE SISTEMA AMPÈRE", "VISITA TÉCNICA IN LOCO - RURAL"].includes(
				dados.tipoDeSolicitacao,
			) ? (
				<div className="mt-3 flex items-center justify-center">
					<button
						disabled={sendStatus == "loading"}
						onClick={handleConclusion}
						className="disabled:bg-primary/60 w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white"
					>
						{sendStatus == "loading" ? "CARREGANDO" : "ENVIAR FORMULÁRIO"}
					</button>
				</div>
			) : (
				<div className="mt-3 flex items-center justify-center">
					<button onClick={goToNext} className="w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white">
						PRÓXIMA ETAPA
					</button>
				</div>
			)}
		</div>
	);
}

export default FormVisitaTecnicaUm;
