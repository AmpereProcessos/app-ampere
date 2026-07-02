"use client";

import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import type { TProject } from "@/utils/schemas/projects";

import { FieldGrid, StageSection } from "./shared";

type StageProps = {
	project: TProject;
	updateProjectWith: (updater: (project: TProject) => TProject) => void;
};

const padraoTypes = [
	{ id: 1, label: "CONTRA A REDE", value: "CONTRA A REDE" },
	{ id: 2, label: "A FAVOR DA REDE", value: "A FAVOR DA REDE" },
	{ id: 3, label: "CONSTRUIR", value: "CONSTRUIR" },
	{ id: 4, label: "SUBESTAÇÃO", value: "SUBESTAÇÃO" },
	{ id: 5, label: "REFORMA DE PADRÃO", value: "REFORMA DE PADRÃO" },
	{ id: 6, label: "N/A", value: "N/A" },
	{ id: 7, label: "NÃO DEFINIDO", value: "NAO DEFINIDO" },
];
const entradaTypes = ["AÉREA", "SUBTERRÂNEO"].map((value, index) => ({ id: index + 1, label: value, value }));
const saidaTypes = ["AEREO", "SUBTERRANEO", "N/A"].map((value, index) => ({ id: index + 1, label: value, value }));
const paymentResp = ["CLIENTE IRÁ COMPRAR EM SEPARADO", "CLIENTE PAGAR POR FORA", "INCLUSO NO CONTRATO", "NÃO HAVERA TROCA PADRÃO"].map((value, index) => ({ id: index + 1, label: value, value }));
const installResp = ["AMPERE", "CLIENTE", "NÃO SE APLICA"].map((value, index) => ({ id: index + 1, label: value, value }));

export function PadraoStage({ project, updateProjectWith }: StageProps) {
	return (
		<StageSection title="Padrão de energia">
			<FieldGrid cols={4}>
				<TextInput label="AMPERAGEM" value={project.visitaTecnica.amperagem || ""} placeholder="Ex: BIFASICO 63A" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, visitaTecnica: { ...prev.visitaTecnica, amperagem: value } }))} width="100%" />
				<SelectInput label="TIPO DO PADRÃO" value={project.padrao.tipo || "NAO DEFINIDO"} selectedItemLabel="NAO DEFINIDO" options={padraoTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, tipo: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, tipo: "NAO DEFINIDO" } }))} width="100%" />
				<SelectInput label="TIPO DE ENTRADA" value={project.padrao.tipoEntrada || null} selectedItemLabel="NAO DEFINIDO" options={entradaTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, tipoEntrada: value as TProject["padrao"]["tipoEntrada"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, tipoEntrada: undefined } }))} width="100%" />
				<SelectInput label="TIPO DE SAIDA" value={project.visitaTecnica.saidaDoCliente || null} selectedItemLabel="NAO DEFINIDO" options={saidaTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, visitaTecnica: { ...prev.visitaTecnica, saidaDoCliente: value as TProject["visitaTecnica"]["saidaDoCliente"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, visitaTecnica: { ...prev.visitaTecnica, saidaDoCliente: undefined } }))} width="100%" />
			</FieldGrid>
			<div className="flex flex-wrap items-center gap-4">
				<CheckboxInput labelFalse="NECESSÁRIO AUMENTO DE CARGA" labelTrue="NECESSÁRIO AUMENTO DE CARGA" checked={!!project.padrao.aumentoCarga.aplicavel} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, aumentoCarga: { ...prev.padrao.aumentoCarga, aplicavel: value } } }))} />
				<CheckboxInput labelFalse="POSSUI CAIXA CONJUGADA" labelTrue="POSSUI CAIXA CONJUGADA" checked={project.padrao.caixaConjugada === "SIM"} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, caixaConjugada: value ? "SIM" : "NAO" } }))} />
			</div>
			{project.padrao.aumentoCarga.aplicavel ? (
				<FieldGrid>
					<SelectInput label="PAGAMENTO DO PADRÃO" value={project.padrao.respPagamento || null} selectedItemLabel="NAO DEFINIDO" options={paymentResp} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, respPagamento: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, respPagamento: null } }))} width="100%" />
					<SelectInput label="RESPONSÁVEL INSTALAÇÃO" value={project.padrao.respInstalacao || null} selectedItemLabel="NAO DEFINIDO" options={installResp} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, respInstalacao: value as TProject["padrao"]["respInstalacao"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, respInstalacao: null } }))} width="100%" />
					<NumberInput label="VALOR DO PADRÃO" value={project.padrao.valor || 0} placeholder="0,00" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, padrao: { ...prev.padrao, valor: value } }))} width="100%" />
				</FieldGrid>
			) : null}
		</StageSection>
	);
}
