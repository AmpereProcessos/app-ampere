interface IProject {
  _id: string;
  app: {
    login: string;
    senha: string;
    data: Date | string;
  };
  bairro: string;
  canalVenda: string;
  cep: string;
  cidade: string;
  codigoSVB: number | string;
  comissionamento: {
    comercial: boolean;
    projetos: boolean;
    suprimentos: boolean;
  };
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
  contrato: {
    comissaoPaga: boolean;
    comissaoVendedor: number;
    dataAssinatura: string;
    dataLiberacao: string;
    dataSolicitacao: string;
    formaAssinatura: "FISICO" | "DIGITAL";
    status: string;
  };
  cpf_cnpj: string;
  dadosCemig: {
    distCreditos: "NÃO" | "SIM";
    numeroInstalacao: number;
    qtdeDistCreditos: number;
    titularProjeto: string;
  };
  dataNascimento: string;
  email: string;
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
  faturamento: {
    cnpjFaturamento: string;
    empresaFaturamento:
      | "AMPERE ENERGIAS"
      | "ANALISE DO FINANCEIRO"
      | "IZAIRA SERVIÇOS";
    previsaoFaturamento: string;
  };
  idVisitaTecnica: string;
  indicacao: {
    contato: string;
    quemIndicou: string;
  };
  insider: string;
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
  linkDrive: string;
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
  logradouro: string;
  manutencaoPreventiva: {
    data: string;
    status: string;
  };
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
  medidor: {
    data: string;
    status: string;
  };
  nomeDoContrato: string;
  nomeDoProjeto: string;
  nps: number;
  numeroResidencia: string;
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
  obsComercial: string;
  oem: {
    aplicavel: boolean;
    diagnostico: string;
    duracao: number;
    oemConcluido: boolean;
    plano: string;
    qtdeManutencao: number;
    valor: number;
  };
  ondeTrabalha: string;
  ordensDeServico: any[];
  padrao: {
    caixaConjugada: "SIM" | "NÃO" | "NÃO DEFINIDO";
    respInstalacao: "AMPERE" | "CLIENTE" | "NÃO SE APLICA";
    respPagamento: string;
    tipo: string;
    tipoEntrega: "AÉREA" | "SUBTERRÂNEO";
    valor: number;
  };
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
  parecer: {
    dataParecerDeAcesso: string;
    motivoReprova: string;
    parecerReprovado: "SIM" | "NÃO";
    pendencias: string;
    qtdeDiasObraDeRede: number;
    qtdeReprovas: number;
    statusDoParecerDeAcesso: string;
  };
  possuiaGD: boolean;
  projeto: {
    acStatus: string;
    aumentoDeCarga: "SIM" | "NÃO";
    dataLiberacaoDocumentacao: string;
    dataAssDocumentacao: string;
    dataSolicitacaoAcesso: string;
    desenhoTelhado: string;
    diagramaUnifilar: string;
    fechamentoAC: string;
    formaAssDocumentacao: "DIGITAL" | "FISICA";
    iniciar: "SIM" | "NÃO" | "NÃO DEFINIDO";
  };
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
