import { apiHandler } from '@/utils/api'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { getGenFactorByOrientation } from '@/utils/methods/shared'
import { getContractValue } from '@/utils/methods/util/projects'
import { TExpense } from '@/utils/schemas/expenses'
import { TProject } from '@/utils/schemas/projects'
import connectToDatabase from '@/utils/services/mongodb/projects'
import dayjs from 'dayjs'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'

const getExport: NextApiHandler<any> = async (req, res) => {
  const db: Db = await connectToDatabase(process.env.DB_KEY)
  const projectsCollection: Collection<TProject> = db.collection('dados')

  // const projects = await projectsCollection
  //   .find({
  //     'contrato.status': 'ASSINADO',
  //     'contrato.dataAssinatura': { $ne: null },
  //     'oem.aplicavel': true,
  //     'oem.duracao': { $nin: [null, 0] },
  //   })
  //   .toArray()

  // const bulkwriteArr = projects.map((project) => {
  //   const signatureDate = project.contrato.dataAssinatura
  //   const oemDuration = project.oem.duracao || 0
  //   const oemDurationDays = oemDuration * 365
  //   const oemStart = signatureDate
  //   const oemEnd = dayjs(oemStart).add(oemDurationDays, 'days').toISOString()

  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(project._id) },
  //       update: {
  //         $set: {
  //           'oem.inicio': oemStart,
  //           'oem.fim': oemEnd,
  //         },
  //       },
  //     },
  //   }
  // })
  // const exportation = projects.map((project) => ({
  //   QTDE: project.qtde,
  //   NOME: project.nomeDoContrato,
  //   UF: project.uf,
  //   CIDADE: project.cidade,
  //   'TIPO HOMOLOGAÇÃO': project.homologacao.fastTrack ? 'FAST TRACK' : 'CONVENCIONAL',
  //   'DATA PEDIDO': formatDateAsLocale(project.compra.dataPedido),
  //   'DATA ENTREGA': formatDateAsLocale(project.compra.dataEntrega),
  // }))
  // const generations = projects.map((project) => {
  //   const genFactor = getGenFactorByOrientation({ city: project.cidade, uf: project.uf, orientation: 'NORTE' }) as number
  //   const estimatedGen = genFactor * (project.sistema.potPico || 0)
  //   return estimatedGen
  // })
  // const totalGenerationMonthly = generations.reduce((acc, current) => acc + current, 0)
  // const totalPower = projects.reduce((acc, current) => acc + current.sistema.potPico, 0)
  // const formatted = projects.map((project) => {
  //   return {
  //     QTDE: project.qtde,
  //     NOME: project.nomeDoContrato,
  //     TIPO: project.tipoDeServico,
  //     TELEFONE: project.telefone || 'N/A',
  //     VENDEDOR: project.vendedor.nome,
  //     CIDADE: project.cidade,
  //     UF: project.uf,
  //     POTÊNCIA: project.sistema.potPico,
  //     'DATA DE ASSINATURA': project.contrato.dataAssinatura ? formatDateAsLocale(project.contrato.dataAssinatura) : 'N/A',
  //     'STATUS DA COMPRA': project.compra.status,
  //     'DATA DO PEDIDO': project.compra.dataPedido ? formatDateAsLocale(project.compra.dataPedido) : 'N/A',
  //     'DATA DE ENTREGA': project.compra.dataEntrega ? formatDateAsLocale(project.compra.dataEntrega) : 'N/A',
  //     'STATUS DA HOMOLOGAÇÃO': project.homologacao.status || 'N/A',
  //     'DATA DE RESPOSTA DA HOMOLOGAÇÃO': project.homologacao.acesso.dataResposta
  //       ? formatDateAsLocale(project.homologacao.acesso.dataResposta)
  //       : 'N/A',
  //     'STATUS DA OBRA': project.obra.statusDaObra || 'N/A',
  //     'DATA DE TÉRMINO DA OBRA': project.obra.saida ? formatDateAsLocale(project.obra.saida) : 'N/A',
  //   }
  // })
  // const updateResponse = await projectsCollection.bulkWrite(bulkwriteArr)
  return res.json('DESATIVADA')
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
