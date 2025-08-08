import EditProperty from "@/components/identificador/propriedades/EditProperty";
import NewProperty from "@/components/identificador/propriedades/NewProperty";
import PropertyCard from "@/components/identificador/propriedades/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { PROPERTY_METADATA_TYPES_CONFIG } from "@/lib/properties";
import { cn } from "@/lib/utils";
import { SlideMotionVariants } from "@/utils/constants";
import { useProperties } from "@/utils/methods/query/properties";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
import type { TProperty } from "@/utils/schemas/properties";
import { motion } from "framer-motion";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

type TEditModal = {
	id: string | null;
	isOpen: boolean;
};

function Properties() {
	const { data: session, status } = useSession({ required: true });

	if (status !== "authenticated") return <LoadingPage />;

	return <PropertiesContent session={session} />;
}

export default Properties;

type PropertiesContentProps = {
	session: Session;
};
function PropertiesContent({ session }: PropertiesContentProps) {
	const { data: properties, isLoading, isError, isSuccess, filters, updateFilters } = useProperties({ initialFilters: { includeOpenUsages: true } });
	const [newPropertyModalIsOpen, setNewPropertyModalIsOpen] = useState<boolean>(false);
	const [editPropertyModal, setEditPropertyModal] = useState<TEditModal>({ id: null, isOpen: false });

	return (
		<div className="grow flex flex-col h-full w-full gap-6 p-6">
			<div className="w-full flex flex-col gap-3 border-b border-primary/30 pb-1">
				<div className="flex flex-col items-center justify-between">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col">
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLE DE PROPRIEDADES</p>
							<p className="text-sm tracking-tight text-gray-500">{properties?.length || "..."} propriedades contabilizadas</p>
						</div>
					</div>
					<div className="mt-2 flex w-full items-center justify-end gap-2">
						<button
							type="button"
							onClick={() => setNewPropertyModalIsOpen(true)}
							className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
						>
							CADASTRAR PROPRIEDADE
						</button>
					</div>
					<motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="mt-4 flex w-full flex-col gap-y-2">
						<div className="flex items-center gap-3 justify-between w-full flex-col lg:flex-row gap-y-1">
							<div className="grow min-w-[250px]">
								<Input
									placeholder="PESQUISAR PROPRIEDADE..."
									value={filters.search || ""}
									onChange={(e) => updateFilters({ search: e.target.value })}
									className="w-full outline-none ring-0 focus:ring-0 focus:ring-offset-0"
								/>
							</div>
							<div className="flex gap-2 justify-end">
								<h1 className="text-sm font-medium text-primary/80">TIPOS DE PROPRIEDADE</h1>
								{Object.entries(PROPERTY_METADATA_TYPES_CONFIG).map(([type, config]) => (
									<Button
										key={type}
										variant={"ghost"}
										size={"fit"}
										className={cn("flex items-center gap-2 px-2 py-1", config.stylingClassName, {
											"opacity-100": filters.metadataTypes.includes(type as TProperty["metadados"]["tipo"]),
											"bg-primary/20": !filters.metadataTypes.includes(type as TProperty["metadados"]["tipo"]),
										})}
										onClick={() =>
											updateFilters({
												metadataTypes: filters.metadataTypes.includes(type as TProperty["metadados"]["tipo"])
													? filters.metadataTypes.filter((t) => t !== type)
													: [...filters.metadataTypes, type as TProperty["metadados"]["tipo"]],
											})
										}
									>
										{renderIconWithClassNames(config.icon, "h-4 w-4")}
										<p className="text-sm">{config.name}</p>
									</Button>
								))}
							</div>
						</div>
					</motion.div>
				</div>
				<div className="w-full flex items-center justify-end">
					<Button variant={"link"} asChild>
						<Link href={"/adm/propriedades/usos-temporarios"}>USOS TEMPORÁRIOS</Link>
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col gap-2">
				{isLoading ? <LoadingPage /> : null}
				{isError ? <ErrorComponent msg="Erro ao buscar propriedades..." /> : null}
				{isSuccess ? (
					properties.length > 0 ? (
						properties.map((property) => <PropertyCard key={property._id} property={property} openModal={(id) => setEditPropertyModal({ id: id, isOpen: true })} />)
					) : (
						<div className="w-full flex items-center justify-center gap-2">
							<p className="w-full text-center font-medium italic text-primary/80">Nenhuma propriedade para os parâmetros estabelecidos.</p>
						</div>
					)
				) : null}
			</div>
			{editPropertyModal.id && editPropertyModal.isOpen ? (
				<EditProperty propertyId={editPropertyModal.id} session={session} closeModal={() => setEditPropertyModal({ id: null, isOpen: false })} />
			) : null}
			{newPropertyModalIsOpen ? <NewProperty session={session} closeModal={() => setNewPropertyModalIsOpen(false)} /> : null}
		</div>
	);
}
