import CheckboxInput from "@/components/inputs/Checkbox";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type {
  TGetEmployeesDefaultInput,
  TGetEmployeesOutputDefault,
} from "@/pages/api/colaboradores";
import { SlideMotionVariants } from "@/utils/constants";
import { formatDateAsLocale, formatDateBirthdayAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { usePurchaseControlCompositionKits } from "@/utils/methods/query/purchase-controls";
import { useEmployees, useUsers } from "@/utils/methods/query/users";
import type { TPurchaseControlCompositionKitDTO } from "@/utils/schemas/purchases";
import type { TUserDTO } from "@/utils/schemas/users";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Cake, IdCard, ListFilter, Mail, Pencil, Phone, UserRound, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import ControlPurchaseControlCompositionKit from "../controles-compras/kits-composicao/ControlPurchaseControlCompositionKit";
import NewPurchaseControlCompositionKit from "../controles-compras/kits-composicao/NewPurchaseControlCompositionKit";
import ControlPurchaseControl from "../controles-compras/modals/ControlPurchaseControl";

type CompositionKitsProps = {
  session: TAuthSession;
};
function CompositionKits({ session }: CompositionKitsProps) {
  const queryClient = useQueryClient();
  const [newCompositionKitModalIsOpen, setNewCompositionKitModalIsOpen] = useState(false);
  const [editCompositionKitModalId, setEditCompositionKitModalId] = useState<string | null>(null);
  const userHasSupplyEditingPermission = !!session.user.permissoes.suprimentos.editar;
  const {
    data: users,
    queryKey,
    isLoading,
    isError,
    isSuccess,
    error,
  } = usePurchaseControlCompositionKits();

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
          <h1 className="text-lg font-bold">Kits de Composição</h1>
          <p className="text-sm text-foreground">Gerencie os kits de composição da plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          {userHasSupplyEditingPermission ? (
            <Button onClick={() => setNewCompositionKitModalIsOpen(true)} type="button">
              NOVO KIT
            </Button>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <h3 className="text-sm text-center my-4 text-foreground animate-pulse">
          Carregando kits de composição...
        </h3>
      ) : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col gap-2 py-2">
          {users.length > 0 ? (
            users.map((kit) => (
              <CompositionKitBlockCard
                key={kit._id}
                kit={kit}
                handleEditClick={() => setEditCompositionKitModalId(kit._id)}
                userHasEditPermission={userHasSupplyEditingPermission}
              />
            ))
          ) : (
            <div className="text-foreground w-full text-center font-medium italic">
              Nenhum kit de composição encontrado.
            </div>
          )}
        </div>
      ) : null}
      {newCompositionKitModalIsOpen ? (
        <NewPurchaseControlCompositionKit
          session={session}
          closeModal={() => setNewCompositionKitModalIsOpen(false)}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
      {editCompositionKitModalId ? (
        <ControlPurchaseControlCompositionKit
          session={session}
          purchaseControlCompositionKitId={editCompositionKitModalId}
          closeModal={() => setEditCompositionKitModalId(null)}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
    </div>
  );
}

export default CompositionKits;

function CompositionKitBlockCard({
  kit,
  handleEditClick,
  userHasEditPermission,
}: {
  kit: TPurchaseControlCompositionKitDTO;
  handleEditClick: (id: string) => void;
  userHasEditPermission: boolean;
}) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{kit.titulo}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
          <p className="text-foreground text-xs font-medium">
            {formatDateAsLocale(kit.dataInsercao, true) || "N/A"}
          </p>
        </div>
        {userHasEditPermission ? (
          <Button
            variant={"ghost"}
            className="flex items-center gap-1 px-2 py-1"
            size={"fit"}
            onClick={() => handleEditClick(kit._id)}
          >
            <Pencil className="w-4 h-4 min-w-4 min-h-4" />
            <p className="text-foreground text-sm font-semibold">EDITAR</p>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
