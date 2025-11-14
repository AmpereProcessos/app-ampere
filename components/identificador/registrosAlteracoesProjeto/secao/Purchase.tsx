import { getUpdateLogFormatted } from "@/utils/project-fields-labelling";
import { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import React from "react";
import UpdateLogCard from "../UpdateLogCard";

const RelatedFields = [
	"compra.liberacao", // 'boolean
	"compra.dataLiberacao",
	"compra.status",
	"compra.tipoDoKit",
	"compra.previsaoValorDoKit",
	"compra.fornecedor",
	"compra.dataPedido",
	"compra.valorDoKit",
	"compra.rastreio",
	"compra.informacoes",
	"compra.dataMaxPagamento",
	"compra.dataPagamento",
	"compra.dataPagamentoEquipamentos",
	"faturamento.previsaoFaturamento",
	"faturamento.dataFaturamento",
	"compra.localEntrega",
	"compra.previsaoEntrega",
	"compra.dataEntrega",
	"compra.statusEntrega",
	"comissionamento.suprimentos", // boolean
];
function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
	return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)));
}
type PurchaseUpdateLogsProps = {
	logs: TProjectUpdateLogDTO[];
};
function Purchase({ logs }: PurchaseUpdateLogsProps) {
	const relatedLogs = getRelatedLogs(logs);
	return (
		<div className="flex w-full flex-col gap-1">
			{relatedLogs.length > 0 ? (
				relatedLogs.map((log) => <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />)
			) : (
				<p className="text-primary/60 flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
					Sem registros de atualização relacionados a compra
				</p>
			)}
		</div>
	);
}

export default Purchase;
