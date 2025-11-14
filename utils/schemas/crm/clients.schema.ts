import { z } from "zod";

import { ObjectId } from "mongodb";

export const GeneralClientSchema = z.object({
	representante: z.object({
		id: z.string(),
		nome: z.string(),
	}),
	nome: z.string(),
	idParceiro: z.string().optional().nullable(),
	idOportunidade: z.string().optional().nullable(),
	idIndicacao: z.string().optional().nullable(),
	cpfCnpj: z.string().optional().nullable(),
	telefonePrimario: z.string(),
	telefoneSecundario: z.string().optional().nullable(),
	email: z.string(),
	cep: z.string(),
	bairro: z.string(),
	endereco: z.string(),
	numeroOuIdentificador: z.string(),
	complemento: z.string(),
	uf: z.string(),
	cidade: z.string(),
	dataNascimento: z.string().optional().nullable(),
	rg: z.string().optional().nullable(),
	estadoCivil: z.string().optional().nullable(),
	profissao: z.string().optional().nullable(),
	ondeTrabalha: z.string().optional().nullable(),
	canalVenda: z.string().optional().nullable(),
	indicador: z.string().optional().nullable(),
	dataInsercao: z.string().datetime(),
});

export const InsertClientSchema = z.object({
	representante: z.object(
		{
			id: z.string({ required_error: "Informe o ID do representante." }),
			nome: z.string({ required_error: "Informe o nome do representante." }),
		},
		{
			required_error: "Por favor, especifique o representante.",
			invalid_type_error: "Por favor, especifique o representante.",
		},
	),
	nome: z
		.string({
			required_error: "Por favor, preencha o nome do cliente.",
			invalid_type_error: "Por favor, preencha o nome do cliente.",
		})
		.min(5, { message: "Por favor, preencha um nome com ao menos 5 letras." }),
	idParceiro: z.string().optional().nullable(),
	idOportunidade: z.string().optional().nullable(),
	idIndicacao: z.string().optional().nullable(),
	cpfCnpj: z
		.string({
			required_error: "Por favor, preencha o CPF ou CNPJ do cliente.",
			invalid_type_error: "Por favor, preencha o CPF ou CNPJ do cliente.",
		})
		.optional(),
	telefonePrimario: z
		.string({
			required_error: "Por favor, preencha o telefone do cliente.",
			invalid_type_error: "Por favor, preencha o telefone do cliente.",
		})
		.min(11, "Por favor, preencha um um telefone válido."),
	telefoneSecundario: z.string().optional(),
	email: z.string({
		required_error: "Por favor, preencha o email do cliente.",
		invalid_type_error: "Por favor, preencha o email do cliente.",
	}),
	cep: z.string({ required_error: "Por favor, preencha o CEP do cliente." }),
	bairro: z.string({
		required_error: "Por favor, preencha o bairro do cliente.",
	}),
	endereco: z.string({
		required_error: "Por favor, preencha o endereço do cliente.",
		invalid_type_error: "Por favor, preencha o endereço do cliente.",
	}),
	numeroOuIdentificador: z.string({
		required_error: "Por favor, preencha o número ou código que identifique a residência.",
		invalid_type_error: "Por favor, preencha o número ou código que identifique a residência.",
	}),
	complemento: z.string(),
	uf: z.string({ required_error: "Por vavor, preencha a UF do cliente.", invalid_type_error: "Tipo não válido para a UF do cliente." }),
	cidade: z.string({
		required_error: "Por favor, preencha a cidade do cliente.",
		invalid_type_error: "Por favor, preencha a cidade do cliente.",
	}),
	indicador: z.string().optional(),
	canalVenda: z.string().optional().nullable(),
	dataInsercao: z.string().datetime(),
});

export const ClientEntitySchema = z.object({
	_id: z.instanceof(ObjectId),
	representante: z.object({
		id: z.string(),
		nome: z.string(),
	}),
	nome: z.string(),
	idParceiro: z.string().optional().nullable(),
	idOportunidade: z.string().optional().nullable(),
	idIndicacao: z.string().optional().nullable(),
	cpfCnpj: z.string().optional().nullable(),
	telefonePrimario: z.string(),
	telefoneSecundario: z.string().optional().nullable(),
	email: z.string(),
	cep: z.string(),
	bairro: z.string(),
	endereco: z.string(),
	numeroOuIdentificador: z.string(),
	complemento: z.string(),
	uf: z.string(),
	cidade: z.string(),
	dataNascimento: z.string().optional().nullable(),
	rg: z.string().optional().nullable(),
	estadoCivil: z.string().optional().nullable(),
	profissao: z.string().optional().nullable(),
	ondeTrabalha: z.string().optional().nullable(),
	canalVenda: z.string().optional().nullable(),
	indicador: z.string().optional().nullable(),
	dataInsercao: z.string().datetime(),
});

export type TCRMClient = z.infer<typeof GeneralClientSchema>;

export type TCRMClientDTO = TCRMClient & { _id: string };
