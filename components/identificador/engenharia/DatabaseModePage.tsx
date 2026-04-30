import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { VscDiffAdded } from "react-icons/vsc";

import ModalProjetos from "@/components/ModalProjetos";
import TagTipoDeServico from "@/components/TagTipoDeServico";
import ProjetosSkeleton from "@/components/skeletons/ProjetosSkeleton";

import DateInput from "@/components/inputs/Date";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { SlideMotionVariants, formatDate } from "@/utils/constants";
import { useEngineeringProjects } from "@/utils/methods/query/engineering";
import { formatDateInputChange } from "@/utils/methods/shared";
import {
  HomologationControlStatus,
  ServiceOrderStatus,
  inspectionStatus,
  serviceTypes,
} from "@/utils/select-options";

import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/crm/users";
import { useTags } from "@/utils/methods/query/tags";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCardsTags from "@/components/utils/ProjectCardsTags";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import type { TEngineeringProjectDTO } from "@/pages/api/projects/engenharia";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useProjectsAllocationsGrouped } from "@/utils/methods/query/projects";
import { useViewModesStore } from "@/utils/stores/view-modes-store";
import {
  Box,
  DraftingCompass,
  FileSignature,
  LayoutGrid,
  PanelsTopLeft,
  PiggyBankIcon,
  ShieldCheck,
  ShieldOff,
  Truck,
} from "lucide-react";
import { FaRotate } from "react-icons/fa6";
import EngineeringStats from "./Stats";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({
  id: index + 1,
  label: c,
  value: c,
}));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({
  id: index + 1,
  label: c,
  value: c,
}));
const CurrentDate = dayjs().toDate();

type EngineeringDatabaseModePageProps = {
  session: TAuthSession;
};
function EngineeringDatabaseModePage({ session }: EngineeringDatabaseModePageProps) {
  const updateViewMode = useViewModesStore((state) => state.updateMode);
  const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
  }>({ isOpen: false, projectId: null });
  const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });
  const { data: crmUsers } = useUsers({ includeDeleted: true });

  const {
    data: projects,
    isSuccess: projectsSuccess,
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectErrorInstance,
    filters,
    setFilters,
  } = useEngineeringProjects();

  return (
    <div className="grow p-6">
      <div className="border-primary/20 flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              Projetos no estágio de engenharia
            </p>
            <button
              type="button"
              onClick={() => updateViewMode("engineering", "kanban")}
              className="text-primary/60 hover:text-primary/80 flex items-center gap-1 px-2 text-xs duration-300 ease-out"
            >
              <FaRotate />
              <h1 className="font-medium">ALTERAR MODO</h1>
            </button>
          </div>
          {filtersMenuIsOpen ? (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setFiltersMenuIsOpen(false)}
              />
            </div>
          ) : (
            <div className="text-primary/80 cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setFiltersMenuIsOpen(true)}
              />
            </div>
          )}
        </div>
        <EngineeringStats />
        <div className="my-2 flex w-full items-center justify-end gap-2">
          <Link href="/projetos/analises-tecnicas">
            <button
              type="button"
              className="rounded-md bg-[#15599a] px-4 py-1 text-sm font-bold text-white"
            >
              ANÁLISES TÉCNICAS
            </button>
          </Link>
          <Link href="/projetos/homologacoes">
            <button
              type="button"
              className="rounded-md bg-[#fead41] px-4 py-1 text-sm font-bold text-white"
            >
              HOMOLOGAÇÕES AVULSAS
            </button>
          </Link>
        </div>
        <AnimatePresence>
          {filtersMenuIsOpen ? (
            <motion.div
              key={"engineering-filters-menu"}
              variants={SlideMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4 flex w-full flex-col gap-y-2"
            >
              <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label={"NOME DO CONTRATO"}
                  placeholder={"Digite o nome do contrato..."}
                  value={filters.search}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={"100%"}
                        label={"DEPOIS DE"}
                        value={filters.date.after ? formatDate(filters.date.after) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: { ...prev.date, after: formatDateInputChange(value, "string") },
                          }))
                        }
                      />
                    </div>
                    <div className="w-full lg:w-[250px]">
                      <DateInput
                        width={"100%"}
                        label={"ANTES DE"}
                        value={filters.date.before ? formatDate(filters.date.before) : undefined}
                        handleChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            date: { ...prev.date, before: formatDateInputChange(value, "string") },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[250px]">
                    <SelectInput
                      width={"100%"}
                      label={"CAMPO DE FILTRO"}
                      value={filters.date.field || null}
                      options={[
                        { id: 1, label: "DATA DE PAGAMENTO", value: "compra.dataPagamento" },
                        { id: 2, label: "DATA ASS.CONTRATO", value: "contrato.dataAssinatura" },
                        {
                          id: 3,
                          label: "DATA LIB.DOCUMENTAÇÃO",
                          value: "homologacao.documentacao.dataLiberacao",
                        },
                        {
                          id: 4,
                          label: "DATA ASS.DOCUMENTAÇÃO",
                          value: "homologacao.documentacao.dataAssinatura",
                        },
                        {
                          id: 6,
                          label: "DATA DE SOLICITAÇÃO DO PARECER",
                          value: "homologacao.acesso.dataSolicitacao",
                        },
                        {
                          id: 7,
                          label: "DATA DE RESPOSTA DO PARECER",
                          value: "homologacao.acesso.dataResposta",
                        },
                        {
                          id: 8,
                          label: "DATA DE PEDIDO DA VISTORIA",
                          value: "homologacao.vistoria.dataSolicitacao",
                        },
                        {
                          id: 9,
                          label: "TROCA DO MEDIDOR",
                          value: "homologacao.vistoria.dataEfetivacao",
                        },
                        { id: 10, label: "NÃO DEFINIDO", value: null },
                      ]}
                      selectedItemLabel={"SEM FILTRO"}
                      handleChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            ...prev.date,
                            field: value,
                          },
                        }))
                      }
                      onReset={() =>
                        setFilters((prev) => ({
                          ...prev,
                          date: {
                            after: null,
                            before: null,
                            field: null,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"TIPO DE SERVIÇO"}
                    selected={filters.serviceType}
                    options={serviceTypes}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        serviceType: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"ETIQUETAS"}
                    selected={filters.tagIds}
                    options={tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) || []}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        tagIds: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        tagIds: [],
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"STATUS DE ENTREGA"}
                    selected={filters.deliveryStatus}
                    options={[
                      { id: 1, label: "AGUARDANDO COMPRA", value: "AGUARDANDO COMPRA" },
                      { id: 2, label: "EM ROTA", value: "EM ROTA" },
                      { id: 3, label: "ENTREGUE", value: "ENTREGUE" },
                      { id: 4, label: "CANCELADO", value: "CANCELADO" },
                      { id: 5, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        deliveryStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        deliveryStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"STATUS DO PARECER"}
                    selected={filters.grantingStatus}
                    options={HomologationControlStatus}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        grantingStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        grantingStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"STATUS DA OBRA"}
                    selected={filters.executionStatus}
                    options={ServiceOrderStatus}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        executionStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        executionStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"STATUS DA VISTORIA"}
                    selected={filters.inspectionStatus}
                    options={inspectionStatus}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        inspectionStatus: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        inspectionStatus: [],
                      }))
                    }
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInputVirtualized
                    width={"100%"}
                    label={"CIDADE"}
                    selected={filters.city}
                    options={AllCities.map((city, index) => ({
                      id: index + 1,
                      label: city.label,
                      value: city.value,
                    }))}
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        city: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        city: [],
                      }))
                    }
                  />
                </div>

                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    width={"100%"}
                    label={"VENDEDOR"}
                    selected={filters.sellerName}
                    options={
                      crmUsers?.map((seller, index) => ({
                        id: index + 1,
                        label: seller.nome || "",
                        value: seller.nome,
                      })) || []
                    }
                    selectedItemLabel={"SEM FILTRO"}
                    handleChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerName: value as string[],
                      }))
                    }
                    onReset={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sellerName: [],
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      paidOnly: !filters.paidOnly,
                    })
                  }
                  size="sm"
                  variant={filters.paidOnly ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <PiggyBankIcon className="h-4 w-4 min-h-4 min-w-4" />
                  SOMENTE PAGOS
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      necessaryDistribution: !filters.necessaryDistribution,
                    })
                  }
                  size="sm"
                  variant={filters.necessaryDistribution ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Truck className="h-4 w-4 min-h-4 min-w-4" />
                  NECESSÁRIO DISTRIBUIÇÃO
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      necessaryHomologation: !filters.necessaryHomologation,
                    })
                  }
                  size="sm"
                  variant={filters.necessaryHomologation ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <ShieldCheck className="h-4 w-4 min-h-4 min-w-4" />
                  NECESSÁRIO HOMOLOGAÇÃO
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      notNecessaryHomologation: !filters.notNecessaryHomologation,
                    })
                  }
                  size="sm"
                  variant={filters.notNecessaryHomologation ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <ShieldOff className="h-4 w-4 min-h-4 min-w-4" />
                  NÃO NECESSÁRIO HOMOLOGAÇÃO
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      drawReady: !prev.drawReady,
                    }))
                  }
                  size="sm"
                  variant={filters.drawReady ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <DraftingCompass className="h-4 w-4 min-h-4 min-w-4" />
                  DESENHO PRONTO
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      missingDiagram: !filters.missingDiagram,
                    })
                  }
                  size="sm"
                  variant={filters.missingDiagram ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <LayoutGrid className="h-4 w-4 min-h-4 min-w-4" />
                  DIAGRAMA PENDENTE
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      missingDraw: !filters.missingDraw,
                    })
                  }
                  size="sm"
                  variant={filters.missingDraw ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <PanelsTopLeft className="h-4 w-4 min-h-4 min-w-4" />
                  DESENHO PENDENTE
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      missingSignature: !filters.missingSignature,
                    })
                  }
                  size="sm"
                  variant={filters.missingSignature ? "default" : "outline"}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <FileSignature className="h-4 w-4 min-h-4 min-w-4" />
                  FALTANDO ASSINATURA
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {projectsLoading ? <ProjetosSkeleton /> : null}
      {projectsError ? <ErrorComponent msg={getErrorMessage(projectErrorInstance)} /> : null}
      {projectsSuccess ? (
        <>
          <ProjectsAllocationsGrouped projectIds={projects.map((project) => project._id)} />
          <div className="mt-4 flex flex-wrap justify-around gap-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={index}
                handleOpenModal={() =>
                  setEditProjectModal({ isOpen: true, projectId: project._id })
                }
              />
            ))}
          </div>
        </>
      ) : null}

      {editProjectModal.isOpen && editProjectModal.projectId && (
        <ModalProjetos
          projectId={editProjectModal.projectId}
          modalIsOpen={editProjectModal.isOpen}
          session={session}
          closeModal={() => setEditProjectModal({ isOpen: false, projectId: null })}
        />
      )}
    </div>
  );
}
export default EngineeringDatabaseModePage;
function getProjectAccessGrantingStatusColors({
  accessGrantingResponseDateString,
}: {
  accessGrantingResponseDateString?: string;
}) {
  if (!accessGrantingResponseDateString) return "border border-primary/20";
  const accessGrantingResponseDate = dayjs(accessGrantingResponseDateString).toDate();
  const daysDiff = Math.abs(dayjs(CurrentDate).diff(dayjs(accessGrantingResponseDate), "day"));
  // const timeDiff = Math.abs(CurrentDate.getTime() - accessGrantingResponseDate.getTime());
  // const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (daysDiff > 110) {
    return "border-2 border-red-600";
  }
  if (daysDiff > 105) {
    return "border-2 border-yellow-500";
  }
  if (daysDiff > 90) {
    return "border-2 border-blue-700";
  }
  return "border border-primary/20";
}
function getProjectFlags(project: TEngineeringProjectDTO) {
  const homologationStatusValue = project.homologacao.status;
  const homologationStatusValueColor =
    homologationStatusValue === "APROVADO"
      ? "text-green-500"
      : homologationStatusValue === "REPROVADO"
        ? "text-red-500"
        : "text-primary";
  const homologationInspectionIsDone = !!project.homologacao.vistoria.dataEfetivacao;
  const executiveDiagramDone = !!project.homologacao.pendencias.diagramas;
  const executiveDrawingDone = !!project.homologacao.pendencias.desenhos;
  const projectIsDelivered = project.compra.statusEntrega === "ENTREGUE";
  const projectsDelivery = {
    label: projectIsDelivered ? "DATA DE ENTREGA" : "PREV. DE ENTREGA",
    value: projectIsDelivered
      ? formatDateAsLocale(project.compra.dataEntrega) || "-"
      : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
  };

  const timeSinceContractSignature = dayjs(project.contrato.dataAssinatura).diff(
    dayjs(CurrentDate),
    "day",
  );
  const timeSinceAccessGrantingRequest = project.homologacao.acesso.dataSolicitacao
    ? dayjs(project.homologacao.acesso.dataSolicitacao).diff(dayjs(CurrentDate), "day")
    : undefined;
  const timeSinceAccessGrantingResponse = project.homologacao.acesso.dataResposta
    ? dayjs(project.homologacao.acesso.dataResposta).diff(dayjs(CurrentDate), "day")
    : undefined;

  const isFastTrack = project.homologacao.fastTrack;

  return {
    homologationStatusFlag: {
      label: "STATUS DA HOMOLOGAÇÃO",
      value: homologationStatusValue,
      valueColor: homologationStatusValueColor,
    },
    homologationInspectionFlag: {
      label: "STATUS DA VISTORIA",
      value: homologationInspectionIsDone ? "FEITA" : "PENDENTE",
      valueColor: homologationInspectionIsDone ? "text-green-500" : "text-red-500",
    },
    executiveDiagramFlag: {
      label: "DIAGRAMA UNIFILAR",
      value: executiveDiagramDone ? "FEITO" : "PENDENTE",
      valueColor: executiveDiagramDone ? "text-green-500" : "text-red-500",
    },
    executiveDrawingFlag: {
      label: "DESENHO DO TELHADO",
      value: executiveDrawingDone ? "FEITO" : "PENDENTE",
      valueColor: executiveDrawingDone ? "text-green-500" : "text-red-500",
    },
    projectsDeliveryFlag: {
      label: projectIsDelivered ? "DATA DE ENTREGA" : "PREV. DE ENTREGA",
      value: projectIsDelivered
        ? formatDateAsLocale(project.compra.dataEntrega) || "-"
        : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
      valueColor: projectIsDelivered ? "text-green-500" : "text-red-500",
    },
    timeSinceContractSignatureFlag: {
      label: "DESDE ASS.CONTRATO",
      value: timeSinceContractSignature,
      valueColor: "text-primary",
    },
    timeSinceAccessGrantingRequestFlag: {
      label: "DESDE A SOLICITAÇÃO DE ACESSO",
      value: timeSinceAccessGrantingRequest ? `${timeSinceAccessGrantingRequest} DIAS` : "-",
      valueColor: "text-primary",
    },
    timeSinceAccessGrantingResponseFlag: {
      label: "DESDE A RESPOSTA DO PARECER",
      value: timeSinceAccessGrantingResponse ? `${timeSinceAccessGrantingResponse} DIAS` : "-",
      valueColor: "text-primary",
    },
    isFastTrackedFlag: {
      label: "FAST TRACK",
      value: isFastTrack ? "SIM" : "NÃO",
      valueColor: isFastTrack ? "text-green-500" : "text-red-500",
    },
  };
}
function ProjectCard({
  project,
  index,
  handleOpenModal,
}: {
  project: TEngineeringProjectDTO;
  handleOpenModal: (projectId: string) => void;
  index: number;
}) {
  const {
    homologationStatusFlag,
    homologationInspectionFlag,
    executiveDiagramFlag,
    executiveDrawingFlag,
    projectsDeliveryFlag,
    timeSinceContractSignatureFlag,
    timeSinceAccessGrantingRequestFlag,
    timeSinceAccessGrantingResponseFlag,
    isFastTrackedFlag,
  } = getProjectFlags(project);
  return (
    <motion.div
      onClick={() => {
        handleOpenModal(project._id);
      }}
      key={project._id}
      initial={{ opacity: 0, translateX: -50, translateY: -35 }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.01 * index }}
      className={cn(
        "dark:hover:bg-primary/10 w-full cursor-pointer hover:bg-blue-100 md:w-[350px] lg:w-[450px]",
        getProjectAccessGrantingStatusColors({
          accessGrantingResponseDateString: project.homologacao.acesso.dataResposta ?? undefined,
        }),
      )}
    >
      <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <p className="text-primary/70 text-xs">{project.nomeDoContrato}</p>
          <p className="text-xs text-[#15599a]">#{project.qtde}</p>
        </div>
        <ProjectCardsTags projectTags={project.etiquetas || []} />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xxs">{homologationStatusFlag.label}</span>
            <p className={cn("text-primary/80 text-xs", homologationStatusFlag.valueColor)}>
              {homologationStatusFlag.value}
            </p>
          </div>
          <div className="text-end">
            <span className="text-xxs text-end">{homologationInspectionFlag.label}</span>
            <p
              className={cn(
                "text-primary/80 text-center text-xs",
                homologationInspectionFlag.valueColor,
              )}
            >
              {homologationInspectionFlag.value}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xxs">{executiveDiagramFlag.label}</span>
            <p className={cn("text-xs uppercase", executiveDiagramFlag.valueColor)}>
              {executiveDiagramFlag.value}
            </p>
          </div>
          <div>
            <span className="text-xxs text-center">{projectsDeliveryFlag.label}</span>
            <p
              className={cn(
                "text-primary/80 text-center text-xs uppercase",
                projectsDeliveryFlag.valueColor,
              )}
            >
              {projectsDeliveryFlag.value}
            </p>
          </div>
          <div>
            <span className="text-xxs">{executiveDrawingFlag.label}</span>
            <p
              className={cn("text-primary/80 text-center text-xs", executiveDrawingFlag.valueColor)}
            >
              {executiveDrawingFlag.value}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-full flex-col">
            <span className="text-xxs">{timeSinceContractSignatureFlag.label}</span>
            <p
              className={cn(
                "text-start text-xs text-red-500 uppercase",
                timeSinceContractSignatureFlag.valueColor,
              )}
            >
              {timeSinceContractSignatureFlag.value}
            </p>
          </div>
          <div className="flex w-full flex-col">
            <span className="text-xxs text-end">{timeSinceAccessGrantingResponseFlag.label}</span>
            <p
              className={cn(
                "text-end text-xs text-red-500 uppercase",
                timeSinceAccessGrantingResponseFlag.valueColor,
              )}
            >
              {timeSinceAccessGrantingResponseFlag.value}
            </p>
          </div>
        </div>
        {project.homologacao.acesso.dataSolicitacao ? (
          <div className="flex w-full items-center justify-between">
            <p className="text-xxs">{timeSinceAccessGrantingRequestFlag.label}</p>
            <p
              className={cn(
                "text-primary/80 text-start text-xs",
                timeSinceAccessGrantingRequestFlag.valueColor,
              )}
            >
              {timeSinceAccessGrantingRequestFlag.value}
            </p>
          </div>
        ) : null}
        {project.homologacao.fastTrack ? (
          <div className="flex w-full items-center justify-center">
            <h1
              className={cn(
                "rounded px-2 py-1 text-[0.55rem] font-bold",
                isFastTrackedFlag.valueColor,
              )}
            >
              {isFastTrackedFlag.value}
            </h1>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

type ProjectsAllocationsGroupedProps = {
  projectIds: string[];
};
function ProjectsAllocationsGrouped({ projectIds }: ProjectsAllocationsGroupedProps) {
  const [openAllocationsGroupedMenu, setOpenAllocationsGroupedMenu] = useState(false);
  const [search, setSearch] = useState("");
  const { data: projectsAllocationsGrouped } = useProjectsAllocationsGrouped({
    projectIds,
    search,
  });

  console.log(projectsAllocationsGrouped);

  return (
    <div className="w-full flex items-center justify-end mt-4">
      <Button
        className="flex items-center gap-1 text-xs"
        onClick={() => setOpenAllocationsGroupedMenu((prev) => !prev)}
        size={"fit"}
        variant={"ghost"}
      >
        <Box className="w-3.5 h-3.5" />
        VISUALIZAR ALOCAÇÕES DE MATERIAL
      </Button>
      {openAllocationsGroupedMenu ? (
        <ResponsiveDialogDrawerViewOnly
          menuTitle="ALOCAÇÕES DE MATERIAL"
          menuDescription="Visualize aqui as alocações de material para os projetos em visualização."
          menuCancelButtonText="FECHAR"
          stateIsLoading={false}
          closeMenu={() => setOpenAllocationsGroupedMenu(false)}
        >
          <div className="w-full flex flex-col gap-2 px-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar material"
              className="w-full text-xs py-0.5 h-fit rounded"
            />
            {projectsAllocationsGrouped?.map((allocation) => (
              <div
                key={allocation.material.id}
                className="w-full flex flex-col gap-1 p-2 rounded border border-primary/20 shadow-xs"
              >
                <div className="flex items-center gap-2 justify-between">
                  <h1 className="text-primary text-sm font-bold tracking-tight">
                    {allocation.material.nome}
                  </h1>
                </div>
                <div className="w-full flex items-center gap-2 justify-between flex-col lg:flex-row">
                  <div className="flex items-center gap-1">
                    <Box className="w-3.5 h-3.5" />
                    <p className="text-[0.65rem] font-bold tracking-tight">
                      {allocation.material.quantidade} {allocation.material.unidade} EM ESTOQUE
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-blue-200 rounded-md px-2 py-1">
                      <h1 className="text-[0.65rem] font-bold tracking-tight text-blue-600">
                        {allocation.quantidadePrevista} {allocation.material.unidade} PREVISTOS
                      </h1>
                    </div>
                    <div className="flex items-center gap-1 bg-green-200 rounded-md px-2 py-1">
                      <h1 className="text-[0.65rem] font-bold tracking-tight text-green-600">
                        {allocation.quantidade} {allocation.material.unidade} ALOCADOS
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResponsiveDialogDrawerViewOnly>
      ) : null}
    </div>
  );
}
