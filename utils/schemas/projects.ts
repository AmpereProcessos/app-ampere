import z from 'zod'
import { TActivityDTO } from './activities'
import { ObjectId } from 'mongodb'
const GeneralProjectSchema = z.object({
  app: z.object({
    data: z.string().optional().nullable(),
    login: z.string().optional().nullable(),
    senha: z.union([z.string(), z.number()]).optional().nullable(),
  }),
  bairro: z.string(),
  canalVenda: z.string(),
  cep: z.union([z.string(), z.number()]),
  cidade: z.string(),
  codigoSVB: z.union([z.string(), z.number()]),
  comissionamento: z
    .object({
      comercial: z.boolean().optional().nullable(),
      suprimentos: z.boolean().optional().nullable(),
      projetos: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
  comissoes: z
    .object({
      efetivado: z.boolean().optional().nullable(),
      pagamentoRealizado: z.boolean().optional().nullable(),
      porcentagemVendedor: z.number().optional().nullable(),
      porcentagemInsider: z.number().optional().nullable(),
    })
    .optional()
    .nullable(),
  compra: z.object({
    dataEntrega: z.string().optional().nullable(),
    dataLiberacao: z.string().optional().nullable(),
    dataMaxPagamento: z.string().optional().nullable(),
    dataPagamento: z.string().optional().nullable(),
    dataPedido: z.string().optional().nullable(),
    fornecedor: z.string().optional().nullable(),
    informacoes: z.string().optional().nullable(),
    kitInfo: z.string().optional().nullable(),
    liberacao: z.boolean().optional().nullable(),
    localEntrega: z.string().optional().nullable(),
    previsaoEntrega: z.string().optional().nullable(),
    previsaoValorDoKit: z.number().optional().nullable(),
    rastreio: z.string().optional().nullable(),
    status: z.string().optional().nullable(), // select-options
    statusEntrega: z.string().optional().nullable(), // select-options,
    statusLiberacao: z.string().optional().nullable(), // select-options,
    tipoDoKit: z.string().optional().nullable(), // select-options,
    valorDoKit: z.number().optional().nullable(),
  }),
  conferencias: z.object({
    energiaInjetada: z.object({ data: z.string(), status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]) }),
    monitoramentoFeito: z.object({ data: z.string(), status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]) }),
    usinaLigada: z.object({ data: z.string(), status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]) }),
  }),
  contrato: z.object({
    dataAssinatura: z.string().optional().nullable(),
    dataLiberacao: z.string().optional().nullable(),
    dataSolicitacao: z.string().optional().nullable(),
    formaAssinatura: z.union([z.literal('FISICO'), z.literal('DIGITAL')]),
    status: z.string().optional().nullable(),
  }),
  cpf_cnpj: z.union([z.string(), z.number()]),
  dadosCemig: z.object({
    distCreditos: z.union([z.literal('NÃO'), z.literal('SIM'), z.literal('NÃO DEFINIDO')]),
    numeroInstalacao: z.union([z.string(), z.number()]),
    qtdeDistCreditos: z.number().optional().nullable(),
    titularProjeto: z.string(),
  }),
  dataNascimneto: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  estruturaPersonalizada: z.object({
    aplicavel: z
      .union([z.literal('SIM'), z.literal('NÃO')])
      .optional()
      .nullable(),
    dataEntrega: z.string().optional().nullable(),
    dataMontagem: z.string().optional().nullable(),
    respPagamento: z
      .union([z.literal('CLIENTE'), z.literal('AMPERE'), z.literal('NÃO SE APLICA')])
      .optional()
      .nullable(),
    status: z.string().optional().nullable(),
    statusEntrega: z.string(),
    tipo: z.string().optional().nullable(),
    valor: z.number().optional().nullable(),
  }),
  faturamento: z.object({
    cnpjFaturamento: z.union([z.number(), z.string()]),
    concluido: z.boolean().optional().nullable(),
    dataFaturamento: z.string().optional().nullable(),
    empresaFaturamento: z.union([z.literal('AMPERE ENERGIAS'), z.literal('ANALISE DO FINANCEIRO'), z.literal('IZAIRA SERVIÇOS')]),
    observacoes: z.string().optional().nullable(),
    previsaoFaturamento: z.string().optional().nullable(),
  }),
  idProjetoCRM: z.string().optional().nullable(),
  idPropostaCRM: z.string().optional().nullable(),
  idSolicitacaoContrato: z.string().optional().nullable(),
  idVisitaTecnica: z.string().optional().nullable(),
  indicacao: z.object({
    contato: z.string().optional().nullable(),
    quemIndicou: z.string().optional().nullable(),
  }),
  insider: z.string().optional().nullable(),
  jornada: z.object({
    assDocumentacoes: z.boolean().optional().nullable(),
    boasVindas: z.boolean().optional().nullable(),
    compraDoKit: z.boolean().optional().nullable(),
    dataEntregaTecnicaPresencial: z.string(),
    dataEntregaTecnicaRemota: z.string(),
    dataNps: z.string().optional().nullable(),
    dataUltimoContato: z.string().optional().nullable(),
    entregaDoKit: z.boolean().optional().nullable(),
    entregaTecnica: z.boolean().optional().nullable(),
    entregaTecnicaPresencial: z.boolean().optional().nullable(),
    instalacaoAgendada: z.boolean().optional().nullable(),
    instalacaoRealizada: z.boolean().optional().nullable(),
    jornadaConcluida: z.boolean().optional().nullable(),
    nfFaturada: z.boolean().optional().nullable(),
    obsJornada: z.string().optional().nullable(),
    obsNps: z.string().optional().nullable(),
    prevChegada: z.boolean().optional().nullable(),
    respConcessionaria: z.boolean().optional().nullable(),
    sistemaLigado: z.boolean().optional().nullable(),
    tipoEntregaTecnica: z.union([z.literal('REMOTO'), z.literal('PRESENCIAL')]),
    vistoriaConcessionaria: z.boolean().optional().nullable(),
    contatos: z.string().optional().nullable(),
    cuidados: z.string().optional().nullable(),
  }),
  linkDrive: z.string(),
  links: z.object({
    chamadosSuporte: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    chamadosSuprimentos: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    contratos: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    documentos: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    equipamentos: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    manutencaoPreventiva: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    obras: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    projetos: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
    visitaTecnica: z.array(
      z.object({
        title: z.string(),
        link: z.string(),
        format: z.string(),
        category: z.string(),
        // Define the schema for LinksItem here
      })
    ),
  }),
  logradouro: z.string(),
  manutencaoPreventiva: z.object({
    data: z.string().optional().nullable(),
    status: z.union([z.literal('NÃO REALIZADO'), z.literal('REALIZADO')]),
  }),
  material: z.object({
    avarias: z.boolean().optional().nullable(),
    chamadoIrregularidade: z.boolean().optional().nullable(), // EXCLUIR,
    conferenciaFeita: z.boolean().optional().nullable(),
    descricaoProblema: z.string().optional().nullable(),
    disjuntores: z
      .array(
        z.object({
          corrente: z.number(),
          qtde: z.number(),
          tipo: z.union([z.literal('MONOFÁSICO'), z.literal('BIFÁSICO'), z.literal('TRIFÁSICO')]),
        })
      )
      .optional()
      .nullable(),
    previsaoCustos: z.number().optional().nullable(),
    efetivoCustos: z.number().optional().nullable(),
    entregaFaltando: z.boolean().optional().nullable(),
    materialFaltante: z.boolean().optional().nullable(),
    statusSeparacao: z.union([z.literal('SEPARADO'), z.literal('NÃO DEFINIDO'), z.literal('INICIAR SEPARAÇÃO')]),
  }),
  medidor: z.object({
    data: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
  }),
  nomeDoContrato: z.string(),
  nomeDoProjeto: z.string(),
  nps: z.number().optional().nullable(),
  numeroResidencia: z.union([z.string(), z.number()]),
  obra: z.object({
    checklist: z
      .union([z.literal('SIM'), z.literal('NÃO')])
      .optional()
      .nullable(),
    entrada: z.string().optional().nullable(),
    equipeResp: z.string().optional().nullable(),
    laudo: z
      .union([z.literal('EMITIDO'), z.literal('EM ESTUDO'), z.literal('NÃO DEFINIDO')])
      .optional()
      .nullable(),
    observacoes: z.string(),
    saida: z.string().optional().nullable(),
    statusDaObra: z.string().optional().nullable(), // select-options
    statusSolicitacao: z.string().optional().nullable(),
    trafo: z.string().optional().nullable(),
  }),
  obsComercial: z.string().optional().nullable(),
  oem: z.object({
    aplicavel: z.boolean().optional().nullable(),
    diagnostico: z.string().optional().nullable(),
    duracao: z.number().optional().nullable(),
    oemConcluido: z.boolean().optional().nullable(),
    plano: z.string().optional().nullable(),
    qtdeManutencoes: z.number().optional().nullable(),
    valor: z.number().optional().nullable(),
  }),
  ondeTrabalha: z.string(),
  padrao: z.object({
    caixaConjugada: z.string().optional().nullable(),
    respInstalacao: z
      .union([z.literal('CLIENTE'), z.literal('AMPERE'), z.literal('NÃO SE APLICA')])
      .optional()
      .nullable(),
    respPagamento: z.string().optional().nullable(),
    tipo: z.string().optional().nullable(),
    tipoEntrada: z
      .union([z.literal('AÉREA'), z.literal('SUBTERRÂNEO')])
      .optional()
      .nullable(),
    valor: z.number().optional().nullable(),
  }),
  pagamento: z.object({
    cobrancaFeita: z.boolean(),
    contatoPagador: z.string(),
    credor: z.string().optional().nullable(), // select options
    dataRecebimento: z.string().optional().nullable(),
    forma: z.union([z.literal('FINANCIAMENTO'), z.literal('CAPITAL PRÓPRIO')]),
    pagador: z.string(),
    retorno: z.number().optional().nullable(),
    status: z.string().optional().nullable(), // select options
  }),
  parecer: z.object({
    dataParecerDeAcesso: z.string().optional().nullable(),
    motivoReprova: z.string().optional().nullable(),
    parecerReprovado: z.string().optional().nullable(),
    pendencias: z.string().optional().nullable(),
    qtdeDiasObraDeRede: z.string().optional().nullable(),
    qtdeReprovas: z.string().optional().nullable(),
    statusDoParecerDeAcesso: z.string().optional().nullable(), // select options
  }),
  possuiaGB: z.boolean().optional().nullable(),
  possuiDeficiencia: z
    .union([z.literal('SIM'), z.literal('NÃO')])
    .optional()
    .nullable(),
  projeto: z.object({
    acStatus: z.string().optional().nullable(), // select options
    aumentoDeCarga: z.union([z.literal('SIM'), z.literal('NÃO')]),
    dataLiberacaoDocumentacao: z.string(),
    dataAssDocumentacao: z.string().optional().nullable(),
    dataSolicitacaoAcesso: z.string().optional().nullable(),
    desenhoTelhado: z.string().optional().nullable(),
    diagramaUnifilar: z.string(),
    mapaDeMicro: z.string().optional().nullable(),
    fechamentoAC: z.string().optional().nullable(),
    formaAssDocumentacao: z
      .union([z.literal('DIGITAL'), z.literal('FISICA')])
      .optional()
      .nullable(),
    iniciar: z
      .union([z.literal('SIM'), z.literal('NÃO'), z.literal('NÃO DEFINIDO')])
      .optional()
      .nullable(),
    projetista: z.object({
      nome: z.string(),
      codigo: z.string(),
    }),
    projetoConcluido: z.union([z.literal('SIM'), z.literal('NÃO')]),
    realizarHomologacao: z.boolean().optional().nullable(),
  }),
  qtde: z.number(),
  qualDeficiencia: z.string().optional().nullable(),
  regional: z.string().nullable(),
  relatorios: z.object({
    envioUm: z.object({
      data: z.string().optional().nullable(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioDois: z.object({
      data: z.string().optional().nullable(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioTres: z.object({
      data: z.string().optional().nullable(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioQuatro: z.object({
      data: z.string().optional().nullable(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
  }),
  segmento: z.union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')]),
  sistema: z.object({
    capacidadeBateria: z.number().optional().nullable(),
    marcaBateria: z.string(),
    qtdeBateria: z.number().optional().nullable(),
    tipoBateria: z.string(),
    marcaBomba: z.string(),
    potBomba: z.number().optional().nullable(),
    qtdeBomba: z.number().optional().nullable(),
    marcaControlador: z.string(),
    correnteControlador: z.number().optional().nullable(),
    qtdeControlador: z.number().optional().nullable(),
    tipoControlador: z.string(),
    inversor: z.string(),
    potModulos: z.number().optional().nullable(),
    qtdeModulos: z.number().optional().nullable(),
    potPico: z.number(),
    topologia: z
      .union([z.literal('MICRO'), z.literal('INVERSOR'), z.literal('OTIMIZADOR')])
      .optional()
      .nullable(),
    valorProjeto: z.number(),
  }),
  telefone: z.string().optional().nullable(),
  uf: z.string(), // select options
  vendedor: z.object({
    codigo: z.number().optional().nullable(),
    nome: z.string(),
  }),
  tipoDeServico: z.string(),
  visitaTecnica: z.object({
    amperagem: z.string().optional().nullable(),
    saidaDoCliente: z
      .union([z.literal('AEREO'), z.literal('SUBTERRANEO')])
      .optional()
      .nullable(),
    status: z.string().optional().nullable(),
    tecnico: z.string().optional().nullable(),
    tipoDaTelha: z.string().optional().nullable(),
  }),
  vistoria: z.object({
    dataPedido: z.string().optional().nullable(),
    equipeDeCampoNecessaria: z
      .union([z.literal('SIM'), z.literal('NÃO')])
      .optional()
      .nullable(),
    motivoReprova: z.string().optional().nullable(),
    qtdeReprovas: z.number().optional().nullable(),
    status: z.string().optional().nullable(), // select options
    vistoriaReprovada: z
      .union([z.literal('SIM'), z.literal('NÃO')])
      .optional()
      .nullable(),
  }),
})

export type TProject = z.infer<typeof GeneralProjectSchema>
export type TProjectEntity = TProject & { _id: ObjectId }
export type TProjectDTO = TProject & { _id: string; atividades?: TActivityDTO[] }
