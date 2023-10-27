import { z } from 'zod'
import {
  inverterFixationOptions,
  roofTiles,
  structureTypes,
  technicalAnalysisPendencyCategories,
  technicalAnalysisSolicitationTypes,
  units,
} from './utils/select-options'
interface IProject {
  _id: string
  qtde: number
  nomeDoContrato: string
  nomeDoProjeto: string
  codigoSVB: number | string
  tipoDeServico: string
  regional: 'REGIONAL ITUIUTABA' | 'REGIONAL UBERLÂNDIA'
  vendedor: {
    nome: string
    codigo: number
  }
  cep: string
  uf: 'MG' | 'GO' | string
  cidade: string
  bairro: string
  logradouro: string
  numeroResidencia: string
  cpf_cnpj: string
  dataNascimento: string
  email: string
  linkDrive: string
  segmento: 'RESIDENCIAL' | 'RURAL' | 'COMERCIAL' | 'INDUSTRIAL'
  telefone: string
  ondeTrabalha: string
  possuiaGD: boolean
  idVisitaTecnica: string
  canalVenda: string
  insider: string
  obsComercial: string
  nps: number
  idProjetoCRM: string
  idPropostaCRM: string
  idSolicitacaoContrato: string
  possuiDeficiencia: string
  qualDeficiencia: string
  visitaTecnica: {
    amperagem: string
    saidaDoCliente: 'AEREO' | 'SUBTERRANEO'
    status: string
    tecnico: string
    tipoDaTelha: string
  }

  contrato: {
    comissaoPaga: boolean
    comissaoVendedor: number
    dataAssinatura: string
    dataLiberacao: string
    dataSolicitacao: string
    formaAssinatura: 'FISICO' | 'DIGITAL'
    status: string
  }

  compra: {
    dataEntrega: string
    dataLiberacao: string
    dataMaxPagamento: string
    dataPagamento: string
    dataPedido: string
    fornecedor: string
    informacoes: string
    kitInfo: string
    localEntrega: string
    previsaoEntrega: string
    rastreio: string
    statusEntrega: string
    statusLiberacao: string
    tipoDoKit: 'NORMAL' | 'PROMO' | 'NÃO DEFINIDO'
    valorDoKit: number
    previsaoValorDoKit?: number | null
  }

  dadosCemig: {
    distCreditos: 'NÃO' | 'SIM'
    numeroInstalacao: number
    qtdeDistCreditos: number
    titularProjeto: string
  }

  projeto: {
    acStatus: string
    aumentoDeCarga: 'SIM' | 'NÃO'
    dataLiberacaoDocumentacao: string
    dataAssDocumentacao: string
    dataSolicitacaoAcesso: string
    desenhoTelhado: string
    diagramaUnifilar: string
    mapaDeMicro: string
    fechamentoAC: string
    formaAssDocumentacao: 'DIGITAL' | 'FISICA'
    iniciar: 'SIM' | 'NÃO' | 'NÃO DEFINIDO'
    projetista: {
      nome: string
      codigo: string
    }
    projetoConcluido: 'SIM' | 'NÃO'
  }

  sistema: {
    capacidadeBateria: number
    marcaBateria: string
    qtdeBateria: number
    tipoBateria: string
    marcaBomba: string
    potBomba: number
    qtdeBomba: number
    marcaControlador: string
    correnteControlador: number
    qtdeControlador: number
    tipoControlador: string
    inversor: string
    potModulos: number
    qtdeModulos: number
    potPico: number
    topologia: 'MICRO' | 'INVERSOR' | 'OTIMIZADOR'
    valorProjeto: number
  }

  padrao: {
    caixaConjugada: 'SIM' | 'NÃO' | 'NÃO DEFINIDO'
    respInstalacao: 'AMPERE' | 'CLIENTE' | 'NÃO SE APLICA'
    respPagamento: string
    tipo: string
    tipoEntrega: 'AÉREA' | 'SUBTERRÂNEO'
    valor: number
  }

  estruturaPersonalizada: {
    aplicavel: 'SIM' | 'NÃO'
    dataEntrega: string
    statusEntrega: string
    dataMontagem: string
    pagTerceiro: boolean
    respPagamento: 'CLIENTE' | 'AMPERE' | 'NÃO SE APLICA'
    status: 'PRONTA' | 'N/A' | 'PENDÊNCIA'
    tipo: string
    valor: number
  }

  pagamento: {
    cobrancaFeita: boolean
    pagador: string
    contatoPagador: string
    credor: string
    dataRecebimento: string
    forma: 'FINANCIAMENTO' | 'CAPITAL PRÓPRIO'
    retorno: number
    status: string
  }

  parecer: {
    dataParecerDeAcesso: string
    motivoReprova: string
    parecerReprovado: 'SIM' | 'NÃO'
    pendencias: string
    qtdeDiasObraDeRede: number
    qtdeReprovas: number
    statusDoParecerDeAcesso: string
  }

  obra: {
    checklist: 'SIM' | 'NÃO'
    entrada: string
    saida: string
    equipeResp: string
    laudo: 'EMITIDO' | 'EM ESTUDO' | 'NÃO DEFINIDO'
    observacoes: string
    statusDaObra: string
    statusSolicitacao: string
    trafo: 'SIM' | 'NÃO'
  }

  vistoria: {
    dataPedido: string
    equipeDeCampoNecessaria: 'SIM' | 'NÃO'
    motivoReprova: string
    qtdeReprovas: number
    status: string
    vistoriaReprovada: 'SIM' | 'NÃO'
  }

  material: {
    avarias: boolean
    chamadoIrregularidade: boolean
    conferenciaFeita: boolean
    descricaoProblema: string
    disjuntores: {
      corrente: number
      qtde: number
      tipo: 'MONOFÁSICO' | 'BIFÁSICO' | 'TRIFÁSICO'
    }[]
    previsaoCustos: number
    efetivoCustos: number
    entregaFaltando: boolean
    formularioId: string
    lista: MaterialListItem[]
    materialFaltante: boolean
    statusSeparacao: 'SEPARADO' | 'NÃO DEFINIDO' | 'INICIAR SEPARAÇÃO'
  }

  medidor: {
    data: string
    status: string
  }

  oem: {
    aplicavel: boolean
    diagnostico: string
    duracao: number
    oemConcluido: boolean
    plano: string
    qtdeManutencao: number
    valor: number
  }

  app: {
    login: string
    senha: string
    data: Date | string
  }

  comissionamento: {
    comercial: boolean
    projetos: boolean
    suprimentos: boolean
  }

  conferencias: {
    energiaInjetada: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
    monitoramentoFeito: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
    usinaLigada: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
  }

  relatorios: {
    envioUm: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
    envioDois: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
    envioTres: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
    envioQuatro: {
      data: string
      status: 'REALIZADO' | 'NÃO REALIZADO'
    }
  }

  faturamento: {
    concluido: boolean
    cnpjFaturamento: string
    empresaFaturamento: 'AMPERE ENERGIAS' | 'ANALISE DO FINANCEIRO' | 'IZAIRA SERVIÇOS'
    previsaoFaturamento: string
  }

  indicacao: {
    contato: string
    quemIndicou: string
  }

  jornada: {
    assDocumentacoes: boolean
    boasVindas: boolean
    compraDoKit: string
    dataEntregaTecnicaPresencial: string
    dataEntregaTecnicaRemota: string
    dataNps: string
    dataUltimoContato: string
    entregaDoKit: boolean
    entregaTecnica: boolean
    entregaTecnicaPresencial: boolean
    instalacaoAgendada: boolean
    instalacaoRealizada: boolean
    jornadaConcluida: boolean
    nfFaturada: boolean
    obsJornada: string
    obsNps: string
    prevChegada: boolean
    respConcessionaria: boolean
    sistemaLigado: boolean
    tipoEntregaTecnica: 'REMOTO' | 'PRESENCIAL'
    vistoriaConcessionaria: boolean
    contatos: string
    cuidados: string
  }

  links: {
    chamadosSuporte: LinksItem[]
    chamadosSuprimentos: LinksItem[]
    contratos: LinksItem[]
    documentos: LinksItem[]
    equipamentos: LinksItem[]
    manutencaoPreventiva: LinksItem[]
    obras: LinksItem[]
    projetos: LinksItem[]
    visitaTecnica: LinksItem[]
  }

  manutencaoPreventiva: {
    data: string
    status: string
  }

  ordensDeServico: any[]
}
const Project = z.object({
  _id: z.string(),
  qtde: z.number(),
  nomeDoContrato: z.string(),
  nomeDoProjeto: z.string(),
  codigoSVB: z.union([z.string(), z.number()]),
  tipoDeServico: z.string(),
  regional: z.union([z.literal('REGIONAL ITUIUTABA'), z.literal('REGIONAL UBERLÂNDIA')]),
  vendedor: z.object({
    nome: z.string(),
    codigo: z.number(),
  }),
  cep: z.string(),
  uf: z.union([z.literal('MG'), z.literal('GO'), z.string()]),
  cidade: z.string(),
  bairro: z.string(),
  logradouro: z.string(),
  numeroResidencia: z.string(),
  cpf_cnpj: z.string(),
  dataNascimento: z.string(),
  email: z.string().email(),
  linkDrive: z.string(),
  segmento: z.union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL')]),
  telefone: z.string(),
  ondeTrabalha: z.string(),
  possuiaGD: z.boolean(),
  idVisitaTecnica: z.string(),
  canalVenda: z.string(),
  insider: z.string(),
  obsComercial: z.string(),
  nps: z.number(),
  idProjetoCRM: z.string(),
  idPropostaCRM: z.string(),
  idSolicitacaoContrato: z.string(),
  possuiDeficiencia: z.string(),
  qualDeficiencia: z.string(),
  visitaTecnica: z.object({
    amperagem: z.string(),
    saidaDoCliente: z.union([z.literal('AEREO'), z.literal('SUBTERRANEO')]),
    status: z.string(),
    tecnico: z.string(),
    tipoDaTelha: z.string(),
  }),

  contrato: z.object({
    comissaoPaga: z.boolean(),
    comissaoVendedor: z.number(),
    dataAssinatura: z.string(),
    dataLiberacao: z.string(),
    dataSolicitacao: z.string(),
    formaAssinatura: z.union([z.literal('FISICO'), z.literal('DIGITAL')]),
    status: z.string(),
  }),

  compra: z.object({
    dataEntrega: z.string(),
    dataLiberacao: z.string(),
    dataMaxPagamento: z.string(),
    dataPagamento: z.string(),
    dataPedido: z.string(),
    fornecedor: z.string(),
    informacoes: z.string(),
    kitInfo: z.string(),
    localEntrega: z.string(),
    previsaoEntrega: z.string(),
    rastreio: z.string(),
    statusEntrega: z.string(),
    statusLiberacao: z.string(),
    tipoDoKit: z.union([z.literal('NORMAL'), z.literal('PROMO'), z.literal('NÃO DEFINIDO')]),
    valorDoKit: z.number(),
    previsaoValorDoKit: z.union([z.number(), z.null()]),
  }),

  dadosCemig: z.object({
    distCreditos: z.union([z.literal('NÃO'), z.literal('SIM')]),
    numeroInstalacao: z.number(),
    qtdeDistCreditos: z.number(),
    titularProjeto: z.string(),
  }),

  projeto: z.object({
    acStatus: z.string(),
    aumentoDeCarga: z.union([z.literal('SIM'), z.literal('NÃO')]),
    dataLiberacaoDocumentacao: z.string(),
    dataAssDocumentacao: z.string(),
    dataSolicitacaoAcesso: z.string(),
    desenhoTelhado: z.string(),
    diagramaUnifilar: z.string(),
    mapaDeMicro: z.string(),
    fechamentoAC: z.string(),
    formaAssDocumentacao: z.union([z.literal('DIGITAL'), z.literal('FISICA')]),
    iniciar: z.union([z.literal('SIM'), z.literal('NÃO'), z.literal('NÃO DEFINIDO')]),
    projetista: z.object({
      nome: z.string(),
      codigo: z.string(),
    }),
    projetoConcluido: z.union([z.literal('SIM'), z.literal('NÃO')]),
  }),

  sistema: z.object({
    capacidadeBateria: z.number(),
    marcaBateria: z.string(),
    qtdeBateria: z.number(),
    tipoBateria: z.string(),
    marcaBomba: z.string(),
    potBomba: z.number(),
    qtdeBomba: z.number(),
    marcaControlador: z.string(),
    correnteControlador: z.number(),
    qtdeControlador: z.number(),
    tipoControlador: z.string(),
    inversor: z.string(),
    potModulos: z.number(),
    qtdeModulos: z.number(),
    potPico: z.number(),
    topologia: z.union([z.literal('MICRO'), z.literal('INVERSOR'), z.literal('OTIMIZADOR')]),
    valorProjeto: z.number(),
  }),

  padrao: z.object({
    caixaConjugada: z.union([z.literal('SIM'), z.literal('NÃO'), z.literal('NÃO DEFINIDO')]),
    respInstalacao: z.union([z.literal('AMPERE'), z.literal('CLIENTE'), z.literal('NÃO SE APLICA')]),
    respPagamento: z.string(),
    tipo: z.string(),
    tipoEntrega: z.union([z.literal('AÉREA'), z.literal('SUBTERRÂNEO')]),
    valor: z.number(),
  }),

  estruturaPersonalizada: z.object({
    aplicavel: z.union([z.literal('SIM'), z.literal('NÃO')]),
    dataEntrega: z.string(),
    statusEntrega: z.string(),
    dataMontagem: z.string(),
    pagTerceiro: z.boolean(),
    respPagamento: z.union([z.literal('CLIENTE'), z.literal('AMPERE'), z.literal('NÃO SE APLICA')]),
    status: z.union([z.literal('PRONTA'), z.literal('N/A'), z.literal('PENDÊNCIA')]),
    tipo: z.string(),
    valor: z.number(),
  }),

  pagamento: z.object({
    cobrancaFeita: z.boolean(),
    pagador: z.string(),
    contatoPagador: z.string(),
    credor: z.string(),
    dataRecebimento: z.string(),
    forma: z.union([z.literal('FINANCIAMENTO'), z.literal('CAPITAL PRÓPRIO')]),
    retorno: z.number(),
    status: z.string(),
  }),

  parecer: z.object({
    dataParecerDeAcesso: z.string(),
    motivoReprova: z.string(),
    parecerReprovado: z.union([z.literal('SIM'), z.literal('NÃO')]),
    pendencias: z.string(),
    qtdeDiasObraDeRede: z.number(),
    qtdeReprovas: z.number(),
    statusDoParecerDeAcesso: z.string(),
  }),

  obra: z.object({
    checklist: z.union([z.literal('SIM'), z.literal('NÃO')]),
    entrada: z.string(),
    saida: z.string(),
    equipeResp: z.string(),
    laudo: z.union([z.literal('EMITIDO'), z.literal('EM ESTUDO'), z.literal('NÃO DEFINIDO')]),
    observacoes: z.string(),
    statusDaObra: z.string(),
    statusSolicitacao: z.string(),
    trafo: z.union([z.literal('SIM'), z.literal('NÃO')]),
  }),

  vistoria: z.object({
    dataPedido: z.string(),
    equipeDeCampoNecessaria: z.union([z.literal('SIM'), z.literal('NÃO')]),
    motivoReprova: z.string(),
    qtdeReprovas: z.number(),
    status: z.string(),
    vistoriaReprovada: z.union([z.literal('SIM'), z.literal('NÃO')]),
  }),

  material: z.object({
    avarias: z.boolean(),
    chamadoIrregularidade: z.boolean(),
    conferenciaFeita: z.boolean(),
    descricaoProblema: z.string(),
    disjuntores: z.array(
      z.object({
        corrente: z.number(),
        qtde: z.number(),
        tipo: z.union([z.literal('MONOFÁSICO'), z.literal('BIFÁSICO'), z.literal('TRIFÁSICO')]),
      })
    ),
    previsaoCustos: z.number(),
    efetivoCustos: z.number(),
    entregaFaltando: z.boolean(),
    formularioId: z.string(),
    lista: z.array(
      z.object({
        // Define the schema for MaterialListItem here
      })
    ),
    materialFaltante: z.boolean(),
    statusSeparacao: z.union([z.literal('SEPARADO'), z.literal('NÃO DEFINIDO'), z.literal('INICIAR SEPARAÇÃO')]),
  }),

  medidor: z.object({
    data: z.string(),
    status: z.string(),
  }),

  oem: z.object({
    aplicavel: z.boolean(),
    diagnostico: z.string(),
    duracao: z.number(),
    oemConcluido: z.boolean(),
    plano: z.string(),
    qtdeManutencao: z.number(),
    valor: z.number(),
  }),

  app: z.object({
    login: z.string(),
    senha: z.string(),
    data: z.union([z.date(), z.string()]),
  }),

  comissionamento: z.object({
    comercial: z.boolean(),
    projetos: z.boolean(),
    suprimentos: z.boolean(),
  }),

  conferencias: z.object({
    energiaInjetada: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    monitoramentoFeito: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    usinaLigada: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
  }),

  relatorios: z.object({
    envioUm: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioDois: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioTres: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
    envioQuatro: z.object({
      data: z.string(),
      status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
    }),
  }),

  faturamento: z.object({
    concluido: z.boolean(),
    cnpjFaturamento: z.string(),
    empresaFaturamento: z.union([z.literal('AMPERE ENERGIAS'), z.literal('ANALISE DO FINANCEIRO'), z.literal('IZAIRA SERVIÇOS')]),
    previsaoFaturamento: z.string(),
  }),

  indicacao: z.object({
    contato: z.string(),
    quemIndicou: z.string(),
  }),

  jornada: z.object({
    assDocumentacoes: z.boolean(),
    boasVindas: z.boolean(),
    compraDoKit: z.string(),
    dataEntregaTecnicaPresencial: z.string(),
    dataEntregaTecnicaRemota: z.string(),
    dataNps: z.string(),
    dataUltimoContato: z.string(),
    entregaDoKit: z.boolean(),
    entregaTecnica: z.boolean(),
    entregaTecnicaPresencial: z.boolean(),
    instalacaoAgendada: z.boolean(),
    instalacaoRealizada: z.boolean(),
    jornadaConcluida: z.boolean(),
    nfFaturada: z.boolean(),
    obsJornada: z.string(),
    obsNps: z.string(),
    prevChegada: z.boolean(),
    respConcessionaria: z.boolean(),
    sistemaLigado: z.boolean(),
    tipoEntregaTecnica: z.union([z.literal('REMOTO'), z.literal('PRESENCIAL')]),
    vistoriaConcessionaria: z.boolean(),
    contatos: z.string(),
    cuidados: z.string(),
  }),

  links: z.object({
    chamadosSuporte: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    chamadosSuprimentos: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    contratos: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    documentos: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    equipamentos: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    manutencaoPreventiva: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    obras: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    projetos: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
    visitaTecnica: z.array(
      z.object({
        // Define the schema for LinksItem here
      })
    ),
  }),

  manutencaoPreventiva: z.object({
    data: z.string(),
    status: z.string(),
  }),

  ordensDeServico: z.array(z.any()), // Define the schema for ordensDeServico here
})
export interface ServiceOrder {
  _id?: string
  categoria: 'MONTAGEM' | 'MANUTANÇÃO CORRETIVA' // etc
  favorecido: {
    nome: string
    contato: string
  }
  projeto: {
    id: string // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number // identificador QTDE do projeto no banco de projetos
    tipo: string // tipo do projeto
  }
  descricao: string // servico executado
  localizacao: {
    cep: string
    uf: string
    cidade: string
    bairro: string
    endereco: string
    numeroOuIdentificador: string
  }
  responsavel: {
    nome: string
    tipo: 'INTERNO' | 'EXTERNO'
  }
  // configurar: boolean
  urgencia: 'POUCO URGENTE' | 'URGENTE' | 'EMERGÊNCIA'
  periodo: {
    inicio: string | null
    fim: string | null
  }
  pagamento: {
    recebedor: string | null
    valor: number | null
  }
  cobranca: {
    pagador: string | null
    valor: number | null
  }
  autor: {
    id: string
    nome: string
    avatar_url: string
  }
  equipamentos: {
    modulos: {
      modelo: string | null
      qtde: number | null
      potencia: number | null
    }
    inversor: {
      modelo: string | null
      qtde: number | null
      potencia: number | null
    }
    disponivel: { qtde: number | null; descricao: string | null }[]
    retirada: { qtde: number | null; descricao: string | null }[]
  }
  detalhes: {
    pontoAgua: string //
    senhaWifi: string //
    configuracaoMonitoramento: boolean //
    possuiTrafo: boolean //
    tipoEstrutura: string //
    tipoTelha?: string
    tipoPadrao?: string
    tipoSaidaPadrao?: string
    amperagemPadrao?: string
    responsabilidadePadrao?: string
    topologia: string //
  }
  anotacoes: string // to be used by the service responsible executor
  observacoes: string
  dataEfetivacao?: string
  dataInsercao: string
}
type MaterialListItem = {
  diff: number
  id: string
  nome: string
  precoUnit: number
  qtdeDevolucao: number
  qtdePreBaixa: number
  qtdeSaida: number
}
type LinksItem = {
  category: string
  format: string
  link: string
  title: string
}
const deliveryLocals = [
  { label: 'MESMO DO PROJETO', value: 'MESMO DO PROJETO' },
  { label: 'SEM RESTRIÇÕES', value: 'SEM RESTRIÇÕES' },
  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
  { label: 'DIFERENTE DO PROJETO', value: 'DIFERENTE DO PROJETO' },
]
const deliveryStatus = [
  {
    label: 'AGUARDANDO COMPRA',
    value: 'AGUARDANDO COMPRA',
  },
  {
    label: 'EM ROTA',
    value: 'EM ROTA',
  },
  {
    label: 'ENTREGUE',
    value: 'ENTREGUE',
  },
  {
    label: 'CANCELADO',
    value: 'CANCELADO',
  },
  {
    label: 'NÃO DEFINIDO',
    value: 'NÃO DEFINIDO',
  },
]
const contractStatus = [
  {
    label: 'AGUARDANDO SOLICITAÇÃO',
    value: 'AGUARDANDO SOLICITAÇÃO',
  },
  { label: 'ASSINADO', value: 'ASSINADO' },
  { label: 'NÃO ASSINADO', value: 'NÃO ASSINADO' },
  {
    label: 'RECISÃO DE CONTRATO',
    value: 'RECISÃO DE CONTRATO',
  },
  { label: 'SOLICITADO', value: 'SOLICITADO' },
  { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
]
const jobStatus = [
  {
    label: 'AGENDADA',
    value: 'AGENDADA',
  },
  {
    label: 'AGUARDANDO AGENDAMENTO',
    value: 'AGUARDANDO AGENDAMENTO',
  },
  {
    label: 'CONCLUIDA',
    value: 'CONCLUIDA',
  },
  {
    label: 'EM ANDAMENTO',
    value: 'EM ANDAMENTO',
  },
  {
    label: 'OBRA CANCELADA',
    value: 'OBRA CANCELADA',
  },
  {
    label: 'CASA EM CONSTRUÇÃO',
    value: 'CASA EM CONSTRUÇÃO',
  },
  {
    label: 'NÃO DEFINIDO',
    value: 'NÃO DEFINIDO',
  },
]
const feedbackStatus = [
  {
    label: 'AGUARDANDO ASSINATURA',
    value: 'AGUARDANDO ASSINATURA',
  },
  {
    label: 'AGUARDANDO AUMENTO DE CARGA',
    value: 'AGUARDANDO AUMENTO DE CARGA',
  },
  {
    label: 'INICIAR PROJETO',
    value: 'INICIAR PROJETO',
  },
  {
    label: 'SOLICITAR TROCA DE TITULARIDADE',
    value: 'SOLICITAR TROCA DE TITULARIDADE',
  },
  {
    label: 'AGUARDANDO FATURAMENTO ART',
    value: 'AGUARDANDO FATURAMENTO ART',
  },
  {
    label: 'AGUARDANDO FORMULÁRIOS',
    value: 'AGUARDANDO FORMULÁRIOS',
  },
  {
    label: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
    value: 'AGUARDANDO RESPOSTA DA CONCESSIONARIA',
  },
  {
    label: 'AGUARDANDO TROCA DE TITULARIDADE',
    value: 'AGUARDANDO TROCA DE TITULARIDADE',
  },
  {
    label: 'AUMENTO DE CARGA',
    value: 'AUMENTO DE CARGA',
  },
  {
    label: 'CANCELADO',
    value: 'CANCELADO',
  },
  {
    label: 'PARECER DE ACESSO SUSPENSO',
    value: 'PARECER DE ACESSO SUSPENSO',
  },
  {
    label: 'PARECER DE ACESSO APROVADO',
    value: 'PARECER DE ACESSO APROVADO',
  },
  {
    label: 'PENDENCIAS',
    value: 'PENDENCIAS',
  },
  {
    label: 'SOLICITAR ACESSO',
    value: 'SOLICITAR ACESSO',
  },
  {
    label: 'SOLICITAR AUMENTO DE CARGA',
    value: 'SOLICITAR AUMENTO DE CARGA',
  },
  {
    label: 'PARECER DE ACESSO COM OBRAS',
    value: 'PARECER DE ACESSO COM OBRAS',
  },
  {
    label: 'NÃO DEFINIDO',
    value: 'NÃO DEFINIDO',
  },
]
const servicesType = [
  {
    label: 'SISTEMA FOTOVOLTAICO',
    value: 'SISTEMA FOTOVOLTAICO',
  },
  {
    label: 'SISTEMA FOTOVOLTAICO (OFF GRID)',
    value: 'SISTEMA FOTOVOLTAICO (OFF GRID)',
  },
  {
    label: 'BOMBA SOLAR',
    value: 'BOMBA SOLAR',
  },
  {
    label: 'OPERAÇÃO E MANUTENÇÃO',
    value: 'OPERAÇÃO E MANUTENÇÃO',
  },
  {
    label: 'TROCA DE PADRÃO',
    value: 'TROCA DE PADRÃO',
  },
  {
    label: 'REFORMA DE PADRÃO',
    value: 'REFORMA DE PADRÃO',
  },
  {
    label: 'MANUTENÇÃO CORRETIVA',
    value: 'MANUTENÇÃO CORRETIVA',
  },
  {
    label: 'MANUTENÇÃO PREVENTIVA',
    value: 'MANUTENÇÃO PREVENTIVA',
  },
  {
    label: 'MONTAGEM E DESMONTAGEM',
    value: 'MONTAGEM E DESMONTAGEM',
  },
  {
    label: 'TROCA DE STRING BOX',
    value: 'TROCA DE STRING BOX',
  },
  {
    label: 'SUBESTAÇÃO DE ENERGIA',
    value: 'SUBESTAÇÃO DE ENERGIA',
  },
  {
    label: 'NÃO DEFINIDO',
    value: 'NÃO DEFINIDO',
  },
]
const revenueTypes = [
  {
    label: 'SISTEMA FOTOVOLTAICO',
    value: 'SISTEMA FOTOVOLTAICO',
  },
  {
    label: 'SISTEMA FOTOVOLTAICO (OFF GRID)',
    value: 'SISTEMA FOTOVOLTAICO (OFF GRID)',
  },
  {
    label: 'BOMBA SOLAR',
    value: 'BOMBA SOLAR',
  },
  {
    label: 'OPERAÇÃO E MANUTENÇÃO',
    value: 'OPERAÇÃO E MANUTENÇÃO',
  },
  {
    label: 'TROCA DE PADRÃO',
    value: 'TROCA DE PADRÃO',
  },
  {
    label: 'REFORMA DE PADRÃO',
    value: 'REFORMA DE PADRÃO',
  },
  {
    label: 'MANUTENÇÃO CORRETIVA',
    value: 'MANUTENÇÃO CORRETIVA',
  },
  {
    label: 'MANUTENÇÃO PREVENTIVA',
    value: 'MANUTENÇÃO PREVENTIVA',
  },
  {
    label: 'MONTAGEM E DESMONTAGEM',
    value: 'MONTAGEM E DESMONTAGEM',
  },
  {
    label: 'TROCA DE STRING BOX',
    value: 'TROCA DE STRING BOX',
  },
  {
    label: 'SUBESTAÇÃO DE ENERGIA',
    value: 'SUBESTAÇÃO DE ENERGIA',
  },
  { label: 'OUTRAS RECEITAS', value: 'OUTRAS RECEITAS' },
] as const
interface IRevenues {
  tipo: (typeof revenueTypes)[number]['value']
  autor: {
    id: string // id do usuário que criou o referente registro de custos
    nome: string // nome do usuário que criou o referente registro de custos
  }
  descricao: string // descrição adicional, com detalhes, explicações ou qualquer informação para futura entendimento dos gastos
  projeto: {
    id: string // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number // identificador QTDE do projeto no banco de projetos
  }
  itens?: {
    descricao: string // nome ou descrição do item de custo
    preco: string // preco unitário do item
    qtde: number // quantidade de fato utilizada na execução do serviço
  }[]
  total: number
  efetivacao: {
    efetivado: boolean
    data: string
  }
  dataInsercao: string
  criterioReferencia: boolean
  criterioCompetencia: boolean
}

export const costApportionments = [
  {
    nome: 'DEDUÇÕES',
    categorias: [
      { label: 'IMPOSTOS DE VENDA', value: 'IMPOSTOS DE VENDA' },
      { label: 'DEVOLUÇÕES/DESCONTOS', value: 'DEVOLUÇÕES/DESCONTOS' },
    ],
  },
  {
    nome: 'CUSTOS DIRETOS',
    categorias: [
      { label: "KIT'S GERADORES", value: "KIT'S GERADORES" }, // responsavel = suprimentos
      { label: 'INSUMOS DE ALMOXARIFADO', value: 'INSUMOS DE ALMOXARIFADO' }, // responsavel == almoxarifado ou suprimentos
      { label: 'OUTROS CUSTOS DIRETOS', value: 'OUTROS CUSTOS DIRETOS' }, // outros custos de serviço ou produto  // responsavel = financeiro ou comercial
    ],
  },
  {
    nome: 'DESPESAS COMERCIAIS',
    categorias: [
      { label: 'DESPESAS DE MARKETING', value: 'DESPESAS DE MARKETING' }, // responsavel = gestão comercial
      { label: 'EQUIPE DE MARKETING', value: 'EQUIPE DE MARKETING' }, // responsavel = RH ou gestão comercial
      { label: 'EQUIPE DE VENDAS', value: 'EQUIPE DE VENDAS' }, // responsavel = RH ou gestão comercial
      { label: 'COMISSÕES DE INTERNOS', value: 'COMISSÕES DE INTERNOS' }, // responsavel = RG ou gestão comercial
      { label: 'COMISSÕES DE TERCEIROS', value: 'COMISSÕES DE TERCEIROS' }, // responsavel = RG ou gestão comercial
      { label: 'AJUDAS DE CUSTO', value: 'AJUDAS DE CUSTO' }, // responsavel = financeiro ou gestão comercial
      { label: 'PROVISÕES', value: 'PROVISÕES' }, // 13°'s, férias e etc // responsavel = RG
      { label: 'OUTROS CUSTOS COMERCIAIS', value: 'OUTROS CUSTOS COMERCIAIS' }, // responsavel = gestão comercial
    ],
  },
  {
    nome: 'DESPESAS ADMINISTRATIVAS',
    categorias: [
      { label: 'ALUGUEL/CONDOMÍNIO/IPTU', value: 'ALUGUEL/CONDOMÍNIO/IPTU' }, // responsavel = financeiro
      { label: 'MANUTENÇÕES', value: 'MANUTENÇÕES' }, // responsavel = financeiro
      { label: 'ENERGIA/INTERNET/ÁGUA', value: 'ENERGIA/INTERNET/ÁGUA' }, // responsavel = financeiro
      { label: 'ASSINATURAS DE SOFTWARE', value: 'ASSINATURAS DE SOFTWARE' }, // responsavel = financeiro
      { label: 'CONTABILIDADE/SEGUROS', value: 'CONTABILIDADE/SEGUROS' }, // responsavel = financeiro
      { label: 'PRÓ-LABORE', value: 'PRÓ-LABORE' }, // responsavel = financeiro
      { label: 'EQUIPE ADMINISTRATIVA', value: 'EQUIPE ADMINISTRATIVA' }, // responsavel = financeiro ou RG
      { label: 'HONORÁRIOS ADVOCATÍCIOS', value: 'HONORÁRIOS ADVOCATÍCIOS' }, // responsavel = financeiro
      {
        label: 'FAXINA/MATERIAIS DO ESCRITÓRIO', // responsavel = RH ou suprimentos
        value: 'FAXINA/MATERIAIS DO ESCRITÓRIO',
      },
      { label: 'DOAÇÕES', value: 'DOAÇÕES' }, // responsavel = financeiro
      { label: 'PROVISÕES', value: 'PROVISÕES' }, // responsavel = financeiro
      {
        label: 'OUTROS CUSTOS ADMINISTRATIVOS', // responsavel = financeiro
        value: 'OUTROS CUSTOS ADMINISTRATIVOS',
      },
    ],
  },
  {
    nome: 'DESPESAS OBRAS',
    categorias: [
      { label: 'DESPESAS DE OBRAS', value: 'DESPESAS DE OBRAS' }, // responsavel = obras
      { label: 'ALUGUEL DE EQUIPAMENTOS', value: 'ALUGUEL DE EQUIPAMENTOS' }, // responsavel = almoxarifado ou obras
      { label: 'EQUIPE DE OBRAS', value: 'EQUIPE DE OBRAS' }, // responsavel = RH ou obras
      { label: 'TERCEIROS', value: 'TERCEIROS' }, // responsavel = financeiro
      { label: 'COMISSÕES', value: 'COMISSÕES' }, // responsavel = financeiro
      { label: 'PROVISÕES', value: 'PROVISÕES' }, // responsavel = financeiro
    ],
  },
  {
    nome: 'DESPESAS OPERACIONAIS',
    categorias: [
      { label: 'ALUGUEL DE VEÍCULOS', value: 'ALUGUEL DE VEÍCULOS' }, // responsavel = financeiro
      { label: 'ANUIDADE DO CREA', value: 'ANUIDADE DO CREA' }, // responsavel = financeiro
      { label: 'COMBUSTÍVEL', value: 'COMBUSTÍVEL' }, // responsavel = financeiro
      { label: 'PEDÁGIO E ESTACIONAMENTO', value: 'PEDÁGIO E ESTACIONAMENTO' }, // responsavel = financeiro
      { label: 'LANCHES E REFEIÇÕES', value: 'LANCHES E REFEIÇÕES' }, // responsavel = financeiro
      { label: 'HOSPEDAGEM', value: 'HOSPEDAGEM' }, // responsavel = financeiro
      { label: 'GASTOS COM GYMPASS', value: 'GASTOS COM GYMPASS' }, // responsavel = financeiro ou RH
      { label: 'UNIFORMES', value: 'UNIFORMES' }, // responsavel = financeiro ou RG
      {
        label: 'OUTROS CUSTOS OPERACIONAIS',
        value: 'OUTROS CUSTOS OPERACIONAIS', // responsavel = financeiro
      },
    ],
  },
  {
    nome: 'DEPRECIAÇÃO E AMORTIZAÇÕES',
    categorias: [
      {
        label: 'DEPRECIAÇÃO E AMORTIZAÇÕES', // responsavel = financeiro
        value: 'DEPRECIAÇÃO E AMORTIZAÇÕES',
      },
    ],
  },
  {
    nome: 'DESPESAS FINANCEIRAS',
    categorias: [
      {
        label: 'JUROS/AMORTIZAÇÃO DE DÍVIDAS', // responsavel = financeiro
        value: 'JUROS/AMORTIZAÇÃO DE DÍVIDAS',
      },
      { label: 'DESPESAS BANCÁRIAS', value: 'DESPESAS BANCÁRIAS' }, // responsavel = financeiro
      { label: 'EMPRÉSTIMOS', value: 'EMPRÉSTIMOS' },
      {
        label: 'OUTRAS CUSTOS FINANCEIROS', // responsavel = financeiro
        value: 'OUTRAS CUSTOS FINANCEIROS',
      },
    ],
  },
  {
    nome: 'IMPOSTOS', // responsavel = financeiro
    categorias: [
      { label: 'ICMS', value: 'ICMS' },
      { label: 'ISS', value: 'ISS' },
      { label: 'PIS', value: 'PIS' },
      { label: 'COFINS', value: 'COFINS' },
      { label: 'INSS', value: 'INSS' },
      { label: 'FGTS', value: 'FGTS' },
      { label: 'IPVA/DPVAT/LICENCIAMENTO', value: 'IPVA/DPVAT/LICENCIAMENTO' },
      { label: 'IRRF', value: 'IRRF' },
      { label: 'SIMPLES NACIONAL - DAS', value: 'SIMPLES NACIONAL - DAS' },
      { label: 'IRPJ/CSLL', value: 'IRPJ/CSLL' },
    ],
  },
] as const
interface ICosts {
  rateio: (typeof costApportionments)[number]['nome']
  categoria: (typeof costApportionments)[number]['categorias'][number]['value']
  descricao: string // descrição adicional, com detalhes, explicações ou qualquer informação para futura entendimento dos gastos
  projeto: {
    id: string // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number // identificador QTDE do projeto no banco de projetos
    tipo: string // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
  }
  idFormularioAlmoxarifado?: string
  autor: {
    id: string // id do usuário que criou o referente registro de custos
    nome: string // nome do usuário que criou o referente registro de custos
  }
  itens: {
    idMaterial?: string // id do material, se item estocável
    descricao: string // nome ou descrição do item de custo
    unidade: string // unidade do item
    preco: string // preco unitário do item
    qtde: number // quantidade de fato utilizada na execução do serviço
  }[]
  total: number // somatória final do objeto de custo
  efetivacao: {
    efetivado: boolean
    data: string
  }
  criterioReferencia: boolean
  criterioCompetencia: boolean
  dataInsercao: string // data de inserção do documento
}

interface PurchaseRequest {
  _id: string
  requisitante: string
  responsavel: string
  status: string
  telefone: string // contato do requisitante
  urgencia: string
  motivo: string
  projeto: {
    id: string // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number // identificador QTDE do projeto no banco de projetos
    tipo: string // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
  }
  anotacoes: string
  itens: {
    dataCompra: string
    dataEntrega: string
    descricao: string
    grandeza: string
    nome: string
    qtde: number
  }[]
  dataSolicitacao: string
  dataResposta?: string
  aprovacao: boolean
}
interface PurchaseRequestReformed {
  _id: string
  requisitante: {
    nome: string
    telefone: string
  }
  responsavel: string
  status: string
  motivo: string
  urgencia: string
  anotacoes: string
  categoria: string
  projeto: {
    id: string // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number // identificador QTDE do projeto no banco de projetos
    tipo: string // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
  }
  itens: {
    descricao: string
    qtde: number
    preco: number
    grandeza: number
    dataCompra: string
    dataEntrega: string
    anotacoes: string //
  }[]
  dataInsercao: string
  dataEfetivacao?: string
}
interface IMaterial {
  _id?: string
  nome: string
  nomeTecnico: string
  preco: number
  qtde: number
  qtdeMinima?: number
  anotacoes: string
  codigo: string
  grandeza: 'UN' | 'PC' | 'KG' | 'CX' | 'M' | 'M³' | 'L'
  localizacao: string
}
interface IPPSCall {
  _id?: string
  anotacoes?: string
  bairro?: string
  carimboDataHora: string // renomear -> dataInsercao
  cep?: string
  cidade?: string
  codigoDoProjeto?: number | string // renomear -> codigoSVB ou codigoProjeto
  cpf_cnpj?: string
  datadeconclusao: string // deletar campo
  dataDeConclusao?: string | Date // renomear -> dataEfetivacao
  dataDeNascimento?: string
  demanda: 'EXTERNA' | 'INTERNA' // avaliar necessidade desse campo
  duvida?: string // renomear -> descricao ou demanda
  email?: string
  enderecoDoCliente?: string // -> renomear
  equipamentos: { horasDiarias: number; nome: string; pot: number; qtde: number }[]
  geracaoEstimada?: number // renomear para consumoKWH ou consumo
  links: { link: string; format: string; title: string }[]
  localizacao: string
  logradouro: string
  nomeDoCliente: string // renomear
  numeroResidencia: string
  observacoes: string // renomear
  profissaoDoCliente: string // renomear
  referenteAProjeto: 'SIM' | 'NÃO' // avaliar necessidade desse campo
  rendaDoCliente?: number
  responsavel: string
  status: string
  telefone: string
  tipoDaEstrutura: string
  tipoDeSolicitacao: string
  tipoDoCliente: string
  topologia: string
  valorFinanciamento?: number
  vendedor: string
}
export const GeneralTechnicalAnalysisSchema = z.object({
  _id: z.string().optional(),
  nome: z.string(),
  status: z.string(), // create a list of options
  complexidade: z.union([z.literal('SIMPLES'), z.literal('INTERMEDIÁRIO'), z.literal('COMPLEXO')]),
  pendencias: z
    .array(
      z.object({
        categoria: z.enum(technicalAnalysisPendencyCategories.map((t) => t.value)),
        descricao: z.string(),
        responsavel: z.string().optional().nullable(),
        dataFinalizacao: z.string().optional().nullable(),
        finalizado: z.boolean(),
      })
    )
    .optional()
    .nullable(),
  anotacoes: z.string(), // anotações gerais para auxilio ao analista
  tipoSolicitacao: z
    .enum(technicalAnalysisSolicitationTypes.map((t) => t.value))
    .nullable()
    .optional(),
  analista: z.object({
    id: z.string().optional(),
    nome: z.string(),
    apelido: z.string(),
    avatar_url: z.string().optional().nullable(),
  }),
  requerente: z.object({
    idCRM: z.string().optional().nullable(),
    nomeCRM: z.string().optional().nullable(),
    apelido: z.string(),
    avatar_url: z.string().optional().nullable(),
    contato: z.string().optional().nullable(), // telefone
  }),
  projeto: z.object({
    id: z.string().optional().nullable(),
    nome: z.string(),
    identificador: z.string().optional().nullable(),
  }),
  aumento: z
    .object({
      id: z.string().optional().nullable(),
      nome: z.string(),
      equipamentos: z
        .object({
          modulos: z.object({
            modelo: z.string().optional().nullable(),
            qtde: z.string().optional().nullable(),
            potencia: z.string().optional().nullable(),
          }),
          inversor: z.object({
            modelo: z.string().optional().nullable(),
            qtde: z.string().optional().nullable(),
            potencia: z.string().optional().nullable(),
          }),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string().optional().nullable(),
    cidade: z.string(),
    bairro: z.string(),
    endereco: z.string(),
    numeroOuIdentificador: z.string(),
    distancia: z.number().optional().nullable(),
  }),
  equipamentos: z.object({
    modulos: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
    inversor: z.object({
      modelo: z.string().nullable(),
      qtde: z.string().nullable(),
      potencia: z.string().nullable(),
    }),
  }),
  padrao: z.array(
    z.object({
      alteracao: z.boolean(),
      tipo: z.union([z.literal('CONTRA À REDE'), z.literal('À FAVOR DA REDE')]),
      tipoEntrada: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]),
      tipoSaida: z.union([z.literal('AÉREO'), z.literal('SUBTERRÂNEO')]),
      amperagem: z.string(),
      ligacao: z.string(), // MONO BI TRI
      novaAmperagem: z.string().optional().nullable(),
      novaLigacao: z.string().optional().nullable(),
      codigoMedidor: z.string(),
      modeloCaixaMedidor: z.string(),
      codigoPosteDerivacao: z.string().optional().nullable(), // GO only
    })
  ),
  transformador: z.object({
    acopladoPadrao: z.boolean(),
    codigo: z.string(),
    potencia: z.number(),
  }),
  execucao: z.object({
    observacoes: z.string().optional().nullable(),
    memorial: z
      .array(
        z.object({
          topico: z.string(), // avaliar telhado, adaptar qgbt, etc
          descricao: z.string(),
        })
      )
      .optional()
      .nullable(),
    espacoQGBT: z.boolean(),
  }),
  descritivo: z.array(z.object({ topico: z.string(), descricao: z.string() })),
  servicosAdicionais: z.object({
    alambrado: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    britagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    casaDeMaquinas: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    barracao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    roteador: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    limpezaLocal: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    redeReligacao: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    terraplanagem: z
      .union([z.literal('NÃO'), z.literal('SIM - RESPONSABILIDADE CLIENTE'), z.literal('SIM - RESPONSABILIDADE AMPÈRE')])
      .optional()
      .nullable(),
    realimentar: z.union([z.literal('NÃO'), z.literal('SIM')]),
  }),
  detalhes: z.object({
    concessionaria: z.string(),
    topologia: z
      .union([z.literal('MICRO-INVERSOR'), z.literal('INVERSOR')])
      .optional()
      .nullable(),
    materialEstrutura: z
      .union([z.literal('MADEIRA'), z.literal('FERRO')])
      .optional()
      .nullable(),
    tipoEstrutura: z
      .enum(structureTypes.map((t) => t.value))
      .optional()
      .nullable(),
    tipoTelha: z
      .enum(roofTiles.map((t) => t.value))
      .optional()
      .nullable(),
    fixacaoInversores: z
      .enum(inverterFixationOptions.map((o) => o.value))
      .optional()
      .nullable(),
    imagensDrone: z.boolean(),
    imagensFachada: z.boolean(),
    imagensSatelite: z.boolean(),
    medicoes: z.boolean(),
    orientacao: z.string(),
    telhasReservas: z
      .union([z.literal('NÃO'), z.literal('SIM')])
      .optional()
      .nullable(),
  }),
  distancias: z.object({
    conexaoInternet: z.string(),
    cabeamentoCA: z.string(), // inversor ao padrão
    cabeamentoCC: z.string(), // modulos ao inversor
  }),
  locais: z.object({
    aterramento: z.string().optional().nullable(),
    inversor: z.string(), // instalação do inversor, varannda, garagem, etc
    modulos: z.string(), // instalação dos módulos, telhado, solo em x, solo em y, etc
  }),
  custos: z.array(
    z.object({
      categoria: z
        .union([z.literal('INSTALAÇÃO'), z.literal('PADRÃO'), z.literal('ESTRUTURA'), z.literal('OUTROS')])
        .optional()
        .nullable(),
      descricao: z.string(),
      qtde: z.number(),
      grandeza: z.enum(units.map((u) => u.value)),
      custoUnitario: z.number().optional().nullable(),
      total: z.number().optional().nullable(),
    })
  ),
  arquivos: z.array(
    z.object({
      descricao: z.string(),
      url: z.string(),
      formato: z.string(),
    })
  ),
  alocacaoModulos: z.object({
    leste: z.number().optional().nullable(),
    nordeste: z.number().optional().nullable(),
    noroeste: z.number().optional().nullable(),
    norte: z.number().optional().nullable(),
    oeste: z.number().optional().nullable(),
    sudeste: z.number().optional().nullable(),
    sudoeste: z.number().optional().nullable(),
    sul: z.number().optional().nullable(),
  }),
  desenho: z.object({
    observacoes: z.string(),
    tipo: z.string().optional().nullable(), //
    url: z.string().optional().nullable(),
  }),
  suprimentos: z
    .object({
      observacoes: z.string(),
      itens: z.array(
        z.object({
          descricao: z.string(),
          tipo: z.string(),
          qtde: z.number(),
          grandeza: z.enum(units.map((u) => u.value)),
        })
      ),
    })
    .optional()
    .nullable(),
  conclusao: z.object({
    // UTILIZADO PELOS VENDEDORES
    observacoes: z.string(),
    espaco: z.boolean(), // possui espaço pra execução
    inclinacao: z.boolean(), // necessitará estrutura de inclinação
    sombreamento: z.boolean(), // possui sombra
    padrao: z
      .union([z.literal('APTO'), z.literal('REFORMAR'), z.literal('TROCAR')])
      .optional()
      .nullable(),
    estrutura: z
      .union([z.literal('APTO'), z.literal('CONDENADO'), z.literal('REFORÇAR'), z.literal('AVALIAR NA EXECUÇÃO')])
      .optional()
      .nullable(),
  }),
  dataInsercao: z.string().datetime(),
  dataEfetivacao: z.string().datetime().optional().nullable(),
})
