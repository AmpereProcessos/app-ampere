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
  "Almoxarifado",
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
    nome: "ADRIANO ARANTES",
    cod: 48,
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
    cod: 62,
  },
  {
    nome: "RODRIGO DE MORAIS",
    cod: 63,
  },
  {
    nome: "EURIPEDES JUNIOR",
    cod: 59,
  },
  {
    nome: "FRANCO MUSTAFE",
    cod: 64,
  },
  {
    nome: "ALLISSON OSCAR",
    cod: 65,
  },
  {
    nome: "WILLIAM MENEZES",
    cod: 66,
  },
  {
    nome: "MARIANA DE SOUZA",
    cod: 67,
  },
  {
    nome: "CÉLIO JUNIOR",
    cod: 68,
  },
  {
    nome: "THIAGO DE PAULA",
    cod: 69,
  },
  {
    nome: "GLEITON RESENDE",
    cod: 70,
  },
  {
    nome: "ANA PAULA PEREIRA",
    cod: 71,
  },
  {
    nome: "GRASIELE DA SILVA",
    cod: 72,
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
    nome: "TULIO HENRIQUE SILVA MEDEIROS",
    label: "TULIO",
    cod: 52,
  },
  {
    nome: "NÃO DEFINIDO",
    label: "NÃO DEFINIDO",
    cod: 0,
  },
];
export const listaProjetista = [];
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
  "ALLISSON OSCAR",
  "ARIÁDNNY APARECIDA",
  "ARTHUR CARVALHO",
  "ARTUR MILANE",
  "CARLOS MARQUES",
  "DÁFINY VILLANO",
  "ARTHUR ALEXANDER",
  "DEVISSON LIMA",
  "DIOMAR HONORIO",
  "DIOGO PAULINO",
  "EURIPEDES JUNIOR",
  "FELIPE RIBEIRO",
  "FRANCO MUSTAFE",
  "GETULIO EDUARDO",
  "GLAIDSTONE JOSÉ",
  "JESSICA PARANAIBA",
  "JORGINHO HABIB",
  "JULIANO SILVA",
  "LEANDRO VIALI",
  "GUILHERME LIMA",
  "LUCIANO LOPES",
  "LUCIANO JORGE",
  "LUCIANO MUNIZ",
  "MATHEUS OLIVEIRA",
  "NEIDSON BUIU",
  "RAFAEL FEO",
  "RODRIGO DE MORAIS",
  "ROMES ALVES",
  "RONIVALDO MARTINS",
  "DIONISIO JUNIOR",
  "WILLIAM MENEZES",
  "MARIANA DE SOUZA",
  "CÉLIO JUNIOR",
  "THIAGO DE PAULA",
  "GLEITON RESENDE",
  "ANA PAULA PEREIRA",
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
  "ITUIUTABA", //ok to uppercase
  "IPIAÇU", // ok to uppercase
  "SANTA VITÓRIA", //ok to uppercase
  "CAMPINA VERDE", // ok to uppercase
  "UBERLÂNDIA", // ok to uppercase
  "CAPINÓPOLIS", // ok to uppercase
  "GURINHATÃ", // ok to uppercase
  "PRATA", // ok to uppercase
  "CANÁPOLIS", // ok to uppercaseC
  "CACHOEIRA DOURADA", // ok to uppercase
  "MONTE ALEGRE", // ok to uppercase
  "UBERABA", // ok to uppercase
  "CALDAS NOVAS", // ok to uppercase
  "SÃO SEBASTIÃO DO PARAÍSO", // ok to uppercase
  "BOM JESUS", // ok to uppercase
  "PORTEIRÃO", // ok to uppercase
  "JOÃO PINHEIRO", // ok to uppercase
  "SÃO SIMÃO", // ok to uppercase
  "INACIOLÂNDIA", // ok to uppercase
  "TRINDADE", // ok to uppercase
  "PATOS DE MINAS", // ok to uppecase
  "ITUMBIARA", // ok to uppercase
  "CENTRALINA", // ok to uppercase
  "SÃO GONÇALO DO ABAETÉ", // ok to uppercase
  "PATROCÍNIO", // ok to uppercase
  "NOVA PONTE", // ok to uppercase
  "QUIRINÓPOLIS", // ok to uppercase
  "TUPACIGUARA", // ok to uppercase
  "PARANAIGUARA",
];
export const statusLiberacao = [
  {
    label: "AGUARDAR PARECER DE ACESSO",
    value: "AGUARDAR PARECER DE ACESSO",
  },
  {
    label: "PAGO",
    value: "PAGO",
  },
  {
    label: "REALIZAR COMPRA",
    value: "REALIZAR COMPRA",
  },
  {
    value: "AGUARDANDO PAGAMENTO",
    label: "AGUARDANDO PAGAMENTO",
  },
  {
    value: "AGUARDANDO N.F",
    label: "AGUARDANDO N.F",
  },
  {
    label: "RECISÃO DE CONTRATO",
    value: "RECISÃO DE CONTRATO", //tirar
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
export const credores = [
  {
    label: "BANCO DO BRASIL",
    value: "BANCO DO BRASIL",
  },
  {
    label: "BRADESCO",
    value: "BRADESCO",
  },
  {
    label: "BV FINANCEIRA",
    value: "BV FINANCEIRA",
  },
  {
    label: "CAIXA",
    value: "CAIXA",
  },
  {
    label: "COOPACREDI",
    value: "COOPACREDI",
  },
  {
    label: "CREDICAMPINA",
    value: "CREDICAMPINA",
  },
  {
    label: "CREDIPONTAL",
    value: "CREDIPONTAL",
  },
  {
    label: "SANTANDER",
    value: "SANTANDER",
  },
  {
    label: "SOL FÁCIL",
    value: "SOL FÁCIL",
  },
  {
    label: "SICOOB ARACOOP",
    value: "SICOOB ARACOOP",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
export const tiposDeEstruturas = [
  { label: "INCLINAÇÃO", value: "INCLINAÇÃO" },
  { label: "SOLO", value: "SOLO" },
  { label: "TELHADO", value: "TELHADO" },
  { label: "BARRACÃO", value: "BARRACÃO" },
  { label: "CARPORT", value: "CARPORT" },
  {
    label: "ESTRUTURA PERSONALIZADA",
    value: "ESTRUTURA PERSONALIZADA",
  },
  { label: "N/A", value: "N/A" },
];
export const tiposDeServico = [
  {
    label: "SISTEMA FOTOVOLTAICO",
    value: "SISTEMA FOTOVOLTAICO",
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
export const localEntregaOptions = [
  { label: "MESMO DO PROJETO", value: "MESMO DO PROJETO" },
  { label: "SEM RESTRIÇÕES", value: "SEM RESTRIÇÕES" },
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "DIFERENTE DO PROJETO", value: "DIFERENTE DO PROJETO" },
];
export const fornecedores = [
  {
    label: "ALDO",
    value: "ALDO",
  },
  {
    label: "AMPÈRE",
    value: "AMPÈRE",
  },
  {
    label: "BEL ENERGY",
    value: "BEL ENERGY",
  },
  {
    label: "SKY SOLAR",
    value: "SKY SOLAR",
  },
  {
    label: "SOU ENERGY",
    value: "SOU ENERGY",
  },
  {
    label: "FORTLEV",
    value: "FORTLEV",
  },
  {
    label: "GENYX",
    value: "GENYX",
  },
  {
    label: "MEGACOMM",
    value: "MEGACOMM",
  },
  {
    label: "FORTESOL",
    value: "FORTESOL",
  },
  {
    label: "EDMOND",
    value: "EDMOND",
  },
  {
    label: "AMARA",
    value: "AMARA",
  },
  {
    label: "ECORI",
    value: "ECORI",
  },
  {
    label: "RIBEIRO",
    value: "RIBEIRO",
  },
  {
    label: "TEN BRASIL",
    value: "TEN BRASIL",
  },
  {
    label: "ESFERA",
    value: "ESFERA",
  },
  {
    label: "ELSYS",
    value: "ELSYS",
  },
  {
    label: "GEL SOLAR",
    value: "GEL SOLAR",
  },
  {
    label: "HELTE",
    value: "HELTE",
  },
  {
    label: "LOJA ELÉTRICA",
    value: "LOJA ELÉTRICA",
  },
  {
    label: "SIRIUS",
    value: "SIRIUS",
  },
  {
    label: "MINHA CASA SOLAR",
    value: "MINHA CASA SOLAR",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
export const equipesTecnicas = [
  {
    label: "EQUIPE 1 - JOSÉ ROBERTO",
    value: "EQUIPE 1 - JOSÉ ROBERTO",
  },
  {
    label: "EQUIPE 2 - EDUARDO",
    value: "EQUIPE 2-EDUARDO",
  },
  {
    label: "EQUIPE 3 - EDMAR",
    value: "EQUIPE 3-EDIMAR",
  },
  {
    label: "EQUIPE 4 - ERICK",
    value: "EQUIPE 4-ERICK",
  },
  {
    label: "EQUIPE 5 - JUNIN",
    value: "EQUIPE 5-JUNIN",
  },
  {
    label: "EQUIPE 6 - FELIPE",
    value: "EQUIPE 6-FELIPE",
  },
  {
    label: "EQUIPE 7 - ADENILSON",
    value: "EQUIPE 7- ADENILSON",
  },
  {
    label: "EQUIPE 8 - GERSON",
    value: "EQUIPE 8-GERSON",
  },
  {
    label: "EQUIPE 9 - REGINALDO",
    value: "EQUIPE 9 - REGINALDO",
  },
  {
    label: "EQUIPE 10 - LUIZ",
    value: "EQUIPE 10 - LUIZ",
  },
  {
    label: "EQUIPE 11 - GILMAR",
    value: "EQUIPE 11 - GILMAR",
  },
  {
    label: "EQUIPE 12 - MARCUS V.",
    value: "EQUIPE 12 - MARCUS V.",
  },
  {
    label: "EQUIPE 13 - EDUARDO FRANCO",
    value: "EQUIPE 13 - EDUARDO FRANCO",
  },
  {
    label: "EQUIPE 15 - MARCOS B.",
    value: "EQUIPE 15 - MARCOS B.",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
  {
    label: "VAZIO",
    value: undefined,
  },
];
