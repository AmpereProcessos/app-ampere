interface IProject {
  _id: string;
  qtde: number;
  nomeDoContrato: string;
  nomeDoProjeto: string;
  codigoSVB: number | string;
  tipoDeServico: string;
  regional: "REGIONAL ITUIUTABA" | "REGIONAL UBERLÂNDIA";
  vendedor: {
    nome: string;
    codigo: number;
  };
  cep: string;
  uf: "MG" | "GO" | string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numeroResidencia: string;
  cpf_cnpj: string;
  dataNascimento: string;
  email: string;
  linkDrive: string;
  segmento: "RESIDENCIAL" | "RURAL" | "COMERCIAL" | "INDUSTRIAL";
  telefone: string;
  ondeTrabalha: string;
  possuiaGD: boolean;
  idVisitaTecnica: string;
  canalVenda: string;
  insider: string;
  obsComercial: string;
  nps: number;

  visitaTecnica: {
    amperagem: string;
    saidaDoCliente: "AEREO" | "SUBTERRANEO";
    status: string;
    tecnico: string;
    tipoDaTelha: string;
  };
  // CONTRATO É COMUM PARA TODOS OS CONTRATOS
  contrato: {
    comissaoPaga: boolean;
    comissaoVendedor: number;
    dataAssinatura: string;
    dataLiberacao: string;
    dataSolicitacao: string;
    formaAssinatura: "FISICO" | "DIGITAL";
    status: string;
  };
  // COMPRA NÃO SE APLICA A O&M
  compra: {
    dataEntrega: string;
    dataLiberacao: string;
    dataMaxPagamento: string;
    dataPagamento: string;
    dataPedido: string;
    fornecedor: string;
    informacoes: string;
    kitInfo: string;
    localEntrega: string;
    previsaoEntrega: string;
    rastreio: string;
    statusEntrega: string;
    statusLiberacao: string;
    tipoDoKit: "NORMAL" | "PROMO" | "NÃO DEFINIDO";
    valorDoKit: number;
  };
  // DADOS CONCESSIONÁRIA NÃO SE APLICA A OFF GRID E BOMBA SOLAR
  dadosCemig: {
    distCreditos: "NÃO" | "SIM";
    numeroInstalacao: number;
    qtdeDistCreditos: number;
    titularProjeto: string;
  };
  // PROJETO NÃO SE APLICA A O&M, OFF GRID E BOMBA SOLAR
  projeto: {
    acStatus: string;
    aumentoDeCarga: "SIM" | "NÃO";
    dataLiberacaoDocumentacao: string;
    dataAssDocumentacao: string;
    dataSolicitacaoAcesso: string;
    desenhoTelhado: string;
    diagramaUnifilar: string;
    mapaDeMicro: string;
    fechamentoAC: string;
    formaAssDocumentacao: "DIGITAL" | "FISICA";
    iniciar: "SIM" | "NÃO" | "NÃO DEFINIDO";
    projetista: {
      nome: string;
      codigo: string;
    };
    projetoConcluido: "SIM" | "NÃO";
  };
  // SISTEMA É COMUM PARA TODOS OS CONTRATOS
  sistema: {
    capacidadeBateria: number;
    marcaBateria: string;
    qtdeBateria: number;
    tipoBateria: string;
    marcaBomba: string;
    potBomba: number;
    qtdeBomba: number;
    marcaControlador: string;
    correnteControlador: number;
    qtdeControlador: number;
    tipoControlador: string;
    inversor: string;
    potModulos: number;
    qtdeModulos: number;
    potPico: number;
    topologia: "MICRO" | "INVERSOR" | "OTIMIZADOR";
    valorProjeto: number;
  };
  // PADRÃO NÃO SE APLICA A O&M, OFF GRID E BOMBA SOLAR
  padrao: {
    caixaConjugada: "SIM" | "NÃO" | "NÃO DEFINIDO";
    respInstalacao: "AMPERE" | "CLIENTE" | "NÃO SE APLICA";
    respPagamento: string;
    tipo: string;
    tipoEntrega: "AÉREA" | "SUBTERRÂNEO";
    valor: number;
  };
  // ESTRUTURA PERSONALIZADA NÃO SE APLICA A O&M, TROCA DE PADRÃO
  estruturaPersonalizada: {
    aplicavel: "SIM" | "NÃO";
    dataEntrega: string;
    statusEntrega: string;
    dataMontagem: string;
    pagTerceiro: boolean;
    respPagamento: "CLIENTE" | "AMPERE" | "NÃO SE APLICA";
    status: "PRONTA" | "N/A" | "PENDÊNCIA";
    tipo: string;
    valor: number;
  };
  // PAGAMENTO É COMUM PARA TODOS OS CONTRATOS
  pagamento: {
    cobrancaFeita: boolean;
    pagador: string;
    contatoPagador: string;
    credor: string;
    dataRecebimento: string;
    forma: "FINANCIAMENTO" | "CAPITAL PRÓPRIO";
    retorno: number;
    status: string;
  };
  // PARECER NÃO SE APLICA A O&M, OFF GRID E BOMBA SOLAR
  parecer: {
    dataParecerDeAcesso: string;
    motivoReprova: string;
    parecerReprovado: "SIM" | "NÃO";
    pendencias: string;
    qtdeDiasObraDeRede: number;
    qtdeReprovas: number;
    statusDoParecerDeAcesso: string;
  };
  // OBRA NÃO SE APLICA A O&M
  obra: {
    checklist: "SIM" | "NÃO";
    entrada: string;
    saida: string;
    equipeResp: string;
    laudo: "EMITIDO" | "EM ESTUDO" | "NÃO DEFINIDO";
    observacoes: string;
    statusDaObra: string;
    statusSolicitacao: string;
    trafo: "SIM" | "NÃO";
  };
  // VISTORIA NÃO APLICA A O&M, OFF GRID E BOMBA SOLAR
  vistoria: {
    dataPedido: string;
    equipeDeCampoNecessaria: "SIM" | "NÃO";
    motivoReprova: string;
    qtdeReprovas: number;
    status: string;
    vistoriaReprovada: "SIM" | "NÃO";
  };
  // MATERIAL NÃO SE APLICA A O&M
  material: {
    avarias: boolean;
    chamadoIrregularidade: boolean;
    conferenciaFeita: boolean;
    descricaoProblema: string;
    disjuntores: {
      corrente: number;
      qtde: number;
      tipo: "MONOFÁSICO" | "BIFÁSICO" | "TRIFÁSICO";
    }[];
    previsaoCustos: number;
    efetivoCustos: number;
    entregaFaltando: boolean;
    formularioId: string;
    lista: MaterialListItem[];
    materialFaltante: boolean;
    statusSeparacao: "SEPARADO" | "NÃO DEFINIDO" | "INICIAR SEPARAÇÃO";
  };
  // MEDIDOR NÃO SE APLICA A O&M, OFF GRID E BOMBA SOLAR
  medidor: {
    data: string;
    status: string;
  };
  // O&M NÃO APLICA A TROCA DE PADRÃO
  oem: {
    aplicavel: boolean;
    diagnostico: string;
    duracao: number;
    oemConcluido: boolean;
    plano: string;
    qtdeManutencao: number;
    valor: number;
  };
  // APP NÃO SE APLICA A TROCA DE PADRÃO
  app: {
    login: string;
    senha: string;
    data: Date | string;
  };
  // COMISSIONAMENTO NÃO SE APLICA A O&M, OFF GRID E BOMBA
  comissionamento: {
    comercial: boolean;
    projetos: boolean;
    suprimentos: boolean;
  };
  // CONFERENCIAS É COMUM PARA TODOS OS CONTRATOS
  conferencias: {
    energiaInjetada: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
    monitoramentoFeito: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
    usinaLigada: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
  };
  // RELATORIOS NÃO SE APLICA A O&M, OFF GRID E BOMBA
  relatorios: {
    envioUm: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
    envioDois: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
    envioTres: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
    envioQuatro: {
      data: string;
      status: "REALIZADO" | "NÃO REALIZADO";
    };
  };
  // FATURAMENTO É COMUM PARA TODOS OS CONTRATOS
  faturamento: {
    concluido: boolean;
    cnpjFaturamento: string;
    empresaFaturamento:
      | "AMPERE ENERGIAS"
      | "ANALISE DO FINANCEIRO"
      | "IZAIRA SERVIÇOS";
    previsaoFaturamento: string;
  };
  // INDICACAO É COMUM PARA TODOS OS CONTRATOS
  indicacao: {
    contato: string;
    quemIndicou: string;
  };
  // JORNADA É COMUM PARA TODOS OS CONTRATOS
  jornada: {
    assDocumentacoes: boolean;
    boasVindas: boolean;
    compraDoKit: string;
    dataEntregaTecnicaPresencial: string;
    dataEntregaTecnicaRemota: string;
    dataNps: string;
    dataUltimoContato: string;
    entregaDoKit: boolean;
    entregaTecnica: boolean;
    entregaTecnicaPresencial: boolean;
    instalacaoAgendada: boolean;
    instalacaoRealizada: boolean;
    jornadaConcluida: boolean;
    nfFaturada: boolean;
    obsJornada: string;
    obsNps: string;
    prevChegada: boolean;
    respConcessionaria: boolean;
    sistemaLigado: boolean;
    tipoEntregaTecnica: "REMOTO" | "PRESENCIAL";
    vistoriaConcessionaria: boolean;
  };
  // LINKS É COMUM PARA TODOS OS CONTRATOS
  links: {
    chamadosSuporte: LinksItem[];
    chamadosSuprimentos: LinksItem[];
    contratos: LinksItem[];
    documentos: LinksItem[];
    equipamentos: LinksItem[];
    manutencaoPreventiva: LinksItem[];
    obras: LinksItem[];
    projetos: LinksItem[];
    visitaTecnica: LinksItem[];
  };
  // MANUTENCAO PREVENTIVA NÃO SE APLICA A O&M, OFF GRID E BOMBA
  manutencaoPreventiva: {
    data: string;
    status: string;
  };
  // ORDENS DE SERVIÇO É COMUM PARA TODOS OS CONTRATOS
  ordensDeServico: any[];
}
type MaterialListItem = {
  diff: number;
  id: string;
  nome: string;
  precoUnit: number;
  qtdeDevolucao: number;
  qtdePreBaixa: number;
  qtdeSaida: number;
};
type LinksItem = {
  category: string;
  format: string;
  link: string;
  title: string;
};
const deliveryLocals = [
  { label: "MESMO DO PROJETO", value: "MESMO DO PROJETO" },
  { label: "SEM RESTRIÇÕES", value: "SEM RESTRIÇÕES" },
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "DIFERENTE DO PROJETO", value: "DIFERENTE DO PROJETO" },
];
const deliveryStatus = [
  {
    label: "AGUARDANDO COMPRA",
    value: "AGUARDANDO COMPRA",
  },
  {
    label: "EM ROTA",
    value: "EM ROTA",
  },
  {
    label: "ENTREGUE",
    value: "ENTREGUE",
  },
  {
    label: "CANCELADO",
    value: "CANCELADO",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
const contractStatus = [
  {
    label: "AGUARDANDO SOLICITAÇÃO",
    value: "AGUARDANDO SOLICITAÇÃO",
  },
  { label: "ASSINADO", value: "ASSINADO" },
  { label: "NÃO ASSINADO", value: "NÃO ASSINADO" },
  {
    label: "RECISÃO DE CONTRATO",
    value: "RECISÃO DE CONTRATO",
  },
  { label: "SOLICITADO", value: "SOLICITADO" },
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
];
const jobStatus = [
  {
    label: "AGENDADA",
    value: "AGENDADA",
  },
  {
    label: "AGUARDANDO AGENDAMENTO",
    value: "AGUARDANDO AGENDAMENTO",
  },
  {
    label: "CONCLUIDA",
    value: "CONCLUIDA",
  },
  {
    label: "EM ANDAMENTO",
    value: "EM ANDAMENTO",
  },
  {
    label: "OBRA CANCELADA",
    value: "OBRA CANCELADA",
  },
  {
    label: "CASA EM CONSTRUÇÃO",
    value: "CASA EM CONSTRUÇÃO",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
const feedbackStatus = [
  {
    label: "AGUARDANDO ASSINATURA",
    value: "AGUARDANDO ASSINATURA",
  },
  {
    label: "AGUARDANDO AUMENTO DE CARGA",
    value: "AGUARDANDO AUMENTO DE CARGA",
  },
  {
    label: "INICIAR PROJETO",
    value: "INICIAR PROJETO",
  },
  {
    label: "SOLICITAR TROCA DE TITULARIDADE",
    value: "SOLICITAR TROCA DE TITULARIDADE",
  },
  {
    label: "AGUARDANDO FATURAMENTO ART",
    value: "AGUARDANDO FATURAMENTO ART",
  },
  {
    label: "AGUARDANDO FORMULÁRIOS",
    value: "AGUARDANDO FORMULÁRIOS",
  },
  {
    label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
    value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
  },
  {
    label: "AGUARDANDO TROCA DE TITULARIDADE",
    value: "AGUARDANDO TROCA DE TITULARIDADE",
  },
  {
    label: "AUMENTO DE CARGA",
    value: "AUMENTO DE CARGA",
  },
  {
    label: "CANCELADO",
    value: "CANCELADO",
  },
  {
    label: "PARECER DE ACESSO SUSPENSO",
    value: "PARECER DE ACESSO SUSPENSO",
  },
  {
    label: "PARECER DE ACESSO APROVADO",
    value: "PARECER DE ACESSO APROVADO",
  },
  {
    label: "PENDENCIAS",
    value: "PENDENCIAS",
  },
  {
    label: "SOLICITAR ACESSO",
    value: "SOLICITAR ACESSO",
  },
  {
    label: "SOLICITAR AUMENTO DE CARGA",
    value: "SOLICITAR AUMENTO DE CARGA",
  },
  {
    label: "PARECER DE ACESSO COM OBRAS",
    value: "PARECER DE ACESSO COM OBRAS",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
const servicesType = [
  {
    label: "SISTEMA FOTOVOLTAICO",
    value: "SISTEMA FOTOVOLTAICO",
  },
  {
    label: "SISTEMA FOTOVOLTAICO (OFF GRID)",
    value: "SISTEMA FOTOVOLTAICO (OFF GRID)",
  },
  {
    label: "BOMBA SOLAR",
    value: "BOMBA SOLAR",
  },
  {
    label: "OPERAÇÃO E MANUTENÇÃO",
    value: "OPERAÇÃO E MANUTENÇÃO",
  },
  {
    label: "TROCA DE PADRÃO",
    value: "TROCA DE PADRÃO",
  },
  {
    label: "REFORMA DE PADRÃO",
    value: "REFORMA DE PADRÃO",
  },
  {
    label: "MANUTENÇÃO CORRETIVA",
    value: "MANUTENÇÃO CORRETIVA",
  },
  {
    label: "MANUTENÇÃO PREVENTIVA",
    value: "MANUTENÇÃO PREVENTIVA",
  },
  {
    label: "MONTAGEM E DESMONTAGEM",
    value: "MONTAGEM E DESMONTAGEM",
  },
  {
    label: "TROCA DE STRING BOX",
    value: "TROCA DE STRING BOX",
  },
  {
    label: "SUBESTAÇÃO DE ENERGIA",
    value: "SUBESTAÇÃO DE ENERGIA",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
interface ICosts {
  categoria:
    | "MONTAGEM"
    | "PADRÃO"
    | "ESTRUTURA"
    | "MANUTENÇÃO CORRETIVA"
    | "MANUTENÇÃO PREVENTIVA"
    | "OUTROS"; // categoria do custo, de modo a especificar em que atividade/serviço estão sendo despendidos os gastos.
  descricao: string; // descrição adicional, com detalhes, explicações ou qualquer informação para futura entendimento dos gastos
  projeto: {
    id: string; // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
    nome: string; // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
    identificador: number; // identificador QTDE do projeto no banco de projetos
    tipo: string; // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
  };
  autor: {
    id: string; // id do usuário que criou o referente registro de custos
    nome: string; // nome do usuário que criou o referente registro de custos
  };
  itens: {
    idMaterial?: string; // id do material, se item estocável
    descricao: string; // nome ou descrição do item de custo
    unidade: string; // unidade do item
    preco: string; // preco unitário do item
    qtde: number; // quantidade de fato utilizada na execução do serviço
  }[];
  total: number; // somatória final do objeto de custo
  dataInsercao: string; // data de inserção do documento
}
