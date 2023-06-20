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
  };
}

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
