import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/utils/ErrorComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import { cn } from "@/lib/utils";
import {
  formatDateAsLocale,
  formatLocation,
  formatNameAsInitials,
} from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { usePurchaseControlsByFilters } from "@/utils/methods/query/purchase-controls";
import type { TPurchaseControlSimplifiedDTO } from "@/utils/schemas/purchases";
import { LinkIcon, MapPin, ShoppingCart } from "lucide-react";
import { BsCalendarCheck, BsCalendarPlus } from "react-icons/bs";

type PurchaseControlVinculationMenuProps = {
  closeMenu: () => void;
  handleSelect: (purchase: TPurchaseControlSimplifiedDTO) => void;
};

export default function PurchaseControlVinculationMenu({
  closeMenu,
  handleSelect,
}: PurchaseControlVinculationMenuProps) {
  const {
    data: purchaseControlsResult,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    updateFilters,
  } = usePurchaseControlsByFilters();

  const purchaseControls = purchaseControlsResult?.purchaseControls || [];
  const totalPages = purchaseControlsResult?.totalPages || 0;
  const purchaseControlsShowing = purchaseControls.length || 0;
  const purchaseControlsMatched = purchaseControlsResult?.purchaseControlsMatched || 0;
  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle="VINCULAÇÃO DE CONTROLE DE COMPRA"
      menuDescription="Selecione o controle de compra para vincular ao projeto."
      menuCancelButtonText="CANCELAR"
      stateIsLoading={isLoading}
      stateError={error?.message}
      closeMenu={closeMenu}
      dialogVariant="md"
    >
      <Input
        value={filters.title}
        placeholder="Pesquisa aqui pelo título do controle de compra..."
        onChange={(e) => updateFilters({ title: e.target.value })}
      />
      <div className="w-full flex flex-col gap-1.5">
        {isLoading ? <h1>Buscando controles de compra...</h1> : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? (
          <>
            <GeneralPaginationComponent
              activePage={filters.page}
              totalPages={totalPages}
              selectPage={(page) => updateFilters({ page })}
              queryLoading={isLoading}
              itemsMatchedText={`Foram encontrados ${purchaseControlsMatched} controles de compra.`}
              itemsShowingText={`Mostrando ${purchaseControlsShowing} controles de compra.`}
            />
            {purchaseControls.length > 0 ? (
              purchaseControls.map((purchase) => (
                <PurchaseControlCard
                  key={purchase._id}
                  purchase={purchase}
                  handleSelect={(t) => {
                    handleSelect(t);
                  }}
                />
              ))
            ) : (
              <h1 className="text-foreground w-full text-center text-sm font-medium tracking-tight">
                Nenhum controle de compra encontrado.
              </h1>
            )}
          </>
        ) : null}
      </div>
    </ResponsiveDialogDrawerViewOnly>
  );
}

type PurchaseControlCardProps = {
  purchase: TPurchaseControlSimplifiedDTO;
  handleSelect: (purchase: TPurchaseControlSimplifiedDTO) => void;
};
function PurchaseControlCard({ purchase, handleSelect }: PurchaseControlCardProps) {
  return (
    <div className="border-border bg-background flex w-full flex-col gap-1 rounded-lg border p-3 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{purchase.titulo}</p>
        </div>
        <div
          className={cn("flex items-center gap-1 text-center px-2 py-0.5 rounded-lg", {
            "bg-red-200 text-red-700": purchase.status === "PENDENTE",
            "bg-primary/20 text-primary": purchase.status === "EM COTAÇÃO",
            "bg-teal-200 text-teal-700": purchase.status === "AGUARDANDO APROVAÇÃO",
            "bg-sky-200 text-sky-700": purchase.status === "AGUARDANDO NOTA FUTURA",
            "bg-orange-200 text-orange-700": purchase.status === "AGUARDANDO PAGAMENTO",
            "bg-blue-200 text-blue-700": purchase.status === "AGUARDANDO COMPRA",
            "bg-violet-200 text-violet-700": purchase.status === "AGUARDANDO FATURAMENTO",
            "bg-lime-200 text-lime-700": purchase.status === "AGUARDANDO DESPACHE",
            "bg-emerald-200 text-emerald-700": purchase.status === "AGUARDANDO ENTREGA",
            "bg-green-200 text-green-700": purchase.status === "CONCLUÍDA",
            "bg-rose-200 text-rose-700": purchase.status === "PENDÊNCIAS",
          })}
        >
          <ShoppingCart className="w-4 h-4 min-w-4 min-h-4" />
          <p className="text-xs font-medium tracking-tight">{purchase.status}</p>
        </div>
      </div>

      <div className="w-full flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 min-w-4 min-h-4" />
          <h1 className="text-primary text-center text-[0.65rem]">
            {purchase.entrega.localizacao.uf && purchase.entrega.localizacao.cidade
              ? formatLocation({
                  location: {
                    uf: purchase.entrega.localizacao.uf,
                    cidade: purchase.entrega.localizacao.cidade,
                  },
                  includeCity: true,
                  includeUf: true,
                })
              : "NÃO DEFINIDO"}
          </h1>
        </div>
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus className="w-4 h-4 min-w-4 min-h-4" />
            <p className="text-foreground text-[0.65rem] font-medium">
              {formatDateAsLocale(purchase.dataInsercao, true)}
            </p>
          </div>
          {purchase.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck className="w-4 h-4 min-w-4 min-h-4 text-green-500" />
              <p className="text-foreground text-[0.65rem] font-medium">
                {formatDateAsLocale(purchase.dataEfetivacao, true)}
              </p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar className="w-4 h-4 min-w-4 min-h-4">
              <AvatarImage src={purchase.autor.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {formatNameAsInitials(purchase.autor.nome)}
              </AvatarFallback>
            </Avatar>
            <p className="text-foreground text-[0.65rem] font-medium">{purchase.autor.nome}</p>
          </div>
        </div>
        <Button
          variant={"ghost"}
          className="flex items-center gap-1 px-2 py-1"
          size={"fit"}
          onClick={() => handleSelect(purchase)}
        >
          <LinkIcon className="h-4 min-h-4 w-4 min-w-4" />
          <p className="text-foreground text-sm font-semibold">VINCULAR</p>
        </Button>
      </div>
    </div>
  );
}
