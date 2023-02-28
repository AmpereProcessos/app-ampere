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
export const tiposChamadosSuporte = [
  {
    tipo: "PROBLEMAS COM CONCESSIONÁRIA",
    grauUrgenciaOeM: "B",
    grauUrgenciaNormal: "C",
  },
  {
    tipo: "APP OFFLINE",
    grauUrgenciaOeM: "B",
    grauUrgenciaNormal: "D",
  },
  {
    tipo: "INVERSOR NÃO CONFIGURADO",
    grauUrgenciaOeM: "A",
    grauUrgenciaNormal: "D",
  },
  {
    tipo: "SISTEMA SEM GERAÇÃO",
    grauUrgenciaOeM: "A",
    grauUrgenciaNormal: "A",
  },
  {
    tipo: "SISTEMA COM BAIXA GERAÇÃO",
    grauUrgenciaOeM: "B",
    grauUrgenciaNormal: "C",
  },
  {
    tipo: "GOTEIRA",
    grauUrgenciaOeM: "B",
    grauUrgenciaNormal: "B",
  },
  {
    tipo: "RETRABALHO EM ESTRUTURA",
    grauUrgenciaOeM: "A",
    grauUrgenciaNormal: "B",
  },
  {
    tipo: "DEFEITOS E GARANTIA",
    grauUrgenciaOeM: "A",
    grauUrgenciaNormal: "B",
  },
  {
    tipo: "OUTROS",
    grauUrgenciaOeM: "C",
    grauUrgenciaNormal: "C",
  },
];
export const oemPlans = [
  {
    label: "MANUTENÇÃO SIMPLES",
    value: "MANUTENÇÃO SIMPLES",
  },
  {
    label: "PLANO SOL",
    value: "PLANO SOL",
  },
  {
    label: "PLANO SOL +",
    value: "PLANO SOL +",
  },
  {
    label: "INCLUSO NO CONTRATO",
    value: "INCLUSO NO CONTRATO",
  },
];
export const reportsByPlan = {
  "MANUTENÇÃO SIMPLES": {
    relatorios: [],
  },
  "PLANO SOL": {
    relatorios: [
      "envioUm",
      "envioDois",
      "envioTres",
      "envioQuatro",
      "envioCinco",
      "envioSeis",
      "envioSete",
      "envioOito",
      "envioNove",
      "envioDez",
      "envioOnze",
      "envioDoze",
    ],
  },
  "PLANO SOL +": {
    relatorios: [
      "envioUm",
      "envioDois",
      "envioTres",
      "envioQuatro",
      "envioCinco",
      "envioSeis",
      "envioSete",
      "envioOito",
      "envioNove",
      "envioDez",
      "envioOnze",
      "envioDoze",
    ],
  },
  "INCLUSO NO CONTRATO": {
    relatorios: ["envioUm", "envioDois", "envioTres", "envioQuatro"],
  },
};
export const fileTypes = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    title: "WORD",
  },
  "image/png": {
    title: "IMAGEM (.PNG)",
  },
  "image/jpeg": {
    title: "IMAGEM(.JPEG)",
  },
  "application/pdf": {
    title: "PDF",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    title: "EXCEL",
  },
  "text/xml": {
    title: "XML",
  },
  "video/mp4": {
    title: "MP4",
  },
};
export const vendedores = [
  {
    nome: "ARTHUR CARVALHO",
    cod: 4,
    cargo: "INTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "ARTUR MILANE",
    cod: 7,
    cargo: "INTERNO",
    qualificacao: "PLENO",
    comissaoInside: 1,
    comissaoAtivo: 2,
  },
  {
    nome: "CARLOS MARQUES",
    cod: 3,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "DEVISSON LIMA",
    cod: 9,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.86,
    comissaoAtivo: 0.86,
  },
  {
    nome: "DIOMAR HONORIO",
    cod: 10,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 4,
    comissaoAtivo: 5,
  },
  {
    nome: "GETULIO EDUARDO",
    cod: 13,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "GLAIDSTONE JOSÉ",
    cod: 34,
    cargo: "INTERNO",
    qualificacao: "PLENO",
    comissaoInside: 1,
    comissaoAtivo: 2,
  },
  {
    nome: "JESSICA PARANAIBA",
    cod: 15,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "JORGINHO HABIB",
    cod: 16,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 3,
  },
  {
    nome: "JULIANO SILVA",
    cod: 19,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "MATHEUS OLIVEIRA",
    cod: 6,
    cargo: "INTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "NEIDSON FILHO",
    cod: 22,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 4,
    comissaoAtivo: 5,
  },
  {
    nome: "RAFAEL FEO",
    cod: 23,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "ROMES ALVES",
    cod: 24,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "RODRIGO MORAIS",
    cod: 27,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 3,
    comissaoAtivo: 4,
  },
  {
    nome: "LUCIANO MUNIZ",
    cod: 28,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "DIONISIO JUNIOR",
    cod: 36,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 4,
    comissaoAtivo: 5,
  },
  {
    nome: "LEANDRO VIALI",
    cod: 37,
    cargo: "EXTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.89,
    comissaoAtivo: 0.89,
  },
  {
    nome: "GUILHERME LIMA",
    cod: 38,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "LUCIANO JORGE",
    cod: 39,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "STENIO DE ASSIS",
    cod: 43,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "RONIVALDO MARTINS",
    cod: 47,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "DIOGO PAULINO",
    cod: 5,
    cargo: "INTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "ADRIANO ARANTES",
    cod: 48,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "ARIÁDNNY APARECIDA",
    cod: 49,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "DÁFINY VILLANO",
    cod: 50,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.9,
    comissaoAtivo: 0.9,
  },
  {
    nome: "ARTHUR ALEXANDER",
    cod: 54,
  },
  {
    nome: "FELIPE RIBEIRO",
    cod: 8,
    cargo: "INTERNO",
    qualificacao: "INSIDE SENIOR",
    comissaoInside: 0.25,
    comissaoAtivo: 0.25,
  },
  {
    nome: "ADAILSON COSTA",
    cod: 57,
  },
  {
    nome: "LUCIANO LOPES",
    cod: 62,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "RODRIGO DE MORAIS",
    cod: 63,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
  },
  {
    nome: "EURIPEDES JUNIOR",
    cod: 59,
    cargo: "EXTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
  },
  {
    nome: "FRANCO MUSTAFE",
    cod: 64,
    comissaoInside: 2,
    comissaoAtivo: 4,
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
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.9,
    comissaoAtivo: 0.9,
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
    nome: "MARCUS VINÍCIUS",
    cod: 73,
    comissaoInside: 2,
    comissaoAtivo: 4,
  },
  {
    nome: "LEONARDO VILARINHO",
    cod: 75,
    comissaoInside: 1,
    comissaoAtivo: 1.5,
  },
  {
    nome: "NÃO DEFINIDO",
    cod: 999,
  },
];
export const irradByCity = [
  { cidade: "ITUIUTABA", irrad: 5.234 },
  { cidade: "IPIAÇU", irrad: 5.297 },
  { cidade: "SANTA VITÓRIA", irrad: 5.302 },
  { cidade: "CAMPINA VERDE", irrad: 5.205 },
  { cidade: "UBERLÂNDIA", irrad: 5.238 },
  { cidade: "CAPINÓPOLIS", irrad: 5.259 },
  { cidade: "GURINHATÃ", irrad: 5.243 },
  { cidade: "PRATA", irrad: 5.207 },
  { cidade: "CANÁPOLIS", irrad: 5.285 },
  { cidade: "CACHOEIRA DOURADA", irrad: 5.242 },
  { cidade: "MONTE ALEGRE", irrad: 4.876 },
  { cidade: "UBERABA", irrad: 5.148 },
  { cidade: "CALDAS NOVAS", irrad: 5.215 },
  { cidade: "SÃO SEBASTIÃO DO PARAÍSO", irrad: 5.053 },
  { cidade: "BOM JESUS", irrad: 4.962 },
  { cidade: "PORTEIRÃO", irrad: 5.215 },
  { cidade: "JOÃO PINHEIRO", irrad: 5.514 },
  { cidade: "SÃO SIMÃO", irrad: 5.165 },
  { cidade: "INACIOLÂNDIA", irrad: 5.215 },
  { cidade: "TRINDADE", irrad: 5.215 },
  { cidade: "PATOS DE MINAS", irrad: 5.299 },
  { cidade: "ITUMBIARA", irrad: 5.215 },
  { cidade: "CENTRALINA", irrad: 5.307 },
  { cidade: "SÃO GONÇALO DO ABAETÉ", irrad: 5.379 },
  { cidade: "PATROCÍNIO", irrad: 5.247 },
  { cidade: "NOVA PONTE", irrad: 5.141 },
  { cidade: "QUIRINÓPOLIS", irrad: 5.228 },
  { cidade: "TUPACIGUARA", irrad: 5.269 },
  { cidade: "PARANAIGUARA", irrad: 5.215 },
  { cidade: "ARAGUARI", irrad: 5.299 },
  { cidade: "IRAÍ DE MINAS", irrad: 5.155 },
];
export const fatorDeGeracaoPorOrientacao = {
  ITUIUTABA: {
    fatorGen: "125.62",
    LESTE: "113.93",
    NORDESTE: "123.23",
    NORTE: "125.62",
    NOROESTE: "123.23",
    OESTE: "112.80",
    SUDOESTE: "105.84",
    SUL: "98.86",
    SUDESTE: "107.00",
  },
  IPIAÇU: {
    fatorGen: "127.13",
    LESTE: "115.31",
    NORDESTE: "124.71",
    NORTE: "127.13",
    NOROESTE: "124.71",
    OESTE: "114.16",
    SUDOESTE: "107.12",
    SUL: "100.05",
    SUDESTE: "108.29",
  },
  "SANTA VITÓRIA": {
    fatorGen: "127.25",
    LESTE: "115.41",
    NORDESTE: "124.83",
    NORTE: "127.25",
    NOROESTE: "124.83",
    OESTE: "114.27",
    SUDOESTE: "107.22",
    SUL: "100.14",
    SUDESTE: "108.39",
  },
  "CAMPINA VERDE": {
    fatorGen: "124.92",
    LESTE: "113.30",
    NORDESTE: "122.55",
    NORTE: "124.92",
    NOROESTE: "122.55",
    OESTE: "112.18",
    SUDOESTE: "105.26",
    SUL: "98.31",
    SUDESTE: "106.41",
  },
  UBERLÂNDIA: {
    fatorGen: "125.71",
    LESTE: "114.02",
    NORDESTE: "123.32",
    NORTE: "125.71",
    NOROESTE: "123.32",
    OESTE: "112.89",
    SUDOESTE: "105.92",
    SUL: "98.94",
    SUDESTE: "107.08",
  },
  CAPINÓPOLIS: {
    fatorGen: "126.22",
    LESTE: "114.48",
    NORDESTE: "123.82",
    NORTE: "126.22",
    NOROESTE: "123.82",
    OESTE: "113.34",
    SUDOESTE: "106.35",
    SUL: "99.33",
    SUDESTE: "107.51",
  },
  GURINHATÃ: {
    fatorGen: "125.83",
    LESTE: "114.13",
    NORDESTE: "123.44",
    NORTE: "125.83",
    NOROESTE: "123.44",
    OESTE: "113.00",
    SUDOESTE: "106.03",
    SUL: "99.03",
    SUDESTE: "107.18",
  },
  PRATA: {
    fatorGen: "124.97",
    LESTE: "113.35",
    NORDESTE: "122.59",
    NORTE: "124.97",
    NOROESTE: "122.59",
    OESTE: "112.22",
    SUDOESTE: "105.30",
    SUL: "98.35",
    SUDESTE: "106.45",
  },
  CANÁPOLIS: {
    fatorGen: "126.84",
    LESTE: "115.04",
    NORDESTE: "124.43",
    NORTE: "126.84",
    NOROESTE: "124.43",
    OESTE: "113.90",
    SUDOESTE: "106.88",
    SUL: "99.82",
    SUDESTE: "108.04",
  },
  "CACHOEIRA DOURADA": {
    fatorGen: "125.81",
    LESTE: "114.11",
    NORDESTE: "123.42",
    NORTE: "125.81",
    NOROESTE: "123.42",
    OESTE: "112.98",
    SUDOESTE: "106.01",
    SUL: "99.01",
    SUDESTE: "107.16",
  },
  "MONTE ALEGRE": {
    fatorGen: "117.02",
    LESTE: "106.14",
    NORDESTE: "114.80",
    NORTE: "117.02",
    NOROESTE: "114.80",
    OESTE: "105.09",
    SUDOESTE: "98.60",
    SUL: "92.10",
    SUDESTE: "99.68",
  },
  UBERABA: {
    fatorGen: "123.55",
    LESTE: "112.06",
    NORDESTE: "121.20",
    NORTE: "123.55",
    NOROESTE: "121.20",
    OESTE: "110.95",
    SUDOESTE: "104.10",
    SUL: "97.24",
    SUDESTE: "105.24",
  },
  "CALDAS NOVAS": {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  "SÃO SEBASTIÃO DO PARAÍSO": {
    fatorGen: "121.27",
    LESTE: "109.99",
    NORDESTE: "118.97",
    NORTE: "121.27",
    NOROESTE: "118.97",
    OESTE: "108.90",
    SUDOESTE: "102.18",
    SUL: "95.44",
    SUDESTE: "103.30",
  },
  "BOM JESUS": {
    fatorGen: "119.09",
    LESTE: "108.01",
    NORDESTE: "116.83",
    NORTE: "119.09",
    NOROESTE: "116.83",
    OESTE: "106.94",
    SUDOESTE: "100.34",
    SUL: "93.72",
    SUDESTE: "101.44",
  },
  PORTEIRÃO: {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  "JOÃO PINHEIRO": {
    fatorGen: "132.34",
    LESTE: "120.03",
    NORDESTE: "129.82",
    NORTE: "132.34",
    NOROESTE: "129.82",
    OESTE: "118.84",
    SUDOESTE: "111.51",
    SUL: "104.15",
    SUDESTE: "112.72",
  },
  "SÃO SIMÃO": {
    fatorGen: "123.96",
    LESTE: "112.43",
    NORDESTE: "121.60",
    NORTE: "123.96",
    NOROESTE: "121.60",
    OESTE: "111.32",
    SUDOESTE: "104.45",
    SUL: "97.56",
    SUDESTE: "105.59",
  },
  INACIOLÂNDIA: {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  TRINDADE: {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  "PATOS DE MINAS": {
    fatorGen: "127.18",
    LESTE: "115.35",
    NORDESTE: "124.76",
    NORTE: "127.18",
    NOROESTE: "124.76",
    OESTE: "114.20",
    SUDOESTE: "107.16",
    SUL: "100.09",
    SUDESTE: "108.33",
  },
  ITUMBIARA: {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  CENTRALINA: {
    fatorGen: "127.37",
    LESTE: "115.52",
    NORDESTE: "124.95",
    NORTE: "127.37",
    NOROESTE: "124.95",
    OESTE: "114.38",
    SUDOESTE: "107.32",
    SUL: "100.24",
    SUDESTE: "108.49",
  },
  "SÃO GONÇALO DO ABAETÉ": {
    fatorGen: "129.10",
    LESTE: "117.09",
    NORDESTE: "126.64",
    NORTE: "129.10",
    NOROESTE: "126.64",
    OESTE: "115.93",
    SUDOESTE: "108.78",
    SUL: "101.60",
    SUDESTE: "109.96",
  },
  PATROCÍNIO: {
    fatorGen: "125.93",
    LESTE: "114.22",
    NORDESTE: "123.54",
    NORTE: "125.93",
    NOROESTE: "123.54",
    OESTE: "113.08",
    SUDOESTE: "106.11",
    SUL: "99.11",
    SUDESTE: "107.27",
  },
  "NOVA PONTE": {
    fatorGen: "123.38",
    LESTE: "111.91",
    NORDESTE: "121.04",
    NORTE: "123.38",
    NOROESTE: "121.04",
    OESTE: "110.80",
    SUDOESTE: "103.96",
    SUL: "97.10",
    SUDESTE: "105.10",
  },
  QUIRINÓPOLIS: {
    fatorGen: "125.47",
    LESTE: "113.80",
    NORDESTE: "123.09",
    NORTE: "125.47",
    NOROESTE: "123.09",
    OESTE: "112.67",
    SUDOESTE: "105.72",
    SUL: "98.75",
    SUDESTE: "106.88",
  },
  TUPACIGUARA: {
    fatorGen: "126.46",
    LESTE: "114.70",
    NORDESTE: "124.05",
    NORTE: "126.46",
    NOROESTE: "124.05",
    OESTE: "113.56",
    SUDOESTE: "106.55",
    SUL: "99.52",
    SUDESTE: "107.72",
  },
  PARANAIGUARA: {
    fatorGen: "125.16",
    LESTE: "113.52",
    NORDESTE: "122.78",
    NORTE: "125.16",
    NOROESTE: "122.78",
    OESTE: "112.39",
    SUDOESTE: "105.46",
    SUL: "98.50",
    SUDESTE: "106.61",
  },
  ARAGUARI: {
    fatorGen: "127.18",
    LESTE: "115.35",
    NORDESTE: "124.76",
    NORTE: "127.18",
    NOROESTE: "124.76",
    OESTE: "114.20",
    SUDOESTE: "107.16",
    SUL: "100.09",
    SUDESTE: "108.33",
  },
  "IRAÍ DE MINAS": {
    fatorGen: "123.72",
    LESTE: "112.21",
    NORDESTE: "121.37",
    NORTE: "123.72",
    NOROESTE: "121.37",
    OESTE: "111.10",
    SUDOESTE: "104.25",
    SUL: "97.37",
    SUDESTE: "105.38",
  },
};

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
export const regionais = ["REGIONAL UBERLÂNDIA", "REGIONAL ITUIUTABA"];
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
      "Almoxarifado",
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
  "PROPOSTA COMERCIAL",
  "SIMULAÇÃO FINANCEIRA(CADASTRO)",
  "SOLICITAÇÃO DE CONTRATO",
  "PENDÊNCIA EM DOCUMENTAÇÃO DE PROJETOS",
];
export const projetosSolicitations = [
  "A DEFINIR",
  "DIAGRAMA UNIFILAR",
  "PLANTA DE SITUAÇÃO",
  "MEMORIAL DESCRITIVO",
  "DESENHO MONTAGEM",
  "CORREÇÃO DE EQUIPAMENTO",
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
  "ITUIUTABA", // MG
  "IPIAÇU", //  MG
  "SANTA VITÓRIA", // MG
  "CAMPINA VERDE", // MG
  "UBERLÂNDIA", //  MG
  "CAPINÓPOLIS", // MG
  "GURINHATÃ", // MG
  "PRATA", // MG
  "CANÁPOLIS", // MG
  "CACHOEIRA DOURADA", // MG
  "MONTE ALEGRE", // MG
  "UBERABA", // MG
  "CALDAS NOVAS", // GO
  "SÃO SEBASTIÃO DO PARAÍSO", // MG
  "BOM JESUS", // MG
  "PORTEIRÃO", // GO
  "JOÃO PINHEIRO", // MG
  "SÃO SIMÃO", // GO
  "INACIOLÂNDIA", // GO
  "TRINDADE", // GO
  "PATOS DE MINAS", // MG
  "ITUMBIARA", // GO
  "CENTRALINA", // MG
  "SÃO GONÇALO DO ABAETÉ", // MG
  "PATROCÍNIO", // MG
  "NOVA PONTE", // MG
  "QUIRINÓPOLIS", // GO
  "TUPACIGUARA", // MG
  "PARANAIGUARA", // GO
  "ARAGUARI", // MG
  "IRAÍ DE MINAS", // MG
  "CATALÃO", // GO
  "JUIZ DE FORA", // MG
  "LIMEIRA DO OESTE", // MG
  "SÃO FRANCISCO DE SALES", // MG,
  "BRASÍLIA", // DF
];
export const suprimentoOption = {
  GRAMPO: {
    tipo: ["FINAL", "INTERMEDIÁRIO"],
    unidade: "UNIDADE",
  },
  TRILHO: {
    tipo: ["1,85", "2,20", "2,36", "2,40", "2,50", "3,20", "3,30", "4,20"],
    unidade: "UNIDADE",
  },
  "PARAFUSO FIBROCIMENTO": {
    tipo: ["MADEIRA", "FERRO"],
    unidade: "UNIDADE",
  },
  "PAR DE JUNÇÃO": {
    tipo: ["TRILHO"],
    unidade: "UNIDADE",
  },
  CABO: {
    tipo: ["SOLAR(VERMELHO)", "SOLAR(PRETO)"],
    unidade: "METRO",
  },
  "CONECTOR MC4": {
    tipo: ["-"],
    unidade: "UNIDADE",
  },
  "ESTRUTURA SOLO": {
    tipo: ["MESA DUPLA"],
    unidade: "MESA",
  },
};
export const statusObra = [
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
    label: "SICRED",
    value: "SICRED",
  },
  {
    label: "SICOOB ARACOOP",
    value: "SICOOB ARACOOP",
  },
  {
    label: "SICOOB",
    value: "SICOOB",
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
    label: "SOLAR INOVE",
    value: "SOLAR INOVE",
  },
  {
    label: "DICOMP",
    value: "DICOMP",
  },
  {
    label: "BYD",
    value: "BYD",
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
    label: "EQUIPE 8 - DIONLEN", // mudar para DIONLEN
    value: "EQUIPE 8 - DIONLEN", // mudar para DIONLEN
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
    label: "EQUIPE 14 - GERSON",
    value: "EQUIPE 14 - GERSON",
  },
  {
    label: "EQUIPE 15 - MARCUS B. (INACIOLANDIA)",
    value: "EQUIPE 15 - MARCOS B.",
  },
  {
    label: "EQUIPE 16 - JOÃO FILHO",
    value: "EQUIPE 16 - JOÃO FILHO",
  },
  {
    label: "EQUIPE 17 - MATHEUS E DIOGO",
    value: "EQUIPE 17 - MATHEUS E DIOGO",
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
// Função para deletar arquivos antigos do Firebase
// async function listFiles() {
//   const listRef = ref(storage);
//   let arq = await listAll(listRef);
//   arq.prefixes.forEach(async (folderRef) => {
//     console.log(folderRef.name);
//     if (folderRef.name == "chamadosPPS") {
//       let chamadosRef = await listAll(folderRef);
//       chamadosRef.prefixes.forEach(async (pasta) => {
//         let clientes = await listAll(pasta);
//         clientes.items.forEach(async (cliente) => {
//           let clienteRef = ref(storage, cliente.fullPath);
//           let metaData = await getMetadata(clienteRef);
//           if (
//             new Date(metaData.timeCreated) <
//             new Date("2022-12-10T19:39:13.481Z")
//           ) {
//             let fileRef = ref(storage, metaData.fullPath);
//             deleteObject(fileRef).then((res) => console.log(res));
//           }
//         });
//       });
//     }
//   });
// }
