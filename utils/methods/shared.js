import toast from 'react-hot-toast'
import { orientacoes } from '../constants'
import genFactors from '../jsons/fatores-geracao.json'
import axios from 'axios'
async function updatingCRMProjectsManually(req, res) {
  // // COnnecting to CRM projects and proposes db/collection
  const crmDb = await connectToCRMDatabase(process.env.CRM_KEY)
  const crmProjectsCollection = crmDb.collection('projects')
  const response = await crmProjectsCollection.updateMany(
    {},
    {
      $unset: {
        contratoSolicitado: '',
        dataSolicitacaoContrato: '',
        idSolicitacaoContrato: '',
        assinado: '',
        dataAssinatura: '',
      },
    }
  )
  // const crmProposesCollection = crmDb.collection("proposes");
  // // Connecting to projects db/collection
  // const projectsDb = await connectToProjectsDatabase(
  //   process.env.DB_KEY,
  //   "projetos"
  // );
  // const projectsCollection = projectsDb.collection("dados");
  // // Connecting to contract requests db/collection
  // const requestsDb = await connectToRequestsDatabase(process.env.DB_KEY);
  // const contractRequestsCollection = requestsDb.collection("contrato");
  // const allProjects = await projectsCollection
  //   .aggregate([
  //     {
  //       $match: { "contrato.status": "ASSINADO", idProjetoCRM: { $ne: null } },
  //     },
  //     {
  //       $project: {
  //         nomeDoContrato: 1,
  //         "contrato.dataAssinatura": 1,
  //         codigoSVB: 1,
  //         idProjetoCRM: 1,
  //         idPropostaCRM: 1,
  //         idSolicitacaoContrato: 1,
  //       },
  //     },
  //   ])
  //   .toArray();

  // const allContractRequests = await contractRequestsCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         dataSolicitacao: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const allCRMProjects = await crmProjectsCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         nome: 1,
  //       },
  //     },
  //   ])
  //   .toArray();
  // const allCRMProposes = await crmProposesCollection
  //   .aggregate([
  //     {
  //       $project: {
  //         "projeto.nome": 1,
  //       },
  //     },
  //   ])
  //   .toArray();

  // const bulkWriteArr = allProjects.map((project) => {
  //   const equivalentCRMProject = allCRMProjects.find(
  //     (x) => x._id == project.idProjetoCRM
  //   );
  //   const equivalentCRMPropose = allCRMProposes.find(
  //     (x) => x._id == project.idPropostaCRM
  //   );
  //   const equivalentContractRequest = allContractRequests.find(
  //     (x) => x._id == project.idSolicitacaoContrato
  //   );
  //   console.log(
  //     project.nomeDoContrato,
  //     " CRM: ",
  //     equivalentCRMProject?.nome,
  //     " PROPOSE: ",
  //     equivalentCRMPropose?.projeto?.nome,
  //     "SOLICITACAO CONTRATO: ",
  //     equivalentContractRequest.dataSolicitacao
  //   );
  //   return {
  //     updateOne: {
  //       filter: { _id: new ObjectId(equivalentCRMProject._id) },
  //       update: {
  //         $set: {
  //           contrato: {
  //             id: new ObjectId(project._id).toString(),
  //             idProposta: new ObjectId(equivalentCRMPropose._id).toString(),
  //             dataAssinatura: project.contrato?.dataAssinatura,
  //           },
  //           solicitacaoContrato: {
  //             id: project.idSolicitacaoContrato,
  //             idProposta: new ObjectId(equivalentCRMPropose._id).toString(),
  //             dataSolicitacao: equivalentContractRequest.dataSolicitacao,
  //           },
  //         },
  //       },
  //     },
  //   };
  // });

  // const bulkWriteResponse = await crmProjectsCollection.bulkWrite(bulkWriteArr);
}

export async function getCEPInfo(cep) {
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`)
    console.log(data.erro)
    if (data.erro) throw new Error('Erro')
    return data
  } catch (error) {
    console.log(error)
    toast.error('Erro ao buscar informações à partir do CEP.')
    return null
  }
}

export function isEmpty(value) {
  return value == null || (typeof value === 'string' && value.trim().length === 0)
}

export function formatDateInputChange(value, returnType, normalizeHours = true) {
  if (isNaN(new Date(value).getMilliseconds())) return null
  if (!returnType || returnType === 'string') {
    if (!normalizeHours) return new Date(value).toISOString()
    return dayjs(new Date(value)).add(3, 'hours').toISOString()
  }
  if (!normalizeHours) return new Date(value)
  return dayjs(new Date(value)).add(3, 'hours').toDate()
}
export function pushToAuthPage(router) {
  router.push('/auth/signin')
}
export function getGenFactorByOrientation({ city, uf, orientation }) {
  if (!city || !uf) return 127

  var cityFactor = genFactors.find((genFactor) => genFactor.CIDADE == city && genFactor.UF == uf)
  if (!cityFactor) return 127

  // Checking for existing orientations
  if (orientation && orientacoes.includes(orientation)) return cityFactor[orientation]
  // In case no orientation or invalid orientation is provided, returning annual generation factor
  else return cityFactor.ANUAL
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1)
}
export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0)
}
