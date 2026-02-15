import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { tiposDePadrao } from "@/utils/constants";
import type { TContractRequestDTO } from "@/utils/schemas/contract-requests";
import React, { type Dispatch, type SetStateAction } from "react";
import { Zap } from "lucide-react";

type EnergyPAInformationBlockProps = {
	infoHolder: TContractRequestDTO;
	setInfoHolder: Dispatch<SetStateAction<TContractRequestDTO>>;
	userHasEditPermission: boolean;
};
function EnergyPAInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: EnergyPAInformationBlockProps) {
	return (
		<ResponsiveDialogDrawerSection
			sectionTitleText="INFORMAÇÕES SOBRE O PADRÃO DE ENERGIA"
			sectionTitleIcon={<Zap className="h-4 w-4 min-h-4 min-w-4" />}
		>
			<div className="flex flex-wrap items-center justify-center gap-4">
				<div className="w-fit">
					<CheckboxInput
						labelFalse="NECESSÁRIO ADEQUAÇÃO"
						labelTrue="NECESSÁRIO ADEQUAÇÃO"
						checked={infoHolder.aumentoDeCarga === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, aumentoDeCarga: value ? "SIM" : "NÃO" }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="CAIXA CONJUGADA"
						labelTrue="CAIXA CONJUGADA"
						checked={infoHolder.caixaConjugada === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, caixaConjugada: value ? "SIM" : "NÃO" }))}
					/>
				</div>
				<div className="w-fit">
					<CheckboxInput
						labelFalse="HAVERÁ AUMENTO DE DISJUNTOR"
						labelTrue="HAVERÁ AUMENTO DE DISJUNTOR"
						checked={infoHolder.aumentoDisjuntor === "SIM"}
						handleChange={(value) => setInfoHolder((prev) => ({ ...prev, aumentoDisjuntor: value ? "SIM" : "NÃO" }))}
					/>
				</div>
			</div>

			{infoHolder.aumentoDeCarga === "SIM" ? (
				<>
					<div className="flex w-full flex-col items-center gap-4 lg:flex-row">
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"AMPERAGEM DO PADRÃO"}
								value={infoHolder.tipoDePadrao}
								editable={userHasEditPermission}
								selectedItemLabel="NÃO DEFINIDO"
								options={tiposDePadrao.map((t, index) => ({ id: index + 1, ...t }))}
								handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDePadrao: value }))}
								onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDePadrao: null }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"RESPONSÁVEL PELA TROCA"}
								value={infoHolder.respTrocaPadrao}
								editable={userHasEditPermission}
								selectedItemLabel="NÃO DEFINIDO"
								options={[
									{ id: 1, label: "AMPERE", value: "AMPERE" },
									{ id: 2, label: "CLIENTE", value: "CLIENTE" },
								]}
								handleChange={(value) => setInfoHolder((prev) => ({ ...prev, respTrocaPadrao: value }))}
								onReset={() => setInfoHolder((prev) => ({ ...prev, respTrocaPadrao: null }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"FORMA DE PAGAMENTO DO PADRÃO"}
								value={infoHolder.formaPagamentoPadrao}
								editable={userHasEditPermission}
								selectedItemLabel="NÃO DEFINIDO"
								options={[
									{ id: 1, label: "CLIENTE IRÁ COMPRAR EM SEPARADO", value: "CLIENTE IRÁ COMPRAR EM SEPARADO" },
									{ id: 2, label: "CLIENTE PAGAR POR FORA", value: "CLIENTE PAGAR POR FORA" },
									{ id: 3, label: "INCLUSO NO CONTRATO", value: "INCLUSO NO CONTRATO" },
									{ id: 4, label: "NÃO HAVERA TROCA PADRÃO", value: "NÃO HAVERA TROCA PADRÃO" },
								]}
								handleChange={(value) => setInfoHolder((prev) => ({ ...prev, formaPagamentoPadrao: value }))}
								onReset={() => setInfoHolder((prev) => ({ ...prev, formaPagamentoPadrao: null }))}
								width="100%"
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<NumberInput
								label="VALOR DO PADRÃO (ADICIONAL)"
								placeholder="Preencha aqui o valor do padrão..."
								value={infoHolder.valorPadrao || null}
								handleChange={(value) => setInfoHolder((prev) => ({ ...prev, valorPadrao: value }))}
								width="100%"
							/>
						</div>
					</div>
				</>
			) : null}
		</ResponsiveDialogDrawerSection>
	);
}

export default EnergyPAInformationBlock;
