import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import type { Dispatch, SetStateAction } from "react";

import CheckboxWithDate from "../inputs/CheckboxWithDate";
import SelectInput from "../inputs/Select";
import { EngineeringProjectStatus } from "@/utils/select-options";

type PendenciesInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: Dispatch<SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
};
function PendenciesInformation({ infoHolder, setInfoHolder, changes, setChanges }: PendenciesInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">CONTROLE</h1>
			<div className="w-full flex  items-center justify-center">
				<SelectInput
					label="STATUS DO PROJETO (ENGENHARIA)"
					options={EngineeringProjectStatus}
					selectedItemLabel={"NÃO DEFINIDO"}
					handleChange={(value) => {
						setInfoHolder((prev) => ({
							...prev,
							projeto: { ...prev.projeto, status: value },
						}));
						setChanges((prev) => ({ ...prev, "projeto.status": value }));
					}}
					onReset={() => {
						setInfoHolder((prev) => ({ ...prev, projeto: { ...prev.projeto, status: null } }));
						setChanges((prev) => ({ ...prev, "projeto.status": null }));
					}}
					value={infoHolder.projeto.status}
					width="100%"
				/>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="DIAGRAMAS FEITOS"
						labelTrue="DIAGRAMAS FEITOS"
						date={infoHolder.homologacao.pendencias.diagramas || null}
						handleChange={(value) => {
							console.log(value);
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									pendencias: { ...prev.homologacao.pendencias, diagramas: value ? value : null },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.pendencias.diagramas": value ? value : null }));
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="FORMULÁRIOS FEITOS"
						labelTrue="FORMULÁRIOS FEITOS"
						date={infoHolder.homologacao.pendencias.formularios || null}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									pendencias: { ...prev.homologacao.pendencias, formularios: value ? value : null },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.pendencias.formularios": value ? value : null }));
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="DESENHOS FEITOS"
						labelTrue="DESENHOS FEITOS"
						date={infoHolder.homologacao.pendencias.desenhos || null}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									pendencias: { ...prev.homologacao.pendencias, desenhos: value ? value : null },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.pendencias.desenhos": value ? value : null }));
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="MAPAS DE MICRO"
						labelTrue="MAPAS DE MICRO"
						date={infoHolder.homologacao.pendencias.mapasDeMicro || null}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									pendencias: { ...prev.homologacao.pendencias, mapasDeMicro: value ? value : null },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.pendencias.mapasDeMicro": value ? value : null }));
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
						labelTrue="DISTRIBUIÇÃO DE CRÉDITOS FEITA"
						date={infoHolder.homologacao.pendencias.distribuicoes || null}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									pendencias: { ...prev.homologacao.pendencias, distribuicoes: value ? value : null },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.pendencias.distribuicoes": value ? value : null }));
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default PendenciesInformation;
