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

import { equipesTecnicas, serviceOrdersCategories, tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from '../../../utils/constants'
import { useQueryClient } from 'react-query'
import { TProjectDTO } from '@/utils/schemas/projects'
import { Session } from 'next-auth'
import { TServiceOrder, TServiceOrderDTO } from '@/utils/schemas/service-order'
import { getServiceObservationsFromObras } from '@/utils/methods/util/service-order'
import ObservationModalBlock from './ObservationModalBlock'
import CheckboxInput from '@/components/inputs/Checkbox'
function getEquipmentList({ str, category }: { str: string; category: string }) {
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
function getInverterInfoByStr(str: string) {
  const regexInverterQty = /^(\d{1,3})x/i
  const regexInverterModel = /x([^()]+)/
  const regexInverterPower = /\((\d+)W\)/
  const x = regexInverterQty.exec(str)
  const inverterQty = regexInverterQty.exec(str) ? (regexInverterQty.exec(str) as RegExpExecArray)[0]?.slice(0, -1) : null
  const inverterModel = regexInverterModel.exec(str) ? (regexInverterModel.exec(str) as RegExpExecArray)[0].substring(1) : null
  const inverterPower = regexInverterPower.exec(str)
    ? (regexInverterPower.exec(str) as RegExpExecArray)[0].replace('(', '').replace(')', '').replace('W', '')
    : null
  return {
    modelo: inverterModel,
    qtde: Number(inverterQty) || 0,
    potencia: inverterPower,
  }
}

type ModalNewServiceOrderProps = {
  project: TProjectDTO
  categories: { label: string; value: string }[]
  closeModal: () => void
  session: Session
}
function ModalNewServiceOrder({ project, categories, closeModal, session }: ModalNewServiceOrderProps) {
  const queryClient = useQueryClient()
  const [osInfo, setOsInfo] = useState<TServiceOrder>({
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
      cep: project.cep.toString(),
      uf: project.uf,
      cidade: project.cidade,
      bairro: project.bairro,
      endereco: project.logradouro,
      numeroOuIdentificador: project.numeroResidencia.toString() || '',
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
      nome: session.user.nome,
      avatar_url: session?.user.avatar_url,
    },
    equipamentos: {
      modulos: {
        modelo: '',
        qtde: project.sistema?.qtdeModulos,
        potencia: project.sistema?.potModulos?.toString(),
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
    observacoes: getServiceObservationsFromObras(project.obra.observacoes),
    dataInsercao: new Date().toISOString(),
  })
  async function handleOrderCreation() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const resp = await createServiceOrder({ info: osInfo, queryClient, invalidateKey: ['project-service-orders', project._id] })
      toast.dismiss(loadingToastId)
      toast.success(resp || 'Ordem criada com sucesso !')
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(equipesTecnicas)
      toast.error(msg)
    }
  }
  function useKitInformation() {
    setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, disponivel: getEquipmentList({ str: project.compra?.kitInfo || '', category: 'MONTAGEM' }) },
    }))
  }
  function useMissingMaterialInformation() {
    setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, retirada: getEquipmentList({ str: project.material?.materialFaltante || '', category: 'MONTAGEM' }) },
    }))
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]"
      >
        <div className="flex h-full w-full flex-col">
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
          <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden overscroll-y-auto px-2 py-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="flex w-full items-center justify-center gap-2">
              <h1 className="text-xs font-bold text-gray-800 ">AUTOR</h1>
              <div className="h-full w-[1px] bg-gray-500"></div>
              <div className="flex items-center justify-center  gap-2">
                <Avatar fallback={'U'} height={25} width={25} url={osInfo?.autor?.avatar_url} />
                <p className="text-xs font-medium text-gray-500">{osInfo?.autor?.nome || 'Autor não identificado'}</p>
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
              <div className="flex items-center gap-2 text-gray-800">
                <FaUser size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">{osInfo?.favorecido?.nome || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-800">
                <AiFillPhone size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">{osInfo?.favorecido?.contato || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
              <div className="flex items-center gap-2">
                <FaCity size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">
                  {osInfo?.localizacao ? `${osInfo?.localizacao.cidade} - ${osInfo?.localizacao.uf} ` : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">
                  {osInfo?.localizacao
                    ? `${osInfo?.localizacao.endereco}, Nº ${osInfo?.localizacao.numeroOuIdentificador}, ${osInfo?.localizacao.bairro} - ${osInfo?.localizacao.cep}`
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-[25%]">
                <Select
                  label={'CATEGORIA'}
                  value={osInfo.categoria}
                  options={(categories || serviceOrdersCategories).map((c, index) => ({
                    id: index + 1,
                    label: c.label,
                    value: c.value as TServiceOrder['categoria'],
                  }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setOsInfo((prev) => ({ ...prev, categoria: value }))}
                  onReset={() => setOsInfo((prev) => ({ ...prev, categoria: 'OUTROS' }))}
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
                  onReset={() => setOsInfo((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: 'EXTERNO' } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-[25%]">
                {osInfo.responsavel.tipo == 'EXTERNO' ? (
                  <Text
                    label={'NOME DO RESPONSÁVEL'}
                    placeholder={'Preencha o nome do responsável pela execução...'}
                    value={osInfo.responsavel.nome || ''}
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
                    onReset={() => setOsInfo((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: '' } }))}
                    width={'100%'}
                  />
                )}
              </div>
            </div>
            <ObservationModalBlock
              infoHolder={osInfo as TServiceOrderDTO}
              setInfoHolder={setOsInfo as React.Dispatch<React.SetStateAction<TServiceOrderDTO>>}
            />

            <div className="flex w-full items-center justify-center">
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
                  onReset={() => setOsInfo((prev) => ({ ...prev, urgencia: 'NÃO DEFINIDO' }))}
                  width={'100%'}
                />
              </div>
            </div>
            <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">EQUIPAMENTOS</h1>
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <Text
                  label={'MODELO DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha o modelo dos inversores...'}
                  value={osInfo.equipamentos.inversor.modelo || ''}
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
                  value={osInfo.equipamentos.inversor.qtde || null}
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
                <Text
                  label={'POTÊNCIA DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha a potência dos inversores...'}
                  value={osInfo.equipamentos.inversor.potencia?.toString() || ''}
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
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <Text
                  label={'MODELO DOS MODULOS'}
                  placeholder={'Preencha o modelo dos módulos...'}
                  value={osInfo.equipamentos.modulos.modelo || ''}
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
                  value={osInfo.equipamentos.modulos.qtde || null}
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
                <Text
                  label={'POTÊNCIA DOS MODULOS'}
                  placeholder={'Preencha a potência dos módulos...'}
                  value={osInfo.equipamentos.modulos.potencia?.toString() || ''}
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
            <div className="mt-2 flex w-full flex-col items-start gap-2 lg:flex-row">
              <div className="h-full w-full lg:w-[50%]">
                <TakeMaterialsBlock osInfo={osInfo} setOsInfo={setOsInfo} useMissingMaterialInformation={useMissingMaterialInformation} />
              </div>
              <div className="h-full w-full lg:w-[50%]">
                <AvailableMaterialsBlock osInfo={osInfo} setOsInfo={setOsInfo} useKitInformation={useKitInformation} />
              </div>
            </div>
            <h1 className="mt-4 w-full rounded-md bg-gray-800 p-2 text-center font-bold text-white">DETALHES</h1>
            <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
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
                  onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: '' } }))}
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
                  onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: '' } }))}
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
                  onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: '' } }))}
                  width={'100%'}
                />
              </div>
            </div>
            {osInfo.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
              <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
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
                    value={osInfo.detalhes.senhaWifi || ''}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, senhaWifi: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="flex w-full justify-center lg:w-1/4">
                  <CheckboxInput
                    labelFalse={'NÃO CONFIGURAR'}
                    labelTrue={'CONFIGURAR'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={!!osInfo.detalhes.configuracaoMonitoramento}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, configuracaoMonitoramento: value } }))}
                  />
                </div>
                <div className="flex w-full justify-center lg:w-1/4">
                  <CheckboxInput
                    labelFalse={'NÃO POSSUI TRAFO'}
                    labelTrue={'POSSUI TRAFO'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={!!osInfo.detalhes.possuiTrafo}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, possuiTrafo: value } }))}
                  />
                </div>
              </div>
            ) : null}
            {osInfo.categoria == 'PADRÃO' ? (
              <div className="mt-2 flex w-full flex-col items-center gap-2 lg:flex-row">
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
                    onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: '' } }))}
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
                    onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: 'N/A' } }))}
                    width={'100%'}
                  />
                </div>
                <div className="flex w-full justify-center lg:w-1/4">
                  <Select
                    label={'AMPERAGEM DO PADRÃO'}
                    value={osInfo.detalhes.amperagemPadrao}
                    options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                    onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: '' } }))}
                    width={'100%'}
                  />
                </div>
                <div className="flex w-full justify-center lg:w-1/4">
                  <Select
                    label={'RESPONSABILIDADE DO PADRÃO'}
                    value={osInfo.detalhes.responsabilidadePadrao}
                    options={[
                      { id: 1, label: 'AMPERE', value: 'AMPERE' },
                      { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                      { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, responsabilidadePadrao: value } }))}
                    onReset={() => setOsInfo((prev) => ({ ...prev, detalhes: { ...prev.detalhes, responsabilidadePadrao: 'NÃO SE APLICA' } }))}
                    width={'100%'}
                  />
                </div>
              </div>
            ) : null}
            <div className="mt-2 flex w-full items-center justify-end border-t border-gray-200 py-1 px-4">
              <button
                onClick={() => handleOrderCreation()}
                className="py-1 font-bold text-green-500 duration-300 ease-in-out hover:scale-105 hover:text-green-500"
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
