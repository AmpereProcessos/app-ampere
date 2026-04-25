import DateInput from "@/components/inputs/Date";
import SelectInput from "@/components/inputs/Select";
import SelectInputVirtualized from "@/components/inputs/SelectVirtualized";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import {
	EngineeringCallTypes,
	EngineeringCallsStatus,
	SlideMotionVariants,
	formatDate,
	getFileTypeTitle,
	getTitleFileType,
	isFileImage,
} from "@/utils/constants";
import { uploadFile } from "@/utils/methods/firebase";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createManyFileReferences } from "@/utils/methods/mutation/crm/file-references";
import { useFileReferences } from "@/utils/methods/query/crm/file-references";
import { useUsers } from "@/utils/methods/query/users";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { TEngineeringCall } from "@/utils/schemas/engineering-calls";
import type { TAttachmentHolder } from "@/utils/schemas/useful";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, CloudUpload, Code, LayoutGrid, LinkIcon, Loader, Paperclip, Plus, Tag, UsersRound, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BsCalendarCheck } from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import FileReferenceCard from "../../referencias-arquivos/FileReferenceCard";

type GeneralProps = {
	infoHolder: TEngineeringCall;
	updateInfoHolder: (info: Partial<TEngineeringCall>) => void;
};
export function General({ infoHolder, updateInfoHolder }: GeneralProps) {
	const { data: users } = useUsers();

	function handleEffectivationUpdate(newValue: TEngineeringCall["status"], previousData: TEngineeringCall) {
		if (newValue === "FINALIZADO") {
			if (previousData.status !== "FINALIZADO") {
				return new Date().toISOString();
			}
			return previousData.fechamento;
		}
		if (previousData.status === "FINALIZADO") {
			return undefined;
		}
		return previousData.fechamento;
	}

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
				<LayoutGrid size={15} />
				<h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES GERAIS</h1>
			</div>
			<div className="flex w-full flex-wrap items-center gap-2">
				{EngineeringCallsStatus.map((status) => (
					<button
						type="button"
						key={status.id}
						onClick={() => updateInfoHolder({ status: status.value, fechamento: handleEffectivationUpdate(status.value, infoHolder) })}
						className={cn("flex items-center gap-1 rounded-md px-3 py-1.5 text-sm", status.color, {
							"opacity-100": infoHolder.status === status.value,
							"opacity-50": infoHolder.status !== status.value,
						})}
					>
						{status.icon}
						{status.label}
					</button>
				))}
			</div>

			{infoHolder.fechamento ? (
				<div className={"flex w-fit items-center gap-1 self-center rounded-md bg-green-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-green-700"}>
					<BsCalendarCheck className="h-3 min-h-3 w-3 min-w-3" />
					{formatDateAsLocale(infoHolder.fechamento, true)}
				</div>
			) : null}
			<SelectInput
				label="RESPONSÁVEL"
				value={infoHolder.responsavel}
				handleChange={(value) => {
					const selectedUser = users?.find((user) => user._id === value);
					if (selectedUser) {
						updateInfoHolder({
							responsavel: selectedUser._id,
							responsavelUsuario: {
								id: selectedUser._id,
								nome: selectedUser.nome,
								avatar_url: selectedUser.avatar_url,
							},
						});
					} else {
						updateInfoHolder({ responsavel: undefined, responsavelUsuario: undefined });
					}
				}}
				selectedItemLabel="NÃO DEFINIDO"
				onReset={() => updateInfoHolder({ responsavel: undefined })}
				options={
					users?.map((user) => ({
						id: user._id,
						label: user.nome,
						value: user._id,
						startContent: (
							<Avatar className="h-5 w-5 min-h-5 min-w-5">
								<AvatarImage src={user.avatar_url ?? undefined} />
								<AvatarFallback className="text-xs">{formatNameAsInitials(user.nome)}</AvatarFallback>
							</Avatar>
						),
					})) || []
				}
				width="100%"
			/>
			<SelectInput
				label="TIPO DO CHAMADO"
				options={EngineeringCallTypes.map((tipo, index) => ({
					id: index + 1,
					label: tipo,
					value: tipo,
				}))}
				value={infoHolder.tipoDoChamado}
				handleChange={(value) => updateInfoHolder({ tipoDoChamado: value })}
				selectedItemLabel="NÃO DEFINIDO"
				onReset={() => updateInfoHolder({ tipoDoChamado: undefined })}
				width="100%"
			/>
			<TextInput
				label="PROJETO"
				value={infoHolder.projeto ?? ""}
				placeholder="Nome do projeto..."
				handleChange={(value) => updateInfoHolder({ projeto: value })}
				width="100%"
			/>
			<TextareaInput
				label="OBSERVAÇÕES"
				value={infoHolder.observacoes ?? ""}
				placeholder="Preencha aqui as observações..."
				handleChange={(value) => updateInfoHolder({ observacoes: value })}
			/>
			<TextareaInput
				label="ANOTAÇÕES"
				value={infoHolder.anotacoes ?? ""}
				placeholder="Preencha aqui as anotações..."
				handleChange={(value) => updateInfoHolder({ anotacoes: value })}
			/>
		</div>
	);
}

export type TEngineeringCallAttachmentHolderItem = {
	title: string;
	projectId?: string;
	callId?: string;
	attachments: TAttachmentHolder[];
};
type TAttachmensProps = {
	session: TAuthSession;
	callId?: string;
	projectId?: string;
	attachments: TEngineeringCallAttachmentHolderItem[];
	initializeNewAttachmentItem: () => void;
	updateAttachmentItem: (index: number, item: Partial<TEngineeringCallAttachmentHolderItem>) => void;
	clearAttachmentItems: () => void;
};
export function Attachments({
	session,
	callId,
	projectId,
	attachments,
	initializeNewAttachmentItem,
	updateAttachmentItem,
	clearAttachmentItems,
}: TAttachmensProps) {
	const queryClient = useQueryClient();
	const [newAttachmentMenuIsOpen, setNewAttachmentMenuIsOpen] = useState(false);
	const [showProjectFiles, setShowProjectFiles] = useState<boolean>(false);
	const {
		data: fileReferences,
		isLoading,
		isError,
		isSuccess,
		error,
		queryKey,
	} = useFileReferences({ callId, projectId: showProjectFiles ? projectId : undefined });

	async function handleAttachments({ attachments }: { attachments: TEngineeringCallAttachmentHolderItem[] }) {
		const uploads = attachments.flatMap((item) =>
			item.attachments.map((a, aIdx, aArr) => ({
				title: aArr.length > 0 ? `${item.title} (${aIdx + 1})` : item.title,
				callId: item.callId,
				projectId: item.projectId,
				file: a.file,
			})),
		);
		const uploadPromises = uploads.map(async (uploadItem) => {
			const {
				url,
				format: formato,
				size: tamanho,
			} = await uploadFile({ file: uploadItem.file as File, fileName: uploadItem.title, vinculationId: undefined, prefix: "chamado-suporte" });

			const fileReference: TFileReference = {
				titulo: uploadItem.title,
				formato: formato,
				url: url,
				autor: {
					id: session.user.id,
					nome: session.user.nome,
					avatar_url: session.user.avatar_url,
				},
				idProjeto: uploadItem.projectId,
				idChamado: uploadItem.callId,
				dataInsercao: new Date().toISOString(),
			};
			return fileReference;
		});
		const fileReferences = await Promise.all(uploadPromises);
		return await createManyFileReferences({ info: fileReferences });
	}

	const { mutate: handleAttachmentsMutation, isPending: handleAttachmentsMutationIsPending } = useMutation({
		mutationKey: ["create-support-call-many-file-references"],
		mutationFn: handleAttachments,
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queryKey });
		},
		onSuccess: () => {
			clearAttachmentItems();
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKey });
		},
	});
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
				<Paperclip size={15} />
				<h1 className="w-fit text-start text-xs font-medium tracking-tight">ANEXOS</h1>
			</div>
			<div className="flex w-full items-center justify-end">
				<button
					type="button"
					onClick={() => setNewAttachmentMenuIsOpen((prev) => !prev)}
					className={cn("flex items-center gap-1 rounded-lg px-2 py-1 duration-300 ease-in-out", {
						"bg-primary/20 text-primary hover:bg-red-300": newAttachmentMenuIsOpen,
						"text-primary-foreground bg-green-300 hover:bg-green-400": !newAttachmentMenuIsOpen,
					})}
				>
					<Paperclip className="h-3 min-h-3 w-3 min-w-3" />
					<h1 className="text-xs font-medium tracking-tight">{!newAttachmentMenuIsOpen ? "ABRIR MENU DE NOVOS ANEXOS" : "FECHAR MENU DE NOVOS ANEXOS"}</h1>
				</button>
			</div>
			{newAttachmentMenuIsOpen ? (
				<motion.div
					variants={SlideMotionVariants}
					initial="hidden"
					animate="visible"
					exit="hidden"
					className="bg-card border-primary/20 flex w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs"
				>
					<h2 className="text-start text-sm font-medium tracking-tight">NOVOS ANEXOS</h2>
					{attachments.map((attachment, index) => (
						<div key={index} className="flex w-full flex-col gap-1">
							<TextInput
								label="TÍTULO"
								labelClassName="text-[0.6rem]"
								holderClassName="text-xs p-2 min-h-[34px]"
								value={attachment.title}
								placeholder="Preencha aqui o título do anexo..."
								handleChange={(value) => updateAttachmentItem(index, { title: value })}
								width="100%"
							/>
							<div className="relative flex w-full items-center justify-center">
								<label
									htmlFor="dropzone-file"
									className="dark:hover:bg-bray-800 border-primary/20 hover:bg-primary/10 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#fff] px-3 py-1 dark:bg-[#121212]"
								>
									<div className="text-primary flex flex-col items-center justify-center px-6 pt-5 pb-6">
										<CloudUpload className="h-6 min-h-6 w-6 min-w-6" />
										<p className="text-center text-xs font-medium tracking-tight">Clique aqui para selecionar os arquivos ou arraste-os para área demarcada.</p>
									</div>
									<input
										onChange={(e) => {
											if (e.target.files) {
												console.log(e.target.files);
												const files = Array.from(e.target.files);
												const attachments: TEngineeringCallAttachmentHolderItem["attachments"] = files.map((file) => ({
													file: file,
													previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
													type: file.type,
													title: file.name,
												}));
												console.log(attachments);
												updateAttachmentItem(index, { attachments: [...attachment.attachments, ...attachments] });
											}
											return;
										}}
										id="dropzone-file"
										type="file"
										multiple={true}
										className="absolute h-full w-full opacity-0"
									/>
								</label>
							</div>
							<div className="flex w-full flex-wrap items-center gap-2">
								{attachment.attachments.length > 0 ? (
									attachment.attachments.map((file, index) => (
										<div key={`${file.file?.name}-${index}`} className="border-primary/50 flex h-[100px] w-[100px] flex-col rounded border">
											<div className="relative flex h-[100px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
												{file.previewUrl ? (
													<Image src={file.previewUrl} alt={file.file?.name || ""} fill={true} />
												) : (
													<h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(file.type || "")}</h1>
												)}
											</div>
										</div>
									))
								) : (
									<p className="text-primary/80 text-xs font-light">Nenhum arquivo encontrado.</p>
								)}
							</div>
						</div>
					))}
					<div className="flex w-full items-center justify-end gap-2">
						<Button variant="ghost" size="fit" className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-xs" onClick={initializeNewAttachmentItem}>
							<Plus className="h-3 min-h-3 w-3 min-w-3" />
							NOVO ANEXO
						</Button>
						{callId ? (
							<LoadingButton
								loading={handleAttachmentsMutationIsPending}
								onClick={() => handleAttachmentsMutation({ attachments: attachments })}
								className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-xs"
							>
								CRIAR ANEXOS
							</LoadingButton>
						) : null}
					</div>
				</motion.div>
			) : null}
			<div className="flex w-full items-center justify-end">
				{projectId ? (
					<button
						onClick={() => setShowProjectFiles((prev) => !prev)}
						className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
							"bg-cyan-400 hover:bg-gray-400": showProjectFiles,
							"bg-primary/20 hover:bg-cyan-300": !showProjectFiles,
						})}
					>
						<MdDashboard className="h-3 min-h-3 w-3 min-w-3" />
						<h1 className="text-xs font-medium tracking-tight">MOSTRAR ANEXOS DO PROJETO</h1>
					</button>
				) : null}
			</div>
			{isLoading ? <p className="animate-pulse text-center text-sm font-medium tracking-tight">Carregando arquivos...</p> : null}
			{isError ? <p className="text-center text-sm font-medium tracking-tight text-red-500">{getErrorMessage(error)}</p> : null}
			{isSuccess ? (
				<div className="flex w-full flex-col gap-2">
					{fileReferences.length > 0 ? (
						<div className="flex w-full flex-col gap-2">
							{fileReferences.map((fileReference) => (
								<FileReferenceCard key={fileReference._id} info={fileReference} />
							))}
						</div>
					) : (
						<p className="text-center text-sm font-medium tracking-tight">Nenhum arquivo encontrado</p>
					)}
				</div>
			) : null}
		</div>
	);
}
