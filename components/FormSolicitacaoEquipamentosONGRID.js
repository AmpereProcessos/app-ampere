import React, { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import { MdOutlineAddCircle } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import SelectFoatingInput from "./SelectFloatingInput";
function FormSolicitacaoEquipamentosONGRID({ avancar, setDados, dados, voltar }) {
	const [message, setMessage] = useState("");
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
	function validarCamposObrigatorios() {
		if (dados.topologia == "NÃO DEFINIDO") {
			setMessage("Por favor, preencha uma topologia válida.");
			return false;
		}
		if (dados.marcaInversor.trim().length == 0) {
			setMessage("Por favor, preencha uma marca de inversor válida.");
			return false;
		}
		if (dados.qtdeInversor == null || dados.qtdeInversor <= 0) {
			setMessage("Por favor, preencha uma quantidade de inversor(es) válida");
			return false;
		}
		if (dados.potInversor == null || dados.potInversor <= 0) {
			setMessage("Por favor, preencha uma potência de inversor válida.");
			return false;
		}
		if (dados.topologia == "OTIMIZADOR" && (dados.marcaOtimizador == null || dados.marcaOtimizador.trim().length == 0)) {
			setMessage("Por favor, preencha uma marca de otimizador válida");
			return false;
		}
		if (dados.topologia == "OTIMIZADOR" && (dados.qtdeOtimizador == 0 || dados.qtdeOtimizador == null)) {
			setMessage("Por favor, preencha uma quantidade de otimizador válida");
			return false;
		}
		if (dados.topologia == "OTIMIZADOR" && (dados.potOtimizador == 0 || dados.potOtimizador == null)) {
			setMessage("Por favor, preencha uma potência de otimizador válida");
			return false;
		}
		if (dados.marcaModulos.trim().length < 2) {
			setMessage("Por favor,preencha uma marca de módulos válida");
			return false;
		}
		if (dados.qtdeModulos == null || dados.qtdeModulos <= 0) {
			setMessage("Por favor, preencha uma quantidade módulos válida");
			return false;
		}
		if (dados.potModulos == null || dados.potModulos <= 0) {
			setMessage("Por favor, preencha uma potência de módulos válida");
			return false;
		}
		setMessage("");
		return true;
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
	function proximaEtapa() {
		if (validarCamposObrigatorios()) {
			avancar();
		}
	}
	return (
		<div className="flex w-full flex-col border border-[#15599a] bg-[#fff] pb-2 shadow-lg">
			<span className="py-2 text-center text-sm font-bold uppercase text-[#15599a]">DADOS DO SISTEMA</span>
			<div className="my-2 flex justify-center p-2">
				<SelectFoatingInput
					label={"TOPOLOGIA"}
					editable={true}
					value={dados.topologia}
					handleChange={(value) => setDados({ ...dados, topologia: value })}
					options={[
						{
							label: "MICRO-INVERSOR",
							value: "MICRO-INVERSOR",
						},
						{
							label: "INVERSOR",
							value: "INVERSOR",
						},
						{
							label: "OTIMIZADOR",
							value: "OTIMIZADOR",
						},
						{
							label: "NÃO DEFINIDO",
							value: "NÃO DEFINIDO",
						},
					]}
				/>
			</div>
			<div className="flex flex-col border-t border-gray-300 p-2">
				<h1 className="mt-2 text-center text-sm font-bold text-[#15599a]">ADICIONE MICRO/INVERSORES</h1>
				<div className="mb-1 flex flex-col px-2">
					<p className="text-center text-xs italic">Você agora pode adicionar micro/inversores de potência e/ou marca diferentes.</p>
					<p className="text-center text-xs font-bold italic text-[#fead61]">Preencha as informações do micro/inversor e clique em adicionar.</p>
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
						<div onClick={addInversor} className="flex h-fit cursor-pointer items-center justify-center rounded bg-green-300 p-2 text-white hover:bg-green-500">
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

			{dados.topologia == "OTIMIZADOR" && (
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
			<div className="flex flex-col border-t border-gray-300 p-2">
				<h1 className="mt-2 text-center text-sm font-bold text-[#15599a]">ADICIONE MÓDULOS</h1>
				<div className="mb-1 flex flex-col px-2">
					<p className="text-center text-xs italic">Você agora pode adicionar módulos de potência e/ou marca diferentes.</p>
					<p className="text-center text-xs font-bold italic text-[#fead61]">Preencha as informações do módulos e clique em adicionar.</p>
				</div>
				<div className="mt-3 flex flex-col gap-x-2 gap-y-1 lg:grid lg:grid-cols-4">
					<div className="flex items-center justify-center">
						<TextFloatingInput
							label={"MARCA DOS MÓDULOS"}
							editable={true}
							value={dadosModulos.marca}
							handleChange={(value) => setDadosModulos({ ...dadosModulos, marca: value.toUpperCase() })}
						/>
					</div>
					<div className="flex items-center justify-center">
						<NumberFloatingInput label={"Nº DE MÓDULOS"} editable={true} value={dadosModulos.qtde} handleChange={(value) => setDadosModulos({ ...dadosModulos, qtde: Number(value) })} />
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
						<div onClick={addModulos} className="flex h-fit cursor-pointer items-center justify-center rounded bg-green-300 p-2 text-white hover:bg-green-500">
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

			{message && <p className="text-center italic text-red-400">{message}</p>}
			<div className="mt-2 flex w-full flex-wrap justify-center gap-2">
				<button onClick={voltar} className="rounded bg-[#15599a] p-2 font-bold text-white">
					VOLTAR
				</button>
				<button onClick={proximaEtapa} className="w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white ">
					PRÓXIMA ETAPA
				</button>
			</div>
		</div>
	);
}

export default FormSolicitacaoEquipamentosONGRID;
