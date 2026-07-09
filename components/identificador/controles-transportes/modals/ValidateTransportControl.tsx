import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { updateTransportControl } from "@/utils/methods/mutation/transport-controls";
import { useTransportControlByIdPublic } from "@/utils/methods/query/transport-controls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  DollarSign,
  ExternalLink,
  FileIcon,
  LayoutGrid,
  MapPin,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

type ValidateTransportControlProps = {
  transportControlId: string;
  queryKey: unknown[];
  closeModal: () => void;
};

export default function ValidateTransportControl({
  transportControlId,
  queryKey,
  closeModal,
}: ValidateTransportControlProps) {
  const queryClient = useQueryClient();
  const {
    data: transportControl,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useTransportControlByIdPublic({
    id: transportControlId,
  });

  const { mutate: handleValidate, isPending: validateIsPending } = useMutation({
    mutationKey: ["validate-transport-control"],
    mutationFn: async () =>
      await updateTransportControl({
        transportControlId,
        changes: { dataValidacao: new Date().toISOString() },
      }),
    onSuccess: () => {
      toast.success("Controle de transporte validado com sucesso!");
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({
        queryKey: ["transport-control-by-id-public", transportControlId],
      });
      closeModal();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const totalCosts = (transportControl?.custos ?? []).reduce((acc, curr) => acc + curr.valor, 0);
  const canValidate = !!transportControl?.dataFim && !transportControl?.dataValidacao;

  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle="VALIDAR CONTROLE DE TRANSPORTE"
      menuDescription="Confira os detalhes do transporte finalizado e valide o controle."
      menuCancelButtonText="FECHAR"
      closeMenu={() => closeModal()}
      dialogVariant="md"
      stateIsLoading={isLoading}
      stateError={error ? getErrorMessage(error) : null}
    >
      {isLoading ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess && transportControl ? (
        <>
          <ResponsiveDialogDrawerSection
            sectionTitleText="INFORMAÇÕES GERAIS"
            sectionTitleIcon={<LayoutGrid size={15} />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">IDENTIFICADOR</h2>
                <h2 className="text-sm font-bold tracking-tight">
                  #{transportControl.identificador}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">TÍTULO</h2>
                <h2 className="text-sm font-bold tracking-tight">{transportControl.titulo}</h2>
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">AUTOR</h2>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={transportControl.autor?.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {formatNameAsInitials(transportControl.autor?.nome)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-sm font-bold tracking-tight">{transportControl.autor?.nome}</h2>
              </div>
            </div>
          </ResponsiveDialogDrawerSection>

          <ResponsiveDialogDrawerSection
            sectionTitleText="QUILOMETRAGEM"
            sectionTitleIcon={<MapPin size={15} />}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">KM INICIAL</h2>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold tracking-tight">
                    {transportControl.distanciaQuilometragemInicial
                      ? `${formatDecimalPlaces(transportControl.distanciaQuilometragemInicial)} km`
                      : "NÃO DEFINIDA"}
                  </h2>
                  {transportControl.distanciaQuilometragemInicialImagemUrl ? (
                    <Button
                      variant="ghost"
                      size="fit"
                      className="rounded-full p-2"
                      onClick={() =>
                        window.open(
                          transportControl.distanciaQuilometragemInicialImagemUrl as string,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink size={15} />
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">KM FINAL</h2>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold tracking-tight">
                    {transportControl.distanciaQuilometragemFinal
                      ? `${formatDecimalPlaces(transportControl.distanciaQuilometragemFinal)} km`
                      : "NÃO DEFINIDA"}
                  </h2>
                  {transportControl.distanciaQuilometragemFinalImagemUrl ? (
                    <Button
                      variant="ghost"
                      size="fit"
                      className="rounded-full p-2"
                      onClick={() =>
                        window.open(
                          transportControl.distanciaQuilometragemFinalImagemUrl as string,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink size={15} />
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-medium tracking-tight">DISTÂNCIA PERCORRIDA</h2>
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold tracking-tight">
                    {formatDecimalPlaces(
                      (transportControl.distanciaQuilometragemFinal ?? 0) -
                        (transportControl.distanciaQuilometragemInicial ?? 0),
                    )}{" "}
                    km
                  </h2>
                </div>
              </div>
            </div>
          </ResponsiveDialogDrawerSection>

          <ResponsiveDialogDrawerSection
            sectionTitleText="ENTREGAS/ITENS"
            sectionTitleIcon={<Package size={15} />}
          >
            <div className="flex flex-col gap-2">
              {transportControl.itens.length > 0 ? (
                transportControl.itens.map((item, index) => (
                  <div
                    key={index.toString()}
                    className="w-full flex flex-col gap-1.5 p-3 rounded-lg border border-border shadow-sm"
                  >
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.6rem] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-tighter">
                          ITEM {item.ordem}
                        </span>
                        <h3 className="text-xs font-bold">{item.titulo}</h3>
                      </div>

                      {item.dataEfetivacao && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-200 text-green-600 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 min-w-4 min-h-4" />
                          <p className="text-xs font-medium tracking-tight">
                            {formatDateAsLocale(item.dataEfetivacao)}
                          </p>
                        </div>
                      )}
                    </div>

                    {item.anexos.length > 0 && (
                      <div className="w-full flex items-center gap-2 flex-wrap">
                        <h2 className="text-xs font-medium tracking-tight">ANEXOS</h2>
                        {item.anexos.map((anexo, aIdx) => (
                          <a
                            key={aIdx.toString()}
                            href={anexo.url}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-200 text-blue-600 rounded-lg"
                          >
                            <FileIcon className="w-4 h-4 min-w-4 min-h-4" />
                            <p className="text-xs font-medium tracking-tight">{anexo.titulo}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-xs text-muted-foreground italic">
                    Nenhum item vinculado a este transporte.
                  </p>
                </div>
              )}
            </div>
          </ResponsiveDialogDrawerSection>

          <ResponsiveDialogDrawerSection
            sectionTitleText="CUSTOS"
            sectionTitleIcon={<DollarSign size={15} />}
          >
            {transportControl.custos.length > 0 ? (
              <>
                {transportControl.custos.map((custo, index) => (
                  <div
                    key={index.toString()}
                    className="w-full flex flex-col gap-1.5 p-3 rounded-lg border border-border shadow-sm"
                  >
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold">{custo.descricao}</h3>
                      </div>

                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-lg">
                        <DollarSign className="w-4 h-4 min-w-4 min-h-4" />
                        <p className="text-xs font-medium tracking-tight">
                          {formatToMoney(custo.valor)}
                        </p>
                      </div>
                    </div>

                    {custo.anexos.length > 0 && (
                      <div className="w-full flex items-center gap-2 flex-wrap">
                        <h2 className="text-xs font-medium tracking-tight">ANEXOS</h2>
                        {custo.anexos.map((anexo, aIdx) => (
                          <a
                            key={aIdx.toString()}
                            href={anexo.url}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-200 text-blue-600 rounded-lg"
                          >
                            <FileIcon className="w-4 h-4 min-w-4 min-h-4" />
                            <p className="text-xs font-medium tracking-tight">{anexo.titulo}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center flex-col gap-1 text-primary self-center">
                  <p className="text-xs font-bold tracking-tight">
                    TOTAL DE: {formatToMoney(totalCosts)}
                  </p>
                  <p className="text-xs font-bold tracking-tight">
                    {formatToMoney(totalCosts / transportControl.itens.length)} POR TRANSPORTE
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 min-w-4 min-h-4" />
                <p className="text-xs text-muted-foreground italic">
                  Nenhum custo vinculado a este transporte.
                </p>
              </div>
            )}
          </ResponsiveDialogDrawerSection>

          <div className="flex flex-col gap-3 pt-2">
            <LoadingButton
              className="flex items-center gap-2 hover:bg-green-600 hover:text-white transition-colors"
              loading={validateIsPending}
              disabled={!canValidate}
              onClick={() => handleValidate()}
            >
              <CheckCircle2 className="w-4 h-4 min-w-4 min-h-4" />
              VALIDAR CONTROLE
            </LoadingButton>
          </div>
        </>
      ) : null}
    </ResponsiveDialogDrawerViewOnly>
  );
}
