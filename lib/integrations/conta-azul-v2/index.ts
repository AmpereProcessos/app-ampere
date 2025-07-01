import axios from "axios";
import { z } from "zod";

const ContaAzulClientsSearchOutputSchema = z.object({
	itens_totais: z.number({
		required_error: "Itens totais é obrigatório",
		invalid_type_error: "Itens totais deve ser um número",
	}),
	itens: z.array(
		z.object({
			uuid: z.string({
				required_error: "UUID é obrigatório",
				invalid_type_error: "UUID deve ser uma string",
			}),
			nome: z.string({
				required_error: "Nome é obrigatório",
				invalid_type_error: "Nome deve ser uma string",
			}),
			email: z
				.string({
					invalid_type_error: "Email deve ser uma string",
				})
				.optional()
				.nullable(),
			telefone: z
				.string({
					required_error: "Telefone é obrigatório",
					invalid_type_error: "Telefone deve ser uma string",
				})
				.optional()
				.nullable(),
			uuid_legado: z
				.string({
					required_error: "UUID legado é obrigatório",
					invalid_type_error: "UUID legado deve ser uma string",
				})
				.optional()
				.nullable(),
		}),
	),
});
type GetClientByCPFCNPJParams = {
	cpfCnpj: string;
	accessToken: string;
};
export async function getContaAzulClientByCPFCNPJ({ cpfCnpj, accessToken }: GetClientByCPFCNPJParams) {
	const clientsEndpointBaseUrl = "https://api-v2.contaazul.com/v1/pessoa";

	// Formatted CPFCNPJ without "." and "-" and any kind of special character
	const formattedCpfCnpj = cpfCnpj.replace(/\./g, "").replace(/-/g, "").replace(/\s/g, "");

	const searchUrl = `${clientsEndpointBaseUrl}?termo_busca=${formattedCpfCnpj}`;
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};

	let responseData: unknown;
	try {
		const { data } = await axios.get(searchUrl, { headers });
		responseData = data;
	} catch (error) {
		console.log("[ERROR] [getContaAzulClientByCPFCNPJ] Error fetching clients", searchUrl);
		throw error;
	}
	const parsedData = ContaAzulClientsSearchOutputSchema.parse(responseData);

	const client = parsedData.itens[0];
	if (!client) throw new Error("Cliente não encontrado");

	return client;
}

const ContaAzulClientCreationInputSchema = z.object({
	ativo: z.boolean({
		required_error: "Ativo é obrigatório",
		invalid_type_error: "Ativo deve ser um booleano",
	}),
	nome: z.string({
		required_error: "Nome é obrigatório",
		invalid_type_error: "Nome deve ser uma string",
	}),
	documento: z.string({
		required_error: "Documento é obrigatório",
		invalid_type_error: "Documento deve ser uma string",
	}),
	email: z
		.string({
			required_error: "Email é obrigatório",
			invalid_type_error: "Email deve ser uma string",
		})
		.optional()
		.nullable(),
	telefone: z.string({
		required_error: "Telefone é obrigatório",
		invalid_type_error: "Telefone deve ser uma string",
	}),
	perfis: z.array(z.enum(["Cliente"])),
	tipo_pessoa: z.enum(["FISICA", "JURIDICA", "ESTRANGEIRA"]),
});
const ContaAzulClientCreationOutputSchema = z.object({
	uuid: z.string({
		required_error: "UUID é obrigatório",
		invalid_type_error: "UUID deve ser uma string",
	}),
});
type CreateContaAzulClientParams = {
	client: z.infer<typeof ContaAzulClientCreationInputSchema>;
	accessToken: string;
};
export async function createContaAzulClient({ client, accessToken }: CreateContaAzulClientParams) {
	const clientsEndpointBaseUrl = "https://api-v2.contaazul.com/v1/pessoa";

	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	let responseData: unknown;
	try {
		const { data } = await axios.post(clientsEndpointBaseUrl, client, { headers });
		responseData = data;
	} catch (error) {
		console.log("[ERROR] [createContaAzulClient] Error creating client", clientsEndpointBaseUrl);
		throw error;
	}
	const parsedData = ContaAzulClientCreationOutputSchema.parse(responseData);

	return {
		insertedId: parsedData.uuid,
	};
}

const ContaAzulSaleItemSchema = z.object({
	descricao: z
		.string({
			invalid_type_error: "Descrição deve ser uma string",
		})
		.optional(),
	quantidade: z.number({
		required_error: "Quantidade é obrigatória",
		invalid_type_error: "Quantidade deve ser um número",
	}),
	valor: z.number({
		required_error: "Valor é obrigatório",
		invalid_type_error: "Valor deve ser um número",
	}),
	id: z.string({
		required_error: "ID é obrigatório",
		invalid_type_error: "ID deve ser uma string",
	}),
	valor_custo: z
		.number({
			invalid_type_error: "Valor custo deve ser um número",
		})
		.optional(),
});

const ContaAzulSaleDiscountSchema = z.object({
	tipo: z.enum(["PORCENTAGEM", "VALOR"], {
		required_error: "Tipo é obrigatório",
		invalid_type_error: "Tipo deve ser uma string",
	}),
	valor: z.number({
		required_error: "Valor é obrigatório",
		invalid_type_error: "Valor deve ser um número",
	}),
});

const ContaAzulSaleValueCompositionSchema = z.object({
	frete: z
		.number({
			invalid_type_error: "Frete deve ser um número",
		})
		.optional(),
	desconto: ContaAzulSaleDiscountSchema.optional(),
});

const ContaAzulSalePaymentInstallmentSchema = z.object({
	data_vencimento: z.string({
		required_error: "Data de vencimento é obrigatória",
		invalid_type_error: "Data de vencimento deve ser uma string",
	}),
	valor: z.number({
		required_error: "Valor é obrigatório",
		invalid_type_error: "Valor deve ser um número",
	}),
	descricao: z
		.string({
			invalid_type_error: "Descrição deve ser uma string",
		})
		.optional(),
});

const ContaAzulSalePaymentConditionSchema = z.object({
	tipo_pagamento: z
		.enum(
			[
				"BOLETO_BANCARIO",
				"CARTAO_CREDITO",
				"CARTAO_DEBITO",
				"CARTEIRA_DIGITAL",
				"CASHBACK",
				"CHEQUE",
				"CREDITO_LOJA",
				"CREDITO_VIRTUAL",
				"DEPOSITO_BANCARIO",
				"DINHEIRO",
				"OUTRO",
				"DEBITO_AUTOMATICO",
				"CARTAO_CREDITO_VIA_LINK",
				"PIX_PAGAMENTO_INSTANTANEO",
				"PIX_COBRANCA",
				"PROGRAMA_FIDELIDADE",
				"SEM_PAGAMENTO",
				"TRANSFERENCIA_BANCARIA",
				"VALE_ALIMENTACAO",
				"VALE_COMBUSTIVEL",
				"VALE_PRESENTE",
				"VALE_REFEICAO",
			],
			{
				invalid_type_error: "Tipo de pagamento deve ser uma string",
			},
		)
		.optional(),
	id_conta_financeira: z
		.string({
			invalid_type_error: "ID da conta financeira deve ser uma string",
		})
		.optional(),
	opcao_condicao_pagamento: z.string({
		required_error: "Opção de condição de pagamento é obrigatória",
		invalid_type_error: "Opção de condição de pagamento deve ser uma string",
	}),
	nsu: z
		.string({
			invalid_type_error: "NSU deve ser uma string",
		})
		.optional(),
	parcelas: z.array(ContaAzulSalePaymentInstallmentSchema, {
		required_error: "Parcelas são obrigatórias",
	}),
});

const ContaAzulSaleCreationInputSchema = z.object({
	id_cliente: z.string({
		required_error: "ID do cliente é obrigatório",
		invalid_type_error: "ID do cliente deve ser uma string",
	}),
	numero: z.number({
		required_error: "Número é obrigatório",
		invalid_type_error: "Número deve ser um número",
	}),
	situacao: z.enum(["EM_ANDAMENTO", "APROVADO", "FATURADO"], {
		required_error: "Situação é obrigatória",
		invalid_type_error: "Situação deve ser uma string",
	}),
	data_venda: z.string({
		required_error: "Data de venda é obrigatória",
		invalid_type_error: "Data de venda deve ser uma string",
	}),
	id_categoria: z
		.string({
			invalid_type_error: "ID da categoria deve ser uma string",
		})
		.optional(),
	id_centro_custo: z
		.string({
			invalid_type_error: "ID do centro de custo deve ser uma string",
		})
		.optional(),
	observacoes: z
		.string({
			invalid_type_error: "Observações deve ser uma string",
		})
		.optional(),
	observacoes_pagamento: z
		.string({
			invalid_type_error: "Observações de pagamento deve ser uma string",
		})
		.optional(),
	itens: z.array(ContaAzulSaleItemSchema, {
		required_error: "Itens são obrigatórios",
	}),
	composicao_de_valor: ContaAzulSaleValueCompositionSchema.optional(),
	condicao_pagamento: ContaAzulSalePaymentConditionSchema,
});

const ContaAzulSaleCreationOutputSchema = z.object({
	id: z.string({
		required_error: "ID é obrigatório",
		invalid_type_error: "ID deve ser uma string",
	}),
	id_legado: z
		.number({
			invalid_type_error: "ID legado deve ser um número",
		})
		.optional(),
	id_cliente: z.string({
		required_error: "ID do cliente é obrigatório",
		invalid_type_error: "ID do cliente deve ser uma string",
	}),
	numero: z.number({
		required_error: "Número é obrigatório",
		invalid_type_error: "Número deve ser um número",
	}),
	origem: z
		.string({
			invalid_type_error: "Origem deve ser uma string",
		})
		.optional(),
	id_categoria: z
		.string({
			invalid_type_error: "ID da categoria deve ser uma string",
		})
		.optional(),
	situacao: z
		.object({
			nome: z.string({
				required_error: "Nome é obrigatório",
				invalid_type_error: "Nome deve ser uma string",
			}),
			descricao: z.string({
				required_error: "Descrição é obrigatória",
				invalid_type_error: "Descrição deve ser uma string",
			}),
		})
		.optional(),
	pendencia: z
		.object({
			nome: z.string({
				required_error: "Nome é obrigatório",
				invalid_type_error: "Nome deve ser uma string",
			}),
			descricao: z.string({
				required_error: "Descrição é obrigatória",
				invalid_type_error: "Descrição deve ser uma string",
			}),
		})
		.optional(),
	valor_composicao: z
		.object({
			valor_bruto: z.number({
				required_error: "Valor bruto é obrigatório",
				invalid_type_error: "Valor bruto deve ser um número",
			}),
			desconto: ContaAzulSaleDiscountSchema.optional(),
			frete: z
				.number({
					invalid_type_error: "Frete deve ser um número",
				})
				.optional(),
			valor_liquido: z.number({
				required_error: "Valor líquido é obrigatório",
				invalid_type_error: "Valor líquido deve ser um número",
			}),
		})
		.optional(),
	condicao_pagamento: z
		.object({
			id_legado: z
				.number({
					invalid_type_error: "ID legado deve ser um número",
				})
				.optional(),
			tipo_pagamento: z
				.string({
					invalid_type_error: "Tipo de pagamento deve ser uma string",
				})
				.optional(),
			id_conta_financeira: z
				.string({
					invalid_type_error: "ID da conta financeira deve ser uma string",
				})
				.optional(),
			opcao_condicao_pagamento: z
				.string({
					invalid_type_error: "Opção de condição de pagamento é obrigatória",
				})
				.optional(),
			parcelas: z.array(ContaAzulSalePaymentInstallmentSchema),
			observacoes_pagamento: z
				.string({
					invalid_type_error: "Observações de pagamento deve ser uma string",
				})
				.optional(),
			troco_total: z.number({
				invalid_type_error: "Troco total deve ser um número",
			}),
		})
		.optional(),
});

type CreateContaAzulSaleParams = {
	sale: z.infer<typeof ContaAzulSaleCreationInputSchema>;
	accessToken: string;
};

export async function createContaAzulSale({ sale, accessToken }: CreateContaAzulSaleParams) {
	const salesEndpointBaseUrl = "https://api-v2.contaazul.com/v1/venda";

	const headers = {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	};

	let responseData: unknown;
	try {
		const { data } = await axios.post(salesEndpointBaseUrl, sale, { headers });
		responseData = data;
	} catch (error) {
		console.log("[ERROR] [createContaAzulSale] Error creating sale", salesEndpointBaseUrl);
		throw error;
	}
	const parsedData = ContaAzulSaleCreationOutputSchema.parse(responseData);

	return parsedData;
}
