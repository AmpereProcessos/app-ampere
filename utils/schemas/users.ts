import z from "zod";
export const AuthorSchema = z.object({
	id: z.string({ required_error: "ID de referência do autor não fornecido.", invalid_type_error: "Tipo não válido para o ID do autor." }),
	nome: z.string({ required_error: "Nome do autor não fornecido.", invalid_type_error: "Tipo não válido para o nome do autor." }),
	avatar_url: z.string({ invalid_type_error: "Avatar do autor não fornecido." }).optional().nullable(),
});

const PermissionsSchema = z.object({
	rotas: z.array(z.string(), { required_error: "Rotas de acesso não informadas.", invalid_type_error: "Tipo não válido para rotas de acesso." }),
	usuarios: z.object({
		escopo: z.array(z.string()).optional().nullable(),
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de usuários.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de usuários.",
		}),
		criar: z.boolean({
			required_error: "Ativação da permissão de criação de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de usuários.",
		}),
	}),
	comercial: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização comercial não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização comercial.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição comercial não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição comercial.",
		}),
	}),
	posVenda: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização pós-venda não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização pós-venda.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição pós-venda não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição pós-venda.",
		}),
	}),
	suprimentos: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de suprimentos não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de suprimentos.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de suprimentos não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de suprimentos.",
		}),
	}),
	engenharia: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de engenharia não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de engenharia.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de engenharia não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de engenharia.",
		}),
	}),
	execucao: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de obras não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de obras.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de obras não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de obras.",
		}),
	}),
	suporte: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de suporte não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de suporte.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de suporte não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de suporte.",
		}),
	}),
	administrativo: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de administrativo não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de administrativo.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de administrativo não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de administrativo.",
		}),
	}),
	financeiro: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de financeiro não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de financeiro.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de financeiro não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de financeiro.",
		}),
	}),
	recursosHumanos: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de recursos humanos não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de recursos humanos.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de recursos humanos não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de recursos humanos.",
		}),
	}),
	gestao: z.object({
		visualizarResultados: z.boolean({
			required_error: "Ativação da permissão de visualização de resultados.",
			invalid_type_error: "Tipo não válido para permissão de visualização de resultados.",
		}),
		restringirProjetos: z.boolean({
			required_error: "Ativação da permissão de restrição de projetos.",
			invalid_type_error: "Tipo não válido para permissão de restrição de projetos.",
		}),
	}),
	ordensDeServico: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de ordens de serviço não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de ordens de serviço.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de ordens de serviço não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de ordens de serviço.",
		}),
		criar: z.boolean({
			required_error: "Ativação da permissão de criação de ordens de serviço não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de ordens de serviço.",
		}),
	}),
	chats: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de chats não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de chats.",
		}),
		enviarMensagens: z.boolean({
			required_error: "Ativação da permissão de envio de mensagens não informada.",
			invalid_type_error: "Tipo não válido para permissão de envio de mensagens.",
		}),
	}),
	certificacoes: z.object({
		visualizar: z.boolean({
			required_error: "Ativação da permissão de visualização de certificações não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de certificações.",
		}),
		editar: z.boolean({
			required_error: "Ativação da permissão de edição de certificações não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de certificações.",
		}),
		criar: z.boolean({
			required_error: "Ativação da permissão de criação de certificações não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de certificações.",
		}),
	}),
});

const PositionSchema = z.object({
	cargo: z
		.string({ required_error: "Nome do cargo não informado.", invalid_type_error: "Tipo não válido para o nome do cargo." })
		.min(2, "Cargo deve possuir ao menos duas letras."),
	cbo: z.string({ required_error: "CBO do cargo não informado.", invalid_type_error: "Tipo não válido para o CBO do cargo." }),
	dataInicio: z
		.string({ required_error: "Data de início do cargo não informada.", invalid_type_error: "Tipo não válido para a data de início do cargo." })
		.datetime({ message: "Formato inválido para data de início do cargo." }),
	dataFinal: z
		.string({
			required_error: "Data de fim do cargo não informada.",
			invalid_type_error: "Tipo não válido para a data de fim do cargo.",
		})
		.datetime({ message: "Formato inválido para data de fim do cargo." })
		.optional()
		.nullable(),
});
export type TCorporatePosition = z.infer<typeof PositionSchema>;
const WorkingHoursSchema = z.object({
	horarioInicio: z.string({ required_error: "Horário de início não informado.", invalid_type_error: "Tipo não válido para horário de início." }),
	horarioFinal: z.string({
		required_error: "Horário de conclusão não informado.",
		invalid_type_error: "Tipo não válido para horário de conclusão.",
	}),
});

export type TWorkingHours = z.infer<typeof WorkingHoursSchema>;
const AuxiliarContactSchema = z.object({
	nome: z.string({ required_error: "Nome do contato auxiliar não informado.", invalid_type_error: "Tipo não válido para nome do contato auxiliar." }),
	grau: z.string({ required_error: "Grau do contato auxiliar não informado.", invalid_type_error: "Grau não válido para nome do contato auxiliar." }),
	telefone: z.string({
		required_error: "Telefone do contato auxiliar não informado.",
		invalid_type_error: "Tipo não válido para telefone do contato auxiliar.",
	}),
});
export type TEmployeeAuxiliarContact = z.infer<typeof AuxiliarContactSchema>;
export const GeneralUserSchema = z.object({
	acessoAtivo: z.boolean(),
	colaboradorAtivo: z.boolean(),
	nome: z.string(),
	usuario: z.string(),
	email: z.string(),
	telefone: z.string(),
	senha: z.string(),
	avatar_url: z.string().optional().nullable(),
	visualizacao: z.object({
		tipo: z.enum(["OPERACIONAL", "EXECUÇÃO", "VENDAS"]).optional().nullable(),
		referencia: z.string().optional().nullable(),
	}),
	permissoes: PermissionsSchema,
	empresaVinculada: z.string(),
	dataNascimento: z.string().optional().nullable(),
	localNascimento: z.string(),
	nacionalidade: z.string(),
	estadoCivil: z.string(),
	grauInstrucao: z.string(),
	tituloEleitor: z.string(),
	carteiraTrabalho: z.object({
		pisPaseb: z.string(),
		numero: z.string(),
		serie: z.string(),
	}),
	rg: z.string(),
	cpf: z.string(),
	carteiraTransito: z.object({
		numero: z.string(),
		dataVencimento: z.string().optional().nullable(),
	}),
	qtdeFilhos: z.number(),
	localizacao: z.object({
		cep: z.string().optional().nullable(),
		uf: z.string().optional().nullable(),
		cidade: z.string().optional().nullable(),
		bairro: z.string(),
		endereco: z.string(),
		numeroOuIdentificador: z.string(),
	}),
	dataAdmissao: z.string().datetime().optional().nullable(),
	cargos: z.array(PositionSchema),
	salarioBase: z.number(),
	horariosTrabalho: z.array(WorkingHoursSchema),
	contatosAuxiliares: z.array(AuxiliarContactSchema),
	autor: AuthorSchema,
	dataInsercao: z.string().datetime(),
});

export const InsertUserSchema = z.object({
	acessoAtivo: z.boolean({ required_error: "Liberação de acesso não informada.", invalid_type_error: "Tipo não válido para liberação de acesso." }),
	colaboradorAtivo: z.boolean({
		required_error: "Ativação do colaborador não informada.",
		invalid_type_error: "Tipo não válido para ativação do colaborador.",
	}),

	nome: z.string({ required_error: "Nome do colaborador não informado.", invalid_type_error: "Tipo não válido para nome do colaborador." }),
	usuario: z.string({ required_error: "Usuário do colaborador não informado.", invalid_type_error: "Tipo não válido para usuário do colaborador." }),
	email: z.string({ required_error: "Email do colaborador não informado.", invalid_type_error: "Email não válido para nome do colaborador." }),
	telefone: z.string({
		required_error: "Telefone do colaborador não informado.",
		invalid_type_error: "Telefone não válido para nome do colaborador.",
	}),
	senha: z.string({
		required_error: "Senha de acesso do colaborador não informado.",
		invalid_type_error: "Tipo não válido para senha de acesso do colaborador.",
	}),
	avatar_url: z
		.string({ required_error: "Avatar do colaborador não informado.", invalid_type_error: "Tipo não válido para avatar do colaborador." })
		.optional()
		.nullable(),
	visualizacao: z.object({
		tipo: z
			.enum(["OPERACIONAL", "EXECUÇÃO", "VENDAS"], {
				required_error: "Tipo da visualização não informada.",
				invalid_type_error: "Tipo não válido para o tipo de visualização do usuário.",
			})
			.optional()
			.nullable(),
		referencia: z
			.string({
				required_error: "Referência da visualização não informada.",
				invalid_type_error: "Tipo não válido para a referência da visualização.",
			})
			.optional()
			.nullable(),
	}),
	permissoes: PermissionsSchema,
	empresaVinculada: z.string({
		required_error: "Empresa ao qual o colaborador está vinculado não informada.",
		invalid_type_error: "Tipo não válido para a empresa de vinculação do colaborador.",
	}),
	dataNascimento: z
		.string({
			required_error: "Data de nascimento do colaborador não informado.",
			invalid_type_error: "Tipo não válido para data de nascimento do colaborador.",
		})
		.optional()
		.nullable(),
	localNascimento: z.string({
		required_error: "Local de nascimento do colaborador não informado.",
		invalid_type_error: "Tipo não válido para local de nascimento do colaborador.",
	}),
	nacionalidade: z.string({
		required_error: "Nacionalidade do colaborador não informado.",
		invalid_type_error: "Tipo não válido para nacionalidade do colaborador.",
	}),
	estadoCivil: z.string({ required_error: "Nome do colaborador não informado.", invalid_type_error: "Tipo não válido para nome do colaborador." }),
	grauInstrucao: z.string({
		required_error: "Grau de instrução do colaborador não informado.",
		invalid_type_error: "Tipo não válido para grau de instrução do colaborador.",
	}),
	tituloEleitor: z.string({
		required_error: "Titulo de eleitor do colaborador não informado.",
		invalid_type_error: "Tipo não válido para titulo de eleitor do colaborador.",
	}),
	carteiraTrabalho: z.object({
		pisPaseb: z.string({
			required_error: "PIS/Paseb do colaborador não informado.",
			invalid_type_error: "Tipo não válido para PIS/Paseb do colaborador.",
		}),
		numero: z.string({
			required_error: "Número da carteira de trabalho do colaborador não informado.",
			invalid_type_error: "Tipo não válido para número da carteira de trabalho do colaborador.",
		}),
		serie: z.string({
			required_error: "Número de série da carteira de trabalho do colaborador não informado.",
			invalid_type_error: "Tipo não válido para número de série da carteira de trabalho do colaborador.",
		}),
	}),
	rg: z.string({
		required_error: "RG do colaborador não informado.",
		invalid_type_error: "Tipo não válido para RG do colaborador.",
	}),
	cpf: z.string({
		required_error: "CPF do colaborador não informado.",
		invalid_type_error: "Tipo não válido para CPF do colaborador.",
	}),
	carteiraTransito: z.object({
		numero: z.string({
			required_error: "Número da carteira de trânsito do colaborador não informado.",
			invalid_type_error: "Tipo não válido para número da carteira de trânsito do colaborador.",
		}),
		dataVencimento: z
			.string({
				required_error: "Data de vencimento da carteira de trabalho do colaborador não informada.",
				invalid_type_error: "Tipo não válido para data de vencimento da carteira de trabalho do colaborador.",
			})
			.optional()
			.nullable(),
	}),
	qtdeFilhos: z.number({
		required_error: "Quantidade de filhos do colaborador não informada.",
		invalid_type_error: "Tipo não válido para quantidade de filhos do colaborador.",
	}),
	localizacao: z.object({
		cep: z
			.string({
				required_error: "CEP do colaborador não informado.",
				invalid_type_error: "Tipo não válido para CEP do colaborador.",
			})
			.optional()
			.nullable(),
		uf: z
			.string({
				required_error: "UF de endereço do colaborador não informado.",
				invalid_type_error: "Tipo não válido para UF de endereço do colaborador.",
			})
			.optional()
			.nullable(),
		cidade: z
			.string({
				required_error: "Cidade de endereço do colaborador não informado.",
				invalid_type_error: "Tipo não válido para cidade de endereço do colaborador.",
			})
			.optional()
			.nullable(),
		bairro: z.string({
			required_error: "Bairro de endereço do colaborador não informado.",
			invalid_type_error: "Tipo não válido para bairro de endereço do colaborador.",
		}),
		endereco: z.string({
			required_error: "Logradouro de endereço do colaborador não informado.",
			invalid_type_error: "Tipo não válido para logradouro de endereço do colaborador.",
		}),
		numeroOuIdentificador: z.string({
			required_error: "Número de endereço do colaborador não informado.",
			invalid_type_error: "Tipo não válido para número de endereço do colaborador.",
		}),
	}),
	dataAdmissao: z
		.string({
			required_error: "Data de admissão do colaborador não informado.",
			invalid_type_error: "Tipo não válido para data de admissão do colaborador.",
		})
		.datetime({ message: "Formato inválido para data de admissão." })
		.optional()
		.nullable(),
	cargos: z.array(PositionSchema),
	salarioBase: z.number({
		required_error: "Salário base do colaborador não informado.",
		invalid_type_error: "Tipo não válido para salário base do colaborador.",
	}),
	horariosTrabalho: z.array(WorkingHoursSchema),
	contatosAuxiliares: z.array(AuxiliarContactSchema),
	autor: AuthorSchema,
	dataInsercao: z
		.string({ required_error: "Data de inserção não informada.", invalid_type_error: "Tipo não válido para a data de inserção." })
		.datetime(),
});

export type TEmployee = z.infer<typeof GeneralUserSchema>;
export type TEmployeeDTO = TEmployee & { _id: string };

export type TUser = Pick<
	TEmployee,
	| "acessoAtivo"
	| "nome"
	| "usuario"
	| "email"
	| "telefone"
	| "avatar_url"
	| "visualizacao"
	| "permissoes"
	| "empresaVinculada"
	| "cargos"
	| "dataInsercao"
	| "autor"
>;
export type TUserDTO = Pick<
	TEmployeeDTO,
	| "acessoAtivo"
	| "_id"
	| "nome"
	| "usuario"
	| "email"
	| "telefone"
	| "avatar_url"
	| "visualizacao"
	| "permissoes"
	| "empresaVinculada"
	| "cargos"
	| "dataInsercao"
	| "autor"
>;
