import EditProperty from "@/components/identificador/propriedades/EditProperty";
import NewProperty from "@/components/identificador/propriedades/NewProperty";
import PropertyCard from "@/components/identificador/propriedades/PropertyCard";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { useProperties } from "@/utils/methods/query/properties";
import { useEmployees } from "@/utils/methods/query/users";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

type TEditModal = {
	id: string | null;
	isOpen: boolean;
};

function Properties() {
	const { data: session, status } = useSession({ required: true });
	const { data: properties, isLoading, isError, isSuccess, filters, setFilters } = useProperties();
	const { data: employees } = useEmployees({ active: true });
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false);
	const [newPropertyModalIsOpen, setNewPropertyModalIsOpen] = useState<boolean>(false);
	const [editPropertyModal, setEditPropertyModal] = useState<TEditModal>({ id: null, isOpen: false });

	const tags = [...new Set(properties?.flatMap((module) => module.tags) || [])];
	if (status != "authenticated") return <LoadingPage />;
	return (
		<div className="grow p-6">
			<div className="flex h-full grow flex-col">
				<div className="flex flex-col items-center justify-between border-b border-gray-300 p-1">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col">
							<p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLE DE PROPRIEDADES</p>
							<p className="text-sm tracking-tight text-gray-500">{properties?.length || "..."} propriedades contabilizadas</p>
						</div>
						{dropdownMenuVisible ? (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropupCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(false)} />
							</div>
						) : (
							<div className="cursor-pointer text-gray-600 hover:text-blue-400">
								<IoMdArrowDropdownCircle style={{ fontSize: "25px" }} onClick={() => setDropdownMenuVisible(true)} />
							</div>
						)}
					</div>
					<div className="mt-2 flex w-full items-center justify-end gap-2">
						<button
							onClick={() => setNewPropertyModalIsOpen(true)}
							className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
						>
							CADASTRAR PROPRIEDADE
						</button>
					</div>
					<AnimatePresence>
						{dropdownMenuVisible ? (
							<motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
								<div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
									<TextInput
										label={"NOME DO ITEM"}
										value={filters.search}
										placeholder={"Digite o nome do item..."}
										handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
									/>

									<div className="w-full lg:w-[350px]">
										<MultipleSelectInput
											width={"100%"}
											label={"RESPONSÁVEIS"}
											selected={filters.responsibles}
											options={employees?.map((e) => ({ id: e._id, label: e.usuario, value: e._id })) || []}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													responsibles: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													responsibles: [],
												}))
											}
										/>
									</div>
									<div className="w-full lg:w-[350px]">
										<MultipleSelectInput
											width={"100%"}
											label={"TAGS"}
											selected={filters.tags}
											options={tags?.map((tag, index) => ({ id: index + 1, label: tag, value: tag })) || []}
											selectedItemLabel={"SEM FILTRO"}
											handleChange={(value) =>
												setFilters((prev) => ({
													...prev,
													tags: value as string[],
												}))
											}
											onReset={() =>
												setFilters((prev) => ({
													...prev,
													tags: [],
												}))
											}
										/>
									</div>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>
				</div>
				<div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg="Erro ao buscar propriedades..." /> : null}
					{isSuccess ? (
						properties.length > 0 ? (
							properties.map((property) => <PropertyCard property={property} openModal={(id) => setEditPropertyModal({ id: id, isOpen: true })} />)
						) : (
							<p className="w-full text-center font-medium italic text-gray-500">Nenhuma propriedade encontrada.</p>
						)
					) : null}
				</div>
			</div>
			{editPropertyModal.id && editPropertyModal.isOpen ? (
				<EditProperty propertyId={editPropertyModal.id} session={session} closeModal={() => setEditPropertyModal({ id: null, isOpen: false })} />
			) : null}
			{newPropertyModalIsOpen ? <NewProperty session={session} closeModal={() => setNewPropertyModalIsOpen(false)} /> : null}
		</div>
	);
}

export default Properties;
