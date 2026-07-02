"use client";

import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/utils/estados_cidades";
import { formatToCEP, formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import type { TProject } from "@/utils/schemas/projects";
import { allSellers, serviceTypes } from "@/utils/select-options";

import { FieldGrid, StageSection } from "./shared";

type StageProps = {
	project: TProject;
	updateProjectWith: (updater: (project: TProject) => TProject) => void;
};

const segmentOptions = [
	{ id: 1, label: "RESIDENCIAL", value: "RESIDENCIAL" },
	{ id: 2, label: "RURAL", value: "RURAL" },
	{ id: 3, label: "COMERCIAL", value: "COMERCIAL" },
	{ id: 4, label: "INDUSTRIAL", value: "INDUSTRIAL" },
	{ id: 5, label: "NAO DEFINIDO", value: "NAO DEFINIDO" },
];

const salesChannelOptions = [
	{ id: 1, label: "EVENTO", value: "EVENTO" },
	{ id: 2, label: "INDICAÇÃO DE AMIGO", value: "INDICAÇÃO DE AMIGO" },
	{ id: 3, label: "INSIDE SALES", value: "INSIDE SALES" },
	{ id: 4, label: "PASSIVO", value: "PASSIVO" },
	{ id: 5, label: "PORTA A PORTA", value: "PORTA A PORTA" },
	{ id: 6, label: "TELEVENDAS", value: "TELEVENDAS" },
	{ id: 7, label: "NETWORK", value: "NETWORK" },
	{ id: 8, label: "OUTRO", value: "OUTRO" },
	{ id: 9, label: "NÃO DEFINIDO", value: "NAO DEFINIDO" },
];

export function VendaStage({ project, updateProjectWith }: StageProps) {
	return (
		<div className="flex w-full flex-col gap-4">
			<StageSection title="Dados gerais">
				<FieldGrid>
					<TextInput label="NOME DO CONTRATO" value={project.nomeDoContrato || ""} placeholder="Nome do contrato" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, nomeDoContrato: value.toUpperCase() }))} width="100%" />
					<TextInput label="NOME DO PROJETO" value={project.nomeDoProjeto || ""} placeholder="Nome interno do projeto" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, nomeDoProjeto: value.toUpperCase() }))} width="100%" />
					<TextInput label="CÓDIGO CRM" value={project.codigoSVB?.toString() || ""} placeholder="Código CRM, se houver" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, codigoSVB: value.toUpperCase() }))} width="100%" />
					<TextInput label="CPF/CNPJ DO CONTRATO" value={project.cpf_cnpj?.toString() || ""} placeholder="CPF/CNPJ" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, cpf_cnpj: formatToCPForCNPJ(value) }))} width="100%" />
					<TextInput label="TELEFONE DO CONTRATO" value={project.telefone || ""} placeholder="Telefone" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, telefone: formatToPhone(value) }))} width="100%" />
					<TextInput label="EMAIL DO CONTRATO" value={project.email || ""} placeholder="Email" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, email: value }))} width="100%" />
					<SelectInput label="TIPO DE SERVIÇO" value={project.tipoDeServico} selectedItemLabel="NAO DEFINIDO" options={serviceTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, tipoDeServico: value }))} onReset={() => updateProjectWith((prev) => ({ ...prev, tipoDeServico: "NAO DEFINIDO" }))} width="100%" />
					<SelectInput label="SEGMENTO" value={project.segmento} selectedItemLabel="NAO DEFINIDO" options={segmentOptions} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, segmento: value as TProject["segmento"] }))} onReset={() => updateProjectWith((prev) => ({ ...prev, segmento: "NAO DEFINIDO" as TProject["segmento"] }))} width="100%" />
					<SelectInput label="CANAL DE VENDA" value={project.canalVenda} selectedItemLabel="NAO DEFINIDO" options={salesChannelOptions} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, canalVenda: value }))} onReset={() => updateProjectWith((prev) => ({ ...prev, canalVenda: "NAO DEFINIDO" }))} width="100%" />
				</FieldGrid>
			</StageSection>

			<StageSection title="Responsáveis">
				<FieldGrid cols={2}>
					<SelectInput
						label="VENDEDOR"
						value={project.vendedor.nome}
						selectedItemLabel="NAO DEFINIDO"
						options={allSellers.map((seller) => ({ id: seller.id ?? seller.value, label: seller.label, value: seller.value }))}
						handleChange={(value) => updateProjectWith((prev) => ({ ...prev, vendedor: { ...prev.vendedor, nome: value } }))}
						onReset={() => updateProjectWith((prev) => ({ ...prev, vendedor: { ...prev.vendedor, nome: "NAO DEFINIDO", idCRM: null, avatar: null } }))}
						width="100%"
					/>
					<SelectInput
						label="INSIDER"
						value={project.insider || "NAO DEFINIDO"}
						selectedItemLabel="NAO DEFINIDO"
						options={allSellers.map((seller) => ({ id: seller.id ?? seller.value, label: seller.label, value: seller.value }))}
						handleChange={(value) => updateProjectWith((prev) => ({ ...prev, insider: value }))}
						onReset={() => updateProjectWith((prev) => ({ ...prev, insider: "NAO DEFINIDO" }))}
						width="100%"
					/>
				</FieldGrid>
			</StageSection>

			<StageSection title="Endereço de execução">
				<FieldGrid>
					<TextInput label="CEP" value={project.cep?.toString() || ""} placeholder="CEP" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, cep: formatToCEP(value) }))} width="100%" />
					<SelectInput label="UF" value={project.uf} selectedItemLabel="NAO DEFINIDO" options={BrazilianStatesOptions} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, uf: value, cidade: "" }))} onReset={() => updateProjectWith((prev) => ({ ...prev, uf: "", cidade: "" }))} width="100%" />
					<SelectInput label="CIDADE" value={project.cidade} selectedItemLabel="NAO DEFINIDO" options={BrazilianCitiesOptionsFromUF(project.uf)} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, cidade: value }))} onReset={() => updateProjectWith((prev) => ({ ...prev, cidade: "" }))} width="100%" />
					<TextInput label="BAIRRO" value={project.bairro || ""} placeholder="Bairro" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, bairro: value }))} width="100%" />
					<TextInput label="LOGRADOURO" value={project.logradouro || ""} placeholder="Logradouro" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, logradouro: value }))} width="100%" />
					<TextInput label="NÚMERO" value={project.numeroResidencia?.toString() || ""} placeholder="Número" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, numeroResidencia: value }))} width="100%" />
					<TextInput label="LATITUDE" value={project.latitude || ""} placeholder="Latitude" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, latitude: value }))} width="100%" />
					<TextInput label="LONGITUDE" value={project.longitude || ""} placeholder="Longitude" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, longitude: value }))} width="100%" />
				</FieldGrid>
				<TextareaInput label="OBSERVAÇÕES COMERCIAIS" value={project.obsComercial || ""} placeholder="Observações relevantes sobre a venda" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, obsComercial: value }))} />
			</StageSection>
		</div>
	);
}
