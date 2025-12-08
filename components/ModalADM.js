import { useKey } from "@/utils/hooks";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useClientById } from "@/utils/methods/query/clients";
import { useProjectUpdateLogs } from "@/utils/methods/query/project-update-logs";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import { useSession } from "../components/providers/SessionProvider";
import { cidadesAtendidas, equipesTecnicas, fornecedores, vendedores } from "../utils/constants";
import DateInput from "./DateInput";
import NotificationCreationBlock from "./NotificationCreationBlock";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import InfoAnexosBlock from "./blocosInfoProjeto/InfoAnexosBlock";
import InfoArquivosBlock from "./blocosInfoProjeto/InfoArquivosBlock";
import InfoAtividadesBlock from "./blocosInfoProjeto/InfoAtividadesBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoDespesasBlock from "./blocosInfoProjeto/InfoDespesasBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoEtiquetasBlock from "./blocosInfoProjeto/InfoEtiquetasBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoReceitasBlock from "./blocosInfoProjeto/InfoReceitasBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoVendaBlock from "./blocosInfoProjeto/InfoVendaBlock";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import SaveButton from "./utils/Buttons/SaveButton";
import LoadingPage from "./utils/LoadingPage";

function ModalADM({ projectId, modalIsOpen, closeModal }) {
	useKey("Escape", () => closeModal());
	const { session } = useSession({});
	const queryClient = useQueryClient();
	const { data: project, isSuccess, isLoading, isError, error } = useClientById({ id: projectId, enabled: !!projectId });
	const { data: updateLogs } = useProjectUpdateLogs({ projectId });
	const [infoHolder, setInfo] = useState(project);
	const [changes, setChanges] = useState({});

	const { mutate } = useMutationWithFeedback({
		mutationKey: ["update-project"],
		mutationFn: updateProject,
		affectedQueryKey: ["project-by-id", projectId], // ['adm-projects'],
		queryClient: queryClient,
		callbackFn: async () => {
			setChanges({});
			await queryClient.invalidateQueries({ queryKey: ["adm-projects"] });
		},
	});
	const errorMsg = getErrorMessage(error);
	useEffect(() => {
		setInfo(project);
	}, [project]);

	return (
		<>
			<AnimatedModalWrapper modalIsOpen={modalIsOpen}>
				<div className="flex h-full flex-col overflow-y-auto overscroll-y-auto">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<div className="flex items-center gap-2">
							<h1 className="pl-6 font-bold text-[#15599a]">{project ? `${project.qtde} - ${project.nomeDoContrato}` : "CARREGANDO..."}</h1>
							{project?.codigoSVB && <p className="text-primary/80 text-sm font-bold">#{project.codigoSVB}</p>}
						</div>
						<div className="flex items-center gap-x-2">
							{/* {msg.text && <p className={`hidden lg:block text-sm italic ${msg.color}`}>{msg.text}</p>} */}
							<SaveButton text={"Salvar alterações"} icon={<FaSave />} handleClick={() => mutate({ id: projectId, changes: changes })} />
							<button type="button">
								<VscChromeClose onClick={() => closeModal(false)} style={{ color: "red" }} />
							</button>
						</div>
						{/* <p className={`block lg:hidden text-sm italic ${msg.color}`}>{msg.text}</p> */}
					</div>
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorPage msg={errorMsg} /> : null}
					{isSuccess && infoHolder && session ? (
						<div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full flex-col gap-y-2 overflow-y-auto">
							<NotificationCreationBlock session={session} nomeDoProjeto={project.nomeDoContrato} codProjeto={project.qtde} />
							<InfoAtividadesBlock projectId={projectId} projectName={project.nomeDoContrato} projectIdentifier={project.qtde} session={session} />
							<InfoVendaBlock
								editor={false}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								project={project}
								updateLogs={updateLogs || []}
							/>
							<InfoEtiquetasBlock session={session} infoHolder={infoHolder} setInfo={setInfo} changes={changes} setChanges={setChanges} project={project} />
							<InfoReceitasBlock
								session={session}
								project={infoHolder}
								projectId={projectId}
								projectName={infoHolder.nomeDoContrato}
								projectIdentificator={project.qtde}
							/>
							<InfoDespesasBlock projectId={infoHolder._id} projectName={infoHolder.nomeDoContrato} projectIdentifier={project.qtde.toString()} />
							{!["OPERAÇÃO E MANUTENÇÃO", "BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(infoHolder.tipoDeServico) ? (
								<InfoPadraoBlock
									comercialEdition={false}
									technicalEdition={false}
									infoHolder={infoHolder}
									setInfo={setInfo}
									changes={changes}
									setChanges={setChanges}
									updateLogs={updateLogs || []}
									showPaymentInfo={true}
									showPaymentOnly={true}
								/>
							) : null}
							{!["TROCA DE PADRÃO", "REFORMA DE PADRÃO", "SUBESTAÇÃO DE ENERGIA"].includes(infoHolder.tipoDeServico) && (
								<InfoEstruturaBlock
									comercialEdition={false}
									technicalEdition={false}
									project={project}
									infoHolder={infoHolder}
									setInfo={setInfo}
									changes={changes}
									setChanges={setChanges}
									updateLogs={updateLogs || []}
									showPaymentInfo={true}
								/>
							)}
							<InfoContratoBlock
								editor={false}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								updateLogs={updateLogs || []}
								minimalInfo={true}
								showPaymentInfo={true}
							/>
							<InfoPagamentoBlock
								editor={true}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								updateLogs={updateLogs || []}
								showADMOnly={true}
							/>
							{infoHolder.tipoDeServico !== "MONTAGEM E DESMONTAGEM" && (
								<InfoCompraBlock
									editor={true}
									session={session}
									infoHolder={infoHolder}
									project={project}
									setInfo={setInfo}
									changes={changes}
									setChanges={setChanges}
									updateLogs={updateLogs || []}
									showDeliveryInfoOnly={false}
									showMonetaryValues={true}
								/>
							)}
							<InfoSistemaBlock
								editor={false}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								updateLogs={updateLogs || []}
								showPaymentInfo={true}
							/>
							<InfoObrasBlock
								editor={false}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								updateLogs={updateLogs || []}
								project={project}
							/>
							<InfoMaterialBlock
								editor={true}
								infoHolder={infoHolder}
								setInfo={setInfo}
								changes={changes}
								setChanges={setChanges}
								updateLogs={updateLogs || []}
							/>
							<InfoAnexosBlock projectId={projectId} project={infoHolder} session={session} />
						</div>
					) : null}
				</div>
			</AnimatedModalWrapper>
		</>
	);
}

export default ModalADM;
