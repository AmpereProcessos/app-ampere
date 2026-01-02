import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
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
import { DollarSign, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCloudUploadFill } from "react-icons/bs";

type CostsSectionProps = {
	transportControlId: string;
	costs: TGetTransportControlByIdPublicOutput["data"]["custos"];
	session: TAuthSession;
};

export default function CostsSection({ transportControlId, costs, session }: CostsSectionProps) {
	const [newCostMenuIsOpen, setNewCostMenuIsOpen] = useState(false);
	const queryClient = useQueryClient();

	return (
		<div className="flex w-full flex-col gap-4 rounded-lg border border-primary/20 bg-card p-6 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<DollarSign className="h-5 w-5 text-primary" />
					<h2 className="text-xl font-semibold">Custos</h2>
				</div>
				<Button onClick={() => setNewCostMenuIsOpen(true)} variant="ghost" size="sm" className="flex items-center gap-1">
					<PlusIcon className="w-4 h-4" />
					ADICIONAR CUSTO
				</Button>
			</div>

			{costs.length > 0 ? (
				<div className="space-y-2">
					{costs.map((cost, index) => (
						<div key={index.toString()} className="rounded-lg border border-primary/20 bg-muted/50 p-4">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="font-semibold">{cost.descricao}</p>
									<p className="text-sm text-muted-foreground">R$ {cost.valor.toFixed(2)}</p>
									{cost.anexos && cost.anexos.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{cost.anexos.length} anexo(s)</p>}
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">Nenhum custo adicionado ainda.</p>
			)}

			{newCostMenuIsOpen && (
				<NewCostMenu
					transportControlId={transportControlId}
					session={session}
					closeMenu={() => setNewCostMenuIsOpen(false)}
					onSuccess={() => {
						setNewCostMenuIsOpen(false);
						queryClient.invalidateQueries({ queryKey: ["transport-control-by-id-public", transportControlId] });
					}}
				/>
			)}
		</div>
	);
}

type NewCostMenuProps = {
	transportControlId: string;
	session: TAuthSession;
	closeMenu: () => void;
	onSuccess?: () => void;
};

function NewCostMenu({ transportControlId, session, closeMenu, onSuccess }: NewCostMenuProps) {
	const [costHolder, setCostHolder] = useState({
		descricao: "",
		valor: 0,
		anexos: [] as Array<{ idArquivoReferencia: string; url: string }>,
	});
	const [attachments, setAttachments] = useState<TAttachmentHolder[]>([]);
	const [attachmentTitle, setAttachmentTitle] = useState<string>("");

	function addAttachments(newAttachments: TAttachmentHolder[]) {
		setAttachments((prev) => [...prev, ...newAttachments]);
	}

	function removeAttachment(index: number) {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	}

	async function handleAddCost() {
		if (!costHolder.descricao) {
			toast.error("Preencha uma descrição para o custo.");
			return;
		}
		if (!costHolder.valor || costHolder.valor <= 0) {
			toast.error("Preencha um valor válido para o custo.");
			return;
		}

		try {
			// Upload files if any
			const fileReferencesToCreate: TFileReference[] = [];
			if (attachments.length > 0 && attachmentTitle) {
				const uploadPromises = attachments
					.filter((a) => !!a.file)
					.map(async (attachment, index) => {
						const fileName = attachments.filter((a) => !!a.file).length > 1 ? `${attachmentTitle} (${index + 1})` : attachmentTitle;
						const prefix = `transportes/${transportControlId}/custos`;
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
							idCompra: null,
							idCliente: null,
							idOportunidade: null,
							idAnaliseTecnica: null,
							idHomologacao: null,
							idProjeto: null,
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

			// Fetch current transport control to add the new cost
			const { data: currentData } = await axios.get<TGetTransportControlByIdPublicOutput>(`/api/controles-transportes?id=${transportControlId}`);
			const currentTransportControl = currentData.data;

			// Add the new cost to the costs array
			const updatedCosts = [
				...currentTransportControl.custos,
				{
					descricao: costHolder.descricao,
					valor: costHolder.valor,
					anexos: fileReferencesToCreate.map((fr: TFileReference) => ({
						idArquivoReferencia: "", // Will be set by backend
						url: fr.url,
					})),
				},
			];

			// Update the transport control
			await updateTransportControl({
				transportControlId,
				changes: {
					custos: updatedCosts,
				},
			});

			toast.success("Custo adicionado com sucesso!");
			if (onSuccess) onSuccess();
			closeMenu();
		} catch (error) {
			toast.error(getErrorMessage(error));
		}
	}

	const { mutate: handleAdd, isPending } = useMutation({
		mutationKey: ["add-cost", transportControlId],
		mutationFn: handleAddCost,
	});

	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVO CUSTO"
			menuDescription="Adicione um novo custo ao controle de transporte."
			menuActionButtonText="ADICIONAR CUSTO"
			menuCancelButtonText="CANCELAR"
			stateIsLoading={false}
			actionFunction={() => handleAdd()}
			actionIsPending={isPending}
			closeMenu={closeMenu}
		>
			<TextInput
				label="DESCRIÇÃO"
				placeholder="Preencha a descrição do custo..."
				value={costHolder.descricao}
				handleChange={(value) => setCostHolder((prev) => ({ ...prev, descricao: value }))}
				width="100%"
			/>
			<NumberInput
				label="VALOR"
				placeholder="Preencha o valor do custo..."
				value={costHolder.valor}
				handleChange={(value) => setCostHolder((prev) => ({ ...prev, valor: value }))}
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
						htmlFor="cost-attachment-file"
						className="border-primary/20 bg-background hover:bg-primary/10 flex h-full min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
					>
						<div className="text-primary flex flex-col items-center justify-center px-2 pt-5 pb-6">
							<BsCloudUploadFill color={"rgb(31,41,55)"} size={40} />
							<p className="text-center text-xs">Clique para escolher arquivos ou arraste para a área</p>
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
							id="cost-attachment-file"
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
											<Image src={attachment.previewUrl} alt={attachment.file?.name || ""} fill={true} />
										) : (
											<h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(attachment.type || "")}</h1>
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
