import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import { TbExternalLink } from 'react-icons/tb'
import { AiOutlineSearch, AiOutlineCheck } from 'react-icons/ai'
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md'
import { VscChromeClose } from 'react-icons/vsc'
import { FaSave } from 'react-icons/fa'
import { FiDelete } from 'react-icons/fi'

import TextInput from './TextInput'
import SelectInput from './SelectInput'
import NumberInput from './NumberInput'
import DateInput from './DateInput'
import CheckboxInput from './CheckboxInput'
import SaveButton from './utils/Buttons/SaveButton'
import FileLinkBlock from './utils/FileLinkBlock'

import { cidadesAtendidas, credores, customersAcquisitionChannels, fileTypes, tiposDePadrao, tiposDeServico, vendedores } from '../utils/constants'
import { storage } from '../utils/services/firebase/firebase-storage'
import { getErrorMessage, notifySellerInCRM } from '../utils/methods/handlers'
import { allSellers } from '../utils/select-options'
import CRMReferencesBlock from './identificador/solicitacoesContrato/blocos/CRMReferences'
const phoneMask = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
  return cep
}
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  width: '93%',
  height: '98%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
const validation = {
  nomeDoContrato: {
    test(value) {
      return value?.trim().length < 10
    },
    msg: 'Por favor, preencha um nome válido.',
  },
  nomeDoProjeto: {
    test(value) {
      return value?.trim().length < 2
    },
    msg: 'Por favor, preencha um nome de projeto válido.',
  },
  'vendedor.nome': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha o vendedor do projeto',
  },
  codigoSVB: {
    test(value) {
      return value == 0
    },
    msg: 'Por favor, preencha um código SVB válido',
  },
  cpf_cnpj: {
    test(value) {
      return value?.toString().length < 10
    },
    msg: 'Por favor, preencha um CPF/CNPJ válido',
  },
  telefone: {
    test(value) {
      return value?.toString().length < 9
    },
    msg: 'Por favor, preencha um Telefone válido',
  },
  'estruturaPersonaliza.tipo': {
    test(value) {
      return value == 'N/A'
    },
    msg: 'Por favor, preencha um tipo de estrutura válido',
  },
  'contrato.status': {
    test(value) {
      return value != 'AGUARDANDO SOLICITAÇÃO' && value != 'SOLICITADO'
    },
    msg: 'Por favor, preencha um status válido de contrato',
  },
  'pagamento.forma': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha uma forma de pagamento',
  },
  'pagamento.pagador': {
    test(value) {
      return value?.trim().length < 3
    },
    msg: 'Por favor, preencha o nome do pagador.',
  },
  'pagamento.contatoPagador': {
    test(value) {
      return value?.trim().length < 9
    },
    msg: 'Por favor, preencha o contato do pagador.',
  },
  'compra.localEntrega': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha o local de entrega',
  },
  'compra.tipoDoKit': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha o tipo do kit',
  },
  'dadosCemig.titularProjeto': {
    test(value) {
      return value == null
    },
    msg: 'Por favor, digite o titular do projeto',
  },
  'dadosCemig.distCreditos': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha sobre a necessidade de dist. de créditos',
  },
  'sistema.qtdeModulos': {
    test(value) {
      return value == 0
    },
    msg: 'Por favor, preencha a quantidade de módulos',
  },
  'sistema.potModulos': {
    test(value) {
      return value == 0
    },
    msg: 'Por favor, preencha a potência dos módulos',
  },
  'sistema.topologia': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha uma topologia válida',
  },
  'sistema.inversor': {
    test(value) {
      return value?.trim().length < 5
    },
    msg: 'Por favor, preencha informacoes sobre os micro/inversor',
  },
  'material.previsaoCustos': {
    test(value) {
      return value == 0
    },
    msg: 'Por favor, preencha um valor válido de previsão de custos de insumo',
  },
  'obra.laudo': {
    test(value) {
      return value == 'NÃO DEFINIDO'
    },
    msg: 'Por favor, preencha o status do laudo',
  },
  'visitaTecnica.tecnico': {
    test(value) {
      return value?.trim().length < 3
    },
    msg: 'Por favor, preencha o técnico responsável',
  },
  'visitaTecnica.tipoDaTelha': {
    test(value) {
      return value?.trim().length < 3
    },
    msg: 'Por favor, preencha o tipo da telha',
  },
}
function ModalFormSolicitacao({ solicitacao, setModalIsOpen, editor, financeiroEditor, getFormularios }) {
  const queryClient = useQueryClient()
  // Router
  const router = useRouter()
  const [dados, setDados] = useState(solicitacao)
  // Messages
  const [msg, setMessage] = useState({ text: '', color: '' })
  const [creationMsg, setCreationMsg] = useState({ text: '', color: '' })
  const [emailMsg, setEmailMsg] = useState({ text: '', color: '' })
  const [fileMsg, setFileMsg] = useState({ text: '', color: '' })

  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState('')

  // Handling Distribuições
  const [dadosDistribuicao, setDadosDistribuicao] = useState({
    numInstalacao: '',
    excedente: null,
  })
  function adicionarDistribuicao() {
    const distribuicoesArr = dados.distribuicoes ? dados.distribuicoes : []
    setDados({
      ...dados,
      distribuicoes: [
        ...distribuicoesArr,
        {
          numInstalacao: dadosDistribuicao.numInstalacao,
          excedente: dadosDistribuicao.excedente,
        },
      ],
    })
    setDadosDistribuicao({ numInstalacao: '', excedente: 0 })
  }
  // Handling Visita Tecnica Vinculation
  const [idVisitaTecnica, setIdVisitaTecnica] = useState('')
  async function vinculateVisitaTecnica() {
    try {
      if (idVisitaTecnica.trim().length < 10) {
        return toast.error('Preencha um ID inválido.')
      }
      const { data: technicalAnalysisInfo } = await axios.post(`/api/solicitacoes/getVisitaTecnica/${idVisitaTecnica}`, {
        nome: 1,
        requerente: 1,
        analista: 1,
        'detalhes.tipoEstrutura': 1,
        'detalhes.tipoTelha': 1,
        arquivos: 1,
      })

      setDados({
        ...dados,
        nomeDoProjeto: technicalAnalysisInfo.nome,
        visitaTecnica: 'REALIZADA',
        respVisitaTecnica: technicalAnalysisInfo.analista?.apelido,
        linksVisita: technicalAnalysisInfo.arquivos?.map((f) => ({ title: f.descricao, link: f.url, format: f.formato })),
        materialEstrutura: technicalAnalysisInfo.detalhes.tipoEstrutura,
        tipoDaTelha: technicalAnalysisInfo.detalhes.tipoTelha,
        idVisitaTecnica: idVisitaTecnica,
      })
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }

  // Handling Alterations
  async function saveChanges() {
    const loadingToastId = toast.loading('Processando...')
    try {
      await axios.put('/api/solicitacoes/contrato', dados)
      toast.dismiss(loadingToastId)
      await queryClient.invalidateQueries({ queryKey: ['contract-requests'] })
      return toast.success('Alterações feitas com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      return toast.error(msg)
    }
  }
  async function rejectSolicitacao() {
    if (!dados.comentariosAoVendedor || dados.comentariosAoVendedor.trim().length < 5) {
      return setCreationMsg({
        text: 'Discorra sobre o motivo da reprova',
        color: 'text-red-500',
      })
    }
    const loadingToastId = toast.loading('Processando...')
    try {
      await axios.put('/api/solicitacoes/contrato', { _id: solicitacao._id, aprovacao: false })
      toast.dismiss(loadingToastId)
      await queryClient.invalidateQueries({ queryKey: ['contract-requests'] })
      return toast.success('Solicitação rejeitada !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      return toast.error(msg)
    }
  }
  // Utils
  async function notifyCobrancas() {
    try {
      let data = await axios.post('/api/notificacoes/1', {
        destinatario: '6353eb83ef4e1a367a877949',
        remetente: 'SISTEMA',
        mensagem: `Olá, acabo de aprovar uma solicitação de contrato do cliente ${solicitacao.nomeDoContrato}. Desde já agradeço, Volts.`,
      })
    } catch (error) {
      console.log(error)
    }
  }
  async function sendEmail() {
    try {
      await axios.post('/api/integracao/email', {
        emailTo: 'contasareceber@ampereenergias.com.br', // amperecontasareceber@gmail.com
        subject: 'SOLICITAÇÃO DE CONTRATO',
        message: `Olá, acabo de aprovar uma solicitação de contrato do cliente ${solicitacao.nomeDoContrato}. Formulário disponível no link: https://app.ampereenergias.com.br/comercial/publicoFormulario/${dados._id} . Desde já agradeço, Volts.`,
        copy: [
          'comercial@ampereenergias.com.br',
          // 'adm02@ampereenergias.com.br',
          // 'estagioadm@ampereenergias.com.br',
          'amperecontasareceber@outlook.com',
        ],
      })
      console.log('EMAIL ENVIADO')
      setEmailMsg({ text: 'Email enviado', color: 'text-green-500' })
    } catch (error) {
      setEmailMsg({
        text: `Houve um erro no envio do email - ${error}`,
        color: 'text-red-500',
      })
    }
  }
  function contractMade() {
    axios
      .put('/api/solicitacoes/contrato', {
        _id: solicitacao._id,
        confeccionado: true,
      })
      .then(() => {
        getFormularios()
        setDados({ ...dados, confeccionado: true })
        setMessage({ text: 'Atualização feita!', color: 'text-green-500' })
      })
      .catch((err) =>
        setMessage({
          text: 'Um erro ocorreu, tente novamente',
          color: 'text-red-500',
        })
      )
  }
  function getJoinedInfo({ marca, qtde, pot }) {
    let splitMarca = marca.split('/')
    let splitQtde = qtde.split('/')
    let splitPot = pot.split('/')
    let holder = []
    for (let i = 0; i < splitMarca.length; i++) {
      let str = `${splitQtde[i]}x${splitMarca[i]}(${splitPot[i]}W)`
      holder.push(str)
    }
    return holder.join(' - ')
  }
  function getKitInfo(dados) {
    let moduleSplitMarca = dados.marcaModulos.split('/')
    let moduleSplitQtde = dados.qtdeModulos.split('/')
    let moduleSplitPot = dados.potModulos.split('/')
    let holder = []
    for (let i = 0; i < moduleSplitMarca.length; i++) {
      let str = `${moduleSplitQtde} - ${moduleSplitMarca}(${moduleSplitPot}W)`
      holder.push(str)
    }
    let inverterSplitMarca = dados.marcaInversor.split('/')
    let inverterSplitQtde = dados.qtdeInversor.split('/')
    let inverterSplitPot = dados.potInversor.split('/')
    for (let i = 0; i < inverterSplitMarca.length; i++) {
      let str = `${inverterSplitQtde} - ${inverterSplitMarca}(${inverterSplitPot}W)`
      holder.push(str)
    }
    return holder.join('\n')
  }
  function getSummedValues({ qtde, pot }) {
    let splitQtde = qtde.split('/')
    let splitPot = pot.split('/')
    let totalPot = 0
    for (let i = 0; i < splitQtde.length; i++) {
      totalPot = totalPot + (splitQtde[i] * splitPot[i]) / 1000
    }
    let summedModules = splitQtde.reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
    return { totalPot, summedModules }
  }
  function getOeMInfo({ possuiOEM, plano }) {
    if (possuiOEM == 'SIM') {
      if (plano == 'MANUTENÇÃO SIMPLES' || plano == 'MANUTENÇÃO SIMLES') {
        return { duracao: 0, qtdeManutencoes: 1 }
      } else if (plano == 'PLANO SOL') {
        return { duracao: 1, qtdeManutencoes: 1 }
      } else if (plano == 'PLANO SOL +') {
        return { duracao: 1, qtdeManutencoes: 2 }
      } else if (plano == 'NÃO SE APLICA') {
        return { duracao: 0, qtdeManutencoes: 0 }
      } else return { duracao: 0, qtdeManutencoes: 0 }
    } else {
      return { duracao: 0, qtdeManutencoes: 0 }
    }
  }
  function getObraObs() {
    if (dados.mudancaLocal == 'SIM') {
      return `HAVERÁ MUDANÇA DE LOCAL. A NOVA INSTALAÇÃO SERÁ FEITA EM: ${dados.enderecoInstalacaoRemontagem},${dados.bairroInstalacaoRemontagem}, Nº ${dados.numeroInstalacaoRemontagem} ${dados.cidadeInstalacaoRemontagem}(${dados.ufInstalacaoRemontagem}).`
    } else {
      return `NÃO HAVERÁ MUDANÇA DE LOCAL`
    }
  }

  // Handling Validations and Project Insert
  var insertObj = {
    nomeDoContrato: dados.nomeDoContrato.toUpperCase(),
    nomeDoProjeto: dados.nomeDoProjeto ? dados.nomeDoProjeto.toUpperCase() : '',
    cpf_cnpj: dados.cpf_cnpj,
    telefone: dados.telefone,
    cidade: dados.cidadeInstalacao,
    uf: dados.ufInstalacao,
    vendedor: {
      nome: dados.nomeVendedor,
      codigo: null,
    },
    linkDrive: dados.linkDrive ? dados.linkDrive : '',
    regional: dados.regional ? dados.regional : 'NÃO DEFINIDO',
    tipoDeServico: dados.tipoDeServico ? dados.tipoDeServico : 'SISTEMA FOTOVOLTAICO',
    codigoSVB: dados.codigoSVB,
    segmento: dados.segmento,
    obsComercial:
      dados.tipoDeServico == 'MONTAGEM E DESMONTAGEM' ? (dados.obsComercial ? dados.obsComercial + getObraObs() : getObraObs()) : dados.obsComercial,
    visitaTecnica: {
      status: dados.visitaTecnica,
      tecnico: dados.respVisitaTecnica,
      saidaDoCliente: '',
      amperagem: dados.tipoDePadrao,
      tipoDaTelha: dados.tipoDaTelha,
    },
    padrao: {
      tipo: 'NÃO DEFINIDO',
      caixaConjugada: dados.caixaConjugada,
      respPagamento: dados.formaPagamentoPadrao,
      respInstalacao: dados.respTrocaPadrao,
      valor: dados.valorPadrao,
    },
    estruturaPersonalizada: {
      aplicavel: dados.estruturaAmpere,
      tipo: dados.tipoEstrutura,
      respPagamento: dados.responsavelEstrutura,
      valor: dados.valorEstrutura,
      status: dados.estruturaAmpere == 'NÃO' ? 'PENDÊNCIA' : 'N/A',
    },
    contrato: {
      status: 'SOLICITADO',
      dataSolicitacao: new Date().toISOString(), // formatar como data
      dataLiberacao: null, // formatar como data
      dataAssinatura: null, // formatar como data
      formaAssinatura: dados.formaAssinatura,
    },
    pagamento: {
      status: 'NÃO DEFINIDO',
      forma: dados.origemRecurso,
      credor: dados.credor,
      pagador: dados.nomePagador,
      contatoPagador: dados.contatoPagador,
      retorno: 0,
      cobrancaFeita: false,
    },
    faturamento: {
      previsaoFaturamento: 0, // adicionar empresa e cnpj de faturamento
      cnpjFaturamento: 0,
      empresaFaturamento: 'NÃO DEFINIDO',
    },
    compra: {
      status: 'NÃO DEFINIDO',
      statusLiberacao: 'NÃO DEFINIDO',
      dataLiberacao: undefined, // formatar como data
      tipoDoKit: dados.tipoDoKit ? dados.tipoDoKit : 'NÃO DEFINIDO',
      valorDoKit: 0,
      previsaoValorDoKit: dados.previsaoValorDoKit,
      kitInfo: getKitInfo(dados),
      fornecedor: 'NÃO DEFINIDO',
      dataPedido: undefined, // formatar como data
      dataPagamento: undefined,
      previsaoEntrega: undefined, // formatar como data
      localEntrega: dados.localEntrega == 'MESMO DO PROJETO' ? dados.localEntrega : 'DIFERENTE DO PROJETO',
      informacoes: '',
      previsaoNotaFiscal: undefined,
      rastreio: '',
      statusEntrega: dados.tipoDeServico === 'MONTAGEM E DESMONTAGEM' ? 'ENTREGUE' : 'NÃO DEFINIDO',
    },
    dadosCemig: {
      titularProjeto: dados.nomeTitularProjeto,
      numeroInstalacao: dados.numeroInstalacao,
      distCreditos: dados.possuiDistribuicao,
      qtdeDistCreditos: dados.distribuicoes?.length != 0 ? dados.distribuicoes?.length : 0,
    },
    sistema: {
      qtdeModulos: getSummedValues({
        qtde: dados.qtdeModulos ? dados.qtdeModulos?.toString() : '0',
        pot: dados.potModulos ? dados.potModulos?.toString() : '0',
      }).summedModules,
      potModulos: dados.potModulos,
      potPico: getSummedValues({
        qtde: dados.qtdeModulos ? dados.qtdeModulos?.toString() : '0',
        pot: dados.potModulos ? dados.potModulos?.toString() : '0',
      }).totalPot,
      topologia: dados.topologia,
      inversor: getJoinedInfo({
        marca: dados.marcaInversor ? dados.marcaInversor?.toString().toUpperCase() : '',
        qtde: dados.qtdeInversor ? dados.qtdeInversor.toString() : '0',
        pot: dados.potInversor ? dados.potInversor.toString() : '0',
      }),
      tipoControlador: dados.tipoControlador ? dados.tipoControlador : null,
      marcaControlador: dados.marcaControlador ? dados.marcaControlador : null,
      qtdeControlador: dados.qtdeControlador ? dados.qtdeControlador : null,
      correnteControlador: dados.correnteControlador ? dados.correnteControlador : null,
      tipoBateria: dados.tipoBateria ? dados.tipoBateria : null,
      marcaBateria: dados.marcaBateria ? dados.marcaBateria : null,
      qtdeBateria: dados.qtdeBateria ? dados.qtdeBateria : null,
      capacidadeBateria: dados.capacidadeBateria ? dados.capacidadeBateria : null,
      marcaBomba: dados.marcaBomba ? dados.marcaBomba : null,
      qtdeBomba: dados.qtdeBomba ? dados.qtdeBomba : null,
      potBomba: dados.potBomba ? dados.potBomba : null,
      valorProjeto: dados.valorContrato,
    },
    projeto: {
      iniciar: 'NÃO DEFINIDO',
      projetista: {
        nome: 'NÃO DEFINIDO',
        codigo: undefined,
      },
      dataLiberacaoDocumentacao: undefined, // formatar como data
      dataAssDocumentacao: undefined, // formatar como data
      diagramaUnifilar: undefined,
      desenhoTelhado: undefined,
      mapaDeMicro: undefined,
      aumentoDeCarga: dados.aumentoDeCarga == 'SIM' || dados.aumentoDisjuntor == 'SIM' ? 'SIM' : 'NÃO',
      acStatus: dados.aumentoDeCarga == 'SIM' ? 'PENDÊNCIA' : 'NÃO DEFINIDO',
      projetoConcluido: 'NÃO',
      realizarHomologacao: dados.realizarHomologacao,
    },
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
      aplicavel: dados.possuiOeM == 'SIM' ? true : false, // checar se existe campo existente na gestao
      duracao: getOeMInfo({ possuiOEM: dados.possuiOeM, plano: dados.planoOeM }).duracao,
      qtdeManutencoes: getOeMInfo({
        possuiOEM: dados.possuiOeM,
        plano: dados.planoOeM,
      }).qtdeManutencoes,
      diagnostico: undefined,
      plano: dados.planoOeM,
      valor: isNaN(Number(dados.valor)) ? 0 : Number(dados.valor),
    },
    obra: {
      laudo: dados.laudo ? dados.laudo : 'NÃO DEFINIDO',
      observacoes: dados.tipoDeServico == 'MONTAGEM E DESMONTAGEM' ? getObraObs() : '', // possibilidade de substituir \n por /, e quebrar textp em pontos
      statusSolicitacao: 'NÃO SOLICITADA',
      entrada: undefined, // formatar como data
      saida: undefined, // formatar como data.
      statusDaObra: 'NÃO DEFINIDO',
      equipeResp: 'NÃO DEFINIDO',
      checklist: undefined,
      trafo: 'NÃO',
      fotosInstalacao: undefined,
    },
    material: {
      statusSeparacao: 'NÃO DEFINIDO',
      previsaoCustos: dados.previsaoCustos, // toFixed(2)
      efetivoCustos: 0,
      notaFiscal: undefined,
      materialFaltante: '',
    },
    manutencaoPreventiva: { status: 'NÃO REALIZADO', data: null },
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
    dataNascimento: dados.dataDeNascimento,
    email: dados.email,
    logradouro: dados.enderecoInstalacao,
    numeroResidencia: dados.numeroResInstalacao,
    bairro: dados.bairroInstalacao,
    cep: dados.cepInstalacao,
    canalVenda: dados.canalVenda,
    indicacao: {
      quemIndicou: dados.nomeIndicador ? dados.nomeIndicador : null, //add
      contato: dados.telefoneIndicador ? dados.telefoneIndicador : null, //add
    },
    ondeTrabalha: dados.ondeTrabalha,
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
      cuidados: dados.cuidadosContatoJornada,
      contatos: dados.nomeContatoJornadaDois
        ? `1º CONTATO - ${dados.nomeContatoJornadaUm} (${dados.telefoneContatoUm}) 2º CONTATO - ${dados.nomeContatoJornadaDois} (${dados.telefoneContatoDois})`
        : `1º CONTATO - ${dados.nomeContatoJornadaUm} (${dados.telefoneContatoUm})`,
    },
    possuiDeficiencia: dados.possuiDeficiencia,
    qualDeficiencia: dados.qualDeficiencia,
    nps: undefined,
    idVisitaTecnica: dados.idVisitaTecnica,
    idProjetoCRM: dados.idProjetoCRM,
    idPropostaCRM: dados?.idPropostaCRM,
    idSolicitacaoContrato: dados._id,
    links: {
      documentos: dados.links,
      visitaTecnica: dados.linksVisita ? dados.linksVisita : undefined,
    },
  }
  function validateCreation() {
    var holder
    Object.entries(insertObj).forEach((entry) => {
      if (typeof entry[1] == 'object' && entry[1] != null) {
        let tag = entry[0]

        Object.keys(entry[1]).forEach((x) => {
          if (validation[`${tag}.${x}`] != undefined) {
            if (validation[`${tag}.${x}`].test(insertObj[tag][x]) == true) {
              holder = true
              setCreationMsg({
                text: validation[`${tag}.${x}`].msg,
                color: 'text-red-500',
              })
            }
          } else return
        })
      } else {
        let tag = entry[0]
        if (validation[tag] != undefined) {
          if (validation[tag].test(insertObj[tag]) == true) {
            holder = true
            setCreationMsg({
              text: validation[tag].msg,
              color: 'text-red-500',
            })
          }
        }
      }
    })
    if (holder == undefined) {
      setCreationMsg({ text: '', color: '' })
      addProject()
    }
  }
  async function addProject() {
    const loadingToastId = toast.loading('Processando...')
    try {
      await axios.put('/api/solicitacoes/contrato', { _id: solicitacao._id, aprovacao: true, dataAprovacao: new Date().toISOString() })
      sendEmail()
      notifyCobrancas()
      if (dados.idProjetoCRM) await notifySellerInCRM(insertObj.vendedor.nome, dados.idProjetoCRM, 'SOLICITAÇÃO DE CONTRATO APROVADA.')
      await axios.post('/api/projects/add', insertObj)
      toast.dismiss(loadingToastId)
      await queryClient.invalidateQueries({ queryKey: ['contract-requests'] })
      toast.success('Projeto adicionado !')
      setDados({ ...dados, aprovacao: true })
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      return toast.error(msg)
    }
  }

  async function uploadFiles() {
    if (fileName.trim().length < 3) {
      setFileMsg({
        text: 'Por favor, preencha um nome de arquivo válido.',
        color: 'text-red-500',
      })
      setTimeout(() => {
        setFileMsg({ text: '', color: '' })
      }, 2000)
    }
    var splitNome = fileName.replace('/', '').toLowerCase().split(' ')
    var fixedNome = splitNome.join('_')
    try {
      var arr = dados.links ? dados.links : []
      setFileMsg({ text: 'Enviando arquivo(s)...', color: 'text-[#15599a]' })
      if (image.length > 0) {
        for (let i = 0; i < image.length; i++) {
          let file = image.item(i)
          let storageName =
            image.length > 1 ? `clientes/${dados.nomeDoContrato}/${fixedNome}-{${i + 1}}` : `clientes/${dados.nomeDoContrato}/${fixedNome}`
          var imageRef = ref(storage, storageName)
          let res = await uploadBytes(imageRef, file).catch((err) => {
            throw 'Houve um erro no envio das imagens'
          })
          var url = await getDownloadURL(ref(storage, res.metadata.fullPath))
          let name = image.length > 1 ? `${fileName} (${i + 1})` : `${fileName}`
          arr = [
            ...arr,
            {
              title: name,
              link: url,
              format: fileTypes[res.metadata.contentType] ? fileTypes[res.metadata.contentType].title : 'INDEFINIDO',
            },
          ]
        }
      }
      let apiResponse = await axios
        .put(`/api/solicitacoes/update?id=${dados._id}`, {
          operation: {
            $set: {
              links: arr,
            },
          },
        })
        .catch((err) => {
          throw 'Houve um erro no salvamento dos links'
        })
      setDados({ ...dados, links: arr })
      setFileMsg({
        text: 'Arquivo(s) salvo(s) com sucesso.',
        color: 'text-green-500',
      })
      setTimeout(() => {
        setFileMsg({
          text: '',
          color: '',
        })
      }, 2000)
      setFileName('')
    } catch (error) {
      setFileMsg({
        text: 'Erro no envio das images.',
        color: 'text-red-500',
      })
    }
  }

  async function deleteFile(obj) {
    try {
      let fileRef = ref(storage, obj.link)
      let firebaseResponse = await deleteObject(fileRef).catch((err) => {
        throw new Error('Erro ao excluir arquivo no Firebase.')
      })
      const newArr = dados.links.filter((x) => x.link != obj.link)
      let apiResponse = await axios.put(`/api/solicitacoes/update?id=${dados._id}`, {
        operation: {
          $pull: {
            [`links`]: obj,
          },
        },
      })
      console.log('API RESPONSE', apiResponse.data)
      setDados({ ...dados, links: newArr })
      setFileMsg({
        text: 'Arquivo excluído com sucesso.',
        color: 'text-green-500',
      })
      setTimeout(() => {
        setFileMsg({
          text: '',
          color: '',
        })
      }, 2000)
    } catch (error) {
      setFileMsg({ text: 'Erro ao exluir arquivo.', color: 'text-red-500' })
    }
  }
  console.log(getKitInfo(dados))
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex h-full flex-col">
            <div className="flex flex-col items-center justify-between gap-2 border-b border-gray-200 px-2 pb-2 lg:flex-row">
              <div className="flex items-center justify-center gap-2">
                <h1 className="pl-6 font-bold  text-[#15599a]">{dados.nomeDoContrato}</h1>
                <p className="text-xxs italic text-gray-600">#{dados._id}</p>
              </div>
              <div className="flex w-full items-center justify-between gap-2 lg:w-fit">
                {dados.aprovacao && !dados.confeccionado ? (
                  <button
                    onClick={contractMade}
                    className="group flex items-center gap-2 rounded border border-red-500 p-2 text-sm font-bold text-red-500 hover:border-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <p className="text-xs">CONTRATO CONFECCIONADO</p>
                    <div className="block text-lg group-hover:hidden">
                      <MdCheckBoxOutlineBlank />
                    </div>
                    <div className="hidden text-lg group-hover:block">
                      <MdOutlineCheckBox />
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex grow items-center justify-center gap-2 lg:grow-0 lg:justify-end">
                  {msg.text && <p className={`hidden italic lg:block ${msg.color}`}>{msg.text}</p>}
                  {editor && <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={saveChanges} />}
                  <button>
                    <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
                  </button>
                </div>
                <div className="flex items-center gap-x-2"></div>
              </div>
              {msg.text && <p className={`block italic lg:hidden ${msg.color}`}>{msg.text}</p>}
            </div>
            <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto">
              <>
                <div className="flex w-full items-center justify-center gap-2 border border-[#15599a] bg-[#fff] py-2 shadow-lg">
                  <h1 className="text-md w-fit text-center font-bold text-green-500 lg:text-xl">REVISÃO DAS INFORMAÇÕES</h1>
                  <Link href={`/comercial/publicoFormulario/${dados._id}`}>
                    <a className="flex items-center justify-center gap-2 rounded border border-[#fead61] p-2 text-sm font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black ">
                      <TbExternalLink />
                      <p>PDF</p>
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    DADOS PARA CONTRATO
                  </span>
                  <div className="flex flex-wrap justify-around gap-2">
                    <TextInput
                      label={'Nome/Razão Social'}
                      editable={editor}
                      value={dados.nomeDoContrato}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          nomeDoContrato: value.toUpperCase(),
                        })
                      }
                    />
                    <SelectInput
                      label={'Vendedor'}
                      value={dados.nomeVendedor}
                      editable={editor}
                      options={allSellers.map((vendedor) => {
                        return { label: vendedor.label, value: vendedor.value }
                      })}
                      handleChange={(value) => setDados({ ...dados, nomeVendedor: value })}
                    />
                    <CheckboxInput
                      title={'JÁ É CLIENTE AMPÈRE'}
                      labelTrue={'SIM'}
                      labelFalse={'NÃO'}
                      checked={dados.clienteAmpere == 'SIM'}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          clienteAmpere: value ? 'SIM' : 'NÃO',
                        })
                      }
                    />
                    <SelectInput
                      label={'TIPO DE SERVIÇO'}
                      editable={editor}
                      value={dados.tipoDeServico ? dados.tipoDeServico : 'NÃO DEFINIDO'}
                      options={tiposDeServico.map((tipo) => tipo)}
                      handleChange={(value) => setDados({ ...dados, tipoDeServico: value })}
                    />
                    <TextInput
                      label={'Telefone'}
                      editable={editor}
                      value={dados.telefone}
                      handleChange={(value) => setDados({ ...dados, telefone: phoneMask(value) })}
                    />
                    <TextInput
                      label={'CPF/CNPJ'}
                      editable={editor}
                      value={dados.cpf_cnpj}
                      handleChange={(value) => setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })}
                    />
                    <TextInput label={'RG'} editable={editor} value={dados.rg} handleChange={(value) => setDados({ ...dados, rg: value })} />
                    <DateInput
                      label={'DATA DE NASCIMENTO'}
                      editable={editor}
                      value={dados.dataDeNascimento ? new Date(dados.dataDeNascimento).toISOString().slice(0, 10) : null}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          dataDeNascimento: new Date(value).toISOString(),
                        })
                      }
                    />
                    <TextInput
                      label={'CEP'}
                      editable={editor}
                      value={dados.cep}
                      handleChange={(value) => setDados({ ...dados, cep: formatCEP(value) })}
                    />
                    <button onClick={() => findCPF('enderecoCobranca')} className="flex h-[30px] items-center rounded bg-[#fead61] p-1">
                      <AiOutlineSearch />
                    </button>
                    <SelectInput
                      label={'CIDADE'}
                      editable={editor}
                      value={dados.cidade}
                      options={cidadesAtendidas.map((cidade) => {
                        return { label: cidade, value: cidade }
                      })}
                      handleChange={(value) => setDados({ ...dados, cidade: value })}
                    />
                    <TextInput label={'UF'} editable={editor} value={dados.uf} handleChange={(value) => setDados({ ...dados, uf: value })} />
                    <TextInput
                      label={'ENDEREÇO DE COBRANÇA'}
                      editable={editor}
                      value={dados.enderecoCobranca}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          enderecoCobranca: value.toUpperCase(),
                        })
                      }
                    />
                    <NumberInput
                      label={'Nº'}
                      editable={editor}
                      value={dados.numeroResCobranca}
                      handleChange={(value) => setDados({ ...dados, numeroResCobranca: Number(value) })}
                    />
                    <TextInput
                      label={'BAIRRO'}
                      editable={editor}
                      value={dados.bairro}
                      handleChange={(value) => setDados({ ...dados, bairro: value.toUpperCase() })}
                    />
                    <TextInput
                      label={'PONTO DE REFERÊNCIA'}
                      editable={editor}
                      value={dados.pontoDeReferencia}
                      handleChange={(value) => setDados({ ...dados, pontoDeReferencia: value })}
                    />
                    <SelectInput
                      label={'SEGMENTO'}
                      editable={editor}
                      value={dados.segmento}
                      options={[
                        {
                          value: 'RESIDENCIAL',
                          label: 'RESIDENCIAL',
                        },
                        {
                          value: 'COMERCIAL',
                          label: 'COMERCIAL',
                        },
                        {
                          value: 'INDUSTRIAL',
                          label: 'INDUSTRIAL',
                        },
                        {
                          value: 'RURAL',
                          label: 'RURAL',
                        },
                      ]}
                      handleChange={(value) => setDados({ ...dados, segmento: value })}
                    />
                    <SelectInput
                      label={'FORMA DE ASSINATURA'}
                      editable={editor}
                      options={[
                        {
                          value: 'DIGITAL',
                          label: 'DIGITAL',
                        },
                        {
                          value: 'FISICO',
                          label: 'FISICO',
                        },
                      ]}
                      handleChange={(value) => setDados({ ...dados, formaAssinatura: value })}
                    />
                    <TextInput
                      label={'CÓDIGO DO PROJETO'}
                      editable={editor}
                      value={dados.codigoSVB}
                      handleChange={(value) => setDados({ ...dados, codigoSVB: value })}
                    />
                    <SelectInput
                      label={'ESTADO CIVIL'}
                      editable={editor}
                      options={[
                        {
                          label: 'CASADO(A)',
                          value: 'CASADO(A)',
                        },
                        {
                          label: 'SOLTEIRO(A)',
                          value: 'SOLTEIRO(A)',
                        },
                        {
                          label: 'UNIÃO ESTÁVEL',
                          value: 'UNIÃO ESTÁVEL',
                        },
                        {
                          label: 'DIVORCIADO(A)',
                          value: 'DIVORCIADO(A)',
                        },
                        {
                          label: 'VIUVO(A)',
                          value: 'VIUVO(A)',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      value={dados.estadoCivil}
                      handleChange={(value) => setDados({ ...dados, estadoCivil: value })}
                    />
                    <TextInput
                      label={'EMAIL'}
                      normalCase={true}
                      editable={editor}
                      value={dados.email}
                      handleChange={(value) => setDados({ ...dados, email: value })}
                    />
                    <TextInput
                      label={'PROFISSÃO'}
                      editable={editor}
                      value={dados.profissao}
                      handleChange={(value) => setDados({ ...dados, profissao: value })}
                    />
                    <TextInput
                      label={'ONDE TRABALHA'}
                      editable={editor}
                      value={dados.ondeTrabalha}
                      handleChange={(value) => setDados({ ...dados, ondeTrabalha: value })}
                    />
                    <SelectInput
                      label={'POSSUI ALGUMA DEFICIÊNCIA'}
                      editable={editor}
                      value={dados.possuiDeficiencia}
                      handleChange={(value) => setDados({ ...dados, possuiDeficiencia: value })}
                      options={[
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                      ]}
                    />
                    {dados.possuiDeficiencia == 'SIM' && (
                      <>
                        <TextInput
                          label={'SE SIM, QUAL ?'}
                          editable={editor}
                          value={dados.qualDeficiencia}
                          handleChange={(value) => setDados({ ...dados, qualDeficiencia: value })}
                        />
                      </>
                    )}
                    <SelectInput
                      label={'CANAL DE VENDA'}
                      editable={editor}
                      value={dados.canalVenda}
                      handleChange={(value) => setDados({ ...dados, canalVenda: value })}
                      options={customersAcquisitionChannels.map((value) => value)}
                    />
                    {dados.canalVenda == 'INDICAÇÃO DE AMIGO' && (
                      <>
                        <TextInput
                          label={'NOME INDICADOR'}
                          editable={editor}
                          value={dados.nomeIndicador}
                          handleChange={(value) => setDados({ ...dados, nomeIndicador: value })}
                        />
                        <TextInput
                          label={'TELEFONE INDICADOR'}
                          editable={editor}
                          value={dados.telefoneIndicador}
                          handleChange={(value) => setDados({ ...dados, telefoneIndicador: value })}
                        />
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex w-full flex-col items-center self-center px-2">
                    <span className="text-center font-raleway text-sm font-bold uppercase">COMO VOCÊ CHEGOU A ESSE CLIENTE?</span>
                    <textarea
                      readOnly={!editor}
                      placeholder={'Descrição aqui..'}
                      value={dados.comoChegouAoCliente}
                      className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          comoChegouAoCliente: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="mt-2 flex w-full flex-col items-center self-center px-2">
                    <span className="text-center font-raleway text-sm font-bold uppercase">OBSERVAÇÃO COMERCIAL</span>
                    <textarea
                      readOnly={!editor}
                      placeholder={'Observações comerciais aqui..'}
                      value={dados.obsComercial ? dados.obsComercial : ''}
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          obsComercial: e.target.value.toUpperCase(),
                        })
                      }
                      className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
                    />
                  </div>
                  {['SISTEMA FOTOVOLTAICO (OFF GRID)', 'BOMBA SOLAR'].includes(dados.tipoDeServico) && (
                    <div className="mt-2 flex items-center justify-center">
                      <SelectInput
                        label={'TIPO DE VENDA'}
                        value={dados.tipoVenda ? dados.tipoVenda : 'NÃO DEFINIDO'}
                        editable={true}
                        handleChange={(value) => setDados({ ...dados, tipoVenda: value })}
                        options={[
                          {
                            label: 'SOMENTE MATERIAL',
                            value: 'SOMENTE MATERIAL',
                          },
                          {
                            label: 'MATERIAL+INSTALAÇÃO',
                            value: 'MATERIAL+INSTALAÇÃO',
                          },
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                        ]}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    DADOS PARA CONTATO
                  </span>
                  <div className="flex flex-wrap justify-around gap-2">
                    <TextInput
                      label={'NOME DO CONTATO 1'}
                      editable={editor}
                      value={dados.nomeContatoJornadaUm}
                      handleChange={(value) => setDados({ ...dados, nomeContatoJornadaUm: value })}
                    />
                    <TextInput
                      label={'TELEFONE DO CONTATO 1'}
                      editable={editor}
                      value={dados.telefoneContatoUm}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          telefoneContatoUm: phoneMask(value),
                        })
                      }
                    />
                    <TextInput
                      label={'NOME DO CONTATO 2'}
                      editable={editor}
                      value={dados.nomeContatoJornadaDois}
                      handleChange={(value) => setDados({ ...dados, nomeContatoJornadaDois: value })}
                    />
                    <TextInput
                      label={'TELEFONE DO CONTATO 2'}
                      editable={editor}
                      value={dados.telefoneContatoDois}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          telefoneContatoDois: phoneMask(value),
                        })
                      }
                    />
                    <div className="mt-2 flex w-full flex-col items-center self-center px-2">
                      <span className="text-center font-raleway text-sm font-bold uppercase">CUIDADOS PARA CONTATO COM O CLIENTE</span>
                      <textarea
                        readOnly={!editor}
                        placeholder={
                          'Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc...'
                        }
                        value={dados.cuidadosContatoJornada}
                        className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            cuidadosContatoJornada: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                {dados.idPropostaCRM || dados.idProjetoCRM ? (
                  <CRMReferencesBlock opportunityId={dados.idProjetoCRM} proposeId={dados.idPropostaCRM} />
                ) : null}

                {dados.clienteAmpere != 'SIM' ? (
                  <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                    <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                      DADOS DA INSTALAÇÃO
                    </span>
                    <div className="flex flex-wrap justify-around gap-2">
                      <TextInput
                        label={'NOME DO TITULAR DO PROJETO'}
                        editable={editor}
                        value={dados.nomeTitularProjeto}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            nomeTitularProjeto: value.toUpperCase(),
                          })
                        }
                      />
                      <SelectInput
                        label={'TIPO DO TITULAR'}
                        editable={editor}
                        value={dados.tipoDoTitular}
                        handleChange={(value) => setDados({ ...dados, tipoDoTitular: value })}
                        options={[
                          {
                            label: 'PESSOA FISICA',
                            value: 'PESSOA FISICA',
                          },
                          {
                            label: 'PESSOA JURIDICA',
                            value: 'PESSOA JURIDICA',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                      <SelectInput
                        label={'TIPO DA LIGAÇÃO'}
                        editable={editor}
                        value={dados.tipoDaLigacao}
                        handleChange={(value) => setDados({ ...dados, tipoDaLigacao: value })}
                        options={[
                          {
                            label: 'NOVA',
                            value: 'NOVA',
                          },
                          {
                            label: 'EXISTENTE',
                            value: 'EXISTENTE',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                      <SelectInput
                        label={'TIPO DA INSTALAÇÃO'}
                        editable={editor}
                        value={dados.tipoDaInstalacao ? dados.tipoDaInstalacao : 'NÃO DEFINIDO'}
                        handleChange={(value) => setDados({ ...dados, tipoDaInstalacao: value })}
                        options={[
                          {
                            label: 'RURAL',
                            value: 'RURAL',
                          },
                          {
                            label: 'URBANO',
                            value: 'URBANO',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                      <TextInput
                        label={'CEP INSTALAÇÃO'}
                        editable={editor}
                        value={dados.cepInstalacao}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            cepInstalacao: formatCEP(value),
                          })
                        }
                      />

                      <TextInput
                        label={'ENDEREÇO DE INSTALAÇÃO'}
                        editable={editor}
                        value={dados.enderecoInstalacao}
                        handleChange={(value) => setDados({ ...dados, enderecoInstalacao: value })}
                      />
                      <NumberInput
                        label={'Nº'}
                        editable={editor}
                        value={dados.numeroResInstalacao}
                        handleChange={(value) => setDados({ ...dados, numeroResInstalacao: value })}
                      />
                      <NumberInput
                        label={'Nº DA INSTALAÇÃO'}
                        editable={editor}
                        value={dados.numeroInstalacao}
                        handleChange={(value) => setDados({ ...dados, numeroInstalacao: value })}
                      />
                      <TextInput
                        label={'BAIRRO'}
                        editable={editor}
                        value={dados.bairroInstalacao}
                        handleChange={(value) => setDados({ ...dados, bairroInstalacao: value })}
                      />
                      <SelectInput
                        label={'CIDADE'}
                        editable={editor}
                        value={dados.cidadeInstalacao}
                        options={cidadesAtendidas.map((cidade) => {
                          return { label: cidade, value: cidade }
                        })}
                        handleChange={(value) => setDados({ ...dados, cidadeInstalacao: value })}
                      />
                      <TextInput
                        label={'UF'}
                        editable={editor}
                        value={dados.ufInstalacao}
                        handleChange={(value) => setDados({ ...dados, ufInstalacao: value })}
                      />
                      <TextInput
                        label={'PONTO DE REFERÊNCIA'}
                        editable={editor}
                        value={dados.pontoDeReferenciaInstalacao}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            pontoDeReferenciaInstalacao: value,
                          })
                        }
                      />
                      <TextInput
                        label={'LOGIN(CEMIG ATENDE)'}
                        editable={editor}
                        value={dados.loginCemigAtende}
                        handleChange={(value) => setDados({ ...dados, loginCemigAtende: value })}
                      />
                      <TextInput
                        label={'SENHA(CEMIG ATENDE)'}
                        editable={editor}
                        value={dados.senhaCemigAtende}
                        handleChange={(value) => setDados({ ...dados, senhaCemigAtende: value })}
                      />
                      <TextInput
                        label={'LATITUDE'}
                        editable={editor}
                        value={dados.latitude}
                        handleChange={(value) => setDados({ ...dados, latitude: value })}
                      />
                      <TextInput
                        label={'LONGITUDE'}
                        editable={editor}
                        value={dados.longitude}
                        handleChange={(value) => setDados({ ...dados, longitude: value })}
                      />
                      <NumberInput
                        label={'POTÊNIA PICO'}
                        editable={editor}
                        value={
                          dados.potPico
                            ? dados.potPico
                            : getSummedValues({
                                qtde: dados.qtdeModulos ? dados.qtdeModulos.toString() : '0',
                                pot: dados.potModulos ? dados.potModulos.toString() : '0',
                              }).totalPot
                        }
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            potPico: Number(value),
                            geracaoPrevista: Number(value) * 126,
                          })
                        }
                      />
                      <NumberInput
                        label={'GERAÇÃO PREVISTA'}
                        editable={editor}
                        value={
                          dados.geracaoPrevista
                            ? dados.geracaoPrevista
                            : getSummedValues({
                                qtde: dados.qtdeModulos ? dados.qtdeModulos.toString() : '0',
                                pot: dados.potModulos ? dados.potModulos.toString() : '0',
                              }).totalPot * 126
                        }
                        handleChange={(value) => setDados({ ...dados, geracaoPrevista: value })}
                      />
                    </div>
                    {dados.tipoDeServico == 'MONTAGEM E DESMONTAGEM' ? (
                      <div className="flex flex-col border-t border-gray-200 pt-2">
                        <div className="col-span-3 flex items-center justify-center">
                          <SelectInput
                            label={'HAVERÁ MUDANÇA DE LOCAL'}
                            editable={true}
                            value={dados.mudancaLocal ? dados.mudancaLocal : 'NÃO DEFINIDO'}
                            options={[
                              {
                                label: 'SIM',
                                value: 'SIM',
                              },
                              {
                                label: 'NÃO',
                                value: 'NÃO',
                              },
                              {
                                label: 'NÃO DEFINIDO',
                                value: 'NÃO DEFINIDO',
                              },
                            ]}
                            handleChange={(value) => {
                              if (value == 'NÃO') {
                                setDados({
                                  ...dados,
                                  mudancaLocal: value.toUpperCase(),
                                  tipoDaLigacao: 'NÃO DEFINIDO',
                                  tipoDaInstalacaoRemontagem: 'NÃO DEFINIDO',
                                  cepInstalacaoRemontagem: '',
                                  enderecoInstalacaoRemontagem: '',
                                  numeroInstalacaoRemontagem: '',
                                  numeroResInstalacaoRemontagem: '',
                                  bairroInstalacaoRemontagem: '',
                                  cidadeInstalacaoRemontagem: '',
                                  ufInstalacaoRemontagem: '',
                                  latitudeRemontagem: '',
                                  longitudeRemontagem: '',
                                  pontoDeReferenciaInstalacaoRemontagem: '',
                                })
                              } else {
                                setDados({
                                  ...dados,
                                  mudancaLocal: value.toUpperCase(),
                                })
                              }
                            }}
                          />
                        </div>
                        {dados.mudancaLocal == 'SIM' ? (
                          <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
                            <div className="flex items-center justify-center">
                              <SelectInput
                                label={'TIPO DA LIGAÇÃO (NOVO LOCAL)'}
                                editable={true}
                                value={dados.tipoDaLigacao}
                                handleChange={(value) => setDados({ ...dados, tipoDaLigacao: value })}
                                options={[
                                  {
                                    label: 'NOVA',
                                    value: 'NOVA',
                                  },
                                  {
                                    label: 'EXISTENTE',
                                    value: 'EXISTENTE',
                                  },
                                  {
                                    label: 'NÃO DEFINIDO',
                                    value: 'NÃO DEFINIDO',
                                  },
                                ]}
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <SelectInput
                                label={'TIPO DA INSTALAÇÃO (NOVO LOCAL)'}
                                editable={true}
                                value={dados.tipoDaInstalacaoRemontagem ? dados.tipoDaInstalacaoRemontagem : 'NÃO DEFINIDO'}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    tipoDaInstalacaoRemontagem: value,
                                  })
                                }
                                options={[
                                  {
                                    label: 'RURAL',
                                    value: 'RURAL',
                                  },
                                  {
                                    label: 'URBANO',
                                    value: 'URBANO',
                                  },
                                  {
                                    label: 'NÃO DEFINIDO',
                                    value: 'NÃO DEFINIDO',
                                  },
                                ]}
                              />
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-2">
                              <TextInput
                                editable={true}
                                label={'CEP INSTALAÇÃO (NOVO LOCAL)'}
                                value={dados.cepInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    cepInstalacaoRemontagem: formatCEP(value),
                                  })
                                }
                              />
                              <button
                                onClick={() => findCPFRemontagem('enderecoInstalacao')}
                                className="flex h-[30px] items-center rounded bg-[#fead61] p-1"
                              >
                                <AiOutlineSearch />
                              </button>
                            </div>
                            <div className="flex items-center justify-center">
                              <TextInput
                                label={'ENDEREÇO DE INSTALAÇÃO (NOVO LOCAL)'}
                                editable={true}
                                value={dados.enderecoInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    enderecoInstalacaoRemontagem: value.toUpperCase(),
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <TextInput
                                label={'Nº (NOVO LOCAL)'}
                                editable={true}
                                value={dados.numeroResInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    numeroResInstalacaoRemontagem: value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <NumberInput
                                label={'Nº DA INSTALAÇÃO (NOVO LOCAL)'}
                                editable={true}
                                value={dados.numeroInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    numeroInstalacaoRemontagem: value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <TextInput
                                label={'BAIRRO (NOVO LOCAL)'}
                                editable={true}
                                value={dados.bairroInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    bairroInstalacaoRemontagem: value.toUpperCase(),
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <SelectInput
                                label={'CIDADE (NOVO LOCAL)'}
                                editable={true}
                                value={dados.cidadeInstalacaoRemontagem}
                                options={[
                                  {
                                    label: 'NÃO DEFINIDO',
                                    value: 'NÃO DEFINIDO',
                                  },
                                  ...cidadesAtendidas.map((cidade) => {
                                    return { label: cidade, value: cidade }
                                  }),
                                ]}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    cidadeInstalacaoRemontagem: value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <TextInput
                                label={'UF (NOVO LOCAL)'}
                                editable={true}
                                value={dados.ufInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    ufInstalacaoRemontagem: value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <TextInput
                                label={'PONTO DE REFERÊNCIA (NOVO LOCAL)'}
                                editable={true}
                                value={dados.pontoDeReferenciaInstalacaoRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    pontoDeReferenciaInstalacaoRemontagem: value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
                              <TextInput
                                label={'LATITUDE (NOVO LOCAL)'}
                                value={dados.latitudeRemontagem}
                                editable={true}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    latitudeRemontagem: value,
                                  })
                                }
                              />
                              <TextInput
                                label={'LONGITUDE (NOVO LOCAL)'}
                                editable={true}
                                value={dados.longitudeRemontagem}
                                handleChange={(value) =>
                                  setDados({
                                    ...dados,
                                    longitudeRemontagem: value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">DADOS DO SISTEMA</span>
                  {dados.tipoDeServico == 'AUMENTO DE SISTEMA FOTOVOLTAICO' ? (
                    <span className="mt-1 border-t border-blue-500 py-2 text-center text-sm font-bold uppercase text-[#fead61]">
                      DADOS DO SISTEMA (AUMENTO)
                    </span>
                  ) : null}
                  <div className="flex justify-center">
                    <SelectInput
                      label={'TOPOLOGIA'}
                      editable={editor}
                      value={dados.topologia}
                      handleChange={(value) => setDados({ ...dados, topologia: value })}
                      options={[
                        {
                          label: 'MICRO-INVERSOR',
                          value: 'MICRO',
                        },
                        {
                          label: 'INVERSOR',
                          value: 'INVERSOR',
                        },
                        {
                          label: 'OTIMIZADOR',
                          value: 'OTIMIZADOR',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap justify-around gap-2 border-t border-gray-200 py-2">
                    <TextInput
                      label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'MARCA DO INVERSOR/MICRO' : ' MARCA DO DRIVER'}
                      editable={editor}
                      value={dados.marcaInversor}
                      handleChange={(value) => setDados({ ...dados, marcaInversor: value })}
                    />
                    <TextInput
                      label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'QTDE INVERSOR/MICRO' : 'QTDE DRIVERS'}
                      editable={editor}
                      value={dados.qtdeInversor}
                      handleChange={(value) => setDados({ ...dados, qtdeInversor: value })}
                    />
                    <TextInput
                      label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'POTÊNCIA INVERSOR/MICRO' : 'POTÊNCIA DRIVER'}
                      editable={editor}
                      unit={'W'}
                      value={dados.potInversor}
                      handleChange={(value) => setDados({ ...dados, potInversor: value })}
                    />
                  </div>
                  <div className="flex flex-col items-center text-sm  lg:text-base">
                    <span className="text-center font-raleway text-sm font-bold uppercase">
                      {dados.tipoDeServico != 'BOMBA SOLAR' ? 'INFORMAÇÃO MICRO/INVERSOR' : 'INFORMAÇÃO DRIVERS'}
                    </span>
                    <p className="w-full text-center text-xs  text-gray-600 outline-none">
                      {getJoinedInfo({
                        marca: dados.marcaInversor ? dados.marcaInversor?.toString().toUpperCase() : '',
                        qtde: dados.qtdeInversor ? dados.qtdeInversor?.toString() : '',
                        pot: dados.potInversor ? dados.potInversor?.toString() : '',
                      })}
                    </p>
                  </div>
                  {dados.topologia == 'OTIMIZADOR' && (
                    <div className="mt-2 flex flex-wrap justify-around gap-2">
                      <TextInput
                        label={'MARCA DO OTIMIZADOR'}
                        editable={editor}
                        value={dados.marcaOtimizador ? dados.marcaOtimizador : ''}
                        handleChange={(value) => setDados({ ...dados, marcaOtimizador: value })}
                      />
                      <NumberInput
                        label={'QTDE DO OTIMIZADOR'}
                        editable={editor}
                        value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
                        handleChange={(value) => setDados({ ...dados, qtdeOtimizador: Number(value) })}
                      />
                      <NumberInput
                        label={'POTÊNCIA DO OTIMIZADOR'}
                        editable={editor}
                        unit={'W'}
                        value={dados.potOtimizador ? dados.potOtimizador : null}
                        handleChange={(value) => setDados({ ...dados, potOtimizador: Number(value) })}
                      />
                    </div>
                  )}
                  <div className="mx-2 mt-2 flex flex-wrap justify-around gap-2 border-t border-gray-200 pt-2">
                    <TextInput
                      label={'MARCA DOS MÓDULOS'}
                      editable={editor}
                      value={dados.marcaModulos}
                      handleChange={(value) => setDados({ ...dados, marcaModulos: value })}
                    />
                    <TextInput
                      label={'Nº DE MÓDULOS'}
                      editable={editor}
                      value={dados.qtdeModulos}
                      handleChange={(value) => setDados({ ...dados, qtdeModulos: value })}
                    />
                    <TextInput
                      label={'POTÊNCIA DOS MÓDULOS'}
                      editable={editor}
                      unit={'W'}
                      value={dados.potModulos}
                      handleChange={(value) => setDados({ ...dados, potModulos: value })}
                    />
                  </div>
                  <div className="flex flex-col items-center text-sm  lg:text-base">
                    <span className="text-center font-raleway text-sm font-bold uppercase">INFORMAÇÃO MÓDULOS</span>
                    <p className="w-full text-center text-xs  text-gray-600 outline-none">
                      {getJoinedInfo({
                        marca: dados.marcaModulos ? dados.marcaModulos.toString().toUpperCase() : '',
                        qtde: dados.qtdeModulos ? dados.qtdeModulos.toString() : '',
                        pot: dados.potModulos ? dados.potModulos.toString() : '',
                      })}
                    </p>
                  </div>
                  {dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' && (
                    <>
                      <div className="mt-2 flex flex-col items-center border-t border-gray-200 py-2 lg:grid lg:grid-cols-4">
                        <div className="flex w-full items-center justify-center">
                          <TextInput
                            label={'MARCA DO CONTROLADOR'}
                            editable={true}
                            value={dados.marcaControlador}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                marcaControlador: value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'QTDE DE CONTROLADORES'}
                            editable={true}
                            value={dados.qtdeControlador}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                qtdeControlador: Number(value),
                              })
                            }
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <SelectInput
                            label={'TIPO DO CONTROLADOR'}
                            editable={true}
                            value={dados.tipoControlador ? dados.tipoControlador : 'NÃO DEFINIDO'}
                            options={[
                              {
                                label: 'INTEGRADO AO INVERSOR',
                                value: 'INTEGRADO AO INVERSOR',
                              },
                              {
                                label: 'COMPRO EM SEPARADO',
                                value: 'SEPARADO',
                              },
                              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                            ]}
                            handleChange={(value) => setDados({ ...dados, tipoControlador: value })}
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'CORRENTE DE CARGA (em A)'}
                            editable={true}
                            value={dados.correnteControlador}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                correnteControlador: Number(value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center border-t border-gray-200 py-2 lg:grid lg:grid-cols-4">
                        <div className="flex w-full items-center justify-center">
                          <TextInput
                            label={'MARCA DA BATERIA'}
                            editable={true}
                            value={dados.marcaBateria}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                marcaBateria: value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'QTDE DE BATERIAS'}
                            editable={true}
                            value={dados.qtdeBateria}
                            handleChange={(value) => setDados({ ...dados, qtdeBateria: Number(value) })}
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <SelectInput
                            label={'TIPO DA BATERIA'}
                            editable={true}
                            value={dados.tipoBateria ? dados.tipoBateria : 'NÃO DEFINIDO'}
                            options={[
                              { label: 'LÍTIO', value: 'LÍTIO' },
                              { label: 'ESTACIONÁRIA', value: 'ESTACIONÁRIA' },
                              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                            ]}
                            handleChange={(value) => setDados({ ...dados, tipoBateria: value })}
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'CAPACIDADE (em Ah)'}
                            editable={true}
                            value={dados.capacidadeBateria}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                capacidadeBateria: Number(value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {dados.tipoDeServico == 'BOMBA SOLAR' && (
                    <>
                      <div className="mt-2 flex flex-col items-center border-t border-gray-200 py-2 lg:grid lg:grid-cols-3">
                        <div className="flex items-center justify-center">
                          <TextInput
                            label={'MARCA BOMBA'}
                            editable={true}
                            value={dados.marcaBomba}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                marcaBomba: value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <NumberInput
                            label={'QTDE BOMBA'}
                            editable={true}
                            value={dados.qtdeBomba}
                            handleChange={(value) => setDados({ ...dados, qtdeBomba: Number(value) })}
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <NumberInput
                            label={'POTÊNCIA BOMBA'}
                            editable={true}
                            value={dados.potBomba}
                            handleChange={(value) => setDados({ ...dados, potBomba: Number(value) })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center border-t border-gray-200 py-2 lg:grid lg:grid-cols-4">
                        <div className="flex w-full items-center justify-center">
                          <TextInput
                            label={'MARCA DA BATERIA'}
                            editable={true}
                            value={dados.marcaBateria}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                marcaBateria: value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'QTDE DE BATERIAS'}
                            editable={true}
                            value={dados.qtdeBateria}
                            handleChange={(value) => setDados({ ...dados, qtdeBateria: Number(value) })}
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <SelectInput
                            label={'TIPO DA BATERIA'}
                            editable={true}
                            value={dados.tipoBateria ? dados.tipoBateria : 'NÃO DEFINIDO'}
                            options={[
                              { label: 'LÍTIO', value: 'LÍTIO' },
                              { label: 'ESTACIONÁRIA', value: 'ESTACIONÁRIA' },
                              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                            ]}
                            handleChange={(value) => setDados({ ...dados, tipoBateria: value })}
                          />
                        </div>
                        <div className="flex w-full items-center justify-center">
                          <NumberInput
                            label={'CAPACIDADE (em Ah)'}
                            editable={true}
                            value={dados.capacidadeBateria}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                capacidadeBateria: Number(value),
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {dados.clienteAmpere != 'SIM' && dados.tipoDeServico == 'AUMENTO DE SISTEMA FOTOVOLTAICO' ? (
                    <>
                      <span className="mt-1 border-t border-blue-500 py-2 text-center text-sm font-bold uppercase text-[#fead61]">
                        DADOS DO SISTEMA (ANTERIOR)
                      </span>
                      <div className="flex justify-center">
                        <SelectInput
                          label={'TOPOLOGIA (ANTERIOR)'}
                          editable={editor}
                          value={dados.topologiaAnterior}
                          handleChange={(value) => setDados({ ...dados, topologiaAnterior: value })}
                          options={[
                            {
                              label: 'MICRO-INVERSOR',
                              value: 'MICRO',
                            },
                            {
                              label: 'INVERSOR',
                              value: 'INVERSOR',
                            },
                            {
                              label: 'OTIMIZADOR',
                              value: 'OTIMIZADOR',
                            },
                            {
                              label: 'NÃO DEFINIDO',
                              value: 'NÃO DEFINIDO',
                            },
                          ]}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap justify-around gap-2 border-t border-gray-200 py-2">
                        <TextInput
                          label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'MARCA DO INVERSOR/MICRO (ANTERIOR)' : ' MARCA DO DRIVER (ANTERIOR)'}
                          editable={editor}
                          value={dados.marcaInversorAnterior}
                          handleChange={(value) => setDados({ ...dados, marcaInversorAnterior: value })}
                        />
                        <TextInput
                          label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'QTDE INVERSOR/MICRO (ANTERIOR)' : 'QTDE DRIVERS (ANTERIOR)'}
                          editable={editor}
                          value={dados.qtdeInversorAnterior}
                          handleChange={(value) => setDados({ ...dados, qtdeInversorAnterior: value })}
                        />
                        <TextInput
                          label={dados.tipoDeServico != 'BOMBA SOLAR' ? 'POTÊNCIA INVERSOR/MICRO (ANTERIOR)' : 'POTÊNCIA DRIVER (ANTERIOR)'}
                          editable={editor}
                          unit={'W'}
                          value={dados.potInversorAnterior}
                          handleChange={(value) => setDados({ ...dados, potInversorAnterior: value })}
                        />
                      </div>
                      <div className="flex flex-col items-center text-sm  lg:text-base">
                        <span className="text-center font-raleway text-sm font-bold uppercase">
                          {dados.tipoDeServico != 'BOMBA SOLAR' ? 'INFORMAÇÃO MICRO/INVERSOR (ANTERIOR)' : 'INFORMAÇÃO DRIVERS (ANTERIOR)'}
                        </span>
                        <p className="w-full text-center text-xs  text-gray-600 outline-none">
                          {getJoinedInfo({
                            marca: dados.marcaInversorAnterior ? dados.marcaInversorAnterior?.toString().toUpperCase() : '',
                            qtde: dados.qtdeInversorAnterior ? dados.qtdeInversorAnterior?.toString() : '',
                            pot: dados.potInversorAnterior ? dados.potInversorAnterior?.toString() : '',
                          })}
                        </p>
                      </div>
                      {dados.topologiaAnterior == 'OTIMIZADOR' && (
                        <div className="mt-2 flex flex-wrap justify-around gap-2">
                          <TextInput
                            label={'MARCA DO OTIMIZADOR (ANTERIOR)'}
                            editable={editor}
                            value={dados.marcaOtimizadorAnterior ? dados.marcaOtimizadorAnterior : ''}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                marcaOtimizadorAnterior: value,
                              })
                            }
                          />
                          <NumberInput
                            label={'QTDE DO OTIMIZADOR (ANTERIOR)'}
                            editable={editor}
                            value={dados.qtdeOtimizadorAnterior ? dados.qtdeOtimizadorAnterior : null}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                qtdeOtimizadorAnterior: Number(value),
                              })
                            }
                          />
                          <NumberInput
                            label={'POTÊNCIA DO OTIMIZADOR (ANTERIOR)'}
                            editable={editor}
                            unit={'W'}
                            value={dados.potOtimizadorAnterior ? dados.potOtimizadorAnterior : null}
                            handleChange={(value) =>
                              setDados({
                                ...dados,
                                potOtimizadorAnterior: Number(value),
                              })
                            }
                          />
                        </div>
                      )}
                      <div className="mx-2 mt-2 flex flex-wrap justify-around gap-2 border-t border-gray-200 pt-2">
                        <TextInput
                          label={'MARCA DOS MÓDULOS (ANTERIOR)'}
                          editable={editor}
                          value={dados.marcaModulosAnterior}
                          handleChange={(value) => setDados({ ...dados, marcaModulosAnterior: value })}
                        />
                        <TextInput
                          label={'Nº DE MÓDULOS (ANTERIOR)'}
                          editable={editor}
                          value={dados.qtdeModulosAnterior}
                          handleChange={(value) => setDados({ ...dados, qtdeModulosAnterior: value })}
                        />
                        <TextInput
                          label={'POTÊNCIA DOS MÓDULOS (ANTERIOR)'}
                          editable={editor}
                          unit={'W'}
                          value={dados.potModulosAnterior}
                          handleChange={(value) => setDados({ ...dados, potModulosAnterior: value })}
                        />
                      </div>
                      <div className="flex flex-col items-center text-sm  lg:text-base">
                        <span className="text-center font-raleway text-sm font-bold uppercase">INFORMAÇÃO MÓDULOS (ANTERIOR)</span>
                        <p className="w-full text-center text-xs  text-gray-600 outline-none">
                          {getJoinedInfo({
                            marca: dados.marcaModulosAnterior ? dados.marcaModulosAnterior.toString().toUpperCase() : '',
                            qtde: dados.qtdeModulosAnterior ? dados.qtdeModulosAnterior.toString() : '',
                            pot: dados.potModulosAnterior ? dados.potModulosAnterior.toString() : '',
                          })}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    ESTRUTURA DE MONTAGEM
                  </span>
                  <div className="flex flex-wrap justify-around gap-2">
                    <SelectInput
                      label={'TIPO DA ESTRUTURA'}
                      editable={editor}
                      options={[
                        {
                          label: 'TELHADO',
                          value: 'TELHADO',
                        },
                        {
                          label: 'CARPORT',
                          value: 'CARPORT',
                        },
                        {
                          label: 'SOLO',
                          value: 'SOLO',
                        },
                        {
                          label: 'ESTRUTURA PERSONALIZADA',
                          value: 'ESTRUTURA PERSONALIZADA',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      value={dados.tipoEstrutura}
                      handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
                    />
                    {dados.tipoDeServico == 'MONTAGEM E DESMONTAGEM' ? (
                      <SelectInput
                        width={'450px'}
                        label={'TIPO DA ESTRUTURA (REMONTAGEM)'}
                        editable={true}
                        options={[
                          {
                            label: 'MESMA ESTRUTURA',
                            value: 'MESMA ESTRUTURA',
                          },
                          {
                            label: 'TELHADO',
                            value: 'TELHADO',
                          },
                          {
                            label: 'CARPORT',
                            value: 'CARPORT',
                          },
                          {
                            label: 'SOLO',
                            value: 'SOLO',
                          },
                          {
                            label: 'ESTRUTURA PERSONALIZADA',
                            value: 'ESTRUTURA PERSONALIZADA',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                        value={dados.tipoEstruturaRemontagem ? dados.tipoEstruturaRemontagem : 'NÃO DEFINIDO'}
                        handleChange={(value) => setDados({ ...dados, tipoEstruturaRemontagem: value })}
                      />
                    ) : null}
                    <SelectInput
                      label={'MATERIAL DA ESTRUTURA'}
                      editable={editor}
                      options={[
                        { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                        { label: 'MADEIRA', value: 'MADEIRA' },
                        { label: 'FERRO', value: 'FERRO' },
                      ]}
                      value={dados.materialEstrutura ? dados.materialEstrutura : 'NÃO DEFINIDO'}
                      handleChange={(value) => setDados({ ...dados, materialEstrutura: value })}
                    />
                    {dados.tipoDeServico == 'MONTAGEM E DESMONTAGEM' ? (
                      <SelectInput
                        label={'MATERIAL DA ESTRUTURA (REMONTAGEM)'}
                        width={'450px'}
                        editable={true}
                        options={[
                          { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                          { label: 'MESMO MATERIAL', value: 'MESMO MATERIAL' },
                          { label: 'MADEIRA', value: 'MADEIRA' },
                          { label: 'FERRO', value: 'FERRO' },
                        ]}
                        value={dados.materialEstruturaRemontagem ? dados.materialEstruturaRemontagem : 'NÃO DEFINIDO'}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            materialEstruturaRemontagem: value,
                          })
                        }
                      />
                    ) : null}
                    <SelectInput
                      label={'SERÁ NECESSÁRIO QUALQUER ADEQUAÇÃO OU CONSTRUÇÃO DE ESTRUTURA?'}
                      editable={editor}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      value={dados.estruturaAmpere}
                      handleChange={(value) => setDados({ ...dados, estruturaAmpere: value })}
                    />
                    <SelectInput
                      label={'RESPONSÁVEL PELA ESTRUTURA'}
                      editable={editor}
                      options={[
                        {
                          label: 'AMPERE',
                          value: 'AMPERE',
                        },
                        {
                          label: 'CLIENTE',
                          value: 'CLIENTE',
                        },
                        {
                          label: 'NÃO SE APLICA',
                          value: 'NÃO SE APLICA',
                        },
                      ]}
                      value={dados.responsavelEstrutura}
                      handleChange={(value) => setDados({ ...dados, responsavelEstrutura: value })}
                    />
                    {dados.responsavelEstrutura != 'NÃO SE APLICA' && (
                      <>
                        <SelectInput
                          label={'FORMA DE PAGAMENTO'}
                          editable={editor}
                          options={[
                            {
                              label: 'INCLUSO NO FINANCIAMENTO',
                              value: 'INCLUSO NO FINANCIAMENTO',
                            },
                            {
                              label: 'DIRETO PRO FORNECEDOR',
                              value: 'DIRETO PRO FORNECEDOR',
                            },
                            {
                              label: 'A VISTA PARA AMPÈRE',
                              value: 'A VISTA PARA AMPÈRE',
                            },
                            {
                              label: 'NÃO SE APLICA',
                              value: 'NÃO SE APLICA',
                            },
                            {
                              label: 'NÃO DEFINIDO',
                              value: 'NÃO DEFINIDO',
                            },
                          ]}
                          value={dados.formaPagamentoEstrutura}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              formaPagamentoEstrutura: value,
                            })
                          }
                        />
                        <NumberInput
                          label={'VALOR DA ESTRUTURA'}
                          editable={editor}
                          value={dados.valorEstrutura}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              valorEstrutura: Number(value),
                            })
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">O&M E SEGURO</span>
                  <div className="flex flex-wrap justify-around gap-2">
                    <SelectInput
                      label={'KIT COM O&M ?'}
                      editable={editor}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      value={dados.possuiOeM}
                      handleChange={(value) => setDados({ ...dados, possuiOeM: value })}
                    />
                    {dados.possuiOeM == 'SIM' && (
                      <>
                        <SelectInput
                          label={'QUAL PLANO DE O&M?'}
                          editable={editor}
                          options={[
                            {
                              label: 'MANUTENÇÃO SIMPLES',
                              value: 'MANUTENÇÃO SIMPLES',
                            },
                            {
                              label: 'PLANO SOL',
                              value: 'PLANO SOL',
                            },
                            {
                              label: 'PLANO SOL +',
                              value: 'PLANO SOL +',
                            },
                            {
                              label: 'NÃO SE APLICA',
                              value: 'NÃO SE APLICA',
                            },
                          ]}
                          value={dados.planoOeM}
                          handleChange={(value) => setDados({ ...dados, planoOeM: value })}
                        />
                      </>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap justify-around gap-2">
                    <SelectInput
                      label={'CLIENTE SEGURADO?'}
                      editable={editor}
                      options={[
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      value={dados.clienteSegurado ? dados.clienteSegurado : 'NÃO DEFINIDO'}
                      handleChange={(value) => setDados({ ...dados, clienteSegurado: value })}
                    />
                    {dados.clienteSegurado == 'SIM' && (
                      <>
                        <SelectInput
                          label={'TEMPO SEGURADO'}
                          editable={editor}
                          options={[
                            {
                              label: '1 ANO',
                              value: '1 ANO',
                            },
                            {
                              label: '2 ANOS',
                              value: '2 ANOS',
                            },
                            {
                              label: '3 ANOS',
                              value: '3 ANOS',
                            },
                            {
                              label: '4 ANOS',
                              value: '4 ANOS',
                            },
                            {
                              label: '5 ANOS',
                              value: '5 ANOS',
                            },
                            {
                              label: 'NÃO SE APLICA',
                              value: 'NÃO SE APLICA',
                            },
                          ]}
                          value={dados.tempoSegurado}
                          handleChange={(value) => setDados({ ...dados, tempoSegurado: value })}
                        />
                      </>
                    )}
                  </div>
                  {(dados.possuiOeM == 'SIM' || dados.clienteSegurado == 'SIM') && (
                    <div className="mt-2 flex flex-wrap justify-around gap-2">
                      <SelectInput
                        label={'FORMA de PAGAMENTO'}
                        editable={editor}
                        options={[
                          {
                            label: 'INCLUSO NO FINANCIAMENTO',
                            value: 'INCLUSO NO FINANCIAMENTO',
                          },
                          {
                            label: 'DIRETO PRO FORNECEDOR',
                            value: 'DIRETO PRO FORNECEDOR',
                          },
                          {
                            label: 'A VISTA PARA AMPÈRE',
                            value: 'A VISTA PARA AMPÈRE',
                          },
                          {
                            label: 'NÃO SE APLICA',
                            value: 'NÃO SE APLICA',
                          },
                        ]}
                        value={dados.formaPagamentoOeMOuSeguro}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            formaPagamentoOeMOuSeguro: value,
                          })
                        }
                      />
                      <NumberInput
                        label={'VALOR O&M+SEGURO (se não incluso)'}
                        editable={editor}
                        value={dados.valorOeMOuSeguro}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            valorOeMOuSeguro: Number(value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
                {!['OPERAÇÃO E MANUTENÇÃO', 'BOMBA SOLAR', 'SISTEMA FOTOVOLTAICO (OFF GRID)'].includes(dados.tipoDeServico) && (
                  <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                    <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                      AUMENTO DE CARGA
                    </span>
                    <div className="flex justify-center">
                      <SelectInput
                        label={'HAVERÁ TROCA DE PADRÃO?'}
                        editable={editor}
                        options={[
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                          {
                            label: 'NÃO',
                            value: 'NÃO',
                          },
                          {
                            label: 'SIM',
                            value: 'SIM',
                          },
                        ]}
                        value={dados.aumentoDeCarga}
                        handleChange={(value) => setDados({ ...dados, aumentoDeCarga: value })}
                      />
                    </div>
                    {dados.aumentoDeCarga == 'SIM' && (
                      <div className="mt-2 flex flex-wrap justify-around gap-2">
                        <SelectInput
                          label={'CAIXA CONJUGADA?'}
                          editable={true}
                          options={[
                            {
                              label: 'NÃO DEFINIDO',
                              value: 'NÃO DEFINIDO',
                            },
                            {
                              label: 'NÃO',
                              value: 'NÃO',
                            },
                            {
                              label: 'SIM',
                              value: 'SIM',
                            },
                          ]}
                          value={dados.caixaConjugada}
                          handleChange={(value) => setDados({ ...dados, caixaConjugada: value })}
                        />
                        <SelectInput
                          editable={editor}
                          label={'TIPO DO PADRÃO'}
                          value={dados.tipoDePadrao}
                          handleChange={(value) => setDados({ ...dados, tipoDePadrao: value })}
                          options={tiposDePadrao}
                        />
                        <SelectInput
                          editable={editor}
                          label={'HAVERÁ AUMENTO DO DISJUNTOR?'}
                          value={dados.aumentoDisjuntor}
                          handleChange={(value) => setDados({ ...dados, aumentoDisjuntor: value })}
                          options={[
                            {
                              label: 'SIM',
                              value: 'SIM',
                            },
                            {
                              label: 'NÃO',
                              value: 'NÃO',
                            },
                          ]}
                        />
                        <SelectInput
                          label={'RESPONSÁVEL PELA TROCA'}
                          editable={editor}
                          value={dados.respTrocaPadrao}
                          handleChange={(value) => setDados({ ...dados, respTrocaPadrao: value })}
                          options={[
                            {
                              label: 'AMPERE',
                              value: 'AMPERE',
                            },
                            {
                              label: 'CLIENTE',
                              value: 'CLIENTE',
                            },
                            {
                              label: 'NÃO SE APLICA',
                              value: 'NÃO SE APLICA',
                            },
                          ]}
                        />
                        <SelectInput
                          label={'PAGAMENTO DO PADRÃO'}
                          editable={editor}
                          value={dados.formaPagamentoPadrao ? dados.formaPagamentoPadrao : 'NÃO HAVERA TROCA PADRÃO'}
                          options={[
                            {
                              label: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                              value: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                            },
                            {
                              label: 'CLIENTE PAGAR POR FORA',
                              value: 'CLIENTE PAGAR POR FORA',
                            },
                            {
                              label: 'INCLUSO NO CONTRATO',
                              value: 'INCLUSO NO CONTRATO',
                            },
                            {
                              label: 'NÃO HAVERA TROCA PADRÃO',
                              value: 'NÃO HAVERA TROCA PADRÃO',
                            },
                          ]}
                          handleChange={(value) => {
                            setDados({ ...dados, formaPagamentoPadrao: value })
                          }}
                        />
                        <NumberInput
                          label={'VALOR DO PADRÃO'}
                          editable={editor}
                          value={dados.valorPadrao}
                          handleChange={(value) => setDados({ ...dados, valorPadrao: Number(value) })}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    DADOS FINANCEIROS E NEGOCIAÇÃO
                  </span>
                  <div className="mt-2 flex flex-wrap justify-around gap-2">
                    <TextInput
                      label={'NOME DO PAGADOR'}
                      editable={editor}
                      value={dados.nomePagador}
                      handleChange={(value) => setDados({ ...dados, nomePagador: value })}
                    />
                    <TextInput
                      label={'CONTATO DO PAGADOR'}
                      editable={editor}
                      value={dados.contatoPagador}
                      handleChange={(value) => setDados({ ...dados, contatoPagador: phoneMask(value) })}
                    />
                    <TextInput
                      label={'CPF/CNPJ PARA NF'}
                      editable={editor}
                      value={dados.cpf_cnpjNF}
                      handleChange={(value) => setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap justify-around gap-2">
                    <SelectInput
                      label={'NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?'}
                      editable={editor}
                      value={dados.necessidaInscricaoRural}
                      handleChange={(value) => setDados({ ...dados, necessidaInscricaoRural: value })}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                      ]}
                    />
                    {dados.necessidaInscricaoRural == 'SIM' && (
                      <TextInput
                        label={'INSCRIÇÃO RURAL'}
                        editable={editor}
                        value={dados.inscriçãoRural}
                        handleChange={(value) => setDados({ ...dados, inscriçãoRural: value })}
                      />
                    )}
                  </div>
                  {dados.tipoDeServico != 'MONTAGEM E DESMONTAGEM' ? (
                    <div className="mt-2 flex flex-wrap justify-around gap-2">
                      <SelectInput
                        label={'LOCAL DE ENTREGA'}
                        editable={editor}
                        options={[
                          {
                            label: 'MESMO DO PROJETO',
                            value: 'MESMO DO PROJETO',
                          },
                          {
                            label: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                            value: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                          },
                          {
                            label: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                            value: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                        value={dados.localEntrega}
                        handleChange={(value) => setDados({ ...dados, localEntrega: value })}
                      />
                      <SelectInput
                        label={'END. ENTREGA IGUAL COBRANÇA?'}
                        editable={editor}
                        value={dados.entregaIgualCobranca}
                        handleChange={(value) => setDados({ ...dados, entregaIgualCobranca: value })}
                        options={[
                          {
                            label: 'SIM',
                            value: 'SIM',
                          },
                          {
                            label: 'NÃO',
                            value: 'NÃO',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                      <SelectInput
                        label={'HÁ RESTRIÇÕES PARA ENTREGA?'}
                        editable={editor}
                        value={dados.restricoesEntrega}
                        handleChange={(value) => setDados({ ...dados, restricoesEntrega: value })}
                        options={[
                          {
                            label: 'SOMENTE HORARIO COMERCIAL',
                            value: 'SOMENTE HORARIO COMERCIAL',
                          },
                          {
                            label: 'NÃO HÁ RESTRIÇÕES',
                            value: 'NÃO HÁ RESTRIÇÕES',
                          },
                          {
                            label: 'CASA EM CONSTRUÇÃO',
                            value: 'CASA EM CONSTRUÇÃO',
                          },
                          {
                            label: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                            value: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                          },
                          {
                            label: 'NÃO DEFINIDO',
                            value: 'NÃO DEFINIDO',
                          },
                        ]}
                      />
                    </div>
                  ) : null}

                  <div className="mt-2 flex flex-wrap justify-around gap-2">
                    <NumberInput
                      label={'VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)'}
                      editable={editor}
                      tag={'R$'}
                      value={dados.valorContrato}
                      handleChange={(value) => setDados({ ...dados, valorContrato: Number(value) })}
                    />
                    <SelectInput
                      label={'ORIGEM DO RECURSO'}
                      editable={editor}
                      value={dados.origemRecurso}
                      handleChange={(value) => setDados({ ...dados, origemRecurso: value })}
                      options={[
                        {
                          label: 'FINANCIAMENTO',
                          value: 'FINANCIAMENTO',
                        },
                        {
                          label: 'CAPITAL PRÓPRIO',
                          value: 'CAPITAL PRÓPRIO',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                    />
                    {dados.origemRecurso == 'FINANCIAMENTO' && (
                      <>
                        <SelectInput
                          label={'CREDOR'}
                          value={dados.credor}
                          editable={editor}
                          options={credores.map((credor) => credor)}
                          handleChange={(value) => setDados({ ...dados, credor: value })}
                        />
                        <TextInput
                          label={'NOME DO GERENTE'}
                          editable={editor}
                          value={dados.nomeGerente}
                          handleChange={(value) => setDados({ ...dados, nomeGerente: value })}
                        />
                        <TextInput
                          label={'CONTATO DO GERENTE'}
                          editable={editor}
                          value={dados.contatoGerente}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              contatoGerente: phoneMask(value),
                            })
                          }
                        />
                      </>
                    )}
                    <NumberInput
                      label={'SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?'}
                      editable={editor}
                      value={dados.numParcelas}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          numParcelas: Number(value),
                          valorParcela: dados.valorContrato / Number(value),
                        })
                      }
                    />
                    <NumberInput
                      label={'VALOR DA PARCELA'}
                      value={dados.valorParcela}
                      editable={editor}
                      tag={'R$'}
                      handleChange={(value) => setDados({ ...dados, valorParcela: Number(value) })}
                    />
                    <SelectInput
                      label={'NECESSIDADE N.F ADIANTADA'}
                      value={dados.necessidadeNFAdiantada}
                      editable={editor}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                      ]}
                      handleChange={(value) => setDados({ ...dados, necessidadeNFAdiantada: value })}
                    />
                    <SelectInput
                      label={'NECESSIDADE CÓDIGO FINAME?'}
                      value={dados.necessidadeCodigoFiname}
                      editable={editor}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                      ]}
                      handleChange={(value) => setDados({ ...dados, necessidadeCodigoFiname: value })}
                    />
                    <SelectInput
                      label={'FORMA DE PAGAMENTO'}
                      editable={editor}
                      options={
                        dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)'
                          ? [
                              {
                                label: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                                value: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                              },
                              {
                                label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                                value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                              },
                              {
                                label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                                value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                              },
                              {
                                label: 'NÃO DEFINIDO',
                                value: 'NÃO DEFINIDO',
                              },
                            ]
                          : [
                              {
                                label: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                                value: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                              },
                              {
                                label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                                value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                              },
                              {
                                label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                                value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                              },
                              {
                                label: 'NÃO DEFINIDO',
                                value: 'NÃO DEFINIDO',
                              },
                            ]
                      }
                      value={dados.formaDePagamento}
                      handleChange={(value) => setDados({ ...dados, formaDePagamento: value })}
                    />
                  </div>
                  <div className="mt-2 flex w-full flex-col items-center self-center px-2">
                    <span className="text-center font-raleway text-sm font-bold uppercase">DESCRIÇÃO DA NEGOCIAÇÃO</span>
                    <textarea
                      readOnly={!editor}
                      placeholder={'Descreva aqui a negociação'}
                      value={dados.descricaoNegociacao}
                      className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          descricaoNegociacao: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    DISTRIBUIÇÃO DE CRÉDITOS
                  </span>
                  <div className="mt-2 flex justify-center">
                    <SelectInput
                      label={'POSSUI DISTRIBUIÇÕES DE CRÉDITOS?'}
                      editable={editor}
                      value={dados.possuiDistribuicao}
                      options={[
                        {
                          label: 'NÃO',
                          value: 'NÃO',
                        },
                        {
                          label: 'SIM',
                          value: 'SIM',
                        },
                      ]}
                      handleChange={(value) => setDados({ ...dados, possuiDistribuicao: value })}
                    />
                  </div>
                  {dados.possuiDistribuicao == 'SIM' && (
                    <>
                      <div className="mt-2 flex flex-col gap-2">
                        <h1 className="text-center font-raleway font-bold">ADICIONAR DISTRIBUIÇÃO:</h1>
                        <div className="flex flex-col items-center justify-around lg:flex-row">
                          <div className="flex flex-col items-center">
                            <span className="text-center font-raleway text-sm font-bold uppercase">Nº DA INSTALAÇÃO</span>
                            <input
                              className={`text-center text-xs text-gray-600 outline-none`}
                              value={dadosDistribuicao.numInstalacao}
                              placeholder={'INFORMAÇÃO A PREENCHER...'}
                              onChange={(e) =>
                                setDadosDistribuicao({
                                  ...dadosDistribuicao,
                                  numInstalacao: e.target.value,
                                })
                              }
                              type="text"
                            />
                          </div>
                          <NumberInput
                            label={'% EXCEDENTE'}
                            editable={editor}
                            value={dadosDistribuicao.excedente}
                            handleChange={(value) =>
                              setDadosDistribuicao({
                                ...dadosDistribuicao,
                                excedente: Number(value),
                              })
                            }
                            unit={'%'}
                          />
                          <button onClick={adicionarDistribuicao} className="rounded bg-[#fead61] p-1 font-bold hover:bg-[#15599a] hover:text-white">
                            ADICIONAR
                          </button>
                        </div>
                      </div>
                      {dados.distribuicoes?.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2">
                          {dados.distribuicoes.map((distribuicao, index) => (
                            <div key={index} className="flex flex-wrap justify-around">
                              <p className="text-sm font-bold text-gray-600 ">INSTALAÇÃO Nº{distribuicao.numInstalacao}</p>
                              <p className="text-sm font-bold text-gray-600">{distribuicao.excedente}%</p>
                              <button
                                onClick={() => {
                                  let distribuicoes = dados.distribuicoes
                                  distribuicoes.splice(index, 1)
                                  setDados({
                                    ...dados,
                                    distribuicoes: distribuicoes,
                                  })
                                }}
                                className="rounded bg-red-500 p-1"
                              >
                                <FiDelete />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                {dados.links?.length > 0 ? (
                  <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                    <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">DOCUMENTAÇÃO</span>
                    <div className="flex flex-col items-center gap-2">
                      {dados.links.map((x, index) => (
                        <FileLinkBlock key={index} obj={x} deleteFile={(obj) => deleteFile(obj)} />
                      ))}
                    </div>
                    {fileMsg.text ? (
                      <p className={`text-center italic ${fileMsg.color} my-1 h-[10px] text-xs`}>{fileMsg.text}</p>
                    ) : (
                      <div className="my-1 h-[10px]"></div>
                    )}
                    <div className="mt-2 flex w-full flex-col items-center">
                      <h1 className="text-sm font-medium text-[#fead61]">ANEXO DE ARQUIVOS</h1>
                      <div className="relative mt-2 flex h-fit w-full items-center justify-center self-center rounded-lg border-2 border-dotted border-blue-700 bg-gray-100 p-2 lg:w-[450px]">
                        <div className="absolute">
                          {image ? (
                            <div className="flex flex-col items-center">
                              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                              <span className="block text-center font-normal text-gray-400">
                                {image.length == 1 ? image[0].name : `${image[0].name}...`}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                              <span className="block font-normal text-gray-400">Adicione o arquivo aqui</span>
                            </div>
                          )}
                        </div>
                        <input
                          onChange={(e) => setImage(e.target.files)}
                          className="h-full w-full opacity-0"
                          multiple={true}
                          type="file"
                          accept=".png, .jpeg, .jpg, .pdf, .docx, .doc"
                        />
                      </div>
                      <input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value.toUpperCase())}
                        placeholder="Dê um nome para identificação do arquivo."
                        className="mt-2 w-full border border-gray-200 p-2 outline-none lg:w-[450px]"
                      />
                      <button onClick={uploadFiles} className="mt-2 rounded bg-blue-400 p-2 font-bold text-white hover:bg-blue-700">
                        ANEXAR
                      </button>
                    </div>
                  </div>
                ) : (
                  false
                )}
                {dados.linksVisita?.length > 0 ? (
                  <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                    <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                      ARQUIVOS VISITA TÉCNICA
                    </span>
                    <div className="flex flex-col items-center gap-2">
                      {dados.linksVisita.map((x, index) => (
                        <div key={index} className="flex items-center gap-x-2">
                          <a className="text-blue-300" href={x.link}>
                            {x.title}
                            {x.format ? ` - ${x.format}` : false}
                          </a>
                          <AiOutlineCheck style={{ color: '#49be25', fontSize: '18px' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                    <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                      VINCULAR VISITA TÉCNICA
                    </span>
                    <div className="flex flex-col items-center">
                      <TextInput
                        normalCase={true}
                        label={'ID DA VISITA TÉCNICA'}
                        editable={true}
                        value={idVisitaTecnica}
                        handleChange={(value) => setIdVisitaTecnica(value)}
                      />
                      <button
                        onClick={vinculateVisitaTecnica}
                        className="mt-4 rounded border-2 border-[#fead61] p-1 text-xs font-bold text-[#fead61] transition duration-300 ease-in-out hover:scale-105 hover:bg-[#fead61] hover:text-black "
                      >
                        VINCULAR VISITA TÉCNICA
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
                    DADOS ADICIONAIS PARA APROVAÇÃO DO FORMULÁRIO
                  </span>
                  <div className="flex flex-wrap justify-around gap-2">
                    <TextInput
                      label={'Nome do Projeto'}
                      value={dados.nomeDoProjeto ? dados.nomeDoProjeto : ''}
                      editable={editor}
                      handleChange={(value) => {
                        setDados({ ...dados, nomeDoProjeto: value })
                      }}
                    />
                    <SelectInput
                      label={'TIPO DE SERVIÇO'}
                      editable={editor}
                      options={tiposDeServico.map((tipo) => {
                        return { label: tipo.label, value: tipo.value }
                      })}
                      value={dados.tipoDeServico ? dados.tipoDeServico : 'SISTEMA FOTOVOLTAICO'}
                      handleChange={(value) => setDados({ ...dados, tipoDeServico: value })}
                    />
                    <CheckboxInput
                      title={'REALIZAR HOMOLOGAÇÃO'}
                      labelTrue={'SIM'}
                      labelFalse={'NÃO'}
                      checked={dados.realizarHomologacao}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          realizarHomologacao: value,
                        })
                      }
                    />
                    <SelectInput
                      label={'Regional'}
                      editable={editor}
                      value={dados.regional ? dados.regional : 'NÃO DEFINIDO'}
                      options={[
                        {
                          label: 'REGIONAL ITUIUTABA',
                          value: 'REGIONAL ITUIUTABA',
                        },
                        {
                          label: 'REGIONAL UBERLÂNDIA',
                          value: 'REGIONAL UBERLÂNDIA',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      handleChange={(value) => {
                        setDados({ ...dados, regional: value })
                      }}
                    />
                    <TextInput
                      label={'LINK PASTA NA NUVEM'}
                      normalCase={true}
                      editable={editor}
                      value={dados.linkDrive ? dados.linkDrive : ''}
                      handleChange={(value) => {
                        setDados({ ...dados, linkDrive: value })
                      }}
                    />
                    <NumberInput
                      tag={'R$'}
                      label={'Previsão de custos em insumos'}
                      editable={editor}
                      value={dados.previsaoCustos ? dados.previsaoCustos : 0}
                      handleChange={(value) => {
                        setDados({ ...dados, previsaoCustos: Number(value) })
                      }}
                    />
                    <SelectInput
                      label={'TIPO DO KIT'}
                      value={dados.tipoDoKit ? dados.tipoDoKit : 'NÃO DEFINIDO'}
                      editable={editor}
                      options={[
                        {
                          label: 'NORMAL',
                          value: 'NORMAL',
                        },
                        {
                          label: 'PROMO',
                          value: 'PROMO',
                        },
                        {
                          label: 'NÃO SE APLICA',
                          value: 'NÃO SE APLICA',
                        },
                        {
                          label: 'NÃO DEFINIDO',
                          value: 'NÃO DEFINIDO',
                        },
                      ]}
                      handleChange={(value) => {
                        setDados({ ...dados, tipoDoKit: value })
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap justify-around gap-2">
                    <CheckboxInput
                      title={'VISITA TÉCNICA'}
                      labelTrue={'REALIZADA'}
                      labelFalse={'PENDÊNCIA'}
                      checked={dados.visitaTecnica == 'REALIZADA'}
                      handleChange={(value) =>
                        setDados({
                          ...dados,
                          visitaTecnica: value ? 'REALIZADA' : 'PENDÊNCIA',
                        })
                      }
                    />
                    {/* <div>
                      <input
                        disabled={!editor}
                        checked={
                          dados.visitaTecnica == "REALIZADA" ? true : false
                        }
                        onChange={(e) => {
                          setDados({
                            ...dados,
                            visitaTecnica: e.target.checked
                              ? "REALIZADA"
                              : "PENDÊNCIA",
                          });
                        }}
                        type="checkbox"
                        name="visitaTecnica"
                        id="visitaTecnica"
                      />
                      <label className="ml-2" htmlFor="visitaTecnica">
                        VISITA TÉCNICA REALIZADA ?
                      </label>
                    </div> */}
                    <SelectInput
                      label={'Laudo'}
                      value={dados.laudo ? dados.laudo : 'NÃO DEFINIDO'}
                      editable={editor}
                      options={[
                        { label: 'EM ESTUDO', value: 'EM ESTUDO' },
                        { label: 'EMITIDO', value: 'EMITIDO' },
                        { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
                      ]}
                      handleChange={(value) => {
                        setDados({ ...dados, laudo: value })
                      }}
                    />
                    <TextInput
                      label={'TÉCNICO RESPONSÁVEL'}
                      editable={editor}
                      value={dados.respVisitaTecnica}
                      handleChange={(value) => {
                        setDados({
                          ...dados,
                          respVisitaTecnica: value.toUpperCase(),
                        })
                      }}
                    />
                    <TextInput
                      label={'Tipo da telha'}
                      editable={editor}
                      value={dados.tipoDaTelha}
                      handleChange={(value) => {
                        setDados({ ...dados, tipoDaTelha: value })
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
                  <div className="mt-2 flex w-full flex-col items-center self-center px-2">
                    <span className="text-center font-raleway text-sm font-bold uppercase">COMENTÁRIOS AO VENDEDOR</span>
                    <textarea
                      readOnly={!editor}
                      placeholder={'Comentários aqui..'}
                      value={dados.comentariosAoVendedor}
                      className="h-[80px] w-full resize-none border border-gray-600 bg-gray-200 p-2 text-center outline-none"
                      onChange={(e) =>
                        setDados({
                          ...dados,
                          comentariosAoVendedor: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>
                {creationMsg.text && <p className={`text-center italic ${creationMsg.color}`}>{creationMsg.text}</p>}
                {emailMsg.text && <p className={`text-center italic ${emailMsg.color} mt-2`}>{emailMsg.text}</p>}
                {editor && !dados.aprovacao && (
                  <div className="flex w-full items-center justify-around">
                    <div className="flex w-full justify-center">
                      <button onClick={validateCreation} className="rounded bg-[#fead61] p-2 font-bold hover:bg-[#15599a] hover:text-white">
                        ADICIONAR PROJETO
                      </button>
                    </div>
                    <div className="flex w-full justify-center">
                      <button onClick={rejectSolicitacao} className="rounded bg-red-300 p-2 font-bold text-white hover:bg-red-500">
                        REJEITAR SOLICITAÇÃO
                      </button>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalFormSolicitacao
