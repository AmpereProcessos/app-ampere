import { formatDecimalPlaces } from "@/utils/constants";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { ElectricalInstallationGroups, EnergyDistributorsOptions } from "@/utils/select-options";
import { Plug } from "lucide-react";
import type React from "react";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";
import InstallationDependentsBlock from "./Utils/InstallationDependentsBlock";

type InstallationInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function InstallationInformation({ infoHolder, setInfoHolder, changes, setChanges }: InstallationInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Plug className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DA INSTALAÇÃO ELÉTRICA</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<SelectInput
						label="CONCESSIONÁRIA/DISTRIBUIDORA"
						value={infoHolder.homologacao.distribuidora}
						options={EnergyDistributorsOptions.map((d) => d)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, distribuidora: value } }));
							setChanges((prev) => ({ ...prev, "homologacao.distribuidora": value }));
						}}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, distribuidora: "" } }));
							setChanges((prev) => ({ ...prev, "homologacao.distribuidora": "" }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<TextInput
						label="NÚMERO DA INSTALAÇÃO GERADORA"
						placeholder="Preencha o número da instalação elétrica da GERADORA..."
						value={infoHolder.homologacao.instalacao.numeroInstalacao}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, numeroInstalacao: value } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.instalacao.numeroInstalacao": value }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<TextInput
						label="NÚMERO DO CLIENTE"
						placeholder="Preencha o número do cliente junto a concessionária..."
						value={infoHolder.homologacao.instalacao.numeroCliente}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, numeroCliente: value } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.instalacao.numeroCliente": value }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/4">
					<SelectInput
						label="GRUPO DA INSTALAÇÃO"
						value={infoHolder.homologacao.instalacao.grupo}
						options={ElectricalInstallationGroups}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, grupo: value } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.instalacao.grupo": value }));
						}}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, instalacao: { ...prev.homologacao.instalacao, grupo: "RESIDENCIAL" } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.instalacao.grupo": "RESIDENCIAL" }));
						}}
						width="100%"
					/>
				</div>
			</div>
			<InstallationDependentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} changes={changes} setChanges={setChanges} />
		</div>
	);
}

export default InstallationInformation;
