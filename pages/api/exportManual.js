import axios from 'axios'
import dayjs from 'dayjs'
import { ObjectId } from 'mongodb'
import connectToDatabase from '../../utils/connectDb'

function getTotalCosts(costs) {
  const total = costs.reduce((acc, current) => {
    const toSum = current.total || 0
    return acc + toSum
  }, 0)
  return total
}
export default async function handler(req, res) {
  if (req.method == 'GET') {
    const projectsDb = await connectToDatabase(process.env.DB_KEY, 'projetos')
    const projectsCollection = projectsDb.collection('dados')
    const costsCollection = projectsDb.collection('despesas')
    const projects = await projectsCollection
      .aggregate([
        {
          $match: {
            $and: [{ 'obra.saida': { $gte: '2023-06-01T00:00:00.000Z' } }, { 'obra.saida': { $lte: '2023-08-31T18:00:00.000Z' } }],
          },
        },
        {
          $project: {
            qtde: 1,
            nomeDoContrato: 1,
            cidade: 1,
            uf: 1,
            'obra.saida': 1,
            'contrato.dataAssinatura': 1,
            'material.previsaoCustos': 1,
            'material.efetivoCustos': 1,
            'sistema.potPico': 1,
            'sistema.topologia': 1,
            'sistema.inversor': 1,
          },
        },
        {
          $sort: {
            qtde: 1,
          },
        },
      ])
      .toArray()
    const costs = await costsCollection
      .aggregate([
        {
          $project: {
            projeto: 1,
            total: 1,
          },
        },
      ])
      .toArray()
    const formatteditems = projects.map((project) => {
      var totalCost = 0
      const vinculatedCosts = costs.filter((cost) => cost.projeto?.id == project._id)
      if (vinculatedCosts) {
        totalCost = getTotalCosts(vinculatedCosts)
      }
      return {
        QTDE: project.qtde,
        'NOME DO CONTRATO': project.nomeDoContrato,
        'DATA ASSINATURA': project.contrato?.dataAssinatura ? dayjs(project.contrato.dataAssinatura).add(3, 'hours').format('DD/MM/YYYY') : null,
        'SAÍDA DE OBRA': project.obra?.saida ? dayjs(project.obra.saida).add(3, 'hours').format('DD/MM/YYYY') : null,
        ESTADO: project.uf,
        CIDADE: project.cidade,
        'POTÊNCIA PICO': project.sistema?.potPico,
        TOPOLOGIA: project.sistema?.topologia,
        INVERSOR: project.sistema?.inversor,
        'PREVISÃO DE CUSTOS': project.material?.previsaoCustos,
        'EFETIVO DE CUSTOS (PREENCHIDO)': project.material?.efetivoCustos,
        'EFETIVO DE CUSTOS (ALMOXARIFADO)': totalCost,
      }
    })
    res.json(formatteditems)
  }
}
/*  const cidadesAtendidas = [
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
    "ARAGUARI",
    "IRAÍ DE MINAS",
  ];
  // let annualGenFactor = cidadesAtendidas.map(async (cidade) => {
  //   return {
  //     nome: cidade,
  //     irrad: await axios.post(
  //       "https://business.solarmarket.com.br/graphql",
  //       {
  //         operationName: "EnderecoDistanciaEFatorGeracao",
  //         query:
  //           "query EnderecoDistanciaEFatorGeracao($input: EnderecoDistancia!) {\n  enderecoDistanciaEFatorGeracao(input: $input) {\n    distancia\n    fatorGeracao {\n      medio\n      janeiro\n      fevereiro\n      marco\n      abril\n      maio\n      junho\n      julho\n      agosto\n      setembro\n      outubro\n      novembro\n      dezembro\n    }\n    irradiancia {\n      lat\n      lng\n      anual\n      janeiro\n      fevereiro\n      marco\n      abril\n      maio\n      junho\n      julho\n      agosto\n      setembro\n      outubro\n      novembro\n      dezembro\n    }\n  }\n}\n",
  //         variables: {
  //           input: {
  //             cidade: cidade,
  //             desvioAzimutal: 0,
  //             estado: "MG",
  //             inclinacao: 20,
  //           },
  //           taxaDesempenho: [0.75, 0.75, 0.75],
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization:
  //             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzdjp3ZWIiLCJzZXNzaW9uSWQiOiJkbVU2R3FyZ2VwWnV4NEptcjdfaDZpZkd1VE1CQksyRCIsInN1YiI6NDA3MywiaWF0IjoxNjcxNDczMDIzLCJleHAiOjE2NzE0OTQ2MjN9.evInMfhxtFG9h8pE1D6TzqmMEZUF5ZeKHJoyGbX7K0I",
  //         },
  //       }
  //     ),
  //   };
  // });
  // var arr = [];
  // for (let i = 0; i < cidadesAtendidas.length; i++) {
  //   let { data } = await axios.post(
  //     "https://business.solarmarket.com.br/graphql",
  //     {
  //       operationName: "EnderecoDistanciaEFatorGeracao",
  //       query:
  //         "query EnderecoDistanciaEFatorGeracao($input: EnderecoDistancia!) {\n  enderecoDistanciaEFatorGeracao(input: $input) {\n    distancia\n    fatorGeracao {\n      medio\n      janeiro\n      fevereiro\n      marco\n      abril\n      maio\n      junho\n      julho\n      agosto\n      setembro\n      outubro\n      novembro\n      dezembro\n    }\n    irradiancia {\n      lat\n      lng\n      anual\n      janeiro\n      fevereiro\n      marco\n      abril\n      maio\n      junho\n      julho\n      agosto\n      setembro\n      outubro\n      novembro\n      dezembro\n    }\n  }\n}\n",
  //       variables: {
  //         input: {
  //           cidade: cidadesAtendidas[i],
  //           desvioAzimutal: 0,
  //           estado: "MG",
  //           inclinacao: 20,
  //         },
  //         taxaDesempenho: [0.75, 0.75, 0.75],
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization:
  //           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzdjp3ZWIiLCJzZXNzaW9uSWQiOiJkbVU2R3FyZ2VwWnV4NEptcjdfaDZpZkd1VE1CQksyRCIsInN1YiI6NDA3MywiaWF0IjoxNjcxNDczMDIzLCJleHAiOjE2NzE0OTQ2MjN9.evInMfhxtFG9h8pE1D6TzqmMEZUF5ZeKHJoyGbX7K0I",
  //       },
  //     }
  //   );
  //   console.log(data.data.enderecoDistanciaEFatorGeracao.irradiancia.anual);
  //   let irrad = data.data.enderecoDistanciaEFatorGeracao.irradiancia.anual;
  //   let obj = {
  //     cidade: cidadesAtendidas[i],
  //     irrad: irrad,
  //   };
  //   arr.push(obj);
  // }
  var arr = [];
  const irradByCity = [
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
  for (let i = 0; i < irradByCity.length; i++) {
    arr.push({
      cidade: irradByCity[i].cidade,
      fatorGen: (irradByCity[i].irrad * 30 * 0.8).toFixed(2),
      LESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.907).toFixed(2),
      NORDESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.981).toFixed(2),
      NORTE: (irradByCity[i].irrad * 30 * 0.8).toFixed(2),
      NOROESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.981).toFixed(2),
      OESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.898).toFixed(2),
      SUDOESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.8426).toFixed(2),
      SUL: (irradByCity[i].irrad * 30 * 0.8 * 0.787).toFixed(2),
      SUDESTE: (irradByCity[i].irrad * 30 * 0.8 * 0.8518).toFixed(2),
    });
  }*/
