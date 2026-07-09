import { getUpdateLogFormatted } from "@/utils/project-fields-labelling";
import { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import React from "react";
import UpdateLogCard from "../UpdateLogCard";

const RelatedFields = [
  "visitaTecnica.amperagem",
  "padrao.tipo",
  "padrao.tipoEntrada",
  "visitaTecnica.saidaDoCliente",
  "projeto.aumentoDeCarga",
  "projeto.acStatus",
  "padrao.respPagamento",
  "padrao.respInstalacao",
  "padrao.valor",
  "padrao.caixaConjugada",
];

function getRelatedLogs(logs: TProjectUpdateLogDTO[]) {
  return logs.filter((log) => Object.keys(log.alteracoes).some((a) => RelatedFields.includes(a)));
}
type EnergyPAUpdateLogsProps = {
  logs: TProjectUpdateLogDTO[];
};
function EnergyPA({ logs }: EnergyPAUpdateLogsProps) {
  const relatedLogs = getRelatedLogs(logs);
  return (
    <div className="flex w-full flex-col gap-1">
      {relatedLogs.length > 0 ? (
        relatedLogs.map((log) => (
          <UpdateLogCard key={log._id} log={log} relatedFields={RelatedFields} />
        ))
      ) : (
        <p className="text-foreground flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
          Sem registros de atualização relacionados ao dados do padrão.
        </p>
      )}
    </div>
  );
}

export default EnergyPA;
