import CheckboxInput from "@/components/inputs/Checkbox";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TGetUsersDefaultInput, TGetUsersOutputDefault } from "@/pages/api/usuarios";
import { SlideMotionVariants } from "@/utils/constants";
import { formatDateAsLocale, formatDateBirthdayAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useUsers } from "@/utils/methods/query/users";
import type { TUserDTO } from "@/utils/schemas/users";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Cake, IdCard, ListFilter, Mail, Pencil, Phone, UserRound, X } from "lucide-react";
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
  const {
    data: users,
    queryKey,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    setFilters,
    updateFilters,
  } = useUsers();

  const handleOnMutate = async () => {
    await queryClient.cancelQueries({ queryKey: queryKey });
  };
  const handleOnSettled = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKey });
  };
  return (
    <div className="flex h-full grow flex-col gap-3">
      <div className="border-border flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Usuários</h1>
          <p className="text-sm text-foreground">Gerencie os usuários da plataforma</p>
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
          <UserBlockFiltersMenu filters={filters} updateFilters={updateFilters} />
        ) : null}
      </AnimatePresence>
      <UsersBlockFiltersShowcase filters={filters} updateFilters={updateFilters} />
      {isLoading ? (
        <h3 className="text-sm text-center my-4 text-foreground animate-pulse">
          Carregando usuários...
        </h3>
      ) : null}
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
            <div className="text-foreground w-full text-center font-medium italic">
              Nenhum usuário encontrado.
            </div>
          )}
        </div>
      ) : null}
      {newUserModalIsOpen ? (
        <NewUser
          session={session}
          closeModal={() => setNewUserModalIsOpen(false)}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
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
}: {
  user: TGetUsersOutputDefault[number];
  handleEditClick: (id: string) => void;
  userHasEditUsersPermission: boolean;
}) {
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
              <p className="text-xs font-medium text-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 min-w-4 min-h-4" />
              <p className="text-xs font-medium text-foreground">
                {user.telefone ? user.telefone : "NÃO DEFINIDO"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
            <p className="text-foreground text-xs font-medium">
              {formatDateAsLocale(user.dataInsercao, true) || "N/A"}
            </p>
          </div>
          {userHasEditUsersPermission ? (
            <Button
              variant={"ghost"}
              className="flex items-center gap-1 px-2 py-1"
              size={"fit"}
              onClick={() => handleEditClick(user._id)}
            >
              <Pencil className="w-4 h-4 min-w-4 min-h-4" />
              <p className="text-foreground text-sm font-semibold">EDITAR</p>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type UserBlockFiltersMenuProps = {
  filters: TGetUsersDefaultInput;
  updateFilters: (filters: Partial<TGetUsersDefaultInput>) => void;
};
function UserBlockFiltersMenu({ filters, updateFilters }: UserBlockFiltersMenuProps) {
  return (
    <motion.div
      variants={SlideMotionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full flex-col gap-2"
    >
      <TextInput
        label="PESQUISA"
        labelClassName="text-[0.6rem]"
        holderClassName="text-xs p-2 min-h-[34px]"
        placeholder="Pesquise pelo nome do usuário..."
        value={filters.search ?? ""}
        handleChange={(value) => updateFilters({ search: value })}
        width="100%"
      />
      <CheckboxInput
        labelTrue="APENAS USUÁRIOS ATIVOS"
        labelFalse="APENAS USUÁRIOS ATIVOS"
        labelClassName="text-[0.6rem]"
        checked={filters.activeOnly}
        handleChange={(value) => updateFilters({ activeOnly: value })}
      />
      <CheckboxInput
        labelTrue="APENAS COLABORADORES ATIVOS"
        labelFalse="APENAS COLABORADORES ATIVOS"
        labelClassName="text-[0.6rem]"
        checked={filters.activeEmployeesOnly}
        handleChange={(value) => updateFilters({ activeEmployeesOnly: value })}
      />
    </motion.div>
  );
}

function UsersBlockFiltersShowcase({
  filters,
  updateFilters,
}: {
  filters: TGetUsersDefaultInput;
  updateFilters: (filters: Partial<TGetUsersDefaultInput>) => void;
}) {
  const FilterTag = ({
    label,
    value,
    onRemove,
  }: {
    label: string;
    value: string;
    onRemove?: () => void;
  }) => (
    <div className="bg-primary/10 flex items-center gap-1 rounded-lg px-2 py-0.5 text-[0.65rem]">
      <p className="text-foreground">
        {label}: <strong>{value}</strong>
      </p>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-primary hover:bg-primary/20 rounded-lg bg-transparent p-1"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:justify-end">
      <h1 className="text-[0.65rem] font-medium tracking-tight uppercase">FILTROS APLICADOS</h1>
      {filters.search && filters.search.trim().length > 0 ? (
        <FilterTag
          label="PESQUISA"
          value={filters.search}
          onRemove={() => updateFilters({ search: "" })}
        />
      ) : null}
      {filters.activeOnly ? (
        <FilterTag
          label="APENAS USUÁRIOS ATIVOS"
          value="SIM"
          onRemove={() => updateFilters({ activeOnly: false })}
        />
      ) : null}
      {filters.activeEmployeesOnly ? (
        <FilterTag
          label="APENAS COLABORADORES ATIVOS"
          value="SIM"
          onRemove={() => updateFilters({ activeEmployeesOnly: false })}
        />
      ) : null}
    </div>
  );
}
