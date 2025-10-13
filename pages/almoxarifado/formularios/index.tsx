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
import SelectInput from "@/components/inputs/Select";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import { formatDate } from "@/utils/constants";
import { getPeriodDateParamsByReferenceDate } from "@/utils/methods/dates";
import { useWarehouseForms } from "@/utils/methods/query/warehouse-forms";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useQueryClient } from "@tanstack/react-query";

type TDateParam = {
	after: string;
	before: string;
};

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
						<div className="flex flex-wrap items-center justify-center gap-x-2">
							<div className="mt-2 w-full lg:mt-0 lg:w-[250px]">
								<SelectInput
									width={"100%"}
									label={"PARÂMETRO"}
									showLabel={false}
									value={filters.periodType ?? undefined}
									handleChange={(value) => updateFilters({ periodType: value as "dataInsercao" | "dataEfetivacao" | null | undefined })}
									options={[
										{ id: 1, label: "DATA DE INSERÇÃO", value: "dataInsercao" },
										{ id: 2, label: "DATA DE EFETIVAÇÃO", value: "dataEfetivacao" },
									]}
									selectedItemLabel="PARÂMETRO NÃO DEFINIDO"
									onReset={() => updateFilters({ periodType: null })}
								/>
							</div>
							<div className="mt-2 w-full lg:mt-0 lg:w-[250px]">
								<DateInput
									width={"100%"}
									label={"DEPOIS DE"}
									showLabel={false}
									value={filters.periodAfter ? formatDate(filters.periodAfter) : undefined}
									handleChange={(value) => updateFilters({ periodAfter: formatDateInputChange(value) as string })}
								/>
							</div>
							<h1 className="font-bold">ATÉ</h1>
							<div className="w-full lg:w-[250px]">
								<DateInput
									width={"100%"}
									label={"ANTES DE"}
									showLabel={false}
									value={filters.periodBefore ? formatDate(filters.periodBefore) : undefined}
									handleChange={(value) => updateFilters({ periodBefore: formatDateInputChange(value) as string })}
								/>
							</div>
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
				</div>
				<AnimatePresence>
					{dropdownMenuVisible ? (
						<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
							<div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
								<TextInput
									label={"NOME DO FORMULÁRIO..."}
									value={filters.search || ""}
									placeholder={"Preencha aqui o nome do formulário..."}
									handleChange={(value) => updateFilters({ search: value })}
								/>

								<button
									type="button"
									onClick={() => updateFilters({ pendingOnly: !filters.pendingOnly })}
									className={`rounded-md border border-blue-600 ${
										filters.pendingOnly ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"
									} h-[49px] px-4 py-1 text-sm font-bold text-white`}
								>
									SOMENTE EM ABERTO
								</button>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
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
			<button
				type="button"
				onClick={() => setNewFormModalIsOpen(true)}
				className="fixed bottom-10 left-150 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
			>
				<p className="text-sm font-bold uppercase">Novo Formulário</p>
			</button>
		</div>
	);
}
