import DateInput from "@/components/inputs/Date";
import MultipleSelectInputVirtualized from "@/components/inputs/MultipleSelectInputVirtualized";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { formatDate, GeneralVisibleHiddenExitMotionVariants, serviceOrdersCategories } from "@/utils/constants";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TPersonalizedServiceOrderFilter } from "@/utils/schemas/service-order";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import AllCities from "@/utils/jsons/cidades.json";
import CheckboxInput from "@/components/inputs/Checkbox";
import { useUsers } from "@/utils/methods/query/users";
type ServiceOrdersFilterMenuProps = {
	filters: TPersonalizedServiceOrderFilter;
	updateFilters: (filters: TPersonalizedServiceOrderFilter) => void;
	queryLoading: boolean;
	resetSelectedPage: () => void;
};

function ServiceOrdersFilterMenu({ filters, updateFilters, queryLoading, resetSelectedPage }: ServiceOrdersFilterMenuProps) {
	const { data: users } = useUsers();
	const [filtersHolder, setFiltersHolder] = useState<TPersonalizedServiceOrderFilter>(filters);

	return (
		<AnimatePresence>
			<motion.div
				key={"editor"}
				variants={GeneralVisibleHiddenExitMotionVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="bg-background border-primary/20 mt-2 flex w-full flex-col gap-2 rounded-md border p-2"
			>
				<h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
				<div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
					<TextInput
						label="PESQUISA"
						value={filtersHolder.name}
						handleChange={(value) => {
							setFiltersHolder((prev) => ({ ...prev, name: value }));
						}}
						placeholder="Filtre pelo nome do favorecido..."
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>

					<TextInput
						label="EQUIPE RESPONSÁVEL"
						value={filtersHolder.responsible}
						handleChange={(value) => {
							setFiltersHolder((prev) => ({ ...prev, responsible: value }));
						}}
						placeholder="Filtre pelo nome da equipe responsável..."
						labelClassName="text-xs font-medium tracking-tight text-black"
					/>

					<div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
						<div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
							<div className="flex items-center justify-center gap-x-2">
								<div className="w-full lg:w-[250px]">
									<DateInput
										width={"100%"}
										label={"DEPOIS DE"}
										value={filtersHolder.period.after ? formatDate(filtersHolder.period.after) : undefined}
										handleChange={(value) =>
											setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, after: formatDateInputChange(value, "string") as string } }))
										}
										labelClassName="text-xs font-medium tracking-tight text-black"
									/>
								</div>
								<div className="w-full lg:w-[250px]">
									<DateInput
										width={"100%"}
										label={"ANTES DE"}
										value={filtersHolder.period.before ? formatDate(filtersHolder.period.before) : undefined}
										handleChange={(value) =>
											setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, before: formatDateInputChange(value, "string") as string } }))
										}
									/>
								</div>
							</div>
							<div className="w-full lg:w-[250px]">
								<SelectInput
									width={"100%"}
									label={"CAMPO DE FILTRO"}
									value={filtersHolder.period.field}
									options={[
										{ id: 1, label: "DATA DE CRIAÇÃO", value: "dataInsercao" },
										{ id: 2, label: "DATA PREVISÃO DE LIBERAÇÃO", value: "dataPrevisaoLiberacao" },
										{ id: 3, label: "DATA DE LIBERAÇÃO", value: "dataLiberacao" },
										{ id: 4, label: "DATA DE FINALIZAÇÃO", value: "dataEfetivacao" },
									]}
									selectedItemLabel={"SEM FILTRO"}
									handleChange={(value) =>
										setFiltersHolder((prev) => ({
											...prev,
											period: {
												...prev.period,
												field: value,
											},
										}))
									}
									onReset={() =>
										setFiltersHolder((prev) => ({
											...prev,
											period: {
												...prev.period,
												field: null,
											},
										}))
									}
								/>
							</div>
						</div>
					</div>
					<div className="w-full lg:w-[250px]">
						<MultipleSelectInputVirtualized
							label="CIDADE"
							selected={filtersHolder.city}
							options={AllCities.map((c, index) => ({ id: index + 1, value: c, label: c }))}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => {
								setFiltersHolder((prev) => ({
									...prev,
									city: value as string[],
								}));
							}}
							onReset={() => {
								setFiltersHolder((prev) => ({
									...prev,
									city: [],
								}));
							}}
							width="100%"
							labelClassName="text-xs font-medium tracking-tight text-black"
						/>
					</div>
					<div className="w-full lg:w-[250px]">
						<MultipleSelectInputVirtualized
							label="CATEGORIA"
							selected={filtersHolder.category}
							options={serviceOrdersCategories}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => {
								setFiltersHolder((prev) => ({
									...prev,
									category: value as string[],
								}));
							}}
							onReset={() => {
								setFiltersHolder((prev) => ({
									...prev,
									category: [],
								}));
							}}
							width="100%"
							labelClassName="text-xs font-medium tracking-tight text-black"
						/>
					</div>
					<div className="w-full lg:w-[250px]">
						<MultipleSelectInputVirtualized
							label="URGÊNCIA"
							selected={filtersHolder.urgency}
							options={[
								{ id: 1, label: "POUCO URGENTE", value: "POUCO URGENTE" },
								{ id: 2, label: "URGENTE", value: "URGENTE" },
								{ id: 3, label: "EMERGÊNCIA", value: "EMERGÊNCIA" },
							]}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => {
								setFiltersHolder((prev) => ({
									...prev,
									urgency: value as string[],
								}));
							}}
							onReset={() => {
								setFiltersHolder((prev) => ({
									...prev,
									urgency: [],
								}));
							}}
							width="100%"
							labelClassName="text-xs font-medium tracking-tight text-black"
						/>
					</div>
					<div className="w-full lg:w-[250px]">
						<MultipleSelectInputVirtualized
							label="AUTORES"
							selected={filtersHolder.authors}
							options={users?.map((u) => ({ id: u._id, label: u.nome, value: u._id })) || []}
							selectedItemLabel="NÃO DEFINIDO"
							handleChange={(value) => {
								setFiltersHolder((prev) => ({
									...prev,
									authors: value as string[],
								}));
							}}
							onReset={() => {
								setFiltersHolder((prev) => ({
									...prev,
									authors: [],
								}));
							}}
							width="100%"
							labelClassName="text-xs font-medium tracking-tight text-black"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 lg:flex-row">
					<div className="flex flex-wrap items-center gap-2">
						<div className="w-fit">
							<CheckboxInput
								labelFalse="SOMENTE PENDENTES"
								labelTrue="SOMENTE PENDENTES"
								checked={filtersHolder.pending}
								handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pending: value }))}
							/>
						</div>
						<div className="w-fit">
							<CheckboxInput
								labelFalse="SOMENTE LIBERADOS"
								labelTrue="SOMENTE LIBERADOS"
								checked={filtersHolder.released}
								handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, released: value }))}
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
						className="disabled:bg-primary/60 h-9 rounded bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:bg-blue-700 enabled:hover:text-white disabled:text-white"
					>
						PESQUISAR
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

export default ServiceOrdersFilterMenu;
