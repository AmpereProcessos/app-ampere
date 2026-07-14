import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import EditUser from "@/components/identificador/usuarios/EditUser";
import NewUser from "@/components/identificador/usuarios/NewUser";
import UserCard from "@/components/identificador/usuarios/UserCard";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";

import TextInput from "@/components/inputs/Text";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { useUsers } from "@/utils/methods/query/users";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

export default function UsersControl() {
  const { session, status } = useSession();

  const userHasUsersEditPermission = !!session?.user.permissoes.usuarios.visualizar;
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  if (!userHasUsersEditPermission) return <UnauthorizedComponent />;

  return <UsersControlContent session={session} />;
}

function UsersControlContent({ session }: { session: TAuthSession }) {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false);

  const { data: users, isLoading, isError, isSuccess, filters, setFilters } = useUsers();
  const [newUserModalIsOpen, setNewUserModalIsOpen] = useState(false);

  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  return (
    <div className="grow p-6">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              CONTROLE DE USUÁRIOS
            </p>
            <p className="text-foreground text-sm tracking-tight">
              {users?.length || "..."} usuários contabilizados.
            </p>
          </div>

          {dropdownMenuVisible ? (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(false)}
              />
            </div>
          ) : (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setDropdownMenuVisible(true)}
              />
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            onClick={() => setNewUserModalIsOpen(true)}
            className="disabled:bg-primary/60 enabled:hover:bg-primary/80 h-9 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:text-white"
          >
            NOVO USUÁRIO
          </button>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 flex w-full flex-col gap-y-2"
            >
              <div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                <TextInput
                  label={"NOME"}
                  value={filters.search ?? ""}
                  placeholder={"Digite o nome do colaborador..."}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={"Erro ao buscar usuários."} /> : null}
        {isSuccess ? (
          users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                openModal={(id) => setEditUserModal({ id: id, isOpen: true })}
              />
            ))
          ) : (
            <p className="text-foreground w-full text-center text-lg font-medium italic">
              Nenhum usuário encontrado.
            </p>
          )
        ) : null}
      </div>
      {newUserModalIsOpen ? (
        <NewUser session={session} closeModal={() => setNewUserModalIsOpen(false)} />
      ) : null}
      {editUserModal.isOpen && editUserModal.id ? (
        <EditUser
          session={session}
          userId={editUserModal.id}
          closeModal={() => setEditUserModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  );
}
