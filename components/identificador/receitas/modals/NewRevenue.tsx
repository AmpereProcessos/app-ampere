import type { TAuthSession } from "@/lib/authentication/types";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMediaQuery } from "@/lib/hooks/media-query";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { type TRevenue } from "@/utils/schemas/revenues";

import { createRevenue } from "@/utils/methods/mutation/revenues";
import { useRevenueProject } from "@/utils/methods/query/revenues";
import RevenueProjectInformationBlock from "../modals/blocos/ProjectInformationBlock";
import RevenueProjectVinculation from "../modals/blocos/utils/ProjectVinculation";
import RevenueGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import RevenueReceiptsBlock from "./blocos/ReceiptsBlock";

type NewRevenueProps = {
  initialState?: Partial<TRevenue>;
  session: TAuthSession;
  closeModal: () => void;
};

function NewRevenue({ session, closeModal, initialState }: NewRevenueProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const initialInfoHolder: TRevenue = {
    nome: initialState?.nome || "",
    tipo: initialState?.tipo || "",
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    projeto: {
      id: initialState?.projeto?.id || null,
      nome: initialState?.projeto?.nome || null,
      identificador: initialState?.projeto?.identificador || null,
    },
    total: initialState?.total || 0,
    metodo: initialState?.metodo || "",
    efetivacao: {
      efetivado: initialState?.efetivacao?.efetivado || false,
      data: initialState?.efetivacao?.data || null,
    },
    fracionamento: initialState?.fracionamento || [],
    dataInsercao: initialState?.dataInsercao || new Date().toISOString(),
  };
  const [infoHolder, setInfoHolder] = useState<TRevenue>(initialInfoHolder);

  const { data: project } = useRevenueProject({ projectId: infoHolder.projeto.id || null });
  const { mutate: handleCreateRevenue, isPending } = useMutationWithFeedback({
    mutationKey: ["create-revenue"],
    mutationFn: createRevenue,
    queryClient: queryClient,
    affectedQueryKey: ["revenues"],
    callbackFn: () => console.log(),
  });

  const MENU_TITLE = "NOVA RECEITA";
  const MENU_DESCRIPTION = "Preencha os dados para cadastrar uma nova receita.";

  const formBody = (
    <>
      <RevenueGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
      {project ? (
        <RevenueProjectInformationBlock revenue={infoHolder} project={project} />
      ) : (
        <RevenueProjectVinculation
          revenueId={undefined}
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          affectedQueryKey={["revenues"]}
          queryClient={queryClient}
        />
      )}
      <RevenueReceiptsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
    </>
  );

  const dialogFooter = (
    <>
      <DialogClose asChild>
        <Button variant="outline">FECHAR</Button>
      </DialogClose>
      <LoadingButton
        loading={isPending}
        onClick={() =>
          //@ts-ignore
          handleCreateRevenue({ info: infoHolder })
        }
        type="button"
        className="bg-green-800 hover:bg-green-700"
      >
        CRIAR RECEITA
      </LoadingButton>
    </>
  );

  const drawerFooter = (
    <>
      <DrawerClose asChild>
        <Button variant="outline">FECHAR</Button>
      </DrawerClose>
      <LoadingButton
        loading={isPending}
        onClick={() =>
          //@ts-ignore
          handleCreateRevenue({ info: infoHolder })
        }
        type="button"
        className="bg-green-800 hover:bg-green-700"
      >
        CRIAR RECEITA
      </LoadingButton>
    </>
  );

  return isDesktop ? (
    <Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DialogContent className="dark:bg-background flex max-h-[85vh] min-h-[65vh] min-w-[70vw] flex-col">
        <DialogHeader>
          <DialogTitle>{MENU_TITLE}</DialogTitle>
          <DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-y-2 overflow-y-auto px-1 py-1">
          {formBody}
        </div>
        <DialogFooter>{dialogFooter}</DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer shouldScaleBackground={false} open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DrawerContent className="flex h-fit max-h-[90vh] flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>{MENU_TITLE}</DrawerTitle>
          <DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
        </DrawerHeader>
        <div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex flex-1 flex-col gap-y-2 overflow-y-auto px-4 py-1">
          {formBody}
        </div>
        <DrawerFooter>{drawerFooter}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default NewRevenue;
