import PurchaseControlVinculationMenu from "@/components/identificador/controles-compras/modals/VinculationMenu";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TUseTransportControlState } from "@/utils/state/transport-controls";
import { PlusIcon, TrashIcon, Truck } from "lucide-react";
import { useState } from "react";

type ItemsBlockProps = {
	items: TUseTransportControlState["state"]["transportControl"]["itens"];
	addItem: (item: TUseTransportControlState["state"]["transportControl"]["itens"][number]) => void;
	removeItem: (index: number) => void;
};
export default function ItemsBlock({ items, addItem, removeItem }: ItemsBlockProps) {
	const [newItemMenuIsOpen, setNewItemMenuIsOpen] = useState(false);
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="TRANSPORTES" sectionTitleIcon={<Truck size={15} />}>
			<div className="w-full flex flex-col gap-1.5">
				<div className="w-full flex items-center gap-2 justify-end">
					<Button onClick={() => setNewItemMenuIsOpen(true)} variant="ghost" size="fit" className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs">
						<PlusIcon className="w-4 h-4" />
						ADICIONAR
					</Button>
				</div>
				{items.length > 0 ? (
					items.map((item, index) => <TransportControlItem key={item.id} item={item} handleRemove={() => removeItem(index)} />)
				) : (
					<p className="text-primary/60 w-full text-center text-xs font-medium italic">Nenhum item adicionado.</p>
				)}
			</div>
			{newItemMenuIsOpen ? (
				<PurchaseControlVinculationMenu
					closeMenu={() => setNewItemMenuIsOpen(false)}
					handleSelect={(transportControlItem) => {
						addItem({
							id: transportControlItem._id,
							titulo: transportControlItem.titulo,
							ordem: items.length + 1,
							projeto: {
								id: transportControlItem.projeto?.id || null,
								nome: transportControlItem.projeto?.nome || null,
							},
							anexos: [],
							dataEfetivacao: null,
						});
						setNewItemMenuIsOpen(false);
					}}
				/>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

type TransportControlItemProps = {
	item: TUseTransportControlState["state"]["transportControl"]["itens"][number];
	handleRemove: () => void;
};
function TransportControlItem({ item, handleRemove }: TransportControlItemProps) {
	return (
		<div className="w-full flex items-center gap-2 justify-between p-2 rounded-lg shadow-sm border border-primary/30">
			<h1 className="text-xs tracking-tight font-medium text-start w-fit">{item.titulo}</h1>
			<Button
				variant="ghost"
				size="fit"
				className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors"
				onClick={handleRemove}
			>
				<TrashIcon className="w-4 h-4" />
			</Button>
		</div>
	);
}
