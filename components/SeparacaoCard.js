import React, { useState } from "react";
import SelectInput from "./SelectInput";
import { FaSave } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
function SeparacaoCard({ info, editor }) {
	const [infoHolder, setInfo] = useState(info);
	const [changes, setChanges] = useState({});
	const [materialInfoVisible, setMaterialInfoVisible] = useState(false);
	const [msg, setMsg] = useState({
		text: "",
		color: "",
	});
	function handleChanges() {
		axios.post(`/api/projects/update/${info._id}`, changes).then((res) =>
			setMsg({
				text: "Alterações feitas",
				color: "text-green-500",
			}),
		);
	}
	return (
		<div className="flex flex-col border border-gray-300 p-2 w-full">
			<div className="flex items-center pb-2 border-b border-gray-300">
				<h1 className="font-bold uppercase mr-2">
					<strong className="text-[#15599a]">({infoHolder.qtde})</strong> {infoHolder.nomeDoContrato}
				</h1>
				<div className="flex flex-wrap justify-around gap-2 grow">
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">EQUIPE</p>
						<p className="text-gray-600 text-xs">{infoHolder.obra.equipeResp ? infoHolder.obra.equipeResp : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">CIDADE</p>
						<p className="text-gray-600 text-xs">{infoHolder.cidade ? infoHolder.cidade : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">TOPOLOGIA</p>
						<p className="text-gray-600 text-xs">{infoHolder.sistema.topologia ? infoHolder.sistema.topologia : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">Nº DE MÓDULOS</p>
						<p className="text-gray-600 text-xs">{infoHolder.sistema.qtdeModulos ? infoHolder.sistema.qtdeModulos : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">POT. MÓDULOS</p>
						<p className="text-gray-600 text-xs">{infoHolder.sistema.potModulos ? infoHolder.sistema.potModulos : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">INFO MICRO/INVERSOR</p>
						<p className="text-gray-600 text-xs">{infoHolder.sistema.inversor ? infoHolder.sistema.inversor : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">TIPO ESTRUTURA</p>
						<p className="text-gray-600 text-xs">{infoHolder.estruturaPersonalizada.tipo ? infoHolder.estruturaPersonalizada.tipo : "-"}</p>
					</div>
					<div className="flex items-center flex-col">
						<p className="text-gray-600 font-bold text-sm">TIPO TELHA</p>
						<p className="text-gray-600 text-xs uppercase">{infoHolder.visitaTecnica.tipoDaTelha ? infoHolder.visitaTecnica.tipoDaTelha : "-"}</p>
					</div>
				</div>
			</div>
			<div className="flex justify-center items-center gap-x-2 py-2">
				<span className="text-sm text-center font-bold text-[#15599a] uppercase">INFO MATERIAL</span>
				<button onClick={() => setMaterialInfoVisible(!materialInfoVisible)} className="px-1 h-[20px] rounded bg-[#fead41] mb-2 hover:bg-[#15599a] hover:text-white">
					<AiFillEye />
				</button>
			</div>
			{materialInfoVisible && (
				<div className="w-full flex items-center justify-center gap-x-4">
					<div className="flex flex-col w-[450px] self-center mt-2 items-center">
						<span className="uppercase font-bold font-raleway text-center text-sm">INFORMAÇÕES DO KIT</span>
						<textarea
							readOnly={true}
							value={infoHolder.compra.kitInfo ? infoHolder.compra.kitInfo : ""}
							placeholder={"Observações do material aqui..."}
							onChange={(e) => {
								setChanges({
									...changes,
									"compra.kitInfo": e.target.value,
								});
								setInfo({
									...infoHolder,
									compra: {
										...infoHolder.compra,
										kitInfo: e.target.value,
									},
								});
							}}
							className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
						/>
					</div>
					<div className="flex flex-col w-[450px] self-center mt-2 items-center">
						<span className="uppercase font-bold font-raleway text-center text-sm">MATERIAL FALTANTE</span>
						<textarea
							readOnly={true}
							value={infoHolder.material.materialFaltante ? infoHolder.material.materialFaltante : ""}
							placeholder={"Observações do material aqui..."}
							onChange={(e) => {
								setChanges({
									...changes,
									"material.materialFaltante": e.target.value,
								});
								setInfo({
									...infoHolder,
									material: {
										...infoHolder.material,
										materialFaltante: e.target.value,
									},
								});
							}}
							className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
						/>
					</div>
				</div>
			)}

			<div className="flex items-center justify-around py-2">
				<SelectInput
					label={"STATUS DA SEPARAÇÃO"}
					editable={editor}
					value={infoHolder.material.statusSeparacao ? infoHolder.material.statusSeparacao : "NÃO DEFINIDO"}
					handleChange={(value) => {
						setChanges({ ...changes, "material.statusSeparacao": value });
						setInfo({
							...infoHolder,
							material: { ...infoHolder.material, statusSeparacao: value },
						});
					}}
					options={[
						{
							label: "INICIAR SEPARAÇÃO",
							value: "INICIAR SEPARAÇÃO",
						},
						{
							label: "SEPARADO",
							value: "SEPARADO",
						},
						{
							label: "NÃO DEFINIDO",
							value: "NÃO DEFINIDO",
						},
					]}
				/>
			</div>
			{msg.text && <p className={`${msg.color} italic text-center`}>{msg.text}</p>}
			<div className="flex justify-center">
				<SaveButton text={"Salvar alterações"} icon={<FaSave />} handleClick={handleChanges} />
			</div>
		</div>
	);
}

export default SeparacaoCard;
