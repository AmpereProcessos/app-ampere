import FilterMenu from "@/components/identificador/almoxarifado/separacao/FilterMenu";
import SeparationProjectCard from "@/components/identificador/almoxarifado/separacao/SeparationProjectCard";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { useWarehouseProjects } from "@/utils/methods/query/warehouse";
import React, { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import LoadingPage from "../../components/utils/LoadingPage";
function PendingMaterialSeparation() {
  const { session, status } = useSession();

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  return <PendingMaterialSeparationContent session={session} />;
}

export default PendingMaterialSeparation;

function PendingMaterialSeparationContent({ session }: { session: TAuthSession }) {
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false);
  const {
    data: projects,
    isLoading,
    isError,
    isSuccess,
    filters,
    setFilters,
  } = useWarehouseProjects();
  return (
    <div className="grow p-6">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start">
            <p className="text-center text-2xl font-black text-[#15599a] uppercase">
              PROJETOS PARA SEPARAÇÃO
            </p>
            <p className="text-foreground tracking-tight italic">
              {projects != null ? `${projects.length} projetos para separação...` : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
        {dropdownMenuVisible ? <FilterMenu setFilters={setFilters} filters={filters} /> : null}
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={"Erro ao buscar projetos para separação."} /> : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => <SeparationProjectCard key={project._id} project={project} />)
          ) : (
            <p className="text-foreground w-full text-center text-lg font-medium italic">
              Nenhum projeto encontrado.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
