import z from "zod";

export const CreateContaAzulSaleV2InputSchema = z.object({
	id_cliente: z
		.string({
			required_error: "O ID do cliente é obrigatório",
			invalid_type_error: "O ID do cliente deve ser uma string",
		})
		.describe("O ID do cliente deve ser uma string (uuid)"),
	numero: z
		.number({
			required_error: "O número da venda é obrigatório",
			invalid_type_error: "O número da venda deve ser um número",
		})
		.describe("O número da venda deve ser um número"),
	situacao: z
		.enum(["EN_ANDAMENTO", "APROVADO"], {
			required_error: "A situação da venda é obrigatória",
			invalid_type_error: "A situação da venda deve ser uma string",
		})
		.describe("A situação da venda deve ser EN_ANDAMENTO ou APROVADO"),
	data_venda: z
		.string({
			required_error: "A data da venda é obrigatória",
			invalid_type_error: "A data da venda deve ser uma string",
		})
		.describe("A data da venda deve ser uma string no formato YYYY-MM-DD"),
	id_categoria: z
		.string({
			required_error: "O ID da categoria é obrigatório",
			invalid_type_error: "O ID da categoria deve ser uma string",
		})
		.describe("O ID da categoria deve ser uma string (uuid)")
		.optional()
		.nullable(),
	id_centro_custo: z
		.string({
			required_error: "O ID do centro de custo é obrigatório",
			invalid_type_error: "O ID do centro de custo deve ser uma string",
		})
		.describe("O ID do centro de custo deve ser uma string (uuid)")
		.optional()
		.nullable(),
	id_vendedor: z
		.string({
			required_error: "O ID do vendedor é obrigatório",
			invalid_type_error: "O ID do vendedor deve ser uma string",
		})
		.describe("O ID do vendedor deve ser uma string (uuid)")
		.optional()
		.nullable(),
	observacoes: z
		.string({
			required_error: "As observações são obrigatórias",
			invalid_type_error: "As observações devem ser uma string",
		})
		.describe("As observações devem ser uma string")
		.optional()
		.nullable(),
	observacoes_pagamento: z
		.string({
			required_error: "As observações de pagamento são obrigatórias",
			invalid_type_error: "As observações de pagamento devem ser uma string",
		})
		.describe("As observações de pagamento devem ser uma string")
		.optional()
		.nullable(),
	itens: z.array(
		z.object({
			descricao: z
				.string({
					required_error: "A descrição do item é obrigatória",
					invalid_type_error: "A descrição do item deve ser uma string",
				})
				.describe("A descrição do item deve ser uma string")
				.optional()
				.nullable(),
			id: z
				.string({
					required_error: "O ID do item é obrigatório",
					invalid_type_error: "O ID do item deve ser uma string",
				})
				.describe("O ID do item deve ser uma string (uuid)"),
			quantidade: z
				.number({
					required_error: "A quantidade do item é obrigatória",
					invalid_type_error: "A quantidade do item deve ser um número",
				})
				.describe("A quantidade do item deve ser um número"),
			valor: z
				.number({
					required_error: "O valor do item é obrigatório",
					invalid_type_error: "O valor do item deve ser um número",
				})
				.describe("O valor do item deve ser um número"),
			valor_custo: z
				.number({
					required_error: "O valor custo do item é obrigatório",
					invalid_type_error: "O valor custo do item deve ser um número",
				})
				.describe("O valor custo do item deve ser um número")
				.optional()
				.nullable(),
		}),
		{
			required_error: "Os itens são obrigatórios",
			invalid_type_error: "Os itens devem ser um array",
		},
	),
	composicao_de_valor: z.object({
		frete: z
			.number({
				required_error: "O frete é obrigatório",
				invalid_type_error: "O frete deve ser um número",
			})
			.describe("O frete deve ser um número")
			.optional()
			.nullable(),
		desconto: z.object({
			tipo: z
				.enum(["PORCENTAGEM", "VALOR"], {
					required_error: "O tipo de desconto é obrigatório",
					invalid_type_error: "O tipo de desconto deve ser uma string",
				})
				.describe("O tipo de desconto deve ser PORCENTAGEM ou VALOR"),
			valor: z
				.number({
					required_error: "O valor do desconto é obrigatório",
					invalid_type_error: "O valor do desconto deve ser um número",
				})
				.describe("O valor do desconto deve ser um número"),
		}),
	}),
	condicao_pagamento: z.object({
		tipo_pagamento: z.enum(
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
				required_error: "O tipo de pagamento é obrigatório",
				invalid_type_error: "O tipo de pagamento deve ser uma string",
			},
		),
		id_conta_financeira: z
			.string({
				required_error: "O ID da conta financeira é obrigatório",
				invalid_type_error: "O ID da conta financeira deve ser uma string",
			})
			.describe("O ID da conta financeira deve ser uma string (uuid)")
			.optional()
			.nullable(),
		opcao_condicao_pagamento: z
			.enum(["À vista", "30,60,90", "15,30,45", "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x", "11x", "12x"], {
				required_error: "A opção de condição de pagamento é obrigatória",
				invalid_type_error: "A opção de condição de pagamento deve ser uma string",
			})
			.describe("A opção de condição de pagamento deve ser À vista, 30,60,90, 15,30,45, 1x, 2x, 3x, 4x, 5x, 6x, 7x, 8x, 9x, 10x, 11x, 12x"),
		nsu: z
			.string({
				required_error: "O NSU é obrigatório",
				invalid_type_error: "O NSU deve ser uma string",
			})
			.describe("O NSU deve ser uma string")
			.optional()
			.nullable(),
		parcelas: z.array(
			z.object({
				descricao: z
					.string({
						required_error: "A descrição da parcela é obrigatória",
						invalid_type_error: "A descrição da parcela deve ser uma string",
					})
					.describe("A descrição da parcela deve ser uma string")
					.optional()
					.nullable(),
				valor: z
					.number({
						required_error: "O valor da parcela é obrigatório",
						invalid_type_error: "O valor da parcela deve ser um número",
					})
					.describe("O valor da parcela deve ser um número"),
				data_vencimento: z
					.string({
						required_error: "A data de vencimento da parcela é obrigatória",
						invalid_type_error: "A data de vencimento da parcela deve ser uma string",
					})
					.describe("A data de vencimento da parcela deve ser uma string no formato YYYY-MM-DD"),
			}),
			{
				required_error: "As parcelas são obrigatórias",
				invalid_type_error: "As parcelas devem ser um array",
			},
		),
	}),
});
export type TCreateContaAzulSaleV2Input = z.infer<typeof CreateContaAzulSaleV2InputSchema>;

export const CreateContaAzulSaleV2OutputSchema = z.object({
	id: z
		.string({
			invalid_type_error: "O ID da venda deve ser uma string",
		})
		.describe("id único da venda")
		.optional()
		.nullable(),
	id_legado: z
		.number({
			invalid_type_error: "O ID legado deve ser um número",
		})
		.describe("id legado necessário para a venda")
		.optional()
		.nullable(),
	id_cliente: z
		.string({
			invalid_type_error: "O ID do cliente deve ser uma string",
		})
		.describe("id do cliente associado à venda")
		.optional()
		.nullable(),
	numero: z
		.number({
			invalid_type_error: "O número da venda deve ser um número",
		})
		.describe("Número da venda")
		.optional()
		.nullable(),
	origem: z
		.string({
			invalid_type_error: "A origem da venda deve ser uma string",
		})
		.describe("Origem da venda")
		.optional()
		.nullable(),
	id_categoria: z
		.string({
			invalid_type_error: "O ID da categoria deve ser uma string",
		})
		.describe("id da categoria da venda")
		.optional()
		.nullable(),
	data_venda: z
		.string({
			invalid_type_error: "A data da venda deve ser uma string",
		})
		.describe("Data da venda")
		.optional()
		.nullable(),
	situacao: z
		.object({
			nome: z
				.string({
					invalid_type_error: "O nome da situação deve ser uma string",
				})
				.describe("Nome da situação")
				.optional()
				.nullable(),
			descricao: z
				.string({
					invalid_type_error: "A descrição da situação deve ser uma string",
				})
				.describe("Descrição da situação")
				.optional()
				.nullable(),
		})
		.describe("Situação da venda")
		.optional()
		.nullable(),
	pendencia: z
		.object({
			nome: z
				.string({
					invalid_type_error: "O nome da pendência deve ser uma string",
				})
				.describe("Nome da pendência")
				.optional()
				.nullable(),
			descricao: z
				.string({
					invalid_type_error: "A descrição da pendência deve ser uma string",
				})
				.describe("Descrição da pendência")
				.optional()
				.nullable(),
		})
		.describe("Pendência da venda")
		.optional()
		.nullable(),
	valor_composicao: z
		.object({
			valor_bruto: z
				.number({
					invalid_type_error: "O valor bruto deve ser um número",
				})
				.describe("Valor bruto da venda")
				.optional()
				.nullable(),
			desconto: z
				.object({
					tipo: z
						.enum(["PORCENTAGEM", "VALOR"], {
							invalid_type_error: "O tipo de desconto deve ser uma string",
						})
						.describe("Tipo de desconto"),
					valor: z
						.number({
							invalid_type_error: "O valor do desconto deve ser um número",
						})
						.describe("Valor do desconto"),
				})
				.describe("Desconto aplicado")
				.optional()
				.nullable(),
			frete: z
				.number({
					invalid_type_error: "O frete deve ser um número",
				})
				.describe("Valor do frete")
				.optional()
				.nullable(),
			valor_liquido: z
				.number({
					invalid_type_error: "O valor líquido deve ser um número",
				})
				.describe("Valor líquido da venda")
				.optional()
				.nullable(),
		})
		.describe("Composição de valor da venda")
		.optional()
		.nullable(),
	condicao_pagamento: z
		.object({
			id_legado: z
				.number({
					invalid_type_error: "O ID legado da condição de pagamento deve ser um número",
				})
				.describe("id legado da condição de pagamento")
				.optional()
				.nullable(),
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
						invalid_type_error: "O tipo de pagamento deve ser uma string",
					},
				)
				.describe("Tipo de pagamento")
				.optional()
				.nullable(),
			id_conta_financeira: z
				.string({
					invalid_type_error: "O ID da conta financeira deve ser uma string",
				})
				.describe("id da conta financeira")
				.optional()
				.nullable(),
			opcao_condicao_pagamento: z
				.string({
					invalid_type_error: "A opção de condição de pagamento deve ser uma string",
				})
				.describe("Opção de condição de pagamento")
				.optional()
				.nullable(),
			parcelas: z
				.array(
					z.object({
						data_vencimento: z
							.string({
								invalid_type_error: "A data de vencimento deve ser uma string",
							})
							.describe("Data de vencimento")
							.optional()
							.nullable(),
						valor: z
							.number({
								invalid_type_error: "O valor da parcela deve ser um número",
							})
							.describe("Valor da parcela")
							.optional()
							.nullable(),
						descricao: z
							.string({
								invalid_type_error: "A descrição da parcela deve ser uma string",
							})
							.describe("Descrição da parcela")
							.optional()
							.nullable(),
						numero: z
							.number({
								invalid_type_error: "O número da parcela deve ser um número",
							})
							.describe("Número da parcela")
							.optional()
							.nullable(),
					}),
					{
						invalid_type_error: "As parcelas devem ser um array",
					},
				)
				.describe("Parcelas da condição de pagamento")
				.optional()
				.nullable(),
			observacoes_pagamento: z
				.string({
					invalid_type_error: "As observações de pagamento devem ser uma string",
				})
				.describe("Observações sobre o pagamento")
				.optional()
				.nullable(),
			nsu: z
				.string({
					invalid_type_error: "O NSU deve ser uma string",
				})
				.describe("NSU")
				.optional()
				.nullable(),
			troco_total: z
				.number({
					invalid_type_error: "O troco total deve ser um número",
				})
				.describe("Troco total")
				.optional()
				.nullable(),
		})
		.describe("Condição de pagamento da venda")
		.optional()
		.nullable(),
	observacoes: z
		.string({
			invalid_type_error: "As observações devem ser uma string",
		})
		.describe("Observações sobre a venda")
		.optional()
		.nullable(),
	id_vendedor: z
		.string({
			invalid_type_error: "O ID do vendedor deve ser uma string",
		})
		.describe("id do vendedor responsável pela venda")
		.optional()
		.nullable(),
	versao: z
		.number({
			invalid_type_error: "A versão deve ser um número",
		})
		.describe("Versão da venda")
		.optional()
		.nullable(),
});
export type TCreateContaAzulSaleV2Output = z.infer<typeof CreateContaAzulSaleV2OutputSchema>;

export const GetContaAzulSaleV2ByIdInputSchema = z.object({
	id: z
		.string({
			required_error: "O ID da venda é obrigatório",
			invalid_type_error: "O ID da venda deve ser uma string",
		})
		.describe("O legacy id ou uuid da venda a ser obtida"),
});
export type TGetContaAzulSaleV2ByIdInput = z.infer<typeof GetContaAzulSaleV2ByIdInputSchema>;

export const GetContaAzulSaleV2ByIdOutputSchema = z.object({
	cliente: z
		.object({
			uuid: z
				.string({
					invalid_type_error: "O UUID do cliente deve ser uma string",
				})
				.describe("UUID do cliente")
				.optional()
				.nullable(),
			tipo_pessoa: z
				.string({
					invalid_type_error: "O tipo de pessoa deve ser uma string",
				})
				.describe("Tipo de pessoa")
				.optional()
				.nullable(),
			documento: z
				.string({
					invalid_type_error: "O documento deve ser uma string",
				})
				.describe("Documento")
				.optional()
				.nullable(),
			nome: z
				.string({
					invalid_type_error: "O nome deve ser uma string",
				})
				.describe("Nome")
				.optional()
				.nullable(),
		})
		.describe("Cliente associado à venda")
		.optional()
		.nullable(),
	evento_financeiro: z
		.object({
			id: z
				.string({
					invalid_type_error: "O ID do evento financeiro deve ser uma string",
				})
				.describe("ID do evento financeiro")
				.optional()
				.nullable(),
		})
		.describe("Evento financeiro")
		.optional()
		.nullable(),
	notificacao: z
		.object({
			id_referencia: z
				.string({
					invalid_type_error: "O ID de referência da notificação deve ser uma string",
				})
				.describe("id de referência da notificação")
				.optional()
				.nullable(),
			enviado_para: z
				.string({
					invalid_type_error: "O campo enviado_para deve ser uma string",
				})
				.describe("Enviado para")
				.optional()
				.nullable(),
			enviado_em: z
				.string({
					invalid_type_error: "O campo enviado_em deve ser uma string",
				})
				.describe("Data e hora de envio")
				.optional()
				.nullable(),
			aberto_em: z
				.string({
					invalid_type_error: "O campo aberto_em deve ser uma string",
				})
				.describe("Data e hora de abertura")
				.optional()
				.nullable(),
			status: z
				.enum(["ENVIADO", "LIDO"], {
					invalid_type_error: "O status da notificação deve ser uma string",
				})
				.describe("Status da notificação")
				.optional()
				.nullable(),
		})
		.describe("Notificação")
		.optional()
		.nullable(),
	natureza_operacao: z
		.object({
			tipo_operacao: z
				.enum(["VENDA", "REMESSA", "COMPRA", "DEVOLUCAO"], {
					invalid_type_error: "O tipo de operação deve ser uma string",
				})
				.describe("Tipo de operação")
				.optional()
				.nullable(),
			template_operacao: z
				.enum(
					[
						"VENDA_MERCADORIAS",
						"VENDA_SUFRAMA",
						"VENDA_ENTREGA_FUTURA",
						"VENDA_CONSIGNADA",
						"VENDA_NAO_CONTRIBUINTE",
						"VENDA_EXPORTACAO",
						"VENDA_ORDEM",
						"VENDA_INDUSTRIALIZACAO",
						"PRESTACAO_SERVICO",
					],
					{
						invalid_type_error: "O template de operação deve ser uma string",
					},
				)
				.describe("Template de operação")
				.optional()
				.nullable(),
			label: z
				.string({
					invalid_type_error: "O label deve ser uma string",
				})
				.describe("Label")
				.optional()
				.nullable(),
			mudanca_financeira: z
				.boolean({
					invalid_type_error: "O campo mudanca_financeira deve ser um boolean",
				})
				.describe("Mudança financeira")
				.optional()
				.nullable(),
			mudanca_estoque: z
				.enum(["ENTRADA_ESTOQUE", "SAIDA_ESTOQUE", "NAO_ALTERA_ESTOQUE"], {
					invalid_type_error: "A mudança de estoque deve ser uma string",
				})
				.describe("Mudança de estoque")
				.optional()
				.nullable(),
		})
		.describe("Natureza da operação")
		.optional()
		.nullable(),
	venda: z
		.object({
			id: z
				.string({
					invalid_type_error: "O ID da negociação deve ser uma string",
				})
				.describe("id da negociação")
				.optional()
				.nullable(),
			id_legado: z
				.number({
					invalid_type_error: "O ID legado deve ser um número",
				})
				.describe("ID legado")
				.optional()
				.nullable(),
			tipo_negociacao: z
				.enum(["VENDA", "COMPRA"], {
					invalid_type_error: "O tipo de negociação deve ser uma string",
				})
				.describe("Tipo de negociação")
				.optional()
				.nullable(),
			numero: z
				.number({
					invalid_type_error: "O número deve ser um número",
				})
				.describe("Número da venda")
				.optional()
				.nullable(),
			id_categoria: z
				.string({
					invalid_type_error: "O ID da categoria deve ser uma string",
				})
				.describe("ID da categoria")
				.optional()
				.nullable(),
			data_compromisso: z.any().describe("Data de compromisso").optional().nullable(),
			configuracao_de_desconto: z
				.object({
					tipo_desconto: z
						.enum(["PORCENTAGEM", "VALOR"], {
							invalid_type_error: "O tipo de desconto deve ser uma string",
						})
						.describe("Tipo de desconto")
						.optional()
						.nullable(),
					taxa_desconto: z
						.number({
							invalid_type_error: "A taxa de desconto deve ser um número",
						})
						.describe("Taxa de desconto")
						.optional()
						.nullable(),
				})
				.describe("Configuração de desconto")
				.optional()
				.nullable(),
			composicao_valor: z
				.object({
					valor_bruto: z
						.number({
							invalid_type_error: "O valor bruto deve ser um número",
						})
						.describe("Valor bruto")
						.optional()
						.nullable(),
					desconto: z
						.number({
							invalid_type_error: "O desconto deve ser um número",
						})
						.describe("Desconto")
						.optional()
						.nullable(),
					frete: z
						.number({
							invalid_type_error: "O frete deve ser um número",
						})
						.describe("Frete")
						.optional()
						.nullable(),
					impostos: z
						.number({
							invalid_type_error: "Os impostos devem ser um número",
						})
						.describe("Impostos")
						.optional()
						.nullable(),
					impostos_deduzidos: z
						.number({
							invalid_type_error: "Os impostos deduzidos devem ser um número",
						})
						.describe("Impostos deduzidos")
						.optional()
						.nullable(),
					seguro: z
						.number({
							invalid_type_error: "O seguro deve ser um número",
						})
						.describe("Seguro")
						.optional()
						.nullable(),
					despesas_incidentais: z
						.number({
							invalid_type_error: "As despesas incidentais devem ser um número",
						})
						.describe("Despesas incidentais")
						.optional()
						.nullable(),
					valor_liquido: z
						.number({
							invalid_type_error: "O valor líquido deve ser um número",
						})
						.describe("Valor líquido")
						.optional()
						.nullable(),
				})
				.describe("Composição de valor")
				.optional()
				.nullable(),
			condicao_pagamento: z
				.object({
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
								"LINK_PAGAMENTO",
								"PAGAMENTO_INSTANTANEO",
								"COBRANCA_PIX",
								"PROGRAMA_FIDELIDADE",
								"SEM_PAGAMENTO",
								"TRANSFERENCIA_BANCARIA",
								"VALE_ALIMENTACAO",
								"VALE_COMBUSTIVEL",
								"VALE_PRESENTE",
								"VALE_REFEICAO",
							],
							{
								invalid_type_error: "O tipo de pagamento deve ser uma string",
							},
						)
						.describe("Tipo de pagamento")
						.optional()
						.nullable(),
					id_conta_financeira: z
						.string({
							invalid_type_error: "O ID da conta financeira deve ser uma string",
						})
						.describe("ID da conta financeira")
						.optional()
						.nullable(),
					pagamento_a_vista: z
						.boolean({
							invalid_type_error: "O campo pagamento_a_vista deve ser um boolean",
						})
						.describe("Pagamento à vista")
						.optional()
						.nullable(),
					parcelas: z
						.array(
							z.object({
								id: z
									.string({
										invalid_type_error: "O ID da parcela deve ser uma string",
									})
									.describe("id da parcela")
									.optional()
									.nullable(),
								numero: z
									.number({
										invalid_type_error: "O número da parcela deve ser um número",
									})
									.describe("Número da parcela")
									.optional()
									.nullable(),
								data_vencimento: z.any().describe("Data de vencimento").optional().nullable(),
								valor: z
									.number({
										invalid_type_error: "O valor da parcela deve ser um número",
									})
									.describe("Valor da parcela")
									.optional()
									.nullable(),
								descricao: z
									.string({
										invalid_type_error: "A descrição da parcela deve ser uma string",
									})
									.describe("Descrição da parcela")
									.optional()
									.nullable(),
							}),
							{
								invalid_type_error: "As parcelas devem ser um array",
							},
						)
						.describe("Parcelas")
						.optional()
						.nullable(),
					observacoes_pagamento: z
						.string({
							invalid_type_error: "As observações de pagamento devem ser uma string",
						})
						.describe("Observações sobre o pagamento")
						.optional()
						.nullable(),
					opcao_condicao_pagamento: z
						.string({
							invalid_type_error: "A opção de condição de pagamento deve ser uma string",
						})
						.describe("Opção de condição de pagamento")
						.optional()
						.nullable(),
					nsu: z
						.string({
							invalid_type_error: "O NSU deve ser uma string",
						})
						.describe("NSU")
						.optional()
						.nullable(),
					pagamento_cartao: z
						.object({
							tipo_bandeira: z
								.enum(
									[
										"VISA",
										"MASTERCARD",
										"AMERICAN_EXPRESS",
										"SOROCRED",
										"DINERS_CLUB",
										"ELO",
										"HIPERCARD",
										"AURA",
										"CABAL",
										"ALELO",
										"BANES_CARD",
										"CALCARDS",
										"CREDZ",
										"DISCOVER",
										"GOODCARD",
										"GREENCARD",
										"HIPER",
										"JCB",
										"MAIS",
										"MAXVAN",
										"POLICARD",
										"REDECOMPRAS",
										"SODEXO",
										"VALECARD",
										"VEROCHEQUE",
										"VR",
										"TICKET",
										"OUTROS",
									],
									{
										invalid_type_error: "O tipo de bandeira deve ser uma string",
									},
								)
								.describe("Tipo de bandeira")
								.optional()
								.nullable(),
							codigo_transacao: z
								.string({
									invalid_type_error: "O código de transação deve ser uma string",
								})
								.describe("Código de transação")
								.optional()
								.nullable(),
							id_adquirente: z
								.number({
									invalid_type_error: "O ID do adquirente deve ser um número",
								})
								.describe("ID do adquirente")
								.optional()
								.nullable(),
						})
						.describe("Pagamento com cartão")
						.optional()
						.nullable(),
				})
				.describe("Condição de pagamento")
				.optional()
				.nullable(),
			total_itens: z
				.object({
					contagem_produtos: z
						.number({
							invalid_type_error: "A contagem de produtos deve ser um número",
						})
						.describe("Contagem de produtos")
						.optional()
						.nullable(),
					contagem_servicos: z
						.number({
							invalid_type_error: "A contagem de serviços deve ser um número",
						})
						.describe("Contagem de serviços")
						.optional()
						.nullable(),
					contagem_nao_conciliados: z
						.number({
							invalid_type_error: "A contagem de não conciliados deve ser um número",
						})
						.describe("Contagem de não conciliados")
						.optional()
						.nullable(),
				})
				.describe("Total de itens")
				.optional()
				.nullable(),
			observacoes: z
				.string({
					invalid_type_error: "As observações devem ser uma string",
				})
				.describe("Observações")
				.optional()
				.nullable(),
			id_cliente: z
				.string({
					invalid_type_error: "O ID do cliente deve ser uma string",
				})
				.describe("ID do cliente")
				.optional()
				.nullable(),
			versao: z
				.number({
					invalid_type_error: "A versão deve ser um número",
				})
				.describe("Versão")
				.optional()
				.nullable(),
			tipo_pendencia: z
				.object({
					nome: z
						.enum(
							[
								"NENHUMA",
								"RESERVA_DE_ESTOQUE",
								"CONCILIACAO_ITENS",
								"PROCESSAMENTO_RESERVA_DE_ESTOQUE",
								"ESPERANDO_CONFIRMACAO",
								"AGUARDANDO_GERACAO_NOTA_FISCAL",
							],
							{
								invalid_type_error: "O nome da pendência deve ser uma string",
							},
						)
						.describe("Nome da pendência")
						.optional()
						.nullable(),
					descricao: z
						.string({
							invalid_type_error: "A descrição da pendência deve ser uma string",
						})
						.describe("Descrição da pendência")
						.optional()
						.nullable(),
				})
				.describe("Tipo de pendência")
				.optional()
				.nullable(),
			situacao: z
				.object({
					nome: z
						.enum(["EM_ANDAMENTO", "APROVADO", "FATURADO", "CANCELADO", "ORCAMENTO", "ORCAMENTO_ACEITO", "ORCAMENTO_RECUSADO", "CONTRATO", "VENDA"], {
							invalid_type_error: "O nome da situação deve ser uma string",
						})
						.describe("Nome da situação")
						.optional()
						.nullable(),
					descricao: z
						.string({
							invalid_type_error: "A descrição da situação deve ser uma string",
						})
						.describe("Descrição da situação")
						.optional()
						.nullable(),
					ativado: z
						.boolean({
							invalid_type_error: "O campo ativado deve ser um boolean",
						})
						.describe("Ativado ou não")
						.optional()
						.nullable(),
				})
				.describe("Situação")
				.optional()
				.nullable(),
			id_natureza_operacao: z
				.string({
					invalid_type_error: "O ID da natureza de operação deve ser uma string",
				})
				.describe("ID da natureza de operação")
				.optional()
				.nullable(),
			id_centro_custo: z
				.string({
					invalid_type_error: "O ID do centro de custo deve ser uma string",
				})
				.describe("ID do centro de custo")
				.optional()
				.nullable(),
			introducao: z
				.string({
					invalid_type_error: "A introdução deve ser uma string",
				})
				.describe("Introdução da venda em orçamento")
				.optional()
				.nullable(),
		})
		.describe("Venda")
		.optional()
		.nullable(),
	vendedor: z
		.object({
			id: z
				.string({
					invalid_type_error: "O ID do vendedor deve ser uma string",
				})
				.describe("id do vendedor")
				.optional()
				.nullable(),
			nome: z
				.string({
					invalid_type_error: "O nome do vendedor deve ser uma string",
				})
				.describe("Nome do vendedor")
				.optional()
				.nullable(),
			id_legado: z
				.number({
					invalid_type_error: "O ID legado do vendedor deve ser um número",
				})
				.describe("id legado do vendedor")
				.optional()
				.nullable(),
		})
		.describe("Vendedor")
		.optional()
		.nullable(),
});
export type TGetContaAzulSaleV2ByIdOutput = z.infer<typeof GetContaAzulSaleV2ByIdOutputSchema>;

export const GetContaAzulNextSaleNumberV2OutputSchema = z.number({
	required_error: "O número da venda é obrigatório",
	invalid_type_error: "O número da venda deve ser um número",
});
export type TGetContaAzulNextSaleNumberV2Output = z.infer<typeof GetContaAzulNextSaleNumberV2OutputSchema>;

export const CreateCentroDeCustoV2InputSchema = z.object({
	codigo: z
		.string({
			invalid_type_error: "O código deve ser uma string",
		})
		.describe("Código do centro de custo")
		.optional()
		.nullable(),
	nome: z
		.string({
			required_error: "O nome é obrigatório",
			invalid_type_error: "O nome deve ser uma string",
		})
		.describe("Nome do centro de custo"),
});
export type TCreateCentroDeCustoV2Input = z.infer<typeof CreateCentroDeCustoV2InputSchema>;

export const CreateCentroDeCustoV2OutputSchema = z.object({
	id: z
		.string({
			required_error: "O ID é obrigatório",
			invalid_type_error: "O ID deve ser uma string",
		})
		.describe("Identificador único do centro de custo"),
	codigo: z
		.string({
			invalid_type_error: "O código deve ser uma string",
		})
		.describe("Código do centro de custo")
		.optional()
		.nullable(),
	nome: z
		.string({
			invalid_type_error: "O nome deve ser uma string",
		})
		.describe("Nome do centro de custo")
		.optional()
		.nullable(),
	ativo: z
		.boolean({
			invalid_type_error: "O campo ativo deve ser um boolean",
		})
		.describe("Indica se o centro de custo está ativo")
		.optional()
		.nullable(),
});
export type TCreateCentroDeCustoV2Output = z.infer<typeof CreateCentroDeCustoV2OutputSchema>;

export const SearchCentroDeCustoV2OutputSchema = z.object({
	items: z.array(
		z.object({
			id: z
				.string({
					invalid_type_error: "O ID deve ser uma string",
				})
				.describe("Identificador único do centro de custo")
				.optional()
				.nullable(),
			codigo: z
				.string({
					invalid_type_error: "O código deve ser uma string",
				})
				.describe("Código do centro de custo")
				.optional()
				.nullable(),
			nome: z
				.string({
					invalid_type_error: "O nome deve ser uma string",
				})
				.describe("Nome do centro de custo")
				.optional()
				.nullable(),
			ativo: z
				.boolean({
					invalid_type_error: "O campo ativo deve ser um boolean",
				})
				.describe("Indica se o centro de custo está ativo")
				.optional()
				.nullable(),
		}),
	),
	totalItems: z
		.number({
			invalid_type_error: "O total de itens deve ser um número",
		})
		.describe("Total de itens encontrados")
		.optional()
		.nullable(),
});
export type TSearchCentroDeCustoV2Output = z.infer<typeof SearchCentroDeCustoV2OutputSchema>;

export const SearchContaAzulClientV2ByCpfCnpjOutputSchema = z.object({
	items: z.array(
		z.object({
			id: z
				.string({
					invalid_type_error: "O ID da pessoa deve ser uma string",
				})
				.describe("ID da pessoa")
				.optional()
				.nullable(),
			id_legado: z
				.number({
					invalid_type_error: "O ID legado deve ser um número",
				})
				.describe("ID legado da pessoa")
				.optional()
				.nullable(),
			nome: z
				.string({
					invalid_type_error: "O nome deve ser uma string",
				})
				.describe("Nome da pessoa")
				.optional()
				.nullable(),
			documento: z
				.string({
					invalid_type_error: "O documento deve ser uma string",
				})
				.describe("Documento da pessoa (CPF/CNPJ)")
				.optional()
				.nullable(),
			email: z
				.string({
					invalid_type_error: "O email deve ser uma string",
				})
				.describe("Email da pessoa")
				.optional()
				.nullable(),
			telefone: z
				.string({
					invalid_type_error: "O telefone deve ser uma string",
				})
				.describe("Telefone da pessoa")
				.optional()
				.nullable(),
			tipo_pessoa: z
				.string({
					invalid_type_error: "O tipo de pessoa deve ser uma string",
				})
				.describe("Tipo de pessoa (Física, Jurídica ou Estrangeira)")
				.optional()
				.nullable(),
			ativo: z
				.boolean({
					invalid_type_error: "O campo ativo deve ser um boolean",
				})
				.describe("Indica se a pessoa está ativa ou inativa")
				.optional()
				.nullable(),
			data_criacao: z
				.string({
					invalid_type_error: "A data de criação deve ser uma string",
				})
				.describe("Data/hora de criação")
				.optional()
				.nullable(),
			data_alteracao: z
				.string({
					invalid_type_error: "A data de alteração deve ser uma string",
				})
				.describe("Data/hora da última alteração")
				.optional()
				.nullable(),
			endereco: z
				.object({
					id: z.string().optional().nullable(),
					cep: z.string().optional().nullable(),
					logradouro: z.string().optional().nullable(),
					numero: z.string().optional().nullable(),
					bairro: z.string().optional().nullable(),
					cidade: z.string().optional().nullable(),
					estado: z.string().optional().nullable(),
					pais: z.string().optional().nullable(),
					complemento: z.string().optional().nullable(),
					id_cidade: z.number().optional().nullable(),
				})
				.describe("Endereço da pessoa")
				.optional()
				.nullable(),
			perfis: z.array(z.string()).describe("Perfis associados à pessoa").optional().nullable(),
			observacoes_gerais: z
				.string({
					invalid_type_error: "As observações gerais devem ser uma string",
				})
				.describe("Observações gerais sobre a pessoa")
				.optional()
				.nullable(),
			uuid_legado: z
				.string({
					invalid_type_error: "O UUID legado deve ser uma string",
				})
				.describe("UUID legado da pessoa")
				.optional()
				.nullable(),
		}),
	),
	totalItems: z
		.number({
			invalid_type_error: "O total de itens deve ser um número",
		})
		.describe("Total de itens encontrados")
		.optional()
		.nullable(),
});
export type TSearchContaAzulClientV2ByCpfCnpjOutput = z.infer<typeof SearchContaAzulClientV2ByCpfCnpjOutputSchema>;

export const CreateContaAzulClientV2InputSchema = z.object({
	nome: z
		.string({
			required_error: "O nome do cliente é obrigatório",
			invalid_type_error: "O nome do cliente deve ser uma string",
		})
		.describe("Nome do cliente"),
	email: z
		.string({
			invalid_type_error: "O email deve ser uma string",
		})
		.describe("Email do cliente")
		.optional()
		.nullable(),
	telefone: z
		.string({
			invalid_type_error: "O telefone deve ser uma string",
		})
		.describe("Telefone do cliente")
		.optional()
		.nullable(),
	documento: z
		.string({
			required_error: "O documento é obrigatório",
			invalid_type_error: "O documento deve ser uma string",
		})
		.describe("CPF/CNPJ do cliente (sem máscara)"),
	tipo_pessoa: z
		.enum(["NATURAL", "LEGAL"], {
			required_error: "O tipo de pessoa é obrigatório",
			invalid_type_error: "O tipo de pessoa deve ser NATURAL ou LEGAL",
		})
		.describe("Tipo de pessoa"),
	cep: z
		.string({
			invalid_type_error: "O CEP deve ser uma string",
		})
		.describe("CEP do cliente")
		.optional()
		.nullable(),
	logradouro: z
		.string({
			invalid_type_error: "O logradouro deve ser uma string",
		})
		.describe("Logradouro do cliente")
		.optional()
		.nullable(),
	numero: z
		.string({
			invalid_type_error: "O número deve ser uma string",
		})
		.describe("Número do endereço")
		.optional()
		.nullable(),
	bairro: z
		.string({
			invalid_type_error: "O bairro deve ser uma string",
		})
		.describe("Bairro do cliente")
		.optional()
		.nullable(),
});
export type TCreateContaAzulClientV2Input = z.infer<typeof CreateContaAzulClientV2InputSchema>;

export const CreateContaAzulClientV2OutputSchema = z.object({
	id: z
		.string({
			required_error: "O ID do cliente é obrigatório",
			invalid_type_error: "O ID do cliente deve ser uma string",
		})
		.describe("ID do cliente criado"),
	nome: z
		.string({
			invalid_type_error: "O nome deve ser uma string",
		})
		.describe("Nome do cliente")
		.optional()
		.nullable(),
	documento: z
		.string({
			invalid_type_error: "O documento deve ser uma string",
		})
		.describe("Documento do cliente")
		.optional()
		.nullable(),
});
export type TCreateContaAzulClientV2Output = z.infer<typeof CreateContaAzulClientV2OutputSchema>;
