import React, { useState } from "react";
import { motion } from "framer-motion";
import { createServiceOrder } from "../../../../utils/methods/mutation/service-orders";
import { VscChromeClose } from "react-icons/vsc";

import { useQueryClient } from "@tanstack/react-query";
import { TProjectDTO } from "@/utils/schemas/projects";
import { Session } from "next-auth";
import { TServiceOrder, TServiceOrderDTO } from "@/utils/schemas/service-order";

import ServiceOrderGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import ServiceOrderLocationInformationBlock from "./blocos/LocationInformationBlock";
import ServiceOrderEquipmentsInformationBlock from "./blocos/EquipmentsInformationBlock";
import ServiceOrderDetailsInformationBlock from "./blocos/DetailsInformationBlock";
import ServiceOrderTagsBlock from "./blocos/TagsBlock";
import ServiceOrderCalendarIntegration from "./blocos/CalendarIntegration";
import ServiceOrderScheduling from "./blocos/SchedulingInformationBlock";
import ServiceOrderExecutionInformationBlock from "./blocos/ExecutionInformationBlock";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import ServiceOrderPendenciesBlock from "./blocos/PendenciesBlock";
function getEquipmentList({ str, category }: { str: string; category: string }) {
	if (category != "MONTAGEM") return null;
	if (typeof str != "string") return null;
	const spllited = str.split("\n");
	const formattedSpllited = spllited.map((i) => {
		const arr = i.split("-");
		console.log(i, arr);
		var qty = null;
		var desc = null;
		if (arr.length > 1) {
			qty = Number(arr[0].trim());
			desc = arr[1];
		} else desc = arr[0];
		if (qty || desc)
			return {
				qtde: qty,
				descricao: desc,
			};
	});
	return formattedSpllited.filter((x) => !!x);
}
function getInverterInfoByStr(str: string) {
	const regexInverterQty = /^(\d{1,3})x/i;
	const regexInverterModel = /x([^()]+)/;
	const regexInverterPower = /\((\d+)W\)/;
	const x = regexInverterQty.exec(str);
	const inverterQty = regexInverterQty.exec(str) ? (regexInverterQty.exec(str) as RegExpExecArray)[0]?.slice(0, -1) : null;
	const inverterModel = regexInverterModel.exec(str) ? (regexInverterModel.exec(str) as RegExpExecArray)[0].substring(1) : null;
	const inverterPower = regexInverterPower.exec(str) ? (regexInverterPower.exec(str) as RegExpExecArray)[0].replace("(", "").replace(")", "").replace("W", "") : null;
	return {
		modelo: inverterModel,
		qtde: Number(inverterQty) || 0,
		potencia: inverterPower,
	};
}

type ModalNewServiceOrderProps = {
	session: Session;
	project: TProjectDTO;
	closeModal: () => void;
};
function ModalNewProjectServiceOrder({ session, project, closeModal }: ModalNewServiceOrderProps) {
	const queryClient = useQueryClient();
	const [osInfo, setOsInfo] = useState<TServiceOrder>({
		categoria: "MONTAGEM",
		favorecido: {
			nome: project.nomeDoContrato || "",
			contato: project.telefone || "",
		},
		anotacoes: "",
		projeto: {
			id: project._id || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
			nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
			identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
			tipo: project.tipoDeServico || null, // tipo do projeto
		},
		descricao: "", // servico executado
		localizacao: {
			cep: project.cep?.toString() || "",
			uf: project.uf,
			cidade: project.cidade,
			bairro: project.bairro,
			endereco: project.logradouro,
			numeroOuIdentificador: project.numeroResidencia?.toString() || "",
		},
		responsavel: {
			nome: project.obra?.equipeResp || "",
			tipo: project.obra?.equipeResp ? "INTERNO" : "EXTERNO",
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
				qtde: project.sistema?.qtdeModulos,
				potencia: project.sistema?.potModulos?.toString(),
			},
			inversor: getInverterInfoByStr(project.sistema?.inversor || ""),
			disponivel: null,
			retirada: null,
		},
		detalhes: {
			pontoAgua: "",
			senhaWifi: "",
			configuracaoMonitoramento: false,
			possuiTrafo: false,
			tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
			tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
			tipoPadrao: project.padrao?.tipo || null,
			tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
			amperagemPadrao: project.visitaTecnica?.amperagem || null,
			responsabilidadePadrao: project.padrao?.respInstalacao,
			topologia: project.sistema?.topologia,
		},
		observacoes: [],
		dataInsercao: new Date().toISOString(),
	});

	function updateInfoHolder(changes: Partial<TServiceOrder>) {
		setOsInfo((prev) => ({ ...prev, ...changes }));
	}
	function useProjectInLocoEquipmentsInformation() {
		setOsInfo((prev) => ({
			...prev,
			equipamentos: { ...prev.equipamentos, disponivel: getEquipmentList({ str: project.compra?.kitInfo || "", category: "MONTAGEM" }) },
		}));
	}
	function useProjectToTakeEquipmentsInformation() {
		setOsInfo((prev) => ({
			...prev,
			equipamentos: { ...prev.equipamentos, retirada: getEquipmentList({ str: project.material?.materialFaltante || "", category: "MONTAGEM" }) },
		}));
	}

	const { mutate: handleCreateServiceOrder, isPending } = useMutationWithFeedback({
		mutationKey: ["create-project-service-order"],
		mutationFn: createServiceOrder,
		queryClient,
		affectedQueryKey: ["project-service-orders", project._id],
	});
	return (
		<div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
			<motion.div
				initial={{ opacity: 0.3 }}
				animate={{ opacity: 1 }}
				className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[80%]"
			>
				<div className="flex h-full w-full flex-col">
					<div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
						<h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA ORDEM DE SERVIÇO</h3>
						<button onClick={closeModal} type="button" className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200">
							<VscChromeClose style={{ color: "red" }} />
						</button>
					</div>
					<div className="flex h-full w-full flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-y-auto px-2 py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
						<ServiceOrderGeneralInformationBlock infoHolder={osInfo as TServiceOrderDTO} predefinedCategories={[]} updateInfoHolder={updateInfoHolder} />

						<ServiceOrderPendenciesBlock infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderTagsBlock session={session} infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderLocationInformationBlock infoHolder={osInfo as TServiceOrderDTO} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderEquipmentsInformationBlock
							infoHolder={osInfo}
							updateInfoHolder={updateInfoHolder}
							useProjectInLocoEquipmentsInformation={useProjectInLocoEquipmentsInformation}
							useProjectToTakeEquipmentsInformation={useProjectToTakeEquipmentsInformation}
						/>

						<ServiceOrderCalendarIntegration infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderScheduling infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderDetailsInformationBlock infoHolder={osInfo} updateInfoHolder={updateInfoHolder} />
						<ServiceOrderExecutionInformationBlock infoHolder={osInfo} updateInfoHolder={updateInfoHolder} projectObservations={project.obra.observacoes || undefined} />
					</div>
					<div className="mt-2 flex w-full items-center justify-end border-t border-gray-200 py-1 px-4">
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

export default ModalNewProjectServiceOrder;
