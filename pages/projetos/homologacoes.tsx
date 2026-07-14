import ControlHomologation from "@/components/identificador/crm-homologacoes/ControlHomologation";
import NewHomologation from "@/components/identificador/crm-homologacoes/NewHomologation";
import FilterMenu from "@/components/identificador/crm-homologacoes/Utils/FilterMenu";
import HomologationCard from "@/components/identificador/crm-homologacoes/Utils/HomologationCard";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useHomologations } from "@/utils/methods/query/crm/homologations";
import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

function HomologationsControlPage() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  return <HomologationsControlPageContent session={session} />;
}

export default HomologationsControlPage;

type HomologationsControlPageContentProps = {
  session: TAuthSession;
};
function HomologationsControlPageContent({ session }: HomologationsControlPageContentProps) {
  const {
    data: homologations,
    isLoading,
    isError,
    isSuccess,
    filters,
    setFilters,
  } = useHomologations();
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);
  const [newHomologationModalIsOpen, setNewHomologationModalIsOpen] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<{ id: string | null; isOpen: boolean }>({
    id: null,
    isOpen: false,
  });

  return (
    <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
      <div className="flex flex-col items-center border-b border-black pb-2">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-1">
            {filterMenuIsOpen ? (
              <div className="text-foreground cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setFilterMenuIsOpen(false)}
                />
              </div>
            ) : (
              <div className="text-foreground cursor-pointer hover:text-blue-400">
                <IoMdArrowDropdownCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setFilterMenuIsOpen(true)}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h1 className="text-xl leading-none font-black tracking-tight md:text-2xl">
                CONTROLE DE HOMOLOGAÇÕES
              </h1>
              <p className="text-foreground text-sm leading-none tracking-tight">
                {homologations?.length
                  ? homologations.length > 0
                    ? `${homologations.length} homologações contabilizadas`
                    : `${homologations.length} homologação contabilizada`
                  : "..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNewHomologationModalIsOpen(true)}
            className="disabled:bg-primary/60 enabled:hover:bg-primary/80 h-9 rounded bg-gray-900 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm enabled:hover:text-white disabled:text-white"
          >
            CRIAR HOMOLOGAÇÃO
          </button>
        </div>
        {filterMenuIsOpen ? <FilterMenu filters={filters} setFilters={setFilters} /> : null}
      </div>
      <div className="flex flex-wrap justify-between gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg="Erro ao buscar homologações." /> : null}
        {isSuccess ? (
          homologations.length > 0 ? (
            homologations.map((homologation) => (
              <HomologationCard
                key={homologation._id}
                homologation={homologation}
                handleClick={(id) => setEditModal({ id: id, isOpen: true })}
                userHasEditPermission={true}
              />
            ))
          ) : (
            <p className="text-foreground flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
              Não foram encontradas homologações...
            </p>
          )
        ) : null}
      </div>
      {newHomologationModalIsOpen ? (
        <NewHomologation
          session={session}
          affectedQueryKey={["homologations"]}
          closeModal={() => setNewHomologationModalIsOpen(false)}
        />
      ) : null}
      {editModal.isOpen && editModal.id ? (
        <ControlHomologation
          session={session}
          homologationId={editModal.id}
          closeModal={() => setEditModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  );
}
