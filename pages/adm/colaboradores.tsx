import { useSession } from "@/components/providers/SessionProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import NewEmployee from "@/components/identificador/colaboradores/NewEmployee";

import EditEmployee from "@/components/identificador/colaboradores/EditEmployee";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";

import CheckboxInput from "@/components/inputs/Checkbox";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { SlideMotionVariants } from "@/utils/constants";
import { formatDateAsLocale, formatDateBirthdayAsLocale } from "@/utils/methods/formatting";
import { useEmployees } from "@/utils/methods/query/users";
import type { TEmployeeDTO } from "@/utils/schemas/users";
import { AnimatePresence, motion } from "framer-motion";
import { BriefcaseBusiness, Cake, Landmark, ListFilter, Mail, Pencil, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BsCalendarPlus } from "react-icons/bs";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
type TEditModal = {
	isOpen: boolean;
	id: string | null;
};

function Employees() {
	const { session, status } = useSession();

	if (status === "loading") return <LoadingPage />;
	if (status !== "authenticated") return <LoadingPage />;
	return <EmployeesContent session={session} />;
}

type EmployeesContentProps = {
	session: TAuthSession;
};
function EmployeesContent({ session }: EmployeesContentProps) {
	const [activeOnly, setActiveOnly] = useState<boolean>(true);
	const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);
	const { data: employees, isLoading, isSuccess, isError, filters, setFilters } = useEmployees({ active: activeOnly });

	const userHasCreateUsersPermission = session.user.permissoes.usuarios.criar;
	const userHasViewUsersPermission = session.user.permissoes.usuarios.visualizar;
	const userHasEditUsersPermission = session.user.permissoes.usuarios.editar;
	const [newEmployeeModalIsOpen, setNewEmployeeModalIsOpen] = useState<boolean>(false);
	const [editEmployeeModal, setEditEmployeeModal] = useState<TEditModal>({
		isOpen: false,
		id: null,
	});

	if (!userHasViewUsersPermission) return <UnauthorizedComponent />;
	return (
		<div className="grow p-6">
			<div className="flex h-full grow flex-col">
				<div className="border-primary/20 flex flex-col items-center justify-between border-b p-1 gap-3">
					<div className="flex w-full items-center justify-between">
						<p className="text-center text-2xl font-black text-[#15599a] uppercase">CONTROLE DE COLABORADORES</p>
						<div className="flex items-center gap-2">
							<Button onClick={() => setDropdownMenuVisible((prev) => !prev)} type="button" variant={"ghost"}>
								<ListFilter className="w-4 h-4 min-w-4 min-h-4" />
							</Button>
							{userHasCreateUsersPermission ? <Button onClick={() => setNewEmployeeModalIsOpen(true)}>NOVO COLABORADOR</Button> : null}
						</div>
					</div>

					<AnimatePresence>
						{dropdownMenuVisible ? (
							<EmployeesFiltersMenu
								search={filters.search}
								updateSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))}
								activeOnly={activeOnly}
								updateActiveOnly={(value) => setActiveOnly(value)}
							/>
						) : null}
					</AnimatePresence>
					<div className="flex w-full items-center justify-end gap-2">
						<Button variant={"link"} asChild>
							<Link href={"/adm/propriedades"} className="flex items-center gap-1">
								<Landmark className="w-4 h-4 min-w-4 min-h-4" />
								PROPRIEDADES
							</Link>
						</Button>
					</div>
				</div>
				<div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
					{isLoading ? <LoadingPage /> : null}
					{isError ? <ErrorComponent msg="Erro ao buscar usuários" /> : null}
					{isSuccess &&
						employees.map((employee, index: number) => (
							<EmployeeCard
								key={employee._id?.toString()}
								employee={employee}
								handleEditClick={(id) => setEditEmployeeModal({ isOpen: true, id: id })}
								userHasEditUsersPermission={userHasEditUsersPermission}
							/>
						))}
				</div>
				{newEmployeeModalIsOpen ? <NewEmployee closeModal={() => setNewEmployeeModalIsOpen(false)} session={session} /> : null}
				{editEmployeeModal.isOpen && editEmployeeModal.id ? (
					<EditEmployee userId={editEmployeeModal.id} closeModal={() => setEditEmployeeModal({ isOpen: false, id: null })} session={session} />
				) : null}
			</div>
		</div>
	);
}

export default Employees;

type EmployeesFiltersMenuProps = {
	activeOnly: boolean;
	updateActiveOnly: (activeOnly: boolean) => void;
	search: string;
	updateSearch: (search: string) => void;
};
function EmployeesFiltersMenu({ search, updateSearch, activeOnly, updateActiveOnly }: EmployeesFiltersMenuProps) {
	return (
		<motion.div
			variants={SlideMotionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className="flex w-full flex-col gap-2 border border-primary/30 p-3 rounded"
		>
			<h1 className="text-sm font-medium">FILTROS</h1>
			<CheckboxInput
				labelTrue="APENAS ATIVOS"
				labelFalse="APENAS ATIVOS"
				labelClassName="text-[0.6rem]"
				checked={activeOnly}
				handleChange={(value) => updateActiveOnly(value)}
			/>
			<TextInput
				label="PESQUISA"
				labelClassName="text-[0.6rem]"
				holderClassName="text-xs p-2 min-h-[34px]"
				placeholder="Pesquise pelo nome do usuário..."
				value={search}
				handleChange={(value) => updateSearch(value)}
				width="100%"
			/>
		</motion.div>
	);
}

type EmployeeCardProps = {
	employee: TEmployeeDTO;
	handleEditClick: (id: string) => void;
	userHasEditUsersPermission: boolean;
};
function EmployeeCard({ employee, handleEditClick, userHasEditUsersPermission }: EmployeeCardProps) {
	function getPosition(positions: TEmployeeDTO["cargos"]) {
		const current = positions.find((p) => !!p.dataInicio && !p.dataFinal)?.cargo;
		return current || "CARGO INDEFINIDO";
	}
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs sm:flex-row dark:bg-[#121212]">
			<div className="flex items-center justify-center">
				<div className="relative h-20 max-h-20 min-h-20 w-20 max-w-20 min-w-20 overflow-hidden rounded-lg">
					{employee.avatar_url ? (
						<Image src={employee.avatar_url} alt={employee.nome} fill={true} objectFit="cover" />
					) : (
						<div className="bg-primary/50 text-primary-foreground flex h-full w-full items-center justify-center">
							<UserRound className="h-6 w-6" />
						</div>
					)}
				</div>
			</div>
			<div className="flex h-full grow flex-col gap-1">
				<div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm leading-none font-bold tracking-tight">{employee.nome}</p>
					</div>
					<div
						className={cn("px-2 py-0.5 rounded-lg text-[0.65rem] font-bold", {
							"bg-blue-500 text-white": employee.acessoAtivo,
							"bg-primary/20 text-primary": !employee.acessoAtivo,
						})}
					>
						{employee.acessoAtivo ? "ACESSO ATIVO" : "ACESSO INATIVO"}
					</div>
				</div>
				<div className="w-full flex flex-col gap-2 grow">
					<div className="w-full flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-1">
							<BriefcaseBusiness className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">{getPosition(employee.cargos)}</p>
						</div>
						<div className="flex items-center gap-1">
							<Mail className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">{employee.email}</p>
						</div>
						<div className="flex items-center gap-1">
							<Phone className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">{employee.telefone ?? "NÃO DEFINIDO"}</p>
						</div>
						<div className="flex items-center gap-1">
							<Cake className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">
								{employee.dataNascimento ? formatDateBirthdayAsLocale(employee.dataNascimento) : "NÃO DEFINIDO"}
							</p>
						</div>
					</div>
				</div>
				<div className="flex w-full items-center justify-between gap-1">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(employee.dataInsercao, true) || "N/A"}</p>
					</div>
					{userHasEditUsersPermission ? (
						<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleEditClick(employee._id)}>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);
}
