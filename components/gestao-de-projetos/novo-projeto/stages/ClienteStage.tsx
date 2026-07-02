"use client";

import { useMemo, useState } from "react";
import { Link, Search, UserCheck } from "lucide-react";

import TextInput from "@/components/inputs/Text";
import { Button } from "@/components/ui/button";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/utils/estados_cidades";
import { formatToCEP, formatToCPForCNPJ, formatToPhone } from "@/utils/methods/formatting";
import { useClientsSearch } from "@/utils/methods/query/crm/clients";
import type { TSimilarClientSimplifiedDTO } from "@/utils/schemas/crm/client.schema";
import SelectInput from "@/components/inputs/Select";

import type { TDirectProjectDraft } from "../types";
import { mapClientToClientDraft } from "../utils/project-mappers";
import { FieldGrid, StageSection } from "./shared";

type ClienteStageProps = {
	draft: TDirectProjectDraft;
	updateClient: (client: Partial<TDirectProjectDraft["client"]>) => void;
	updateClientData: (clientData: Partial<TDirectProjectDraft["client"]["clientData"]>) => void;
};

type ClientMode = "new" | "existing";

export function ClienteStage({ draft, updateClient, updateClientData }: ClienteStageProps) {
	const [mode, setMode] = useState<ClientMode>("existing");
	const clientData = draft.client.clientData;
	const { data, filters, updateFilters, isFetching } = useClientsSearch({ initialFilters: { page: 1, search: "", onlyValidPhones: false } });
	const clients = data?.clients || [];
	const visibleClients = useMemo(() => clients.slice(0, mode === "existing" ? 12 : 4), [clients, mode]);

	function updateSearchByVinculation(value: string) {
		updateFilters({ search: value, page: 1 });
	}

	function selectClient(client: TSimilarClientSimplifiedDTO) {
		updateClient(mapClientToClientDraft(client));
		setMode("existing");
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full flex-col gap-2 rounded-md border border-primary/10 bg-primary/[0.02] p-2 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-wrap gap-2">
					<Button type="button" size="sm" variant={mode === "new" ? "default" : "outline"} onClick={() => setMode("new")}>
						NOVO CLIENTE
					</Button>
					<Button type="button" size="sm" variant={mode === "existing" ? "default" : "outline"} onClick={() => setMode("existing")}>
						CLIENTES EXISTENTES
					</Button>
				</div>
				<div className="flex items-center gap-2 text-xs font-medium text-primary/70">
					<Search className="h-4 w-4" />
					{isFetching ? "Buscando no CRM..." : `${clients.length} cliente(s) encontrado(s)`}
				</div>
			</div>

			{mode === "existing" ? (
				<StageSection title="Clientes existentes">
					<ClientSearchField filtersSearch={filters.search || ""} updateSearch={updateSearchByVinculation} />
					<ClientResults clients={visibleClients} selectedClientId={draft.client.clientId} selectClient={selectClient} emptyLabel={filters.search ? "Nenhum cliente encontrado para o filtro." : "Pesquise por nome, CPF/CNPJ, telefone ou email."} />
				</StageSection>
			) : (
				<>
					<StageSection title="Novo cliente">
						<FieldGrid>
							<TextInput label="NOME" value={clientData.nome} placeholder="Nome ou razão social" handleChange={(value) => updateClientData({ nome: value })} width="100%" />
							<TextInput
								label="CPF/CNPJ"
								value={clientData.cpfCnpj}
								placeholder="CPF ou CNPJ"
								handleChange={(value) => {
									const formatted = formatToCPForCNPJ(value);
									updateClientData({ cpfCnpj: formatted });
									updateSearchByVinculation(formatted);
								}}
								width="100%"
							/>
							<TextInput
								label="TELEFONE"
								value={clientData.telefonePrimario}
								placeholder="Telefone principal"
								handleChange={(value) => {
									const formatted = formatToPhone(value);
									updateClientData({ telefonePrimario: formatted });
									updateSearchByVinculation(formatted);
								}}
								width="100%"
							/>
							<TextInput label="EMAIL" value={clientData.email} placeholder="Email" handleChange={(value) => updateClientData({ email: value })} width="100%" />
							<TextInput label="CEP" value={clientData.cep} placeholder="CEP" handleChange={(value) => updateClientData({ cep: formatToCEP(value) })} width="100%" />
							<SelectInput label="UF" value={clientData.uf} selectedItemLabel="NAO DEFINIDO" options={BrazilianStatesOptions} handleChange={(value) => updateClientData({ uf: value, cidade: "" })} onReset={() => updateClientData({ uf: "", cidade: "" })} width="100%" />
							<SelectInput label="CIDADE" value={clientData.cidade} selectedItemLabel="NAO DEFINIDO" options={BrazilianCitiesOptionsFromUF(clientData.uf)} handleChange={(value) => updateClientData({ cidade: value })} onReset={() => updateClientData({ cidade: "" })} width="100%" />
							<TextInput label="BAIRRO" value={clientData.bairro} placeholder="Bairro" handleChange={(value) => updateClientData({ bairro: value })} width="100%" />
							<TextInput label="LOGRADOURO" value={clientData.endereco} placeholder="Rua, avenida, estrada..." handleChange={(value) => updateClientData({ endereco: value })} width="100%" />
							<TextInput label="NÚMERO" value={clientData.numeroOuIdentificador} placeholder="Número ou identificador" handleChange={(value) => updateClientData({ numeroOuIdentificador: value })} width="100%" />
							<TextInput label="COMPLEMENTO" value={clientData.complemento} placeholder="Complemento" handleChange={(value) => updateClientData({ complemento: value })} width="100%" />
						</FieldGrid>
						{draft.client.clientId ? (
							<div className="flex justify-end">
								<Button type="button" variant="ghost" size="sm" onClick={() => updateClient({ clientId: null, selectedClient: null })}>
									Remover vínculo CRM
								</Button>
							</div>
						) : null}
					</StageSection>

					<StageSection title="Possíveis clientes existentes">
						<ClientResults clients={visibleClients} selectedClientId={draft.client.clientId} selectClient={selectClient} emptyLabel="Digite CPF/CNPJ ou telefone para consultar possíveis vínculos no CRM." />
					</StageSection>
				</>
			)}
		</div>
	);
}

type ClientSearchFieldProps = {
	filtersSearch: string;
	updateSearch: (value: string) => void;
};

function ClientSearchField({ filtersSearch, updateSearch }: ClientSearchFieldProps) {
	return <TextInput label="BUSCAR CLIENTE" value={filtersSearch} placeholder="Nome, CPF/CNPJ, telefone ou email" handleChange={updateSearch} width="100%" />;
}

type ClientResultsProps = {
	clients: TSimilarClientSimplifiedDTO[];
	selectedClientId: string | null;
	selectClient: (client: TSimilarClientSimplifiedDTO) => void;
	emptyLabel: string;
};

function ClientResults({ clients, selectedClientId, selectClient, emptyLabel }: ClientResultsProps) {
	if (clients.length === 0) return <p className="rounded-md border border-dashed border-primary/15 p-4 text-center text-sm text-primary/60">{emptyLabel}</p>;

	return (
		<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
			{clients.map((client) => {
				const selected = selectedClientId === client._id;
				return (
					<button key={client._id} type="button" onClick={() => selectClient(client)} className="flex w-full flex-col gap-1 rounded-md border border-primary/15 p-3 text-left transition hover:border-primary/50">
						<div className="flex items-center gap-2">
							{selected ? <UserCheck className="h-4 w-4 text-green-600" /> : <Link className="h-4 w-4 text-primary/50" />}
							<span className="text-sm font-bold">{client.nome}</span>
						</div>
						<span className="text-xs text-primary/70">{[client.cpfCnpj, client.telefonePrimario, client.email].filter(Boolean).join(" | ")}</span>
						<span className="text-xs text-primary/50">{[client.cidade, client.uf].filter(Boolean).join(" / ")}</span>
					</button>
				);
			})}
		</div>
	);
}
