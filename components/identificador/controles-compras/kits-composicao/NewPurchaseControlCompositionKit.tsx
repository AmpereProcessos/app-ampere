import { useMediaQuery } from "@/lib/hooks/media-query";
import type { Session } from "next-auth";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { TPurchaseControlCompositionKit } from "@/utils/schemas/purchases";
import TextInput from "@/components/inputs/Text";
import PurchaseControlCompositionKitItemBlock from "./ItensBlock";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { createPurchaseControlCompositionKit } from "@/utils/methods/mutation/purchase-controls";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

type NewPurchaseControlCompositionKitProps = {
	session: Session;
	affectedQueryKey: any[];
	closeModal: () => void;
};
function NewPurchaseControlCompositionKit({ session, affectedQueryKey, closeModal }: NewPurchaseControlCompositionKitProps) {
	const queryClient = useQueryClient();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const [infoHolder, setInfoHolder] = useState<TPurchaseControlCompositionKit>({
		titulo: "",
		itens: [],
		dataInsercao: new Date().toISOString(),
	});

	function updateData(changes: Partial<TPurchaseControlCompositionKit>) {
		setInfoHolder((prev) => ({
			...prev,
			...changes,
		}));
	}

	function addItem(item: TPurchaseControlCompositionKit["itens"][number]) {
		setInfoHolder((prev) => ({
			...prev,
			itens: [...prev.itens, item],
		}));
	}
	function updateItem({ index, changes }: { index: number; changes: Partial<TPurchaseControlCompositionKit["itens"][number]> }) {
		setInfoHolder((prev) => ({
			...prev,
			itens: prev.itens.map((item, i) => (i === index ? { ...item, ...changes } : item)),
		}));
	}

	function removeItem(index: number) {
		setInfoHolder((prev) => ({
			...prev,
			itens: prev.itens.filter((_, i) => i !== index),
		}));
	}

	const { mutate: handleCreatePurchaseControlCompositionKit, isPending } = useMutationWithFeedback({
		mutationKey: ["create-composition-kit"],
		mutationFn: createPurchaseControlCompositionKit,
		queryClient,
		affectedQueryKey: affectedQueryKey,
	});
	const TITLE = "NOVO KIT";
	const DESCRIPTION = "Preencha alguns dados sobre o kit.";
	const BUTTON_TEXT = "ADICIONAR KIT";
	if (isDesktop)
		return (
			<Dialog open={true} onOpenChange={closeModal}>
				<DialogContent className="min-w-[50%] w-[50%] h-[45vh]">
					<DialogHeader>
						<DialogTitle>{TITLE}</DialogTitle>
						<DialogDescription>{DESCRIPTION}</DialogDescription>
					</DialogHeader>
					<div className="flex-1 overflow-hidden px-4">
						<ScrollArea className="h-full">
							<PurchaseControlCompositionKitData data={infoHolder} updateData={updateData} addItem={addItem} updateItem={updateItem} removeItem={removeItem} />
						</ScrollArea>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">FECHAR</Button>
						</DialogClose>
						<LoadingButton onClick={() => handleCreatePurchaseControlCompositionKit(infoHolder)} loading={isPending}>
							{BUTTON_TEXT}
						</LoadingButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	return (
		<Drawer open={true} onOpenChange={closeModal}>
			<DrawerContent className="h-[85vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				<div className="flex-1 overflow-hidden px-4">
					<ScrollArea className="h-full">
						<PurchaseControlCompositionKitData data={infoHolder} updateData={updateData} addItem={addItem} updateItem={updateItem} removeItem={removeItem} />
					</ScrollArea>
				</div>
				<DrawerFooter className="pt-2">
					<LoadingButton onClick={() => handleCreatePurchaseControlCompositionKit(infoHolder)} loading={isPending}>
						{BUTTON_TEXT}
					</LoadingButton>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewPurchaseControlCompositionKit;

type PurchaseControlCompositionKitDataProps = {
	data: TPurchaseControlCompositionKit;
	updateData: (changes: Partial<TPurchaseControlCompositionKit>) => void;
	addItem: (item: TPurchaseControlCompositionKit["itens"][number]) => void;
	updateItem: (info: { index: number; changes: Partial<TPurchaseControlCompositionKit["itens"][number]> }) => void;
	removeItem: (index: number) => void;
};
function PurchaseControlCompositionKitData({ data, updateData, addItem, updateItem, removeItem }: PurchaseControlCompositionKitDataProps) {
	return (
		<div className="flex h-full flex-col gap-y-2">
			<TextInput label={"NOME DO KIT"} value={data.titulo} handleChange={(value) => updateData({ titulo: value })} placeholder="Preencha aqui o nome do kit..." width="100%" />
			<PurchaseControlCompositionKitItemBlock items={data.itens} updateItem={updateItem} removeItem={removeItem} addItem={addItem} />
		</div>
	);
}
