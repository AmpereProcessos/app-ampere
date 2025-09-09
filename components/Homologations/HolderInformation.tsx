import { formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { SigningForms } from "@/utils/select-options";
import { UserRound } from "lucide-react";
import type React from "react";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";

type HolderInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function HolderInformation({ infoHolder, setInfoHolder, changes, setChanges }: HolderInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<UserRound className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DO TITULAR DA INSTALAÇÃO ELÉTRICA</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label="NOME DO TITULAR"
						placeholder="Preencha o nome do titular da instalação..."
						value={infoHolder.homologacao.titular.nome}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, nome: value } } }));
							setChanges((prev) => ({ ...prev, "homologacao.titular.nome": value }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="CPF/CNPJ DO TITULAR"
						placeholder="Preencha o cpf ou cpnj do titular da instalação..."
						value={infoHolder.homologacao.titular.identificador}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, identificador: formatToCPForCNPJ(value) } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.titular.identificador": formatToCPForCNPJ(value) }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<TextInput
						label="TELEFONE DO TITULAR"
						placeholder="Preencha o telefone do titular da instalação..."
						value={infoHolder.homologacao.titular.contato}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, titular: { ...prev.homologacao.titular, contato: formatToPhone(value) } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.titular.contato": formatToPhone(value) }));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full items-center justify-center">
				<div className="w-full lg:w-1/3">
					<SelectInput
						label="FORMA DE ASSINATURA"
						selectedItemLabel="NÃO DEFINIDO"
						options={SigningForms}
						value={infoHolder.homologacao.documentacao.formaAssinatura}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									documentacao: { ...prev.homologacao.documentacao, formaAssinatura: value },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.formaAssinatura": value }));
						}}
						onReset={() => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, documentacao: { ...prev.homologacao.documentacao, formaAssinatura: "FÍSICA" } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.formaAssinatura": "FÍSICA" }));
						}}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default HolderInformation;
