import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { VscDiffAdded } from "react-icons/vsc";
import { FaMoon, FaSignature } from "react-icons/fa";
import { BsPatchCheck } from "react-icons/bs";
import { TbAlertHexagonFilled, TbCheckupList } from "react-icons/tb";

import ModalProjetos from "../../components/ModalProjetos";
import ProjetosSkeleton from "../../components/skeletons/ProjetosSkeleton";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import LoadingPage from "../../components/utils/LoadingPage";

import TextInput from "../../components/inputs/Text";
import SelectInput from "../../components/inputs/Select";
import DateInput from "../../components/inputs/Date";
import MultipleSelectInput from "../../components/inputs/MultipleSelect";
import MultipleSelectInputVirtualized from "../../components/inputs/MultipleSelectInputVirtualized";
import { ServiceOrderStatus, HomologationControlStatus, inspectionStatus, serviceTypes } from "../../utils/select-options";
import { useEngineeringProjects } from "../../utils/methods/query/engineering";
import { formatDateInputChange } from "../../utils/methods/shared";
import { formatDate, formatDecimalPlaces, SlideMotionVariants } from "../../utils/constants";

import StatesAndCities from "@/utils/jsons/estados-cidades.json";
import ProjectCardsTags from "../../components/utils/ProjectCardsTags";
import { useTags } from "../../utils/methods/query/tags";
import type { Session } from "next-auth";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { cn } from "@/lib/utils";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { useUsers } from "@/utils/methods/query/crm/users";
import ErrorPage from "@/components/utils/ErrorPage";
import { useEngineeringSectorStats } from "@/utils/methods/query/stats";
import { ChartArea, CircleCheck, CircleDashed, CircleX, DraftingCompass, GitPullRequestArrow, ListTodo, Network } from "lucide-react";
import DateIntervalInput from "@/components/inputs/DateIntervalInput";

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));
const CurrentDate = dayjs().toDate();

function Projetos() {
	const router = useRouter();
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingPage />;

	const isAuthorized = session?.user.permissoes.rotas.includes("Projetos") || session.user.permissoes.engenharia.visualizar;
	if (!isAuthorized) return <ErrorPage msg="Você não tem permissão para acessar esta página" />;
	return <ProjectsPageContent session={session} />;
}

export default Projetos;

type ProjectsPageContentProps = {
	session: Session;
};
function ProjectsPageContent({ session }: ProjectsPageContentProps) {
	const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState(false);
	const [editProjectModal, setEditProjectModal] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null });
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
			<div className="flex flex-col items-center justify-between  gap-2 border-b border-gray-300 p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black uppercase text-[#15599a]">Projetos no estágio de engenharia</p>
					</div>
					{filtersMenuIsOpen ? (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFiltersMenuIsOpen(false)} />
						</div>
					) : (
						<div className="cursor-pointer text-gray-600 hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFiltersMenuIsOpen(true)} />
						</div>
					)}
				</div>
				<ProjectsPageContentStats />
				<div className="my-2 flex w-full items-center justify-end gap-2">
					<Link href="/projetos/igreen-analises-tecnicas">
						<button type="button" className="rounded-md bg-green-400 py-1 px-4 text-sm font-bold text-white">
							ANÁLISES TÉCNICAS IGREEN
						</button>
					</Link>
					<Link href="/projetos/analises-tecnicas">
						<button type="button" className="rounded-md bg-[#15599a] py-1 px-4 text-sm font-bold text-white">
							ANÁLISES TÉCNICAS
						</button>
					</Link>
					<Link href="/projetos/homologacoes">
						<button type="button" className="rounded-md bg-[#fead41] py-1 px-4 text-sm font-bold text-white">
							HOMOLOGAÇÕES AVULSAS
						</button>
					</Link>
				</div>
				<AnimatePresence>
					{filtersMenuIsOpen ? (
						<motion.div key={"engineering-filters-menu"} variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="mt-4 flex w-full flex-col gap-y-2">
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
												handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value, "string") } }))}
											/>
										</div>
										<div className="w-full lg:w-[250px]">
											<DateInput
												width={"100%"}
												label={"ANTES DE"}
												value={filters.date.before ? formatDate(filters.date.before) : undefined}
												handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value, "string") } }))}
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
												{ id: 3, label: "DATA LIB.DOCUMENTAÇÃO", value: "homologacao.documentacao.dataLiberacao" },
												{ id: 4, label: "DATA ASS.DOCUMENTAÇÃO", value: "homologacao.documentacao.dataAssinatura" },
												{ id: 6, label: "DATA DE SOLICITAÇÃO DO PARECER", value: "homologacao.acesso.dataSolicitacao" },
												{ id: 7, label: "DATA DE RESPOSTA DO PARECER", value: "homologacao.acesso.dataResposta" },
												{ id: 8, label: "DATA DE PEDIDO DA VISTORIA", value: "homologacao.vistoria.dataSolicitacao" },
												{ id: 9, label: "TROCA DO MEDIDOR", value: "homologacao.vistoria.dataEfetivacao" },
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
										options={AllCities.map((city, index) => ({ id: index + 1, label: city.label, value: city.value }))}
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
										options={crmUsers?.map((seller, index) => ({ id: index + 1, label: seller.nome || "", value: seller.nome })) || []}
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
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											necessaryDistribution: !filters.necessaryDistribution,
										})
									}
									className={`${
										filters.necessaryDistribution ? "bg-[#15599a]" : "bg-blue-300"
									} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									NECESSÁRIO DISTRIBUIÇÃO
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											necessaryHomologation: !filters.necessaryHomologation,
										})
									}
									className={`${
										filters.necessaryHomologation ? "bg-[#15599a]" : "bg-blue-300"
									} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									NECESSÁRIO HOMOLOGAÇÃO
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											notNecessaryHomologation: !filters.notNecessaryHomologation,
										})
									}
									className={`${
										filters.notNecessaryHomologation ? "bg-[#15599a]" : "bg-blue-300"
									} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									NÃO NECESSÁRIO HOMOLOGAÇÃO
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters((prev) => ({
											...prev,
											drawReady: !prev.drawReady,
										}))
									}
									className={`${filters.drawReady ? "bg-green-500" : "bg-green-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									DESENHO PRONTO
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											missingDiagram: !filters.missingDiagram,
										})
									}
									className={`${
										filters.missingDiagram ? "bg-orange-500" : "bg-orange-300"
									} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									DIAGRAMA PENDENTE
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											missingDraw: !filters.missingDraw,
										})
									}
									className={`${filters.missingDraw ? "bg-orange-500" : "bg-orange-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									DESENHO PENDENTE
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											missingSignature: !filters.missingSignature,
										})
									}
									className={`${
										filters.missingSignature ? "bg-orange-500" : "bg-orange-300"
									} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									FALTANDO ASSINATURA
								</button>
								{/* <button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											failedGranting: !filters,
										})
									}
									className={`${filters.failedGranting ? "bg-red-500" : "bg-red-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									PARECER REPROVADO
								</button>
								<button
									type="button"
									onClick={() =>
										setFilters({
											...filters,
											failedInspection: !filters.failedInspection,
										})
									}
									className={`${filters.failedInspection ? "bg-red-500" : "bg-red-300"} flex h-[36px] cursor-pointer items-center justify-center rounded px-2 text-xs font-bold text-white`}
								>
									VISTORIA REPROVADA
								</button> */}
							</div>
							{/* {getTotalCircuitBreakers() ? (
								<div className="flex flex-col items-center justify-center gap-2">
									<h1 className="font-medium text-gray-600">CONTAGEM DE DISJUNTORES CADASTRADOS</h1>
									<div className="grid w-full grid-cols-1 gap-2 md:grid-cols-4">
										{sortTotalCircuitBreakerKeys(Object.keys(getTotalCircuitBreakers())).map(
											//Object.keys(getTotalCircuitBreakers())
											(key, index) => (
												<p key={`${key}`} className={`${getCircuitBreakerTypeColors(key)} rounded p-1 text-center`}>
													{key} - ({formatDecimalPlaces(getTotalCircuitBreakers()[key])} UN)
												</p>
											),
										)}
									</div>
								</div>
							) : null} */}
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>

			{projectsLoading ? <ProjetosSkeleton /> : null}
			{projectsError ? <ErrorComponent msg={getErrorMessage(projectErrorInstance)} /> : null}
			{projectsSuccess ? (
				<div className="mt-4 flex flex-wrap justify-around gap-3">
					{projects.map((project, index) => (
						<ProjectCard key={project._id} project={project} index={index} handleOpenModal={() => setEditProjectModal({ isOpen: true, projectId: project._id })} />
					))}
				</div>
			) : null}

			{editProjectModal.isOpen && editProjectModal.projectId && (
				<ModalProjetos projectId={editProjectModal.projectId} modalIsOpen={editProjectModal.isOpen} closeModal={() => setEditProjectModal({ isOpen: false, projectId: null })} />
			)}
		</div>
	);
}

function ProjectsPageContentStats() {
	const { data: stats, queryParams, updateQueryParams } = useEngineeringSectorStats({});
	return (
		<div className="w-full flex flex-col gap-2 border border-gray-300 rounded-xl p-3 shadow-sm">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ChartArea className="h-4 w-4 min-w-4 min-h-4" />
					<h1 className="text-xs font-medium uppercase tracking-tight">ESTATÍSTICAS</h1>
				</div>
				<DateIntervalInput
					label="Período"
					labelClassName="text-xs font-medium leading-none tracking-tight"
					className="border-none p-0 px-2 h-fit py-0.5 shadow-none"
					value={{
						after: queryParams.after ? new Date(queryParams.after) : undefined,
						before: queryParams.before ? new Date(queryParams.before) : undefined,
					}}
					handleChange={(v) =>
						updateQueryParams({
							after: v.after ? v.after.toISOString() : undefined,
							before: v.before ? v.before.toISOString() : undefined,
						})
					}
				/>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">EM ANDAMENTO</h1>
						<CircleDashed className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.emAndamento.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.emAndamento.potencia || 0)} kWp</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES SOLICITADAS</h1>
						<GitPullRequestArrow className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesSolicitadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesSolicitadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES EFETIVADAS</h1>
						<CircleCheck className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesEfetivadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesEfetivadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">HOMOLOGAÇÕES REPROVADAS</h1>
						<CircleX className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.homologacoesReprovadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.homologacoesReprovadas.potencia || 0)} kWp</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">VISTORIAS SOLICITADAS</h1>
						<CircleX className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.vistoriasSolicitadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasSolicitadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasSolicitadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
				<div className="flex min-h-[130px] w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/6">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">VISTORIAS EFETIVADAS</h1>
						<CircleCheck className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.vistoriasEfetivadas.qtde}</div>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasEfetivadas.potencia || 0)} kWp</p>
						<p className="text-xs text-gray-500">{formatDecimalPlaces(stats?.vistoriasEfetivadas.tempoMedio || 0)} HORAS (MÉDIA)</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
				<div className="flex w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/2">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">DESENHOS EXECUTIVOS FEITOS</h1>
						<DraftingCompass className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.desenhosExecutivosFeitos}</div>
					</div>
				</div>
				<div className="flex w-full flex-col rounded-xl border border-gray-300 bg-[#fff] p-3 shadow-sm lg:w-1/2">
					<div className="flex items-center justify-between">
						<h1 className="text-xs font-medium uppercase tracking-tight">DIAGRAMAS EXECUTIVOS FEITOS</h1>
						<Network className="h-4 w-4 min-w-4 min-h-4" />
					</div>
					<div className="flex w-full flex-col">
						<div className="text-2xl font-bold text-[#15599a]">{stats?.desenhosExecutivosFeitos}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function getProjectAccessGrantingStatusColors({ accessGrantingResponseDateString }: { accessGrantingResponseDateString?: string }) {
	if (!accessGrantingResponseDateString) return "border border-gray-300";
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
	return "border border-gray-300";
}
function getProjectFlags(project: TProjectDTO) {
	const homologationStatusValue = project.homologacao.status;
	const homologationStatusValueColor = homologationStatusValue === "APROVADO" ? "text-green-500" : homologationStatusValue === "REPROVADO" ? "text-red-500" : "text-primary";
	const homologationInspectionIsDone = !!project.homologacao.vistoria.dataEfetivacao;
	const executiveDiagramDone = !!project.homologacao.pendencias.diagramas;
	const executiveDrawingDone = !!project.homologacao.pendencias.desenhos;
	const projectIsDelivered = project.compra.statusEntrega === "ENTREGUE";
	const projectsDelivery = {
		label: projectIsDelivered ? "DATA DE ENTREGA" : "PREV. DE ENTREGA",
		value: projectIsDelivered ? formatDateAsLocale(project.compra.dataEntrega) || "-" : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
	};

	const timeSinceContractSignature = dayjs(project.contrato.dataAssinatura).diff(dayjs(CurrentDate), "day");
	const timeSinceAccessGrantingRequest = project.homologacao.acesso.dataSolicitacao ? dayjs(project.homologacao.acesso.dataSolicitacao).diff(dayjs(CurrentDate), "day") : undefined;
	const timeSinceAccessGrantingResponse = project.homologacao.acesso.dataResposta ? dayjs(project.homologacao.acesso.dataResposta).diff(dayjs(CurrentDate), "day") : undefined;

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
			value: projectIsDelivered ? formatDateAsLocale(project.compra.dataEntrega) || "-" : formatDateAsLocale(project.compra.previsaoEntrega) || "-",
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
function ProjectCard({ project, index, handleOpenModal }: { project: TProjectDTO; handleOpenModal: (projectId: string) => void; index: number }) {
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
				"w-full cursor-pointer md:w-[350px] lg:w-[450px] hover:bg-blue-100",
				getProjectAccessGrantingStatusColors({ accessGrantingResponseDateString: project.homologacao.acesso.dataResposta ?? undefined }),
			)}
		>
			<TagTipoDeServico tipoDeServico={project.tipoDeServico} />
			<div className="flex flex-col p-2">
				<div className="flex items-center justify-between">
					<p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
					<p className="text-xs text-[#15599a]">#{project.qtde}</p>
				</div>
				<ProjectCardsTags projectTags={project.etiquetas} />
				<div className="flex items-center justify-between">
					<div>
						<span className="text-xxs">{homologationStatusFlag.label}</span>
						<p className={cn("text-xs text-gray-600", homologationStatusFlag.valueColor)}>{homologationStatusFlag.value}</p>
					</div>
					<div className="text-end">
						<span className="text-end text-xxs">{homologationInspectionFlag.label}</span>
						<p className={cn("text-center text-xs text-gray-600", homologationInspectionFlag.valueColor)}>{homologationInspectionFlag.value}</p>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<span className="text-xxs">{executiveDiagramFlag.label}</span>
						<p className={cn("text-xs uppercase", executiveDiagramFlag.valueColor)}>{executiveDiagramFlag.value}</p>
					</div>
					<div>
						<span className="text-center text-xxs">{projectsDeliveryFlag.label}</span>
						<p className={cn("text-center text-xs uppercase text-gray-600", projectsDeliveryFlag.valueColor)}>{projectsDeliveryFlag.value}</p>
					</div>
					<div>
						<span className="text-xxs">{executiveDrawingFlag.label}</span>
						<p className={cn("text-center text-xs text-gray-600", executiveDrawingFlag.valueColor)}>{executiveDrawingFlag.value}</p>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex w-full flex-col">
						<span className="text-xxs">{timeSinceContractSignatureFlag.label}</span>
						<p className={cn("text-start text-xs uppercase text-red-500", timeSinceContractSignatureFlag.valueColor)}>{timeSinceContractSignatureFlag.value}</p>
					</div>
					<div className="flex w-full flex-col">
						<span className="text-end text-xxs">{timeSinceAccessGrantingResponseFlag.label}</span>
						<p className={cn("text-end text-xs uppercase text-red-500", timeSinceAccessGrantingResponseFlag.valueColor)}>{timeSinceAccessGrantingResponseFlag.value}</p>
					</div>
				</div>
				{project.homologacao.acesso.dataSolicitacao ? (
					<div className="flex w-full items-center justify-between">
						<p className="text-xxs ">{timeSinceAccessGrantingRequestFlag.label}</p>
						<p className={cn("text-start text-xs text-gray-600", timeSinceAccessGrantingRequestFlag.valueColor)}>{timeSinceAccessGrantingRequestFlag.value}</p>
					</div>
				) : null}
				{project.homologacao.fastTrack ? (
					<div className="flex w-full items-center justify-center">
						<h1 className={cn("rounded px-2 py-1 text-[0.55rem] font-bold", isFastTrackedFlag.valueColor)}>{isFastTrackedFlag.value}</h1>
					</div>
				) : null}
			</div>
		</motion.div>
	);
}
