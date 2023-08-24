import axios from "axios";
//teste
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
export const companySignerKeys = [
  {
    key: "8cb69cac-4044-48fd-8ada-1d699f64bd1d",
    email: "matheus.oliveira@ampereenergias.com.br",
    name: "Matheus de Lima Oliveira",
    documentation: "136.680.836-30",
    sign_as: "validator",
  },
  {
    key: "06d287f1-ae2a-4e01-ba10-4ca31c944dd2",
    email: "financeiro@ampereenergias.com.br",
    name: "Diogo Paulino Carvalho",
    documentation: "072.427.186-43",
    sign_as: "contractee",
  },
];
export const firebaseServiceAccount = {
  type: "service_account",
  project_id: "sistemaampere",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};

// ESQUERDA  129ABA
// DIREITA   15599A
export const respChamadosPPS = [
  { label: "A DEFINIR", value: "A DEFINIR" },
  { label: "LEANDRO", value: "LEANDRO" },
  { label: "ADRIANO", value: "ADRIANO" },
  { label: "ARTHUR", value: "ARTHUR" },
  { label: "NATHAN", value: "NATHAN" },
  { label: "MATHEUS", value: "MATHEUS" },
  { label: "LUCAS", value: "LUCAS" },
];
export const units = [
  { label: "UNIDADE (UN)", value: "UN" },
  { label: "PACOTE (PC)", value: "PC" },
  { label: "QUILO (KG)", value: "KG" },
  { label: "CX (CAIXA)", value: "CX" },
  { label: "M (METRO)", value: "M" },
  { label: "METRO CÚBICO (M³)", value: "M³" },
  { label: "LITROS (L)", value: "L" },
];
export const customersAcquisitionChannels = [
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
  {
    label: "NETWORK",
    value: "NETWORK",
  },
  {
    label: "INSIDE SALES",
    value: "INSIDE SALES",
  },
  {
    label: "INDICAÇÃO DE AMIGO",
    value: "INDICAÇÃO DE AMIGO",
  },
  {
    label: "CALCULADORA SOLAR",
    value: "CALCULADORA SOLAR",
  },
  { label: "GOOGLE ADS", value: "GOOGLE ADS" },
  { label: "FACEBOOK ADS", value: "FACEBOOK ADS" },
  {
    label: "PORTA A PORTA",
    value: "PORTA A PORTA",
  },
  {
    label: "TELEVENDAS",
    value: "TELEVENDAS",
  },
  {
    label: "EVENTO",
    value: "EVENTO",
  },
  {
    label: "PASSIVO",
    value: "PASSIVO",
  },
  { label: "PROSPECÇÃO ATIVA", value: "PROSPECÇÃO ATIVA" },
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
    extension: ".docx",
  },
  "image/png": {
    title: "IMAGEM (.PNG)",
    extension: ".png",
  },
  "image/jpeg": {
    title: "IMAGEM(.JPEG)",
    extension: ".jpeg",
  },
  "image/tiff": {
    title: "IMAGEM(.TIFF)",
    extension: ".tiff",
  },
  "application/pdf": {
    title: "PDF",
    extension: ".pdf",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    title: "EXCEL",
    extension: ".xlsx",
  },
  "text/xml": {
    title: "XML",
    extension: ".xml",
  },
  "video/mp4": {
    title: "MP4",
    extension: ".mp4",
  },
  "application/vnd.sealed.tiff": {
    title: "IMAGEM(.TIFF)",
    extension: ".tiff",
  },
  "image/vnd.sealedmedia.softseal.jpg": {
    title: "IMAGEM(.JPG)",
    extension: ".jpg",
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
    ativo: true,
  },
  {
    nome: "ARTUR MILANE",
    cod: 7,
    cargo: "INTERNO",
    qualificacao: "PLENO",
    comissaoInside: 1,
    comissaoAtivo: 2,
    ativo: true,
  },
  {
    nome: "CARLOS MARQUES",
    cod: 3,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "DEVISSON LIMA",
    cod: 9,
    cargo: "INTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 1,
    comissaoAtivo: 2,
    ativo: true,
  },
  {
    nome: "DIOMAR HONORIO",
    cod: 10,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 4,
    comissaoAtivo: 5,
    ativo: true,
  },
  {
    nome: "GETULIO EDUARDO",
    cod: 13,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "GLAIDSTONE JOSÉ",
    cod: 34,
    cargo: "INTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 1,
    comissaoAtivo: 2,
    ativo: true,
  },
  {
    nome: "JESSICA PARANAIBA",
    cod: 15,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "JORGINHO HABIB",
    cod: 16,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 3,
    ativo: false,
  },
  {
    nome: "JULIANO SILVA",
    cod: 19,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "MATHEUS OLIVEIRA",
    cod: 6,
    cargo: "INTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: true,
  },
  {
    nome: "NEIDSON FILHO",
    cod: 22,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 4,
    comissaoAtivo: 5,
    ativo: true,
  },
  {
    nome: "RAFAEL FEO",
    cod: 23,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: true,
  },
  {
    nome: "ROMES ALVES",
    cod: 24,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "RODRIGO MORAIS",
    cod: 27,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 3,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "LUCIANO MUNIZ",
    cod: 28,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: false,
  },
  {
    nome: "DIONISIO JUNIOR",
    cod: 36,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    comissaoInside: 4,
    comissaoAtivo: 5,
    ativo: true,
  },
  {
    nome: "LEANDRO VIALI",
    cod: 37,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.5,
    comissaoAtivo: 0.5,
    ativo: true,
  },
  {
    nome: "GUILHERME LIMA",
    cod: 38,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "LUCIANO JORGE",
    cod: 39,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "STENIO DE ASSIS",
    cod: 43,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "RONIVALDO MARTINS",
    cod: 47,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "DIOGO PAULINO",
    cod: 5,
    cargo: "INTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: true,
  },
  {
    nome: "ADRIANO ARANTES",
    cod: 48,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: true,
  },
  {
    nome: "ARIÁDNNY APARECIDA",
    cod: 49,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: false,
  },
  {
    nome: "DÁFINY VILLANO",
    cod: 50,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.9,
    comissaoAtivo: 0.9,
    ativo: false,
  },
  {
    nome: "ARTHUR ALEXANDER",
    cod: 54,
    ativo: false,
  },
  {
    nome: "FELIPE RIBEIRO",
    cod: 8,
    cargo: "INTERNO",
    qualificacao: "INSIDE SENIOR",
    comissaoInside: 0.25,
    comissaoAtivo: 0.25,
    ativo: false,
  },
  {
    nome: "ADAILSON COSTA",
    cod: 57,
    ativo: false,
  },
  {
    nome: "LUCIANO LOPES",
    cod: 62,
    cargo: "EXTERNO",
    qualificacao: "JUNIOR",
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "RODRIGO DE MORAIS",
    cod: 63,
    cargo: "EXTERNO",
    qualificacao: "PLENO",
    ativo: true,
  },
  {
    nome: "EURIPEDES JUNIOR",
    cod: 59,
    cargo: "EXTERNO",
    qualificacao: "MASTER",
    comissaoInside: 0,
    comissaoAtivo: 0,
    ativo: true,
  },
  {
    nome: "FRANCO MUSTAFE",
    cod: 64,
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: false,
  },
  {
    nome: "ALLISSON OSCAR",
    cod: 65,
    ativo: false,
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
    ativo: false,
  },
  {
    nome: "CÉLIO JUNIOR",
    cod: 68,
    ativo: false,
  },
  {
    nome: "THIAGO DE PAULA",
    cod: 69,
    ativo: true,
  },
  {
    nome: "GLEITON RESENDE",
    cod: 70,
    ativo: false,
  },
  {
    nome: "ANA PAULA PEREIRA",
    cod: 71,
    ativo: false,
  },
  {
    nome: "GRASIELE DA SILVA",
    cod: 72,
    ativo: false,
  },
  {
    nome: "MARCUS VINÍCIUS",
    cod: 73,
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "LEONARDO VILARINHO",
    cod: 75,
    comissaoInside: 1,
    comissaoAtivo: 1.5,
    ativo: true,
  },
  {
    nome: "ROBERTH JUNQUEIRA",
    cod: 76,
    comissaoInside: 2,
    comissaoAtivo: 4,
    ativo: true,
  },
  {
    nome: "GABRIEL MARTINS",
    cod: 999,
    ativo: true,
  },
  {
    nome: "LUCAS FERNANDES",
    cod: 9999,
    ativo: true,
  },
  {
    nome: "GABRIEL EMANUEL",
    cod: 77,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.5,
    comissaoAtivo: 0.5,
    ativo: true,
  },
  {
    nome: "YASMIM ARAUJO",
    cod: 78,
    cargo: "INTERNO",
    qualificacao: "INSIDE JUNIOR",
    comissaoInside: 0.5,
    comissaoAtivo: 0.5,
    ativo: true,
  },
  {
    nome: "RAILDO CARVALHO",
    cod: 79,
    comissaoInside: 1,
    comissaoAtivo: 2,
    ativo: true,
  },
  {
    nome: "SEBASTIÃO NETO",
    cod: 80,
    comissaoInside: 1,
    comissaoAtivo: 2,
    ativo: true,
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
  { cidade: "BOM JESUS DE GOIÁS", irrad: 4.962 },
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
  "MONTE ALEGRE DE MINAS": {
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
  "BOM JESUS DE GOIÁS": {
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
  CHAVESLÂNDIA: {
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
};
export const expenseCategories = [
  { id: 1, label: "MONTAGEM", value: "MONTAGEM" },
  { id: 2, label: "PADRÃO", value: "PADRÃO" },
  { id: 3, label: "ESTRUTURA", value: "ESTRUTURA" },
  { id: 4, label: "MANUTENÇÃO CORRETIVA", value: "MANUTENÇÃO CORRETIVA" },
  { id: 5, label: "MANUTENÇÃO PREVENTIVA", value: "MANUTENÇÃO PREVENTIVA" },
  { id: 6, label: "OUTROS", value: "OUTROS" },
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
    cod: 53,
  },
  {
    nome: "EDUARDO HENRIQUE DOMINGOS DE MORAES",
    label: "EDUARDO",
    cod: 54,
  },
  {
    nome: "NÃO DEFINIDO",
    label: "NÃO DEFINIDO",
    cod: 0,
  },
];
export const tiposSolicitacaoVisitaTecnica = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  {
    label: "VISITA TÉCNICA REMOTA - URBANA",
    value: "VISITA TÉCNICA REMOTA - URBANA",
  },
  {
    label: "VISITA TÉCNICA REMOTA - RURAL",
    value: "VISITA TÉCNICA REMOTA - RURAL",
  },
  {
    label: "VISITA TÉCNICA IN LOCO - URBANA",
    value: "VISITA TÉCNICA IN LOCO - URBANA",
  },
  {
    label: "VISITA TÉCNICA IN LOCO - RURAL",
    value: "VISITA TÉCNICA IN LOCO - RURAL",
  },
  { label: "ALTERAÇÃO DE PROJETO", value: "ALTERAÇÃO DE PROJETO" },
  {
    label: "AUMENTO DE SISTEMA AMPÈRE",
    value: "AUMENTO DE SISTEMA AMPÈRE",
  },
  { label: "DESENHO PERSONALIZADO", value: "DESENHO PERSONALIZADO" },
  { label: "ORÇAMENTAÇÃO", value: "ORÇAMENTAÇÃO" },
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
    price: 19.9,
  },
  {
    min: 13,
    max: 19,
    price: 18.91,
  },
  {
    min: 20,
    max: 29,
    price: 17.96,
  },
  {
    min: 30,
    max: 49,
    price: 17.06,
  },
  {
    min: 50,
    max: 79,
    price: 16.21,
  },
  {
    min: 80,
    max: 109,
    price: 15.4,
  },
  {
    min: 110,
    max: 149,
    price: 13.86,
  },
  {
    min: 150,
    max: 199,
    price: 12.47,
  },
  {
    min: 200,
    max: 299,
    price: 11.23,
  },
  {
    min: 300,
    max: 499,
    price: 10.1,
  },
  {
    min: 500,
    max: 2000,
    price: 9.09,
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
  "MARCUS VINÍCIUS",
  "STENIO DE ASSIS",
  "SETOR O&M",
  "SETOR PROJETOS",
];
export const sellerPhotos = [
  {
    nome: "RAFAEL FEO",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-rafael_feo?alt=media&token=edec02ff-c2df-455d-ad30-8358710dda93",
  },
  {
    nome: "STENIO DE ASSIS",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_stenio.jpg?alt=media&token=44eef96f-7f8b-4e1b-95c0-ab609aef50c9",
  },
  {
    nome: "MATHEUS OLIVEIRA",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2FavatarMatheus.jpg?alt=media&token=adb60500-22e6-4c1d-908f-72e3279fc641",
  },
  {
    nome: "GLAIDSTONE JOSÉ",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_glaidstone.jpg?alt=media&token=d3ccf4dc-a161-4ffd-93a3-4d00b4c58730",
  },
  {
    nome: "DEVISSON LIMA",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-devisson_lima?alt=media&token=16b55942-a9ad-44dc-a9e0-84eedb00c01d",
  },
  {
    nome: "JULIANO SILVA",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_juliano.jpg?alt=media&token=3893b2ea-9f9a-48ca-8f1c-cc85aa04ecbd",
  },
  {
    nome: "LEONARDO VILARINHO",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-leonardo_vilarinho?alt=media&token=fb98055c-ce57-4a3c-92fa-eee92c0aa683",
  },
  {
    nome: "ARTUR MILANE",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar-artur_milane?alt=media&token=5e0d511d-2449-4ec6-9158-5386b94ef3bd",
  },
  {
    nome: "MARCUS VINÍCIUS",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_marcusvinicius.png?alt=media&token=c6183d6d-f141-403e-8ad0-beb313d1ecb8",
  },
  {
    nome: "SEBASTIÃO NETO",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_sebastiao.jpg?alt=media&token=072eb65d-2937-4090-a9eb-7a7463f6ae14",
  },
  {
    nome: "ROBERTH JUNQUEIRA",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_roberth.jpg?alt=media&token=4a5ca4c4-54a1-48ec-a280-b74a42a54073",
  },
  {
    nome: "RAILDO CARVALHO",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_raildo.jpg?alt=media&token=395da0b6-ba7c-4943-a7ec-2551a64bf179",
  },
  {
    nome: "RONIVALDO MARTINS",
    avatar_url:
      "https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/usuarios%2Favatar_ronivaldo.jpg?alt=media&token=97d1f1e1-4ff7-41a7-8358-4723afb9fedf",
  },
];
export const cities = [
  {
    name: "Ituiutaba",
    annualGenFactor: 125.86,
  },
  {
    name: "MONTE ALEGRE DE MINAS",
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
export const motivosSolicitacaoCompra = [
  {
    label: "REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO",
    value: "REPOSIÇÃO/COMPRA DE ITENS DE ALIMENTAÇÃO",
  },
  {
    label: "REPOSIÇÃO DE ITENS DE LIMPEZA",
    value: "REPOSIÇÃO DE ITENS DE LIMPEZA",
  },
  {
    label: "REPOSIÇÃO DE ITENS DE ALMOXARIFADO",
    value: "REPOSIÇÃO DE ITENS DE ALMOXARIFADO",
  },
  { label: "USO EM OBRA DE CLIENTE", value: "USO EM OBRA DE CLIENTE" },
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "OUTROS", value: "OUTROS" },
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
  "MONTE ALEGRE DE MINAS", // MG
  "UBERABA", // MG
  "CALDAS NOVAS", // GO
  "SÃO SEBASTIÃO DO PARAÍSO", // MG
  "BOM JESUS DE GOIÁS", // MG
  "PORTEIRÃO", // GO
  "JOÃO PINHEIRO", // MG
  "SÃO SIMÃO", // GO
  "INACIOLÂNDIA", // GO
  "TRINDADE", // GO
  "PATOS DE MINAS", // MG
  "ITUMBIARA", // GO
  "ITURAMA", // MG
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
  "CAÇU", // GO
  "CACHOEIRA ALTA", // GO
  "CHAVESLÂNDIA", // MG
  "PONTAL DO ARAGUAIA", // MT
  "GOIATUBA", // GO
  "FRUTAL", // MG
  "CAMPO FLORIDO", // MG
  "SANTA JULIANA", // MG
];
export const cidadesGoias = [
  "CALDAS NOVAS", // GO
  "PORTEIRÃO", // GO
  "SÃO SIMÃO", // GO
  "INACIOLÂNDIA", // GO
  "TRINDADE", // GO
  "ITUMBIARA", // GO
  "QUIRINÓPOLIS", // GO
  "PARANAIGUARA", // GO
  "CATALÃO", // GO
  "CAÇU",
];
export const suprimentoOption = {
  GRAMPO: {
    tipo: ["FINAL", "INTERMEDIÁRIO"],
    unidade: "UNIDADE",
  },
  TRILHO: {
    tipo: [
      "1,85",
      "2,20",
      "2,36",
      "2,40",
      "2,50",
      "3,20",
      "3,30",
      "4,20",
      "4,70",
      "4,80",
    ],
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
export const statusDoParecerDeAcesso = [
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
export const distributionCompanies = [
  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
  { label: "CEMIG", value: "CEMIG" },
  { label: "ENEL", value: "ENEL" },
  { label: "CELG", value: "CELG" },
  { label: "ENERGISA", value: "ENERGISA" },
];
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
    value: "PREVISÃO DE EQUIPAMENTOS",
    label: "PREVISÃO DE EQUIPAMENTOS",
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
    label: "AUMENTO DE SISTEMA FOTOVOLTAICO",
    value: "AUMENTO DE SISTEMA FOTOVOLTAICO",
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
    label: "SOL MAIS",
    value: "SOL MAIS",
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
    label: "EQUIPE 18 - GABRIEL E DANILO",
    value: "EQUIPE 18 - GABRIEL E DANILO",
  },
  {
    label: "EQUIPE EXTERNA - VINICIUS",
    value: "EQUIPE EXTERNA - VINICIUS",
  },
  {
    label: "EQUIPE EXTERNA - JEFFERSON",
    value: "EQUIPE EXTERNA - JEFFERSON",
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
export const centrosDeCusto = [
  {
    nome: "DEDUÇÕES",
    categorias: [
      { label: "IMPOSTOS DE VENDA", value: "IMPOSTOS DE VENDA" },
      { label: "DEVOLUÇÕES/DESCONTOS", value: "DEVOLUÇÕES/DESCONTOS" },
    ],
  },
  {
    nome: "CUSTOS DIRETOS",
    categorias: [
      { label: "KIT'S GERADORES", value: "KIT'S GERADORES" },
      { label: "INSUMOS DE ALMOXARIFADO", value: "INSUMOS DE ALMOXARIFADO" },
      { label: "OUTROS CUSTOS DIRETOS", value: "OUTROS CUSTOS DIRETOS" }, // outros custos de serviço ou produto
    ],
  },
  {
    nome: "DESPESAS COMERCIAIS",
    categorias: [
      { label: "DESPESAS DE MARKETING", value: "DESPESAS DE MARKETING" },
      { label: "EQUIPE DE MARKETING", value: "EQUIPE DE MARKETING" },
      { label: "EQUIPE DE VENDAS", value: "EQUIPE DE VENDAS" },
      { label: "COMISSÕES DE INTERNOS", value: "COMISSÕES DE INTERNOS" },
      { label: "COMISSÕES DE TERCEIROS", value: "COMISSÕES DE TERCEIROS" },
      { label: "AJUDAS DE CUSTO", value: "AJUDAS DE CUSTO" },
      { label: "PROVISÕES", value: "PROVISÕES" }, // 13°'s, férias e etc
      { label: "OUTROS CUSTOS COMERCIAIS", value: "OUTROS CUSTOS COMERCIAIS" },
    ],
  },
  {
    nome: "DESPESAS ADMINISTRATIVAS",
    categorias: [
      { label: "ALUGUEL/CONDOMÍNIO/IPTU", value: "ALUGUEL/CONDOMÍNIO/IPTU" },
      { label: "MANUTENÇÕES", value: "MANUTENÇÕES" },
      { label: "ENERGIA/INTERNET/ÁGUA", value: "ENERGIA/INTERNET/ÁGUA" },
      { label: "ASSINATURAS DE SOFTWARE", value: "ASSINATURAS DE SOFTWARE" },
      { label: "CONTABILIDADE/SEGUROS", value: "CONTABILIDADE/SEGUROS" },
      { label: "PRÓ-LABORE", value: "PRÓ-LABORE" },
      { label: "EQUIPE ADMINISTRATIVA", value: "EQUIPE ADMINISTRATIVA" },
      { label: "HONORÁRIOS ADVOCATÍCIOS", value: "HONORÁRIOS ADVOCATÍCIOS" },
      {
        label: "FAXINA/MATERIAIS DO ESCRITÓRIO",
        value: "FAXINA/MATERIAIS DO ESCRITÓRIO",
      },
      { label: "DOAÇÕES", value: "DOAÇÕES" },
      { label: "PROVISÕES", value: "PROVISÕES" },
      {
        label: "OUTROS CUSTOS ADMINISTRATIVOS",
        value: "OUTROS CUSTOS ADMINISTRATIVOS",
      },
    ],
  },
  {
    nome: "DESPESAS OBRAS",
    categorias: [
      { label: "DESPESAS DE OBRAS", value: "DESPESAS DE OBRAS" },
      { label: "ALUGUEL DE EQUIPAMENTOS", value: "ALUGUEL DE EQUIPAMENTOS" },
      { label: "EQUIPE DE OBRAS", value: "EQUIPE DE OBRAS" },
      { label: "TERCEIROS", value: "TERCEIROS" },
      { label: "COMISSÕES", value: "COMISSÕES" },
      { label: "PROVISÕES", value: "PROVISÕES" },
    ],
  },
  {
    nome: "DESPESAS OPERACIONAIS",
    categorias: [
      { label: "ALUGUEL DE VEÍCULOS", value: "ALUGUEL DE VEÍCULOS" },
      { label: "ANUIDADE DO CREA", value: "ANUIDADE DO CREA" },
      { label: "COMBUSTÍVEL", value: "COMBUSTÍVEL" },
      { label: "PEDÁGIO E ESTACIONAMENTO", value: "PEDÁGIO E ESTACIONAMENTO" },
      { label: "LANCHES E REFEIÇÕES", value: "LANCHES E REFEIÇÕES" },
      { label: "HOSPEDAGEM", value: "HOSPEDAGEM" },
      { label: "GASTOS COM GYMPASS", value: "GASTOS COM GYMPASS" },
      { label: "UNIFORMES", value: "UNIFORMES" },
      {
        label: "OUTROS CUSTOS OPERACIONAIS",
        value: "OUTROS CUSTOS OPERACIONAIS",
      },
    ],
  },
  {
    nome: "DEPRECIAÇÃO E AMORTIZAÇÕES",
    categorias: [
      {
        label: "DEPRECIAÇÃO E AMORTIZAÇÕES",
        value: "DEPRECIAÇÃO E AMORTIZAÇÕES",
      },
    ],
  },
  {
    nome: "DESPESAS FINANCEIRAS",
    categorias: [
      {
        label: "JUROS/AMORTIZAÇÃO DE DÍVIDAS",
        value: "JUROS/AMORTIZAÇÃO DE DÍVIDAS",
      },
      { label: "DESPESAS BANCÁRIAS", value: "DESPESAS BANCÁRIAS" },
      { label: "EMPRÉSTIMOS", value: "EMPRÉSTIMOS" },
      {
        label: "OUTRAS CUSTOS FINANCEIROS",
        value: "OUTRAS CUSTOS FINANCEIROS",
      },
    ],
  },
  {
    nome: "IMPOSTOS",
    categorias: [
      { label: "ICMS", value: "ICMS" },
      { label: "ISS", value: "ISS" },
      { label: "PIS", value: "PIS" },
      { label: "COFINS", value: "COFINS" },
      { label: "INSS", value: "INSS" },
      { label: "FGTS", value: "FGTS" },
      { label: "IPVA/DPVAT/LICENCIAMENTO", value: "IPVA/DPVAT/LICENCIAMENTO" },
      { label: "IRRF", value: "IRRF" },
      { label: "SIMPLES NACIONAL - DAS", value: "SIMPLES NACIONAL - DAS" },
      { label: "IRPJ/CSLL", value: "IRPJ/CSLL" },
    ],
  },
];
export const fontesDeReceita = [
  { label: "SISTEMA FOTOVOLTAICO", value: "SISTEMA FOTOVOLTAICO" },
  { label: "OPERAÇÃO E MANUTENÇÃO", value: "OPERAÇÃO E MANUTENÇÃO" },
  { label: "SUBESTAÇÕES", value: "SUBESTAÇÕES" },
  { label: "OUTRAS RECEITAS", value: "OUTRAS RECEITAS" },
];
export const tiposDePadrao = [
  {
    label: "MONO 40A",
    value: "MONO 40A",
  },
  {
    label: "MONO 63A",
    value: "MONO 63A",
  },
  {
    label: "BIFASICO 63A",
    value: "BIFASICO 63A",
  },
  {
    label: "BIFASICO 70A",
    value: "BIFASICO 70A",
  },
  {
    label: "BIFASICO 100A",
    value: "BIFASICO 100A",
  },
  {
    label: "BIFASICO 125A",
    value: "BIFASICO 125A",
  },
  {
    label: "BIFASICO 150A",
    value: "BIFASICO 150A",
  },
  {
    label: "BIFASICO 200A",
    value: "BIFASICO 200A",
  },
  {
    label: "TRIFASICO 63A",
    value: "TRIFASICO 63A",
  },
  {
    label: "TRIFASICO 100A",
    value: "TRIFASICO 100A",
  },
  {
    label: "TRIFASICO 125A",
    value: "TRIFASICO 125A",
  },
  {
    label: "TRIFASICO 150A",
    value: "TRIFASICO 150A",
  },
  {
    label: "TRIFASICO 200A",
    value: "TRIFASICO 200A",
  },
  {
    label: "NÃO DEFINIDO",
    value: "NÃO DEFINIDO",
  },
];
export function validateAuthorization(session, paramRoute) {
  if (!session) return false;
  if (session.user.accessibleRoutes.includes(paramRoute)) return true;
  return false;
}

export function formatProjectCode(value) {
  if (value) {
    console.log("FORMATADO", value.toUpperCase().split(" ").join(""));
    return value.split(" ").join("");
  }
  return "";
}
export function formatToPhone(value) {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
}
export function formatToMoney(value, tag = "R$") {
  return `${tag} ${Number(value).toLocaleString("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
export function formatCPFCpnj(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
export function formatDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}
export function formatPersonalName(value) {
  if (typeof value == "string") {
    const splittedStr = value.split(" ");
    const formattedNameArr = splittedStr.map(
      (x) => x.charAt(0).toUpperCase() + x.slice(1)
    );
    return formattedNameArr.join(" ");
  } else return "";
}
export function formatLongString(str, size = 35) {
  if (str.length > size) {
    return str.substring(0, size) + "\u2026";
  } else {
    return str;
  }
}
export async function getDistanceBetweenCities(destination, origin) {
  console.log(process.env.DB_KEY);
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&departure_time=now&key=${process.env.DISTANCE_API}`;
  try {
    const { data } = await axios.post(url, {});
    console.log(data);
  } catch (error) {
    console.log(error);
    console.log("ERRO", error);
  }
}
function getLevenshteinDistance(string1, string2) {
  const matrix = Array(string1.length + 1)
    .fill(null)
    .map(() => Array(string2.length + 1).fill(null));

  for (let i = 0; i <= string1.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= string2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= string1.length; i++) {
    for (let j = 1; j <= string2.length; j++) {
      const indicator = string1[i - 1] === string2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + indicator
      );
    }
  }

  return matrix[string1.length][string2.length];
}
export function calculateStringSimilarity(string1, string2) {
  const maxLength = Math.max(string1.length, string2.length);
  const distance = getLevenshteinDistance(string1, string2);
  const similarity = (maxLength - distance) / maxLength;
  const similarityPercentage = similarity * 100;

  return similarityPercentage;
}
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
