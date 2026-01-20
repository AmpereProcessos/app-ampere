import type { TAuthSession } from "@/lib/authentication/types";
import type { TProperty } from "@/utils/schemas/properties";
import React, { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createProperty, updateProperty } from "@/utils/methods/mutation/properties";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";

import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { copyToClipboard } from "@/lib/utils";
import { uploadFile } from "@/utils/methods/firebase";
import { formatAsSlug, formatWithoutDiacritics } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { usePropertyById } from "@/utils/methods/query/properties";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import { LinkIcon } from "lucide-react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import VehicleProperties from "./VehicleProperties";
import GeneralInfo from "./blocos/Generalnfo";

type EditPropertyProps = {
	propertyId: string;
	session: TAuthSession;
	closeModal: () => void;
};
function EditProperty({ propertyId, session, closeModal }: EditPropertyProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TProperty>({
		ativo: true,
		nome: "",
		identificador: "",
		metadados: {
			tipo: "VEÍCULO",
			kmInicial: 0,
			kmAcumulado: 0,
			kmIntervaloRevisao: 0,
			kmProximaRevisao: 0,
			revisoes: [],
		},
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});
	const [imageHolder, setImageHolder] = useState<TSimpleAttachment>({ file: null, previewUrl: null });
	function updateInfoHolder(info: Partial<TProperty>) {
		setInfoHolder((prev) => ({
			...prev,
			...info,
		}));
	}
	const { data: property, isLoading, isError, isSuccess, error } = usePropertyById({ id: propertyId });

	async function handleUpdateProperty({ id, changes, file }: { id: string; changes: TProperty; file: TSimpleAttachment["file"] }) {
		let imageUrl = changes.imagemUrl;
		if (file) {
			const { url } = await uploadFile({
				vinculationId: changes.nome,
				fileName: `${formatAsSlug(changes.nome)}-imagem-principal`,
				file: file,
				prefix: "propriedades",
			});
			imageUrl = url;
		}
		return await updateProperty({ id, changes: { ...changes, imagemUrl: imageUrl } });
	}
	const { mutate: handleUpdatePropertyMutation, isPending: updateLoading } = useMutationWithFeedback({
		mutationKey: ["update-property", propertyId],
		mutationFn: handleUpdateProperty,
		queryClient: queryClient,
		affectedQueryKey: ["properties"],
	});
	useEffect(() => {
		if (property) setInfoHolder(property);
	}, [property]);

	const MENU_TITLE = "EDITAR PROPRIEDADE";
	const MENU_DESCRIPTION = "Preencha os campos abaixo para editar a propriedade.";
	const BUTTON_TEXT = "ATUALIZAR";
	return isDesktop ? (
		<Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DialogContent className="dark:bg-background flex h-fit max-h-[80vh] min-h-[60vh] flex-col">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<PropertyContent
								isDesktop={isDesktop}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
								propertyId={propertyId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
								mutateUpdateProperty={(changes) =>
									handleUpdatePropertyMutation({ id: propertyId, changes: { ...infoHolder, ...changes }, file: imageHolder.file })
								}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton
								onClick={() => handleUpdatePropertyMutation({ id: propertyId, changes: infoHolder, file: imageHolder.file })}
								loading={updateLoading}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="flex h-fit max-h-[70vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto">
							<PropertyContent
								isDesktop={isDesktop}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
								propertyId={propertyId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
								mutateUpdateProperty={(changes) =>
									handleUpdatePropertyMutation({ id: propertyId, changes: { ...infoHolder, ...changes }, file: imageHolder.file })
								}
							/>
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton
								onClick={() => handleUpdatePropertyMutation({ id: propertyId, changes: infoHolder, file: imageHolder.file })}
								loading={updateLoading}
							>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default EditProperty;

type PropertyContentProps = {
	isDesktop: boolean;
	propertyId: string;
	imageHolder: TSimpleAttachment;
	setImageHolder: (image: TSimpleAttachment) => void;
	infoHolder: TProperty;
	updateInfoHolder: (info: Partial<TProperty>) => void;
	mutateUpdateProperty: (changes: Partial<TProperty>) => void;
};
function PropertyContent({
	isDesktop,
	propertyId,
	imageHolder,
	setImageHolder,
	infoHolder,
	updateInfoHolder,
	mutateUpdateProperty,
}: PropertyContentProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<SharableUsageLink id={propertyId} />
			<PropertyUsageLink
				id={propertyId}
				qrCodeLinkSvgString={infoHolder.usoTemporarioLinkUrlQRCode ?? undefined}
				updateInfoHolder={updateInfoHolder}
				mutateUpdateProperty={mutateUpdateProperty}
			/>

			<GeneralInfo imageHolder={imageHolder} setImageHolder={setImageHolder} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<VehicleProperties isDesktop={isDesktop} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}

function SharableUsageLink({ id }: { id: string }) {
	return (
		<Button
			onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/publico/uso-temporario-propriedade/${id}`)}
			className="flex w-fit items-center gap-2 self-center rounded"
			variant="ghost"
		>
			<LinkIcon size={15} />
			<h1 className="w-fit text-start text-xs font-medium tracking-tight">LINK DE USO TEMPORÁRIO</h1>
		</Button>
	);
}

function PropertyUsageLink({
	id,
	qrCodeLinkSvgString,
	updateInfoHolder,
	mutateUpdateProperty,
}: {
	id: string;
	qrCodeLinkSvgString?: string;
	updateInfoHolder: (info: Partial<TProperty>) => void;
	mutateUpdateProperty: (changes: Partial<TProperty>) => void;
}) {
	async function generateQRCode(link: string) {
		const svgString = await QRCode.toString(link, {
			type: "svg",
			width: 100,
			margin: 2,
			color: {
				dark: "#000000",
				light: "#FFFFFF",
			},
		});
		mutateUpdateProperty({ usoTemporarioLinkUrlQRCode: svgString });
		toast.success("Código QR gerado com sucesso!");
	}
	if (!qrCodeLinkSvgString)
		return (
			<div className="flex w-full items-center justify-center">
				<Button
					size={"fit"}
					className="px-2 py-1 text-xs"
					variant={"ghost"}
					onClick={() => generateQRCode(`${process.env.NEXT_PUBLIC_APP_URL}/publico/uso-temporario-propriedade/${id}`)}
				>
					GERAR CÓDIGO QR DO LINK
				</Button>
			</div>
		);
	return (
		<div className="flex w-full items-center justify-center">
			<div className="border-primary/30 flex items-center justify-center rounded-md border p-2">
				<div dangerouslySetInnerHTML={{ __html: qrCodeLinkSvgString }} className="size-24" />
			</div>
		</div>
	);
}
