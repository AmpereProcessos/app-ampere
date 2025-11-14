import { getUpdateLogFormatted } from "@/utils/project-fields-labelling";
import { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import React from "react";
import UpdateLogCard from "../UpdateLogCard";

const RelatedFields = [
	"contrato.formaAssinatura",
	"contrato.status",
	"contrato.dataSolicitacao",
	"contrato.dataLiberacao",
	"contrato.dataAssinatura",
	"comissoes.efetivado", // boolean
	"comissoes.pagamentoRealizado", // boolean
	"comissoes.porcentagemVendedor",
	"comissoes.porcentagemInsider",
	"comissionamento.comercial", // boolean
];
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
	return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)));
}
type ContractUpdateLogsProps = {
	logs: TProjectUpdateLogDTO[];
};
function Contract({ logs }: ContractUpdateLogsProps) {
	const relatedLogs = getRelatedLogs(logs);
	return (
		<div className="flex w-full flex-col gap-1">
			{relatedLogs.length > 0 ? (
				relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
			) : (
				<p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
					Sem registros de atualização relacionados ao dados do contrato.
				</p>
			)}
		</div>
	);
}

export default Contract;
