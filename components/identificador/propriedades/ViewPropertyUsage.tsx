import { useMediaQuery } from "@/lib/hooks/media-query";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import { usePropertyTemporaryUsageById } from "@/utils/methods/query/properties";
import { getErrorMessage } from "@/utils/methods/handlers";
import type { TGetPropertyTemporaryUsageByIdOutput } from "@/pages/api/propriedades/uso-temporario";
import { Calendar, Code, Diamond, Download, ExternalLink, LayoutGrid, LinkIcon, Paperclip, UsersRound } from "lucide-react";
import Image from "next/image";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDecimalPlaces } from "@/utils/constants";
import { handleDownload } from "@/utils/methods/firebase";
import { handleRenderFileIcon, renderIcon } from "@/utils/methods/rendering";

type ViewPropertyUsageProps = {
	usageId: string;
	closeModal: () => void;
};
function ViewPropertyUsage({ usageId, closeModal }: ViewPropertyUsageProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const { data, isLoading, isError, isSuccess, error } = usePropertyTemporaryUsageById({ id: usageId });
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
							<ViewPropertyUsageContent usage={data} />
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							{/* <LoadingButton onClick={() => handleUpdateProperty({ id: propertyId, changes: infoHolder })} loading={updateLoading}>
								{BUTTON_TEXT}
							</LoadingButton> */}
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
							<ViewPropertyUsageContent usage={data} />
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							{/* <LoadingButton onClick={() => handleUpdateProperty({ id: propertyId, changes: infoHolder })} loading={updateLoading}>
								{BUTTON_TEXT}
							</LoadingButton> */}
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}
export default ViewPropertyUsage;

function ViewPropertyUsageContent({ usage }: { usage: TGetPropertyTemporaryUsageByIdOutput }) {
	return (
		<div className="flex h-full w-full flex-col gap-6 px-4 lg:px-0">
			<PropertyContent property={usage.propriedade} />
			<PeriodContent start={usage.dataInicio} end={usage.dataFim} />
			<ResponsibleContent responsible={usage.responsaveis} />
			<MetadataContent metadata={usage.metadados} />
			<AttachmentsContent attachments={usage.arquivos} />
			<OthersContent notes={usage.anotacoes} />
		</div>
	);
}

function PropertyContent({ property }: { property: TGetPropertyTemporaryUsageByIdOutput["propriedade"] }) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<LayoutGrid size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">INFORMAÇÕES DA PROPRIEDADE</h1>
			</div>
			<div className="w-full flex items-center gap-2 lg:flex-row">
				{property.imagemUrl ? (
					<div className="w-20 h-20 relative min-w-20 min-h-20 rounded-lg overflow-hidden">
						<Image src={property.imagemUrl} alt={property.nome} fill className="object-cover" />
					</div>
				) : null}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-1">
						<h2 className="text-sm font-medium tracking-tight">ID</h2>
						<h2 className="text-sm font-bold tracking-tight">{property.id}</h2>
					</div>
					<div className="flex items-center gap-1">
						<h2 className="text-sm font-medium tracking-tight">NOME DA PROPRIEDADE</h2>
						<h2 className="text-sm font-bold tracking-tight">{property.nome}</h2>
					</div>
					<div className="flex items-center gap-1">
						<h2 className="text-sm font-medium tracking-tight">IDENTIFICADOR</h2>
						<h2 className="text-sm font-bold tracking-tight">{property.identificador}</h2>
					</div>
				</div>
			</div>
		</div>
	);
}

function PeriodContent({ start, end }: { start: TGetPropertyTemporaryUsageByIdOutput["dataInicio"]; end: TGetPropertyTemporaryUsageByIdOutput["dataFim"] }) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Calendar size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">PERÍODO DO USO</h1>
			</div>
			<div className="flex items-center gap-1">
				<h2 className="text-sm font-medium tracking-tight">INÍCIO</h2>
				<h2 className="text-sm font-bold tracking-tight">{formatDateAsLocale(start)}</h2>
			</div>
			<div className="flex items-center gap-1">
				<h2 className="text-sm font-medium tracking-tight">FIM</h2>
				<h2 className="text-sm font-bold tracking-tight">{end ? formatDateAsLocale(end) : "N/A"}</h2>
			</div>
		</div>
	);
}

function ResponsibleContent({ responsible }: { responsible: TGetPropertyTemporaryUsageByIdOutput["responsaveis"] }) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<UsersRound size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">RESPONSÁVEIS</h1>
			</div>
			{responsible.map((responsible) => (
				<div key={responsible.id} className="flex items-center gap-1">
					<Avatar className="w-5 h-5">
						<AvatarImage src={responsible.avatar_url ?? undefined} />
						<AvatarFallback>{formatDecimalPlaces(responsible.id, 2)}</AvatarFallback>
					</Avatar>
					<h2 className="text-sm font-medium tracking-tight">{responsible.nome}</h2>
				</div>
			))}
		</div>
	);
}

function MetadataContent({ metadata }: { metadata: TGetPropertyTemporaryUsageByIdOutput["metadados"] }) {
	const metadataByType: Record<TGetPropertyTemporaryUsageByIdOutput["metadados"]["tipo"], React.ReactNode> = {
		"USO DE VEÍCULO": (
			<>
				<div className="flex items-center gap-1">
					<h2 className="text-sm font-medium tracking-tight">KM INICIAL</h2>
					<h2 className="text-sm font-bold tracking-tight">{metadata.kmInicial}</h2>
				</div>
				<div className="flex items-center gap-1">
					<h2 className="text-sm font-medium tracking-tight">KM FINAL</h2>
					<h2 className="text-sm font-bold tracking-tight">{metadata.kmFinal ?? "N/A"}</h2>
				</div>
			</>
		),
	};
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Code size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">METADADOS</h1>
			</div>
			{metadataByType[metadata.tipo]}
		</div>
	);
}

function AttachmentsContent({ attachments }: { attachments: TGetPropertyTemporaryUsageByIdOutput["arquivos"] }) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<LinkIcon size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">ANEXOS</h1>
			</div>
			{attachments.map((attachment) => (
				<div key={attachment.url} className="w-full flex items-center gap-1 justify-between">
					<div className="flex items-center gap-1">
						{handleRenderFileIcon(attachment.formato, 15)}
						<h2 className="text-sm font-medium tracking-tight">{attachment.titulo}</h2>
					</div>
					<div className="flex items-center gap-1">
						<Button variant="ghost" size="fit" className="p-2 rounded-full" onClick={() => window.open(attachment.url, "_blank")}>
							<ExternalLink size={15} />
						</Button>
						<Button variant="ghost" size="fit" className="p-2 rounded-full" onClick={() => handleDownload({ fileName: attachment.titulo, fileUrl: attachment.url })}>
							<Download size={15} />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}

function OthersContent({ notes }: { notes: TGetPropertyTemporaryUsageByIdOutput["anotacoes"] }) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
				<Diamond size={15} />
				<h1 className="text-xs tracking-tight font-medium text-start w-fit">OUTRAS INFORMAÇÕES</h1>
			</div>
			<div className="flex flex-col gap-1">
				<h2 className="text-sm font-medium tracking-tight">ANOTAÇÕES</h2>
				<h2 className="text-sm font-bold tracking-tight text-start">{notes ?? "Nenhuma anotação encontrada."}</h2>
			</div>
		</div>
	);
}
