export const routes = [
  "Projetos",
  "Obras",
  "Suprimentos",
  "O&M",
  "Marketing",
  "Vendas",
  "Pós-Venda",
  "PPS",
  "InsideSales",
  "Financeiro",
  "ADM",
  "RH",
];
export const vendedores = [
  {
    nome: "ARTHUR CARVALHO",
    cod: 4,
  },
  {
    nome: "ARTUR MILANE",
    cod: 7,
  },
  {
    nome: "CARLOS MARQUES",
    cod: 3,
  },
  {
    nome: "DEVISSON LIMA",
    cod: 9,
  },
  {
    nome: "DIOMAR HONORIO",
    cod: 10,
  },
  {
    nome: "GETULIO EDUARDO",
    cod: 13,
  },
  {
    nome: "GLAIDSTONE JOSÉ",
    cod: 34,
  },
  {
    nome: "JESSICA PARANAIBA",
    cod: 15,
  },
  {
    nome: "JORGINHO HABIB",
    cod: 16,
  },
  {
    nome: "JULIANO SILVA",
    cod: 19,
  },
  {
    nome: "MATHEUS OLIVEIRA",
    cod: 6,
  },
  {
    nome: "NEIDSON FILHO",
    cod: 22,
  },
  {
    nome: "RAFAEL FEO",
    cod: 23,
  },
  {
    nome: "ROMES ALVES",
    cod: 24,
  },
  {
    nome: "RODRIGO MORAIS",
    cod: 27,
  },
  {
    nome: "LUCIANO MUNIZ",
    cod: 28,
  },
  {
    nome: "DIONISIO JUNIOR",
    cod: 36,
  },
  {
    nome: "LEANDRO VIALI",
    cod: 37,
  },
  {
    nome: "GUILHERME LIMA",
    cod: 38,
  },
  {
    nome: "LUCIANO JORGE",
    cod: 39,
  },
  {
    nome: "STENIO DE ASSIS",
    cod: 43,
  },
  {
    nome: "RONIVALDO MARTINS",
    cod: 47,
  },
  {
    nome: "DIOGO PAULINO",
    cod: 5,
  },
  {
    nome: "ARIÁDNNY APARECIDA",
    cod: 49,
  },
  {
    nome: "DÁFINY VILLANO",
    cod: 50,
  },
  {
    nome: "ARTHUR ALEXANDER",
    cod: 54,
  },
  {
    nome: "FELIPE RIBEIRO",
    cod: 8,
  },
  {
    nome: "ADAILSON COSTA",
    cod: 57,
  },
  {
    nome: "LUCIANO LOPES",
    cod: 58,
  },
  {
    nome: "RODRIGO DE MORAIS",
    cod: 59,
  },
  {
    nome: "EURIPEDES JUNIOR",
    cod: 61,
  },
  {
    nome: "NÃO DEFINIDO",
    cod: 999,
  },
];
export const projetistas = [
  {
    nome: "POLLIANA CRISTINA DE REZENDE",
    label: "POLLIANA",
    cod: 1,
  },
  {
    nome: "ALINE APARECIDA RODRIGUES CARVALHO",
    label: "ALINE",
    cod: 21,
  },
  {
    nome: "ANDREW BORGES ALEXANDER",
    label: "ANDREW",
    cod: 44,
  },
  {
    nome: "JORDANA ALVES DE FREITAS",
    label: "JORDANA",
    cod: 29,
  },
  {
    nome: "ANDRIELLY GARCIA DOS SANTOS MARQUES",
    label: "ANDRIELLY",
    cod: 51,
  },
  {
    nome: "GLENDA ELIAS NASCIMENTO SANTOS",
    label: "GLENDA",
    cod: 52,
  },
  {
    nome: "NÃO DEFINIDO",
    label: "NÃO DEFINIDO",
    cod: 0,
  },
];
export const acessAuth = {
  diretorExecutivo: {
    label: "Diretor(a) Executivo",
    accessibleRoutes: [
      "Projetos",
      "Obras",
      "Suprimentos",
      "O&M",
      "Marketing",
      "Vendas",
      "Pós-Venda",
      "PPS",
      "InsideSales",
      "Financeiro",
      "ADM",
      "RH",
    ],
    tiers: false,
  },
  diretorEngenharia: {
    label: "Diretor(a) de Engenharia",
    accessibleRoutes: ["Projetos", "Obras", "Suprimentos", "O&M"],
    tiers: false,
  },
  diretorComercial: {
    label: "Diretor(a) Comercial",
    accessibleRoutes: [
      "Marketing",
      "Vendas",
      "Pós-Venda",
      "PPS",
      "InsideSales",
    ],
    tiers: false,
  },
  diretorAdministrativo: {
    label: "Diretor(a) Administrativo & Finaceiro",
    accessibleRoutes: ["Financeiro", "ADM", "RH"],
    tiers: false,
  },
  usuarioProjetos: {
    label: "Usuário - Setor de Projetos",
    accessibleRoutes: ["Projetos"],
    tiers: true,
  },
  usuarioObras: {
    label: "Usuário - Setor de Obras",
    accessibleRoutes: ["Obras"],
    tiers: true,
  },
  usuarioSuprimentos: {
    label: "Usuário - Suprimentos",
    accessibleRoutes: ["Suprimentos"],
    tiers: true,
  },
  usuarioOeM: {
    label: "Usuário - O&M",
    accessibleRoutes: ["O&M"],
    tiers: true,
  },
  usuarioMarketing: {
    label: "Usuário - Marketing",
    accessibleRoutes: ["Marketing"],
    tiers: true,
  },
  usuarioVendas: {
    label: "Usuário - Vendas",
    accessibleRoutes: ["Vendas"],
    tiers: true,
  },
  usuarioPosVenda: {
    label: "Usuário - Pós Venda",
    accessibleRoutes: ["Pós-Venda"],
    tiers: true,
  },
  usuarioPPS: {
    label: "Usuário - PPS",
    accessibleRoutes: ["PPS"],
    tiers: true,
  },
  usuarioInsideSales: {
    label: "Usuário - InsideSales",
    accessibleRoutes: ["InsideSales"],
    tiers: true,
  },
  usuarioFinanceiro: {
    label: "Usuário - Financeiro",
    accessibleRoutes: ["Financeiro"],
    tiers: true,
  },
  usuarioAdministracao: {
    label: "Usuário - Administração",
    accessibleRoutes: ["ADM"],
    tiers: true,
  },
  usuarioRH: {
    label: "Usuário - Recursos Humanos",
    accessibleRoutes: ["RH"],
    tiers: true,
  },
};
export const prices = [
  {
    min: 0,
    max: 12,
    price: 29.6,
  },
  {
    min: 13,
    max: 19,
    price: 28.12,
  },
  {
    min: 20,
    max: 29,
    price: 26.71,
  },
  {
    min: 30,
    max: 49,
    price: 25.38,
  },
  {
    min: 50,
    max: 79,
    price: 24.11,
  },
  {
    min: 80,
    max: 109,
    price: 22.9,
  },
  {
    min: 110,
    max: 149,
    price: 21.76,
  },
  {
    min: 150,
    max: 199,
    price: 20.67,
  },
  {
    min: 200,
    max: 299,
    price: 19.64,
  },
  {
    min: 300,
    max: 499,
    price: 18.66,
  },
  {
    min: 500,
    max: 2000,
    price: 17.72,
  },
];
export const sellers = [
  "ADRIANO ARANTES",
  "ALLISON",
  "ARIADNNY MACEDO",
  "ARTHUR CARVALHO",
  "ARTUR MILANE",
  "DÁFINY VILANO",
  "DEVISSON LIMA",
  "DIOGO",
  "EURIPEDES JR",
  "FELIPE RIBEIRO",
  "FRANCO MUSTAFI",
  "GETULIO EDUARDO",
  "GLAIDSTONE JOSÉ",
  "JESSICA PARANAIBA",
  "JULIANO SILVA",
  "LEANDRO LOPES",
  "LUCIANO LOPES",
  "MATHEUS OLIVEIRA",
  "NEIDSON BUIU",
  "RAFAEL FEO",
  "RODRIGO RCA",
  "ROMES ROCHA",
  "RONIVALDO MARTINS",
  "WILLIAN MENEZES",
  "STENIO DE ASSIS",
  "SETOR O&M",
  "SETOR PROJETOS",
];
export const cities = [
  {
    name: "Ituiutaba",
    annualGenFactor: 125.86,
  },
  {
    name: "Monte Alegre-MG",
    annualGenFactor: 125.3,
  },
  {
    name: "Santa Vitória",
    annualGenFactor: 127.3,
  },
  {
    name: "Ipiaçu",
    annualGenFactor: 127.12,
  },
  {
    name: "Uberlândia",
    annualGenFactor: 124.96,
  },
  {
    name: "Uberaba",
    annualGenFactor: 123.56,
  },
  {
    name: "Gurinhatã",
    annualGenFactor: 126.06,
  },
  {
    name: "Prata",
    annualGenFactor: 124.74,
  },
  {
    name: "Campina Verde",
    annualGenFactor: 125.16,
  },
  {
    name: "Caldas Novas",
    annualGenFactor: 126.26,
  },
  {
    name: "Capinópolis",
    annualGenFactor: 126.24,
  },
  {
    name: "Canápolis",
    annualGenFactor: 126.82,
  },
  {
    name: "Cachoeira Dourada",
    annualGenFactor: 125.56,
  },
  {
    name: "São Simão",
    annualGenFactor: 120.52,
  },
];
export const ppsSolicitations = [
  "ANÁLISE DE CRÉDITO",
  "ASSINATURA DE CONTRATO",
  "ASSINATURA DE PROPOSTA",
  "ATUALIZAR PROPOSTA",
  "AUXÍLIO TÉCNICO(CADASTRO)",
  "CONTRATO",
  "CORREÇÃO DE CONTRATO",
  "COTAÇÃO",
  "COTAÇÃO DE PADRÃO",
  "DISTRATO",
  "PROPOSTA COMERCIAL PERSONALIZADA",
  "PROPOSTA COMERCIAL SIMPLES(CADASTRO)",
  "SIMULAÇÃO FINANCEIRA(CADASTRO)",
  "SOLICITAÇÃO DE CONTRATO",
  "PENDÊNCIA EM DOCUMENTAÇÃO DE PROJETOS",
];
export const projetosSolicitations = [
  "A DEFINIR",
  "DIAGRAMA UNIFILAR",
  "MEMORIAL DESCRITIVO",
  "DESENHO MONTAGEM",
  "DISTRIBUIÇÃO DE CRÉDITO",
  "FORMULARIO PARA SOLICITAÇÃO DE ACESSO",
  "TROCA DE TITULARIDADE",
  "AUMENTO DE CARGA BT",
  "SOLICITAR ACESSO",
  "BENEFÍCIO RURAL",
  "VISTORIA",
  "PROCURAÇÃO",
  "RELATÓRIO DE COMISSIONAMENTO",
  "MEMORIAL DESCRITIVO/DIAGRAMA UNIFILAR",
  "ALTERAÇÃO CADASTRAL CEMIG ATENDE",
  "ART",
  "CEMIG - 116",
  "CORTE PARA CONCERTO",
  "ENTRADA NO PROJETO",
  "LIGAÇÃO NOVA",
  "CONSULTA ESTÁGIO CEMIG",
  "OUTRO",
];
export const cidadesAtendidas = [
  "ITUIUTABA",
  "IPIAÇU",
  "SANTA VITÓRIA",
  "CAMPINA VERDE",
  "UBERLÂNDIA",
  "CAPINÓPOLIS",
  "GURINHATÃ",
  "PRATA",
  "CANAPOLIS",
  "CACHOEIRA DOURADA",
  "MONTE ALEGRE",
  "UBERABA",
  "CALDAS NOVAS",
  "SÃO SEBASTIÃO DO PARAISO",
  "BOM JESUS",
  "PORTEIRÃO",
  "JOÃO PINHEIRO",
  "SÃO SIMÃO",
  "INACIOLANDIA",
  "TRINDADE",
  "PATOS DE MINAS",
  "ITUMBIARA",
  "CENTRALINA",
  "SAO GONÇALO DO ABAETE",
  "PATROCINIO",
  "NOVA PONTE",
  "TUPACIGUARA",
];
