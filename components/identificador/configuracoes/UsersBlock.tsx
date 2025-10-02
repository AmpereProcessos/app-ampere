import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { SlideMotionVariants } from "@/utils/constants";
import { formatDateAsLocale, formatDateBirthdayAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useUsers } from "@/utils/methods/query/users";
import type { TUserDTO } from "@/utils/schemas/users";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Cake, IdCard, ListFilter, Mail, Pencil, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import EditUser from "../usuarios/EditUser";
import NewUser from "../usuarios/NewUser";

type UsersBlockProps = {
	session: TAuthSession;
};
function UsersBlock({ session }: UsersBlockProps) {
	const queryClient = useQueryClient();
	const [newUserModalIsOpen, setNewUserModalIsOpen] = useState(false);
	const [editUserModalId, setEditUserModalId] = useState<string | null>(null);
	const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState(false);
	const userHasAddUsersPermission = !!session.user.permissoes.usuarios.criar;
	const userHasEditUsersPermission = !!session.user.permissoes.usuarios.editar;
	const { data: users, queryKey, isLoading, isError, isSuccess, error, filters, setFilters } = useUsers();

	const handleOnMutate = async () => {
		await queryClient.cancelQueries({ queryKey: queryKey });
	};
	const handleOnSettled = async () => {
		await queryClient.invalidateQueries({ queryKey: queryKey });
	};
	return (
		<div className="flex h-full grow flex-col">
			<div className="border-primary/20 flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
				<div className="flex flex-col">
					<h1 className="text-lg font-bold">Meu Perfil</h1>
					<p className="text-sm text-primary/60">Gerencie suas informações pessoais</p>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={() => setFiltersMenuIsOpen(true)} type="button" variant={"ghost"}>
						<ListFilter className="w-4 h-4 min-w-4 min-h-4" />
					</Button>
					{userHasAddUsersPermission ? (
						<Button onClick={() => setNewUserModalIsOpen(true)} type="button">
							NOVO USUÁRIO
						</Button>
					) : null}
				</div>
			</div>
			<AnimatePresence>
				{filtersMenuIsOpen ? (
					<UserBlockFiltersMenu search={filters.search} updateSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))} />
				) : null}
			</AnimatePresence>
			{isLoading ? <h3 className="text-sm text-primary/60 animate-pulse">Carregando perfil...</h3> : null}
			{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2 py-2">
					{users.length > 0 ? (
						users.map((user) => (
							<UserBlockCard
								key={user._id}
								user={user}
								handleEditClick={() => setEditUserModalId(user._id)}
								userHasEditUsersPermission={userHasEditUsersPermission}
							/>
						))
					) : (
						<div className="text-primary/80 w-full text-center font-medium italic">Nenhum usuário encontrado.</div>
					)}
				</div>
			) : null}
			{newUserModalIsOpen ? (
				<NewUser session={session} closeModal={() => setNewUserModalIsOpen(false)} callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }} />
			) : null}
			{editUserModalId ? (
				<EditUser
					session={session}
					userId={editUserModalId}
					closeModal={() => setEditUserModalId(null)}
					callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
				/>
			) : null}
		</div>
	);
}

export default UsersBlock;

function UserBlockCard({
	user,
	handleEditClick,
	userHasEditUsersPermission,
}: { user: TUserDTO; handleEditClick: (id: string) => void; userHasEditUsersPermission: boolean }) {
	return (
		<div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs sm:flex-row dark:bg-[#121212]">
			<div className="flex items-center justify-center">
				<div className="relative h-20 max-h-20 min-h-20 w-20 max-w-20 min-w-20 overflow-hidden rounded-lg">
					{user.avatar_url ? (
						<Image src={user.avatar_url} alt={user.nome} fill={true} objectFit="cover" />
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
						<p className="text-sm leading-none font-bold tracking-tight">{user.nome}</p>
					</div>
					<div
						className={cn("px-2 py-0.5 rounded-lg text-[0.65rem] font-bold", {
							"bg-blue-500 text-white": user.acessoAtivo,
							"bg-primary/20 text-primary": !user.acessoAtivo,
						})}
					>
						{user.acessoAtivo ? "ACESSO ATIVO" : "ACESSO INATIVO"}
					</div>
				</div>
				<div className="w-full flex flex-col gap-2 grow">
					<div className="w-full flex items-center gap-3 flex-wrap">
						<div className="flex items-center gap-1">
							<Mail className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">{user.email}</p>
						</div>
						<div className="flex items-center gap-1">
							<Phone className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-xs font-medium text-primary/80">{user.telefone ?? "NÃO DEFINIDO"}</p>
						</div>
					</div>
				</div>
				<div className="flex w-full items-center justify-between gap-1">
					<div className="flex items-center gap-1">
						<BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
						<p className="text-primary/60 text-xs font-medium">{formatDateAsLocale(user.dataInsercao, true) || "N/A"}</p>
					</div>
					{userHasEditUsersPermission ? (
						<Button variant={"ghost"} className="flex items-center gap-1 px-2 py-1" size={"fit"} onClick={() => handleEditClick(user._id)}>
							<Pencil className="w-4 h-4 min-w-4 min-h-4" />
							<p className="text-primary/80 text-sm font-semibold">EDITAR</p>
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);
}

type UserBlockFiltersMenuProps = {
	search: string;
	updateSearch: (search: string) => void;
};
function UserBlockFiltersMenu({ search, updateSearch }: UserBlockFiltersMenuProps) {
	return (
		<motion.div variants={SlideMotionVariants} initial="initial" animate="animate" exit="exit" className="flex w-full flex-col gap-2">
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
