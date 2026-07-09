import dayjs from "dayjs";
import { motion } from "framer-motion";
import React, { useState } from "react";

import ModalProjetos from "@/components/ModalProjetos";
import TagTipoDeServico from "@/components/TagTipoDeServico";
import ProjetosSkeleton from "@/components/skeletons/ProjetosSkeleton";

import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useTags } from "@/utils/methods/query/tags";
import { useEngineeringProjects } from "@/utils/methods/query/engineering";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectCardsTags from "@/components/utils/ProjectCardsTags";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import type { TEngineeringProjectDTO } from "@/pages/api/projects/engenharia";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useProjectsAllocationsGrouped } from "@/utils/methods/query/projects";
import { useViewModesStore } from "@/utils/stores/view-modes-store";
import { Box } from "lucide-react";
import { FaRotate } from "react-icons/fa6";
import EngineeringProjectsFilters from "./EngineeringProjectsFilters";
import EngineeringStats from "./Stats";

const CurrentDate = dayjs().toDate();

type EngineeringDatabaseModePageProps = {
  session: TAuthSession;
};
function EngineeringDatabaseModePage({ session }: EngineeringDatabaseModePageProps) {
  const updateViewMode = useViewModesStore((state) => state.updateMode);
  const [editProjectModal, setEditProjectModal] = useState<{
    isOpen: boolean;
    projectId: string | null;
  }>({ isOpen: false, projectId: null });
  const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });

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
      <div className="border-border flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              Projetos no estágio de engenharia
            </p>
            <button
              type="button"
              onClick={() => updateViewMode("engineering", "kanban")}
              className="text-foreground hover:text-foreground flex items-center gap-1 px-2 text-xs duration-300 ease-out"
            >
              <FaRotate />
              <h1 className="font-medium">ALTERAR MODO</h1>
            </button>
          </div>
        </div>
        <EngineeringStats />
        <EngineeringProjectsFilters
          filters={filters}
          setFilters={setFilters}
          tagOptions={tags?.map((t) => ({ id: t._id, value: t._id, label: t.titulo })) ?? []}
        />
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
  if (!accessGrantingResponseDateString) return "border border-border";
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
  return "border border-border";
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
          <p className="text-foreground text-xs">{project.nomeDoContrato}</p>
          <p className="text-xs text-[#15599a]">#{project.qtde}</p>
        </div>
        <ProjectCardsTags projectTags={project.etiquetas || []} />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xxs">{homologationStatusFlag.label}</span>
            <p className={cn("text-foreground text-xs", homologationStatusFlag.valueColor)}>
              {homologationStatusFlag.value}
            </p>
          </div>
          <div className="text-end">
            <span className="text-xxs text-end">{homologationInspectionFlag.label}</span>
            <p
              className={cn(
                "text-foreground text-center text-xs",
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
                "text-foreground text-center text-xs uppercase",
                projectsDeliveryFlag.valueColor,
              )}
            >
              {projectsDeliveryFlag.value}
            </p>
          </div>
          <div>
            <span className="text-xxs">{executiveDrawingFlag.label}</span>
            <p
              className={cn("text-foreground text-center text-xs", executiveDrawingFlag.valueColor)}
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
                "text-foreground text-start text-xs",
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
                className="w-full flex flex-col gap-1 p-2 rounded border border-border shadow-xs"
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
