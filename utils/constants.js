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
