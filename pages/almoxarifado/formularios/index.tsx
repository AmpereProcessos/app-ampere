import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

import DateInput from "@/components/inputs/Date";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import TextInput from "@/components/inputs/Text";

import ModalEditFormulary from "../../../components/identificador/almoxarifado/formulario/EditWarehouseFormulary";
import ModalNewFormulary from "../../../components/identificador/almoxarifado/formulario/NewWarehouseFormulary";

import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "../../../components/utils/LoadingPage";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import FormularyCard from "@/components/identificador/almoxarifado/formulario/FormularyCard";
import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import { Button } from "@/components/ui/button";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TGetWarehouseFormulariesInput } from "@/pages/api/almoxarifado/formularios/index-two";
import { SlideMotionVariants, formatDate } from "@/utils/constants";
import { getPeriodDateParamsByReferenceDate } from "@/utils/methods/dates";
import { useWarehouseForms } from "@/utils/methods/query/warehouse-forms";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
type TEditModal = {
	isOpen: boolean;
	id: string | null;
};

const currentDate = new Date();
const { start, end } = getPeriodDateParamsByReferenceDate({ reference: currentDate, type: "year" });
function WarehouseFormularies() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	return <WarehouseFormulariesContent session={session} />;
}

export default WarehouseFormularies;

function WarehouseFormulariesContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

	const {
		data: warehouseFormulariesResult,
		queryKey,
		isLoading,
		isError,
		isSuccess,
		filters,
		updateFilters,
	} = useWarehouseForms({ initialFilters: { pendingOnly: true } });

	const [newFormModalIsOpen, setNewFormModalIsOpen] = useState(false);
	const [modalForm, setModalForm] = useState<TEditModal>({ isOpen: false, id: null });

	const warehouseFormularies = warehouseFormulariesResult?.warehouseForms || [];
	const warehouseFormulariesMatched = warehouseFormulariesResult?.warehouseFormsMatched || 0;
	const warehouseFormulariesShowing = warehouseFormularies.length;
	const totalPages = warehouseFormulariesResult?.totalPages || 0;

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey });
	};
	return (
		<div className="grow p-6">
			<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1">
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center gap-2 lg:flex-row">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">
							FORMULÁRIOS DE SAÍDA <strong className="text-[#fead41]">({warehouseFormulariesMatched || "..."})</strong>
						</p>
					</div>
					<div className="flex items-center gap-2">
						{dropdownMenuVisible ? (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
							</div>
						) : (
							<div className="text-primary/80 cursor-pointer hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
							</div>
						)}
						<Button onClick={() => setNewFormModalIsOpen((prev) => !prev)}>NOVO FORMULÁRIO</Button>
					</div>
				</div>
				<AnimatePresence>{dropdownMenuVisible ? <WarehouseFormulariesFilters filters={filters} updateFilters={updateFilters} /> : null}</AnimatePresence>

				<WarehouseFormulariesFiltersShowcase filters={filters} updateFilters={updateFilters} />
			</div>
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => updateFilters({ page })}
				totalPages={totalPages}
				itemsMatchedText={`Foram encontrados ${warehouseFormulariesMatched} formulários.`}
				itemsShowingText={`Monstrando ${warehouseFormulariesShowing} formulários.`}
			/>
			{isLoading ? <LoadingPage /> : null}
			{isError ? <ErrorComponent msg={"Erro ao buscar formulários."} /> : null}
			{isSuccess ? (
				<div className="mt-4 flex grow flex-wrap justify-around gap-3">
					{warehouseFormularies.length > 0 ? (
						warehouseFormularies.map((form) => <FormularyCard key={form._id} formulary={form} openModal={(id) => setModalForm({ isOpen: true, id: id })} />)
					) : (
						<p className="text-primary/60 w-full text-center font-medium italic">Nenhum formulário encontrado para o parâmetros de filtro.</p>
					)}
				</div>
			) : null}

			{modalForm.isOpen && modalForm.id ? (
				<ModalEditFormulary
					session={session}
					formularyId={modalForm.id}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
					closeModal={() => setModalForm({ isOpen: false, id: null })}
				/>
			) : null}
			{newFormModalIsOpen && (
				<ModalNewFormulary
					session={session}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
					closeModal={() => setNewFormModalIsOpen(false)}
				/>
			)}
		</div>
	);
}

type WarehouseFormulariesFiltersProps = {
	filters: TGetWarehouseFormulariesInput;
	updateFilters: (filters: Partial<TGetWarehouseFormulariesInput>) => void;
};
function WarehouseFormulariesFilters({ filters, updateFilters }: WarehouseFormulariesFiltersProps) {
	return (
		<motion.div
			variants={SlideMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs"
		>
			<h1 className="text-[0.65rem] font-medium tracking-tight uppercase">FILTROS</h1>
			<TextInput
				label="PESQUISA"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
				placeholder="Pesquise pelo título do formulário..."
				value={filters.search ?? ""}
				handleChange={(value) => updateFilters({ search: value })}
				width="100%"
			/>
			<div className="w-full flex items-center gap-2 flex-wrap">
				<div className="w-full lg:w-[250px]">
					<SelectInput
						label="PARÂMETRO DE PERÍODO"
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={filters.periodType ?? undefined}
						selectedItemLabel="NÃO DEFINIDO"
						onReset={() => updateFilters({ periodType: null })}
						handleChange={(value) => updateFilters({ periodType: value as "dataInsercao" | "dataEfetivacao" | null | undefined })}
						options={[
							{ id: 1, label: "DATA DE INSERÇÃO", value: "dataInsercao" },
							{ id: 2, label: "DATA DE EFETIVAÇÃO", value: "dataEfetivacao" },
						]}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<DateInput
						label="DEPOIS DE"
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={formatDate(filters.periodAfter)}
						handleChange={(value) => updateFilters({ periodAfter: formatDateInputChange(value) as string })}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-[250px]">
					<DateInput
						label="ANTES DE"
						labelClassName="text-[0.6rem]"
						holderClassName="text-xs p-2 min-h-[34px]"
						value={filters.periodBefore ? formatDate(filters.periodBefore) : undefined}
						handleChange={(value) => updateFilters({ periodBefore: formatDateInputChange(value) as string })}
						width="100%"
					/>
				</div>
			</div>
			<div className="w-full flex items-center gap-2 flex-wrap">
				<div className="w-full lg:w-fit">
					<CheckboxInput
						labelTrue="SOMENTE EM ABERTO"
						labelFalse="SOMENTE EM ABERTO"
						labelClassName="text-[0.6rem]"
						checked={filters.pendingOnly}
						handleChange={(value) => updateFilters({ pendingOnly: value })}
					/>
				</div>
			</div>
		</motion.div>
	);
}

type WarehouseFormulariesFiltersShowcaseProps = {
	filters: TGetWarehouseFormulariesInput;
	updateFilters: (filters: Partial<TGetWarehouseFormulariesInput>) => void;
};
function WarehouseFormulariesFiltersShowcase({ filters, updateFilters }: WarehouseFormulariesFiltersShowcaseProps) {
	const FilterTag = ({ label, value, onRemove }: { label: string; value: string; onRemove?: () => void }) => (
		<div className="bg-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem]">
			<p className="text-primary/80">
				{label}: <strong>{value}</strong>
			</p>
			{onRemove && (
				<button type="button" onClick={onRemove} className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1">
					<X size={12} />
				</button>
			)}
		</div>
	);

	const PERIOD_MAP = {
		dataInsercao: "DATA DE INSERÇÃO",
		dataEfetivacao: "DATA DE EFETIVAÇÃO",
	};

	return (
		<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:justify-end">
			<h1 className="text-[0.65rem] font-medium tracking-tight uppercase">FILTROS APLICADOS</h1>

			{filters.search && filters.search.trim().length > 0 ? (
				<FilterTag label="PESQUISA" value={filters.search} onRemove={() => updateFilters({ search: "" })} />
			) : null}
			{filters.pendingOnly ? (
				<FilterTag label="SOMENTE EM ABERTO" value="SOMENTE EM ABERTO" onRemove={() => updateFilters({ pendingOnly: false })} />
			) : null}
			{filters.periodAfter && filters.periodBefore && filters.periodType ? (
				<FilterTag
					label="PERÍODO"
					value={`${PERIOD_MAP[filters.periodType]} ${formatDate(filters.periodAfter)} a ${formatDate(filters.periodBefore)}`}
					onRemove={() => updateFilters({ periodType: null, periodAfter: null, periodBefore: null })}
				/>
			) : null}
		</div>
	);
}
