import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createServiceOrder, updateServiceOrder } from "../../../../utils/methods/mutation/service-orders";
import { getErrorMessage } from "../../../../utils/methods/handlers";
import { VscChromeClose } from "react-icons/vsc";

import { equipesTecnicas } from "../../../../utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TProjectDTO } from "@/utils/schemas/projects";
import type { Session } from "next-auth";
import type { TServiceOrder, TServiceOrderDTO } from "@/utils/schemas/service-order";
import { getServiceObservationsFromObras } from "@/utils/methods/util/service-order";
import ServiceOrderObservationsBlock from "./blocos/utils/Observations";
import CheckboxInput from "@/components/inputs/Checkbox";
import ServiceOrderGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ServiceOrderLocationInformationBlock from "./blocos/LocationInformationBlock";
import ServiceOrderEquipmentsInformationBlock from "./blocos/EquipmentsInformationBlock";
import ServiceOrderDetailsInformationBlock from "./blocos/DetailsInformationBlock";
import ServiceOrderTagsBlock from "./blocos/TagsBlock";
import ServiceOrderCalendarIntegration from "./blocos/CalendarIntegration";
import ServiceOrderScheduling from "./blocos/SchedulingInformationBlock";
import ServiceOrderExecutionInformationBlock from "./blocos/ExecutionInformationBlock";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useServiceOrderById, useServiceOrderProject } from "@/utils/methods/query/service-orders";
import ServiceOrderProjectVinculation from "./blocos/utils/ProjectVinculation";
import ServiceOrderProjectInformationBlock from "./blocos/ProjectInformationBlock";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import ServiceOrderFileReferences from "./blocos/AttachmentsBlock";
import ServiceOrderPendenciesBlock from "./blocos/PendenciesBlock";
import { updateProject } from "@/utils/methods/mutation/clients";
import ServiceOrderTechnicalAnalysisInformationBlock from "./blocos/TechnicalAnalysisBlock";

type ModalControlServiceOrderProps = {
	serviceOrderId: string;
	session: Session;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function ModalControlServiceOrder({ session, serviceOrderId, closeModal, callbacks }: ModalControlServiceOrderProps) {
	const queryClient = useQueryClient();

	const { data: serviceOrder, isLoading, isError, isSuccess, error } = useServiceOrderById({ id: serviceOrderId });
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

	async function handleUpdateServiceOrder({ id, changes }: { id: string; changes: Partial<TServiceOrder> }) {
		try {
			await updateServiceOrder({ id, changes });
			const projectId = serviceOrder?.projeto?.id;
			if (projectId) {
				await updateProject({
					id: projectId,
					changes: {
						"obra.entrada": osInfo.periodo.inicio,
						"obra.saida": osInfo.periodo.fim,
						"obra.statusDaObra": osInfo.status,
						"obra.equipeResp": osInfo.responsavel.nome,
						"obra.observacoes": osInfo.observacoes.join("/"),
					},
				});
			}
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
		<div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<motion.div
				initial={{ opacity: 0.3 }}
				animate={{ opacity: 1 }}
				className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[80%]"
			>
				<div className="flex h-full w-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-[#353432] dark:text-white ">EDITAR ORDEM DE SERVIÇO</h3>
						<button onClick={closeModal} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							<div className="flex h-full w-full flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-y-auto px-2 py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
								<div className="flex w-full flex-wrap items-center justify-center gap-2">
									<Link href={`/ordens-de-servico/pdf/${serviceOrderId}`}>
										<button type="button" className={cn("flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out hover:bg-gray-800")}>
											<ExternalLink width={14} height={14} />
											<h1 className="text-xs font-medium tracking-tight">PÁGINA DO ORDEM DE SERVIÇO</h1>
										</button>
									</Link>
									{serviceOrder.categoria === "MANUTENÇÃO PREVENTIVA" ? (
										<Link href={`/oem/pdfTermo/${serviceOrderId}`}>
											<button type="button" className={cn("flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out hover:bg-gray-800")}>
												<ExternalLink width={14} height={14} />
												<h1 className="text-xs font-medium tracking-tight">PÁGINA DO TERMO DE SERVIÇO</h1>
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
								<ServiceOrderPendenciesBlock infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
								{serviceOrder?.projetoDados ? (
									<ServiceOrderProjectInformationBlock project={serviceOrder.projetoDados} infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
								) : (
									<ServiceOrderProjectVinculation serviceOrderId={serviceOrderId} queryClient={queryClient} affectedQueryKey={[]} infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
								)}
								<ServiceOrderTechnicalAnalysisInformationBlock technicalAnalysisId={osInfo.idAnaliseTecnica} />
								<ServiceOrderFileReferences session={session} attachmentPrefix={osInfo.descricao} serviceOrderId={serviceOrderId} projectId={osInfo.projeto.id || undefined} />

								<ServiceOrderTagsBlock infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderLocationInformationBlock infoHolder={osInfo as TServiceOrderDTO} project={serviceOrder?.projetoDados || undefined} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderEquipmentsInformationBlock infoHolder={osInfo} project={serviceOrder?.projetoDados || undefined} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderCalendarIntegration infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderScheduling infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderDetailsInformationBlock infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
								<ServiceOrderExecutionInformationBlock
									infoHolder={osInfo}
									updateInfoHolder={updateInfoHolder}
									projectObservations={serviceOrder?.projetoDados?.obra?.observacoes || undefined}
								/>
							</div>
							<div className="mt-2 flex w-full items-center justify-between border-t border-gray-200 py-1 px-4">
								{!osInfo.dataEfetivacao ? (
									<LoadingButton
										loading={isPending}
										onClick={() => mutate({ id: serviceOrderId, changes: { ...osInfo, dataEfetivacao: new Date().toISOString() } })}
										type="button"
										className="bg-green-500 hover:bg-green-600"
									>
										CONCLUIR ORDEM DE SERVIÇO
									</LoadingButton>
								) : (
									<LoadingButton
										loading={isPending}
										onClick={() => mutate({ id: serviceOrderId, changes: { ...osInfo, dataEfetivacao: null } })}
										type="button"
										className="bg-gray-500 hover:bg-gray-600"
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
