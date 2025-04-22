import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { deletePurchaseControl, updatePurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import type { TPurchaseControl, TPurchaseControlDTO, TPurchaseControlWithProjectDTO } from "@/utils/schemas/purchases";
import type { Session } from "next-auth";
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
// import * as Dialog from "@radix-ui/react-dialog";
import { VscChromeClose } from "react-icons/vsc";
import PurchaseControlGeneralInformationBlock from "./blocos/GeneralInformationBlock";
import PurchaseControlCompositionBlock from "./blocos/CompositionBlock";
import PurchaseControlOrderInformationBlock from "./blocos/OrderInformationBlock";
import PurchaseControlTransportationInformationBlock from "./blocos/TransportationInformationBlock";
import PurchaseControlBillingInformationBlock from "./blocos/BillingInformationBlock";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import PurchaseControlDeliveryInformationBlock from "./blocos/DeliveryInformationBlock";
import PurchaseControlUpdatesInformationBlock from "./blocos/UpdatesInformationBlock";
import PurchaseControlTagsBlock from "./blocos/TagsBlock";
import { usePurchaseControlById } from "@/utils/methods/query/purchase-controls";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { getErrorMessage } from "@/utils/methods/handlers";
import CheckboxWithDate from "@/components/inputs/CheckboxWithDate";
import { formatDateInputChange } from "@/utils/methods/shared";
import PurchaseControlProjectInformationBlock from "./blocos/ProjectInformationBlock";
import PurchaseControlProjectVinculation from "./blocos/utils/ProjectVinculation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import PurchaseControlFileReferences from "./blocos/AttachmentsBlock";
import { updateProject } from "@/utils/methods/mutation/clients";
import PurchaseControlPaymentInformationBlock from "./blocos/PaymentInformationBlock";
import { handleProjectPurchaseControlTrigger } from "@/utils/methods/mutation/triggers";
import { useMediaQuery } from "@/lib/hooks/media-query";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";

type ControlPurchaseControlProps = {
	session: Session;
	purchaseControlId: string;
	affectedQueryKey: any[];
	closeModal: () => void;
};
function ControlPurchaseControl({ session, purchaseControlId, affectedQueryKey, closeModal }: ControlPurchaseControlProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const { data: purchaseControl, isLoading, isError, isSuccess, error } = usePurchaseControlById({ id: purchaseControlId });
	const [infoHolder, setInfoHolder] = useState<TPurchaseControl>({
		status: "PENDENTE",
		registrosStatus: {},
		titulo: "",
		anotacoes: "",
		projeto: {},
		etiquetas: [],
		atualizacoes: [],
		totalPrevisto: 0,
		total: 0,
		liberacao: {
			autor: {},
		},
		composicao: [],
		entrega: {
			status: "AGUARDANDO COMPRA",
			localizacao: {
				uf: "",
				cidade: "",
			},
		},
		faturamentos: [],
		fornecedor: {},
		transporte: {
			transportadora: {},
		},
		autor: {
			id: session.user.id,
			nome: session.user.nome,
			avatar_url: session.user.avatar_url,
		},
		dataInsercao: new Date().toISOString(),
	});

	async function handleUpdatePurchaseControl({ id, changes }: { id: string; changes: Partial<TPurchaseControl> }) {
		try {
			await updatePurchaseControl({ id, changes });
			const projectId = purchaseControl?.projeto.id;
			if (projectId) await handleProjectPurchaseControlTrigger({ projectId });

			return "Controle de compra atualizado com sucesso.";
		} catch (error) {
			console.log("Error running handleUpdatePurchaseControl", error);
			throw error;
		}
	}
	const { mutate, isPending: isUpdateLoading } = useMutationWithFeedback({
		mutationKey: ["update-purchase-control", purchaseControlId],
		mutationFn: handleUpdatePurchaseControl,
		queryClient: queryClient,
		affectedQueryKey: affectedQueryKey,
		callbackFn: async () => queryClient.invalidateQueries({ queryKey: ["purchase-control-by-id", purchaseControlId] }),
	});
	const { mutate: deleteMutation, isPending: isDeleteLoading } = useMutationWithFeedback({
		mutationKey: ["delete-purchase-control", purchaseControlId],
		mutationFn: deletePurchaseControl,
		queryClient: queryClient,
		affectedQueryKey: affectedQueryKey,
		callbackFn: () => closeModal(),
	});
	function addProductToComposition(product: TPurchaseControl["composicao"][number]) {
		setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }));
		toast.success("Produto adicionado à composição");
	}
	const TITLE = "EDITAR CONTROLE DE COMPRA";
	const DESCRIPTION = "Atualize os dados do Controle de Compra.";
	const BUTTON_TEXT = "ATUALIZAR KIT";
	const DELETE_BUTTON_TEXT = "EXCLUIR KIT";
	useEffect(() => {
		if (purchaseControl) setInfoHolder(purchaseControl);
	}, [purchaseControl]);
	if (isDesktop)
		return (
			<Dialog open={true} onOpenChange={closeModal}>
				<DialogContent className="min-w-[80%] w-[80%]">
					<DialogHeader>
						<DialogTitle>{TITLE}</DialogTitle>
						<DialogDescription>{DESCRIPTION}</DialogDescription>
					</DialogHeader>
					{isLoading ? <LoadingComponent /> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						<>
							<ScrollArea className="w-full flex flex-col grow max-h-[500px] px-2">
								<PurchaseControlDataBlock
									queryClient={queryClient}
									purchaseControlId={purchaseControlId}
									purchaseControl={purchaseControl}
									infoHolder={infoHolder}
									setInfoHolder={setInfoHolder}
									session={session}
								/>
							</ScrollArea>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">FECHAR</Button>
								</DialogClose>
								<LoadingButton onClick={() => handleUpdatePurchaseControl({ id: purchaseControlId, changes: infoHolder })} loading={isUpdateLoading}>
									{BUTTON_TEXT}
								</LoadingButton>
							</DialogFooter>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		);
	return (
		<Drawer open={true} onOpenChange={closeModal}>
			<DrawerContent className="h-[85vh] flex flex-col">
				<DrawerHeader>
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="flex-1 overflow-hidden px-4">
							<ScrollArea className="h-full">
								<PurchaseControlDataBlock
									queryClient={queryClient}
									purchaseControlId={purchaseControlId}
									purchaseControl={purchaseControl}
									infoHolder={infoHolder}
									setInfoHolder={setInfoHolder}
									session={session}
								/>
							</ScrollArea>
						</div>

						<DrawerFooter>
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton onClick={() => handleUpdatePurchaseControl({ id: purchaseControlId, changes: infoHolder })} loading={isUpdateLoading}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}

export default ControlPurchaseControl;

type PurchaseControlDataBlockProps = {
	queryClient: any;
	purchaseControlId: string;
	purchaseControl: TPurchaseControlWithProjectDTO;
	infoHolder: TPurchaseControl;
	setInfoHolder: Dispatch<SetStateAction<TPurchaseControl>>;
	session: Session;
};
function PurchaseControlDataBlock({ queryClient, purchaseControlId, purchaseControl, infoHolder, setInfoHolder, session }: PurchaseControlDataBlockProps) {
	function addProductToComposition(product: TPurchaseControl["composicao"][number]) {
		setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }));
		toast.success("Produto adicionado à composição");
	}
	return (
		<div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
			<div className="flex w-full items-center justify-center">
				<Link href={`/suprimentos/controle-compras/pdf/${purchaseControlId}`}>
					<button type="button" className={cn("flex items-center gap-1 rounded-lg bg-black px-2 py-1 text-white duration-300 ease-in-out hover:bg-gray-800")}>
						<ExternalLink width={14} height={14} />
						<h1 className="text-xs font-medium tracking-tight">PÁGINA DO PEDIDO</h1>
					</button>
				</Link>
			</div>
			<PurchaseControlGeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			{purchaseControl.projetoDados ? (
				<PurchaseControlProjectInformationBlock
					session={session}
					purchase={infoHolder}
					updatePurchase={(changes) => setInfoHolder((prev) => ({ ...prev, ...changes }))}
					project={purchaseControl.projetoDados}
					addProductToComposition={addProductToComposition}
				/>
			) : (
				<PurchaseControlProjectVinculation
					purchaseControlId={purchaseControlId}
					infoHolder={infoHolder}
					setInfoHolder={setInfoHolder}
					affectedQueryKey={["purchase-control-by-id", purchaseControlId]}
					queryClient={queryClient}
				/>
			)}
			<PurchaseControlFileReferences
				session={session}
				attachmentPrefix={`clientes/${infoHolder.titulo}`}
				purchaseId={purchaseControlId}
				projectId={infoHolder.projeto.id || undefined}
			/>
			<PurchaseControlUpdatesInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlTagsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlCompositionBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlPaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlOrderInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlTransportationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlBillingInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlDeliveryInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
		</div>
	);
}
