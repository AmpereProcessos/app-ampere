import React, { useState } from 'react'
import axios from 'axios'
import createHttpError from 'http-errors'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Select from 'react-select'

import { VscChromeClose } from 'react-icons/vsc'

import { equipesTecnicas } from '../utils/constants'
import { useClients } from '../utils/methods/query/clients'
import { useMaterials } from '../utils/methods/query/materials'

import SelectInput from './inputs/Select'
import AddMaterialFormulario from './identificador/almoxarifado/AddMaterialFormulario'
import { debitMaterials } from '../utils/methods/mutation/materials'
import LoadingPage from './utils/LoadingPage'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '85%',
  height: '87%',
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
function NovoFormulario({ session, closeModal, invalidateQuery }) {
  const queryClient = useQueryClient()
  const [mutationStatus, setMutationStatus] = useState()
  // Getting data from database to enable integration with clients and materials
  const { data: clients, isFetching: clientsFetching } = useClients(!!session.user)
  const { data: materials, isFetching: materialsFetching } = useMaterials(!!session.user)
  const { mutate, isLoading } = useMutation({
    mutationKey: ['createWarehouseForm'],
    mutationFn: handleFormCreation,
  })
  const [callInfo, setCallInfo] = useState({
    idPai: null,
    codigoProjeto: null,
    nomeDoContrato: '',
    uso: 'CLIENTE',
    cidade: null,
    segmento: null,
    topologia: null,
    equipeResp: null,
    responsavel: 'A DEFINIR',
    servico: 'NÃO DEFINIDO',
    materiais: [],
  })

  const [materialMsg, setMaterialMsg] = useState('')

  function addMaterial(material) {
    const toAddObj = {
      nome: material.nome,
      id: material.id,
      qtdeSaida: material.qtdeSaida,
      grandeza: material.grandeza,
      precoUnit: material.precoUnit,
    }
    if (!material.nome) {
      toast.error('Prencha/escolha um item.')
      return false
    }
    if (toAddObj.qtdeSaida > material.qtdeEstoque) {
      toast.error(`Quantidade não permitida. Quantidade atual contabilizada no estoque é de ${material.qtdeEstoque}`)
      return false
    }
    if (material.qtdeSaida > 0) {
      let arr = callInfo.materiais
      let index = arr.findIndex((obj) => !!obj.id && obj.id == material.id)
      if (index != -1) {
        arr[index].qtdeSaida += material.qtdeSaida
        if (arr[index].qtdeSaida > material.qtdeEstoque) {
          console.log(arr[index].qtdeSaida)
          toast.error(`Quantidade não permitida. Quantidade atual contabilizada no estoque é de ${material.qtdeEstoque}`)
          arr[index].qtdeSaida -= material.qtdeSaida
          return false
        }
      } else {
        arr.push(toAddObj)
      }
      toast.success('Material adicionado com sucesso!', { duration: 500 })
      setCallInfo({ ...callInfo, materiais: arr })
      setMaterialMsg('')
      return true
    } else {
      setMaterialMsg('Quantidade inválida')
      return false
    }
  }
  function validateFields() {
    if (callInfo.nomeDoContrato?.trim().length < 3 && !callInfo.nomeTerceiro && callInfo.nomeTerceiro?.trim().length < 3) {
      toast.error('Nome do contrato/terceiro inválido')
      return false
    }
    if (callInfo.responsavel == 'A DEFINIR') {
      toast.error('Por favor, defina um responsável.')
      return false
    }
    if (callInfo.servico == 'NÃO DEFINIDO') {
      toast.error('Por favor, define o tipo de serviço.')
      return false
    }
    if (callInfo.materiais.length == 0) {
      toast.error('Por favor, adicione ao menos um material à lista.')
      return false
    }
    return true
  }
  async function updateReferenceProjectSeparationStatus(projectId) {
    const toastID = toast.loading('Atualizando status de separação do projeto...')
    try {
      await axios.post(`/api/projects/update/${projectId}`, {
        'material.statusSeparacao': 'SEPARADO',
      })
      toast.dismiss(toastID)
    } catch (error) {
      toast.dismiss(toastID)
      throw new createHttpError.InternalServerError('Erro ao atualizar projeto de referência.')
    }
  }
  async function createForm(info) {
    const toastID = toast.loading('Criando formulário...')
    try {
      const { data: createFormResponse } = await axios.post('/api/almoxarifado/formularios', {
        ...info,
        tipo: 'RETIRADA',
        abertura: new Date().toISOString(),
      })
      toast.dismiss(toastID)
      return createFormResponse.insertedId
    } catch (error) {
      toast.dismiss(toastID)
      throw new createHttpError.InternalServerError('Erro ao criar formulário.')
    }
  }
  async function handleFormCreation() {
    if (!validateFields()) return
    try {
      // Updating project with SEPARADO for statusSeparacao
      if (callInfo.idPai) {
        await updateReferenceProjectSeparationStatus(callInfo.idPai)
      }
      const insertedId = await createForm(callInfo)

      const debitMaterialsToastID = toast.loading('Debitando materiais do estoque...')
      await debitMaterials({
        formId: insertedId,
        projectId: callInfo.idPai,
        identifier: callInfo.nomeDoContrato ? callInfo.nomeDoContrato : callInfo.nomeTerceiro,
        changes: callInfo.materiais,
        tag: 'RETIRADA',
      })
      toast.dismiss(debitMaterialsToastID)

      // Resetting state of callInfo for next form
      setCallInfo({
        idPai: null,
        codigoProjeto: null,
        nomeDoContrato: '',
        cidade: null,
        segmento: null,
        topologia: null,
        equipeResp: null,
        responsavel: 'A DEFINIR',
        servico: 'NÃO DEFINIDO',
        materiais: [],
      })
      toast.success('Formulário criado com sucesso !')
      invalidateQuery()
    } catch (error) {
      if (createHttpError.isHttpError(error) && error.expose) toast.error(error.message)
      else toast.error('Erro no processo de criação do formulário.')
    }
  }
  console.log('FORM INFO', callInfo)
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex h-full flex-col">
            <div className="flex justify-between border-b border-gray-300 px-2 pb-2 text-lg">
              <h1 className="pl-6 font-bold uppercase text-[#15599a]">ABERTURA DE REQUISIÇÃO</h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    closeModal()
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            <div className="flex grow flex-col overflow-y-auto">
              <div className="mt-4 flex w-full items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <input
                    id="usoCliente"
                    name="usoCliente"
                    type={'checkbox'}
                    checked={callInfo.uso == 'CLIENTE'}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        uso: e.target.checked ? 'CLIENTE' : 'TERCEIRO',
                      }))
                    }
                  />
                  <label className="text-lg" htmlFor="usoCliente">
                    CLIENTE
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    id="usoTerceiro"
                    name="usoTerceiro"
                    type={'checkbox'}
                    checked={callInfo.uso == 'TERCEIRO'}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        uso: e.target.checked ? 'TERCEIRO' : 'CLIENTE',
                        idPai: null,
                        codigoProjeto: null,
                        nomeDoContrato: '',
                      }))
                    }
                  />
                  <label className="text-lg" htmlFor="usoTerceiro">
                    TERCEIRO
                  </label>
                </div>
              </div>
              {callInfo.uso == 'CLIENTE' ? (
                <div className="mt-2 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">CLIENTE</span>
                  <div className={'grow'}>
                    <Select
                      isMulti={false}
                      placeholder="NOME DO CLIENTE"
                      onChange={(e) =>
                        setCallInfo({
                          ...callInfo,
                          nomeDoContrato: e.value.nome,
                          idPai: e.value.id,
                          codigoProjeto: e.value.qtde,
                          cidade: e.value.cidade,
                          segmento: e.value.segmento,
                          topologia: e.value.topologia,
                          equipeResp: e.value.equipeResp,
                        })
                      }
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          width: '100%',
                          minHeight: '41px',
                        }),
                      }}
                      isLoading={clientsFetching}
                      options={clients?.map((cliente) => {
                        return {
                          label: `${cliente.qtde}-${cliente.nomeDoContrato}`,
                          value: {
                            id: cliente._id,
                            qtde: cliente.qtde,
                            nome: cliente.nomeDoContrato,
                            cidade: cliente.cidade ? cliente.cidade : '-',
                            segmento: cliente.segmento ? cliente.segmento : '-',
                            topologia: cliente.sistema.topologia ? cliente.sistema.topologia : '-',
                            equipeResp: cliente.obra.equipeResp ? cliente.obra.equipeResp : '-',
                          },
                        }
                      })}
                    />
                  </div>
                </div>
              ) : null}
              {callInfo.uso == 'TERCEIRO' ? (
                <div className="mt-2 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">TERCEIRO</span>
                  <input
                    value={callInfo.nomeTerceiro}
                    onChange={(e) =>
                      setCallInfo((prev) => ({
                        ...prev,
                        nomeTerceiro: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="Digite aqui o nome do terceiro..."
                    className="h-[41px] grow rounded-md border border-gray-300 p-1 text-center outline-none"
                  />
                </div>
              ) : null}
              <div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">RESPONSÁVEL</span>
                <select
                  value={callInfo.responsavel}
                  onChange={(e) => setCallInfo({ ...callInfo, responsavel: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-none lg:mt-0"
                >
                  <option value={'A DEFINIR'}>A DEFINIR</option>
                  <option value={'DANNIEL RODRIGUES'}>DANNIEL RODRIGUES</option>
                  <option value={'ALEX SANDRO'}>ALEX SANDRO</option>
                  <option value={'MATHEUS OLIVEIRA'}>MATHEUS OLIVEIRA</option>
                  <option value={'DIOGO PAULINO'}>DIOGO PAULINO</option>
                </select>
              </div>
              <div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row lg:items-center">
                <span className="text-center font-bold uppercase">EQUIPE RESP</span>
                <div className={'grow'}>
                  <SelectInput
                    label="EQUIPE"
                    showLabel={false}
                    value={callInfo.equipeResp}
                    options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
                    handleChange={(value) => setCallInfo((prev) => ({ ...prev, equipeResp: value }))}
                    width={'100%'}
                  />
                  {/* <p className="text-gray-600 text-center">{dados.equipeResp ? dados.equipeResp : '-'}</p> */}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-x-2 border border-gray-300 p-2 lg:flex-row">
                <span className="text-center font-bold uppercase">SERVIÇO</span>
                <select
                  value={callInfo.servico}
                  onChange={(e) => setCallInfo({ ...callInfo, servico: e.target.value })}
                  className="mt-2 grow text-center text-xs outline-none lg:mt-0"
                >
                  <option value={'PADRÃO'}>PADRÃO</option>
                  <option value={'ESTRUTURA'}>ESTRUTURA</option>
                  <option value={'MONTAGEM'}>MONTAGEM</option>
                  <option value={'MANUTENÇÃO CORRETIVA'}>MANUTENÇÃO CORRETIVA</option>
                  <option value={'MANUTENÇÃO PREVENTIVA'}>MANUTENÇÃO PREVENTIVA</option>
                  <option value={'NÃO DEFINIDO'}>NÃO DEFINIDO</option>
                </select>
              </div>
              <div className="mt-4 flex w-full flex-col border border-gray-300 p-2">
                <span className="text-center font-bold uppercase">ADICIONAR MATERIAIS</span>
                <AddMaterialFormulario materials={materials} materialsFetching={materialsFetching} addMaterial={addMaterial} />
              </div>
              {materialMsg && <p className="text-center text-sm italic text-red-500">{materialMsg}</p>}
              <div className="mt-4 flex grow flex-col gap-y-2 border border-gray-300 p-2">
                <h1 className="text-center font-bold">SAÍDA</h1>
                <div className="flex flex-col overflow-y-auto overscroll-y-auto">
                  {callInfo.materiais.map((obj, index) => (
                    <div key={index} className="flex items-center justify-between px-2">
                      <p className="list-none text-center font-bold text-gray-600">
                        {obj.nome} - ({obj.qtdeSaida})
                      </p>
                      <button
                        onClick={() => {
                          let arr = callInfo.materiais
                          arr.splice(index, 1)
                          setCallInfo({ ...callInfo, materiais: arr })
                        }}
                      >
                        <VscChromeClose style={{ color: 'red', fontSize: '15px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex h-[40px] max-h-[40px] w-full items-center justify-center">
                {!isLoading ? (
                  <button onClick={mutate} className="w-fit rounded bg-blue-300 p-2 font-bold text-white hover:bg-blue-700">
                    ABRIR FORMULÁRIO
                  </button>
                ) : (
                  <div className={`flex h-[40px] w-full items-center justify-center`}>
                    <LoadingPage />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NovoFormulario
