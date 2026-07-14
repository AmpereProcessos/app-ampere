import CheckboxWithDate from "@/components/inputs/CheckboxWithDate";
import DateInput from "@/components/inputs/Date";
import { TInstallationStructureExecution } from "@/pages/api/gestao-obras/estruturas";
import { formatDate, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { updateProject } from "@/utils/methods/mutation/clients";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { formatDateInputChange } from "@/utils/methods/shared";
import { TProject } from "@/utils/schemas/projects";
import { TLocation } from "@/utils/schemas/useful";
import React from "react";
import { BsBank2, BsPatchCheckFill } from "react-icons/bs";
import { FaSolarPanel, FaTruck } from "react-icons/fa";
import { FaDiamond, FaLocationDot } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

function getStatusTag(isExecuted: boolean) {
  if (!isExecuted)
    return (
      <div className="flex min-w-fit items-center gap-2 rounded-full bg-orange-600 px-2 py-1">
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">PENDENTE</h1>
      </div>
    );

  return (
    <div className="flex min-w-fit items-center gap-2 rounded-full bg-green-600 px-2 py-1">
      <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">CONCLUÍDO</h1>
    </div>
  );
}
function getDeliveryText({
  status,
  deliveryDate,
}: {
  status: string;
  deliveryDate: string | null;
}) {
  const isDelivered = status == "ENTREGUE" || !!deliveryDate;
  if (isDelivered) {
    if (!deliveryDate)
      return <h1 className="text-[0.6rem] tracking-tight text-green-500">ENTREGUE</h1>;

    return (
      <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
        ENTREGUE <strong className="text-green-500">EM {formatDateAsLocale(deliveryDate)}</strong>
      </h1>
    );
  }
  return (
    <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
      ENTREGA <strong className="text-orange-500">PENDENTE</strong>
    </h1>
  );
}
function getPaymentText({ paymentDate }: { paymentDate: string | null }) {
  const isDelivered = !!paymentDate;
  if (isDelivered) {
    return (
      <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
        PAGO EM <strong className="text-green-500">EM {formatDateAsLocale(paymentDate)}</strong>
      </h1>
    );
  }
  return (
    <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
      PAGAMENTO <strong className="text-orange-500">PENDENTE</strong>
    </h1>
  );
}
type InstallationStrucutreProjectCardProps = {
  project: TInstallationStructureExecution;
};
function InstallationStrucutreProjectCard({ project }: InstallationStrucutreProjectCardProps) {
  const queryClient = useQueryClient();
  const isExecuted =
    project.estruturaPersonalizada.status == "PRONTA" ||
    !!project.estruturaPersonalizada.dataMontagem;
  const location: TLocation = {
    cep: project.cep?.toString(),
    uf: project.uf,
    cidade: project.cidade,
    bairro: project.bairro,
    endereco: project.logradouro,
    numeroOuIdentificador: project.numeroResidencia?.toString(),
  };

  async function updateStructureAdequationExecutionDate(date: string | null) {
    try {
      await updateProject({
        id: project._id,
        changes: {
          "estruturaPersonalizada.dataMontagem": date,
          "estruturaPersonalizada.status": !!date ? "PRONTA" : "NÃO DEFINIDO",
        },
      });

      return "Projeto atualizado com sucesso !";
    } catch (error) {
      throw error;
    }
  }
  const { mutate: handleUpdate, isPending } = useMutationWithFeedback({
    mutationKey: ["update-project", project._id],
    mutationFn: updateStructureAdequationExecutionDate,
    affectedQueryKey: ["structure-execution-projects"],
    queryClient: queryClient,
  });
  return (
    <div className="bg-background border-primary/60 flex w-full flex-col gap-4 rounded border p-3 font-[Inter] shadow-md lg:w-[600px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="text-sm leading-none font-black tracking-tight">
          <strong className="text-[#fead41]">({project.qtde})</strong> {project.nomeDoContrato}
        </h1>
        {getStatusTag(isExecuted)}
      </div>
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1">
          <h1 className="text-foreground text-[0.55rem] tracking-tight">ESTRUTURA</h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <FaDiamond />
            <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
              TIPO{" "}
              <strong className="text-blue-500">
                {project.estruturaPersonalizada.tipo || "N/A"}
              </strong>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsBank2 />
            <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
              RESP. DO(A){" "}
              <strong className="text-blue-500">
                {project.estruturaPersonalizada.respPagamento || "N/A"}
              </strong>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsPatchCheckFill />
            {getPaymentText({ paymentDate: project.compra.dataPagamento || null })}
          </div>
          <div className="flex items-center gap-1">
            <MdOutlineAttachMoney />
            <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
              VALOR DE{" "}
              <strong className="text-blue-500">
                {formatToMoney(project.estruturaPersonalizada.valor || 0)}
              </strong>
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <FaSolarPanel />
            <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
              <strong className="text-blue-500">{project.sistema.qtdeModulos || 0} MÓDULOS</strong>
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1">
          <h1 className="text-foreground text-[0.55rem] tracking-tight">ENTREGA</h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <FaTruck />
            {getDeliveryText({
              status: project.estruturaPersonalizada.status || "",
              deliveryDate: project.estruturaPersonalizada.dataEntrega || null,
            })}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-1">
          <h1 className="text-foreground text-[0.55rem] tracking-tight">LOCALIZAÇÃO</h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-1">
            <FaLocationDot />
            <h1 className="text-foreground text-[0.65rem] font-bold tracking-tight">
              {formatLocation({ location, includeUf: true, includeCity: true })}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        <CheckboxWithDate
          labelFalse="EXECUTADO"
          labelTrue="EXECUTADO"
          editable={!isPending}
          showDate={!!project.estruturaPersonalizada.dataMontagem}
          date={project.estruturaPersonalizada.dataMontagem || project.obra.saida || null}
          handleChange={(value) => handleUpdate(formatDateInputChange(value))}
        />
      </div>
    </div>
  );
}

export default InstallationStrucutreProjectCard;
