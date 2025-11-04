import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import { cn } from "@/lib/utils";
import { formatDecimalPlaces } from "@/utils/constants";
import { formatDateAsLocale, formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateProject } from "@/utils/methods/mutation/clients";
import { createWarehouseFormulary } from "@/utils/methods/mutation/warehouse-forms";
import { useTechnicalAnalysisById } from "@/utils/methods/query/technical-analysis";
import { useWarehouseFormsByProjectId } from "@/utils/methods/query/warehouse-forms";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TServiceOrder, TServiceOrderProject } from "@/utils/schemas/service-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowDown,
	ArrowUp,
	Box,
	Building2,
	Code,
	Diamond,
	IdCard,
	Info,
	LayoutGrid,
	MapPin,
	NotepadText,
	ShoppingCart,
	UserRound,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineSafety } from "react-icons/ai";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent } from "react-icons/bs";
import { FaBolt, FaIndustry, FaUser, FaUserAlt } from "react-icons/fa";
import { MdOutlineMiscellaneousServices, MdSync } from "react-icons/md";

type ServiceOrderProjectInformationBlockProps = {
	project: TServiceOrderProject;
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
};
function ServiceOrderProjectInformationBlock({ project, infoHolder, updateInfoHolder }: ServiceOrderProjectInformationBlockProps) {
	async function handleUpdateProject() {
		try {
			const changes = {
				"obra.entrada": !project.obra.entrada ? infoHolder.periodo.inicio : project.obra.entrada,
				"obra.saida": !project.obra.saida ? infoHolder.periodo.fim : project.obra.saida,
				"obra.statusDaObra": !project.obra.statusDaObra ? infoHolder.status : project.obra.statusDaObra,
				"obra.equipeResp": !project.obra.equipeResp ? infoHolder.responsavel.nome : project.obra.equipeResp,
				"obra.observacoes": infoHolder.observacoes.join("/"),
			};
			await updateProject({ id: project._id, changes });
			return "Dados sincronizados com sucesso !";
		} catch (error) {
			console.log("ERROR", error);
			throw error;
		}
	}
	const { mutate, isPending } = useMutation({
		mutationKey: ["sync-project-data", project._id],
		mutationFn: handleUpdateProject,
		onSuccess: () => toast.success("Dados sincronizados no projeto."),
	});
	return (
		<div className="flex w-full grow flex-col gap-4">
			<h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">INFORMAÇÕES DO PROJETO</h1>
			<div className="flex w-full items-center justify-center">
				{project.idOrdemServico ? (
					<button
						type="button"
						disabled={isPending}
						onClick={() => mutate()}
						className={cn(
							"disabled:bg-primary/60 disabled:hover:bg-primary/60 flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-white duration-300 ease-in-out hover:bg-blue-700",
						)}
					>
						<MdSync />
						<h1 className="text-xs font-medium tracking-tight">SINCRONIZAR DADOS NO PROJETO</h1>
					</button>
				) : null}
			</div>
			<div className="flex w-full grow flex-col gap-2">
				<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
					<LayoutGrid className="w-4 h-4 min-w-4 min-h-4" />
					<h1 className="text-xs tracking-tight font-medium text-start w-fit">GERAIS</h1>
				</div>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-primary/60 text-[0.65rem] font-medium">PROJETO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<Code className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">{project.qtde}</p>
							</div>
							<div className="flex items-center gap-1">
								<UserRound className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">{project.nomeDoContrato}</p>
							</div>

							<div className="flex items-center gap-1">
								<IdCard className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.cpf_cnpj}</p>
							</div>

							<div className="flex items-center gap-1">
								<MapPin className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{formatLocation({
										location: {
											uf: project.uf || "",
											cidade: project.cidade || "",
											cep: project.cep?.toString() || "",
											bairro: project.bairro,
											endereco: project.logradouro,
											numeroOuIdentificador: project.numeroResidencia?.toString() || "",
											complemento: null,
											latitude: null,
											longitude: null,
										},
										includeCity: true,
										includeUf: true,
									})}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<UserRound className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">VENDIDO POR: {project.vendedor?.nome || "N/A"}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-primary/60 text-[0.65rem] font-medium">COMPRA</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<BsCalendarEvent className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project.compra.previsaoEntrega
										? `ENTREGA PREVISTA P/ ${formatDateAsLocale(project.compra.previsaoEntrega)}`
										: "ENTREGA SEM PREVISÃO DEFINIDA"}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project.compra.dataPagamento ? `PAGAMENTO REALIZADO EM: ${formatDateAsLocale(project.compra.dataPagamento)}` : "PAGAMENTO NÃO REALIZADO"}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendarCheck className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project.compra.dataEntrega ? `ENTREGA REALIZADA EM: ${formatDateAsLocale(project.compra.dataEntrega)}` : "ENTREGA NÃO REALIZADA"}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-primary/60 text-[0.65rem] font-medium">HOMOLOGAÇÃO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project.homologacao?.acesso?.dataResposta
										? `PARECER LIBERADO EM: ${formatDateAsLocale(project.homologacao.acesso.dataResposta)}`
										: "SEM PARECER DE ACESSO"}
								</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendar className="w-4 h-4 min-w-4 min-h-4" />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project.homologacao?.vistoria?.dataEfetivacao
										? `VISTORIA REALIZADA EM: ${formatDateAsLocale(project.homologacao.vistoria.dataEfetivacao)}`
										: "VISTORIA NÃO REALIZADA"}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex items-stretch gap-2 flex-col lg:flex-row">
					<div className="w-full lg:w-1/2 flex flex-col gap-1">
						<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
							<ShoppingCart className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="text-xs tracking-tight font-medium text-start w-fit">PRODUTOS</h1>
						</div>
						<div className="w-full flex flex-col gap-3 border border-primary/20 rounded p-3 bg-card">
							{project.produtos && project.produtos.length > 0 ? (
								project.produtos.map((product, index) => <ServiceOrderProjectProductCard key={`product-${product.id}-${index}`} product={product} />)
							) : (
								<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum produto adicionado</div>
							)}
						</div>
					</div>
					<div className="w-full lg:w-1/2 flex flex-col gap-1">
						<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
							<MdOutlineMiscellaneousServices className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="text-xs tracking-tight font-medium text-start w-fit">SERVIÇOS</h1>
						</div>
						<div className="w-full flex flex-col gap-3 border border-primary/20 rounded p-3 bg-card">
							{project.servicos && project.servicos.length > 0 ? (
								project.servicos.map((service, index) => <ServiceOrderProjectServiceCard key={`service-${service.id}-${index}`} service={service} />)
							) : (
								<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhum serviço adicionado</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
					<Building2 className="w-4 h-4 min-w-4 min-h-4" />
					<h1 className="text-xs tracking-tight font-medium text-start w-fit">DADOS DA OBRA</h1>
				</div>
				<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-col items-center gap-1 lg:items-start">
						<p className="text-primary/60 text-[0.65rem] font-medium">EXECUÇÃO</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
							<div className="flex items-center gap-1">
								<FaUserAlt />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">{project?.obra.equipeResp}</p>
							</div>
							<div className="flex items-center gap-1">
								<BsCalendar />
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">
									{project?.obra.entrada
										? `${formatDateAsLocale(project?.obra.entrada, true)} - ${project?.obra.saida ? formatDateAsLocale(project?.obra.saida, true) : "N/A"}`
										: "N/A"}
								</p>
							</div>
							<h1 className="bg-primary text-xxs rounded-md px-2 py-0.5 leading-none font-medium tracking-tight text-white">{project?.obra.statusDaObra}</h1>
						</div>
					</div>
					<div className="flex flex-col items-center gap-1 lg:items-end">
						<p className="text-primary/60 text-[0.65rem] font-medium">PENDÊNCIAS</p>
						<div className="flex flex-wrap items-center justify-center gap-4 lg:justify-end">
							{project.obra.pendencias ? (
								<h1 className="text-xxs rounded-md bg-orange-500 px-2 py-0.5 leading-none font-medium tracking-tight text-white">
									{project?.obra.pendencias}
								</h1>
							) : (
								<p className="text-[0.6rem] leading-none font-medium tracking-tight">N/A</p>
							)}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 lg:flex-row">
					<div className="flex w-full flex-col lg:w-1/2">
						<h1 className="text-primary w-full text-center text-[0.6rem] font-medium tracking-tight lg:text-start">OBSERVAÇÕES GERAIS SOBRE A OBRA</h1>
						<div className="bg-primary/10 flex w-full items-center justify-center rounded p-2">
							<h1 className="text-[0.6rem] font-medium whitespace-pre-wrap">{project.obra.observacoes || "OBSERVAÇÕES DA OBRA NÃO DEFINIDAS"}</h1>
						</div>
					</div>
				</div>
				{project.alocacoes && project.alocacoes.length > 0 ? (
					<ServiceOrderProjectAllocationsList project={project} allocations={project.alocacoes} />
				) : null}
			</div>
		</div>
	);
}

export default ServiceOrderProjectInformationBlock;

function ServiceOrderProjectProductCard({ product }: { product: Exclude<TServiceOrderProject["produtos"], undefined | null>[number] }) {
	return (
		<div key={product.id} className="w-full flex flex-col gap-1">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full items-center gap-1 lg:grow">
					{renderProductCategoryIcon(product.categoria, 15)}
					<p className="text-sm leading-none font-medium tracking-tight">
						<strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
					</p>
				</div>
				<div className="flex items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<FaIndustry size={12} />
						<p className="text-primary/60 text-[0.6rem] lg:text-xs">{product.fabricante}</p>
					</div>
					{product.potencia ? (
						<div className="flex items-center gap-1">
							<FaBolt size={12} />
							<p className="text-primary/60 text-[0.6rem] lg:text-xs">{product.potencia} W</p>
						</div>
					) : null}
					<div className="flex items-center gap-1">
						<AiOutlineSafety size={12} />
						<p className="text-primary/60 text-[0.6rem] lg:text-xs">{product.garantia} ANOS</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function ServiceOrderProjectServiceCard({ service }: { service: Exclude<TServiceOrderProject["servicos"], undefined | null>[number] }) {
	return (
		<div key={service.id} className="w-full flex flex-col gap-1">
			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-1">
					<MdOutlineMiscellaneousServices className="w-4 h-4 min-w-4 min-h-4" />
					<p className="text-sm leading-none font-medium tracking-tight">{service.descricao}</p>
				</div>
				<div className="flex items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<AiOutlineSafety size={12} />
						<p className="text-primary/50 text-[0.6rem] lg:text-xs">
							{service.garantia} {service.garantia && service.garantia > 0 ? "ANOS" : "ANO"}
						</p>
					</div>
					{service.observacoes ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<Info className="w-4 h-4 min-w-4 min-h-4" />
							</TooltipTrigger>
							<TooltipContent>
								<p>{service.observacoes}</p>
							</TooltipContent>
						</Tooltip>
					) : null}
				</div>
			</div>
		</div>
	);
}

function ServiceOrderProjectAllocationsList({
	project,
	allocations,
}: { project: TServiceOrderProject; allocations: Exclude<TServiceOrderProject["alocacoes"], undefined | null> }) {
	const queryClient = useQueryClient();
	const {
		data: warehouseForms,
		isLoading,
		isError,
		isSuccess: isWarehouseFormsQuerySuccessful,
	} = useWarehouseFormsByProjectId({ projectId: project._id });
	const pendingAllocations = allocations.filter((allocation) => allocation.quantidadePrevista > allocation.quantidade);
	const { mutate: generateWarehouseFormulary, isPending } = useMutation({
		mutationKey: ["generate-warehouse-formulary", allocations],
		mutationFn: async () => {
			const result = await createWarehouseFormulary({
				warehouseFormulary: {
					titulo: `FORMULÁRIO DE SAÍDA - ${project.nomeDoContrato}`,
					categoria: "SAÍDA",
					projeto: {
						id: project._id,
						nome: project.nomeDoContrato || "",
					},
					localizacao: {
						cep: project.cep,
						uf: project.uf,
						cidade: project.cidade,
						bairro: project.bairro,
						endereco: project.logradouro,
						numeroOuIdentificador: project.numeroResidencia?.toString() || "",
						complemento: "",
						distancia: null,
					},
					materiais: pendingAllocations.map((allocation) => ({
						id: allocation.idMaterial,
						nome: allocation.nome,
						preco: allocation.precoUnitario,
						qtdeRetirada: allocation.quantidadePrevista - allocation.quantidade,
						qtdeDevolucao: 0,
						grandeza: allocation.unidade,
					})),
					responsaveis: project.obra.equipeResp ?? "NÃO DEFINIDO",
				},
			});
			return result;
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["warehouse-forms-by-project-id", project._id] });
		},
		onSuccess: async (data) => {
			return toast.success(data.message);
		},
		onError: async (error) => {
			return toast.error(getErrorMessage(error));
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["warehouse-forms-by-project-id", project._id] });
		},
	});
	console.log("ONGOING WAREHOUSE FORMULARIES", warehouseForms);
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Box className="w-4 h-4 min-w-4 min-h-4" />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">ALOCAÇÕES</h1>
			</div>
			<div className="w-full flex flex-col gap-3 border border-primary/20 rounded p-3 bg-card">
				{isWarehouseFormsQuerySuccessful && warehouseForms.length === 0 && pendingAllocations.length > 0 ? (
					<div className="w-full flex flex-col items-center justify-end px-2 py-1 rounded-lg bg-orange-200">
						<p className="text-xs font-medium tracking-tight">Existem alocações pendentes para esse projeto.</p>
						<LoadingButton size="xs" className="text-xs" variant={"ghost"} loading={isPending} onClick={() => generateWarehouseFormulary()}>
							GERAR FORMULÁRIO DE SAÍDA
						</LoadingButton>
					</div>
				) : null}
				{isWarehouseFormsQuerySuccessful && warehouseForms.length > 0 ? (
					<div className="w-full flex flex-col gap-2 px-2 py-1 pb-3 rounded-lg bg-blue-200">
						<p className="text-xs font-medium tracking-tight">Existem formulários de saída de materiais para esse projeto.</p>
						{warehouseForms.map((form) => (
							<div key={form._id} className="w-full flex items-center justify-between gap-2">
								<div className="flex items-center gap-1">
									<NotepadText className="w-4 h-4 min-w-4 min-h-4" />
									<p className="text-xs font-medium tracking-tight">{form.titulo}</p>
									<h3
										className={cn("text-[0.65rem] font-medium tracking-tight px-2 py-0.5 rounded-lg", {
											"bg-green-600 text-white": form.dataEfetivacao,
											"bg-blue-600 text-white": form.dataInsercao,
											"bg-primary/20 text-primary": !form.dataEfetivacao && !form.dataInsercao,
										})}
									>
										{form.dataEfetivacao ? "EFETIVADO" : form.dataInsercao ? "EM ABERTO" : "RASCUNHO"}
									</h3>
								</div>
								<HoverCard>
									<HoverCardTrigger asChild>
										<Info className="w-4 h-4 min-w-4 min-h-4" />
									</HoverCardTrigger>
									<HoverCardContent className="flex flex-col gap-2 w-[300px]">
										<p className="text-xs font-medium tracking-tight">{form.titulo}</p>
										<div className="w-full flex flex-col gap-2 px-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20">
											{form.materiais.map((material) => (
												<div key={material.id} className="w-full flex items-center justify-between gap-2">
													<p className="text-[0.65rem] font-medium tracking-tight truncate">- {material.nome}</p>
													<div className="flex items-center gap-2">
														<div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-tight">
															<ArrowUp className="w-3 h-3 min-w-3 min-h-3" />
															{formatDecimalPlaces(material.qtdeRetirada)} {material.grandeza || "UN"}
														</div>
														<div className="flex items-center gap-1 text-[0.65rem] font-medium tracking-tight">
															<ArrowDown className="w-3 h-3 min-w-3 min-h-3" />
															{formatDecimalPlaces(material.qtdeDevolucao)} {material.grandeza || "UN"}
														</div>
													</div>
												</div>
											))}
										</div>
									</HoverCardContent>
								</HoverCard>
							</div>
						))}
					</div>
				) : null}
				{allocations && allocations.length > 0 ? (
					allocations.map((allocation, index) => (
						<ServiceOrderProjectAllocationCard key={`allocation-${allocation.idMaterial}-${index}`} allocation={allocation} />
					))
				) : (
					<div className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Nenhuma alocação adicionada</div>
				)}
			</div>
		</div>
	);
}
function ServiceOrderProjectAllocationCard({ allocation }: { allocation: Exclude<TServiceOrderProject["alocacoes"], undefined | null>[number] }) {
	function getAllocationStatus({ preview, actual }: { preview: number; actual: number }) {
		if (actual === 0)
			return {
				text: "NÃO ALOCADO",
				color: "bg-red-200 text-red-600",
			};
		if (preview < actual)
			return {
				text: "PARCIALMENTE ALOCADO",
				color: "bg-orange-200 text-orange-600",
			};
		if (preview > actual)
			return {
				text: "ALOCADO",
				color: "bg-green-200 text-green-600",
			};
		return {
			text: "ALOCADO",
			color: "bg-green-200 text-green-600",
		};
	}
	const allocationStatus = getAllocationStatus({ preview: allocation.quantidadePrevista, actual: allocation.quantidade });

	return (
		<div key={allocation.idMaterial} className="w-full flex flex-col gap-1">
			<div className="flex w-full items-start lg:items-center justify-between gap-y-1 gap-x-2 p-2 flex-col lg:flex-row">
				<div className="flex items-center gap-1">
					<div className={cn("bg-primary text-primary-foreground flex items-center gap-1 rounded-lg px-2 py-1 text-xs min-w-fit", allocationStatus.color)}>
						<h3 className="text-xs font-bold">{allocationStatus.text}</h3>
					</div>
					<h1 className="text-sm leading-none font-medium tracking-tight">{allocation.nome}</h1>
				</div>
				<div className="w-full lg:w-fit flex items-center gap-y-1 gap-x-2 flex-col lg:flex-row">
					<div className={cn("text-primary flex items-center gap-1 rounded-lg px-2 py-1")}>
						<Box className="h-4 w-4" />
						<h3 className="text-xs font-medium">
							{formatDecimalPlaces(allocation.quantidadePrevista)} {allocation.unidade || "UN"} PREVISTOS
						</h3>
					</div>
					<HoverCard>
						<HoverCardTrigger asChild>
							<div className={cn("bg-primary text-primary-foreground flex items-center gap-1 rounded-lg px-2 py-1")}>
								<Box className="h-4 w-4" />
								<h3 className="text-xs font-bold">
									{formatDecimalPlaces(allocation.quantidade)} {allocation.unidade || "UN"}
								</h3>
							</div>
						</HoverCardTrigger>
						<HoverCardContent className="flex flex-col gap-2">
							<p className="text-xs font-medium tracking-tight">MOVIMENTAÇÕES</p>
							<div className="flex flex-col gap-1">
								{allocation.movimentacoes.map((movement) => (
									<p key={`${movement.idCompra}-${movement.idFormularioSaida}`} className="text-primary/60 text-[0.65rem] lg:text-xs">
										{formatDecimalPlaces(movement.quantidade)}
										{allocation.unidade || "UN"} - VIA {movement.idCompra ? "COMPRA" : "FORMULÁRIO DE SAÍDA"}
									</p>
								))}
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>
		</div>
	);
}
