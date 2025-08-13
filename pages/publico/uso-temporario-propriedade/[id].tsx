import ErrorPage from "@/components/utils/ErrorPage";
import LoadingPage from "@/components/utils/LoadingPage";
import type { TGetTemporaryUsageByPropertyOutput } from "@/pages/api/propriedades/uso-temporario/propriedade";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useOpenPropertyTemporaryUsageByPropertyId } from "@/utils/methods/query/properties";
import type { TPropertyTemporaryUsage } from "@/utils/schemas/properties";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useCallback, useMemo } from "react";
import Logo from "../../../utils/images/logo-sem-texto.png";
import { useEmployeeBySearch, useEmployees, useUsers } from "@/utils/methods/query/users";
import TextInput from "@/components/inputs/Text";
import { formatNameAsInitials, formatToCPForCNPJ } from "@/utils/methods/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, BadgeCheck, Boxes, Car, Check, CloudUpload, Code, FileStack, IdCard, Lock, Mail, Paperclip, Phone, Plus, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { getFileTypeTitle, isFileImage, SlideMotionVariants } from "@/utils/constants";
import NumberInput from "@/components/inputs/Number";
import { DOCUMENTS_BY_USAGE_TYPE, getVehicleReviewAlertLevelByKmDifference, PropertyTemporaryUsageMetadataTypeByPropertyType } from "@/lib/property-usage";
import { renderIconWithClassNames } from "@/utils/methods/rendering";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMutation } from "@tanstack/react-query";
import { handleMultipleAttachmentsUpdate, type TAttachmentState } from "@/utils/methods/uploading";
import { createPropertyUsage, updatePropertyUsage } from "@/utils/methods/mutation/properties";
import toast from "react-hot-toast";
import { usePropertyUsageStore, PropertyUsageProvider } from "@/utils/stores/property-usage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TextareaInput from "@/components/inputs/TextareaInput";
import CheckboxInput from "@/components/inputs/Checkbox";

function PublicPropertyTemporaryUsagePage() {
	const router = useRouter();
	const { id } = router.query;
	if (!id || typeof id !== "string") return <ErrorPage msg="ID da propriedade não informado." />;

	return <PublicPropertyTemporaryUsagePageContent id={id as string} />;
}

export default PublicPropertyTemporaryUsagePage;

type PublicPropertyTemporaryUsagePageContentProps = {
	id: string;
};
function PublicPropertyTemporaryUsagePageContent({ id }: PublicPropertyTemporaryUsagePageContentProps) {
	const { data: openUsage, isLoading, isSuccess, isError, error } = useOpenPropertyTemporaryUsageByPropertyId({ id });

	if (isLoading) return <LoadingPage />;
	if (isError) return <ErrorPage msg={getErrorMessage(error)} />;

	if (isSuccess) {
		// Preparar dados iniciais para a store
		const openUsageRegistry = openUsage.openUsage;
		let initialPropertyUsage = {};
		let initialAttachments = DOCUMENTS_BY_USAGE_TYPE["USO DE VEÍCULO"].map((doc) => ({
			titulo: doc.title,
			arquivos: [],
			identificador: doc.identifier,
		}));

		if (openUsageRegistry) {
			// Se existe um registro de uso aberto, inicializa com esses dados
			initialPropertyUsage = {
				propriedade: openUsageRegistry.propriedade,
				metadados: openUsageRegistry.metadados,
				responsaveis: openUsageRegistry.responsaveis,
				autor: openUsageRegistry.autor,
				dataInsercao: openUsageRegistry.dataInsercao,
				dataFim: openUsageRegistry.dataFim,
				arquivos: openUsageRegistry.arquivos,
			};
			initialAttachments = DOCUMENTS_BY_USAGE_TYPE[openUsageRegistry.metadados.tipo].map((doc) => ({
				titulo: doc.title,
				arquivos: [],
				identificador: doc.identifier,
			}));
		} else {
			// Se não existe registro aberto, inicializa apenas com os dados da propriedade
			initialPropertyUsage = {
				propriedade: {
					id: openUsage.property._id,
					nome: openUsage.property.nome,
					identificador: openUsage.property.identificador,
					imagemUrl: openUsage.property.imagemUrl,
				},
			};
		}

		return (
			<PropertyUsageProvider propertyUsage={initialPropertyUsage} attachments={initialAttachments}>
				<PublicPropertyTemporaryUsagePageContentForm openUsage={openUsage} />
			</PropertyUsageProvider>
		);
	}

	return <></>;
}

function PublicPropertyTemporaryUsagePageContentForm({ openUsage }: { openUsage: TGetTemporaryUsageByPropertyOutput["data"] }) {
	const getPropertyUsage = usePropertyUsageStore((state) => state.getPropertyUsage);
	const getAttachments = usePropertyUsageStore((state) => state.getAttachments);
	const propertyImageUrl = usePropertyUsageStore((state) => state.propertyUsage.propriedade.imagemUrl);
	const propertyName = usePropertyUsageStore((state) => state.propertyUsage.propriedade.nome);
	const propertyIdentifier = usePropertyUsageStore((state) => state.propertyUsage.propriedade.identificador);
	const propertyMetadataType = usePropertyUsageStore((state) => state.propertyUsage.metadados.tipo);
	const reset = usePropertyUsageStore((state) => state.reset);
	async function handleUsageMutationMethod({
		propertyUsageId,
		property,
		info,
		attachments,
		type,
	}: {
		type: "start" | "finish";
		propertyUsageId: string | undefined;
		property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
		info: TPropertyTemporaryUsage;
		attachments: TAttachmentState[];
	}) {
		if (!info.autor.id) {
			throw new Error(`Identifique-se para iniciar o uso temporário do(a) ${info.propriedade.nome}.`);
		}
		// If usage is for a vehicle, check if the kmFinal is greater than the kmInitial
		if (propertyMetadataType === "USO DE VEÍCULO") {
			if (!info.metadados.kmInicial) {
				throw new Error("A kilometragem inicial é obrigatória.");
			}
			if (type === "finish") {
				if (!info.metadados.kmFinal) {
					throw new Error("Para a finalização de uso, a kilometragem final é obrigatória.");
				}
			}
			if (info.metadados.kmFinal && info.metadados.kmFinal < info.metadados.kmInicial) {
				throw new Error("A kilometragem final não pode ser menor que a kilometragem inicial.");
			}
		}
		if (property.justificativaUsoTemporarioObrigatorio && (!info.justificativa || info.justificativa.trim().length <= 3)) {
			throw new Error("Preencha uma justificativa válida.");
		}
		// Checkinf for obligatory attachments
		const obligatoryAttachments = DOCUMENTS_BY_USAGE_TYPE[propertyMetadataType].filter((doc) => doc.optional === false);
		const obligatoryAttachmentsNotFilled = obligatoryAttachments.filter(
			(obligatoryAttachment) => !attachments.some((file) => file.identificador === obligatoryAttachment.identifier && file.arquivos.length > 0),
		);
		if (obligatoryAttachmentsNotFilled.length > 0) {
			throw new Error(`A(s) anexação(ões) ${obligatoryAttachmentsNotFilled.map((obligatoryAttachment) => obligatoryAttachment.title).join(", ")} são obrigatórias.`);
		}
		const filesMetadata = await handleMultipleAttachmentsUpdate({ attachments, vinculationId: info.propriedade.id });
		if (propertyUsageId) {
			return await updatePropertyUsage({ id: propertyUsageId, changes: { ...info, arquivos: [...info.arquivos, ...filesMetadata], dataFim: new Date().toISOString() } });
		}
		return await createPropertyUsage({ info: { ...info, arquivos: filesMetadata, dataInicio: new Date().toISOString() } });
	}

	const {
		mutate: handleUsageMutation,
		isPending: isUsageMutationLoading,
		isSuccess: isUsageMutationSuccess,
	} = useMutation({
		mutationKey: ["handle-usage-mutation"],
		mutationFn: handleUsageMutationMethod,
		onSuccess: (data) => {
			toast.success(data.message);
			reset();
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});
	return (
		<div className="flex h-full justify-center px-0 lg:px-6 lg:py-12 py-6 bg-background">
			{isUsageMutationSuccess ? (
				<div className="w-full h-full flex flex-col gap-1 items-center justify-center">
					<div className="flex flex-col gap-1 items-center">
						<BadgeCheck className="w-10 h-10 lg:w-20 lg:h-20 min-w-10 min-h-10 text-green-500" />
						<h1 className="text-lg font-bold text-primary tracking-tight text-center">Formulário finalizado com sucesso !</h1>
					</div>
					<div className="flex items-center gap-2 flex-col lg:flex-row">
						<Button
							variant={"secondary"}
							onClick={() => {
								window.location.reload();
							}}
						>
							REINICIAR
						</Button>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-4 container">
					<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
						<div className="w-full flex items-center justify-center gap-2">
							<Image src={Logo} alt="Logo" width={35} height={35} />
							<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight text-center">UTILIZAÇÃO DE PROPRIEDADE</h1>
						</div>
						<div className="w-full flex items-center justify-center gap-2">
							{propertyImageUrl ? (
								<div className="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 rounded-lg overflow-hidden relative">
									<Image src={propertyImageUrl} alt={`Imagem da propriedade ${propertyName}`} fill={true} />
								</div>
							) : null}
							<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight text-center">{propertyName}</h1>
							<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded-lg w-fit">
								<Code size={15} />
								<h1 className="text-[0.6rem] tracking-tight font-medium text-start w-fit">{propertyIdentifier}</h1>
							</div>
						</div>
					</div>

					<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
						{openUsage.openUsage ? (
							<div className={cn("flex items-center justify-center gap-1 px-2 py-1 rounded w-fit self-center bg-green-200 text-green-800")}>
								<Check size={15} />
								<h1 className="text-xs tracking-tight font-medium text-start w-fit">Você está finalizando o uso temporário da propriedade.</h1>
							</div>
						) : (
							<div className={cn("flex items-center justify-center gap-1 px-2 py-1 rounded w-fit self-center bg-blue-200 text-blue-800")}>
								<Plus size={15} />
								<h1 className="text-xs tracking-tight font-medium text-start w-fit">Você está iniciando o uso temporário da propriedade.</h1>
							</div>
						)}
						<UserSelection />
						{propertyMetadataType === "USO DE VEÍCULO" ? <VehicleMetadata property={openUsage.property} hasOpenUsage={!!openUsage.openUsage} /> : null}
						<Others property={openUsage.property} />
						<div className="w-full flex items-center justify-end">
							<LoadingButton
								loading={isUsageMutationLoading}
								onClick={() => {
									handleUsageMutation({
										type: openUsage.openUsage ? "finish" : "start",
										propertyUsageId: openUsage.openUsage?._id,
										property: openUsage.property,
										info: getPropertyUsage(),
										attachments: getAttachments(),
									});
								}}
							>
								{openUsage.openUsage ? "FINALIZAR USO" : "INICIAR USO"}
							</LoadingButton>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

function UserSelection() {
	const responsibles = usePropertyUsageStore((state) => state.propertyUsage.responsaveis);
	const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage);
	const currentAuthor = usePropertyUsageStore((state) => state.propertyUsage.autor);
	const { data: employee, isLoading, isSuccess, isError, error, isFetched, queryParams, updateQueryParams } = useEmployeeBySearch();

	useEffect(() => {
		console.log("Running useEffect", { employee: employee?.id, currentAuthor: currentAuthor, isValid: currentAuthor.id !== "" });

		if (employee) {
			// Verifica se o employee atual já é o autor para evitar updates desnecessários
			// if (currentAuthor.id !== employee.id) {
			const newAutor = { id: employee.id, nome: employee.nome, avatar_url: employee.avatar_url ?? undefined, cpf: employee.cpf, telefone: employee.telefone };
			const newResponsaveis = Array.from(new Map([...responsibles, { ...newAutor, telefone: employee.telefone }].map((r) => [r.id, r])).values());
			updatePropertyUsage({
				autor: newAutor,
				responsaveis: newResponsaveis,
			});
			// }
		} else {
			// Só limpa se havia um autor anteriormente e a busca foi executada
			if (currentAuthor.id !== "" && isFetched) {
				updatePropertyUsage({
					autor: {
						id: "",
						nome: "",
						cpf: "",
						telefone: "",
					},
					responsaveis: [],
				});
			}
		}
	}, [employee]);
	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<UserRound size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DO RESPONSÁVEL</h1>
			</div>
			<TextInput
				label="CPF"
				placeholder="Preencha o seu CPF..."
				value={currentAuthor.cpf}
				handleChange={(value) => {
					updatePropertyUsage({ autor: { ...currentAuthor, cpf: formatToCPForCNPJ(value) } });
					updateQueryParams({ cpf: formatToCPForCNPJ(value) });
				}}
				width="100%"
			/>
			{currentAuthor.id !== "" ? (
				<motion.div
					key={"user-open"}
					variants={SlideMotionVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					className="w-full lg:w-fit self-center flex flex-col lg:flex-row items-center gap-2 gap-y-1 justify-center px-2 py-2 rounded-lg bg-blue-200"
				>
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 min-h-8 min-w-8">
							<AvatarImage src={currentAuthor.avatar_url ?? undefined} />
							<AvatarFallback>{formatNameAsInitials(currentAuthor.nome)}</AvatarFallback>
						</Avatar>
						<h1 className="text-sm font-medium leading-none tracking-tight text-center">{currentAuthor.nome}</h1>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex min-w-fit items-center gap-1">
							<IdCard className="w-3 h-3 min-w-3 min-h-3" />
							<p className={"text-xs font-medium text-primary/80"}>{currentAuthor.cpf}</p>
						</div>
						<div className="flex min-w-fit items-center gap-1">
							<Phone className="w-3 h-3 min-w-3 min-h-3" />
							<p className={"text-xs font-medium text-primary/80"}>{currentAuthor.telefone}</p>
						</div>
					</div>
				</motion.div>
			) : null}
		</div>
	);
}

type VehicleMetadataProps = {
	property: TGetTemporaryUsageByPropertyOutput["data"]["property"];
	hasOpenUsage: boolean;
};
function VehicleMetadata({ property, hasOpenUsage }: VehicleMetadataProps) {
	const propertyUsageMetadataType = usePropertyUsageStore((state) => state.propertyUsage.metadados.tipo);
	const justificative = usePropertyUsageStore((state) => state.propertyUsage.justificativa);
	const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage);
	const updatePropertyUsageMetadata = usePropertyUsageStore((state) => state.updatePropertyUsageMetadata);
	const attachments = usePropertyUsageStore((state) => state.attachments);
	console.log("attachments", attachments);
	function StartUsageMetadata() {
		const initialKm = usePropertyUsageStore((state) => state.propertyUsage.metadados.kmInicial);
		return (
			<div className="w-full flex flex-col gap-2">
				<NumberInput
					label="KM INICIAL"
					placeholder="Preencha a kilometragem inicial..."
					value={initialKm ?? null}
					handleChange={(value) => updatePropertyUsageMetadata({ kmInicial: value })}
					width="100%"
				/>
			</div>
		);
	}
	function FinishUsageMetadata() {
		const finalKm = usePropertyUsageStore((state) => state.propertyUsage.metadados.kmFinal);
		return (
			<div className="w-full flex flex-col gap-2">
				<NumberInput
					label="KM FINAL"
					placeholder="Preencha a kilometragem final..."
					value={finalKm ?? null}
					handleChange={(value) => updatePropertyUsageMetadata({ kmFinal: value })}
					width="100%"
				/>
			</div>
		);
	}
	const vehicleReviewAlertLevel = getVehicleReviewAlertLevelByKmDifference(property.metadados.kmProximaRevisao - property.metadados.kmAcumulado);
	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Car size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">DETALHES DO USO DO VEÍCULO</h1>
			</div>
			{vehicleReviewAlertLevel ? (
				<div className={cn("flex items-center justify-center gap-1 px-2 py-1 rounded w-full", vehicleReviewAlertLevel.color)}>
					<AlertCircle size={15} />
					<h1 className="text-xs tracking-tight font-medium text-start w-fit">{vehicleReviewAlertLevel.call}</h1>
				</div>
			) : null}
			{hasOpenUsage ? <FinishUsageMetadata /> : <StartUsageMetadata />}

			<div className="w-full flex flex-col gap-2">
				<h1 className="text-sm font-medium tracking-tight text-primary/80">ANEXOS</h1>
				{attachments.length > 0 ? (
					attachments.map((attachment, index) => (
						<PropertyAttachmentCard key={attachment.identificador} index={index} attachment={attachment} propertyUsageMetadataType={propertyUsageMetadataType} />
					))
				) : (
					<p>Nenhum anexo encontrado.</p>
				)}
			</div>
		</div>
	);
}

type PropertyAttachmentCardProps = {
	index: number;
	propertyUsageMetadataType: TPropertyTemporaryUsage["metadados"]["tipo"];
	attachment: TAttachmentState;
};
function PropertyAttachmentCard({ index, propertyUsageMetadataType, attachment }: PropertyAttachmentCardProps) {
	const updateAttachment = usePropertyUsageStore((state) => state.updateAttachment);
	function getFilePredefinition(identifier: string) {
		const predefinition = DOCUMENTS_BY_USAGE_TYPE[propertyUsageMetadataType].find((item) => item.identifier === identifier);
		return predefinition || null;
	}
	const filePredefinition = getFilePredefinition(attachment.identificador);
	return (
		<div className="flex w-full grow flex-col gap-4 p-6 border border-primary/20 rounded-md bg-[#fff] dark:bg-[#121212] shadow-sm">
			<div className="w-full flex flex-col gap-1">
				<div className="w-full flex items-start lg:items-center gap-2 flex-col lg:flex-row">
					<div className="flex items-center gap-2">
						{filePredefinition ? renderIconWithClassNames(filePredefinition.icon) : <Paperclip className="h-4 w-4 min-h-4 min-w-4" />}
						<h1 className="text-sm font-bold leading-none tracking-tight">{attachment.titulo}</h1>
					</div>
					<div className="flex items-center gap-2">
						{filePredefinition ? (
							<>
								{!filePredefinition.optional ? (
									<div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-lg">
										<Lock className="h-3 w-3 min-h-3 min-w-3" />
										<p className="text-[0.6rem] font-bold tracking-tight">OBRIGATÓRIO</p>
									</div>
								) : null}
								{filePredefinition.multiple ? (
									<div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-1 rounded-lg">
										<FileStack className="h-3 w-3 min-h-3 min-w-3" />
										<p className="text-[0.6rem] font-bold tracking-tight">MÚLTIPLO</p>
									</div>
								) : null}
							</>
						) : null}
					</div>
				</div>
				<p className="text-xs font-light leading-none text-primary/80">{filePredefinition?.call || `Anexo do arquivo ${attachment.titulo}.`}</p>
			</div>
			<div className="relative flex w-full items-center justify-center">
				<label
					htmlFor="dropzone-file"
					className="dark:hover:bg-bray-800 flex py-1 px-3 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-[#fff] hover:bg-primary/10 dark:bg-[#121212]"
				>
					<div className="flex flex-col items-center justify-center px-6 pb-6 pt-5 text-primary">
						<CloudUpload className="w-6 h-6 min-w-6 min-h-6" />
						<p className="text-center text-xs font-medium tracking-tight">Clique aqui para selecionar os arquivos ou arraste-os para área demarcada.</p>
					</div>
					<input
						onChange={(e) => {
							if (e.target.files) {
								const files = Array.from(e.target.files);
								const attachments: TAttachmentState["arquivos"] = files.map((file) => ({
									arquivo: file,
									previewUrl: isFileImage(file.type) ? URL.createObjectURL(file) : null,
									tipo: file.type,
								}));
								updateAttachment({ index, changes: { arquivos: [...attachment.arquivos, ...attachments] } });
							}
							return;
						}}
						multiple={filePredefinition?.multiple || false}
						id="dropzone-file"
						type="file"
						className="absolute h-full w-full opacity-0"
						accept={filePredefinition?.acceptedExtensions.join(",") || undefined}
					/>
				</label>
			</div>
			<h3 className="text-[0.6rem] font-medium tracking-tight text-primary/80">ARQUIVOS ANEXADOS</h3>
			<div className="w-full flex items-center flex-wrap gap-2">
				{attachment.arquivos.length > 0 ? (
					attachment.arquivos.map((file, index) => (
						<div key={`${file.arquivo?.name}-${index}`} className="flex h-[100px] w-[100px] flex-col rounded border border-primary/50">
							<div className="relative flex h-[100px] w-full grow items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200">
								{file.previewUrl ? (
									<Image src={file.previewUrl} alt={file.arquivo?.name || ""} fill={true} />
								) : (
									<h1 className="rounded-lg bg-blue-600 px-4 py-1 text-[0.65rem] font-bold text-white">{getFileTypeTitle(file.tipo || "")}</h1>
								)}
							</div>
						</div>
					))
				) : (
					<p className="text-xs font-light text-primary/80">Nenhum arquivo encontrado.</p>
				)}
			</div>
		</div>
	);
}

function Others({ property }: { property: TGetTemporaryUsageByPropertyOutput["data"]["property"] }) {
	const justificative = usePropertyUsageStore((state) => state.propertyUsage.justificativa);
	const propertyUsageNotes = usePropertyUsageStore((state) => state.propertyUsage.anotacoes);
	const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage);
	return (
		<>
			{property.justificativaUsoTemporarioObrigatorio ? (
				<TextareaInput
					label="JUSTIFICATIVA"
					placeholder="Preencha a justificativa para o uso da propriedade..."
					value={justificative ?? ""}
					handleChange={(value) => updatePropertyUsage({ justificativa: value })}
				/>
			) : null}
			<TextareaInput
				label="ANOTAÇÕES"
				placeholder="Preencha aqui qualquer detalhe relevante, como detalhes de uma possível avaria, etc..."
				value={propertyUsageNotes ?? ""}
				handleChange={(value) => updatePropertyUsage({ anotacoes: value })}
			/>
		</>
	);
}
