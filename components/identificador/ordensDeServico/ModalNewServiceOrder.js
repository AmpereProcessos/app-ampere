import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { createServiceOrder } from '../../../utils/methods/mutation/serviceOrders'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { VscChromeClose } from 'react-icons/vsc'
import Avatar from '../../utils/Avatar'
import { FaCity, FaUser } from 'react-icons/fa'
import { AiFillPhone } from 'react-icons/ai'
import { MdLocationPin } from 'react-icons/md'
import Select from '../../inputs/Select'
import NumberInput from '../../inputs/Number'
import Text from '../../inputs/Text'
import TakeMaterialsBlock from './TakeMaterialsBlock'
import AvailableMaterialsBlock from './AvailableMaterialsBlock'
import CheckboxInput from '../../CheckboxInput'
import { equipesTecnicas, serviceOrdersCategories, tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from '../../../utils/constants'
import { useQueryClient } from 'react-query'
function getEquipmentList({ str, category }) {
  if (category != 'MONTAGEM') return null
  if (typeof str != 'string') return null
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    console.log(i, arr)
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]
    if (qty || desc)
      return {
        qtde: qty,
        descricao: desc,
      }
  })
  return formattedSpllited.filter((x) => !!x)
}
function getInverterInfoByStr(str) {
  const regexInverterQty = /^(\d{1,3})x/i
  const regexInverterModel = /x([^()]+)/
  const regexInverterPower = /\((\d+)W\)/
  const inverterQty = regexInverterQty.exec(str) ? regexInverterQty.exec(str)[0].slice(0, -1) : null
  const inverterModel = regexInverterModel.exec(str) ? regexInverterModel.exec(str)[0].substring(1) : null
  const inverterPower = regexInverterPower.exec(str) ? regexInverterPower.exec(str)[0].replace('(', '').replace(')', '').replace('W', '') : null
  return {
    modelo: inverterModel,
    qtde: inverterQty,
    potencia: inverterPower,
  }
}
function ModalNewServiceOrder({ project, categories, closeModal, session }) {
  const queryClient = useQueryClient()
  const [osInfo, setOsInfo] = useState({
    categoria: 'MONTAGEM',
    favorecido: {
      nome: project.nomeDoContrato || '',
      contato: project.telefone || '',
    },
    projeto: {
      id: project._id || null, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
      nome: project.nomeDoContrato || null, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
      identificador: project.qtde || null, // identificador QTDE do projeto no banco de projetos
      tipo: project.tipoDeServico || null, // tipo do projeto
    },
    descricao: '', // servico executado
    localizacao: {
      cep: project.cep,
      uf: project.uf,
      cidade: project.cidade,
      bairro: project.bairro,
      endereco: project.logradouro,
      numeroOuIdentificador: project.numeroResidencia,
    },
    responsavel: {
      nome: project.obra?.equipeResp || '',
      tipo: project.obra?.equipeResp ? 'INTERNO' : 'EXTERNO',
    },
    // configurar: false,
    urgencia: 'POUCO URGENTE',
    periodo: {
      inicio: null,
      fim: null,
    },
    pagamento: {
      recebedor: null,
      valor: null,
    },
    cobranca: {
      pagador: null,
      valor: null,
    },
    autor: {
      id: session?.user.id,
      nome: session?.user.name,
      avatar_url: session?.user.image,
    },
    equipamentos: {
      modulos: {
        modelo: '',
        qtde: project.sistema?.qtdeModulos,
        potencia: project.sistema?.potModulos,
      },
      inversor: getInverterInfoByStr(project.sistema?.inversor || ''),
      disponivel: null,
      retirada: null,
    },
    detalhes: {
      pontoAgua: '',
      senhaWifi: '',
      configuracaoMonitoramento: false,
      possuiTrafo: false,
      tipoEstrutura: project.estruturaPersonalizada?.tipo || null,
      tipoTelha: project.visitaTecnica?.tipoDaTelha || null,
      tipoPadrao: project.padrao?.tipo || null,
      tipoSaidaPadrao: project.visitaTecnica?.saidaDoCliente || null,
      amperagemPadrao: project.visitaTecnica?.amperagem || null,
      responsabilidadePadrao: project.padrao?.respInstalacao,
      topologia: project.sistema?.topologia,
    },
    observacoes: project.obra?.observacoes || '',
  })
  async function handleOrderCreation() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const resp = await createServiceOrder({ info: osInfo, queryClient, invalidateKey: ['project-service-orders', project._id] })
      toast.dismiss(loadingToastId)
      toast.success(resp)
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(equipesTecnicas)
      toast.error(msg)
    }
  }
  function useKitInformation() {
    setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, disponivel: getEquipmentList({ str: project.compra?.kitInfo, category: 'MONTAGEM' }) },
    }))
  }
  function useMissingMaterialInformation() {
    setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, retirada: getEquipmentList({ str: project.material?.materialFaltante, category: 'MONTAGEM' }) },
    }))
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]"
      >
        <div className="flex h-full flex-col w-full">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA ORDEM DE SERVIÇO</h3>
            <button
              onClick={closeModal}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex flex-col px-2 w-full h-full overflow-x-hidden overflow-y-auto overscroll-y-auto py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="flex items-center justify-center gap-2 w-full">
              <h1 className="font-bold text-gray-800 text-xs ">AUTOR</h1>
              <div className="h-full w-[1px] bg-gray-500"></div>
              <div className="flex items-center gap-2  justify-center">
                <Avatar fallback={'U'} height={25} width={25} url={osInfo?.autor?.avatar_url} />
                <p className="font-medium text-gray-500 text-xs">{osInfo?.autor?.nome || 'Autor não identificado'}</p>
              </div>
            </div>

            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
              <div className="flex gap-2 items-center text-gray-800">
                <FaUser size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">{osInfo?.favorecido?.nome || 'N/A'}</p>
              </div>
              <div className="flex gap-2 items-center text-gray-800">
                <AiFillPhone size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">{osInfo?.favorecido?.contato || 'N/A'}</p>
              </div>
            </div>
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
              <div className="flex gap-2 items-center">
                <FaCity size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {osInfo?.localizacao ? `${osInfo?.localizacao.cidade} - ${osInfo?.localizacao.uf} ` : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {osInfo?.localizacao
                    ? `${osInfo?.localizacao.endereco}, Nº ${osInfo?.localizacao.numeroOuIdentificador}, ${osInfo?.localizacao.bairro} - ${osInfo?.localizacao.cep}`
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-[25%]">
                <Select
                  label={'CATEGORIA'}
                  value={osInfo.categoria}
                  options={categories || serviceOrdersCategories}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, categoria: value }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-[25%]">
                <Text
                  label={'DESCRIÇÃO DO SERVIÇO'}
                  placeholder={'Preencha a descrição do serviço a ser executado...'}
                  value={osInfo.descricao}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, descricao: value }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-[25%]">
                <Select
                  label={'TIPO DE RESPONSÁVEL'}
                  value={osInfo.responsavel.tipo}
                  options={[
                    { id: 1, label: 'INTERNO', value: 'INTERNO' },
                    { id: 2, label: 'EXTERNO', value: 'EXTERNO' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-[25%]">
                {osInfo.responsavel.tipo == 'EXTERNO' ? (
                  <Text
                    label={'NOME DO RESPONSÁVEL'}
                    placeholder={'Preencha o nome do responsável pela execução...'}
                    value={osInfo.responsavel.nome}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                    width={'100%'}
                  />
                ) : (
                  <Select
                    label={'NOME DE RESPONSÁVEL'}
                    value={osInfo.responsavel.nome}
                    options={equipesTecnicas.map((team, index) => ({ ...team, id: index + 1 }))}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
                    width={'100%'}
                  />
                )}
              </div>
            </div>
            <label className={'font-sans font-bold  text-[#353432] mt-2'}>OBSERVAÇÕES</label>
            <textarea
              value={osInfo.observacoes}
              onChange={(e) => setOsInfo((prev) => ({ ...prev, observacoes: e.target.value }))}
              className="w-full resize-none min-h-[100px] bg-gray-200 text-sm border border-gray-500 rounded-md outline-none p-4"
            />
            <div className="w-full flex items-center justify-center">
              <div className="w-full lg:w-1/2">
                <Select
                  label={'URGÊNCIA'}
                  value={osInfo.urgencia}
                  options={[
                    { id: 1, label: 'POUCO URGENTE', value: 'POUCO URGENTE' },
                    { id: 2, label: 'URGENTE', value: 'URGENTE' },
                    { id: 3, label: 'EMERGÊNCIA', value: 'EMERGÊNCIA' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, urgencia: value }))}
                  width={'100%'}
                />
              </div>
            </div>
            <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">EQUIPAMENTOS</h1>
            <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-1/3">
                <Text
                  label={'MODELO DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha o modelo dos inversores...'}
                  value={osInfo.equipamentos.inversor.modelo}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, modelo: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'QTDE DE INVERSOR(ES)'}
                  placeholder={'Preencha a quantidade de inversores...'}
                  value={osInfo.equipamentos.inversor.qtde}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, qtde: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'POTÊNCIA DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha a potência dos inversores...'}
                  value={osInfo.equipamentos.inversor.potencia}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, potencia: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
            </div>
            <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-1/3">
                <Text
                  label={'MODELO DOS MODULOS'}
                  placeholder={'Preencha o modelo dos módulos...'}
                  value={osInfo.equipamentos.modulos.modelo}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, modelo: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'QTDE DE MODULOS'}
                  placeholder={'Preencha a quantidade de módulos...'}
                  value={osInfo.equipamentos.modulos.qtde}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, qtde: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'POTÊNCIA DOS MODULOS'}
                  placeholder={'Preencha a potência dos módulos...'}
                  value={osInfo.equipamentos.modulos.potencia}
                  handleChange={(value) =>
                    setOsInfo((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, potencia: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
            </div>
            <div className="flex w-full items-start gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-[50%] h-full">
                <TakeMaterialsBlock osInfo={osInfo} setOsInfo={setOsInfo} useMissingMaterialInformation={useMissingMaterialInformation} />
              </div>
              <div className="w-full lg:w-[50%] h-full">
                <AvailableMaterialsBlock osInfo={osInfo} setOsInfo={setOsInfo} useKitInformation={useKitInformation} />
              </div>
            </div>
            <h1 className="w-full p-2 rounded-md text-center text-white font-bold bg-gray-800 mt-4">DETALHES</h1>
            <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-1/3">
                <Select
                  label={'TOPOLOGIA'}
                  value={osInfo.detalhes.topologia}
                  options={[
                    { id: 1, label: 'MICRO', value: 'MICRO' },
                    { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <Select
                  label={'TIPO DE ESTRUTURA'}
                  value={osInfo.detalhes.tipoEstrutura}
                  options={tiposDeEstruturas.map((structure, index) => ({ ...structure, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <Select
                  label={'TIPO DE TELHA'}
                  value={osInfo.detalhes.tipoTelha}
                  options={tiposDeTelha.map((roofType, index) => ({ ...roofType, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: value } }))}
                  width={'100%'}
                />
              </div>
            </div>
            {osInfo.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
              <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
                <div className="w-full lg:w-1/4">
                  <Text
                    label={'PONTO DE ÁGUA'}
                    placeholder={'Localização do ponto de água...'}
                    value={osInfo.detalhes.pontoAgua}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, pontoAgua: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <Text
                    label={'SENHA DO WIFI'}
                    placeholder={'Senha do Wi-Fi do cliente...'}
                    value={osInfo.detalhes.senhaWifi}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, senhaWifi: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <CheckboxInput
                    labelFalse={'NÃO CONFIGURAR'}
                    labelTrue={'CONFIGURAR'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={osInfo.detalhes.configuracaoMonitoramento}
                    title={'CONFIGURAÇÃO DE MONITORAMENTO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, configuracaoMonitoramento: value } }))}
                    widthFit={true}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <CheckboxInput
                    labelFalse={'NÃO POSSUI TRAFO'}
                    labelTrue={'POSSUI TRAFO'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={osInfo.detalhes.possuiTrafo}
                    title={'SISTEMA COM TRAFO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, possuiTrafo: value } }))}
                    widthFit={true}
                  />
                </div>
              </div>
            ) : null}
            {osInfo.categoria == 'PADRÃO' ? (
              <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
                <div className="w-full lg:w-1/4">
                  <Select
                    label={'ENTRADA DO PADRÃO'}
                    value={osInfo.detalhes.tipoPadrao}
                    options={[
                      { id: 1, label: 'AEREO', value: 'AEREO' },
                      { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <Select
                    label={'SAÍDA DO PADRÃO'}
                    value={osInfo.detalhes.tipoSaidaPadrao}
                    options={[
                      { id: 1, label: 'AEREO', value: 'AEREO' },
                      { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <Select
                    label={'AMPERAGEM DO PADRÃO'}
                    value={osInfo.detalhes.amperagemPadrao}
                    options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <Select
                    label={'RESPONSABILIDADE DO PADRÃO'}
                    value={osInfo.detalhes.amperagemPadrao}
                    options={[
                      { id: 1, label: 'AMPERE', value: 'AMPERE' },
                      { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                      { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
              </div>
            ) : null}
            <div className="py-1 w-full flex items-center justify-end border-t border-gray-200 px-4 mt-2">
              <button
                onClick={() => handleOrderCreation()}
                className="text-green-500 font-bold py-1 hover:text-green-500 hover:scale-105 duration-300 ease-in-out"
              >
                CRIAR
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ModalNewServiceOrder
