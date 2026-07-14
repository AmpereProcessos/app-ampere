import ProjectVinculationMenu from "@/components/identificador/projects/ProjectVinculationMenu";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updatePurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import type { TProjectDTODBSimplified } from "@/utils/schemas/projects";
import { TPurchaseControl } from "@/utils/schemas/purchases";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import { type QueryClient, useMutation } from "@tanstack/react-query";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import { updateServiceOrder } from "@/utils/methods/mutation/service-orders";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";

type ProjectVinculationProps = {
  serviceOrderId?: string;
  queryClient: QueryClient;
  affectedQueryKey: any[];
  infoHolder: TServiceOrder;
  updateInfoHolder: (info: Partial<TServiceOrder>) => void;
};
function ServiceOrderProjectVinculation({
  serviceOrderId,
  queryClient,
  affectedQueryKey,
  infoHolder,
  updateInfoHolder,
}: ProjectVinculationProps) {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-service-order-project", serviceOrderId],
    mutationFn: handleVinculate,
    onMutate: async () => {
      if (serviceOrderId) await queryClient.cancelQueries({ queryKey: affectedQueryKey });
    },
    onSuccess: async (data) => {
      return toast.success(data);
    },
    onSettled: async () => {
      if (serviceOrderId) await queryClient.invalidateQueries({ queryKey: affectedQueryKey });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    },
  });

  async function handleVinculate(projectSimplified: TProjectDTODBSimplified) {
    updateInfoHolder({
      projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato },
    });
    if (serviceOrderId) {
      const msg = await updateServiceOrder({
        id: serviceOrderId,
        changes: {
          ...infoHolder,
          projeto: { id: projectSimplified._id, nome: projectSimplified.nomeDoContrato },
          idAnaliseTecnica: projectSimplified.idVisitaTecnica,
        },
      });
      return msg;
    }
    return "Vinculação feita com sucesso !";
  }
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES DO PROJETO"
      sectionTitleIcon={<FaLink size={12} />}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <h1 className="w-full text-center text-sm font-medium tracking-tight text-foreground">
          Nenhum projeto vinculado.
        </h1>
        <button
          type="button"
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
    </ResponsiveDialogDrawerSection>
  );
}

export default ServiceOrderProjectVinculation;
