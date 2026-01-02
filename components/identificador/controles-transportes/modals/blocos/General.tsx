import PurchaseControlVinculationMenu from "@/components/identificador/controles-compras/modals/VinculationMenu";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import NumberInput from "@/components/inputs/Number";
import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatDateTime } from "@/utils/methods/formatting";
import { formatDateInputChange } from "@/utils/methods/shared";
import type { TUseTransportControlState } from "@/utils/state/transport-controls";
import { LayoutGrid, PlusIcon, TrashIcon, Truck } from "lucide-react";
import { useState } from "react";

type GeneralBlockProps = {
	transportControl: TUseTransportControlState["state"]["transportControl"];
	updateTransportControl: TUseTransportControlState["updateTransportControl"];
	addTransportControlItem: TUseTransportControlState["addTransportControlItem"];
	removeTransportControlItem: TUseTransportControlState["removeTransportControlItem"];
};
export default function GeneralBlock({
	transportControl,
	updateTransportControl,
	addTransportControlItem,
	removeTransportControlItem,
}: GeneralBlockProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="INFORMAÇÕES GERAIS" sectionTitleIcon={<LayoutGrid size={15} />}>
			<TextInput
				label="TÍTULO"
				value={transportControl.titulo}
				placeholder="Preencha o título do controle de transporte"
				handleChange={(value) => updateTransportControl({ titulo: value })}
				width="100%"
			/>

			<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<DateTimeInput
						label="DATA DE INÍCIO"
						value={formatDateTime(transportControl.dataInicio)}
						handleChange={(value) => {
							updateTransportControl({ dataInicio: formatDateInputChange(value, "string", false) });
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<DateTimeInput
						label="DATA DE FIM"
						value={formatDateTime(transportControl.dataFim)}
						handleChange={(value) => {
							updateTransportControl({ dataFim: formatDateInputChange(value, "string", false) });
						}}
						width="100%"
					/>
				</div>
			</div>
			<div className="w-full flex items-center gap-2 flex-col lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="QUILOMETRAGEM INICIAL"
						placeholder="Preencha a quilometragem inicial..."
						value={transportControl.distanciaQuilometragemInicial ?? null}
						handleChange={(value) => {
							updateTransportControl({ distanciaQuilometragemInicial: value });
						}}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="QUILOMETRAGEM FINAL"
						placeholder="Preencha a quilometragem final..."
						value={transportControl.distanciaQuilometragemFinal ?? null}
						handleChange={(value) => {
							updateTransportControl({ distanciaQuilometragemFinal: value });
						}}
						width="100%"
					/>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}
