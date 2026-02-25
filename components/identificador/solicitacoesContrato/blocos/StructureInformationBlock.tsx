import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import SelectInputWithImages from "@/components/inputs/SelectWithImages";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import { Wrench } from "lucide-react";
import type React from "react";

type StructureInformationBlockProps = {
	infoHolder: TContractRequestDTO;
	setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>;
	userHasEditPermission: boolean;
};
function StructureInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: StructureInformationBlockProps) {
	return (
		<ResponsiveDialogDrawerSection
			sectionTitleText="INFORMAÇÕES DA ESTRUTURA DE INSTALAÇÃO"
			sectionTitleIcon={<Wrench className="h-4 w-4 min-h-4 min-w-4" />}
		>
			<div className="flex w-full flex-col items-center gap-4 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"TIPO DA ESTRUTURA"}
						value={infoHolder.tipoEstrutura}
						editable={userHasEditPermission}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "TELHADO", value: "TELHADO" },
							{ id: 2, label: "CARPORT", value: "CARPORT" },
							{ id: 3, label: "SOLO", value: "SOLO" },
							{ id: 4, label: "ESTRUTURA PERSONALIZADA", value: "ESTRUTURA PERSONALIZADA" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoEstrutura: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, tipoEstrutura: "TELHADO" }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"MATERIAL DA ESTRUTURA"}
						value={infoHolder.materialEstrutura}
						editable={userHasEditPermission}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "MADEIRA", value: "MADEIRA" },
							{ id: 2, label: "FERRO", value: "FERRO" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, materialEstrutura: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, materialEstrutura: null }))}
						width="100%"
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-4 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"INCLUSO VENDA DE NOVA OU ADEQUAÇÃO DE ESTRUTURA"}
						value={infoHolder.estruturaAmpere}
						editable={userHasEditPermission}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "SIM", value: "SIM" },
							{ id: 2, label: "NÃO", value: "NÃO" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, estruturaAmpere: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, estruturaAmpere: "NÃO" }))}
						width="100%"
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<SelectInput
						label={"RESPONSÁVEL PELA ADEQUAÇÃO"}
						value={infoHolder.responsavelEstrutura}
						editable={userHasEditPermission}
						selectedItemLabel="NÃO DEFINIDO"
						options={[
							{ id: 1, label: "AMPERE", value: "AMPERE" },
							{ id: 2, label: "CLIENTE", value: "CLIENTE" },
							{ id: 3, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
						]}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavelEstrutura: value }))}
						onReset={() => setInfoHolder((prev) => ({ ...prev, responsavelEstrutura: "NÃO SE APLICA" }))}
						width="100%"
					/>
				</div>
			</div>
			{infoHolder.responsavelEstrutura === "AMPERE" ? (
				<div className="flex w-full flex-col items-center gap-4 lg:flex-row">
					<div className="w-full lg:w-1/2">
						<SelectInput
							label={"FORMA DE PAGAMENTO DA ESTRUTURA"}
							value={infoHolder.formaPagamentoEstrutura}
							editable={userHasEditPermission}
							selectedItemLabel="NÃO DEFINIDO"
							options={[
								{ id: 1, label: "INCLUSO NO FINANCIAMENTO", value: "INCLUSO NO FINANCIAMENTO" },
								{ id: 2, label: "DIRETO PRO FORNECEDOR", value: "DIRETO PRO FORNECEDOR" },
								{ id: 3, label: "A VISTA PARA AMPÈRE", value: "A VISTA PARA AMPÈRE" },
								{ id: 4, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
							]}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, formaPagamentoEstrutura: value }))}
							onReset={() => setInfoHolder((prev) => ({ ...prev, formaPagamentoEstrutura: "NÃO SE APLICA" }))}
							width="100%"
						/>
					</div>
					<div className="w-full lg:w-1/2">
						<NumberInput
							label="VALOR DA ESTRUTURA"
							placeholder="Preencha aqui o valor da estrutura..."
							value={infoHolder.valorEstrutura || null}
							handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorEstrutura: value }))}
							width="100%"
						/>
					</div>
				</div>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

export default StructureInformationBlock;
