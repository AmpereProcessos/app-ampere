import DateTimeInput from "@/components/inputs/DateTimeInput";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ResponsiveDialogDrawer from "@/components/utils/ResponsiveDialogDrawer";
import type { TAuthSession } from "@/lib/authentication/types";
import type { TGetTransportControlByIdPublicOutput } from "@/pages/api/controles-transportes";
import { formatLongString, getFileTypeTitle, isFileImage } from "@/utils/constants";
import { uploadFile } from "@/utils/methods/firebase";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createManyFileReferences } from "@/utils/methods/mutation/crm/file-references";
import { updateTransportControl } from "@/utils/methods/mutation/transport-controls";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TAttachmentHolder } from "@/utils/schemas/useful";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCloudUploadFill } from "react-icons/bs";

type DeliveryCompletionModalProps = {
  transportControlId: string;
  transportItem: TGetTransportControlByIdPublicOutput["data"]["itens"][number];
  session: TAuthSession;
  closeMenu: () => void;
  onSuccess?: () => void;
};

export default function DeliveryCompletionModal({
  transportControlId,
  transportItem,
  session,
  closeMenu,
  onSuccess,
}: DeliveryCompletionModalProps) {
  const queryClient = useQueryClient();
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [attachments, setAttachments] = useState<TAttachmentHolder[]>([]);
  const [attachmentTitle, setAttachmentTitle] = useState<string>("");

  const purchaseControlId = transportItem.controleCompra?._id;

  function addAttachments(newAttachments: TAttachmentHolder[]) {
    setAttachments((prev) => [...prev, ...newAttachments]);
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCompleteDelivery() {
    if (!deliveryDate) {
      toast.error("Preencha a data e hora da entrega.");
      return;
    }

    try {
      // Upload files if any
      const fileReferencesToCreate: TFileReference[] = [];
      if (attachments.length > 0 && attachmentTitle) {
        const uploadPromises = attachments
          .filter((a) => !!a.file)
          .map(async (attachment, index) => {
            const fileName =
              attachments.filter((a) => !!a.file).length > 1
                ? `${attachmentTitle} (${index + 1})`
                : attachmentTitle;
            const prefix = `transportes/${transportControlId}/entregas/${transportItem.id}`;
            const {
              url,
              format: formato,
              size: tamanho,
            } = await uploadFile({
              file: attachment.file as File,
              fileName,
              vinculationId: transportControlId,
              prefix,
            });

            fileReferencesToCreate.push({
              titulo: attachmentTitle,
              categorias: [],
              formato: formato,
              url: url,
              tamanho: tamanho,
              idParceiro: session.user.id,
              idCompra: purchaseControlId || null,
              idCliente: null,
              idOportunidade: null,
              idAnaliseTecnica: null,
              idHomologacao: null,
              idProjeto: transportItem.controleCompra?.projeto.id || null,
              idReceita: null,
              autor: {
                id: session.user.id,
                nome: session.user.nome,
                avatar_url: session.user.avatar_url,
              },
              dataInsercao: new Date().toISOString(),
            });
          });

        await Promise.all(uploadPromises);
        await createManyFileReferences({ info: fileReferencesToCreate });
      }

      // Fetch current transport control to update the specific item
      const { data: currentData } = await axios.get<TGetTransportControlByIdPublicOutput>(
        `/api/controles-transportes?id=${transportControlId}`,
      );
      const currentTransportControl = currentData.data;

      // Update the specific item in the itens array
      const updatedItems = currentTransportControl.itens.map((item: typeof transportItem) => {
        if (item.id === transportItem.id) {
          return {
            ...item,
            dataEfetivacao: deliveryDate,
            anexos: [
              ...(item.anexos || []),
              ...fileReferencesToCreate.map((fr: TFileReference) => ({
                idArquivoReferencia: "", // Will be set by backend
                identificador: null,
                url: fr.url,
              })),
            ],
          };
        }
        return item;
      });

      // Update the entire transport control with the modified items array
      await updateTransportControl({
        transportControlId,
        changes: {
          itens: updatedItems,
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["transport-control-by-id-public", transportControlId],
      });
      toast.success("Entrega concluída com sucesso!");
      if (onSuccess) onSuccess();
      closeMenu();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const { mutate: handleComplete, isPending } = useMutation({
    mutationKey: ["complete-delivery", transportControlId, transportItem.id],
    mutationFn: handleCompleteDelivery,
  });

  return (
    <ResponsiveDialogDrawer
      menuTitle="CONCLUIR ENTREGA"
      menuDescription="Preencha a data e hora da entrega e anexe arquivos se necessário."
      menuActionButtonText="CONCLUIR ENTREGA"
      menuCancelButtonText="CANCELAR"
      stateIsLoading={false}
      actionFunction={() => handleComplete()}
      actionIsPending={isPending}
      closeMenu={closeMenu}
    >
      <DateTimeInput
        label="DATA E HORA DA ENTREGA"
        value={deliveryDate}
        handleChange={(value) => setDeliveryDate(value || "")}
        width="100%"
      />

      <div className="flex w-full flex-col gap-2">
        <TextInput
          label="TÍTULO DOS ANEXOS (opcional)"
          placeholder="Digite o título para os anexos..."
          value={attachmentTitle}
          handleChange={(value) => setAttachmentTitle(value)}
          width="100%"
        />

        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <label
            htmlFor="delivery-attachment-file"
            className="border-border bg-background hover:bg-primary/10 flex h-full min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
          >
            <div className="text-primary flex flex-col items-center justify-center px-2 pt-5 pb-6">
              <BsCloudUploadFill color={"rgb(31,41,55)"} size={40} />
              <p className="text-center text-xs">
                Clique para escolher arquivos ou arraste para a área
              </p>
            </div>
            <input
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  const newAttachments = files.map((file) => ({
                    title: attachmentTitle || file.name,
                    file: file,
                    previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
                    type: file.type,
                  }));
                  addAttachments(newAttachments);
                }
              }}
              multiple={true}
              id="delivery-attachment-file"
              type="file"
              className="absolute h-full w-full opacity-0"
            />
          </label>
        </div>

        {attachments.length > 0 && (
          <div className="flex w-full flex-wrap gap-4">
            {attachments
              .filter((a) => !!a.file)
              .map((attachment, index) => (
                <div
                  key={`${attachment.file?.name}-${index}`}
                  className="border-primary/50 relative flex h-[100px] max-h-[100px] w-[80px] flex-col rounded border"
                >
                  <div className="relative flex h-[80px] w-full grow items-center justify-center bg-linear-to-b from-sky-400 to-sky-200">
                    {attachment.previewUrl ? (
                      <Image
                        src={attachment.previewUrl}
                        alt={attachment.file?.name || ""}
                        fill={true}
                      />
                    ) : (
                      <h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">
                        {getFileTypeTitle(attachment.type || "")}
                      </h1>
                    )}
                  </div>
                  <div className="bg-primary text-primary-foreground h-[20px] rounded rounded-tl-none rounded-tr-none p-1 text-center text-[0.45rem] font-bold">
                    {formatLongString(attachment.file?.name || "", 12)}
                  </div>
                  <Button
                    onClick={() => removeAttachment(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>
    </ResponsiveDialogDrawer>
  );
}
