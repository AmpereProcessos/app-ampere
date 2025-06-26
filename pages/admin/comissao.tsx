import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { BsDownload, BsFunnel } from "react-icons/bs";

import ComissionCard from "../../components/identificador/comissoes/ComissionCard";
import ErrorComponent from "../../components/utils/ErrorComponent";
import LoadingPage from "../../components/utils/LoadingPage";

import TextInput from "../../components/inputs/Text";
import DateInput from "../../components/inputs/Date";
import MultipleSelectInput from "../../components/inputs/MultipleSelect";

import { formatDateInputChange, getFirstDayOfMonth, getLastDayOfMonth } from "../../utils/methods/shared";
import { formatDate, formatDecimalPlaces, formatToMoney } from "../../utils/constants";
import { allSellers, serviceTypes } from "../../utils/select-options";
import { useComissionData } from "../../utils/methods/query/comissions";
// import { bulkUpdateProjectsComission, updateAppProjectsComission } from "../../utils/methods/mutation/comission";
import { MdAttachMoney, MdDashboard, MdElectricMeter, MdOutlineRoofing } from "react-icons/md";
import { FaPercentage, FaSolarPanel } from "react-icons/fa";
import { BiStats } from "react-icons/bi";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { TComissionData, any } from "../api/gestao/comissoes";
import { FaDiamond, FaShieldHalved } from "react-icons/fa6";
import { BadgeDollarSign, Pencil, Users } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
// import ControlProjectComission from "@/components/identificador/comissoes/ControlProjectComission";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

const comissionableItemsIconsMap = {
	SISTEMA: FaSolarPanel,
	PADRÃO: MdElectricMeter,
	"ESTRUTURA PERSONALIZADA": MdOutlineRoofing,
	OEM: FaSolarPanel,
	SEGURO: FaShieldHalved,
};
function CommissionMain() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });
	const userHasFinancesEditPermission = !!session?.user.permissoes.financeiro.editar;
	const userHasAdministrativeEditPermission = !!session?.user.permissoes.administrativo.editar;

	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

	const [editComissionProject, setEditComissionProject] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	const { data: projects, isSuccess, isLoading, isError, filters, updateFilters } = useComissionData({});

	function getStats({ info }: { info: any }) {
		if (!info)
			return {
				totalVendido: 0,
				potenciaVendida: 0,
				comissaoTotal: 0,
				comissaoProjeto: 0,
				comissaoPadrao: 0,
				comissaoTimeVendas: 0,
				comissaoTimeSDR: 0,
			};
		const sold = info.reduce((acc, current) => {
			const contractValue = current.valorContrato;
			return acc + contractValue;
		}, 0);
		const power = info.reduce((acc, current) => {
			const peakPower = current.potenciaPico;
			return acc + peakPower;
		}, 0);
		const comissionByTeams = info.reduce(
			(acc, current) => {
				const contractValue = current.valorContrato;
				const sellerComissionPercentage = current.comissoes.porcentagemVendedor || 0;
				const insiderComissionPercentage = current.comissoes.porcentagemInsider || 0;
				acc.seller += contractValue * sellerComissionPercentage;
				acc.insider += contractValue * insiderComissionPercentage;
				return acc;
			},
			{ seller: 0, insider: 0 },
		);
		const comissionByItem = info.reduce(
			(acc, current) => {
				const contractValue = current.valorContrato;
				const projectValue = current.valorProjeto || 0;
				const energyPaValue = current.valorPadrao || 0;
				const sellerComissionPercentage = current.comissoes.porcentagemVendedor || 0;
				const insiderComissionPercentage = current.comissoes.porcentagemInsider || 0;
				const totalComissionPercentage = (sellerComissionPercentage + insiderComissionPercentage) / 100;
				acc.total += contractValue * totalComissionPercentage;
				acc.project += projectValue * totalComissionPercentage;
				acc.energyPa += energyPaValue * totalComissionPercentage;
				return acc;
			},
			{ total: 0, project: 0, energyPa: 0 },
		);
		return {
			totalVendido: sold,
			potenciaVendida: power,
			comissaoTotal: comissionByItem.total,
			comissaoProjeto: comissionByItem.project,
			comissaoPadrao: comissionByItem.energyPa,
			comissaoTimeVendas: comissionByTeams.seller,
			comissaoTimeSDR: comissionByTeams.insider,
		};
	}
	function exportData() {
		if (!projects) return toast.error("Opps, parece que os dados não estão disponíveis para exportação.");
		const formattedJSON = projects.map((project) => {
			return {
				ID: project.identificadorApp,
				NOME: project.nome,
				"TIPO DO SERVIÇO": project.tipo,
				"IDENTIFICADOR APP": project.identificadorApp,
				"IDENTIFICADOR CRM": project.identificadorCrm,
				CIDADE: project.cidade,
				VENDEDOR: project.vendedorApp,
				INSIDER: project.insiderApp,
				"DATA DE ASSINATURA": project.dataAssinatura ? dayjs(project.dataAssinatura).add(3, "hour").format("DD/MM/YYYY") : null,
				"DATA RECEBIMENTO PARCIAL": project.dataRecebimentoParcial ? dayjs(project.dataRecebimentoParcial).add(3, "hour").format("DD/MM/YYYY") : null,
				"POTÊNCIA PICO": project.potenciaPico,
				"VALOR DO PROJETO": project.valorProjeto || 0,
				"VALOR DO PADRÃO": project.valorPadrao || 0,
				"VALOR TOTAL": project.valorContrato || 0,
				"COMISSÃO DEFINIDA": project.comissoes.efetivado ? "SIM" : "NÃO",
				"COMISSÃO PAGA": project.comissoes.pagamentoRealizado ? "SIM" : "NÃO",
				"COMISSÃO - VENDEDOR": formatDecimalPlaces((project.comissoes.porcentagemVendedor || 0) * 100),
				"COMISSÃO INSIDER": formatDecimalPlaces((project.comissoes.porcentagemInsider || 0) * 100),
			};
		});
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(formattedJSON))}`;
		const link = document.createElement("a");
		link.href = jsonString;
		link.download = "data.json";

		link.click();
	}
	// async function handleRegisterPayments(info: any) {
	// 	if (!info) return;
	// 	const bulkwriteAppUpdate = info.map((project) => {
	// 		const projectId = project.identificadorApp;
	// 		const crmProjectId = project.identificadorCrm;
	// 		const sellerCommission = project.comissoes?.porcentagemVendedor;
	// 		const insiderCommission = project.comissoes.porcentagemInsider;
	// 		return {
	// 			crmProjectId: crmProjectId,
	// 			appProjectId: projectId,
	// 			sellerCommission: sellerCommission,
	// 			insiderCommission: insiderCommission,
	// 		};
	// 	});
	// 	try {
	// 		await updateAppProjectsComission({ changes: bulkwriteAppUpdate });
	// 		await queryClient.invalidateQueries({ queryKey: ["comissions"] });
	// 		return toast.success("Pagamentos registrados com sucesso !");
	// 	} catch (error) {
	// 		return toast.error("Erro ao registrar pagamentos.");
	// 	}
	// }

	// async function bulkUpdateEffectivationWithSugestedValues(info: any) {
	// 	const input = info.map((project) => ({
	// 		projectId: project._id,
	// 		comissionableValue: project.comissoes.valorComissionavelSugerido,
	// 		sellerComissionPercentage: project.vendedor.comissao,
	// 		insiderComissionPercentage: project.insider.comissao,
	// 		comissionableItems: project.comissoes.itensComissionaveis,
	// 		comissionDefined: project.comissoes.efetivado,
	// 		comissionPaid: project.comissoes.pagamentoRealizado,
	// 	}));

	// 	return await bulkUpdateProjectsComission(input);
	// }

	// const { mutate: bulkUpdateEffectivationWithSugestedValuesMutation, isPending: isBulkUpdateEffectivationWithSugestedValuesPending } = useMutation({
	// 	mutationKey: ["bulk-update-effectivation-with-sugested-values"],
	// 	mutationFn: bulkUpdateEffectivationWithSugestedValues,
	// });

	const stats = getStats({ info: projects ?? [] });
	useEffect(() => {
		if (session) {
			if (!userHasFinancesEditPermission && !userHasAdministrativeEditPermission) router.push("/");
		}
	}, [session]);

	if (status !== "authenticated") return <LoadingPage />;
	return (
		<div className="flex grow flex-col p-6">
			<div className="flex flex-col items-center border-b border-gray-200 px-1 py-2">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">COMISSÃO DE PROJETOS</p>
					</div>
					{dropdownMenuVisible ? (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium uppercase tracking-tight">TOTAL VENDIDO</h1>
							<MdAttachMoney />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatToMoney(stats.totalVendido)}</div>
							<p className="text-xs text-gray-500">{formatDecimalPlaces(stats.potenciaVendida)} kWp</p>
						</div>
					</div>
					<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium uppercase tracking-tight">COMISSÃO TOTAL</h1>
							<FaPercentage />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatToMoney(stats.comissaoTotal)}</div>
							<p className="text-xs text-gray-500">{formatToMoney(stats.comissaoTimeVendas)} para o time de vendas</p>
							<p className="text-xs text-gray-500">{formatToMoney(stats.comissaoTimeSDR)} para o time de SDR</p>
						</div>
					</div>
					<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium uppercase tracking-tight">COMISSÃO POR ITEM</h1>
							<FaPercentage />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-gray-500">{formatToMoney(stats.comissaoProjeto)} em projeto UFV</div>
							<p className="text-gray-500">{formatToMoney(stats.comissaoPadrao)} em padrão</p>
						</div>
					</div>
					<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium uppercase tracking-tight">ANÁLISE</h1>
							<BiStats />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces((stats.comissaoTotal * 100) / stats.totalVendido)}%</div>
							<p className="text-sm text-gray-500">{formatDecimalPlaces(stats.totalVendido / stats.potenciaVendida)} R$/kWp</p>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{dropdownMenuVisible ? (
						<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
							<div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
								<TextInput label={"NOME DO CONTRATO"} value={filters.search} placeholder={"Digite o nome do contrato..."} handleChange={(value) => updateFilters({ search: value })} />
								<div className="w-full lg:w-[250px]">
									<MultipleSelectInput
										width={"100%"}
										label={"TIPO DE SERVIÇO"}
										selected={filters.serviceType}
										options={serviceTypes}
										selectedItemLabel={"SEM FILTRO"}
										handleChange={(value) => updateFilters({ serviceType: value as string[] })}
										onReset={() => updateFilters({ serviceType: [] })}
									/>
								</div>
								<div className="w-full lg:w-[250px]">
									<MultipleSelectInput
										width={"100%"}
										label={"VENDEDOR"}
										selected={filters.sellerName}
										options={allSellers}
										selectedItemLabel={"SEM FILTRO"}
										handleChange={(value) => updateFilters({ sellerName: value as string[] })}
										onReset={() => updateFilters({ sellerName: [] })}
									/>
								</div>
								<div className="flex items-center justify-center gap-x-2">
									<div className="w-full lg:w-[250px]">
										<DateInput
											width={"100%"}
											label={"DEPOIS DE"}
											value={filters.period.after ? formatDate(filters.period.after) : undefined}
											handleChange={(value) => updateFilters({ period: { ...filters.period, after: formatDateInputChange(value, "string") as string } })}
										/>
									</div>
									<div className="w-full lg:w-[250px]">
										<DateInput
											width={"100%"}
											label={"ANTES DE"}
											value={filters.period.before ? formatDate(filters.period.before) : undefined}
											handleChange={(value) => updateFilters({ period: { ...filters.period, before: formatDateInputChange(value, "string") as string } })}
										/>
									</div>
								</div>
							</div>
							<div className="flex w-full items-center justify-end">
								<button
									type="button"
									onClick={exportData}
									className="flex cursor-pointer items-center rounded-lg  p-2 font-bold text-[#15599a] transition duration-300 ease-in-out hover:scale-105"
								>
									<p className="mr-2 text-sm">BAIXAR DADOS</p>
									<BsDownload />
								</button>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
			{/* <div className="w-full flex items-center justify-end">
				<LoadingButton variant="ghost" loading={isBulkUpdateEffectivationWithSugestedValuesPending} onClick={() => bulkUpdateEffectivationWithSugestedValuesMutation(projects ?? [])}>
					EFETIVAR COMISSÕES COM VALORES SUGERIDOS
				</LoadingButton>
			</div> */}
			{isLoading ? <LoadingPage /> : null}
			{isError ? <ErrorComponent msg={"Erro ao carregar informações da análise. Tente novamente."} /> : null}
			{isSuccess && projects ? (
				projects.length > 0 ? (
					<div className="flex w-full flex-col gap-2 py-2">
						{/* <div className="flex w-full items-center justify-center">
							<button
								type="button"
								disabled={isLoading}
								onClick={() => handleRegisterPayments(projects)}
								className="rounded border border-green-500 px-2 py-1 font-medium text-green-500 duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white enabled:hover:bg-green-500 enabled:hover:text-white"
							>
								REGISTRAR PAGAMENTOS
							</button>
						</div> */}

						{projects.map((project) => (
							<ProjectComissionCard key={project.identificadorApp} project={project} handleClick={(id) => setEditComissionProject({ id, isOpen: true })} />
						))}
					</div>
				) : (
					<div className="flex grow items-center justify-center">
						<h1 className="text-lg italic text-gray-500">Nenhuma informação encontrada para o período de análise</h1>
					</div>
				)
			) : null}
			{/* {editComissionProject.isOpen && editComissionProject.id ? (
				<ControlProjectComission projectId={editComissionProject.id} session={session.user} closeModal={() => setEditComissionProject({ id: null, isOpen: false })} />
			) : null} */}
		</div>
	);
}

export default CommissionMain;

type ProjectComissionCardProps = {
	project: any[number];
	handleClick: (id: string) => void;
};
function ProjectComissionCard({ project, handleClick }: ProjectComissionCardProps) {
	const sellerCommissionPercentage = project.comissoes.porcentagemVendedor / 100;
	const insiderCommissionPercentage = project.comissoes.porcentagemInsider / 100;
	const totalComissionPercentage = sellerCommissionPercentage + insiderCommissionPercentage;
	const totalComissionValue = project.comissoes.valorComissionavel * totalComissionPercentage;
	const comissionValueMap = {
		SISTEMA: project.valorProjeto,
		PADRÃO: project.valorPadrao,
		"ESTRUTURA PERSONALIZADA": project.valorEstruturaPersonalizada,
		OEM: project.valorOem,
		SEGURO: project.valorSeguro,
	};
	function getComissionByItemList(project: any[number]) {
		const comissionableItems = project.comissoes?.itensComissionaveis || ["SISTEMA", "PADRÃO", "ESTRUTURA PERSONALIZADA", "OEM", "SEGURO"];

		const comissionableItemsList = comissionableItems.map((item) => {
			const value = comissionValueMap[item as keyof typeof comissionValueMap] || 0;
			return {
				item,
				icon: comissionableItemsIconsMap[item as keyof typeof comissionableItemsIconsMap],
				valor: value,
				comissaoVendedor: sellerCommissionPercentage * value,
				comissaoInsider: insiderCommissionPercentage * value,
				comissaoTotal: value * (totalComissionPercentage / 100),
			};
		});
		return comissionableItemsList;
	}
	const comissionByItemList = getComissionByItemList(project);
	return (
		<div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1 text-center text-xs font-bold italic text-primary/80">
						<MdDashboard size={12} />
						<p className="text-xs">{project.identificadorApp}</p>
					</div>
					<p className="text-sm font-bold leading-none tracking-tight">{project.nome}</p>

					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
						<BsFunnel size={12} />
						<p>{project.identificadorCrm}</p>
					</div>
					<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
						<FaDiamond size={12} />
						<p>{project.tipo}</p>
					</div>
				</div>
				<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleClick(project._id)}>
					<Pencil className="h-4 w-4 min-h-4 min-w-4" />
					<p className="text-sm font-semibold text-primary/80">EDITAR</p>
				</Button>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<div className="flex items-center gap-1">
						<Users size={12} />
						<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
							<p>VENDEDOR</p>
							<p className="text-[#15599a] font-black text-[0.57rem]">{project.vendedorApp}</p>
							<p className="text-green-700 font-black text-[0.57rem]">{project.comissoes.porcentagemVendedor}%</p>
						</div>

						{project.insiderApp ? (
							<>
								<div className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center text-[0.5rem] font-bold italic text-primary/80">
									<p>INSIDER</p>
									<p className="text-[#15599a] font-black text-[0.57rem]">{project.insiderApp}</p>
									<p className="text-green-700 font-black text-[0.57rem]">{project.comissoes.porcentagemInsider}%</p>
								</div>
							</>
						) : null}
					</div>
				</div>
			</div>
			<div className="w-full flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					{comissionByItemList.map((item) => (
						<HoverCard key={item.item}>
							<HoverCardTrigger asChild>
								<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"}>
									<item.icon className="h-4 w-4 min-h-4 min-w-4" />
									<p className="text-sm font-semibold text-primary/80">{formatToMoney(item.comissaoTotal)}</p>
								</Button>
							</HoverCardTrigger>
							<HoverCardContent className="min-w-80 w-fit">
								<div className="space-y-1">
									<div className="w-full flex items-center justify-between gap-2">
										<p className="text-sm font-semibold text-primary/80">VALOR COMISSIONÁVEL DO ITEM</p>
										<p className="text-sm font-semibold text-primary/80">{formatToMoney(item.valor)}</p>
									</div>
									<div className="w-full flex items-center justify-between gap-2">
										<p className="text-sm font-semibold text-primary/80">COMISSÃO DO VENDEDOR</p>
										<p className="text-sm font-semibold text-primary/80">{formatToMoney(item.comissaoVendedor)}</p>
									</div>
									<div className="w-full flex items-center justify-between gap-2">
										<p className="text-sm font-semibold text-primary/80">COMISSÃO DO INSIDER</p>
										<p className="text-sm font-semibold text-primary/80">{formatToMoney(item.comissaoInsider)}</p>
									</div>
								</div>
								<div className="w-full h-[1px] rounded bg-primary my-2" />
								<div className="w-full flex items-center justify-between gap-2">
									<p className="text-sm font-semibold text-primary/80">COMISSÃO TOTAL</p>
									<p className="text-sm font-semibold text-primary/80">{formatToMoney(item.comissaoTotal)}</p>
								</div>
							</HoverCardContent>
						</HoverCard>
					))}
				</div>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"}>
							<BadgeDollarSign className="h-4 w-4 min-h-4 min-w-4" />
							<p className="text-sm font-semibold text-primary/80">{formatToMoney(totalComissionValue)}</p>
						</Button>
					</HoverCardTrigger>
					<HoverCardContent className="min-w-80 w-fit">
						<div className="space-y-1">
							<div className="w-full flex items-center justify-between gap-2">
								<p className="text-sm font-semibold text-primary/80">VALOR COMISSIONÁVEL TOTAL</p>
								<p className="text-sm font-semibold text-primary/80">{formatToMoney(project.comissoes.valorComissionavel)}</p>
							</div>
							<div className="w-full flex items-center justify-between gap-2">
								<p className="text-sm font-semibold text-primary/80">COMISSÃO DO VENDEDOR</p>
								<p className="text-sm font-semibold text-primary/80">{formatToMoney(sellerCommissionPercentage * project.comissoes.valorComissionavel)}</p>
							</div>
							<div className="w-full flex items-center justify-between gap-2">
								<p className="text-sm font-semibold text-primary/80">COMISSÃO DO INSIDER</p>
								<p className="text-sm font-semibold text-primary/80">{formatToMoney(insiderCommissionPercentage * project.comissoes.valorComissionavel)}</p>
							</div>
						</div>
						<div className="w-full h-[1px] rounded bg-primary my-2" />
						<div className="w-full flex items-center justify-between gap-2">
							<p className="text-sm font-semibold text-primary/80">COMISSÃO TOTAL</p>
							<p className="text-sm font-semibold text-primary/80">{formatToMoney(totalComissionValue)}</p>
						</div>
					</HoverCardContent>
				</HoverCard>
			</div>
		</div>
	);
}
