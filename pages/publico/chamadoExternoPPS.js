import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '../../utils//images/logo-texto-azul-vertical.png'
import { fileTypes, formatCPFCpnj, formatToPhone, ppsTiposSolicitacao, tiposDeEstruturas, tiposEstruturaCRM, vendedores } from '../../utils/constants'
import { estadosECidades } from '../../utils/estados_cidades'
import SelectInput from '../../components/inputs/Select'
import NumberInput from '../../components/inputs/Number'
import TextInput from '../../components/inputs/Text'
import DateInput from '../../components/inputs/Date'
import Avatar from '../../components/utils/Avatar'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { getErrorMessage } from '../../utils/methods/handlers'
import { BsClipboardCheckFill } from 'react-icons/bs'
import { createCall } from '../../utils/methods/mutation/ppsCalls'
import ChargeMenu from '../../components/identificador/chamados/pps/ChargeMenu'
import AttachFile from '../../components/identificador/chamados/pps/AttachFile'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../utils/services/firebase/firebase-storage'
const initialInfoHolderState = {
  tipoSolicitacao: null,
  requerente: {
    idCRM: '',
    nomeCRM: '',
    apelido: null,
    avatar_url: '',
  },
  projeto: {
    id: null,
    nome: null,
    codigo: null,
  },
  premissas: {
    geracao: null,
    cargas: undefined,
    topologia: null,
    tipoEstrutura: null,
    valorFinanciamento: null,
  },
  cliente: {
    nome: '',
    tipo: '',
    telefone: '',
    cep: '',
    uf: null,
    cidade: null,
    bairro: '',
    endereco: '',
    numeroOuIdentificador: '',
    cpfCnpj: '',
    dataNascimento: null,
    email: '',
    renda: null,
    profissao: null,
  },
  observacoes: '',
}
const filesIdentifier = {
  comprovanteEndereco: 'COMPROVANTE DE ENDEREÇO',
  comprovanteRenda: 'COMPROVANTE DE RENDA',
  documentoPessoal: 'DOCUMENTO PESSOAL',
  cartaoCNPJ: 'CARTÃO CNPJ',
  contratoSocial: 'CONTRATO SOCIAL',
  declaracaoFaturamento: 'DECLARAÇÃO DE FATURAMENTO',
}
function ChamadoExternoPPS() {
  const [infoHolder, setInfoHolder] = useState(initialInfoHolderState)
  const [files, setFiles] = useState({})
  const [insertStatus, setInsertStatus] = useState(null)
  async function getProjectInCRM(code) {
    const loadingToastId = toast.loading('Buscando projeto...')
    try {
      var identifier = 'CRM-' + code
      const { data } = await axios.get(`/api/crm/projects?identifier=${identifier}`)
      const { _id, nome, identificador, cliente } = data
      setInfoHolder((prev) => ({
        ...prev,
        projeto: {
          id: _id,
          nome: nome,
          codigo: identificador,
        },
        cliente: {
          nome: cliente?.nome,
          telefone: cliente?.telefonePrimario,
          cep: cliente?.cep,
          uf: cliente?.uf,
          cidade: cliente?.cidade,
          bairro: cliente?.bairro,
          endereco: cliente?.endereco,
          numeroOuIdentificador: cliente?.numeroOuIdentificador,
          cpfCnpj: cliente?.cpfCnpj,
          dataNascimento: cliente?.dataNascimento,
          email: cliente?.email,
        },
      }))
      toast.dismiss(loadingToastId)
      toast.success('Projeto encontrado com sucesso.')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  function validateFields() {
    if (!infoHolder.requerente.apelido) {
      toast.error('Preencha o nome do vendedor/requerente.')
      return false
    }
    if (!infoHolder.tipoSolicitacao) {
      toast.error('Preencha o tipo de solicitação desejada.')
      return false
    }
    if (infoHolder.tipoSolicitacao == 'DUVIDAS E AUXILIOS TÉCNICOS') {
      if (infoHolder.observacoes.trim().length < 5) {
        toast.error('Preencha a dúvida/questionamento/demanda no campo de observações.')
        return false
      }
    }
    if (infoHolder.tipoSolicitacao == 'PROPOSTA COMERCIAL (ON GRID)') {
      if (!infoHolder.projeto.id) {
        toast.error('Vincule um projeto do CRM para requisitar uma proposta comercial.')
        return false
      }
      if (!infoHolder.premissas.geracao || infoHolder.premissas.geracao <= 0) {
        toast.error('Preencha uma geração válida para requisitar uma proposta comercial.')
        return false
      }
      if (!infoHolder.premissas.tipoEstrutura) {
        toast.error('Preencha o tipo de estrutura para requisitar uma proposta comercial.')
        return false
      }
      if (!infoHolder.premissas.topologia) {
        toast.error('Preencha a topologia desejada para requisitar uma proposta comercial.')
        return false
      }
    }
    if (infoHolder.tipoSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)') {
      if (!infoHolder.premissas.cargas || infoHolder.premissas.cargas?.length == 0) {
        toast.error('Adicione cargas para requisitar uma proposta comercial OFF GRID.')
        return false
      }
    }
    if (infoHolder.tipoSolicitacao == 'ANÁLISE DE CRÉDITO') {
      if (infoHolder.cliente.cpfCnpj.length < 14) {
        toast.error('Preencha um CPF/CNPJ válido.')
        return false
      }
      if (!infoHolder.premissas.valorFinanciamento) {
        toast.error('Preencha o valor a ser financiado.')
        return false
      }
      if (!infoHolder.cliente.renda || infoHolder.cliente.renda <= 0) {
        toast.error('Preencha a renda mensal média do cliente.')
        return false
      }
      if (!infoHolder.cliente.profissao) {
        toast.error('Preencha a profissão do cliente.')
        return false
      }
      const isCPF = infoHolder.cliente.cpfCnpj.length == 14
      const isCNPJ = infoHolder.cliente.cpfCnpj.length == 18
      if (!files.comprovanteEndereco) {
        toast.error('Anexe um arquivo de comprovante de endereço.')
        return false
      }
      if (!files.comprovanteRenda) {
        toast.error('Anexe um arquivo de comprovante de renda do cliente ou representante legal.')
        return false
      }
      if (!files.documentoPessoal) {
        toast.error('Anexe um arquivo de documento pessoal do cliente ou representante legal.')
        return false
      }
      if (isCNPJ) {
        if (!files.cartaoCNPJ) {
          toast.error('Anexe o cartão CNPJ.')
          return false
        }
        if (!files.contratoSocial) {
          toast.error('Anexe o arquivo do contrato social.')
          return false
        }
        if (!files.declaracaoFaturamento) {
          toast.error('Anexe uma declaração de faturamento da empresa do cliente.')
          return false
        }
      }
    }
    return true
  }
  async function uploadFiles() {
    if (!files) {
      return
    }
    var links = []
    const uploadPromises = Object.keys(files).map(async (key) => {
      const file = files[key]
      const storageStr = `chamadosPPS/${infoHolder.cliente.nome}/${filesIdentifier[key]}`
      const fileRef = ref(storage, storageStr)
      const firebaseUploadResponse = await uploadBytes(fileRef, file)
      const fileUrl = await getDownloadURL(ref(storage, firebaseUploadResponse.metadata.fullPath))
      const linkObj = {
        title: filesIdentifier[key],
        link: fileUrl,
        format: fileTypes[firebaseUploadResponse.metadata.contentType]?.title || 'NÃO DEFINIDO',
      }
      links.push(linkObj)
    })
    await Promise.all(uploadPromises)
    setInfoHolder((prev) => ({ ...prev, links: links }))
    console.log('LINKS', links)
    return links
  }
  async function handleCallCreation() {
    if (!validateFields()) return
    const loadingToastId = toast.loading('Carregando...')
    setInsertStatus('loading')
    try {
      const links = await uploadFiles()
      const response = await createCall({ info: { ...infoHolder, links } })
      toast.dismiss(loadingToastId)
      toast.success(response)
      setInsertStatus('success')
      setInfoHolder(initialInfoHolderState)
      setFiles({})
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  // Charges
  function addCharge(charge) {
    const { descricao, qtde, horasFuncionamento, potencia } = charge
    var chargesArr = [...(infoHolder.premissas.cargas || [])]
    chargesArr.push({ descricao, qtde, horasFuncionamento, potencia })
    setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, cargas: chargesArr } }))
    toast.success('Carga adicionada !')
    return
  }
  function removeCharge(index) {
    var chargesArr = [...(infoHolder.premissas.cargas || [])]
    chargesArr.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, cargas: chargesArr } }))
    toast.success('Carga removida!')
    return
  }
  if (insertStatus == 'success')
    return (
      <div className="flex w-full h-full grow flex-col items-center justify-center gap-4">
        <BsClipboardCheckFill style={{ color: 'rgb(34,197,94)', fontSize: '60px' }} />
        <h1 className="text-lg font-medium italic text-gray-600">Solicitação criada com sucesso !</h1>
        <button onClick={() => setInsertStatus(null)} className="text-sm text-blue-500 hover:text-cyan-500 font-bold tracking-tight  font-raleway">
          ABRIR NOVO CHAMADO
        </button>
      </div>
    )

  return (
    <div className="flex h-full flex-col bg-[#fff] ">
      <div className="flex items-center justify-center w-full bg-[#15599a] rounded-b py-2 px-2 pb-2 text-lg">
        <h3 className="text-xl font-bold text-white ">NOVO CHAMADO</h3>
      </div>
      <div className="flex grow flex-col w-full">
        {/* <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar fallback={'U'} height={25} width={25} url={session?.user.image} />
                <p className="text-xs font-medium text-gray-500">{session?.user.name}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <BsCalendarFill />
                <p className="text-xs font-medium">{dayjs().format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div> */}
        <div className="self-center w-full lg:w-[50%] mt-4">
          <SelectInput
            label="VENDEDOR"
            labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
            value={infoHolder.requerente.apelido}
            options={vendedores.map((seller, index) => ({ id: index + 1, label: seller.nome, value: seller.nome }))}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, requerente: { ...prev.requerente, apelido: value } }))}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => setInfoHolder((prev) => ({ ...prev, requerente: { ...prev.requerente, apelido: null } }))}
            width="100%"
          />
        </div>

        <h1 className="mt-4 w-full  bg-gray-800 p-2 text-center font-bold text-white">TIPO DE SOLICITAÇÃO</h1>
        <SelectInput
          label="TIPO DE SOLICITAÇÃO"
          showLabel={false}
          value={infoHolder.tipoSolicitacao}
          options={ppsTiposSolicitacao.map((type, index) => ({ id: index + 1, label: type.label, value: type.value }))}
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoSolicitacao: value }))}
          selectedItemLabel="NÃO DEFINIDO"
          onReset={() => setInfoHolder((prev) => ({ ...prev, tipoSolicitacao: null }))}
          width="100%"
        />
        <h1 className="mt-4 w-full  bg-gray-800 p-2 text-center font-bold text-white">ANOTAÇÕES</h1>
        <textarea
          value={infoHolder.observacoes}
          onChange={(e) => setInfoHolder((prev) => ({ ...prev, observacoes: e.target.value }))}
          placeholder="Preencha aqui as observações do chamado ou dúvidas."
          className="h-fit min-h-[100px] grow resize-none bg-gray-200 p-3 text-center text-sm outline-none scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 placeholder:italic"
        />
        {infoHolder.projeto ? (
          <>
            <h1 className="mt-4 w-full  bg-gray-800 p-2 text-center font-bold text-white">PROJETO</h1>
            <div className="mt-2 flex flex-col items-center gap-1 px-2">
              {infoHolder.projeto.id ? (
                <div className="flex flex-col items-center gap-1">
                  <p className="w-full text-center font-Raleway font-bold text-[#fead41]">#{infoHolder.projeto.codigo}</p>
                  <h1 className="w-full text-center font-Raleway text-xl font-bold leading-none tracking-tight">{infoHolder.projeto.nome}</h1>
                </div>
              ) : (
                <>
                  <p className="w-full lg:w-[60%] text-center italic text-gray-500 text-sm">
                    Lembrando que o código em questão é o código identificador de projeto no CRM, sendo esse o número que acompanha o padrão:
                  </p>
                  <h1 className="text-gray-500 text-sm mb-2">
                    <strong>CRM</strong>-<strong className="text-[#fead41]">(NÚMERO AQUI)</strong>
                  </h1>
                  <div className="flex items-end gap-2">
                    <NumberInput
                      label={'CÓDIGO IDENTIFICADOR DO PROJETO'}
                      labelClassName="text-center text-gray-500 font-bold font-raleway text-sm lg:text-base"
                      value={infoHolder.projeto.codigo}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, projeto: { ...prev.projeto, codigo: value } }))}
                      placeholder={'Preencha aqui o código do projeto...'}
                    />
                    <button
                      onClick={() => getProjectInCRM(infoHolder.projeto.codigo)}
                      className="p-3 h-[46px] rounded w-fit border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold duration-300 ease-in-out"
                    >
                      PESQUISAR
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : null}
        <h1 className="mt-4 w-full  bg-gray-800 p-2 text-center font-bold text-white">CLIENTE</h1>
        <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="NOME DO CLIENTE"
              value={infoHolder?.cliente.nome || ''}
              placeholder="Preencha aqui o nome do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, nome: value } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="CPF/CNPJ DO CLIENTE"
              value={infoHolder?.cliente.cpfCnpj || ''}
              placeholder="Preencha aqui o CPF ou CNPJ do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, cpfCnpj: formatCPFCpnj(value) } }))}
              width="100%"
            />
          </div>
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="TELEFONE"
              value={infoHolder?.cliente.telefone || ''}
              placeholder="Preencha aqui o telefone do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, telefone: formatToPhone(value) } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="EMAIL"
              value={infoHolder?.cliente.email || ''}
              placeholder="Preencha aqui o email do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, email: value } }))}
              width="100%"
            />
          </div>
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
          <div className="w-full lg:w-[50%]">
            <SelectInput
              label={'ESTADO'}
              selectedItemLabel="NÃO DEFINIDO"
              value={infoHolder.cliente.uf}
              options={Object.keys(estadosECidades).map((state, index) => ({
                id: index + 1,
                label: state,
                value: state,
              }))}
              handleChange={(value) => {
                console.log(value)
                setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, uf: value } }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, uf: null } }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[50%]">
            <SelectInput
              selectedItemLabel={'NÃO DEFINIDO'}
              label="CIDADE"
              value={infoHolder.cliente.cidade}
              options={
                infoHolder.cliente.uf
                  ? estadosECidades[infoHolder.cliente.uf].map((city, index) => {
                      return {
                        id: index,
                        value: city,
                        label: city,
                      }
                    })
                  : null
              }
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, cidade: value } }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, cidade: null } }))
              }}
              width="100%"
            />
          </div>
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="BAIRRO"
              value={infoHolder?.cliente.bairro || ''}
              placeholder="Preencha aqui o bairro do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, bairro: value } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="LOGRADOURO"
              value={infoHolder?.cliente.endereco || ''}
              placeholder="Preencha aqui o endereco do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, endereco: value } }))}
              width="100%"
            />
          </div>
        </div>
        <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
          <div className="w-full lg:w-[50%]">
            <TextInput
              label="NÚMERO/IDENTIFICADOR"
              value={infoHolder?.cliente.numeroOuIdentificador || ''}
              placeholder="Preencha aqui o numero ou identificador do cliente"
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, numeroOuIdentificador: value } }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[50%]">
            <DateInput
              label="DATA DE NASCIMENTO"
              value={infoHolder?.cliente.dataNascimento || ''}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, dataNascimento: value } }))}
              width="100%"
            />
          </div>
        </div>
        {infoHolder.tipoSolicitacao == 'ANÁLISE DE CRÉDITO' ? (
          <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
            <div className="w-full lg:w-[50%]">
              <NumberInput
                label="RENDA DO CLIENTE"
                value={infoHolder?.cliente.renda || 0}
                placeholder="Preencha aqui a renda do cliente"
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, renda: value } }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-[50%]">
              <TextInput
                label="PROFISSÃO"
                value={infoHolder?.cliente.profissao || ''}
                placeholder="Preencha aqui a profissão do cliente"
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cliente: { ...prev.cliente, profissao: value } }))}
                width="100%"
              />
            </div>
          </div>
        ) : null}
        <h1 className="mt-4 w-full  bg-gray-800 p-2 text-center font-bold text-white">PREMISSAS</h1>
        {infoHolder.tipoSolicitacao != 'ANÁLISE DE CRÉDITO' ? (
          <div className="mt-1 flex w-full flex-col items-center gap-2 lg:flex-row px-2">
            <div className="w-full lg:w-1/3">
              <NumberInput
                label="GERAÇÃO (kWh)"
                value={infoHolder?.premissas.geracao || 0}
                placeholder="Preencha aqui a geração desejada"
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, geracao: value } }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="TIPO DA ESTRUTURA"
                value={infoHolder?.premissas.tipoEstrutura || ''}
                options={tiposEstruturaCRM.map((type, index) => ({ id: index + 1, label: type.label, value: type.value }))}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    premissas: { ...prev.premissas, tipoEstrutura: value },
                  }))
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, tipoEstrutura: null } }))}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="TOPOLOGIA"
                value={infoHolder?.premissas.topologia || ''}
                options={[
                  { id: 1, label: 'MICRO-INVERSOR', value: 'MICRO-INVERSOR' },
                  { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
                ]}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, topologia: value } }))}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, topologia: null } }))}
                width="100%"
              />
            </div>
          </div>
        ) : null}
        {infoHolder.tipoSolicitacao == 'ANÁLISE DE CRÉDITO' ? (
          <div className="mt-1 flex w-full items-center justify-center gap-2 px-2">
            <div className="w-full lg:w-[50%]">
              <NumberInput
                label="VALOR DO FINANCIAMENTO"
                placeholder="Preencha o valor do financiamento..."
                value={infoHolder.premissas?.valorFinanciamento}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, premissas: { ...prev.premissas, valorFinanciamento: value } }))}
                width="100%"
              />
            </div>
          </div>
        ) : null}
        {infoHolder.tipoSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)' ? (
          <div className="w-full flex items-center justify-center px-2 mt-2">
            <ChargeMenu charges={infoHolder.premissas.cargas} addCharge={addCharge} removeCharge={removeCharge} />
          </div>
        ) : null}
        {/* {infoHolder.tipoSolicitacao == 'PROPOSTA COMERCIAL (OFF GRID)' ? (
          <ChargeMenu charges={infoHolder.premissas.cargas} addCharge={addCharge} removeCharge={removeCharge} />
        ) : null} */}
        {infoHolder.tipoSolicitacao == 'ANÁLISE DE CRÉDITO' ? (
          <AttachFile files={files} setFiles={setFiles} clientIdentifier={infoHolder.cliente.cpfCnpj || ''} />
        ) : null}
      </div>
      <div className="my-4 flex w-full items-center justify-center gap-4 px-4">
        <button
          onClick={() => handleCallCreation()}
          className="font-medium text-[#15599a] border border-[#15599a] hover:text-white hover:bg-[#15599a] p-2 rounded duration-300 ease-in-out hover:scale-110"
        >
          ABRIR CHAMADO
        </button>
      </div>
    </div>
  )
}

export default ChamadoExternoPPS
