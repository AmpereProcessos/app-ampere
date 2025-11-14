import axios from "axios";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import SaveButton from "./utils/Buttons/SaveButton";
function EntregaTecnicaPresencialCard({ info }) {
	const [changes, setChanges] = useState({});
	const [message, setMessage] = useState({ text: "", color: "" });
	console.log(changes);
	function getBorderColor(trocaMedidor) {
		if (dayjs().diff(new Date(trocaMedidor), "days") > 40) {
			return { borderColor: "border-2 border-red-500" };
		} else if (dayjs(trocaMedidor).diff(new Date(), "days") > 30) {
			return { borderColor: "border-2 border-orange-500" };
		} else {
			return { borderColor: "border border-[#15599a]" };
		}
	}
	async function saveChanges() {
		axios
			.post(`/api/projects/update/${info._id}`, changes)
			.then((res) => setMessage({ text: "Alteração feitas!", color: "text-green-500" }))
			.catch((err) =>
				setMessage({
					text: "Houve um erro na efetiviação da alteração, por favor tente novamente.",
					color: "text-red-500",
				}),
			);
	}
	return (
		<div className={`flex w-full flex-col p-4 ${getBorderColor(info.medidor.data).borderColor}`}>
			<div className="flex flex-wrap items-center justify-center gap-2 lg:justify-between">
				<h1 className="text-center font-bold text-[#15599a]">
					#{info.qtde} - {info.nomeDoContrato}
				</h1>
				<div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
					<div className="flex flex-col items-center">
						<h1 className="text-primary/70 text-center font-bold">DIAS DESDE TROCA DO MEDIDOR</h1>
						<h1 className="text-primary/80 text-center">{info.medidor?.data ? dayjs().diff(new Date(info.medidor.data), "days") : "-"}</h1>
					</div>
					<div className="flex flex-col items-center">
						<h1 className="text-primary/70 text-center font-bold">VENDEDOR</h1>
						<h1 className="text-primary/80 text-center">{info.vendedor.nome}</h1>
					</div>
					<div className="flex flex-col items-center">
						<h1 className="text-primary/70 text-center font-bold">CIDADE</h1>
						<h1 className="text-primary/80 text-center">{info.cidade}</h1>
					</div>
					<div className="flex flex-col items-center">
						<h1 className="text-primary/70 text-center font-bold">TOPOLOGIA</h1>
						<h1 className="text-primary/80 text-center">{info.sistema.topologia}</h1>
					</div>
					<div className="flex flex-col items-center">
						<h1 className="text-primary/70 text-center font-bold">ENTREGA TÉCNICA FEITA?</h1>
						<div className="flex">
							<input
								checked={changes["jornada.entregaTecnicaPresencial"]}
								onChange={(e) =>
									setChanges({
										...changes,
										"jornada.entregaTecnicaPresencial": e.target.checked,
										"jornada.dataEntregaTecnicaPresencial": e.target.checked ? new Date().toISOString() : null,
									})
								}
								type={"checkbox"}
							/>
							<label className="ml-4">{changes["jornada.entregaTecnicaPresencial"] ? "SIM" : "NÃO"}</label>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<SaveButton text={"SALVAR"} icon={<FaSave />} handleClick={saveChanges} />
					</div>
				</div>
			</div>
			{message.text && <p className={`text-center italic ${message.color}`}>{message.text}</p>}
		</div>
	);
}

export default EntregaTecnicaPresencialCard;
