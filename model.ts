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
    dataAssinatura: string
    dataLiberacao: string
    dataSolicitacao: string
    formaAssinatura: 'FISICO' | 'DIGITAL'
    status: string
  }
  comissoes: {
    efetivado?: boolean
    pagamentoRealizado?: boolean
    porcentagemVendedor?: number
    porcentagemInsider?: number
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
    liberacao?: boolean
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
    label: 'RESCISÃO DE CONTRATO',
    value: 'RESCISÃO DE CONTRATO',
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
