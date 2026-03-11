import { useSession } from "@/components/providers/SessionProvider";
import { Badge } from "@/components/ui/badge";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/methods/handlers";
import React, { useMemo, useState } from "react";
import { BsCalendarCheck, BsCalendarEvent } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import {
  Building2,
  LayoutGrid,
  MapPin,
  Paperclip,
  Phone,
  Signature,
  Tag,
  UserRound,
} from "lucide-react";
import { useServiceOrdersItinerary } from "../../utils/methods/query/service-orders";
import ModalOS from "../../components/ModalOS";
import { TGetServiceOrdersItineraryOutputDefault } from "../api/ordensDeServico/roteiro";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { FaSolarPanel } from "react-icons/fa";
import { TbTopologyFull } from "react-icons/tb";
import { handleDownload } from "@/utils/methods/firebase";
import { formatLongString, isFileFormatImage } from "@/utils/constants";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import {
  handleRenderFileIcon,
  handleRenderFileIconWithClassNames,
} from "@/utils/methods/rendering";
import Image from "next/image";

function dateLabel(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

function dateGroupKey(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "sem-agendamento";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateTimeLabel(input?: string | null) {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function dateTimeWeight(input?: string | null) {
  if (!input) return Number.POSITIVE_INFINITY;
  const time = new Date(input).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function ServiceOrdersItinerary() {
  const { session, status } = useSession();
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  if (
    session?.user?.visualizacao?.tipo !== "EXECUÇÃO" ||
    !session?.user?.visualizacao?.referencia
  ) {
    return <ErrorComponent msg="Você não tem permissão para acessar esta página." />;
  }
  return (
    <ServiceOrdersItineraryPage
      sessionUserReferenceViewParam={session.user.visualizacao.referencia}
      session={session}
    />
  );
}

export default ServiceOrdersItinerary;

type ServiceOrdersItineraryPageProps = {
  sessionUserReferenceViewParam: string;
  session: TAuthSession;
};
function ServiceOrdersItineraryPage({
  sessionUserReferenceViewParam,
  session,
}: ServiceOrdersItineraryPageProps) {
  const [openedOrderId, setOpenedOrderId] = useState<string | null>(null);
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useServiceOrdersItinerary({
    params: {
      page: 1,
      search: "",
      responsibleNames: [sessionUserReferenceViewParam],
      pendingConclusionOnly: true,
    },
  });

  const serviceOrders = orders?.serviceOrders ?? [];
  const groupedByDate = useMemo(() => {
    const mapped = serviceOrders.slice().sort((a, b) => {
      const weightA = dateTimeWeight(a.agendamento?.inicio);
      const weightB = dateTimeWeight(b.agendamento?.inicio);
      if (weightA !== weightB) return weightA - weightB;
      return dateTimeWeight(a.periodo?.inicio) - dateTimeWeight(b.periodo?.inicio);
    });

    const grouped = new Map<
      string,
      {
        key: string;
        label: string;
        orders: TGetServiceOrdersItineraryOutputDefault["serviceOrders"];
      }
    >();
    mapped.forEach((order) => {
      const key = order.agendamento?.inicio
        ? dateGroupKey(order.agendamento.inicio)
        : "sem-agendamento";
      const label = order.agendamento?.inicio
        ? dateLabel(order.agendamento.inicio)
        : "Sem agendamento";
      if (!grouped.has(key)) grouped.set(key, { key, label, orders: [] });
      grouped.get(key)?.orders.push(order);
    });
    return Array.from(grouped.entries()).map(([, group]) => group);
  }, [orders?.serviceOrders]);

  if (isLoading) {
    return (
      <div className="bg-background flex grow items-center justify-center p-6">
        <LoadingComponent />
      </div>
    );
  }
  if (isError) return <ErrorComponent msg={getErrorMessage(error)} />;

  return (
    <div className="bg-background flex grow flex-col gap-4 p-4 md:p-6">
      <h1 className="text-lg font-bold md:text-xl">ITINERÁRIO DE SERVIÇOS</h1>

      {groupedByDate.length === 0 ? (
        <div className="text-primary/70 rounded-lg border border-dashed p-6 text-center">
          Nenhuma ordem de serviço encontrada para este responsável.
        </div>
      ) : null}
      <div className="flex flex-col gap-6">
        {groupedByDate.map((group) => (
          <section key={group.key} className="flex flex-col gap-3">
            <header className="bg-primary sticky top-0 z-10 rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground">
              {group.label} <span>({group.orders.length})</span>
            </header>

            <div className="flex flex-col gap-3">
              {group.orders.map((order) => (
                <ServiceOrderCard key={order._id} serviceOrder={order} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

type ServiceOrderCardProps = {
  serviceOrder: TGetServiceOrdersItineraryOutputDefault["serviceOrders"][number];
};
function ServiceOrderCard({ serviceOrder }: ServiceOrderCardProps) {
  const [attachmentsViewIsOpen, setAttachmentsViewIsOpen] = useState(false);
  function getModulesString() {
    if (!serviceOrder.equipamentos.modulos.qtde) return null;

    const hasValidModel =
      serviceOrder.equipamentos.modulos.modelo && serviceOrder.equipamentos.modulos.modelo !== "-";
    const hasValidPower =
      serviceOrder.equipamentos.modulos.potencia &&
      serviceOrder.equipamentos.modulos.potencia !== "-";

    if (!hasValidModel && !hasValidPower) return null;

    if (hasValidModel)
      return `${serviceOrder.equipamentos.modulos.qtde}x ${serviceOrder.equipamentos.modulos.modelo} ${serviceOrder.equipamentos.modulos.potencia}W`;

    return `${serviceOrder.equipamentos.modulos.qtde}x MÓDULOS DE ${serviceOrder.equipamentos.modulos.potencia}W`;
  }

  function getInvertersString() {
    const hasValidModel =
      serviceOrder.equipamentos.inversor.modelo &&
      serviceOrder.equipamentos.inversor.modelo !== "-";
    const hasValidPower =
      serviceOrder.equipamentos.inversor.potencia &&
      serviceOrder.equipamentos.inversor.potencia !== "-";

    if (!hasValidModel && !hasValidPower) return null;

    if (hasValidModel)
      return `${serviceOrder.equipamentos.inversor.qtde}x ${serviceOrder.equipamentos.inversor.modelo} ${serviceOrder.equipamentos.inversor.potencia}W`;

    return `${serviceOrder.equipamentos.inversor.qtde}x INVERSORES DE ${serviceOrder.equipamentos.inversor.potencia}W`;
  }
  const modulesString = useMemo(() => getModulesString(), [serviceOrder.equipamentos.modulos]);
  const invertersString = useMemo(() => getInvertersString(), [serviceOrder.equipamentos.inversor]);

  const serviceExecutionContract = useMemo(
    () =>
      serviceOrder.arquivos.find((f) =>
        f.categorias?.includes("CONTRATOS COM TERCEIROS - PRESTAÇÃO DE SERVIÇOS"),
      ) ?? null,
    [serviceOrder.arquivos],
  );
  return (
    <div className="bg-card border-primary/20 flex w-full flex-col gap-1 rounded-xl border px-3 py-4 shadow-2xs">
      <div className="flex w-full items-center justify-between gap-2 flex-col-reverse lg:flex-row">
        <div className="flex w-full items-center justify-start gap-1 lg:w-fit">
          <h1 className="text-xs font-bold tracking-tight lg:text-sm">{serviceOrder.descricao}</h1>
        </div>
        <div className="flex min-w-fit items-center gap-1 rounded-lg bg-primary/20 text-primary px-2 py-1">
          <Tag className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-[0.65rem] font-medium">{serviceOrder.categoria}</h1>
        </div>
      </div>
      <div className="w-full flex items-center gap-x-2 gap-y-1 flex-wrap">
        <div className="flex items-center gap-1">
          <LayoutGrid className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-[0.65rem] font-medium">{serviceOrder.projeto?.nome}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-[0.65rem] font-medium">
            {serviceOrder.favorecido.contato || "NÃO DEFINIDO"}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-[0.65rem] font-medium">
            {serviceOrder.localizacao.cidade}
            {serviceOrder.localizacao.uf ? ` (${serviceOrder.localizacao.uf})` : ""}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-[0.65rem] font-medium">
            {formatLocation({
              location: serviceOrder.localizacao,
            })}
          </h1>
        </div>
        {modulesString ? (
          <div className="flex items-center gap-1">
            <FaSolarPanel className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-[0.65rem] font-medium">{modulesString}</h1>
          </div>
        ) : null}
        {invertersString ? (
          <div className="flex items-center gap-1">
            <TbTopologyFull className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-[0.65rem] font-medium">{invertersString}</h1>
          </div>
        ) : null}
      </div>

      <div className="mt-2 w-full flex items-center justify-between flex-col lg:flex-row gap-2">
        {serviceOrder.agendamento?.inicio ? (
          <div className="flex items-center gap-1">
            <BsCalendarEvent className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-[0.65rem] font-medium">
              AGENDADO PARA: {formatDateAsLocale(serviceOrder.agendamento?.inicio, true)}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BsCalendarEvent className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-[0.65rem] font-medium">SEM AGENDAMENTO</h1>
          </div>
        )}
        <div className="flex items-center gap-2">
          {serviceExecutionContract ? (
            <button
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-200 text-green-600"
              onClick={() =>
                handleDownload({
                  fileName: serviceExecutionContract.titulo,
                  fileUrl: serviceExecutionContract.url,
                })
              }
            >
              <Signature className="w-3 h-3 min-w-3 min-h-3" />
              <p className="text-[0.6rem] font-medium tracking-tight">
                BAIXAR CONTRATO DE EXECUÇÃO
              </p>
            </button>
          ) : null}
          {serviceOrder.arquivos.length > 0 ? (
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-200 text-blue-600"
              onClick={() => setAttachmentsViewIsOpen(true)}
            >
              <Paperclip className="w-3 h-3 min-w-3 min-h-3" />
              <p className="text-[0.6rem] font-medium tracking-tight">VISUALIZAR ANEXOS</p>
            </button>
          ) : null}
        </div>
      </div>
      {attachmentsViewIsOpen ? (
        <ServiceOrderAttachmentsView
          attachments={serviceOrder.arquivos}
          closeMenu={() => setAttachmentsViewIsOpen(false)}
        />
      ) : null}
    </div>
  );
}

type ServiceOrderAttachmentsViewProps = {
  attachments: TGetServiceOrdersItineraryOutputDefault["serviceOrders"][number]["arquivos"];
  closeMenu: () => void;
};

function ServiceOrderAttachmentsView({ attachments, closeMenu }: ServiceOrderAttachmentsViewProps) {
  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle="ANEXOS"
      menuDescription="Visualize os anexos da ordem de serviço"
      menuCancelButtonText="FECHAR"
      closeMenu={closeMenu}
      stateIsLoading={false}
      stateError={null}
      dialogContentClassName="gap-6"
      drawerContentClassName="gap-6"
    >
      {attachments.map((attachment) => (
        <div
          key={attachment._id}
          className="bg-card border-primary/20 flex w-full flex-col gap-1 rounded-xl border shadow-2xs"
        >
          <h1 className="text-[0.65rem] font-medium bg-[#15599a] text-white px-2 py-1 rounded-lg rounded-bl-none rounded-br-none text-center">
            {attachment.titulo}
          </h1>
          <div className="w-full flex items-center justify-center p-3">
            <div className="relative w-full max-w-96 aspect-square overflow-hidden rounded-md bg-linear-to-b from-sky-400 to-sky-200">
              {isFileFormatImage(attachment.formato) ? (
                <Image
                  src={attachment.url}
                  alt={attachment.titulo}
                  className="object-cover"
                  fill={true}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  {handleRenderFileIconWithClassNames(
                    attachment.formato,
                    "w-5 h-5 min-w-5 min-h-5",
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </ResponsiveDialogDrawerViewOnly>
  );
}
