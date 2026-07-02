"use client";

import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/utils/estados_cidades";
import { formatToCEP, formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import type { TProject } from "@/utils/schemas/projects";
import { billableCompanies, ContractRequestPaymentOptions } from "@/utils/select-options";

import { FieldGrid, StageSection } from "./shared";

type StageProps = {
	project: TProject;
	updateProjectWith: (updater: (project: TProject) => TProject) => void;
};

const paymentForms = [
	{ id: 1, label: "CAPITAL PRÓPRIO", value: "CAPITAL PRÓPRIO" },
	{ id: 2, label: "FINANCIAMENTO", value: "FINANCIAMENTO" },
];

export function PagamentoStage({ project, updateProjectWith }: StageProps) {
	return (
		<div className="flex w-full flex-col gap-4">
			<StageSection title="Detalhes do pagamento">
				<FieldGrid cols={2}>
					<SelectInput label="FORMA DE PAGAMENTO" value={project.pagamento.forma || null} selectedItemLabel="NAO DEFINIDO" options={paymentForms} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, forma: value as TProject["pagamento"]["forma"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, forma: null } }))} width="100%" />
					<SelectInput label="MÉTODO DE PAGAMENTO" value={project.pagamento.metodo || null} selectedItemLabel="NAO DEFINIDO" options={ContractRequestPaymentOptions} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, metodo: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, metodo: "NAO DEFINIDO" } }))} width="100%" />
				</FieldGrid>
				{project.pagamento.forma === "FINANCIAMENTO" ? (
					<FieldGrid>
						<TextInput label="CREDOR" value={project.pagamento.credor || ""} placeholder="Banco/credor" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, credor: value } }))} width="100%" />
						<TextInput label="NOME DO GERENTE" value={project.pagamento.credorNomeGerente || ""} placeholder="Gerente" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, credorNomeGerente: value } }))} width="100%" />
						<TextInput label="CONTATO DO GERENTE" value={project.pagamento.credorContatoGerente || ""} placeholder="Contato" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, credorContatoGerente: formatToPhone(value) } }))} width="100%" />
					</FieldGrid>
				) : null}
				<TextareaInput label="DESCRIÇÃO DA NEGOCIAÇÃO" value={project.pagamento.negociacao || ""} placeholder="Descreva combinados e condições da negociação" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, negociacao: value } }))} />
			</StageSection>

			<StageSection title="Pagador">
				<FieldGrid>
					<TextInput label="NOME DO PAGADOR" value={project.pagamento.pagador.nome || ""} placeholder="Nome" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, nome: value } } }))} width="100%" />
					<TextInput label="CPF/CNPJ DO PAGADOR" value={project.pagamento.pagador.cpfCnpj || ""} placeholder="CPF/CNPJ" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, cpf_cnpjPagador: formatToCPForCNPJ(value), pagador: { ...prev.pagamento.pagador, cpfCnpj: formatToCPForCNPJ(value) } } }))} width="100%" />
					<TextInput label="TELEFONE DO PAGADOR" value={project.pagamento.pagador.telefone || ""} placeholder="Telefone" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, contatoPagador: formatToPhone(value), pagador: { ...prev.pagamento.pagador, telefone: formatToPhone(value) } } }))} width="100%" />
					<TextInput label="EMAIL DO PAGADOR" value={project.pagamento.pagador.email || ""} placeholder="Email" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, email: value } } }))} width="100%" />
					<TextInput label="CEP DO PAGADOR" value={project.pagamento.pagador.localizacao.cep || ""} placeholder="CEP" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, cep: formatToCEP(value) } } } }))} width="100%" />
					<SelectInput label="UF DO PAGADOR" value={project.pagamento.pagador.localizacao.uf || ""} selectedItemLabel="NAO DEFINIDO" options={BrazilianStatesOptions} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, uf: value, cidade: "" } } } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, uf: "", cidade: "" } } } }))} width="100%" />
					<SelectInput label="CIDADE DO PAGADOR" value={project.pagamento.pagador.localizacao.cidade || ""} selectedItemLabel="NAO DEFINIDO" options={BrazilianCitiesOptionsFromUF(project.pagamento.pagador.localizacao.uf || "")} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, cidade: value } } } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, cidade: "" } } } }))} width="100%" />
					<TextInput label="ENDEREÇO DO PAGADOR" value={project.pagamento.pagador.localizacao.endereco || ""} placeholder="Endereço" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, endereco: value } } } }))} width="100%" />
					<TextInput label="NÚMERO DO PAGADOR" value={project.pagamento.pagador.localizacao.numeroOuIdentificador || ""} placeholder="Número" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, pagamento: { ...prev.pagamento, pagador: { ...prev.pagamento.pagador, localizacao: { ...prev.pagamento.pagador.localizacao, numeroOuIdentificador: value } } } }))} width="100%" />
				</FieldGrid>
			</StageSection>

			<StageSection title="Faturamento e adicionais">
				<FieldGrid cols={2}>
					<SelectInput label="EMPRESA A FATURAR" value={project.faturamento.empresaFaturamento || null} selectedItemLabel="NAO DEFINIDO" options={billableCompanies} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, empresaFaturamento: value as TProject["faturamento"]["empresaFaturamento"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, empresaFaturamento: null } }))} width="100%" />
					<TextInput label="CNPJ PARA FATURAMENTO" value={project.faturamento.cnpjFaturamento?.toString() || ""} placeholder="CNPJ" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, cnpjFaturamento: formatToCPForCNPJ(value) } }))} width="100%" />
				</FieldGrid>
				<div className="flex flex-wrap items-center gap-3">
					<CheckboxInput labelFalse="NECESSÁRIO NF ADIANTADA" labelTrue="NECESSÁRIO NF ADIANTADA" checked={!!project.faturamento.necessarioNotaFiscalAdiantada} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, necessarioNotaFiscalAdiantada: value } }))} />
					<CheckboxInput labelFalse="NECESSÁRIO INSCRIÇÃO RURAL" labelTrue="NECESSÁRIO INSCRIÇÃO RURAL" checked={!!project.faturamento.necessarioInscricaoRural} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, necessarioInscricaoRural: value } }))} />
					<CheckboxInput labelFalse="NECESSÁRIO CÓDIGO FINAME" labelTrue="NECESSÁRIO CÓDIGO FINAME" checked={!!project.faturamento.necessarioCodigoFiname} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, faturamento: { ...prev.faturamento, necessarioCodigoFiname: value } }))} />
				</div>
				<FieldGrid cols={2}>
					<NumberInput label="VALOR OEM" value={project.oem.valor || 0} placeholder="0,00" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, oem: { ...prev.oem, valor: value, aplicavel: value > 0 } }))} width="100%" />
					<NumberInput label="VALOR SEGURO" value={project.seguro.valor || 0} placeholder="0,00" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, seguro: { ...prev.seguro, valor: value, aplicavel: value > 0 } }))} width="100%" />
				</FieldGrid>
			</StageSection>
		</div>
	);
}
