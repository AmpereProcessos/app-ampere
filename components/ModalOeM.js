import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";

import SaveButton from "./utils/Buttons/SaveButton";
import ProjectServiceOrders from "./identificador/ordensDeServico/ProjectServiceOrders";
import NotificationCreationBlock from "./NotificationCreationBlock";

import OSCreationBlock from "./OSCreationBlock";

import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoVendaBlock from "./blocosInfoProjeto/InfoVendaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";

import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";

import ExecutionCommissioningBlock from "./blocosInfoProjeto/InfoComissionamentoBlock";
import OeMBlock from "./blocosInfoProjeto/InfoOeMBlock";

import { useMutationWithFeedback } from "../utils/methods/mutation/general-hook";
import { handleOeMUpdate } from "../utils/methods/mutation/oem";
import { useClientById } from "@/utils/methods/query/clients";

import { useKey } from "../utils/hooks";
import LoadingPage from "./utils/LoadingPage";
import ErrorPage from "./utils/ErrorPage";
import { useProjectUpdateLogs } from "@/utils/methods/query/project-update-logs";
import { useSession } from "../components/providers/SessionProvider";
import InfoHomologacaoBlock from "./blocosInfoProjeto/InfoHomologacaoBlock";
import { getErrorMessage } from "@/utils/methods/handlers";
import InfoAnexosBlock from "./blocosInfoProjeto/InfoAnexosBlock";
import InfoEtiquetasBlock from "./blocosInfoProjeto/InfoEtiquetasBlock";
function ModalOeM({ projectId, closeModal, modalIsOpen }) {
  const { session } = useSession({});
  const queryClient = useQueryClient();
  useKey("Escape", () => closeModal());
  const {
    data: project,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useClientById({ id: projectId, enabled: !!projectId });
  const { data: updateLogs } = useProjectUpdateLogs({ projectId });
  const [infoHolder, setInfo] = useState({});
  const [changes, setChanges] = useState({});

  const { mutate: updateProject } = useMutationWithFeedback({
    mutationKey: ["update-project"],
    mutationFn: handleOeMUpdate,
    affectedQueryKey: ["project-by-id", projectId],
    queryClient: queryClient,
    callbackFn: async () => {
      setChanges({});
      await queryClient.invalidateQueries({ queryKey: ["oem-projects"] });
    },
  });

  const errorMsg = getErrorMessage(error);
  useEffect(() => {
    if (project) setInfo(project);
  }, [project]);
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex h-full flex-col overflow-y-auto overscroll-y-auto">
          <div className="border-border flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
            <div className="flex items-center gap-2">
              <h1 className="pl-6 font-bold text-[#15599a]">
                {infoHolder?.qtde} - {infoHolder?.nomeDoContrato}
              </h1>
              {infoHolder?.codigoSVB && (
                <p className="text-foreground text-sm font-bold">#{infoHolder?.codigoSVB}</p>
              )}
            </div>

            <div className="flex items-center gap-x-2">
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={() =>
                  updateProject({
                    previousData: project,
                    newData: infoHolder,
                    changes: changes,
                    queryClient: queryClient,
                  })
                }
              />
              <button type="button">
                <VscChromeClose onClick={() => closeModal()} style={{ color: "red" }} />
              </button>
            </div>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorPage msg={errorMsg} /> : null}
          {isSuccess && infoHolder?._id && session ? (
            <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-2 overflow-y-auto">
              <NotificationCreationBlock
                session={session}
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
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
              <ExecutionCommissioningBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <OeMBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                project={project}
              />
              <ProjectServiceOrders
                projectId={project._id}
                session={session}
                projectMainServiceOrderId={infoHolder.idOrdemServico}
              />
              {/* <OSCreationBlock project={infoHolder} /> */}
              <InfoVisitaTecnicaBlock
                editor={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                analysisId={project.idVisitaTecnica}
                session={session}
              />
              {!["BOMBA SOLAR", "OPERAÇÃO E MANUTENÇÃO"].includes(project.tipoDeServico) ? (
                <InfoPadraoBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={false}
                />
              ) : null}

              {!["TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(
                infoHolder.tipoDeServico,
              ) && (
                <InfoEstruturaBlock
                  comercialEdition={false}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showPaymentInfo={false}
                />
              )}
              {!["MONTAGEM E DESMONTAGEM", "OPERAÇÃO E MANUTENÇÃO"].includes(
                project.tipoDeServico,
              ) ? (
                <InfoCompraBlock
                  editor={false}
                  session={session}
                  infoHolder={infoHolder}
                  project={project}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                  showDeliveryInfoOnly={true}
                  showMonetaryValues={false}
                />
              ) : null}
              {/* {!['BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(infoHolder.tipoDeServico) && (
                <InfoDadosConcessionariaBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                />
              )} */}
              {!["TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(
                infoHolder.tipoDeServico,
              ) && (
                <InfoSistemaBlock
                  editor={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  updateLogs={updateLogs || []}
                />
              )}
              {![
                "OPERAÇÃO E MANUTENÇÃO",
                "BOMBA SOLAR",
                "SISTEMA FOTOVOLTAICO (OFF GRID)",
              ].includes(project.tipoDeServico) ? (
                <InfoHomologacaoBlock
                  session={session}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                /> // <InfoProjetoBlock
              ) : //   editor={false}
              //   infoHolder={infoHolder}
              //   setInfo={setInfo}
              //   changes={changes}
              //   setChanges={setChanges}
              //   updateLogs={updateLogs || []}
              //   project={project}
              // />
              null}
              <InfoObrasBlock
                session={session}
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                updateLogs={updateLogs || []}
                project={project}
              />
              <InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
              {/* <InfoArquivosBlock
                project={project}
                infoHolder={infoHolder}
                categories={[
                  { label: 'DOCUMENTOS', value: 'links.documentos' },
                  { label: 'PROJETOS', value: 'links.projetos' },
                  { label: 'OBRAS', value: 'links.obras' },
                  {
                    label: 'MANUTENÇÃO PREVENTIVA',
                    value: 'links.manutencaoPreventiva',
                  },
                  {
                    label: 'MANUTENÇÃO CORRETIVA',
                    value: 'links.manutencaoCorretiva',
                  },
                ]}
              /> */}
            </div>
          ) : null}
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalOeM;
