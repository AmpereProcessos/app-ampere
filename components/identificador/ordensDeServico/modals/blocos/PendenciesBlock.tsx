import React from "react";
import { TServiceOrder } from "@/utils/schemas/service-order";
import CheckboxInput from "@/components/inputs/Checkbox";
import CheckboxWithDate from "@/components/inputs/CheckboxWithDate";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { LayoutGrid } from "lucide-react";
type ServiceOrderPendenciesBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
};
function ServiceOrderPendenciesBlock({ infoHolder, updateInfoHolder }: ServiceOrderPendenciesBlockProps) {
	return (
		<ResponsiveDialogDrawerSection sectionTitleText="PENDÊNCIAS" sectionTitleIcon={<LayoutGrid size={15} />}>
			<div className="flex w-full flex-wrap items-center justify-center gap-2">
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="DIAGRAMAS FEITOS"
						labelTrue="DIAGRAMAS FEITOS"
						date={infoHolder.pendencias?.diagramas || null}
						handleChange={(value) => {
							console.log(value);
							updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), diagramas: value ? value : null } });
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="DESENHOS FEITOS"
						labelTrue="DESENHOS FEITOS"
						date={infoHolder.pendencias?.desenhos || null}
						handleChange={(value) => {
							updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), desenhos: value ? value : null } });
						}}
					/>
				</div>
				<div className="w-fit">
					<CheckboxWithDate
						labelFalse="MAPAS DE MICRO"
						labelTrue="MAPAS DE MICRO"
						date={infoHolder.pendencias?.mapasDeMicro || null}
						handleChange={(value) => {
							updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), mapasDeMicro: value ? value : null } });
						}}
					/>
				</div>
			</div>
		</ResponsiveDialogDrawerSection>
	);
}

export default ServiceOrderPendenciesBlock;
