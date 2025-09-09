import type React from "react";

import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { HomologationControlStatus } from "@/utils/select-options";
import { SlidersHorizontal } from "lucide-react";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";

type StatusInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};

function StatusInformation({ infoHolder, setInfoHolder, changes, setChanges }: StatusInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<SlidersHorizontal className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">CONTROLE</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label="STATUS"
						options={HomologationControlStatus}
						value={infoHolder.homologacao.status}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, status: value } }));
							setChanges((prev) => ({ ...prev, "homologacao.status": value }));
						}}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, status: "PENDENTE" } }));
							setChanges((prev) => ({ ...prev, "homologacao.status": "PENDENTE" }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="POTÊNCIA PARA HOMOLOGAÇÃO"
						placeholder="Preencha aqui a potência a ser homologada..."
						value={infoHolder.homologacao.potencia || null}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, potencia: value } }));
							setChanges((prev) => ({ ...prev, "homologacao.potencia": value }));
						}}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default StatusInformation;
