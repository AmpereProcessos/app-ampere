import StructureAdequationsProjectsFilters from "@/components/identificador/controleEstruturas/StructureAdequationsProjectsFilters";
import InstallationStrucutreProjectCard from "@/components/identificador/controleEstruturas/InstallationStrucutreProjectCard";
import { useSession } from "@/components/providers/SessionProvider";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedPage from "@/components/utils/UnauthorizedPage";
import type { TAuthSession } from "@/lib/authentication/types";
import { useInstallationStructureExecutionProjects } from "@/utils/methods/query/execution";
import React from "react";
import { FaTools } from "react-icons/fa";
import { VscDiffAdded } from "react-icons/vsc";
import type { TInstallationStructureExecution } from "../api/gestao-obras/estruturas";

function InstallationStructureControls() {
  const { session, status } = useSession();
  const isAuthorized = session?.user.permissoes.execucao.visualizar;

  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;
  if (!isAuthorized) return <UnauthorizedPage />;
  return <InstallationStructureControlsContent session={session} />;
}

export default InstallationStructureControls;

function InstallationStructureControlsContent({ session }: { session: TAuthSession }) {
  const {
    data: projects,
    isLoading,
    isError,
    isSuccess,
    filters,
    setFilters,
  } = useInstallationStructureExecutionProjects();

  function getStats(info: TInstallationStructureExecution[]) {
    const pending = info.reduce(
      (acc, current) =>
        !current.estruturaPersonalizada.dataMontagem &&
        current.estruturaPersonalizada.status !== "PRONTA"
          ? acc + 1
          : acc,
      0,
    );
    const pendingPaid = info.reduce(
      (acc, current) =>
        !current.estruturaPersonalizada.dataMontagem &&
        current.estruturaPersonalizada.status !== "PRONTA" &&
        !!current.compra.dataPagamento
          ? acc + 1
          : acc,
      0,
    );

    return {
      projetos: info.length,
      pendentes: pending,
      pendentesPagos: pendingPaid,
    };
  }
  return (
    <div className="h-full grow bg-slate-50 p-6">
      <div className="border-border flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-center lg:justify-start">
          <p className="text-center text-2xl font-black text-[#15599a] uppercase">
            PROJETOS COM ADEQUAÇÃO DE ESTRUTURA
          </p>
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">
                PROJETOS COM ADEQUAÇÃO
              </h1>
              <VscDiffAdded />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats(projects || []).projetos}
              </div>
            </div>
          </div>
          <div className="bg-background border-border flex min-h-[110px] w-full flex-col rounded-xl border p-3 shadow-xs lg:w-1/3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium tracking-tight uppercase">PENDENTES</h1>
              <FaTools />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">
                {getStats(projects || []).pendentes}
              </div>
              <p className="text-foreground text-xs">
                {getStats(projects || []).pendentesPagos} pagos
              </p>
            </div>
          </div>
        </div>
        <StructureAdequationsProjectsFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex w-full flex-wrap justify-around gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? (
          <ErrorComponent msg="Oops, houve um erro ao encontrar projetos para adequação de estrutura." />
        ) : null}
        {isSuccess ? (
          projects.length > 0 ? (
            projects.map((project) => (
              <InstallationStrucutreProjectCard key={project._id} project={project} />
            ))
          ) : (
            <p className="text-foreground w-full text-center font-medium">
              Nenhum projeto foi encontrado...
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
