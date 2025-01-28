import { apiHandler } from '@/utils/api'
import { formatDateAsLocale, getProductsStr } from '@/utils/methods/formatting'
import { TContractRequest } from '@/utils/schemas/contract-requests'
import { TOpportunity } from '@/utils/schemas/crm/opportunity.schema'

import { TProject } from '@/utils/schemas/projects'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import connectToCRMDatabase from '@/utils/services/mongodb/crm/main'
import connectToProjectsDatabase from '@/utils/services/mongodb/projects'
import connectToSolicitacoesDatabase from '@/utils/services/mongodb/requests'
import dayjs from 'dayjs'
import { Collection, Db, ObjectId } from 'mongodb'
import { NextApiHandler } from 'next'
import { getContractValue } from '../../utils/methods/util/projects'

const getExport: NextApiHandler<any> = async (req, res) => {
  const appDb: Db = await connectToProjectsDatabase()

  const projectsCollection = appDb.collection<TProject>('dados')

  const projects = await projectsCollection
    .find(
      {
        'contrato.dataAssinatura': { $gte: '2024-06-01T00:00:00.000Z' },
      },
      {
        sort: { qtde: 1 },
      }
    )
    .toArray()

  const exportation = projects.map((project) => ({
    QTDE: project.qtde,
    NOME: project.nomeDoContrato,
    UF: project.uf,
    CIDADE: project.cidade,
    TELEFONE: project.telefone,
    'TIPO DE SERVIÇO': project.tipoDeServico,
    'VALOR DO CONTRATO': getContractValue({
      projectValue: project.sistema?.valorProjeto || 0,
      paValue: project.padrao?.valor || 0,
      structureValue: project.estruturaPersonalizada?.valor || 0,
      oemValue: project.oem?.valor || 0,
      insuranceValue: project.seguro?.valor || 0,
    }),
    VENDEDOR: project.vendedor.nome,
    'DATA DE ASSINATURA': formatDateAsLocale(project.contrato.dataAssinatura),
  }))

  // const contractRequestsCollection: Collection<TContractRequest> = requestsDb.collection('contrato')

  // const contractRequests = await contractRequestsCollection.find({}).toArray()
  // const projects = await projectsCollection.find({ idSolicitacaoContrato: { $ne: null } }).toArray()

  // const bulkwriteArr = projects.map((project) => {
  //   const equivalent = contractRequests.find((c) => c._id.toString() == project.idSolicitacaoContrato)
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(project._id) },
  //       update: {
  //         $set: {
  //           longitude: equivalent?.longitude,
  //           latitude: equivalent?.latitude,
  //           inscricaoRural: equivalent?.inscriçãoRural,
  //           'faturamento.necessarioNotaFiscalAdiantada': equivalent?.necessidadeNFAdiantada == 'SIM',
  //           'faturamento.necessarioCodigoFiname': equivalent?.necessidadeCodigoFiname == 'SIM',
  //           'faturamento.necessarioInscricaoRural': equivalent?.necessidaInscricaoRural == 'SIM',
  //           'pagamento.cpf_cnpjPagador': equivalent?.cpf_cnpjNF,
  //           'pagamento.negociacao': equivalent?.descricaoNegociacao,
  //           'pagamento.metodo': equivalent?.formaDePagamento,
  //         },
  //       },
  //     },
  //   }
  // })
  // const bulkwriteResponse = await projectsCollection.bulkWrite(bulkwriteArr)

  // const exportation = projects.map((project) => ({
  //   QTDE: project.qtde,
  //   NOME: project.nomeDoContrato,
  //   VENDEDOR: project.vendedor.nome,
  //   'POTÊNCIA PICO': project.sistema.potPico,
  //   'NÚMERO DE MÓDULOS': project.sistema.qtdeModulos,
  //   'DATA DE ENTREGA': formatDateAsLocale(project.compra.dataEntrega),
  //   'STATUS DA OBRA': project.obra.statusDaObra,
  //   UF: project.uf,
  //   CIDADE: project.cidade,
  //   BAIRRO: project.bairro,
  //   LOGRADOURO: project.logradouro,
  //   'NUMERO DA RESIDENCIA': project.numeroResidencia || '',
  // }))
  // const bulkwriteArr = projects.map((project) => {
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(project._id) },
  //       update: {
  //         $set: {
  //           'oem.dataInicio': project.oem.inicio,
  //           'oem.dataFim': project.oem.fim,
  //         },
  //       },
  //     },
  //   }
  // })

  return res.json(exportation)
}
export default apiHandler({
  GET: getExport,
})

interface SellerOpportunity {
  ganho: {
    idProjeto: string
  }
  // ... other properties
}

interface LinkedItem {
  project: any | null
  opportunity: any | null
}
function linkProjectsAndOpportunities(sellerProjects: any[], sellerOpportunities: any[]): LinkedItem[] {
  const linked: LinkedItem[] = []
  const usedOpportunities = new Set<string>()

  // First, go through all projects and find their matching opportunities
  sellerProjects.forEach((project) => {
    const matchingOpportunity = sellerOpportunities.find((opp) => opp.ganho.idProjeto === project._id.toString())
    const opportunityProposal = matchingOpportunity?.proposta[0]
    const proposalValue = opportunityProposal?.valor || 0
    if (matchingOpportunity) {
      usedOpportunities.add(matchingOpportunity.ganho.idProjeto)
    }

    linked.push({
      project: {
        id: project._id.toString(),
        nome: project.nomeDoContrato,
        valor: project.sistema.valorProjeto + project.padrao.valor + project.estruturaPersonalizada.valor,
      },
      opportunity: {
        id: matchingOpportunity._id,
        nome: matchingOpportunity.nome,
        valor: proposalValue,
      },
    })
  })

  // Then, add opportunities that don't have matching projects
  sellerOpportunities.forEach((opportunity) => {
    if (!usedOpportunities.has(opportunity.ganho.idProjeto)) {
      linked.push({
        project: null,
        opportunity: {
          id: opportunity._id,
          nome: opportunity.nome,
          valor: opportunity.proposta[0].valor,
        },
      })
    }
  })

  return linked
}
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
