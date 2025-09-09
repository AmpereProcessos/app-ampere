import CheckboxInput from "@/components/inputs/Checkbox";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import { tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from "@/utils/constants";
import type { TServiceOrder } from "@/utils/schemas/service-order";
import React from "react";

type ServiceOrderDetailsInformationBlockProps = {
	infoHolder: TServiceOrder;
	updateInfoHolder: (changes: Partial<TServiceOrder>) => void;
};
function ServiceOrderDetailsInformationBlock({ infoHolder, updateInfoHolder }: ServiceOrderDetailsInformationBlockProps) {
	return (
		<div className="flex w-full flex-col items-center gap-4">
			<h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">DETALHES</h1>
			<div className="flex w-full flex-col gap-2">
				<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
					<div className="w-full lg:w-1/3">
						<SelectInput
							label={"TOPOLOGIA"}
							value={infoHolder.detalhes.topologia}
							options={[
								{ id: 1, label: "MICRO", value: "MICRO" },
								{ id: 2, label: "INVERSOR", value: "INVERSOR" },
							]}
							selectedItemLabel={"NÃO DEFINIDO"}
							handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, topologia: value } })}
							onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, topologia: "" } })}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label={"TIPO DE ESTRUTURA"}
							value={infoHolder.detalhes.tipoEstrutura}
							options={tiposDeEstruturas.map((structure, index) => ({ ...structure, id: index + 1 }))}
							selectedItemLabel={"NÃO DEFINIDO"}
							handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoEstrutura: value } })}
							onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoEstrutura: "" } })}
							width={"100%"}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<SelectInput
							label={"TIPO DE TELHA"}
							value={infoHolder.detalhes.tipoTelha}
							options={tiposDeTelha.map((roofType, index) => ({ ...roofType, id: index + 1 }))}
							selectedItemLabel={"NÃO DEFINIDO"}
							handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoTelha: value } })}
							onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoTelha: "" } })}
							width={"100%"}
						/>
					</div>
				</div>
				{infoHolder.categoria == "MANUTENÇÃO PREVENTIVA" ? (
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/4">
							<TextInput
								label={"PONTO DE ÁGUA"}
								placeholder={"Localização do ponto de água..."}
								value={infoHolder.detalhes.pontoAgua}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, pontoAgua: value } })}
								width={"100%"}
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<TextInput
								label={"SENHA DO WIFI"}
								placeholder={"Senha do Wi-Fi do cliente..."}
								value={infoHolder.detalhes.senhaWifi || ""}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, senhaWifi: value } })}
								width={"100%"}
							/>
						</div>
						<div className="flex w-full justify-center lg:w-1/4">
							<CheckboxInput
								labelFalse={"NÃO CONFIGURAR"}
								labelTrue={"CONFIGURAR"}
								labelClassName="font-sans font-bold  text-primary"
								checked={!!infoHolder.detalhes.configuracaoMonitoramento}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, configuracaoMonitoramento: value } })}
							/>
						</div>
						<div className="flex w-full justify-center lg:w-1/4">
							<CheckboxInput
								labelFalse={"NÃO POSSUI TRAFO"}
								labelTrue={"POSSUI TRAFO"}
								labelClassName="font-sans font-bold  text-primary"
								checked={!!infoHolder.detalhes.possuiTrafo}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, possuiTrafo: value } })}
							/>
						</div>
					</div>
				) : null}
				{infoHolder.categoria == "PADRÃO" ? (
					<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"ENTRADA DO PADRÃO"}
								value={infoHolder.detalhes.tipoPadrao}
								options={[
									{ id: 1, label: "AEREO", value: "AEREO" },
									{ id: 2, label: "SUBTERRANEO", value: "SUBTERRANEO" },
								]}
								selectedItemLabel={"NÃO DEFINIDO"}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoPadrao: value } })}
								onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoPadrao: "" } })}
								width={"100%"}
							/>
						</div>
						<div className="w-full lg:w-1/4">
							<SelectInput
								label={"SAÍDA DO PADRÃO"}
								value={infoHolder.detalhes.tipoSaidaPadrao}
								options={[
									{ id: 1, label: "AEREO", value: "AEREO" },
									{ id: 2, label: "SUBTERRANEO", value: "SUBTERRANEO" },
								]}
								selectedItemLabel={"NÃO DEFINIDO"}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoSaidaPadrao: value } })}
								onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, tipoSaidaPadrao: "N/A" } })}
								width={"100%"}
							/>
						</div>
						<div className="flex w-full justify-center lg:w-1/4">
							<SelectInput
								label={"AMPERAGEM DO PADRÃO"}
								value={infoHolder.detalhes.amperagemPadrao}
								options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
								selectedItemLabel={"NÃO DEFINIDO"}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, amperagemPadrao: value } })}
								onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, amperagemPadrao: "" } })}
								width={"100%"}
							/>
						</div>
						<div className="flex w-full justify-center lg:w-1/4">
							<SelectInput
								label={"RESPONSABILIDADE DO PADRÃO"}
								value={infoHolder.detalhes.responsabilidadePadrao}
								options={[
									{ id: 1, label: "AMPERE", value: "AMPERE" },
									{ id: 2, label: "CLIENTE", value: "CLIENTE" },
									{ id: 3, label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
								]}
								selectedItemLabel={"NÃO DEFINIDO"}
								handleChange={(value) => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, responsabilidadePadrao: value } })}
								onReset={() => updateInfoHolder({ detalhes: { ...infoHolder.detalhes, responsabilidadePadrao: "NÃO SE APLICA" } })}
								width={"100%"}
							/>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default ServiceOrderDetailsInformationBlock;
