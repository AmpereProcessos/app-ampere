import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createPurchaseControl } from "@/utils/methods/mutation/purchase-controls";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import type { TAuthSession } from "@/lib/authentication/types";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { usePurchaseProject } from "@/utils/methods/query/purchase-controls";
import PurchaseControlProjectInformationBlock from "./blocos/ProjectInformationBlock";
import PurchaseControlProjectVinculation from "./blocos/utils/ProjectVinculation";
import toast from "react-hot-toast";
import PurchaseControlPaymentInformationBlock from "./blocos/PaymentInformationBlock";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/hooks/media-query";
type NewPurchaseControlProps = {
	session: TAuthSession;
	affectedQueryKey: any[];
	closeModal: () => void;
};
function NewPurchaseControl({ session, affectedQueryKey, closeModal }: NewPurchaseControlProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");

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

	const { mutate, isPending } = useMutationWithFeedback({
		mutationKey: ["create-purchase-control"],
		mutationFn: createPurchaseControl,
		queryClient: queryClient,
		affectedQueryKey: affectedQueryKey,
	});

	const TITLE = "ADICIONAR CONTROLE DE COMPRA";
	const DESCRIPTION = "Preencha os dados do Controle de Compra.";
	const BUTTON_TEXT = "ADICIONAR CONTROLE DE COMPRA";

	return isDesktop ? (
		<Dialog open={true} onOpenChange={closeModal}>
			<DialogContent className="h-[85vh] w-[80%] min-w-[80%]">
				<DialogHeader>
					<DialogTitle>{TITLE}</DialogTitle>
					<DialogDescription>{DESCRIPTION}</DialogDescription>
				</DialogHeader>
				<div className="flex-1 overflow-hidden px-4">
					<ScrollArea className="h-full">
						<PurchaseControlDataBlock
							queryClient={queryClient}
							infoHolder={infoHolder}
							setInfoHolder={setInfoHolder}
							session={session}
							affectedQueryKey={affectedQueryKey}
						/>
					</ScrollArea>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton onClick={() => mutate(infoHolder)} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open={true} onOpenChange={closeModal}>
			<DrawerContent className="flex h-[85vh] flex-col">
				<DrawerHeader>
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				<div className="flex-1 overflow-hidden px-4">
					<ScrollArea className="h-full">
						<PurchaseControlDataBlock
							queryClient={queryClient}
							infoHolder={infoHolder}
							setInfoHolder={setInfoHolder}
							session={session}
							affectedQueryKey={affectedQueryKey}
						/>
					</ScrollArea>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>

					<LoadingButton onClick={() => mutate(infoHolder)} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewPurchaseControl;

type PurchaseControlDataBlockProps = {
	queryClient: any;
	infoHolder: TPurchaseControl;
	setInfoHolder: Dispatch<SetStateAction<TPurchaseControl>>;
	session: TAuthSession;
	affectedQueryKey: any[];
};
function PurchaseControlDataBlock({ queryClient, infoHolder, setInfoHolder, session, affectedQueryKey }: PurchaseControlDataBlockProps) {
	const { data: project } = usePurchaseProject({ projectId: infoHolder.projeto.id || null });

	function addProductToComposition(product: TPurchaseControl["composicao"][number]) {
		setInfoHolder((prev) => ({ ...prev, composicao: [...prev.composicao, product] }));
		toast.success("Produto adicionado à composição");
	}

	return (
		<div className="flex h-full flex-col gap-y-2">
			<PurchaseControlGeneralInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			{project ? (
				<PurchaseControlProjectInformationBlock
					session={session}
					purchase={infoHolder}
					updatePurchase={(changes) => setInfoHolder((prev) => ({ ...prev, ...changes }))}
					project={project}
					addProductToComposition={addProductToComposition}
				/>
			) : (
				<PurchaseControlProjectVinculation
					purchaseControlId={undefined}
					infoHolder={infoHolder}
					setInfoHolder={setInfoHolder}
					affectedQueryKey={affectedQueryKey}
					queryClient={queryClient}
				/>
			)}
			<PurchaseControlUpdatesInformationBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlTagsBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlCompositionBlock session={session} infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlPaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlOrderInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlTransportationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlBillingInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
			<PurchaseControlDeliveryInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
		</div>
	);
}
