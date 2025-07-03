import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { FaBox, FaMapMarkerAlt } from "react-icons/fa";

import LoadingPage from "../../../components/utils/LoadingPage";

import { useMaterials, useMaterialsDatabase, useMaterialsWithFilters } from "../../../utils/methods/query/materials";
import { TbRulerMeasure } from "react-icons/tb";
import TextInput from "../../../components/inputs/Text";
import NumberInput from "../../../components/inputs/Number";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdPricetag } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { IoResize } from "react-icons/io5";
import NewMaterial from "@/components/identificador/estoque/NewMaterial";
import { formatDecimalPlaces, formatToMoney, SlideMotionVariants } from "@/utils/constants";
import EditMaterial from "@/components/identificador/estoque/EditMaterial";
import { BsCalendarPlus } from "react-icons/bs";
import { formatDateAsLocale, formatDateTimeForInput } from "@/utils/methods/formatting";
import { Barcode, Box, ChartColumn, DollarSign, Edit, FileText, MoveDownRight, MoveUpRight, PackageMinus, PackagePlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TGetMaterialsDatabaseInput, TGetMaterialsDatabaseOutput } from "@/pages/api/almoxarifado/estoque/database";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { cn } from "@/lib/utils";
import Avatar from "@/components/utils/Avatar";
import SelectInput from "@/components/inputs/Select";
import DateInput from "@/components/inputs/Date";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import { formatDateInputChange } from "@/utils/methods/shared";
import CheckboxInput from "@/components/inputs/Checkbox";
import NewPurchaseControlSimplified from "@/components/identificador/controles-compras/modals/NewPurchaseControlSimplified";

function StockPage() {
	const { data: session, status } = useSession({ required: true });
	if (status !== "authenticated") return <LoadingPage />;
	const isAuthorized = !!session?.user.permissoes.rotas?.includes("Almoxarifado") || !!session?.user.permissoes.rotas?.includes("Obras");
	if (!isAuthorized) return <UnauthorizedComponent />;
	return <StockPageComponent session={session} />;
}

export default StockPage;

type StockPageComponentProps = {
	session: Session;
};
function StockPageComponent({ session }: StockPageComponentProps) {
	const [filterMenuIsOpens, setFilterMenuIsOpen] = useState<boolean>(false);
	const [newMaterialModalIsOpen, setNewMaterialModalIsOpen] = useState<boolean>(false);
	const [editMaterialModal, setEditMaterialModal] = useState({ id: null as string | null, isOpen: false });
	const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] = useState<boolean>(false);
	const { data: materialsResult, isLoading, isError, isSuccess, error, filters, updateFilters } = useMaterialsDatabase();

	const materials = materialsResult?.materials || [];
	const materialsMatched = materialsResult?.materialsMatched || 0;
	const materialsShowing = materials.length;
	const totalPages = materialsResult?.totalPages || 0;
	return (
		<div className="flex grow flex-col p-6 gap-2">
			<div className="flex flex-col items-center justify-between border-b border-primary/20 p-1 gap-2">
				<div className="flex w-full items-center justify-between">
					<p className="text-center text-2xl font-black uppercase text-[#15599a]">ESTOQUE</p>
					<div className="flex items-center gap-2">
						{filterMenuIsOpens ? (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(false)} />
							</div>
						) : (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setFilterMenuIsOpen(true)} />
							</div>
						)}
						<Button variant={"ghost"} onClick={() => setNewPurchaseControlModalIsOpen((prev) => !prev)}>
							NOVA SOLICITAÇÃO DE COMPRA
						</Button>
						<Button onClick={() => setNewMaterialModalIsOpen((prev) => !prev)}>NOVO MATERIAL</Button>
					</div>
				</div>
				<div className="w-full flex items-center justify-center flex-wrap lg:justify-end gap-6 gap-y-1">
					<Link href={"/suprimentos/entregas?tagIds=67113e8d1cef044a60bb7606"} className="flex items-center gap-1 hover:text-cyan-500 transition-colors">
						<FaBox className="h-4 w-4" />
						<p className="text-xs">ACOMPANHAMENTO DE ENTREGAS</p>
					</Link>
					<Link href={"/almoxarifado/estoque/relatorio-pdf"} className="flex items-center gap-1 hover:text-cyan-500 transition-colors">
						<FileText className="h-4 w-4" />
						<p className="text-xs">RELATÓRIO EM PDF</p>
					</Link>
					<Link href={"/almoxarifado/estoque/analitico"} className="flex items-center gap-1 hover:text-cyan-500 transition-colors">
						<ChartColumn className="h-4 w-4" />
						<p className="text-xs">ANÁLITICO</p>
					</Link>
					<Link href={"/almoxarifado/estoque/entrada"} className="flex items-center gap-1 hover:text-cyan-500 transition-colors">
						<Plus className="h-4 w-4" />
						<p className="text-xs">ENTRADA DE MATERIAIS</p>
					</Link>
				</div>
			</div>
			<AnimatePresence>{filterMenuIsOpens ? <FiltersMenu filters={filters} updateFilters={updateFilters} closeMenu={() => setFilterMenuIsOpen(false)} /> : null}</AnimatePresence>
			<GeneralPaginationComponent
				activePage={filters.page}
				queryLoading={isLoading}
				selectPage={(page) => updateFilters({ page })}
				totalPages={totalPages}
				itemsMatchedText={`Foram encontrados ${materialsMatched} materiais.`}
				itemsShowingText={`Monstrando ${materialsShowing} materiais.`}
			/>
			{isLoading ? <LoadingPage /> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			<div className="w-full flex flex-col gap-3">
				{isSuccess && materials ? (
					materials.length > 0 ? (
						materials.map((material) => (
							<MaterialCard
								key={material._id}
								material={material}
								handleClick={(id) =>
									setEditMaterialModal({
										id: id,
										isOpen: true,
									})
								}
							/>
						))
					) : (
						<p className="w-full text-center tracking-tight text-primary/50">Nenhum material foi encontrado.</p>
					)
				) : null}
			</div>
			{newMaterialModalIsOpen ? <NewMaterial closeModal={() => setNewMaterialModalIsOpen(false)} /> : null}
			{editMaterialModal.id && editMaterialModal.isOpen ? (
				<EditMaterial materialId={editMaterialModal.id} closeModal={() => setEditMaterialModal({ id: null, isOpen: false })} />
			) : null}
			{newPurchaseControlModalIsOpen ? (
				<NewPurchaseControlSimplified
					session={session}
					affectedQueryKey={[]}
					initialData={{
						etiquetas: [
							{
								id: "67113e8d1cef044a60bb7606",
								titulo: "ALMOXARIFADO",
								cores: {
									primaria: "#FF0000",
									secundaria: "#FFCCCB",
								},
							},
						],
					}}
					closeModal={() => setNewPurchaseControlModalIsOpen(false)}
				/>
			) : null}
		</div>
	);
}

type MaterialCardProps = {
	material: TGetMaterialsDatabaseOutput["materials"][number];
	handleClick: (id: string) => void;
};
function MaterialCard({ material, handleClick }: MaterialCardProps) {
	return (
		<div className="w-full flex flex-col p-3 rounded border border-primary/50 gap-2">
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
					<h1 className="text-sm font-bold tracking-tight">{material.nome}</h1>

					{material.qtdeMinima ? (
						<div className="flex items-center gap-1">
							<PackageMinus className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="py-0.5 text-center text-xs font-medium italic text-primary/80">QTDE MÍNIMA</h1>
							<h1 className="py-0.5 text-center text-xs font-bold  text-primary">{formatDecimalPlaces(material.qtdeMinima)}</h1>
						</div>
					) : null}
					{material.qtdeMaxima ? (
						<div className="flex items-center gap-1">
							<PackagePlus className="w-4 h-4 min-w-4 min-h-4" />
							<h1 className="py-0.5 text-center text-xs font-medium italic text-primary/80">QTDE MÁXIMA</h1>
							<h1 className="py-0.5 text-center text-xs font-bold  text-primary">{formatDecimalPlaces(material.qtdeMaxima)}</h1>
						</div>
					) : null}
				</div>
				<div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							<DollarSign className="w-4 h-4" />
							<h3 className="text-xs text-primary/80 font-medium">
								{formatToMoney(material.preco)} /{material.grandeza || "UN"}
							</h3>
						</div>
						<div
							className={cn("flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground", {
								"bg-red-500 text-white": (material.qtdeMinima && material.qtde <= material.qtdeMinima) || (material.qtdeMaxima && material.qtde >= material.qtdeMaxima),
							})}
						>
							<Box className="w-4 h-4" />
							<h3 className="text-xs font-bold">
								{formatDecimalPlaces(material.qtde)} {material.grandeza || "UN"}
							</h3>
							{material.qtdeMinima && material.qtde <= material.qtdeMinima ? <MoveDownRight className="w-4 h-4" /> : null}
							{material.qtdeMaxima && material.qtde >= material.qtdeMaxima ? <MoveUpRight className="w-4 h-4" /> : null}
						</div>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1">
						<BsCalendarPlus />
						<p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(material.dataInsercao, true)}</p>
					</div>
					{/* <div className="flex items-center gap-1">
						<Avatar width={20} height={20} url={material.} />
						<p className="text-[0.65rem] font-medium text-primary/80">{material.autor.nome}</p>
					</div> */}
				</div>
				<button type="button" onClick={() => handleClick(material._id)} className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
					<Edit className="w-3 h-3 min-w-3 min-h-3" />
					<p className="text-[0.65rem] font-medium">EDITAR</p>
				</button>
			</div>
		</div>
	);
}

type FiltersMenuProps = {
	filters: TGetMaterialsDatabaseInput;
	updateFilters: (filters: Partial<TGetMaterialsDatabaseInput>) => void;
	closeMenu: () => void;
};
function FiltersMenu({ filters, updateFilters, closeMenu }: FiltersMenuProps) {
	const [filtersHolder, setFiltersHolder] = useState(filters);

	return (
		<motion.div
			key={"additional-info"}
			variants={SlideMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="w-full flex flex-col p-2 rounded border border-primary/20 gap-2"
		>
			<h1 className="text-sm font-bold tracking-tight">FILTROS DO BANCO DE MATERIAIS</h1>
			<div className="w-full flex items-center gap-2 flex-wrap">
				<TextInput
					label="NOME DO MATERIAL"
					placeholder="Preencha aqui o nome do material..."
					value={filtersHolder.name}
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, name: value }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<NumberInput
					label="QUANTIDADE > QUE"
					placeholder="Preencha aqui quantidade maior que.."
					value={filtersHolder.quantity.greaterThan || null}
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, quantity: { ...prev.quantity, greaterThan: value } }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<NumberInput
					label="QUANTIDADE < QUE"
					placeholder="Preencha aqui quantidade menor que..."
					value={filtersHolder.quantity.lessThan || null}
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, quantity: { ...prev.quantity, lessThan: value } }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<NumberInput
					label="PREÇO UNITÁRIO > QUE"
					placeholder="Preencha aqui preço unitário maior que.."
					value={filtersHolder.price.greaterThan || null}
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, price: { ...prev.price, greaterThan: value } }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<NumberInput
					label="PREÇO UNITÁRIO < QUE"
					placeholder="Preencha aqui preço unitário menor que..."
					value={filtersHolder.price.lessThan || null}
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, price: { ...prev.price, lessThan: value } }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
				/>
				<SelectInput
					label="CAMPO P/ PERÍODO"
					value={filtersHolder.period.field}
					options={[
						{
							id: 1,
							label: "DATA DE INSERÇÃO",
							value: "dataInsercao",
						},
					]}
					selectedItemLabel="NÃO DEFINIDO"
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, field: value } }))}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					onReset={() => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, field: null } }))}
				/>
				<DateTimeInput
					label="DEPOIS DE"
					value={formatDateTimeForInput(filtersHolder.period.after)}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, after: formatDateInputChange(value, "string", false) as string } }))}
				/>
				<DateTimeInput
					label="DEPOIS DE"
					value={formatDateTimeForInput(filtersHolder.period.before)}
					labelClassName="text-[0.6rem]"
					holderClassName="text-xs p-2 min-h-[34px]"
					handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, before: formatDateInputChange(value, "string", false) as string } }))}
				/>
			</div>
			<div className="w-full flex items-center gap-2 flex-wrap">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="SOMENTE MATERIAIS ABAIXO DO MÍNIMO"
						labelTrue="SOMENTE MATERIAIS ABAIXO DO MÍNIMO"
						checked={filtersHolder.belowMinimum}
						handleChange={(v) => setFiltersHolder((prev) => ({ ...prev, belowMinimum: v }))}
						labelClassName="text-[0.6rem]"
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="SOMENTE MATERIAIS ACIMA DO MÁXIMO"
						labelTrue="SOMENTE MATERIAIS ACIMA DO MÁXIMO"
						checked={filtersHolder.aboveMaximum}
						handleChange={(v) => setFiltersHolder((prev) => ({ ...prev, aboveMaximum: v }))}
						labelClassName="text-[0.6rem]"
					/>
				</div>
			</div>
			<div className="w-full flex items-center justify-end">
				<Button
					onClick={() => {
						updateFilters({ ...filtersHolder, page: 1 });
						closeMenu();
					}}
				>
					FILTRAR
				</Button>
			</div>
		</motion.div>
	);
}
