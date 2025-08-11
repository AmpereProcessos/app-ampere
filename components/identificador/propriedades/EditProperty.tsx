import React, { useEffect, useState } from "react";
import type { Session } from "next-auth";
import type { TProperty } from "@/utils/schemas/properties";

import { useQueryClient } from "@tanstack/react-query";

import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createProperty, updateProperty } from "@/utils/methods/mutation/properties";

import { useMediaQuery } from "@/lib/hooks/media-query";

import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

import GeneralInfo from "./blocos/Generalnfo";
import VehicleProperties from "./VehicleProperties";
import { usePropertyById } from "@/utils/methods/query/properties";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import { LinkIcon } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import type { TSimpleAttachment } from "@/utils/methods/uploading";
import { formatAsSlug, formatWithoutDiacritics } from "@/utils/methods/formatting";
import { uploadFile } from "@/utils/methods/firebase";
import QRCode from "qrcode";
import toast from "react-hot-toast";

type EditPropertyProps = {
	propertyId: string;
	session: Session;
	closeModal: () => void;
};
function EditProperty({ propertyId, session, closeModal }: EditPropertyProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const queryClient = useQueryClient();
	const [infoHolder, setInfoHolder] = useState<TProperty>({
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
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[80vh] dark:bg-white">
				<DialogHeader>
					<DialogTitle>{MENU_TITLE}</DialogTitle>
					<DialogDescription>{MENU_DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
							<PropertyContent
								isDesktop={isDesktop}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
								propertyId={propertyId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton onClick={() => handleUpdatePropertyMutation({ id: propertyId, changes: infoHolder, file: imageHolder.file })} loading={updateLoading}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
			<DrawerContent className="h-fit max-h-[70vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{MENU_TITLE}</DrawerTitle>
					<DrawerDescription>{MENU_DESCRIPTION}</DrawerDescription>
				</DrawerHeader>

				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-auto scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
							<PropertyContent
								isDesktop={isDesktop}
								imageHolder={imageHolder}
								setImageHolder={setImageHolder}
								propertyId={propertyId}
								infoHolder={infoHolder}
								updateInfoHolder={updateInfoHolder}
							/>
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton onClick={() => handleUpdatePropertyMutation({ id: propertyId, changes: infoHolder, file: imageHolder.file })} loading={updateLoading}>
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
};
function PropertyContent({ isDesktop, propertyId, imageHolder, setImageHolder, infoHolder, updateInfoHolder }: PropertyContentProps) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<SharableUsageLink id={propertyId} />
			<PropertyUsageLink id={propertyId} qrCodeLinkSvgString={infoHolder.usoTemporarioLinkUrlQRCode ?? undefined} updateInfoHolder={updateInfoHolder} />

			<GeneralInfo imageHolder={imageHolder} setImageHolder={setImageHolder} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			<VehicleProperties isDesktop={isDesktop} infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}

function SharableUsageLink({ id }: { id: string }) {
	return (
		<Button
			onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/publico/uso-temporario-propriedade/${id}`)}
			className="flex items-center gap-2 rounded w-fit self-center"
			variant="ghost"
		>
			<LinkIcon size={15} />
			<h1 className="text-xs tracking-tight font-medium text-start w-fit">LINK DE USO TEMPORÁRIO</h1>
		</Button>
	);
}

function PropertyUsageLink({ id, qrCodeLinkSvgString, updateInfoHolder }: { id: string; qrCodeLinkSvgString?: string; updateInfoHolder: (info: Partial<TProperty>) => void }) {
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
		updateInfoHolder({ usoTemporarioLinkUrlQRCode: svgString });
		toast.success("Código QR gerado com sucesso!");
	}
	if (!qrCodeLinkSvgString)
		return (
			<div className="w-full flex items-center justify-center">
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
		<div className="w-full flex items-center justify-center">
			<div className="flex items-center justify-center border border-primary/30 p-2 rounded-md">
				<div dangerouslySetInnerHTML={{ __html: qrCodeLinkSvgString }} className="size-24" />
			</div>
		</div>
	);
}
