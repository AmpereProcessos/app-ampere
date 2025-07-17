import { Button } from "@/components/ui/button";
import Avatar from "@/components/utils/Avatar";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { cn } from "@/lib/utils";
import { TPurchasesControlPageModes } from "@/pages/suprimentos/controle-compras";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { usePurchaseControlsByFilters } from "@/utils/methods/query/purchase-controls";
import { TPurchaseControlSimplifiedDTO } from "@/utils/schemas/purchases";
import { CheckCheck, Factory, ListFilter, Package, Pencil, ScrollText, Tag, Truck, X } from "lucide-react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsCalendarPlus } from "react-icons/bs";
import { FaLocationDot, FaRotate } from "react-icons/fa6";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import PurchaseControlsFilterMenu from "./FilterMenu";
import NewPurchaseControl from "./modals/NewPurchaseControl";
import ControlPurchaseControl from "./modals/ControlPurchaseControl";

type PurchaseControlsCardModePageProps = {
	session: Session;
	handleSetMode: (mode: TPurchasesControlPageModes) => void;
};
function PurchaseControlsCardModePage({ session, handleSetMode }: PurchaseControlsCardModePageProps) {
	const queryClient = useQueryClient();

	const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);
	const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] = useState<boolean>(false);
	const [editPurchaseControlModal, setEditPurchaseControlModal] = useState<{ id: string | null; isOpen: boolean }>({ id: null, isOpen: false });
	const { data: purchaseControlsByFiltersResult, isLoading, isError, isSuccess, error, filters, updateFilters } = usePurchaseControlsByFilters();

	const purchaseControls = purchaseControlsByFiltersResult?.purchaseControls;
	const purchaseControlsMatched = purchaseControlsByFiltersResult?.purchaseControlsMatched || 0;
	const purchaseControlsShowing = purchaseControls?.length || 0;
	const totalPages = purchaseControlsByFiltersResult?.totalPages || 0;
	return (
		<div className="flex grow flex-col gap-2 p-6">
			<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
				<div className="flex w-full flex-col items-center justify-between gap-2 gap-y-3 lg:flex-row ">
					<div className="flex flex-col items-center  gap-1 lg:flex-row">
						<div className="flex items-center gap-1">
							{filterMenuIsOpen ? (
								<div className="cursor-pointer text-gray-600 hover:text-blue-400">
									<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
								</div>
							) : (
								<div className="cursor-pointer text-gray-600 hover:text-blue-400">
									<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
								</div>
							)}
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLES DE COMPRA</p>
						</div>

						<button onClick={() => handleSetMode("grouped")} className="flex items-center gap-1 px-2 text-xs text-gray-500 duration-300 ease-out hover:text-gray-800">
							<FaRotate />
							<h1 className="font-medium">ALTERAR MODO</h1>
						</button>
					</div>
					<div className="flex items-center gap-1">
						<Button onClick={() => setFilterMenuIsOpen((prev) => !prev)} className="flex items-center gap-1">
							<ListFilter height={15} width={15} />
							<h1>FILTRAR</h1>
						</Button>
						<Button onClick={() => setNewPurchaseControlModalIsOpen(true)}>NOVO CONTROLE</Button>
					</div>
				</div>
				{filterMenuIsOpen ? (
					<PurchaseControlsFilterMenu filters={filters} updateFilters={updateFilters} queryLoading={isLoading} resetSelectedPage={() => updateFilters({ page: 1 })} />
				) : null}
			</div>
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => updateFilters({ page })}
				totalPages={totalPages || 0}
				itemsMatchedText={purchaseControlsMatched > 1 ? `${purchaseControlsMatched} compras encontradas.` : `${purchaseControlsMatched} compra encontrada.`}
				itemsShowingText={purchaseControlsShowing > 1 ? `Mostrando ${purchaseControlsShowing} compras.` : `Mostrando ${purchaseControlsShowing} compra.`}
			/>

			<div className="flex w-full flex-wrap items-center gap-2">
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					purchaseControls && purchaseControls.length > 0 ? (
						purchaseControls.map((purchaseControl) => (
							<PurchaseControlCard key={purchaseControl._id} purchaseControl={purchaseControl} handleClick={(id) => setEditPurchaseControlModal({ id, isOpen: true })} />
						))
					) : (
						<div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum controle de compra encontrado.</div>
					)
				) : null}
			</div>
			{newPurchaseControlModalIsOpen ? (
				<NewPurchaseControl session={session} affectedQueryKey={["purchase-controls"]} closeModal={() => setNewPurchaseControlModalIsOpen(false)} />
			) : null}
			{editPurchaseControlModal.id && editPurchaseControlModal.isOpen ? (
				<ControlPurchaseControl
					session={session}
					purchaseControlId={editPurchaseControlModal.id}
					affectedQueryKey={["purchase-controls"]}
					closeModal={() => setEditPurchaseControlModal({ id: null, isOpen: false })}
				/>
			) : null}
		</div>
	);
}

export default PurchaseControlsCardModePage;

type PurchaseControlCardProps = {
	purchaseControl: TPurchaseControlSimplifiedDTO;
	handleClick: (id: string) => void;
};
function PurchaseControlCard({ purchaseControl, handleClick }: PurchaseControlCardProps) {
	return (
		<div className="relative flex w-full flex-col justify-between gap-1 rounded border border-gray-500 bg-[#fff] p-2 shadow-sm">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<h1 className="text-sm font-bold leading-none tracking-tight">{purchaseControl.titulo}</h1>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
					<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">ETIQUETAS</h1>
					{purchaseControl.etiquetas.length > 0 ? (
						purchaseControl.etiquetas.map((tag, index) => (
							<div
								key={index}
								style={{
									border: "1px solid",
									borderColor: tag.cores.primaria,
									color: tag.cores.primaria,
									backgroundColor: tag.cores.secundaria,
								}}
								className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
							>
								<Tag width={10} height={10} />
								<h1 className="text-[0.5rem] font-bold tracking-tight">{tag.titulo}</h1>
							</div>
						))
					) : (
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80 ">NÃO DEFINIDAS</h1>
					)}
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-1">
						<Factory width={13} height={13} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FORNECEDOR</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{purchaseControl.fornecedor.nome || "N/A"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<ScrollText width={13} height={13} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">FATURAMENTOS</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							FATURAMENTOS {purchaseControl.faturamentos.filter((f) => !!f.data).length}/{purchaseControl.faturamentos.length}
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendar width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PEDIDO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(purchaseControl.dataPedido) || "N/A"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<FaLocationDot width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">LOCALIZAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">
							{purchaseControl.entrega.localizacao.cidade} ({purchaseControl.entrega.localizacao.uf})
						</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarEvent width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">PREVISÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(purchaseControl.entrega.dataPrevisao) || "N/A"}</h1>
					</div>
					<div className="flex items-center gap-1">
						<BsCalendarCheck width={10} height={10} />
						<h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">EFETIVAÇÃO</h1>
						<h1 className="py-0.5 text-center text-[0.6rem] font-bold  text-primary">{formatDateAsLocale(purchaseControl.entrega.dataEfetivacao) || "N/A"}</h1>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus />
						<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(purchaseControl.dataInsercao, true)}</p>
					</div>
					{purchaseControl.dataEfetivacao ? (
						<div className="flex items-center gap-1">
							<BsCalendarCheck color="#22c55e" />
							<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(purchaseControl.dataEfetivacao, true)}</p>
						</div>
					) : null}
					<div className="flex items-center gap-1">
						<Avatar url={purchaseControl.autor.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(purchaseControl.autor.nome)} />

						<p className="text-[0.65rem] font-medium text-primary/80">{purchaseControl.autor.nome}</p>
					</div>
				</div>
				<button onClick={() => handleClick(purchaseControl._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
					<Pencil width={10} height={10} />
					<p>EDITAR</p>
				</button>
			</div>
		</div>
	);
}
