import React, { useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import Select from "react-select";
import NumberFloatingInput from "../../NumberFloatingInput";
import TextFloatingInput from "../../TextFloatingInput";

function AddMaterialFormulario({ materials, materialsFetching, addMaterial }) {
	const [mode, setMode] = useState("ESTOCÁVEIS"); // ESTOCÁVEIS | NÃO ESTOCÁVEIS

	const [infoHolder, setInfoHolder] = useState({
		nome: "",
		id: null,
		qtdeSaida: null,
		qtdeEstoque: null,
		grandeza: "",
		precoUnit: null,
	});
	function resetState() {
		setInfoHolder({
			nome: "",
			id: null,
			qtdeSaida: null,
			grandeza: "",
			precoUnit: null,
		});
	}
	console.log(infoHolder);
	return (
		<div className="flex flex-col w-full gap-2 mt-2">
			<div className="flex items-center justify-center w-full gap-2">
				<button
					onClick={() => {
						resetState();
						setMode("ESTOCÁVEIS");
					}}
					className={`text-center p-2 rounded w-fit border border-[#15599a] font-bold ${mode == "ESTOCÁVEIS" ? "bg-[#15599a] text-white" : "bg-transparent text-[#15599a]"} `}
				>
					ESTOCÁVEIS
				</button>
				<button
					onClick={() => {
						resetState();
						setMode("NÃO ESTOCÁVEIS");
					}}
					className={`text-center p-2 rounded w-fit border border-[#fead41] font-bold ${mode == "NÃO ESTOCÁVEIS" ? "bg-[#fead41] text-white" : "bg-transparent text-[#fead41]"} `}
				>
					NÃO ESTOCÁVEIS
				</button>
			</div>
			{mode == "ESTOCÁVEIS" ? (
				<div className="flex flex-col lg:flex-row items-center w-full gap-4 lg:gap-2 mt-2">
					<div className="w-full lg:w-[50%]">
						<Select
							isMulti={false}
							placeholder="MATERIAL"
							styles={{
								control: (base, state) => ({
									...base,
									width: "100%",
									minHeight: "41px",
								}),
							}}
							onChange={(e) =>
								setInfoHolder((prev) => ({
									...prev,
									nome: e.value.nome,
									id: e.value.id,
									precoUnit: e.value.preco,
									grandeza: e.value.grandeza,
									qtdeEstoque: e.value.qtdeEstoque,
								}))
							}
							isLoading={materialsFetching}
							loadingMessage={"Carregando..."}
							options={materials?.map((material) => {
								return {
									label: material.nome,
									value: {
										id: material._id,
										nome: material.nome,
										preco: material.preco,
										grandeza: material.grandeza,
										qtdeEstoque: material.qtde,
									},
								};
							})}
						/>
					</div>
					<input
						placeholder="QTDE"
						type="number"
						value={infoHolder.qtdeSaida}
						className="outline-none text-center border border-gray-300 w-full lg:w-[30%] h-[41px]"
						onChange={(e) =>
							setInfoHolder((prev) => ({
								...prev,
								qtdeSaida: Number(e.target.value),
								qtdeDevolucao: 0,
							}))
						}
					/>
					<div
						onClick={() => {
							if (addMaterial(infoHolder)) resetState();
							// addMaterial(infoHolder);
							// resetState();
						}}
						className="cursor-pointer h-[41px] w-full lg:w-[20%] flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
					>
						<MdOutlineAddCircle style={{ fontSize: "25px" }} />
					</div>
				</div>
			) : null}
			{mode == "NÃO ESTOCÁVEIS" ? (
				<div className="flex flex-col lg:flex-row items-center w-full gap-4 lg:gap-2 mt-2">
					<div className="w-full lg:w-[50%]">
						<TextFloatingInput
							label={"NOME OU DESCRIÇÃO"}
							editable={true}
							value={infoHolder.nome}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
							width={"100%"}
							marginBottom={"0px"}
						/>
					</div>
					<div className="w-full lg:w-[10%]">
						<TextFloatingInput
							label={"GRANDEZA"}
							editable={true}
							value={infoHolder.grandeza}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grandeza: value }))}
							width={"100%"}
							marginBottom={"0px"}
						/>
					</div>
					<div className="w-full lg:w-[10%]">
						<NumberFloatingInput
							label={"PREÇO UNITÁRIO"}
							editable={true}
							value={infoHolder.precoUnit}
							handleChange={(value) =>
								setInfoHolder((prev) => ({
									...prev,
									precoUnit: Number(value),
								}))
							}
							width={"100%"}
							marginBottom={"0px"}
						/>
					</div>
					<div className="w-full lg:w-[10%]">
						<NumberFloatingInput
							label={"QUANTIDADE"}
							editable={true}
							value={infoHolder.qtdeSaida}
							handleChange={(value) =>
								setInfoHolder((prev) => ({
									...prev,
									qtdeSaida: Number(value),
								}))
							}
							width={"100%"}
							marginBottom={"0px"}
						/>
					</div>
					<button
						onClick={() => {
							addMaterial(infoHolder);
						}}
						className="cursor-pointer h-[41px] w-full lg:w-[20%] flex justify-center items-center bg-green-300 hover:bg-green-500 text-white rounded font-bold col-span-1"
					>
						<MdOutlineAddCircle style={{ fontSize: "25px" }} />
					</button>
				</div>
			) : null}
		</div>
	);
}

export default AddMaterialFormulario;
