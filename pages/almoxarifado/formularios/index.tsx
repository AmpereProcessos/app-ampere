import WarehouseFormulariesFilters from "@/components/identificador/almoxarifado/formulario/WarehouseFormulariesFilters";
import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import React, { useState } from "react";

import ModalEditFormulary from "../../../components/identificador/almoxarifado/formulario/EditWarehouseFormulary";
import ModalNewFormulary from "../../../components/identificador/almoxarifado/formulario/NewWarehouseFormulary";

import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "../../../components/utils/LoadingPage";

import FormularyCard from "@/components/identificador/almoxarifado/formulario/FormularyCard";
import ViewWarehouseFormularyDraft from "@/components/identificador/almoxarifado/formulario/ViewWarehouseFormularyDraft";
import { Button } from "@/components/ui/button";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TGetWarehouseFormulariesOutputDrafts } from "@/pages/api/almoxarifado/formularios/index-two";
import { useWarehouseForms, useWarehouseFormsDrafts } from "@/utils/methods/query/warehouse-forms";
import { useQueryClient } from "@tanstack/react-query";
import { Box, NotepadText } from "lucide-react";

type TEditModal = {
	isOpen: boolean;
	id: string | null;
};

function WarehouseFormularies() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status === "unauthenticated") return <UnauthenticatedComponent />;

	return <WarehouseFormulariesContent session={session} />;
}

export default WarehouseFormularies;

function WarehouseFormulariesContent({ session }: { session: TAuthSession }) {
	const queryClient = useQueryClient();

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
				<div className="flex w-full flex-wrap items-center justify-between gap-2">
					<p className="text-center text-2xl font-black text-[#15599a] uppercase lg:text-left">
						FORMULÁRIOS DE SAÍDA <strong className="text-[#fead41]">({warehouseFormulariesMatched || "..."})</strong>
					</p>
					<Button onClick={() => setNewFormModalIsOpen((prev) => !prev)}>NOVO FORMULÁRIO</Button>
				</div>

				<WarehouseFormulariesFilters filters={filters} updateFilters={updateFilters} />
			</div>
			<WarehouseFormulariesDrafts session={session} callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }} />
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
						warehouseFormularies.map((form) => (
							<FormularyCard key={form._id} formulary={form} openModal={(id) => setModalForm({ isOpen: true, id: id })} />
						))
					) : (
						<p className="text-primary/60 w-full text-center font-medium italic">
							Nenhum formulário encontrado para o parâmetros de filtro.
						</p>
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

function WarehouseFormulariesDrafts({
	session,
	callbacks,
}: {
	session: TAuthSession;
	callbacks: { onMutate: () => void; onSettled: () => void };
}) {
	const queryClient = useQueryClient();
	const [viewDraftModalIsOpen, setViewDraftModalIsOpen] = useState<string | null>(null);
	const { data: warehouseFormulariesDraftsResult, queryKey, isLoading, isError, isSuccess } = useWarehouseFormsDrafts();
	const handleOnMutate = async () => {
		if (callbacks?.onMutate) callbacks.onMutate();
		await queryClient.cancelQueries({ queryKey });
	};
	const handleOnSettled = async () => {
		if (callbacks?.onSettled) callbacks.onSettled();
		await queryClient.invalidateQueries({ queryKey });
	};
	if (!isSuccess) return null;
	return (
		<div className="flex w-full flex-col gap-2 rounded-lg bg-orange-200 p-3">
			<p className="text-xs font-medium tracking-tight text-orange-600">FORMULÁRIOS EM RASCUNHO</p>
			{warehouseFormulariesDraftsResult.length > 0 ? (
				warehouseFormulariesDraftsResult.map((form) => (
					<WarehouseFormulariesDraftsCard
						key={form._id}
						form={form}
						handleViewDetailsClick={() => setViewDraftModalIsOpen(form._id ?? null)}
					/>
				))
			) : (
				<p className="w-full text-center font-medium text-orange-600 italic">Nenhum formulário em rascunho encontrado.</p>
			)}
			{viewDraftModalIsOpen ? (
				<ViewWarehouseFormularyDraft
					formularyId={viewDraftModalIsOpen}
					session={session}
					closeModal={() => setViewDraftModalIsOpen(null)}
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
				/>
			) : null}
		</div>
	);
}

function WarehouseFormulariesDraftsCard({
	form,
	handleViewDetailsClick,
}: {
	form: TGetWarehouseFormulariesOutputDrafts[number];
	handleViewDetailsClick: () => void;
}) {
	return (
		<div className="flex w-full items-center justify-between gap-2 rounded-lg text-orange-800">
			<div className="flex min-w-0 items-center gap-2 truncate">
				<div className="flex items-center gap-1">
					<NotepadText className="h-4 w-4 min-h-4 min-w-4" />
					<p className="truncate text-xs font-bold tracking-tight">{form.titulo}</p>
				</div>
				<div className="hidden items-center gap-1 lg:flex">
					<Box className="h-4 w-4 min-h-4 min-w-4" />
					<p className="text-primary/50 text-xs font-medium tracking-tight">{form.materiais.length} materiais</p>
				</div>
			</div>
			<div className="flex min-w-fit items-center gap-2">
				<Button variant={"ghost"} size={"xs"} onClick={handleViewDetailsClick}>
					VER DETALHES
				</Button>
			</div>
		</div>
	);
}
