import type { TAuthSession } from "@/lib/authentication/types";
import { generateContractRevenue } from "@/utils/methods/mutation/comercial";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { useProjectRevenues } from "@/utils/methods/query/revenues";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeDollarSign } from "lucide-react";
import React, { useState } from "react";
import NewRevenueMenu from "../identificador/receitas/NewRevenueMenu";
import RevenueCard from "../identificador/receitas/RevenueCard";
import EditRevenue from "../identificador/receitas/modals/EditRevenue";
import ErrorComponent from "../utils/ErrorComponent";
import LoadingPage from "../utils/LoadingPage";

type InfoReceitasBlockProps = {
  session: TAuthSession;
  project: TProjectDTO;
  projectId: string;
  projectName: string;
  projectIdentificator: string;
};
function InfoReceitasBlock({
  session,
  project,
  projectId,
  projectName,
  projectIdentificator,
}: InfoReceitasBlockProps) {
  const queryClient = useQueryClient();
  const { data: revenues, isLoading, isError, isSuccess } = useProjectRevenues({ projectId });

  const [newRevenueMenuIsOpen, setNewRevenueMenuIsOpen] = useState<boolean>(false);
  const [modalRevenue, setModalRevenue] = useState<{ isOpen: boolean; id: null | string }>({
    isOpen: false,
    id: null,
  });

  return (
    <div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
        <BadgeDollarSign className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">RECEITAS DO PROJETO</h1>
      </div>
      <div className="flex w-full items-center justify-end gap-2 px-2">
        {revenues && revenues.length < 1 ? (
          <button
            type="button"
            onClick={() => generateContractRevenue({ data: project, queryClient: queryClient })}
            className="rounded-md bg-green-700 px-4 py-1 text-sm font-bold text-white"
          >
            GERAR RECEITA DE CONTRATO
          </button>
        ) : null}
        {newRevenueMenuIsOpen ? (
          <button
            type="button"
            onClick={() => setNewRevenueMenuIsOpen(false)}
            className="rounded-md bg-[#ed174c] px-4 py-1 text-sm font-bold text-white"
          >
            FECHAR
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setNewRevenueMenuIsOpen(true)}
            className="rounded-md bg-green-400 px-4 py-1 text-sm font-bold text-white"
          >
            NOVA RECEITA
          </button>
        )}
      </div>
      {newRevenueMenuIsOpen ? (
        <NewRevenueMenu
          session={session}
          projectId={projectId}
          projectName={projectName}
          projectIdentificator={projectIdentificator}
          closeMenu={() => setNewRevenueMenuIsOpen(false)}
        />
      ) : null}
      <div className="mt-4 flex w-full flex-col flex-wrap items-start justify-center gap-4 px-2 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={"Erro ao buscar receitas."} /> : null}
        {isSuccess && revenues ? (
          revenues.length > 0 ? (
            revenues.map((revenue) => (
              <RevenueCard
                key={revenue._id}
                revenue={revenue}
                openModal={(id) => setModalRevenue({ isOpen: true, id: id })}
              />
            ))
          ) : (
            <p className="text-foreground w-full text-center italic">
              Nenhuma receita encontrada...
            </p>
          )
        ) : null}
      </div>
      {modalRevenue.isOpen && modalRevenue.id ? (
        <EditRevenue
          session={session}
          revenueId={modalRevenue.id}
          closeModal={() => setModalRevenue({ isOpen: false, id: null })}
        />
      ) : null}
    </div>
  );
}

export default InfoReceitasBlock;
