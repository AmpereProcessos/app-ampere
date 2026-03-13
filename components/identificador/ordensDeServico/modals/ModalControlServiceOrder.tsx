import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscChromeClose } from "react-icons/vsc";
import { getErrorMessage } from "../../../../utils/methods/handlers";
import { updateServiceOrder } from "../../../../utils/methods/mutation/service-orders";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { updateProject } from "@/utils/methods/mutation/clients";
import { useServiceOrderById } from "@/utils/methods/query/service-orders";
import type { TServiceOrder, TServiceOrderDTO } from "@/utils/schemas/service-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import ServiceOrderFileReferences from "./blocos/AttachmentsBlock";
import ServiceOrderCalendarIntegration from "./blocos/CalendarIntegration";
import CostsInformation from "./blocos/CostInformationBlock";
import ServiceOrderDetailsInformationBlock from "./blocos/DetailsInformationBlock";
import ServiceOrderEquipmentsInformationBlock from "./blocos/EquipmentsInformationBlock";
import ServiceOrderExecutionInformationBlock from "./blocos/ExecutionInformationBlock";
import ServiceOrderGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ServiceOrderLocationInformationBlock from "./blocos/LocationInformationBlock";
import ServiceOrderPendenciesBlock from "./blocos/PendenciesBlock";
import ServiceOrderProjectInformationBlock from "./blocos/ProjectInformationBlock";
import ServiceOrderScheduling from "./blocos/SchedulingInformationBlock";
import ServiceOrderTagsBlock from "./blocos/TagsBlock";
import ServiceOrderTechnicalAnalysisInformationBlock from "./blocos/TechnicalAnalysisBlock";
import ServiceOrderProjectVinculation from "./blocos/utils/ProjectVinculation";

type ModalControlServiceOrderProps = {
  serviceOrderId: string;
  session: TAuthSession;
  closeModal: () => void;
  callbacks?: {
    onMutate?: () => void;
    onSuccess?: () => void;
    onSettled?: () => void;
  };
};
function ModalControlServiceOrder({
  session,
  serviceOrderId,
  closeModal,
  callbacks,
}: ModalControlServiceOrderProps) {
  const queryClient = useQueryClient();

  const {
    data: serviceOrder,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useServiceOrderById({ id: serviceOrderId });
  const initialState: TServiceOrder = {
    categoria: "MONTAGEM",
    favorecido: {
      nome: "",
      contato: "",
    },
    anotacoes: "",
    projeto: {
      id: null,
      nome: null,
      identificador: null,
      tipo: null,
    },
    descricao: "", // servico executado
    localizacao: {
      cep: "",
      uf: "",
      cidade: "",
      bairro: "",
      endereco: "",
      numeroOuIdentificador: "",
    },
    responsavel: {
      nome: "",
      tipo: "EXTERNO",
    },
    responsaveis: [],
    // configurar: false,
    urgencia: "POUCO URGENTE",
    periodo: {
      inicio: null,
      fim: null,
    },
    pagamento: {
      recebedor: null,
      valor: null,
    },
    cobranca: {
      pagador: null,
      valor: null,
    },
    autor: {
      id: session?.user.id,
      nome: session.user.nome,
      avatar_url: session?.user.avatar_url,
    },
    equipamentos: {
      modulos: {
        modelo: "",
        qtde: 0,
        potencia: "",
      },
      inversor: {
        modelo: "",
        qtde: 0,
        potencia: "",
      },
      disponivel: null,
      retirada: null,
    },
    detalhes: {
      pontoAgua: "",
      senhaWifi: "",
      configuracaoMonitoramento: false,
      possuiTrafo: false,
      tipoEstrutura: null,
      tipoTelha: null,
      tipoPadrao: null,
      tipoSaidaPadrao: null,
      amperagemPadrao: null,
      responsabilidadePadrao: null,
      topologia: null,
    },
    observacoes: [],
    dataInsercao: new Date().toISOString(),
  };
  const [osInfo, setOsInfo] = useState<TServiceOrder>(initialState);

  function updateInfoHolder(changes: Partial<TServiceOrder>) {
    setOsInfo((prev) => ({ ...prev, ...changes }));
  }

  async function handleUpdateServiceOrder({
    id,
    changes,
  }: {
    id: string;
    changes: Partial<TServiceOrder>;
  }) {
    try {
      await updateServiceOrder({ id, changes });
      return "Ordem de serviço atualizada com sucesso !";
    } catch (error) {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    }
  }
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-project-service-order"],
    mutationFn: handleUpdateServiceOrder,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["service-order", serviceOrderId] });
      if (callbacks?.onMutate) callbacks.onMutate();
    },
    onSuccess: async (data) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      return toast.success(data);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["service-order", serviceOrderId] });
      if (callbacks?.onSettled) callbacks.onSettled();
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    },
  });
  useEffect(() => {
    if (serviceOrder) setOsInfo(serviceOrder);
  }, [serviceOrder]);
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        className="bg-background fixed top-[50%] left-[50%] z-100 h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[80%]"
      >
        <div className="flex h-full w-full flex-col">
          <div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-primary dark:text-white">
              EDITAR ORDEM DE SERVIÇO
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: "red" }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full w-full flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-y-auto px-2 py-4">
                <div className="flex w-full flex-wrap items-center justify-center gap-2">
                  <Link href={`/ordens-de-servico/pdf/${serviceOrderId}`}>
                    <button
                      type="button"
                      className={cn(
                        "hover:bg-primary/80 flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out",
                      )}
                    >
                      <ExternalLink width={14} height={14} />
                      <h1 className="text-xs font-medium tracking-tight">
                        PÁGINA DO ORDEM DE SERVIÇO
                      </h1>
                    </button>
                  </Link>
                  {serviceOrder.categoria === "MANUTENÇÃO PREVENTIVA" ? (
                    <Link href={`/oem/pdfTermo/${serviceOrderId}`}>
                      <button
                        type="button"
                        className={cn(
                          "hover:bg-primary/80 flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out",
                        )}
                      >
                        <ExternalLink width={14} height={14} />
                        <h1 className="text-xs font-medium tracking-tight">
                          PÁGINA DO TERMO DE SERVIÇO
                        </h1>
                      </button>
                    </Link>
                  ) : null}
                </div>
                <ServiceOrderGeneralInformationBlock
                  infoHolder={osInfo as TServiceOrderDTO}
                  project={serviceOrder?.projetoDados || undefined}
                  predefinedCategories={[]}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderPendenciesBlock
                  infoHolder={osInfo as TServiceOrderDTO}
                  updateInfoHolder={updateInfoHolder}
                />
                {serviceOrder?.projetoDados ? (
                  <ServiceOrderProjectInformationBlock
                    project={serviceOrder.projetoDados}
                    infoHolder={osInfo}
                    updateInfoHolder={updateInfoHolder}
                  />
                ) : (
                  <ServiceOrderProjectVinculation
                    serviceOrderId={serviceOrderId}
                    queryClient={queryClient}
                    affectedQueryKey={[]}
                    infoHolder={osInfo}
                    updateInfoHolder={updateInfoHolder}
                  />
                )}
                {serviceOrder.projetoDados ? (
                  <CostsInformation
                    sessionUser={session}
                    projectName={serviceOrder.projetoDados.nomeDoContrato}
                    projectId={serviceOrder.projetoDados._id}
                    projectIdentifier={serviceOrder.projetoDados.qtde.toString()}
                  />
                ) : null}
                <ServiceOrderTechnicalAnalysisInformationBlock
                  technicalAnalysisId={osInfo.idAnaliseTecnica}
                />
                <ServiceOrderFileReferences
                  session={session}
                  attachmentPrefix={osInfo.descricao}
                  serviceOrderId={serviceOrderId}
                  projectId={osInfo.projeto.id || undefined}
                />

                <ServiceOrderTagsBlock
                  session={session}
                  infoHolder={osInfo as TServiceOrderDTO}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderLocationInformationBlock
                  infoHolder={osInfo as TServiceOrderDTO}
                  project={serviceOrder?.projetoDados || undefined}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderEquipmentsInformationBlock
                  infoHolder={osInfo}
                  project={serviceOrder?.projetoDados || undefined}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderCalendarIntegration
                  infoHolder={osInfo}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderScheduling infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
                <ServiceOrderDetailsInformationBlock
                  infoHolder={osInfo}
                  updateInfoHolder={updateInfoHolder}
                />
                <ServiceOrderExecutionInformationBlock
                  infoHolder={osInfo}
                  updateInfoHolder={updateInfoHolder}
                  projectObservations={serviceOrder?.projetoDados?.obra?.observacoes || undefined}
                />
              </div>
              <div className="border-primary/20 mt-2 flex w-full items-center justify-between border-t px-4 py-1">
                {!osInfo.dataEfetivacao ? (
                  <LoadingButton
                    loading={isPending}
                    onClick={() =>
                      mutate({
                        id: serviceOrderId,
                        changes: { ...osInfo, dataEfetivacao: new Date().toISOString() },
                      })
                    }
                    type="button"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    CONCLUIR ORDEM DE SERVIÇO
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loading={isPending}
                    onClick={() =>
                      mutate({ id: serviceOrderId, changes: { ...osInfo, dataEfetivacao: null } })
                    }
                    type="button"
                    className="hover:bg-primary/80 bg-primary/60"
                  >
                    REABRIR ORDEM DE SERVIÇO
                  </LoadingButton>
                )}
                <LoadingButton
                  // @ts-ignore
                  onClick={() => mutate({ id: serviceOrderId, changes: osInfo })}
                  loading={isPending}
                >
                  ATUALIZAR ORDEM DE SERVIÇO
                </LoadingButton>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

export default ModalControlServiceOrder;
