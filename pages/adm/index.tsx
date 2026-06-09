import React, { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import ModalADM from "../../components/ModalADM";

import dayjs from "dayjs";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import { GeneralVisibleHiddenExitMotionVariants, SlideMotionVariants, equipesTecnicas, formatDate } from "../../utils/constants";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";

import ADMProjectCard from "@/components/identificador/adm/ADMProjectCard";
import CheckboxInput from "@/components/inputs/Checkbox";
import DateInput from "@/components/inputs/Date";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { type TUseADMProjectsFilters, useADMProjects } from "@/utils/methods/query/adm";
import { useUsers } from "@/utils/methods/query/crm/users";
import { useTags } from "@/utils/methods/query/tags";
import { formatDateForInputValue, formatDateOnInputChange } from "@/utils/methods/shared";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdPaid } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";
import LoadingPage from "../../components/utils/LoadingPage";
import { billableCompanies, contractStatus, inspectionStatus } from "../../utils/select-options";
import type { TAuthSession } from "@/lib/authentication/types";
function Administracao() {
	const { session, status } = useSession();

	const isAuthorized = session?.user.permissoes.administrativo.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isAuthorized) return <UnauthorizedPage />;
	return <AdministracaoContent session={session} />;
}

export default Administracao;

function AdministracaoContent({ session }: { session: TAuthSession }) {
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

	const { data: projects, filters, setFilters, isLoading, isSuccess, isError } = useADMProjects();

	const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null });

	function getStats({ info }: { info: TProjectDTO[] | undefined }) {
		if (!info) return { projetos: 0, cobrancasPendentes: 0, faturamentosPendentes: 0 };
		const projectsQty = info.length;
		const pendingCharges = info.reduce((acc, current) => {
			const toCharge = !current.pagamento.cobrancaFeita;
			if (toCharge) return acc + 1;
			return acc;
		}, 0);
		const pendingBilling = info.reduce((acc, current) => {
			const toBill = !current.faturamento.concluido;
			if (toBill) return acc + 1;
			return acc;
		}, 0);
		return { projetos: projectsQty, cobrancasPendentes: pendingCharges, faturamentosPendentes: pendingBilling };
	}

	function handleOpenModal(id: string) {
		return setModalProject({ isOpen: true, projectId: id });
	}

	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex flex-col items-center gap-y-2 border-b p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">Projetos no estágio de cobrança/faturamento</p>
					</div>
					{dropdownMenuVisible ? (
						<div className="text-primary/80 cursor-pointer hover:text-blue-400">
							<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
						</div>
					) : (
						<div className="text-primary/80 cursor-pointer hover:text-blue-400">
							<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
						</div>
					)}
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).projetos}</div>
						</div>
					</div>

					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">COBRANÇAS PENDENTES</h1>
							<MdPaid />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).cobrancasPendentes}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">FATURAMENTOS PENDENTES</h1>
							<IoDocumentTextOutline />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: projects }).faturamentosPendentes}</div>
						</div>
					</div>
				</div>
				<div className="my-2 flex w-full items-center justify-end gap-2">
					<Link href="/financeiro/despesas">
						<button type="button" className="rounded-md bg-[#ed174c] px-4 py-1 text-sm font-bold text-white">
							DESPESAS
						</button>
					</Link>
					<Link href="/financeiro/receitas">
						<button type="button" className="rounded-md bg-green-400 px-4 py-1 text-sm font-bold text-white">
							RECEITAS
						</button>
					</Link>
				</div>
				<AnimatePresence>{dropdownMenuVisible ? <ADMProjectFilters filters={filters} setFilters={setFilters} /> : null}</AnimatePresence>
			</div>
			<div className="mt-4 flex flex-wrap justify-around gap-3">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar projetos."} /> : null}
				{isSuccess
					? projects.map((project, index) => (
							<ADMProjectCard key={project._id} project={project} index={index} handleClick={(id) => handleOpenModal(id)} />
						))
					: null}
			</div>
			<Link href={"/comercial/solicitacoes-contrato"}>
				<div className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]">
					<p className="text-sm font-bold uppercase">SOLICITAÇÕES DE CONTRATO</p>
				</div>
			</Link>
			{modalProject.isOpen && modalProject.projectId ? (
				<ModalADM
					projectId={modalProject.projectId}
					modalIsOpen={modalProject.isOpen}
					closeModal={() => setModalProject({ isOpen: false, projectId: null })}
				/>
			) : null}
		</div>
	);
}
type ADMProjectFiltersProps = {
	filters: TUseADMProjectsFilters;
	setFilters: Dispatch<SetStateAction<TUseADMProjectsFilters>>;
};

function ADMProjectFilters({ filters, setFilters }: ADMProjectFiltersProps) {
	const { data: crmUsers } = useUsers({ includeDeleted: true });
	const { data: tags } = useTags({ initialFilters: { applicableToProjects: "true" } });

	return (
		<motion.div
			key={"editor"}
			variants={SlideMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
		>
			<h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
			<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
				<TextInput
					label="NOME DO CONTRATO"
					value={filters.search}
					placeholder="Digite o nome do contrato..."
					handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
				/>
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
				<div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
					<div className="flex items-center justify-center gap-x-2">
						<div className="w-full lg:w-[250px]">
							<DateInput
								width={"100%"}
								label={"DEPOIS DE"}
								value={filters.date.after ? formatDateForInputValue(filters.date.after) : undefined}
								handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateOnInputChange(value, "string", 'start') } }))}
							/>
						</div>
						<div className="w-full lg:w-[250px]">
							<DateInput
								width={"100%"}
								label={"ANTES DE"}
								value={filters.date.before ? formatDateForInputValue(filters.date.before) : undefined}
								handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateOnInputChange(value, "string", 'end') } }))}
							/>
						</div>
					</div>
					<div className="w-full lg:w-[250px]">
						<SelectInput
							width={"100%"}
							label={"CAMPO DE FILTRO"}
							value={filters.date.field || null}
							options={[
								{ id: 1, label: "SAÍDA DE OBRA", value: "obra.saida" },
								{ id: 2, label: "TROCA DO MEDIDOR", value: "medidor.data" },
								{ id: 3, label: "DATA ASS.CONTRATO", value: "contrato.dataAssinatura" },
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
			</div>
			<div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="EMPRESA A FATURAR"
						selected={filters.billingCompany}
						options={billableCompanies}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, billingCompany: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, billingCompany: [] }))}
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="EQUIPE TÉCNICA"
						selected={filters.technicalTeam}
						options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, technicalTeam: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, technicalTeam: [] }))}
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="VENDEDORES"
						selected={filters.sellers}
						options={crmUsers?.map((user, index) => ({ id: index + 1, label: user.nome, value: user.nome })) || []}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, sellers: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, sellers: [] }))}
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="STATUS DO CONTRATO"
						selected={filters.contractStatus}
						options={contractStatus}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, contractStatus: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, contractStatus: [] }))}
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="STATUS DO CONTRATO"
						selected={filters.contractStatus}
						options={contractStatus}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, contractStatus: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, contractStatus: [] }))}
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<MultipleSelectInput
						width="100%"
						label="STATUS DA VISTORIA"
						selected={filters.inspectionStatus}
						options={inspectionStatus}
						selectedItemLabel="SEM FILTRO"
						handleChange={(value) => setFilters((prev) => ({ ...prev, inspectionStatus: value as string[] }))}
						onReset={() => setFilters((prev) => ({ ...prev, inspectionStatus: [] }))}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col flex-wrap items-center justify-start gap-4 lg:flex-row">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="COBRANÇA GERAL PENDENTE"
						labelTrue="COBRANÇA GERAL PENDENTE"
						checked={filters.toCharge}
						handleChange={(value) => setFilters((prev) => ({ ...prev, toCharge: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="COBRANÇA GERAL CONCLUÍDA"
						labelTrue="COBRANÇA GERAL CONCLUÍDA"
						checked={filters.chargeDone}
						handleChange={(value) => setFilters((prev) => ({ ...prev, chargeDone: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="FATURAMENTOS PENDENTES"
						labelTrue="FATURAMENTOS PENDENTES"
						checked={filters.toBill}
						handleChange={(value) => setFilters((prev) => ({ ...prev, toBill: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="FATURAMENTOS CONCLUÍDOS"
						labelTrue="FATURAMENTOS CONCLUÍDOS"
						checked={filters.billingDone}
						handleChange={(value) => setFilters((prev) => ({ ...prev, billingDone: value }))}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col flex-wrap items-center justify-start gap-4 lg:flex-row">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="RECEBIMENTOS INDEFINIDOS"
						labelTrue="RECEBIMENTOS INDEFINIDOS"
						checked={filters.receiptsUndefined}
						handleChange={(value) => setFilters((prev) => ({ ...prev, receiptsUndefined: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="RECEBIMENTOS PARA HOJE"
						labelTrue="RECEBIMENTOS PARA HOJE"
						checked={filters.receiptToday}
						handleChange={(value) => setFilters((prev) => ({ ...prev, receiptToday: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="RECEBIMENTOS PARA A SEMANA"
						labelTrue="RECEBIMENTOS PARA A SEMANA"
						checked={filters.receiptThisWeek}
						handleChange={(value) => setFilters((prev) => ({ ...prev, receiptThisWeek: value }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="RECEBIMENTOS PARA O MÊS"
						labelTrue="RECEBIMENTOS PARA O MÊS"
						checked={filters.receiptThisMonth}
						handleChange={(value) => setFilters((prev) => ({ ...prev, receiptThisMonth: value }))}
					/>
				</div>
			</div>
		</motion.div>
	);
}
