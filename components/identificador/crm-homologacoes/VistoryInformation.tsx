import DateInput from "@/components/inputs/Date";
import { formatDate } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import { THomologationDTO } from "@/utils/schemas/crm/homologation.schema";

type VistoryInformationProps = {
	infoHolder: THomologationDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<THomologationDTO>>;
};
function VistoryInformation({ infoHolder, setInfoHolder }: VistoryInformationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">INFORMAÇÕES SOBRE A VISTORIA</h1>
			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE SOLICITAÇÃO DA VISTORIA"
						value={formatDate(infoHolder.vistoria.dataSolicitacao)}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, vistoria: { ...prev.vistoria, dataSolicitacao: formatDateInputChange(value) } }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateInput
						label="DATA DE EXECUÇÃO DA VISTORIA"
						value={formatDate(infoHolder.vistoria.dataEfetivacao)}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, vistoria: { ...prev.vistoria, dataEfetivacao: formatDateInputChange(value) } }))}
						width="100%"
					/>
				</div>
			</div>
		</div>
	);
}

export default VistoryInformation;
