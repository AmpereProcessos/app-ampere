"use client";

import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import type { TProject } from "@/utils/schemas/projects";
import { structureTypes } from "@/utils/select-options";

import { FieldGrid, StageSection } from "./shared";

type StageProps = {
	project: TProject;
	updateProjectWith: (updater: (project: TProject) => TProject) => void;
};

const paymentResp = ["AMPERE", "CLIENTE", "NÃO SE APLICA"].map((value, index) => ({ id: index + 1, label: value, value }));
const deliveryStatus = ["AGUARDANDO COMPRA", "EM ROTA", "ENTREGUE", "CANCELADO", "NAO DEFINIDO"].map((value, index) => ({ id: index + 1, label: value, value }));

export function EstruturaStage({ project, updateProjectWith }: StageProps) {
	return (
		<StageSection title="Estrutura">
			<FieldGrid cols={2}>
				<SelectInput label="TIPO DA ESTRUTURA" value={project.estruturaPersonalizada.tipo || "N/A"} selectedItemLabel="NAO DEFINIDO" options={structureTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, tipo: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, tipo: "N/A" } }))} width="100%" />
				<div className="flex items-end">
					<CheckboxInput labelFalse="APLICÁVEL NOVA/ADEQUAÇÃO DE ESTRUTURA" labelTrue="APLICÁVEL NOVA/ADEQUAÇÃO DE ESTRUTURA" checked={project.estruturaPersonalizada.aplicavel === "SIM"} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, aplicavel: (value ? "SIM" : "NAO") as TProject["estruturaPersonalizada"]["aplicavel"] } }))} />
				</div>
			</FieldGrid>
			{project.estruturaPersonalizada.aplicavel === "SIM" ? (
				<FieldGrid>
					<SelectInput label="PAGAMENTO DA ESTRUTURA" value={project.estruturaPersonalizada.respPagamento || null} selectedItemLabel="NAO DEFINIDO" options={paymentResp} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, respPagamento: value as TProject["estruturaPersonalizada"]["respPagamento"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, respPagamento: null } }))} width="100%" />
					<NumberInput label="VALOR DA ESTRUTURA" value={project.estruturaPersonalizada.valor || 0} placeholder="0,00" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, valor: value } }))} width="100%" />
					<SelectInput label="STATUS ENTREGA" value={project.estruturaPersonalizada.statusEntrega || "NAO DEFINIDO"} selectedItemLabel="NAO DEFINIDO" options={deliveryStatus} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, statusEntrega: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, estruturaPersonalizada: { ...prev.estruturaPersonalizada, statusEntrega: "NAO DEFINIDO" } }))} width="100%" />
				</FieldGrid>
			) : null}
		</StageSection>
	);
}
