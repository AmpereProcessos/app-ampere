import ProjectVinculationMenu from "@/components/identificador/projects/ProjectVinculationMenu";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updatePurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import { editRevenue } from "@/utils/methods/mutation/revenues";
import { TProjectDTODBSimplified } from "@/utils/schemas/projects";
import { TRevenue } from "@/utils/schemas/revenues";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import { QueryClient, useMutation } from "@tanstack/react-query";

type ProjectVinculationProps = {
  revenueId?: string;
  queryClient: QueryClient;
  affectedQueryKey: any[];
  infoHolder: TRevenue;
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>;
};
function RevenueProjectVinculation({
  revenueId,
  queryClient,
  affectedQueryKey,
  infoHolder,
  setInfoHolder,
}: ProjectVinculationProps) {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["update-revenue-project", revenueId],
    mutationFn: handleVinculate,
    onMutate: async () => {
      if (revenueId) await queryClient.cancelQueries({ queryKey: affectedQueryKey });
    },
    onSuccess: async (data) => {
      return toast.success(data);
    },
    onSettled: async () => {
      if (revenueId) await queryClient.invalidateQueries({ queryKey: affectedQueryKey });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    },
  });

  async function handleVinculate(projectSimplified: TProjectDTODBSimplified) {
    setInfoHolder((prev) => ({
      ...prev,
      projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato },
    }));
    if (!!revenueId) {
      const msg = await editRevenue({
        id: revenueId,
        changes: {
          ...infoHolder,
          projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato },
        },
      });
      return msg;
    }
    return "Vinculação feita com sucesso !";
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">
        INFORMAÇÕES DO PROJETO
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <h1 className="w-full text-center text-sm font-medium tracking-tight text-foreground">
          Nenhum projeto vinculado.
        </h1>
        <button
          onClick={() => setVinculationModalIsOpen(true)}
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
        >
          <FaLink />
          <h1>VINCULAR</h1>
        </button>
        {vinculationModalIsOpen ? (
          <ProjectVinculationMenu
            handleSelect={(projectSimplified) => mutate(projectSimplified)}
            closeModal={() => setVinculationModalIsOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
}

export default RevenueProjectVinculation;
