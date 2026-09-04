import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { equipesTecnicas, projetistas, vendedores } from "../utils/constants";
import { useKey } from "../utils/hooks";
import NotificationCreationBlock from "./NotificationCreationBlock";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../components/providers/SessionProvider";
import { getErrorMessage } from "../utils/methods/handlers";
import { updateProject } from "../utils/methods/mutation/clients";
import { handleEngineeringUpdate } from "../utils/methods/mutation/engineering";
import { useMutationWithFeedback } from "../utils/methods/mutation/general-hook";
import { useClientById } from "../utils/methods/query/clients";
import { useProjectUpdateLogs } from "../utils/methods/query/project-update-logs";
import InfoAnexosBlock from "./blocosInfoProjeto/InfoAnexosBlock";
import InfoAtividadesBlock from "./blocosInfoProjeto/InfoAtividadesBlock";
// TESTING
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
// TESTING
import InfoHomologacaoBlock from "./blocosInfoProjeto/InfoHomologacaoBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoVendaBlock from "./blocosInfoProjeto/InfoVendaBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import ProjectServiceOrders from "./identificador/ordensDeServico/ProjectServiceOrders";
import SaveButton from "./utils/Buttons/SaveButton";
import ErrorPage from "./utils/ErrorPage";
import LoadingPage from "./utils/LoadingPage";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/media-query";
import type { TProjectDTO, TProjectWithClientDTO } from "@/utils/schemas/projects";
import { toast } from "react-hot-toast";
import { handleUpdateClientPersonalized } from "../utils/methods/mutation/crm/clients";
import InfoEtiquetasBlock from "./blocosInfoProjeto/InfoEtiquetasBlock";
import { Button } from "./ui/button";
import { LoadingButton } from "./utils/Buttons/LoadingButton";
import LoadingComponent from "./utils/LoadingComponent";

type ModalProjetosProps = {
  projectId: string;
  session: TAuthSession;
  modalIsOpen: boolean;
  closeModal: () => void;
};
function ModalProjetos({ projectId, session, modalIsOpen, closeModal }: ModalProjetosProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useKey("Escape", () => closeModal());
  const queryClient = useQueryClient();
  const {
    data: project,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useClientById({ id: projectId, enabled: !!projectId });
  const { data: updateLogs } = useProjectUpdateLogs({ projectId });
  const [infoHolder, setInfo] = useState<TProjectDTO>(project as TProjectDTO);
  const [changes, setChanges] = useState({});
  const [clientChanges, setClientChanges] = useState({});

  const { mutate: updateProjectMutation, isPending } = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async ({
      previousData,
      newData,
      changes,
      queryClient,
    }: {
      previousData: TProjectDTO;
      newData: TProjectDTO;
      changes: Record<string, any>;
      queryClient: QueryClient;
    }) => {
      await handleEngineeringUpdate({ previousData, newData, changes, queryClient });
      await handleUpdateClientPersonalized({
        id: previousData.idClienteCRM || "",
        changes: clientChanges,
      });
      return "Atualizações feitas com sucesso !";
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["project-by-id", projectId] });
    },
    onSuccess: (data) => {
      toast.success(data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["project-by-id", projectId] });
    },
  });

  const errorMsg = getErrorMessage(error);
  useEffect(() => {
    if (project) setInfo(project);
  }, [project]);

  const MENU_TITLE = project
    ? `${project?.qtde} - ${project?.nomeDoContrato}`
    : "Carregando informações...";
  const MENU_DESCRIPTION = "Gerencie as informações do projeto.";
  const BUTTON_TEXT = "SALVAR ALTERAÇÕES";
  return isDesktop ? (
    <Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DialogContent className="dark:bg-background flex max-h-[80vh] min-h-[80vh] min-w-[80vw] flex-col">
        <DialogHeader>
          <DialogTitle>{MENU_TITLE}</DialogTitle>
          <DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
        </DialogHeader>

        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
        {isSuccess && infoHolder ? (
          <>
            <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
              <NotificationCreationBlock
                session={session}
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde.toString()}
              />
              <InfoAtividadesBlock
                projectId={projectId}
                projectName={project.nomeDoContrato}
                projectIdentifier={project.qtde}
                session={session}
              />
              <InfoClienteBlock
                editable={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                clientChanges={clientChanges}
                setClientChanges={setClientChanges}
              />
              <InfoVendaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
                updateLogs={updateLogs || []}
              />
              <InfoEtiquetasBlock
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
              <InfoHomologacaoBlock
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">
                  COMISSIONAMENTO
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO COMERCIAL
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={!!infoHolder.comissionamento?.comercial}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.comercial": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              comercial: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoComercial"
                        id="comissionamentoComercial"
                      />
                      <label className="ml-2" htmlFor="comissionamentoComercial">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO DE SUPRIMENTOS
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={!!infoHolder.comissionamento?.suprimentos}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.suprimentos": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              suprimentos: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoSuprimentos"
                        id="comissionamentoSuprimentos"
                      />
                      <label className="ml-2" htmlFor="comissionamentoSuprimentos">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO PROJETOS
                    </span>
                    <div className="flex">
                      <input
                        disabled={!false}
                        checked={!!infoHolder.comissionamento?.projetos}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.projetos": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              projetos: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoProjetos"
                        id="comissionamentoProjetos"
                      />
                      <label className="ml-2" htmlFor="comissionamentoProjetos">
                        OK
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {project.idVisitaTecnica ? (
                <InfoVisitaTecnicaBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  analysisId={project.idVisitaTecnica}
                  session={session}
                />
              ) : null}

              {![
                "OPERAÇÃO E MANUTENÇÃO",
                "BOMBA SOLAR",
                "SISTEMA FOTOVOLTAICO (OFF GRID)",
              ].includes(infoHolder.tipoDeServico) && (
                <InfoPadraoBlock
                  comercialEdition={true}
                  technicalEdition={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={false}
                  showPaymentOnly={false}
                />
              )}
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                showPaymentInfo={true}
              />
              {infoHolder.tipoDeServico !== "MONTAGEM E DESMONTAGEM" && (
                <InfoCompraBlock
                  editor={true}
                  session={session}
                  project={project}
                  comercialEditionOnly={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
                />
              )}

              <InfoObrasBlock
                editor={true}
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
                showMaterialInfo={false}
                showDeliveryInfo={false}
              />
              <ProjectServiceOrders
                projectId={projectId}
                session={session}
                projectMainServiceOrderId={infoHolder.idOrdemServico}
              />
              <InfoMaterialBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
                showCircuitBreakers={true}
                circuitBreakerAddition={true}
              />
              <InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">FECHAR</Button>
              </DialogClose>
              <LoadingButton
                onClick={() =>
                  updateProjectMutation({
                    previousData: project,
                    newData: infoHolder,
                    changes: changes,
                    queryClient: queryClient,
                  })
                }
                loading={isPending}
              >
                {BUTTON_TEXT}
              </LoadingButton>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DrawerContent className="flex h-fit max-h-[70vh] flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>{MENU_TITLE}</DrawerTitle>
          <DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
        </DrawerHeader>
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorPage msg={getErrorMessage(error)} /> : null}
        {isSuccess && infoHolder ? (
          <>
            <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
              <NotificationCreationBlock
                session={session}
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde.toString()}
              />
              <InfoAtividadesBlock
                projectId={projectId}
                projectName={project.nomeDoContrato}
                projectIdentifier={project.qtde}
                session={session}
              />
              <InfoClienteBlock
                editable={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                clientChanges={clientChanges}
                setClientChanges={setClientChanges}
              />
              <InfoVendaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
                updateLogs={updateLogs || []}
              />
              <InfoEtiquetasBlock
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <InfoHomologacaoBlock
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">
                  COMISSIONAMENTO
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO COMERCIAL
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={infoHolder.comissionamento?.comercial}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.comercial": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              comercial: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoComercial"
                        id="comissionamentoComercial"
                      />
                      <label className="ml-2" htmlFor="comissionamentoComercial">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO DE SUPRIMENTOS
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={infoHolder.comissionamento?.suprimentos}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.suprimentos": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              suprimentos: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoSuprimentos"
                        id="comissionamentoSuprimentos"
                      />
                      <label className="ml-2" htmlFor="comissionamentoSuprimentos">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex w-[350px] flex-col items-center">
                    <span className="font-raleway text-center text-sm font-bold uppercase">
                      COMISSIONAMENTO PROJETOS
                    </span>
                    <div className="flex">
                      <input
                        disabled={!false}
                        checked={infoHolder.comissionamento?.projetos}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.projetos": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              projetos: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoProjetos"
                        id="comissionamentoProjetos"
                      />
                      <label className="ml-2" htmlFor="comissionamentoProjetos">
                        OK
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {project.idVisitaTecnica ? (
                <InfoVisitaTecnicaBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  analysisId={project.idVisitaTecnica}
                  session={session}
                />
              ) : null}

              {![
                "OPERAÇÃO E MANUTENÇÃO",
                "BOMBA SOLAR",
                "SISTEMA FOTOVOLTAICO (OFF GRID)",
              ].includes(infoHolder.tipoDeServico) && (
                <InfoPadraoBlock
                  comercialEdition={true}
                  technicalEdition={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={false}
                />
              )}
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                showPaymentInfo={true}
              />
              {infoHolder.tipoDeServico !== "MONTAGEM E DESMONTAGEM" && (
                <InfoCompraBlock
                  editor={true}
                  session={session}
                  project={project}
                  comercialEditionOnly={true}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showDeliveryInfoOnly={false}
                  showMonetaryValues={true}
                />
              )}

              <InfoObrasBlock
                editor={true}
                session={session}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <ProjectServiceOrders
                projectId={projectId}
                session={session}
                projectMainServiceOrderId={infoHolder.idOrdemServico}
              />
              <InfoMaterialBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
                showCircuitBreakers={true}
                circuitBreakerAddition={true}
              />
              <InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">FECHAR</Button>
              </DrawerClose>
              <LoadingButton
                onClick={() =>
                  updateProjectMutation({
                    previousData: project,
                    newData: infoHolder,
                    changes: changes,
                    queryClient: queryClient,
                  })
                }
                loading={isPending}
              >
                {BUTTON_TEXT}
              </LoadingButton>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

export default ModalProjetos;
