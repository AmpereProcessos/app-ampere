import { z } from 'zod'

export const PhysicalAssetSchema = z.object({
  nome: z.string({ required_error: 'Nome do ativo não informado.', invalid_type_error: 'Tipo não válido para o nome do ativo.' }),
  nomeTecnico: z.string({
    required_error: 'Nome técnico do ativo não informado.',
    invalid_type_error: 'Tipo não válido para o nome técnico do ativo.',
  }),
  natureza: z.enum(['FUNGÍVEL', 'NÃO FUNGÍVEL']),
  descricao: z.string({ required_error: 'Descrição do ativo não informada.', invalid_type_error: 'Tipo não válido para a descrição do ativo.' }),
  codigo: z.string({
    required_error: 'Código ou número de série do ativo não informado.',
    invalid_type_error: 'Tipo não válido para o código ou número de série do ativo.',
  }),
  dataInsercao: z.string({
    required_error: 'Data de inserção do ativo não informada.',
    invalid_type_error: 'Tipo não válido para a data de inserção do ativo.',
  }),
})

export const AllocationSchema = z.object({
  ativoId: z.string({
    required_error: 'ID do ativo de referência não informado.',
    invalid_type_error: 'Tipo não válido para o ID do ativo de referência.',
  }),
  alocadorId: z.string({ required_error: 'ID do alocador não informado.', invalid_type_error: 'Tipo não válido para o ID do alocador.' }),
  qtde: z.number({ required_error: 'Quantidade de alocação não informada.', invalid_type_error: 'Tipo não válido para a quantidade de alocação.' }),
  qtdeMaxima: z.number({
    required_error: 'Quantidade máxima de alocação não informada.',
    invalid_type_error: 'Tipo não válido para a quantidade máxima de alocação.',
  }),
  qtdeMinima: z.number({
    required_error: 'Quantidade mínima de alocação não informada.',
    invalid_type_error: 'Tipo não válido para a quantidade mínima de alocação.',
  }),
  localizacao: z.string({
    required_error: 'Localização do ativo não informada.',
    invalid_type_error: 'Tipo não válido para a localização do ativo.',
  }),
  unidade: z.string({ required_error: 'Unidade do ativo não informada.', invalid_type_error: 'Tipo não válido para a unidade do ativo.' }),
  precoUnitario: z.number({
    required_error: 'Preço unitário do ativo não informado.',
    invalid_type_error: 'Tipo não válido para o preço unitário do ativo.',
  }),
  recontagem: z.object({
    data: z.string({ invalid_type_error: 'Tipo não válido para a data da recontagem.' }).optional().nullable(),
    responsavel: z.string({ invalid_type_error: 'Tipo não válido para o responsável pela recontagem.' }).optional().nullable(),
  }),
  dataInsercao: z.string({
    required_error: 'Data de inserção do ativo não informada.',
    invalid_type_error: 'Tipo não válido para a data de inserção do ativo.',
  }),
})

export const AssetMovementSchema = z.object({
  tipo: z.enum(['ENTRADA', 'SAÍDA', 'DEVOLUÇÃO', 'ALTERAÇÃO MANUAL']),
  alteracaoQtde: z.number({ required_error: 'Alteração não informada.', invalid_type_error: 'Tipo não válido para a alteração.' }),
  idFormulario: z.string({ invalid_type_error: 'Tipo não válido para o ID do formulário.' }).optional().nullable(),
  ativo: z.object({
    id: z.string({ required_error: 'ID do ativo não informado.', invalid_type_error: 'Tipo não válido para o ID do ativo.' }),
    nome: z.string({ required_error: 'Nome do ativo não informado.', invalid_type_error: 'Tipo não válido para o nome do ativo.' }),
  }),
  projeto: z.object({
    id: z.string({ invalid_type_error: 'Tipo não válido para o ID do projeto.' }).optional().nullable(),
    nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do projeto.' }).optional().nullable(),
  }),
  qtdeAnterior: z.number({ invalid_type_error: 'Tipo não válido para a quantidade anterior.' }).optional().nullable(),
  qtdeNovo: z.number({ invalid_type_error: 'Tipo não válido para a quantidade nova.' }).optional().nullable(),
  precoAnterior: z.number({ invalid_type_error: 'Tipo não válido para o preço anterior.' }).optional().nullable(),
  precoNovo: z.number({ invalid_type_error: 'Tipo não válido para o preço novo.' }).optional().nullable(),
  autor: z.object({
    id: z.string({ required_error: 'ID do autor não informado.', invalid_type_error: 'Tipo não válido para o ID do autor.' }),
    nome: z.string({ required_error: 'Nome do autor não informado.', invalid_type_error: 'Tipo não válido para o nome do autor.' }),
    avatar_url: z.string({ invalid_type_error: 'Tipo não válido para a URL do avatar do autor.' }).optional().nullable(),
  }),
  dataInsercao: z.string({ required_error: 'Data de inserção não informada.', invalid_type_error: 'Tipo não válido para a data de inserção.' }),
})
