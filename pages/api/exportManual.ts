import { apiHandler } from '@/utils/api'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { getContractValue } from '@/utils/methods/util/projects'
import { TExpense } from '@/utils/schemas/expenses'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

const getExport: NextApiHandler<{ data: any }> = async (req, res) => {
  // const expensesCollection: Collection<TExpense> = db.collection('despesas')
  // // const projects = await collection.find({ 'obra.saida': { $gte: '2023-11-01T00:00:00.000Z' } }, { sort: { 'obra.saida': 1 } }).toArray()
  // const projects = await collection
  //   .find(
  //     { 'contrato.dataSolicitacao': { $gte: '2023-12-01T00:00:00.000Z' }, 'contrato.status': 'RESCISÃO DE CONTRATO' },
  //     { sort: { 'contrato.dataSolicitacao': 1 } }
  //   )
  //   .toArray()
  // // const expenses = await expensesCollection.find({}).toArray()
  // const formatted = projects.map((project) => {
  //   return {
  //     'NOME DO CONTRATO': project.nomeDoContrato,
  //     'DATA DE SOLICITAÇÃO': formatDateAsLocale(project.contrato.dataSolicitacao),
  //     'DATA DE ASSINATURA': formatDateAsLocale(project.contrato.dataAssinatura),
  //     CIDADE: project.cidade,
  //     VENDEDOR: project.vendedor.nome,
  //   }
  //   // const projectExpenses = expenses.filter((exp) => exp.projeto?.id == project._id.toString())
  //   // const itens = projectExpenses.flatMap((exp) => exp.itens)
  //   // const total = projectExpenses.reduce((acc, current) => acc + current.total, 0)

  //   // return {
  //   //   periodo: dayjs(project.obra.saida).format('MM/YYYY'),
  //   //   nome: project.nomeDoContrato,
  //   //   cidade: project.cidade,
  //   //   assinatura: formatDateAsLocale(project.contrato.dataAssinatura),
  //   //   finalizacao: formatDateAsLocale(project.obra.saida),
  //   //   itens: itens,
  //   //   totalGasto: total,
  //   // }
  //   // var obj = {
  //   //   PERIODO: dayjs(project.contrato.dataAssinatura).format('MM/YYYY'),
  //   //   'NOME DO CLIENTE': project.nomeDoContrato,
  //   //   'VALOR DO CONTRATO': getContractValue({
  //   //     projectValue: project.sistema.valorProjeto,
  //   //     structureValue: project.estruturaPersonalizada.valor,
  //   //     paValue: project.padrao.valor,
  //   //   }),
  //   //   'STATUS DO PARECER': project.parecer.statusDoParecerDeAcesso,
  //   //   'DATA DE ASSINATURA': formatDateAsLocale(project.contrato.dataAssinatura),
  //   //   'DATA DE LIBERAÇÃO PARA COMPRA': formatDateAsLocale(project.compra.dataLiberacao),
  //   //   'DATA DE COMPRA DO KIT': formatDateAsLocale(project.compra.dataPedido),
  //   //   'DATA DE PAGAMENTO DO KIT': formatDateAsLocale(project.compra.dataPagamento),
  //   //   'DATA DE SAIDA DE OBRA': formatDateAsLocale(project.obra.saida),
  //   //   'VALOR DO KIT': project.compra.valorDoKit,
  //   // }
  //   // projectExpenses.forEach((exp) => {
  //   //   if (project.nomeDoContrato == 'SUELENE DE SOUZA BARBOSA') console.log(obj[exp.categoria])
  //   //   if (!obj[exp.categoria]) obj[exp.categoria] = 0
  //   //   obj[exp.categoria] += exp.total
  //   //   if (project.nomeDoContrato == 'SUELENE DE SOUZA BARBOSA') console.log(exp.categoria, exp.total, obj[exp.categoria])
  //   // })
  //   // return obj
  // })
  // return res.json({ data: formatted })

  return res.json({ data: 'DESATIVADA' })
}
export default apiHandler({
  GET: getExport,
})
/*  
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
