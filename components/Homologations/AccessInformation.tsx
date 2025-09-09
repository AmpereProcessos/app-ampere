import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { GitBranchPlus } from "lucide-react";
import CheckboxInput from "../inputs/Checkbox";
import DateInput from "../inputs/Date";
import TextInput from "../inputs/Text";

type AccessInformationProps = {
	infoHolder: TProjectDTOWithHomologation;
	setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
	changes: { [key: string]: any };
	setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function AccessInformation({ infoHolder, setInfoHolder, changes, setChanges }: AccessInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<GitBranchPlus className="h-4 w-4 min-h-4 min-w-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES SOBRE O PARECER DE ACESSO</h1>
			</div>
			<div className="flex w-full items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="MODALIDADE FAST-TRACK"
						labelTrue="MODALIDADE FAST-TRACK"
						checked={!!infoHolder.homologacao.fastTrack}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, fastTrack: value } }));
							setChanges((prev) => ({ ...prev, "homologacao.fastTrack": value }));
						}}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/3">
					<TextInput
						label="CÓDIGO (NS) DA HOMOLOGAÇÃO"
						placeholder="Preencha o código de acompanhamento da homologação..."
						value={infoHolder.homologacao.acesso.codigo}
						handleChange={(value) => {
							setInfoHolder((prev) => ({ ...prev, homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, codigo: value } } }));
							setChanges((prev) => ({ ...prev, "homologacao.acesso.codigo": value }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<DateInput
						label="DATA DE SOLICITAÇÃO DA HOMOLOGAÇÃO"
						value={formatDate(infoHolder.homologacao.acesso.dataSolicitacao)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, dataSolicitacao: formatDateInputChange(value, "string") } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.acesso.dataSolicitacao": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/3">
					<DateInput
						label="DATA DE APROVAÇÃO DA HOMOLOGAÇÃO"
						value={formatDate(infoHolder.homologacao.acesso.dataResposta)}
						handleChange={(value) => {
							setInfoHolder((prev) => ({
								...prev,
								homologacao: { ...prev.homologacao, acesso: { ...prev.homologacao.acesso, dataResposta: formatDateInputChange(value, "string") } },
							}));
							setChanges((prev) => ({ ...prev, "homologacao.acesso.dataResposta": formatDateInputChange(value, "string") }));
						}}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default AccessInformation;
