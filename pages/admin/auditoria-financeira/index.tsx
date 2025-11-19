import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import AuditingCard from "@/components/identificador/auditoriaFinanceira/AuditingCard";
import ProjectFinancesModal from "@/components/identificador/auditoriaFinanceira/ProjectFinancesModal";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";

import DateInput from "@/components/inputs/Date";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";

import { cidadesAtendidas, formatDate, formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { useFinancialAuditing } from "@/utils/methods/query/financial-auditing";
import { formatDateInputChange } from "@/utils/methods/shared";

import type { TProjectFinances } from "../../api/stats/financial-auditing";

import { FaCashRegister, FaPercent } from "react-icons/fa";
import { FaDiamond, FaHandHoldingDollar } from "react-icons/fa6";
import { VscDiffAdded } from "react-icons/vsc";

import NumberInput from "@/components/inputs/Number";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { allSellers, serviceTypes } from "@/utils/select-options";

const currentDate = new Date();
const afterDateParam = new Date(currentDate.setMonth(currentDate.getMonth() - 6)).toISOString();
const beforeDateParam = new Date().toISOString();
function FinancesAuditing() {
	const router = useRouter();
	const { session, status } = useSession();

	const isADM = !!session?.user?.permissoes.administrativo.visualizar;
	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;
	if (!isADM) return <UnauthorizedComponent />;
	return <FinancesAuditingContent session={session} />;
}

export default FinancesAuditing;

function FinancesAuditingContent({ session }: { session: TAuthSession }) {
	const [projectFinancesModal, setProjectFinancesModal] = useState<{ isOpen: boolean; projectId: string | null }>({
		isOpen: false,
		projectId: null,
	});
	const [dateFilter, setDateFilter] = useState<{
		field: string;
		after: string;
		before: string;
	}>({
		field: "contrato.dataAssinatura",
		after: afterDateParam,
		before: beforeDateParam,
	});
	const [projectTypes, setProjectTypes] = useState<string[]>([]);
	const {
		data: auditing,
		isLoading,
		isError,
		isSuccess,
		filters,
		setFilters,
	} = useFinancialAuditing({ after: dateFilter.after, before: dateFilter.before, field: dateFilter.field, projectTypes });

	function getStats({ info }: { info?: TProjectFinances[] }) {
		if (!info)
			return {
				projetos: 0,
				receitas: 0,
				despesas: 0,
				margem: 0,
				despesasPorTipo: {},
			};
		const projects = info.length;
		const totalRevenues = info.reduce((acc, current) => {
			const currentTotalRevenue = Object.values(current.receitas).reduce((acc, current) => acc + current, 0);
			return acc + currentTotalRevenue;
		}, 0);
		const totalExpenses = info.reduce((acc, current) => {
			const currentTotalRevenue = Object.values(current.despesas).reduce((acc, current) => acc + current, 0);
			return acc + currentTotalRevenue;
		}, 0);
		const overallMargin = ((totalRevenues - totalExpenses) * 100) / totalRevenues;

		const expensesByType = info.reduce((acc: { [key: string]: number }, current) => {
			for (const [key, value] of Object.entries(current.despesas)) {
				if (!acc[key]) acc[key] = 0;
				acc[key] += value;
			}
			return acc;
		}, {});
		console.log(expensesByType);
		return {
			projetos: projects,
			receitas: totalRevenues,
			despesas: totalExpenses,
			margem: overallMargin,
			despesasPorTipo: expensesByType,
		};
	}

	return (
		<div className="flex grow flex-col p-6">
			<div className="border-primary/20 flex flex-col items-center border-b px-1 py-2">
				<div className="flex w-full flex-col items-center justify-between lg:flex-row">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">AUDITORIA FINANCEIRA</p>
					</div>
					<div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
						<div className="w-full lg:w-[250px]">
							<MultipleSelectInput
								label="TIPO DE SERVIÇO"
								showLabel={false}
								selected={projectTypes}
								options={serviceTypes}
								selectedItemLabel="SEM FILTRO"
								handleChange={(value) => setProjectTypes(value as string[])}
								onReset={() => setProjectTypes([])}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-[250px]">
							<SelectInput
								label="PARÂMETRO"
								showLabel={false}
								value={dateFilter.field}
								options={[
									{ id: 1, label: "ASSINATURA DE CONTRATO", value: "contrato.dataAssinatura" },
									{ id: 2, label: "CONCLUSÃO DE OBRA", value: "obra.saida" },
								]}
								selectedItemLabel="CAMPO PADRÃO"
								handleChange={(value) => setDateFilter((prev) => ({ ...prev, field: value }))}
								onReset={() => setDateFilter((prev) => ({ ...prev, field: "contrato.dataAssinatura" }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-[250px]">
							<DateInput
								width={"100%"}
								label={"DEPOIS DE"}
								showLabel={false}
								value={dateFilter.after ? formatDate(dateFilter.after) : undefined}
								handleChange={(value) => setDateFilter((prev) => ({ ...prev, after: formatDateInputChange(value) as string }))}
							/>
						</div>
						<h1 className="font-bold">ATÉ</h1>
						<div className="w-full lg:w-[250px]">
							<DateInput
								width={"100%"}
								label={"ANTES DE"}
								showLabel={false}
								value={dateFilter.before ? formatDate(dateFilter.before) : undefined}
								handleChange={(value) => setDateFilter((prev) => ({ ...prev, before: formatDateInputChange(value) as string }))}
							/>
						</div>
					</div>
				</div>
				<div className="mt-2 flex w-full flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
					<div className="w-full lg:w-[350px]">
						<TextInput
							label="NOME DO CONTRATO"
							placeholder="Digite o nome do contrato..."
							value={filters.search}
							handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
						/>
					</div>
					<div className="w-full lg:w-[350px]">
						<MultipleSelectInput
							label="CIDADE"
							selected={filters.city}
							options={cidadesAtendidas.map((city, index) => ({ id: index + 1, label: city, value: city }))}
							handleChange={(value) => setFilters((prev) => ({ ...prev, city: value as string[] }))}
							onReset={() => setFilters((prev) => ({ ...prev, city: [] }))}
							selectedItemLabel="NÃO DEFINIDO"
						/>
					</div>
					<div className="w-full lg:w-[350px]">
						<MultipleSelectInput
							label="VENDEDOR"
							selected={filters.sellerName}
							options={allSellers.map((seller, index) => ({ id: index + 1, label: seller.value, value: seller.value }))}
							handleChange={(value) => setFilters((prev) => ({ ...prev, sellerName: value as string[] }))}
							onReset={() => setFilters((prev) => ({ ...prev, sellerName: [] }))}
							selectedItemLabel="NÃO DEFINIDO"
						/>
					</div>
					<div className="flex flex-col">
						<h1 className='"font-sans text-primary" font-bold'>FAIXA DE MÓDULOS</h1>
						<div className="flex items-center gap-1">
							<div className="w-[120px]">
								<NumberInput
									showLabel={false}
									label="MIN"
									placeholder="MIN"
									value={filters.moduleQty.min}
									handleChange={(value) => setFilters((prev) => ({ ...prev, moduleQty: { ...prev.moduleQty, min: value } }))}
									width="100%"
								/>
							</div>

							<div className="w-[120px]">
								<NumberInput
									showLabel={false}
									label="MÁX"
									placeholder="MÁX"
									value={filters.moduleQty.max}
									handleChange={(value) => setFilters((prev) => ({ ...prev, moduleQty: { ...prev.moduleQty, max: value } }))}
									width="100%"
								/>
							</div>
						</div>
					</div>
					<div className="w-full lg:w-[250px]">
						<MultipleSelectInput
							width={"100%"}
							label={"TOPOLOGIA"}
							selected={filters.topology}
							options={[
								{ id: 1, label: "INVERSOR", value: "INVERSOR" },
								{ id: 2, label: "MICRO", value: "MICRO" },
								{ id: 3, label: "OUTROS SERV.", value: "OUTROS SERV." },
								{ id: 4, label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
							]}
							selectedItemLabel={"SEM FILTRO"}
							handleChange={(value) =>
								setFilters((prev) => ({
									...prev,
									topology: value as string[],
								}))
							}
							onReset={() =>
								setFilters((prev) => ({
									...prev,
									topology: [],
								}))
							}
						/>
					</div>
				</div>
				<div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">PROJETOS NO ESTÁGIO</h1>
							<VscDiffAdded />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{getStats({ info: auditing }).projetos}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">RECEITAS</h1>
							<FaHandHoldingDollar />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: auditing }).receitas)}</div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">DESPESAS</h1>
							<FaCashRegister />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatToMoney(getStats({ info: auditing }).despesas)} </div>
						</div>
					</div>
					<div className="bg-background border-primary/20 flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/4">
						<div className="flex items-center justify-between">
							<h1 className="text-sm font-medium tracking-tight uppercase">MARGEM</h1>
							<FaPercent />
						</div>
						<div className="mt-2 flex w-full flex-col">
							<div className="text-2xl font-bold text-[#15599a]">{formatDecimalPlaces(getStats({ info: auditing }).margem)}%</div>
						</div>
					</div>
				</div>
				<div className="bg-background border-primary/20 flex min-h-[70px] w-full gap-2 rounded-xl border p-3 shadow-xs">
					<div className="flex items-center gap-2">
						<FaDiamond />
						<h1 className="text-sm font-medium tracking-tight uppercase">DESPESAS POR TIPO</h1>
					</div>
					<div className="mt-2 flex grow flex-wrap items-center justify-around">
						{Object.entries(getStats({ info: auditing }).despesasPorTipo).map(([key, value]) => (
							<p key={key} className="text-primary/60 text-[0.8rem]">
								{key}: <strong>{formatToMoney(value)}</strong>
							</p>
						))}
					</div>
				</div>
			</div>

			<div className="mt-4 flex flex-wrap justify-around gap-3">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg={"Erro ao buscar dados para auditoria financeira."} /> : null}
				{isSuccess
					? auditing.map((info) => (
							<AuditingCard key={info._id} info={info} handleClick={(id: string) => setProjectFinancesModal({ isOpen: true, projectId: id })} />
						))
					: null}
			</div>
			{projectFinancesModal.isOpen && projectFinancesModal.projectId ? (
				<ProjectFinancesModal projectId={projectFinancesModal.projectId} closeModal={() => setProjectFinancesModal({ isOpen: false, projectId: null })} />
			) : null}
		</div>
	);
}
