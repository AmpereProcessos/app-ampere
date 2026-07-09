import { Button } from "@/components/ui/button";
import Avatar from "@/components/utils/Avatar";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import type { TPurchasesControlPageModes } from "@/pages/suprimentos/controle-compras";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { usePurchaseControlsByFilters } from "@/utils/methods/query/purchase-controls";
import type { TPurchaseControlSimplifiedDTO } from "@/utils/schemas/purchases";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCheck,
  Factory,
  ListFilter,
  Package,
  Pencil,
  ScrollText,
  Tag,
  Truck,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { BsCalendar, BsCalendarCheck, BsCalendarEvent, BsCalendarPlus } from "react-icons/bs";
import { FaLocationDot, FaRotate } from "react-icons/fa6";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import PurchaseControlsFilterMenu from "./FilterMenu";
import ControlPurchaseControl from "./modals/ControlPurchaseControl";
import NewPurchaseControl from "./modals/NewPurchaseControl";

type PurchaseControlsCardModePageProps = {
  session: TAuthSession;
  handleSetMode: (mode: TPurchasesControlPageModes) => void;
};
function PurchaseControlsCardModePage({
  session,
  handleSetMode,
}: PurchaseControlsCardModePageProps) {
  const queryClient = useQueryClient();

  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false);
  const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] =
    useState<boolean>(false);
  const [editPurchaseControlModal, setEditPurchaseControlModal] = useState<{
    id: string | null;
    isOpen: boolean;
  }>({ id: null, isOpen: false });
  const {
    data: purchaseControlsByFiltersResult,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    updateFilters,
  } = usePurchaseControlsByFilters();

  const purchaseControls = purchaseControlsByFiltersResult?.purchaseControls;
  const purchaseControlsMatched = purchaseControlsByFiltersResult?.purchaseControlsMatched || 0;
  const purchaseControlsShowing = purchaseControls?.length || 0;
  const totalPages = purchaseControlsByFiltersResult?.totalPages || 0;
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full flex-col items-center justify-end gap-2 gap-y-3 lg:flex-row">
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setFilterMenuIsOpen((prev) => !prev)}
              className="flex items-center gap-1"
            >
              <ListFilter height={15} width={15} />
              <h1>FILTRAR</h1>
            </Button>
            <Button onClick={() => setNewPurchaseControlModalIsOpen(true)}>NOVO CONTROLE</Button>
          </div>
        </div>
        {filterMenuIsOpen ? (
          <PurchaseControlsFilterMenu
            filters={filters}
            updateFilters={updateFilters}
            queryLoading={isLoading}
            resetSelectedPage={() => updateFilters({ page: 1 })}
          />
        ) : null}
      </div>
      <GeneralPaginationComponent
        activePage={filters.page}
        queryLoading={isLoading}
        selectPage={(page) => updateFilters({ page })}
        totalPages={totalPages || 0}
        itemsMatchedText={
          purchaseControlsMatched > 1
            ? `${purchaseControlsMatched} compras encontradas.`
            : `${purchaseControlsMatched} compra encontrada.`
        }
        itemsShowingText={
          purchaseControlsShowing > 1
            ? `Mostrando ${purchaseControlsShowing} compras.`
            : `Mostrando ${purchaseControlsShowing} compra.`
        }
      />

      <div className="flex w-full flex-wrap items-center gap-2">
        {isLoading ? <LoadingComponent /> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          purchaseControls && purchaseControls.length > 0 ? (
            purchaseControls.map((purchaseControl) => (
              <PurchaseControlCard
                key={purchaseControl._id}
                purchaseControl={purchaseControl}
                handleClick={(id) => setEditPurchaseControlModal({ id, isOpen: true })}
              />
            ))
          ) : (
            <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum controle de compra encontrado.
            </div>
          )
        ) : null}
      </div>
      {newPurchaseControlModalIsOpen ? (
        <NewPurchaseControl
          session={session}
          affectedQueryKey={["purchase-controls"]}
          closeModal={() => setNewPurchaseControlModalIsOpen(false)}
        />
      ) : null}
      {editPurchaseControlModal.id && editPurchaseControlModal.isOpen ? (
        <ControlPurchaseControl
          session={session}
          purchaseControlId={editPurchaseControlModal.id}
          affectedQueryKey={["purchase-controls"]}
          closeModal={() => setEditPurchaseControlModal({ id: null, isOpen: false })}
        />
      ) : null}
    </div>
  );
}

export default PurchaseControlsCardModePage;

type PurchaseControlCardProps = {
  purchaseControl: TPurchaseControlSimplifiedDTO;
  handleClick: (id: string) => void;
};
function PurchaseControlCard({ purchaseControl, handleClick }: PurchaseControlCardProps) {
  return (
    <div className="bg-background border-primary/60 relative flex w-full flex-col justify-between gap-1 rounded border p-2 shadow-xs">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <h1 className="text-sm leading-none font-bold tracking-tight">{purchaseControl.titulo}</h1>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:grow">
          <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
            ETIQUETAS
          </h1>
          {purchaseControl.etiquetas.length > 0 ? (
            purchaseControl.etiquetas.map((tag, index) => (
              <div
                key={tag.id}
                style={{
                  border: "1px solid",
                  borderColor: tag.cores.primaria,
                  color: tag.cores.primaria,
                  backgroundColor: tag.cores.secundaria,
                }}
                className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
              >
                <Tag width={10} height={10} />
                <h1 className="text-xxs font-bold tracking-tight">{tag.titulo}</h1>
              </div>
            ))
          ) : (
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              NÃO DEFINIDAS
            </h1>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
          <div className="flex items-center gap-1">
            <Factory width={13} height={13} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              FORNECEDOR
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {purchaseControl.fornecedor.nome || "N/A"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <ScrollText width={13} height={13} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              FATURAMENTOS
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              FATURAMENTOS {purchaseControl.faturamentos.filter((f) => !!f.data).length}/
              {purchaseControl.faturamentos.length}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendar width={10} height={10} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              PEDIDO
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatDateAsLocale(purchaseControl.dataPedido) || "N/A"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              LOCALIZAÇÃO
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {purchaseControl.entrega.localizacao.cidade} ({purchaseControl.entrega.localizacao.uf}
              )
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarEvent width={10} height={10} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              PREVISÃO
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatDateAsLocale(purchaseControl.entrega.dataPrevisao) || "N/A"}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck width={10} height={10} />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              EFETIVAÇÃO
            </h1>
            <h1 className="text-primary py-0.5 text-center text-[0.6rem] font-bold">
              {formatDateAsLocale(purchaseControl.entrega.dataEfetivacao) || "N/A"}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-foreground text-[0.65rem] font-medium">
              {formatDateAsLocale(purchaseControl.dataInsercao, true)}
            </p>
          </div>
          {purchaseControl.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-foreground text-[0.65rem] font-medium">
                {formatDateAsLocale(purchaseControl.dataEfetivacao, true)}
              </p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              url={purchaseControl.autor.avatar_url || undefined}
              width={20}
              height={20}
              fallback={formatNameAsInitials(purchaseControl.autor.nome)}
            />

            <p className="text-foreground text-[0.65rem] font-medium">
              {purchaseControl.autor.nome}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleClick(purchaseControl._id)}
          className="bg-primary text-secondary flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
        >
          <Pencil width={10} height={10} />
          <p>EDITAR</p>
        </button>
      </div>
    </div>
  );
}
