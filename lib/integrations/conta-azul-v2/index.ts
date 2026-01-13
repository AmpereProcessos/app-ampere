import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TIntegration } from "@/utils/schemas/integrations";
import type { TProject } from "@/utils/schemas/projects";
import type { TRevenue } from "@/utils/schemas/revenues";
import { ContractRequestPaymentOptions } from "@/utils/select-options";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import dayjs from "dayjs";
import type { WithId } from "mongodb";
import { refreshContaAzulV2AccessToken } from "../conta-azul/tokens";
import {
	CreateCentroDeCustoV2InputSchema,
	CreateCentroDeCustoV2OutputSchema,
	CreateContaAzulClientV2InputSchema,
	CreateContaAzulClientV2OutputSchema,
	CreateContaAzulSaleV2OutputSchema,
	GetContaAzulNextSaleNumberV2OutputSchema,
	GetContaAzulSaleV2ByIdOutputSchema,
	SearchCentroDeCustoV2OutputSchema,
	SearchContaAzulClientV2ByCpfCnpjOutputSchema,
	type TCreateCentroDeCustoV2Input,
	type TCreateCentroDeCustoV2Output,
	type TCreateContaAzulClientV2Input,
	type TCreateContaAzulClientV2Output,
	type TCreateContaAzulSaleV2Input,
	type TGetContaAzulNextSaleNumberV2Output,
	type TGetContaAzulSaleV2ByIdInput,
	type TGetContaAzulSaleV2ByIdOutput,
	type TSearchCentroDeCustoV2Output,
	type TSearchContaAzulClientV2ByCpfCnpjOutput,
} from "./types";

const CONTA_AZUL_V2_BASE_URL = "https://api-v2.contaazul.com/";
const CONTA_AZUL_V2_DEFAULT_FINANCIAL_ACCOUNT_ID = "1c5e2e19-e173-4657-83a7-4c55bb34242a";
async function getContaAzulV2Token() {
	const db = await connectToDatabase();
	const integrationsCollection = db.collection<TIntegration>("integracoes");

	const integrationRecord = await integrationsCollection.findOne({ identificador: "CONTA_AZUL_V2" });

	if (!integrationRecord || integrationRecord.dados.tipo !== "CONTA_AZUL_V2") throw new Error("Integração Conta Azul V2 não encontrada.");

	const isExpired = dayjs().isAfter(dayjs(integrationRecord.dados.dataExpiracao));
	if (isExpired) {
		const newTokens = await refreshContaAzulV2AccessToken(integrationRecord.dados.tokenRefresh);
		await integrationsCollection.updateOne(
			{ identificador: "CONTA_AZUL_V2" },
			{
				$set: {
					dados: {
						...integrationRecord.dados,
						tokenAcesso: newTokens.access_token,
						tokenRefresh: newTokens.refresh_token,
						dataExpiracao: dayjs().add(newTokens.expires_in, "seconds").toISOString(),
					},
				},
			},
		);

		return newTokens.access_token;
	}

	return integrationRecord.dados.tokenAcesso;
}
export async function getContaAzulNextSaleNumberV2(): Promise<number> {
	const accessToken = await getContaAzulV2Token();

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda/proximo-numero`;
	const { data } = await axios.get<TGetContaAzulNextSaleNumberV2Output>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = GetContaAzulNextSaleNumberV2OutputSchema.parse(data);
	console.log("[INFO] [CONTA AZUL V2] Next sale number retrieved:", { numero: parsedData });
	return parsedData;
}

async function searchCentroDeCustoV2ByCodigo(codigo: string): Promise<string | null> {
	const accessToken = await getContaAzulV2Token();

	console.log("[INFO] [CONTA AZUL V2] Searching centro de custo by code.", { codigo });

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/centro-de-custo?codigos=${codigo}`;
	try {
		const { data } = await axios.get<TSearchCentroDeCustoV2Output>(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const parsedData = SearchCentroDeCustoV2OutputSchema.parse(data);
		const contaAzulCostCenterId = parsedData.items[0]?.id || null;
		console.log("[INFO] [CONTA AZUL V2] Centro de custo search result:", { contaAzulCostCenterId, totalItems: parsedData.totalItems });
		return contaAzulCostCenterId;
	} catch (error) {
		console.error("[ERROR] [CONTA AZUL V2] Error searching centro de custo:", {
			message: error instanceof Error ? error.message : String(error),
			codigo,
			isAxiosError: axios.isAxiosError(error),
			statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
			responseData: axios.isAxiosError(error) ? error.response?.data : undefined,
		});
		return null;
	}
}

async function createCentroDeCustoV2(codigo: string, nome: string): Promise<string> {
	const accessToken = await getContaAzulV2Token();

	console.log("[INFO] [CONTA AZUL V2] Creating new centro de custo.", { codigo, nome });

	const centroDeCustoData: TCreateCentroDeCustoV2Input = {
		codigo: codigo,
		nome: nome,
	};

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/centro-de-custo`;
	const { data } = await axios.post<TCreateCentroDeCustoV2Output>(url, centroDeCustoData, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = CreateCentroDeCustoV2OutputSchema.parse(data);
	console.log("[INFO] [CONTA AZUL V2] Centro de custo created successfully:", { id: parsedData.id, codigo: parsedData.codigo, nome: parsedData.nome });
	return parsedData.id;
}

async function getOrCreateCentroDeCustoV2(codigo: string, nome: string): Promise<string> {
	console.log("[INFO] [CONTA AZUL V2] Getting or creating centro de custo.", { codigo, nome });

	// Search by code
	const foundCentroDeCustoId = await searchCentroDeCustoV2ByCodigo(codigo);

	if (foundCentroDeCustoId) {
		console.log("[INFO] [CONTA AZUL V2] Centro de custo found by code.", { centroDeCustoId: foundCentroDeCustoId });
		return foundCentroDeCustoId;
	}

	// Create new centro de custo
	console.log("[INFO] [CONTA AZUL V2] Centro de custo not found, creating new one.");
	const newCentroDeCustoId = await createCentroDeCustoV2(codigo, nome);
	return newCentroDeCustoId;
}

async function searchContaAzulClientV2ByCpfCnpj(cpfCnpj: string): Promise<string | null> {
	const accessToken = await getContaAzulV2Token();
	const cpfCnpjWithoutMask = cpfCnpj.replace(/\D/g, "");

	console.log("[INFO] [CONTA AZUL V2] Searching client by CPF/CNPJ.", { cpfCnpj, cpfCnpjWithoutMask });

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/pessoas?documentos=${cpfCnpjWithoutMask}`;
	try {
		const { data } = await axios.get<TSearchContaAzulClientV2ByCpfCnpjOutput>(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		const parsedData = SearchContaAzulClientV2ByCpfCnpjOutputSchema.parse(data);
		const clientId = parsedData.items[0]?.id || null;
		console.log("[INFO] [CONTA AZUL V2] Client search result:", { clientId, totalItems: parsedData.totalItems });
		return clientId;
	} catch (error) {
		console.error("[ERROR] [CONTA AZUL V2] Error searching client:", {
			message: error instanceof Error ? error.message : String(error),
			cpfCnpj: cpfCnpjWithoutMask,
			isAxiosError: axios.isAxiosError(error),
			statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
			responseData: axios.isAxiosError(error) ? error.response?.data : undefined,
		});
		return null;
	}
}

async function createContaAzulClientV2(client: WithId<TClient>, projectName?: string): Promise<string> {
	const accessToken = await getContaAzulV2Token();

	if (!client.cpfCnpj) {
		throw new Error("Cliente não possui CPF/CNPJ para vincular ao cliente no Conta Azul.");
	}

	const cpfCnpjWithoutMask = client.cpfCnpj.replace(/\D/g, "");
	const personType = cpfCnpjWithoutMask.length > 14 ? "LEGAL" : "NATURAL";

	console.log("[INFO] [CONTA AZUL V2] Creating new client.", {
		clientId: client._id.toString(),
		clientName: client.nome,
		cpfCnpj: cpfCnpjWithoutMask,
		personType,
	});

	const clientData: TCreateContaAzulClientV2Input = {
		nome: projectName || client.nome,
		email: client.email || null,
		telefone: client.telefonePrimario || null,
		documento: cpfCnpjWithoutMask,
		tipo_pessoa: personType,
		cep: client.cep || null,
		logradouro: client.endereco || null,
		numero: client.numeroOuIdentificador && client.numeroOuIdentificador.length < 10 ? client.numeroOuIdentificador.substring(0, 10) : null,
		bairro: client.bairro || null,
	};

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/cliente`;
	const { data } = await axios.post<TCreateContaAzulClientV2Output>(url, clientData, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = CreateContaAzulClientV2OutputSchema.parse(data);
	console.log("[INFO] [CONTA AZUL V2] Client created successfully:", parsedData);
	return parsedData.id;
}

async function getOrCreateContaAzulClientV2(client: WithId<TClient>, projectName?: string): Promise<string> {
	// Check if client already has Conta Azul ID stored
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient & { idContaAzulCliente?: string }>("clients");
	const clientRecord = await clientsCollection.findOne({ _id: client._id });

	if (clientRecord?.idContaAzulCliente) {
		console.log("[INFO] [CONTA AZUL V2] Using existing Conta Azul client ID.", {
			clientId: client._id.toString(),
			contaAzulClientId: clientRecord.idContaAzulCliente,
		});
		return clientRecord.idContaAzulCliente;
	}

	// Search by CPF/CNPJ
	if (!client.cpfCnpj) {
		throw new Error("Cliente não possui CPF/CNPJ para vincular ao cliente no Conta Azul.");
	}

	const foundClientId = await searchContaAzulClientV2ByCpfCnpj(client.cpfCnpj);

	if (foundClientId) {
		console.log("[INFO] [CONTA AZUL V2] Client found via CPF/CNPJ, updating database.", {
			clientId: client._id.toString(),
			contaAzulClientId: foundClientId,
		});
		await clientsCollection.updateOne({ _id: client._id }, { $set: { idContaAzulCliente: foundClientId } });
		return foundClientId;
	}

	// Create new client
	console.log("[INFO] [CONTA AZUL V2] Client not found, creating new client.");
	const newClientId = await createContaAzulClientV2(client, projectName);
	await clientsCollection.updateOne({ _id: client._id }, { $set: { idContaAzulCliente: newClientId } });
	return newClientId;
}
type CreateContaAzulSaleV2Params = {
	client: {
		contaAzulId: string;
		name: string;
		phone: string;
		email?: string;
		cpfCnpj: string;
	};
	sale: {
		valueTotal: number;
		valueGeneral: number;
		valueEnergyPA: number;
		valuePersonalizedStructure: number;
		valueInsurance: number;
		valueOeM: number;
		paymentMethod: string;
		date: string;
	};
};
export async function createContaAzulSaleV2({ client, sale }: CreateContaAzulSaleV2Params) {
	const accessToken = await getContaAzulV2Token();
	const nextSaleNumber = await getContaAzulNextSaleNumberV2();

	const items: TCreateContaAzulSaleV2Input["itens"] = [];
	if (sale.valueGeneral > 0) {
		items.push({
			id: "75c53cc4-6149-4815-9b83-ccfbee581a42",
			quantidade: 1,
			valor: sale.valueGeneral,
			descricao: "VALOR PELO PROJETO (GERAL)",
		});
	}
	if (sale.valueEnergyPA > 0) {
		items.push({
			id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
			quantidade: 1,
			valor: sale.valueEnergyPA,
			descricao: "VALOR PELO PADRÃO DE ENERGIA",
		});
	}
	if (sale.valuePersonalizedStructure > 0) {
		items.push({
			id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
			quantidade: 1,
			valor: sale.valuePersonalizedStructure,
			descricao: "VALOR PELA ESTRUTURA PERSONALIZADA",
		});
	}
	if (sale.valueInsurance > 0) {
		items.push({
			id: "411a2168-851f-4a00-8ea9-a3ff8cf0779a",
			quantidade: 1,
			valor: sale.valueInsurance,
			descricao: "VALOR PELO SEGURO",
		});
	}
	if (sale.valueOeM > 0) {
		items.push({
			id: "163fbd0f-d537-4af3-9d9f-c7bf63debcbd",
			quantidade: 1,
			valor: sale.valueOeM,
			descricao: "VALOR PELO O&M",
		});
	}
	const paymentMethodConfig = ContractRequestPaymentOptions.find((s) => s.value === sale.paymentMethod);
	const newContaAzulSale: TCreateContaAzulSaleV2Input = {
		id_cliente: client.contaAzulId,
		numero: nextSaleNumber,
		situacao: "APROVADO",
		data_venda: dayjs(sale.date).format("YYYY-MM-DD"),
		itens: items,
		composicao_de_valor: {
			frete: 0,
			desconto: {
				tipo: "VALOR",
				valor: 0,
			},
		},

		condicao_pagamento: {
			id_conta_financeira: CONTA_AZUL_V2_DEFAULT_FINANCIAL_ACCOUNT_ID,
			tipo_pagamento: "DINHEIRO",
			opcao_condicao_pagamento: "À vista",
			parcelas: paymentMethodConfig
				? paymentMethodConfig.fractionnements?.map((p, index) => ({
						valor: (p.percentage * sale.valueTotal) / 100,
						data_vencimento: dayjs(sale.date)
							.add((index + 1) * 30, "day")
							.format("YYYY-MM-DD"),
					})) || []
				: [],
		},
		observacoes: `
        DADOS DO CLIENTE:
        Nome: ${client.name}
        CPF/CNPJ: ${client.cpfCnpj}
        Telefone: ${client.phone}
        Email: ${client.email}
        `,
		observacoes_pagamento: `
        MÉTODO DE PAGAMENTO: ${sale.paymentMethod}
        `,
	};

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda`;
	const response = await axios.post(url, newContaAzulSale, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = CreateContaAzulSaleV2OutputSchema.parse(response.data);
	return parsedData;
}

export async function getContaAzulSaleV2ById({ id }: TGetContaAzulSaleV2ByIdInput): Promise<TGetContaAzulSaleV2ByIdOutput> {
	const accessToken = await getContaAzulV2Token();

	const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda/${id}`;
	const { data } = await axios.get<TGetContaAzulSaleV2ByIdOutput>(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const parsedData = GetContaAzulSaleV2ByIdOutputSchema.parse(data);
	return parsedData;
}

export async function createSaleFromRevenueV2({
	revenue,
	client,
	project,
}: {
	revenue: TRevenue;
	client: WithId<TClient>;
	project: WithId<TProject>;
}): Promise<{ contaAzulSaleId: string; contaAzulClientId: string; contaAzulFinancialEventId: string | null; contaAzulCostCenterId: string }> {
	try {
		console.log("[INFO] [CONTA AZUL V2] Starting sale creation from revenue.", {
			revenueTitle: revenue.nome,
			revenueType: revenue.tipo,
			revenueTotal: revenue.total,
			clientId: client._id.toString(),
			clientCpfCnpj: client.cpfCnpj,
			projectId: project._id.toString(),
		});

		// Get or create client ID
		const contaAzulClientId = await getOrCreateContaAzulClientV2(client, project.nomeDoContrato || undefined);

		// Get or create centro de custo
		const nomeContrato = project.nomeDoContrato || "PROJETO NÃO DEFINIDO";
		const contaAzulCostCenterId = await getOrCreateCentroDeCustoV2(project.qtde.toString(), nomeContrato);

		// Map project values to sale items
		const items: TCreateContaAzulSaleV2Input["itens"] = [];

		// valueGeneral: project.sistema.valorProjeto
		if (project.sistema?.valorProjeto && project.sistema.valorProjeto > 0) {
			items.push({
				id: "75c53cc4-6149-4815-9b83-ccfbee581a42",
				quantidade: 1,
				valor: project.sistema.valorProjeto,
				descricao: "VALOR PELO PROJETO (GERAL)",
			});
		}

		// valueEnergyPA: project.padrao.valor
		if (project.padrao?.valor && project.padrao.valor > 0) {
			items.push({
				id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
				quantidade: 1,
				valor: project.padrao.valor,
				descricao: "VALOR PELO PADRÃO DE ENERGIA",
			});
		}

		// valuePersonalizedStructure: project.estruturaPersonalizada.valor
		if (project.estruturaPersonalizada?.valor && project.estruturaPersonalizada.valor > 0) {
			items.push({
				id: "88561cc0-9e97-4b9b-b45a-8038bcec906e",
				quantidade: 1,
				valor: project.estruturaPersonalizada?.valor,
				descricao: "VALOR PELA ESTRUTURA PERSONALIZADA",
			});
		}

		// valueInsurance: project.seguro.valor
		if (project.seguro?.valor && project.seguro.valor > 0) {
			items.push({
				id: "411a2168-851f-4a00-8ea9-a3ff8cf0779a",
				quantidade: 1,
				valor: project.seguro?.valor,
				descricao: "VALOR PELO SEGURO",
			});
		}

		// valueOeM: project.oem.valor
		if (project.oem?.valor && project.oem.valor > 0) {
			items.push({
				id: "163fbd0f-d537-4af3-9d9f-c7bf63debcbd",
				quantidade: 1,
				valor: project.oem?.valor,
				descricao: "VALOR PELO O&M",
			});
		}

		if (items.length === 0) {
			throw new Error("Nenhum item de venda encontrado no projeto.");
		}

		// Map payment from revenue.fracionamento
		const parcelas = revenue.fracionamento.map((fracionamento) => {
			const valor = fracionamento.valor || (fracionamento.porcentagem * revenue.total) / 100;
			const dataVencimento = fracionamento.dataRecebimento || fracionamento.dataPrevisaoRecebimento;
			if (!dataVencimento) {
				throw new Error(`Data de vencimento não informada para a parcela: ${fracionamento.titulo}`);
			}
			return {
				valor,
				data_vencimento: dayjs(dataVencimento).format("YYYY-MM-DD"),
				descricao: fracionamento.titulo || null,
			};
		});

		// Determine opcao_condicao_pagamento
		let opcaoCondicaoPagamento:
			| "À vista"
			| "30,60,90"
			| "15,30,45"
			| "1x"
			| "2x"
			| "3x"
			| "4x"
			| "5x"
			| "6x"
			| "7x"
			| "8x"
			| "9x"
			| "10x"
			| "11x"
			| "12x" = "À vista";
		if (parcelas.length > 1) {
			if (parcelas.length === 2) {
				opcaoCondicaoPagamento = "2x";
			} else if (parcelas.length === 3) {
				opcaoCondicaoPagamento = "3x";
			} else if (parcelas.length === 4) {
				opcaoCondicaoPagamento = "4x";
			} else if (parcelas.length === 5) {
				opcaoCondicaoPagamento = "5x";
			} else if (parcelas.length === 6) {
				opcaoCondicaoPagamento = "6x";
			} else if (parcelas.length === 7) {
				opcaoCondicaoPagamento = "7x";
			} else if (parcelas.length === 8) {
				opcaoCondicaoPagamento = "8x";
			} else if (parcelas.length === 9) {
				opcaoCondicaoPagamento = "9x";
			} else if (parcelas.length === 10) {
				opcaoCondicaoPagamento = "10x";
			} else if (parcelas.length === 11) {
				opcaoCondicaoPagamento = "11x";
			} else if (parcelas.length >= 12) {
				opcaoCondicaoPagamento = "12x";
			}
		}

		// Create sale using existing createContaAzulSaleV2 function structure
		const accessToken = await getContaAzulV2Token();
		const nextSaleNumber = await getContaAzulNextSaleNumberV2();

		const newContaAzulSale: TCreateContaAzulSaleV2Input = {
			id_cliente: contaAzulClientId,
			id_centro_custo: contaAzulCostCenterId,
			numero: nextSaleNumber,
			situacao: "APROVADO",
			data_venda: revenue.efetivacao.data ? dayjs(revenue.efetivacao.data).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
			itens: items,
			composicao_de_valor: {
				frete: 0,
				desconto: {
					tipo: "VALOR",
					valor: 0,
				},
			},
			condicao_pagamento: {
				tipo_pagamento: "DINHEIRO",
				opcao_condicao_pagamento: opcaoCondicaoPagamento,
				parcelas: parcelas,
			},
			observacoes: `
        DADOS DO CLIENTE:
        Nome: ${client.nome}
        CPF/CNPJ: ${client.cpfCnpj || "Não informado"}
        Telefone: ${client.telefonePrimario}
        Email: ${client.email || "Não informado"}
        
        DADOS DO PROJETO:
        Nome: ${project.nomeDoContrato || "Não informado"}
        Tipo de Serviço: ${revenue.tipo}
        `,
			observacoes_pagamento: `
        MÉTODO DE PAGAMENTO: ${revenue.metodo}
        `,
		};

		console.log("[INFO] [CONTA AZUL V2] Sale to create:", {
			numero: newContaAzulSale.numero,
			itemsCount: newContaAzulSale.itens.length,
			parcelasCount: newContaAzulSale.condicao_pagamento.parcelas.length,
		});

		const url = `${CONTA_AZUL_V2_BASE_URL}/v1/venda`;
		const response = await axios.post(url, newContaAzulSale, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		try {
			console.log("[INFO] [CONTA AZUL V2] Sale created successfully");
			const parsedData = CreateContaAzulSaleV2OutputSchema.parse(response.data);
			const contaAzulSaleId = parsedData.id;
			if (!contaAzulSaleId) {
				throw new Error("Ocorreu um erro ao criar a venda no Conta Azul.");
			}
			const contaAzulSaleComplete = await getContaAzulSaleV2ById({ id: contaAzulSaleId });
			console.log("[INFO] [CONTA AZUL V2] Sale by ID received:", contaAzulSaleComplete);
			if (!contaAzulSaleComplete) {
				throw new Error("Ocorreu um erro ao buscar a venda no Conta Azul.");
			}
			const contaAzulFinancialEventId = contaAzulSaleComplete.evento_financeiro?.id ?? null;

			console.log("[INFO] [CONTA AZUL V2] Sale created successfully with:", {
				contaAzulSaleId,
				contaAzulClientId,
				contaAzulFinancialEventId,
			});

			return { contaAzulSaleId, contaAzulClientId, contaAzulFinancialEventId, contaAzulCostCenterId };
		} catch (error) {
			console.error("[ERROR] [CONTA AZUL V2] Error parsing sale data output:", {
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
				isAxiosError: axios.isAxiosError(error),
				statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
				responseData: axios.isAxiosError(error) ? error.response?.data : undefined,
			});
			throw new Error("Oops, houve um erro na criação da venda no Conta Azul.");
		}
	} catch (error) {
		console.error("[ERROR] [CONTA AZUL V2] Error creating sale:", {
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : undefined,
			isAxiosError: axios.isAxiosError(error),
			statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
			responseData: axios.isAxiosError(error) ? error.response?.data : undefined,
			clientId: client._id.toString(),
			projectId: project._id.toString(),
			revenueTitle: revenue.nome,
		});
		throw error;
	}
}
