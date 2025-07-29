import CheckboxInput from "@/components/inputs/Checkbox";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import TextInput from "@/components/inputs/Text";

import StatesAndCities from "@/utils/jsons/estados-cidades.json";

import { formatDate, GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import type { TUseContractRequestsByFilters } from "@/utils/methods/query/contract-requests";
import { serviceTypes } from "@/utils/select-options";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }));
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }));
type ContractRequestsFilterMenuProps = {
	filters: TUseContractRequestsByFilters;
	updateFilters: (info: Partial<TUseContractRequestsByFilters>) => void;
	queryLoading: boolean;
	resetSelectedPage: () => void;
};
function ContractRequestsFilterMenu({ filters, updateFilters, queryLoading, resetSelectedPage }: ContractRequestsFilterMenuProps) {
	const [filtersHolder, setFiltersHolder] = useState<TUseContractRequestsByFilters>(filters);

	return (
		<AnimatePresence>
			<motion.div
				key={"editor"}
				variants={GeneralVisibleHiddenExitMotionVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
			>
				<h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
				<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
					<TextInput
						label="NOME DO CONTRATO"
						placeholder="Filtre pelo nome do contrato..."
						value={filtersHolder.name}
						handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, name: value }))}
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>

					<TextInput
						label="CPF/CNPJ DO TITULAR"
						placeholder="Filtre pelo CPF/CNPJ do titular..."
						value={filtersHolder.cpfCnpj}
						handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, cpfCnpj: value }))}
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>

					<MultipleSelectInput
						label="TIPOS DE SERVIÇO"
						labelClassName="text-xs font-medium tracking-tight text-black"
						selected={filtersHolder.serviceTypes}
						options={serviceTypes}
						handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, serviceTypes: value as string[] }))}
						onReset={() => setFiltersHolder((prev) => ({ ...prev, serviceTypes: [] }))}
						selectedItemLabel="NÃO DEFINIDO"
					/>

					<MultipleSelectInput
						label="TIPOS DE SERVIÇO"
						labelClassName="text-xs font-medium tracking-tight text-black"
						selected={filtersHolder.serviceTypes}
						options={serviceTypes}
						handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, serviceTypes: value as string[] }))}
						onReset={() => setFiltersHolder((prev) => ({ ...prev, serviceTypes: [] }))}
						selectedItemLabel="NÃO DEFINIDO"
					/>

					<MultipleSelectInputVirtualized
						label="CIDADE"
						selected={filtersHolder.cities}
						options={AllCities}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setFiltersHolder((prev) => ({
								...prev,
								cities: value as string[],
							}));
						}}
						onReset={() => {
							setFiltersHolder((prev) => ({
								...prev,
								cities: [],
							}));
						}}
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>

					<MultipleSelectInputVirtualized
						label="ESTADOS"
						selected={filtersHolder.ufs}
						options={AllStates}
						selectedItemLabel="NÃO DEFINIDO"
						handleChange={(value) => {
							setFiltersHolder((prev) => ({
								...prev,
								ufs: value as string[],
							}));
						}}
						onReset={() => {
							setFiltersHolder((prev) => ({
								...prev,
								ufs: [],
							}));
						}}
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>
				</div>
				<div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-wrap items-center gap-2">
						<div className="w-fit">
							<CheckboxInput
								labelFalse="APROVAÇÃO PENDENTE"
								labelTrue="APROVAÇÃO PENDENTE"
								checked={filtersHolder.pendingApproval}
								handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pendingApproval: value }))}
							/>
						</div>
						<div className="w-fit">
							<CheckboxInput
								labelFalse="CONFECÇÃO PENDENTE"
								labelTrue="CONFECÇÃO PENDENTE"
								checked={filtersHolder.pendingConfection}
								handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pendingConfection: value }))}
							/>
						</div>
					</div>
					<button
						type="button"
						disabled={queryLoading}
						onClick={() => {
							resetSelectedPage();
							updateFilters(filtersHolder);
						}}
						className="h-9 whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-700 enabled:hover:text-white"
					>
						PESQUISAR
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default ContractRequestsFilterMenu;
