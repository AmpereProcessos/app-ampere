"use client";

import { formatToMoney } from "@/utils/constants";

import type { TDirectProjectDraft } from "../types";
import { getContractTotal, validateFullDirectProject } from "../utils/validation";
import { FieldGrid, StageErrors, StageSection, SummaryItem } from "./shared";

type RevisaoStageProps = {
	draft: TDirectProjectDraft;
};

export function RevisaoStage({ draft }: RevisaoStageProps) {
	const project = draft.project;
	const validation = validateFullDirectProject(draft);
	const total = getContractTotal(project);

	return (
		<div className="flex w-full flex-col gap-4">
			<StageErrors errors={validation.errors} />
			<StageSection title="Resumo comercial">
				<FieldGrid>
					<SummaryItem label="Contrato" value={project.nomeDoContrato} />
					<SummaryItem label="Projeto" value={project.nomeDoProjeto || project.nomeDoContrato} />
					<SummaryItem label="Tipo de serviço" value={project.tipoDeServico} />
					<SummaryItem label="Vendedor" value={project.vendedor.nome} />
					<SummaryItem label="Insider" value={project.insider} />
					<SummaryItem label="Cliente CRM" value={draft.client.clientId ? "Vinculado" : "Não vinculado"} />
				</FieldGrid>
			</StageSection>

			<StageSection title="Local e sistema">
				<FieldGrid>
					<SummaryItem label="Cidade/UF" value={[project.cidade, project.uf].filter(Boolean).join(" / ")} />
					<SummaryItem label="Endereço" value={[project.logradouro, project.numeroResidencia, project.bairro].filter(Boolean).join(", ")} />
					<SummaryItem label="Potência pico" value={`${project.sistema.potPico || 0} kWp`} />
					<SummaryItem label="Módulos" value={project.sistema.qtdeModulos} />
					<SummaryItem label="Inversores" value={project.sistema.inversor} />
					<SummaryItem label="Topologia" value={project.sistema.topologia} />
				</FieldGrid>
			</StageSection>

			<StageSection title="Valores e pagamento">
				<FieldGrid>
					<SummaryItem label="Sistema" value={formatToMoney(project.sistema.valorProjeto || 0)} />
					<SummaryItem label="Padrão" value={formatToMoney(project.padrao.valor || 0)} />
					<SummaryItem label="Estrutura" value={formatToMoney(project.estruturaPersonalizada.valor || 0)} />
					<SummaryItem label="O&M" value={formatToMoney(project.oem.valor || 0)} />
					<SummaryItem label="Seguro" value={formatToMoney(project.seguro.valor || 0)} />
					<SummaryItem label="Total" value={formatToMoney(total)} />
					<SummaryItem label="Forma" value={project.pagamento.forma} />
					<SummaryItem label="Método" value={project.pagamento.metodo} />
					<SummaryItem label="Pagador" value={project.pagamento.pagador.nome} />
				</FieldGrid>
			</StageSection>
		</div>
	);
}
