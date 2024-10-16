import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import { THomologation } from '@/utils/schemas/partial/homologation'
import { TProject, TProjectDTO } from '@/utils/schemas/projects'
import axios from 'axios'
import { fetchFileReferencesByHomologationId } from '../query/crm/file-references'
import { fetchHomologationById } from '../query/crm/homologations'
import dayjs from 'dayjs'

type HandleSendNotificationToCobrancasParams = {
  contractName: string
}
export async function handleSendNotificationToCobrancas({ contractName }: HandleSendNotificationToCobrancasParams) {
  try {
    let data = await axios.post('/api/notificacoes/1', {
      destinatario: '6353eb83ef4e1a367a877949',
      remetente: 'SISTEMA',
      mensagem: `Olá, acabo de aprovar uma solicitação de contrato do cliente ${contractName}. Desde já agradeço, Volts.`,
    })
    return 'Notificação enviada com sucesso !'
  } catch (error) {
    throw error
  }
}
type HandleSendEmailToCobrancasParams = {
  requestId: string
  contractName: string
}
export async function handleSendEmailToCobrancas({ requestId, contractName }: HandleSendEmailToCobrancasParams) {
  try {
    await axios.post('/api/integracao/email', {
      emailTo: 'contasareceber@ampereenergias.com.br', // amperecontasareceber@gmail.com
      subject: 'SOLICITAÇÃO DE CONTRATO',
      message: `Olá, acabo de aprovar uma solicitação de contrato do cliente ${contractName}. Formulário disponível no link: https://app.ampereenergias.com.br/comercial/publicoFormulario/${requestId} . Desde já agradeço, Volts.`,
      copy: [
        'comercial@ampereenergias.com.br',
        // 'adm02@ampereenergias.com.br',
        // 'estagioadm@ampereenergias.com.br',
        'estagioadmampere@outlook.com',
        'amperecontasareceber@outlook.com',
        'felipe.tadeu@ampereenergias.com.br',
      ],
    })
    return 'Email enviado com sucesso !'
  } catch (error) {
    throw error
  }
}

function getObservationsForInstallationLocationChange({ willChange }: { willChange: boolean }) {
  if (willChange) return `HAVERÁ MUDANÇA DE LOCAL.`
  else return `NÃO HAVERÁ MUDANÇA DE LOCAL`
}
function getKitInformation(info: TContractRequestDTO) {
  let moduleSplitMarca = info.marcaModulos.split('/')
  let moduleSplitQtde = info.qtdeModulos.toString().split('/')
  let moduleSplitPot = info.potModulos.split('/')
  let holder = []
  for (let i = 0; i < moduleSplitMarca.length; i++) {
    let str = `${moduleSplitQtde} - ${moduleSplitMarca}(${moduleSplitPot}W)`
    holder.push(str)
  }
  let inverterSplitMarca = info.marcaInversor.split('/')
  let inverterSplitQtde = info.qtdeInversor.split('/')
  let inverterSplitPot = info.potInversor.split('/')
  for (let i = 0; i < inverterSplitMarca.length; i++) {
    let str = `${inverterSplitQtde} - ${inverterSplitMarca}(${inverterSplitPot}W)`
    holder.push(str)
  }
  return holder.join('\n')
}
function getModulesInformation({ qty, power }: { qty: number | string; power: number | string }) {
  let splitQtde = qty.toString().split('/')
  let splitPot = power.toString().split('/')
  let totalModulesPower = 0
  for (let i = 0; i < splitQtde.length; i++) {
    let iQty = Number(splitQtde[i]) || 0
    let iPower = Number(splitPot[i]) || 0
    totalModulesPower = totalModulesPower + (iQty * iPower) / 1000
  }
  let totalModulesQty = splitQtde.reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
  return { totalModulesPower, totalModulesQty }
}
function getInverterInformation({ model, qty, power }: { model: number | string; qty: number | string; power: number | string }) {
  let splitMarca = model.toString().split('/')
  let splitQtde = qty.toString().split('/')
  let splitPot = power.toString().split('/')
  let holder = []
  for (let i = 0; i < splitMarca.length; i++) {
    let str = `${splitQtde[i]}x${splitMarca[i]}(${splitPot[i]}W)`
    holder.push(str)
  }
  return holder.join(' - ')
}
function getOeMInformation({ applicable, plan }: { applicable: boolean; plan: string }) {
  if (!applicable) return { duracao: 0, qtdeManutencoes: 0, manutencoes: [] }

  if (plan == 'MANUTENÇÃO SIMPLES' || plan == 'MANUTENÇÃO SIMLES')
    return { duracao: 0, qtdeManutencoes: 1, manutencoes: [{ titulo: 'MANUTENÇÃO', dataEfetivacao: null }] }

  if (plan == 'PLANO SOL')
    return {
      duracao: 1,
      qtdeManutencoes: 1,
      manutencoes: [{ titulo: 'MANUTENÇÃO', dataEfetivacao: null }],
      dataInicio: new Date().toISOString(),
      dataFim: dayjs().add(365, 'days').toISOString(),
    }

  if (plan == 'PLANO SOL +')
    return {
      duracao: 1,
      qtdeManutencoes: 2,
      manutencoes: [
        { titulo: 'PRIMEIRA MANUTENÇÃO', dataEfetivacao: null },
        { titulo: 'SEGUNDA MANUTENÇÃO', dataEfetivacao: null },
      ],
      dataInicio: new Date().toISOString(),
      dataFim: dayjs().add(365, 'days').toISOString(),
    }

  return { duracao: 0, qtdeManutencoes: 0, manutencoes: [] }
}
type HandleGetProjectInformationFromRequestParams = {
  request: TContractRequestDTO
}

const SegmentEquivalents = {
  COMERCIAL: 'COMERCIAL',
  '-': 'RESIDENCIAL',
  RESIDENCIAL: 'RESIDENCIAL',
  INDUSTRIAL: 'INDUSTRIAL',
  RURAL: 'RURAL',
}
const EnergyDistributorEquivalent = {
  MG: 'CEMIG D',
  GO: 'EQUATORIAL GO',
  MS: 'ENERGISA MS',
  SP: 'ELEKTRO',
  MT: 'ENERGISA MT',
  DF: 'ELEKTRO',
}
export function getProjectInformationFromRequest({ request }: HandleGetProjectInformationFromRequestParams) {
  const OeMInfo = getOeMInformation({ applicable: request.possuiOeM == 'SIM', plan: request.planoOeM })
  const insertObj: TProject = {
    qtde: 0,
    nomeDoContrato: request.nomeDoContrato.toUpperCase(),
    nomeDoProjeto: request.nomeDoProjeto ? request.nomeDoProjeto.toUpperCase() : '',
    cpf_cnpj: request.cpf_cnpj,
    telefone: request.telefone,
    cidade: request.cidadeInstalacao || '',
    uf: request.ufInstalacao || '',
    vendedor: {
      nome: request.nomeVendedor || '',
      codigo: null,
    },
    linkDrive: request.linkDrive ? request.linkDrive : '',
    regional: request.regional ? request.regional : 'NÃO DEFINIDO',
    tipoDeServico: request.tipoDeServico ? request.tipoDeServico : 'SISTEMA FOTOVOLTAICO',
    codigoSVB: request.codigoSVB,
    segmento: request.segmento as TProjectDTO['segmento'],
    obsComercial:
      request.tipoDeServico == 'MONTAGEM E DESMONTAGEM'
        ? request.obsComercial
          ? request.obsComercial + getObservationsForInstallationLocationChange({ willChange: request.mudancaLocal == 'SIM' })
          : getObservationsForInstallationLocationChange({ willChange: request.mudancaLocal == 'SIM' })
        : request.obsComercial,
    visitaTecnica: {
      status: request.idVisitaTecnica,
      tecnico: request.respVisitaTecnica,
      saidaDoCliente: null,
      amperagem: request.tipoDePadrao,
      tipoDaTelha: request.tipoDaTelha,
    },
    padrao: {
      tipo: 'NÃO DEFINIDO',
      caixaConjugada: request.caixaConjugada,
      respPagamento: request.formaPagamentoPadrao,
      respInstalacao: request.respTrocaPadrao,
      valor: request.valorPadrao,
      aumentoCarga: {
        aplicavel: request.aumentoDeCarga == 'SIM' || request.aumentoDisjuntor == 'SIM',
      },
    },
    estruturaPersonalizada: {
      aplicavel: request.estruturaAmpere,
      tipo: request.tipoEstrutura,
      respPagamento: request.responsavelEstrutura,
      valor: request.valorEstrutura,
      status: request.estruturaAmpere == 'NÃO' ? 'PENDÊNCIA' : 'N/A',
      statusEntrega: '',
    },
    contrato: {
      status: 'SOLICITADO',
      dataSolicitacao: new Date().toISOString(), // formatar como data
      dataLiberacao: null, // formatar como data
      dataAssinatura: null, // formatar como data
      formaAssinatura: request.formaAssinatura as TProjectDTO['contrato']['formaAssinatura'],
    },
    pagamento: {
      status: 'NÃO DEFINIDO',
      forma: request.origemRecurso,
      credor: request.credor,
      pagador: request.nomePagador,
      contatoPagador: request.contatoPagador,
      retorno: 0,
      cobrancaFeita: false,
    },
    faturamento: {
      previsaoFaturamento: '', // adicionar empresa e cnpj de faturamento
      cnpjFaturamento: 0,
      empresaFaturamento: null,
    },
    compra: {
      status: 'NÃO DEFINIDO',
      statusLiberacao: 'NÃO DEFINIDO',
      dataLiberacao: undefined, // formatar como data
      tipoDoKit: request.tipoDoKit ? request.tipoDoKit : 'NÃO DEFINIDO',
      valorDoKit: 0,
      previsaoValorDoKit: request.previsaoValorDoKit,
      kitInfo: getKitInformation(request),
      fornecedor: 'NÃO DEFINIDO',
      dataPedido: undefined, // formatar como data
      dataPagamento: undefined,
      previsaoEntrega: undefined, // formatar como data
      localEntrega: request.localEntrega == 'MESMO DO PROJETO' ? request.localEntrega : 'DIFERENTE DO PROJETO',
      informacoes: '',
      rastreio: '',
      statusEntrega: request.tipoDeServico === 'MONTAGEM E DESMONTAGEM' ? 'ENTREGUE' : 'NÃO DEFINIDO',
    },
    dadosCemig: {
      titularProjeto: request.nomeTitularProjeto || '',
      numeroInstalacao: request.numeroInstalacao || '',
      distCreditos: request.possuiDistribuicao || 'NÃO DEFINIDO',
      qtdeDistCreditos: request.distribuicoes?.length != 0 ? request.distribuicoes?.length : 0,
    },
    sistema: {
      qtdeModulos: getModulesInformation({
        qty: request.qtdeModulos ? request.qtdeModulos?.toString() : '0',
        power: request.potModulos ? request.potModulos?.toString() : '0',
      }).totalModulesQty,
      potModulos: request.potModulos,
      potPico: getModulesInformation({
        qty: request.qtdeModulos ? request.qtdeModulos?.toString() : '0',
        power: request.potModulos ? request.potModulos?.toString() : '0',
      }).totalModulesPower,
      topologia: request.topologia == 'INVERSOR' ? 'INVERSOR' : 'MICRO',
      inversor: getInverterInformation({
        model: request.marcaInversor ? request.marcaInversor?.toString().toUpperCase() : '',
        qty: request.qtdeInversor ? request.qtdeInversor.toString() : '0',
        power: request.potInversor ? request.potInversor.toString() : '0',
      }),
      tipoControlador: request.tipoControlador ? request.tipoControlador : '',
      marcaControlador: request.marcaControlador ? request.marcaControlador : '',
      qtdeControlador: request.qtdeControlador ? Number(request.qtdeControlador) : null,
      correnteControlador: request.correnteControlador ? Number(request.correnteControlador) : null,
      tipoBateria: request.tipoBateria ? request.tipoBateria : '',
      marcaBateria: request.marcaBateria ? request.marcaBateria : '',
      qtdeBateria: request.qtdeBateria ? Number(request.qtdeBateria) : null,
      capacidadeBateria: request.capacidadeBateria ? Number(request.capacidadeBateria) : null,
      marcaBomba: '',
      qtdeBomba: null,
      potBomba: null,
      valorProjeto: request.valorContrato || 0,
    },
    satisfacao: {},
    seguro: {
      aplicavel: request.clienteSegurado == 'SIM',
      dataInicio: new Date().toISOString(),
      dataFim: dayjs().add(365, 'days').toISOString(),
    },
    projeto: {
      iniciar: 'NÃO DEFINIDO',
      projetista: {
        nome: 'NÃO DEFINIDO',
        codigo: '',
      },
      dataLiberacaoDocumentacao: undefined, // formatar como data
      dataAssDocumentacao: undefined, // formatar como data
      diagramaUnifilar: undefined,
      desenhoTelhado: undefined,
      mapaDeMicro: undefined,
      aumentoDeCarga: request.aumentoDeCarga == 'SIM' || request.aumentoDisjuntor == 'SIM' ? 'SIM' : 'NÃO',
      acStatus: request.aumentoDeCarga == 'SIM' ? 'PENDÊNCIA' : 'NÃO DEFINIDO',
      projetoConcluido: 'NÃO',
      realizarHomologacao: request.realizarHomologacao,
    },
    homologacao: {
      homologar: !!request.realizarHomologacao,
      status: 'PENDENTE',
      potencia: request.potPico || null,
      distribuidora: EnergyDistributorEquivalent[(request.uf || '') as keyof typeof EnergyDistributorEquivalent] || 'CEMIG D',
      observacoes: request.observacoesHomologacao || '',
      pendencias: {
        desenhos: null,
        diagramas: null,
        formularios: null,
        mapasDeMicro: null,
        distribuicoes: null,
      },
      oportunidade: {
        id: request.idProjetoCRM || '',
        nome: '',
      },
      titular: {
        nome: request.nomeTitularProjeto || '',
        contato: request.telefone || '',
        identificador: '',
      },
      fastTrack: request.homologacaoFastTrack,
      equipamentos: [],
      localizacao: {
        uf: request.ufInstalacao || '',
        cidade: request.cidadeInstalacao || '',
      },
      instalacao: {
        grupo: (SegmentEquivalents[request.segmento as keyof typeof SegmentEquivalents] as THomologation['instalacao']['grupo']) || 'RESIDENCIAL',
        numeroCliente: '',
        numeroInstalacao: request.numeroInstalacao || '',
        dependentes: request?.distribuicoes?.map((d) => ({ numeroInstalacao: d.numInstalacao, recebimentoPercentual: d.excedente || 0 })) || [],
      },
      documentacao: {
        formaAssinatura: request.formaAssinatura == 'DIGITAL' ? 'DIGITAL' : 'FÍSICA',
        dataInicioElaboracao: null,
        dataConclusaoElaboracao: null,
        dataLiberacao: null,
        dataAssinatura: null,
      },
      acesso: {
        codigo: '',
        dataSolicitacao: null,
        dataResposta: null,
      },
      atualizacoes: [],
      vistoria: {
        dataSolicitacao: null,
        dataEfetivacao: null,
      },
      dataEfetivacao: null,
      dataLiberacao: null,
    },
    insider: request.insider,
    parecer: {
      statusDoParecerDeAcesso: 'NÃO DEFINIDO',
      dataParecerDeAcesso: undefined, // formatar como data
      parecerReprovado: 'NÃO',
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    vistoria: {
      dataPedido: undefined, // formatar como data
      status: 'NÃO DEFINIDO',
      vistoriaReprovada: 'NÃO',
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    medidor: {
      data: undefined, // formatar como data
      status: 'NÃO DEFINIDO',
    },
    oem: {
      aplicavel: request.possuiOeM == 'SIM' ? true : false, // checar se existe campo existente na gestao
      duracao: OeMInfo.duracao,
      qtdeManutencoes: OeMInfo.qtdeManutencoes,
      diagnostico: undefined,
      dataInicio: OeMInfo.dataInicio,
      dataFim: OeMInfo.dataFim,
      plano: request.planoOeM,
      valor: Number(request.valorOeMOuSeguro) || 0,
    },
    obra: {
      laudo: request.laudo ? (request.laudo as TProjectDTO['obra']['laudo']) : 'NÃO DEFINIDO',
      observacoes:
        request.tipoDeServico == 'MONTAGEM E DESMONTAGEM'
          ? getObservationsForInstallationLocationChange({ willChange: request.mudancaLocal == 'SIM' })
          : '', // possibilidade de substituir \n por /, e quebrar textp em pontos
      statusSolicitacao: 'NÃO SOLICITADA',
      entrada: undefined, // formatar como data
      saida: undefined, // formatar como data.
      statusDaObra: 'NÃO DEFINIDO',
      equipeResp: 'NÃO DEFINIDO',
      checklist: undefined,
      trafo: 'NÃO',
    },
    material: {
      statusSeparacao: 'NÃO DEFINIDO',
      previsaoCustos: request.previsaoCustos, // toFixed(2)
      efetivoCustos: 0,
      materialFaltante: '',
    },
    manutencaoPreventiva: { status: 'NÃO REALIZADO', data: null },
    manutencoes: getOeMInformation({ applicable: request.possuiOeM == 'SIM', plan: request.planoOeM }).manutencoes,
    relatorios: {
      envioUm: { status: 'NÃO REALIZADO', data: null },
      envioDois: { status: 'NÃO REALIZADO', data: null },
      envioTres: { status: 'NÃO REALIZADO', data: null },
      envioQuatro: { status: 'NÃO REALIZADO', data: null },
    },
    conferencias: {
      usinaLigada: { status: 'NÃO REALIZADO', data: null },
      monitoramentoFeito: { status: 'NÃO REALIZADO', data: null },
      energiaInjetada: { status: 'NÃO REALIZADO', data: null },
    },
    app: {
      data: undefined,
      login: '',
      senha: '',
    },
    dataNascimento: request.dataDeNascimento,
    email: request.email,
    produtos: request.produtos || [],
    servicos: request.servicos || [],
    logradouro: request.enderecoInstalacao,
    numeroResidencia: request.numeroResInstalacao || '',
    bairro: request.bairroInstalacao,
    cep: request.cepInstalacao,
    canalVenda: request.canalVenda || '',
    indicacao: {
      quemIndicou: request.nomeIndicador ? request.nomeIndicador : null, //add
      contato: request.telefoneIndicador ? request.telefoneIndicador : null, //add
    },
    ondeTrabalha: request.ondeTrabalha,
    jornada: {
      dataUltimoContato: undefined,
      boasVindas: false,
      assDocumentacoes: false,
      compraDoKit: false,
      nfFaturada: false,
      prevChegada: false,
      respConcessionaria: false,
      entregaDoKit: false,
      instalacaoAgendada: false,
      vistoriaConcessionaria: false,
      sistemaLigado: false,
      jornadaConcluida: false,
      dataNps: undefined,
      cuidados: request.cuidadosContatoJornada,
      contatos: request.nomeContatoJornadaDois
        ? `1º CONTATO - ${request.nomeContatoJornadaUm} (${request.telefoneContatoUm}) 2º CONTATO - ${request.nomeContatoJornadaDois} (${request.telefoneContatoDois})`
        : `1º CONTATO - ${request.nomeContatoJornadaUm} (${request.telefoneContatoUm})`,
      tipoEntregaTecnica: 'REMOTO',
    },
    possuiDeficiencia: request.possuiDeficiencia,
    qualDeficiencia: request.qualDeficiencia,
    nps: undefined,
    idParceiro: request.idParceiro,
    nomeParceiro: request.nomeParceiro,
    idMarketing: request.idOportunidade,
    idVisitaTecnica: request.idVisitaTecnica,
    idProjetoCRM: request.idProjetoCRM,
    idPropostaCRM: request?.idPropostaCRM,
    idSolicitacaoContrato: request._id,
    links: {
      documentos: (request.links || [])?.map((l) => ({ ...l, category: 'DOCUMENTOS' })),
      visitaTecnica: undefined,
    },
  }
  return insertObj
}

export async function getProjectHomologationInformation({ homologationId }: { homologationId: string }) {
  try {
    const homologation = await fetchHomologationById({ id: homologationId })
    const homologationFileReferences = await fetchFileReferencesByHomologationId({ homologationId })

    const projectHomologation: TProject['homologacao'] = {
      homologar: true,
      status: homologation.status,
      potencia: homologation.potencia,
      distribuidora: homologation.distribuidora,
      pendencias: homologation.pendencias,
      oportunidade: homologation.oportunidade,
      titular: homologation.titular,
      equipamentos: homologation.equipamentos,
      localizacao: homologation.localizacao,
      instalacao: homologation.instalacao,
      documentacao: homologation.documentacao,
      acesso: homologation.acesso,
      atualizacoes: homologation.atualizacoes,
      vistoria: homologation.vistoria,
      dataEfetivacao: homologation.dataEfetivacao,
      dataLiberacao: homologation.dataInsercao,
    }
    const projectHomologationFiles: TProject['links']['projetos'] = homologationFileReferences.map((f) => ({
      title: f.titulo.toUpperCase(),
      format: f.formato,
      link: f.url,
      category: 'HOMOLOGAÇÃO',
    }))
    return { projectHomologation, projectHomologationFiles }
  } catch (error) {
    throw error
  }
}
