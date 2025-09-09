import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { FileText } from "lucide-react";
import type React from "react";
import DateInput from "../inputs/Date";

type DocumentationInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function DocumentationInformation({ infoHolder, setInfoHolder, changes, setChanges }: DocumentationInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<FileText className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE A DOCUMENTAÇÃO</h1>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE LIBERAÇÃO PARA ASSINATURA"
						value={formatDate(infoHolder.homologacao.documentacao.dataLiberacao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									documentacao: { ...prev.homologacao.documentacao, dataLiberacao: formatDateInputChange(value, "string") },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.dataLiberacao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE ASSINATURA DA DOCUMENTAÇÃO"
						value={formatDate(infoHolder.homologacao.documentacao.dataAssinatura)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									documentacao: { ...prev.homologacao.documentacao, dataAssinatura: formatDateInputChange(value, "string") },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.dataAssinatura": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<DateInput
						label="INÍCIO DA ELABORAÇÃO DAS DOCUMENTAÇÕES"
						value={formatDate(infoHolder.homologacao.documentacao.dataInicioElaboracao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									documentacao: { ...prev.homologacao.documentacao, dataInicioElaboracao: formatDateInputChange(value, "string") },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.dataInicioElaboracao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateInput
						label="CONCLUSÃO DA ELABORAÇÃO DAS DOCUMENTAÇÕES"
						value={formatDate(infoHolder.homologacao.documentacao.dataConclusaoElaboracao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: {
									...prev.homologacao,
									documentacao: { ...prev.homologacao.documentacao, dataConclusaoElaboracao: formatDateInputChange(value, "string") },
								},
							}));
							setChanges((prev) => ({ ...prev, "homologacao.documentacao.dataConclusaoElaboracao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default DocumentationInformation;
