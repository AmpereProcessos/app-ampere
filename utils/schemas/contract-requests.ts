import { z } from 'zod'
import { ProductItemSchema, ServiceItemSchema } from './crm/kits.schema'

const GeneralContractRequestSchema = z.object({
  nomeVendedor: z.string().optional(),
  nomeDoProjeto: z.string(),
  telefoneVendedor: z.string(),
  tipoDeServico: z.string(), // replace with the actual Zod schema for projectTypes
  nomeDoContrato: z.string(),
  telefone: z.string(),
  cpf_cnpj: z.string(),
  rg: z.string(),
  dataDeNascimento: z.string().nullable().optional(),
  cep: z.string(),
  cidade: z.string().nullable().optional(),
  uf: z.string().nullable(), // replace with the actual Zod schema for stateCities
  enderecoCobranca: z.string(),
  numeroResCobranca: z.string(),
  bairro: z.string(),
  pontoDeReferencia: z.string(),
  segmento: z.string().optional(), // replace with the actual Zod schema for customersNich
  formaAssinatura: z.string().optional(), // replace with the actual Zod schema for signMethods
  codigoSVB: z.string(),
  estadoCivil: z.string().nullable().optional(), // replace with the actual Zod schema for maritalStatus
  email: z.string(),
  profissao: z.string(),
  ondeTrabalha: z.string(),
  clienteAmpere: z.enum(['NÃO', 'SIM']).optional().nullable(),
  possuiDeficiencia: z.enum(['NÃO', 'SIM']),
  qualDeficiencia: z.string(),
  canalVenda: z.string().nullable().optional(), // replace with the actual Zod schema for customersAcquisitionChannels
  nomeIndicador: z.string(),
  telefoneIndicador: z.string(),
  comoChegouAoCliente: z.string(),
  nomeContatoJornadaUm: z.string(),
  telefoneContatoUm: z.string(),
  nomeContatoJornadaDois: z.string(),
  telefoneContatoDois: z.string(),
  cuidadosContatoJornada: z.string(),
  nomeTitularProjeto: z.string().optional(),
  tipoDoTitular: z.enum(['PESSOA FISICA', 'PESSOA JURIDICA']).nullable().optional(),
  tipoDaLigacao: z.enum(['NOVA', 'EXISTENTE']).nullable().optional(),
  tipoDaInstalacao: z.enum(['URBANO', 'RURAL']).nullable().optional(),
  cepInstalacao: z.string(),
  enderecoInstalacao: z.string(),
  numeroResInstalacao: z.string().optional(),
  numeroInstalacao: z.string().optional(),
  bairroInstalacao: z.string(),
  cidadeInstalacao: z.string().nullable().optional(),
  ufInstalacao: z.string().nullable(), // replace with the actual Zod schema for stateCities
  pontoDeReferenciaInstalacao: z.string(),
  loginCemigAtende: z.string(),
  senhaCemigAtende: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  potPico: z.number().optional(),
  geracaoPrevista: z.number().optional(),
  produtos: z.array(ProductItemSchema).optional().nullable(),
  servicos: z.array(ServiceItemSchema).optional().nullable(),
  topologia: z.enum(['INVERSOR', 'MICRO-INVERSOR']).nullable().optional(),
  topologiaAnterior: z.enum(['INVERSOR', 'MICRO-INVERSOR']).nullable().optional(),
  marcaInversor: z.string(),
  qtdeInversor: z.string(),
  potInversor: z.string(),
  marcaInversorAnterior: z.string().optional().nullable(),
  qtdeInversorAnterior: z.string().optional().nullable(),
  potInversorAnterior: z.string().optional().nullable(),
  marcaModulos: z.string(),
  qtdeModulos: z.union([z.string(), z.number()]),
  potModulos: z.string(),
  marcaModulosAnterior: z.string().optional().nullable(),
  qtdeModulosAnterior: z.union([z.string(), z.number()]).optional().nullable(),
  potModulosAnterior: z.string().optional().nullable(),
  marcaBateria: z.string().optional().nullable(),
  qtdeBateria: z.union([z.string(), z.number()]).optional().nullable(),
  tipoBateria: z.string().optional().nullable(),
  capacidadeBateria: z.string().optional().nullable(),
  marcaControlador: z.string().optional().nullable(),
  qtdeControlador: z.union([z.string(), z.number()]).optional().nullable(),
  tipoControlador: z.string().optional().nullable(),
  correnteControlador: z.string().optional().nullable(),
  tipoEstrutura: z.string().nullable().optional(), // replace with the actual Zod schema for structureTypes
  materialEstrutura: z.string().nullable().optional(),
  estruturaAmpere: z.enum(['SIM', 'NÃO']),
  mudancaLocal: z.enum(['SIM', 'NÃO']).optional().nullable(),
  tipoDaTelha: z.string().optional().nullable(),
  respVisitaTecnica: z.string().optional().nullable(),
  previsaoValorDoKit: z.number().optional().nullable(),
  laudo: z.string().optional().nullable(),
  responsavelEstrutura: z.enum(['NÃO SE APLICA', 'AMPERE', 'CLIENTE']),
  formaPagamentoEstrutura: z.string().nullable().optional(),
  valorEstrutura: z.number().nullable().optional(),
  possuiOeM: z.enum(['SIM', 'NÃO']),
  planoOeM: z.enum(['PLANO SOL +', 'MANUTENÇÃO SIMPLES', 'NÃO SE APLICA', 'PLANO SOL']),
  clienteSegurado: z.enum(['SIM', 'NÃO']),
  valorSeguro: z.number(),
  tempoSegurado: z.string(),
  formaPagamentoOeMOuSeguro: z.string(),
  valorOeMOuSeguro: z.number().nullable().optional(),
  tipoDoKit: z.enum(['NORMAL', 'PROMO', 'NÃO SE APLICA']).optional().nullable(),
  regional: z.string().optional().nullable(),
  aumentoDeCarga: z.enum(['SIM', 'NÃO']).nullable().optional(),
  caixaConjugada: z.enum(['SIM', 'NÃO']).nullable().optional(),
  tipoDePadrao: z.string().nullable().optional(),
  aumentoDisjuntor: z.enum(['SIM', 'NÃO']).nullable().optional(),
  respTrocaPadrao: z.enum(['NÃO SE APLICA', 'AMPERE', 'CLIENTE']).nullable().optional(),
  formaPagamentoPadrao: z.string().nullable().optional(),
  valorPadrao: z.number().nullable().optional(),
  nomePagador: z.string(),
  contatoPagador: z.string(),
  necessidaInscricaoRural: z.enum(['SIM', 'NÃO']).nullable().optional(),
  inscriçãoRural: z.string(),
  cpf_cnpjNF: z.string(),
  localEntrega: z.string().nullable().optional(),
  entregaIgualCobranca: z.enum(['NÃO', 'SIM', 'NÃO SE APLICA']).nullable().optional(),
  restricoesEntrega: z.string().nullable().optional(),
  valorContrato: z.number().nullable().optional(),
  origemRecurso: z.enum(['FINANCIAMENTO', 'CAPITAL PRÓPRIO']).nullable().optional(),
  numParcelas: z.number().nullable().optional(),
  valorParcela: z.number().nullable().optional(),
  credor: z.string().nullable().optional(), // replace with the actual Zod schema for creditors
  nomeGerente: z.string(),
  contatoGerente: z.string(),
  necessidadeNFAdiantada: z.enum(['SIM', 'NÃO']).nullable().optional(),
  necessidadeCodigoFiname: z.enum(['SIM', 'NÃO']).nullable().optional(),
  formaDePagamento: z.string().nullable().optional(),
  descricaoNegociacao: z.string(),
  possuiDistribuicao: z.enum(['SIM', 'NÃO']).nullable().optional(),
  realizarHomologacao: z.boolean().optional(),
  previsaoCustos: z.number().optional().nullable(),
  obsComercial: z.string().optional(),
  insider: z.string().optional().nullable(),
  distribuicoes: z.array(z.object({ numInstalacao: z.string(), excedente: z.number().optional() })),
  links: z
    .array(z.object({ title: z.string(), link: z.string(), format: z.string() }))
    .nullable()
    .optional(),
  linkDrive: z.string().optional().nullable(),
  nomeParceiro: z.string().optional().nullable(),
  idParceiro: z.string().optional().nullable(),
  idHomologacao: z.string().optional().nullable(),
  idVisitaTecnica: z.string().optional().nullable(),
  idProjetoCRM: z.string().optional().nullable(),
  idPropostaCRM: z.string().optional().nullable(),
  idProjetoApp: z.string().optional().nullable(),
  idOportunidade: z.string().optional().nullable(),
  aprovacao: z.boolean().optional().nullable(),
  confeccionado: z.boolean().optional().nullable(),
  dataAprovacao: z.string().datetime().optional().nullable(),
  dataSolicitacao: z.string().datetime(),
})

export type TContractRequest = z.infer<typeof GeneralContractRequestSchema>

export type TContractRequestDTO = TContractRequest & { _id: string }

export type TContractRequestPartialDTO = Pick<
  TContractRequestDTO,
  | '_id'
  | 'nomeDoContrato'
  | 'codigoSVB'
  | 'nomeVendedor'
  | 'tipoDeServico'
  | 'cidade'
  | 'cidadeInstalacao'
  | 'idVisitaTecnica'
  | 'idProjetoCRM'
  | 'idPropostaCRM'
  | 'confeccionado'
  | 'aprovacao'
  | 'nomeParceiro'
  | 'dataSolicitacao'
  | 'dataAprovacao'
>
