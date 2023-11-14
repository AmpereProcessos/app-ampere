import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'

async function fetchProjects() {
  try {
    const { data } = await axios.get('/api/projects/projetos')
    return data
  } catch (error) {
    throw error
  }
}

export function useEngineeringProjects({ enabled }) {
  const [filters, setFilters] = useState({
    search: '',
    sellerName: [],
    city: [],
    analyst: [],
    deliveryStatus: [],
    executionStatus: [],
    inspectionStatus: [],
    grantingStatus: [],
    serviceType: [],
    necessaryHomologation: false,
    notNecessaryHomologation: false,
    necessaryDistribution: false,
    failedInspection: false,
    failedGranting: false,
    missingDraw: false,
    missingSignature: false,
    date: {
      after: null,
      before: null,
      field1: null,
      field2: null,
    },
  })
  function matchSearch(project) {
    if (filters.search.trim().length == 0) return true
    else return project.nomeDoContrato.toUpperCase().includes(filters.search.toUpperCase())
  }
  function matchSeller(project) {
    if (filters.sellerName.length == 0) return true
    else return filters.sellerName.includes(project.vendedor?.nome)
  }
  function matchCity(project) {
    if (filters.city.length == 0) return true
    else return filters.city.includes(project.cidade)
  }
  function matchDeliveryStatus(project) {
    if (filters.deliveryStatus.length == 0) return true
    else return filters.deliveryStatus.includes(project.compra?.statusEntrega)
  }
  function matchExecutionStatus(project) {
    if (filters.executionStatus.length == 0) return true
    else return filters.executionStatus.includes(project.obra?.statusDaObra)
  }
  function matchInspectionStatus(project) {
    if (filters.inspectionStatus.length == 0) return true
    else return filters.inspectionStatus.includes(project.vistoria?.status)
  }
  function matchGrantingStatus(project) {
    if (filters.grantingStatus.length == 0) return true
    else return filters.grantingStatus.includes(project.parecer?.statusDoParecerDeAcesso)
  }
  function matchServiceType(project) {
    if (filters.serviceType.length == 0) return true
    else return filters.serviceType.includes(project.tipoDeServico)
  }
  function matchNecessaryHomologation(project) {
    if (!filters.necessaryHomologation) return true
    else return project.projeto.realizarHomologacao == true
  }
  function matchNotNecessaryHomologation(project) {
    if (!filters.notNecessaryHomologation) return true
    else return !project.projeto.realizarHomologacao
  }
  function matchNecessaryDistribution(project) {
    if (!filters.necessaryDistribution) return true
    else return project.dadosCemig.distCreditos == 'SIM'
  }
  function matchFailedInspection(project) {
    if (!filters.failedInspection) return true
    else return project.vistoria.vistoriaReprovada == 'SIM'
  }
  function matchFailedGranting(project) {
    if (!filters.failedGranting) return true
    else return project.parecer.parecerReprovado == 'SIM'
  }
  function matchMissingDraw(project) {
    if (!filters.missingDraw) return true
    else return project.projeto.desenhoTelhado != 'OK'
  }
  function matchMissingSignature(project) {
    if (!filters.missingSignature) return true
    else return project.projeto.dataLiberacaoDocumentacao != undefined && !project.projeto.dataAssDocumentacao
  }
  function matchDate(project) {
    if (!filters.date.after || !filters.date.before || !filters.date.field1 || !filters.date.field2) return true
    return (
      project[filters.date.field1][filters.date.field2] >= filters.date.after &&
      project[filters.date.field1][filters.date.field2] <= filters.date.before
    )
  }
  function handleModelData(data) {
    var modeledData = data
    return modeledData.filter(
      (project) =>
        matchSearch(project) &&
        matchSeller(project) &&
        matchCity(project) &&
        matchDeliveryStatus(project) &&
        matchExecutionStatus(project) &&
        matchInspectionStatus(project) &&
        matchGrantingStatus(project) &&
        matchServiceType(project) &&
        matchNecessaryHomologation(project) &&
        matchNotNecessaryHomologation(project) &&
        matchNecessaryDistribution(project) &&
        matchFailedInspection(project) &&
        matchFailedGranting(project) &&
        matchMissingDraw(project) &&
        matchMissingSignature(project) &&
        matchDate(project)
    )
  }
  return {
    ...useQuery({
      queryKey: ['engineering-projects'],
      queryFn: fetchProjects,
      select: (data) => handleModelData(data),
    }),
    filters,
    setFilters,
  }
}
