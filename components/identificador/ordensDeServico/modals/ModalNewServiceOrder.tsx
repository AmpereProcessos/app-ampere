import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscChromeClose } from "react-icons/vsc";
import { getErrorMessage } from "../../../../utils/methods/handlers";
import { createServiceOrder } from "../../../../utils/methods/mutation/service-orders";

import CheckboxInput from "@/components/inputs/Checkbox";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import type { TAuthSession } from "@/lib/authentication/types";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useServiceOrderProject } from "@/utils/methods/query/service-orders";
import { getAvailableProjectMaterials, getMissingProjectMaterials, getServiceObservationsFromObras } from "@/utils/methods/util/service-order";
import { TProjectDTO } from "@/utils/schemas/projects";
import type { TServiceOrder, TServiceOrderDTO } from "@/utils/schemas/service-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipesTecnicas } from "../../../../utils/constants";
import ServiceOrderCalendarIntegration from "./blocos/CalendarIntegration";
import ServiceOrderDetailsInformationBlock from "./blocos/DetailsInformationBlock";
import ServiceOrderEquipmentsInformationBlock from "./blocos/EquipmentsInformationBlock";
import ServiceOrderExecutionInformationBlock from "./blocos/ExecutionInformationBlock";
import ServiceOrderGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ServiceOrderLocationInformationBlock from "./blocos/LocationInformationBlock";
import ServiceOrderProjectInformationBlock from "./blocos/ProjectInformationBlock";
import ServiceOrderScheduling from "./blocos/SchedulingInformationBlock";
import ServiceOrderTagsBlock from "./blocos/TagsBlock";
import ServiceOrderTechnicalAnalysisInformationBlock from "./blocos/TechnicalAnalysisBlock";
import ServiceOrderObservationsBlock from "./blocos/utils/Observations";
import ServiceOrderProjectVinculation from "./blocos/utils/ProjectVinculation";

type ModalNewServiceOrderProps = {
	session: TAuthSession;
	projectId?: string;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function ModalNewServiceOrder({ session, closeModal, callbacks, projectId }: ModalNewServiceOrderProps) {
	const queryClient = useQueryClient();

	const initialState: TServiceOrder = {
		categoria: "MONTAGEM",
		favorecido: {
			nome: "",
			contato: "",
		},
		anotacoes: "",
		projeto: {
			id: projectId,
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
	function resetInfoHolder() {
		setOsInfo(initialState);
	}
	const { data: project } = useServiceOrderProject({ projectId: osInfo.projeto.id || null });
	function useProjectInLocoEquipmentsInformation() {
		const availableMaterials = getAvailableProjectMaterials(project?.compra?.kitInfo || "");
		if (availableMaterials.length === 0) return toast.error("Não há materiais disponíveis definidos para o projeto.");
		setOsInfo((prev) => ({
			...prev,
			equipamentos: { ...prev.equipamentos, disponivel: availableMaterials },
		}));
	}
	function useProjectToTakeEquipmentsInformation() {
		const missingMaterials = getMissingProjectMaterials(project?.material?.materialFaltante || "");
		if (missingMaterials.length === 0) return toast.error("Não há materiais de retirada definidos para o projeto.");
		setOsInfo((prev) => ({
			...prev,
			equipamentos: { ...prev.equipamentos, retirada: missingMaterials },
		}));
	}

	const { mutate: handleCreateServiceOrder, isPending } = useMutation({
		mutationKey: ["create-project-service-order"],
		mutationFn: createServiceOrder,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			return toast.success(data);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
			resetInfoHolder();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			return toast.error(msg);
		},
	});
	useEffect(() => {
		if (project) {
			setOsInfo((prev) => ({
				...prev,
				projeto: { id: projectId, nome: project?.nomeDoContrato, identificador: project?.qtde, tipo: project?.tipoDeServico },
			}));
		}
	}, [project]);
	return (
		<div className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
			<motion.div
				initial={{ opacity: 0.3 }}
				animate={{ opacity: 1 }}
				className="bg-background fixed top-[50%] left-[50%] z-100 h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[80%]"
			>
				<div className="flex h-full w-full flex-col">
					<div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-primary dark:text-white">NOVA ORDEM DE SERVIÇO</h3>
						<button
							onClick={closeModal}
							type="button"
							className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
						>
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					<div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full w-full flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-y-auto px-2 py-4">
						<ServiceOrderGeneralInformationBlock
							infoHolder={osInfo as TServiceOrderDTO}
							project={project || undefined}
							predefinedCategories={[]}
							updateInfoHolder={updateInfoHolder}
						/>
						{project ? (
							<ServiceOrderProjectInformationBlock project={project} infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						) : (
							<ServiceOrderProjectVinculation
								serviceOrderId={undefined}
								queryClient={queryClient}
								affectedQueryKey={[]}
								infoHolder={osInfo}
								updateInfoHolder={updateInfoHolder}
							/>
						)}
						<ServiceOrderTechnicalAnalysisInformationBlock technicalAnalysisId={osInfo.idAnaliseTecnica} />
						<ServiceOrderTagsBlock session={session} infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderLocationInformationBlock
							infoHolder={osInfo as TServiceOrderDTO}
							project={project || undefined}
							updateInfoHolder={updateInfoHolder}
						/>
						<ServiceOrderEquipmentsInformationBlock
							infoHolder={osInfo}
							project={project || undefined}
							updateInfoHolder={updateInfoHolder}
							useProjectInLocoEquipmentsInformation={project ? useProjectInLocoEquipmentsInformation : undefined}
							useProjectToTakeEquipmentsInformation={project ? useProjectToTakeEquipmentsInformation : undefined}
						/>

						<ServiceOrderCalendarIntegration infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderScheduling infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderDetailsInformationBlock infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderExecutionInformationBlock
							infoHolder={osInfo}
							updateInfoHolder={updateInfoHolder}
							projectObservations={project?.obra?.observacoes || undefined}
						/>
					</div>
					<div className="border-primary/20 mt-2 flex w-full items-center justify-end border-t px-4 py-1">
						<LoadingButton
							// @ts-ignore
							onClick={() => handleCreateServiceOrder({ info: osInfo })}
							loading={isPending}
						>
							CRIAR ORDEM DE SERVIÇO
						</LoadingButton>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default ModalNewServiceOrder;
