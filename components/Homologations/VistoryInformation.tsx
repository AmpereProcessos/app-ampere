import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { ScanSearch } from "lucide-react";
import type React from "react";
import DateInput from "../inputs/Date";

type VistoryInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function VistoryInformation({ infoHolder, setInfoHolder, changes, setChanges }: VistoryInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<ScanSearch className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE A VISTORIA</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE SOLICITAÇÃO DA VISTORIA"
						value={formatDate(infoHolder.homologacao.vistoria.dataSolicitacao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, vistoria: { ...prev.homologacao.vistoria, dataSolicitacao: formatDateInputChange(value, "string") } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.vistoria.dataSolicitacao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE EXECUÇÃO DA VISTORIA"
						value={formatDate(infoHolder.homologacao.vistoria.dataEfetivacao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, vistoria: { ...prev.homologacao.vistoria, dataEfetivacao: formatDateInputChange(value, "string") } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.vistoria.dataEfetivacao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default VistoryInformation;
