import z, { TypeOf } from "zod";
import { ObjectId } from "mongodb";

const GeneralOpportunitySchema = z.object({
	nome: z.string(),
	tipoProjeto: z.string(),
	identificador: z.string(),
	idOportunidade: z.string().optional().nullable(),
	responsavel: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	representante: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	localizacao: z.object({
		cep: z.string().optional().nullable(),
		uf: z.string(),
		cidade: z.string(),
		bairro: z.string().optional().nullable(),
		endereco: z.string().optional().nullable(),
		numeroOuIdentificador: z.string().optional().nullable(),
		complemento: z.string().optional().nullable(),
		// distancia: z.number().optional().nullable(),
	}),
	clienteId: z.string(),
	propostaAtiva: z.string().optional().nullable(),
	titularInstalacao: z.string().optional().nullable(),
	numeroInstalacaoConcessionaria: z.string().optional().nullable(),
	tipoTitular: z
		.union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")])
		.optional()
		.nullable(),
	tipoLigacao: z
		.union([z.literal("EXISTENTE"), z.literal("NOVA")])
		.optional()
		.nullable(),
	tipoInstalacao: z
		.union([z.literal("URBANO"), z.literal("RURAL")])
		.optional()
		.nullable(),
	credor: z.string().optional().nullable(),
	anexos: z
		.object({
			documentoComFoto: z.string().optional().nullable(),
			iptu: z.string().optional().nullable(),
			contaDeEnergia: z.string().optional().nullable(),
			laudo: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	descricao: z.string().optional().nullable(),
	funis: z.array(z.object({ id: z.union([z.string(), z.number()]), etapaId: z.union([z.string(), z.number()]) })),
	dataPerda: z.string().optional().nullable(),
	motivoPerda: z.string().optional().nullable(),
	contrato: z
		.object({
			id: z.string().optional().nullable(),
			idProposta: z.string().nullable(),
			dataAssinatura: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	solicitacaoContrato: z
		.object({
			id: z.string().optional().nullable(),
			idProposta: z.string().nullable(),
			dataSolicitacao: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	dataInsercao: z.string().datetime(),
});

export const InsertOpportunitySchema = z.object({
	nome: z.string({ required_error: "Nome do projeto não fornecido.", invalid_type_error: "Tipo não válido para nome do projeto." }),
	tipoProjeto: z.string(),
	identificador: z
		.string({ required_error: "Identificador não fornecido.", invalid_type_error: "Tipo não válido para identificador do projeto." })
		.optional()
		.nullable(),
	idOportunidade: z
		.string({
			required_error: "Oportunidade de referência não fornecida.",
			invalid_type_error: "Tipo não válido para oportunidade de referência do projeto.",
		})
		.optional()
		.nullable(),
	responsavel: z.object({
		id: z.string({
			required_error: "ID do responsável do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para ID de responsável do projeto.",
		}),
		nome: z.string({
			required_error: "Nome do responsável do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para nome do responsável do projeto.",
		}),
		avatar_url: z.string({ invalid_type_error: "Tipo inválido para o avatar do responsável." }).optional().nullable(),
	}),
	representante: z.object({
		id: z.string({
			required_error: "ID do representante do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para ID de representante do projeto.",
		}),
		nome: z.string({
			required_error: "Nome do representante do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para nome do representante do projeto.",
		}),
		avatar_url: z.string({ invalid_type_error: "Tipo inválido para o avatar do representante." }).optional().nullable(),
	}),
	localizacao: z.object({
		cep: z
			.string({
				required_error: "CEP da localização do projeto não fornecido.",
				invalid_type_error: "Tipo não válido para CEP da localização do projeto.",
			})
			.optional()
			.nullable(),
		uf: z.string({
			required_error: "Unidade Federativa da localização projeto não fornecido.",
			invalid_type_error: "Tipo não válido para a Unidade Ferederativa da localização do projeto.",
		}),
		cidade: z.string({
			required_error: "Cidade de localização do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para cidade de localização do projeto.",
		}),
		bairro: z
			.string({
				required_error: "Bairro de localização do projeto não fornecido.",
				invalid_type_error: "Tipo não válido para o bairro de localização do projeto.",
			})
			.optional()
			.nullable(),
		endereco: z
			.string({
				required_error: "Endereço de localização do projeto não fornecido.",
				invalid_type_error: "Tipo não válido para o endereço de localização do projeto.",
			})
			.optional()
			.nullable(),
		numeroOuIdentificador: z
			.string({
				required_error: "Número/identificador de localização do projeto não fornecido.",
				invalid_type_error: "Tipo não válido para o número/identificador de localização do projeto.",
			})
			.optional()
			.nullable(),
		complemento: z.string().optional().nullable(),
		// distancia: z.number().optional().nullable(),
	}),
	clienteId: z.string({
		required_error: "Referência do cliente do projeto não fornecido.",
		invalid_type_error: "Tipo não válido para a referência do cliente do projeto.",
	}),
	propostaAtiva: z
		.string({
			required_error: "Referência de proposta ativa do projeto não fornecida.",
			invalid_type_error: "Tipo não válido para a referência de proposta ativa do projeto.",
		})
		.optional()
		.nullable(),
	titularInstalacao: z
		.string({
			required_error: "Titular da instalação do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o titular da instalação do projeto.",
		})
		.optional()
		.nullable(),
	numeroInstalacaoConcessionaria: z
		.string({
			required_error: "Número da instalação do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o número da instalação do projeto.",
		})
		.optional()
		.nullable(),
	tipoTitular: z
		.union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")], {
			required_error: "Tipo do titular do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o titular do projeto do projeto.",
		})
		.optional()
		.nullable(),
	tipoLigacao: z
		.union([z.literal("EXISTENTE"), z.literal("NOVA")], {
			required_error: "Tipo de ligação do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o tipo de ligação do projeto.",
		})
		.optional()
		.nullable(),
	tipoInstalacao: z
		.union([z.literal("URBANO"), z.literal("RURAL")], {
			required_error: "Tipo da instalação do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o tipo da instalação do projeto.",
		})
		.optional()
		.nullable(),
	credor: z
		.string({
			required_error: "Credor do projeto não fornecido.",
			invalid_type_error: "Tipo não válido para o credor do projeto.",
		})
		.optional()
		.nullable(),
	anexos: z
		.object({
			documentoComFoto: z
				.string({
					required_error: "Anexo(s) do projeto não fornecido.",
					invalid_type_error: "Tipo não válido para anexo(s) do projeto.",
				})
				.optional()
				.nullable(),
			iptu: z
				.string({ required_error: "Anexo(s) do projeto não fornecido.", invalid_type_error: "Tipo não válido para anexo(s) do projeto." })
				.optional()
				.nullable(),
			contaDeEnergia: z
				.string({
					required_error: "Anexo(s) do projeto não fornecido.",
					invalid_type_error: "Tipo não válido para anexo(s) do projeto.",
				})
				.optional()
				.nullable(),
			laudo: z
				.string({
					required_error: "Anexo(s) do projeto não fornecido.",
					invalid_type_error: "Tipo não válido para anexo(s) do projeto.",
				})
				.optional()
				.nullable(),
		})
		.optional()
		.nullable(),
	descricao: z
		.string({
			required_error: "Descrição do projeto não fornecida.",
			invalid_type_error: "Tipo não válido para a descrição do projeto.",
		})
		.optional()
		.nullable(),
	funis: z.array(z.object({ id: z.union([z.string(), z.number()]), etapaId: z.union([z.string(), z.number()]) }), {
		required_error: "Funis de referência do projeto não fornecidos.",
		invalid_type_error: "Tipo não válido para funis de referência projeto.",
	}),
	dataPerda: z
		.string({ required_error: "Data de perda do projeto não fornecida.", invalid_type_error: "Tipo não válido para a data de perda do projeto." })
		.optional()
		.nullable(),
	motivoPerda: z
		.string({ required_error: "Motivo de perda do projeto não fornecido.", invalid_type_error: "Tipo não válido para o motivo de perda projeto." })
		.optional()
		.nullable(),
	contrato: z
		.object({
			id: z
				.string({
					required_error: "Referência de contrato não fornecida.",
					invalid_type_error: "Tipo não válido para a referência de contrato do projeto.",
				})
				.optional()
				.nullable(),
			idProposta: z
				.string({
					required_error: "Referência de proposta não fornecida.",
					invalid_type_error: "Tipo não válido para a referência de proposta do projeto.",
				})
				.nullable(),
			dataAssinatura: z
				.string({
					required_error: "Data de assinatura do projeto não fornecida.",
					invalid_type_error: "Tipo não válido para a data de assinatura do projeto.",
				})
				.optional()
				.nullable(),
		})
		.optional()
		.nullable(),
	solicitacaoContrato: z
		.object({
			id: z
				.string({
					required_error: "Referência de solicitação de contrato não fornecida.",
					invalid_type_error: "Tipo não válido para a referência de solicitação de contrato do projeto.",
				})
				.optional()
				.nullable(),
			idProposta: z
				.string({
					required_error: "Referência de proposta não fornecida.",
					invalid_type_error: "Tipo não válido para a referência de proposta do projeto.",
				})
				.nullable(),
			dataSolicitacao: z
				.string({
					required_error: "Data de solicitação de contrato não fornecida.",
					invalid_type_error: "Tipo não válido para a data de solicitação do projeto.",
				})
				.optional()
				.nullable(),
		})
		.optional()
		.nullable(),
	dataInsercao: z
		.string({ required_error: "Data de inserção não fornecida.", invalid_type_error: "Tipo não válido para a data de inserção do projeto." })
		.datetime({ message: "Tipo inválido para data de inserção." }),
});

const OpportunityEntitySchema = z.object({
	_id: z.instanceof(ObjectId),
	nome: z.string(),
	tipoProjeto: z.string(),
	identificador: z.string(),
	idOportunidade: z.string().optional().nullable(),
	responsavel: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	representante: z.object({
		id: z.string(),
		nome: z.string(),
		avatar_url: z.string().optional().nullable(),
	}),
	localizacao: z.object({
		cep: z.string().optional().nullable(),
		uf: z.string(),
		cidade: z.string(),
		bairro: z.string().optional().nullable(),
		endereco: z.string().optional().nullable(),
		numeroOuIdentificador: z.string().optional().nullable(),
		complemento: z.string().optional().nullable(),
		// distancia: z.number().optional().nullable(),
	}),
	clienteId: z.string(),
	propostaAtiva: z.string().optional().nullable(),
	titularInstalacao: z.string().optional().nullable(),
	numeroInstalacaoConcessionaria: z.string().optional().nullable(),
	tipoTitular: z
		.union([z.literal("PESSOA FISICA"), z.literal("PESSOA JURIDICA")])
		.optional()
		.nullable(),
	tipoLigacao: z
		.union([z.literal("EXISTENTE"), z.literal("NOVA")])
		.optional()
		.nullable(),
	tipoInstalacao: z
		.union([z.literal("URBANO"), z.literal("RURAL")])
		.optional()
		.nullable(),
	credor: z.string().optional().nullable(),
	anexos: z
		.object({
			documentoComFoto: z.string().optional().nullable(),
			iptu: z.string().optional().nullable(),
			contaDeEnergia: z.string().optional().nullable(),
			laudo: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	descricao: z.string().optional().nullable(),
	funis: z.array(z.object({ id: z.union([z.string(), z.number()]), etapaId: z.union([z.string(), z.number()]) })),
	dataPerda: z.string().optional().nullable(),
	motivoPerda: z.string().optional().nullable(),
	contrato: z
		.object({
			id: z.string().optional().nullable(),
			idProposta: z.string().nullable(),
			dataAssinatura: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	solicitacaoContrato: z
		.object({
			id: z.string().optional().nullable(),
			idProposta: z.string().nullable(),
			dataSolicitacao: z.string().optional().nullable(),
		})
		.optional()
		.nullable(),
	dataInsercao: z.string().datetime(),
});

export type TOpportunity = z.infer<typeof GeneralOpportunitySchema>;

export type TOpportunityDTO = TOpportunity & { _id: string };
