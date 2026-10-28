import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { getExistingProducts } from "@/utils/schemas/crm/kits.schema";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import { Cog } from "lucide-react";
import type React from "react";

type OeMInformationBlockProps = {
	infoHolder: TContractRequestDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>;
	userHasEditPermission: boolean;
};
function OeMInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: OeMInformationBlockProps) {
	const existingEquipment = getExistingProducts(infoHolder.produtos ?? []);

	return (
		<ResponsiveDialogDrawerSection sectionTitleText="INFORMAÇÕES SOBRE SERVIÇOS DE O&M" sectionTitleIcon={<Cog className="h-4 w-4 min-h-4 min-w-4" />}>
			<div className="flex items-center justify-center">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="POSSUI O&M"
						labelTrue="POSSUI O&M"
						checked={infoHolder.possuiOeM === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, possuiOeM: value ? "SIM" : "NÃO" }))}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-4 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<NumberInput
						label="VALOR DO O&M (SE ADICIONAL)"
						placeholder="Preencha o valor do O&M, se adicional de projeto..."
						value={infoHolder.valorOeMOuSeguro || null}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorOeMOuSeguro: value }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"PLANO DE O&M"}
						value={infoHolder.planoOeM}
						editable={userHasEditPermission}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "MANUTENÇÃO SIMPLES", value: "MANUTENÇÃO SIMPLES" },
							{ id: 2, label: "PLANO SOL", value: "PLANO SOL" },
							{ id: 3, label: "PLANO SOL +", value: "PLANO SOL +" },
							{ id: 4, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, planoOeM: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, planoOeM: "NÃO SE APLICA" }))}
						width="100%"
					/>
				</div>
			</div>
			{existingEquipment.length > 0 ? (
				<div className="flex w-full flex-col gap-2">
					<h1 className="text-primary w-full text-center text-xs font-medium tracking-tight">EQUIPAMENTOS DO CLIENTE</h1>
					<div className="flex w-full flex-col gap-2">
						{existingEquipment.map((item, index) => (
							<div
								key={`${item.categoria}-${item.modelo}-${index.toString()}`}
								className="border-primary/40 bg-background flex w-full flex-col gap-1 rounded-md border p-2"
							>
								<p className="text-sm font-bold tracking-tight">
									<strong className="text-[#FF9B50]">{item.qtde}</strong> x {item.modelo || "SEM DESCRIÇÃO"}
								</p>
								<p className="text-foreground text-[0.65rem] font-light">
									{item.categoria}
									{item.fabricante ? ` · ${item.fabricante}` : ""}
									{item.potencia ? ` · ${item.potencia} W` : ""}
								</p>
							</div>
						))}
					</div>
				</div>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

export default OeMInformationBlock;
