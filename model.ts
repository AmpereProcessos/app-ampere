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
]
