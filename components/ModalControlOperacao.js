import React, { useState } from 'react'
import AnimatedModalWrapper from './utils/AnimatedModalWrapper'
import { VscChromeClose } from 'react-icons/vsc'

import dayjs from 'dayjs'
import { BsPatchCheckFill } from 'react-icons/bs'

import { TbReport } from 'react-icons/tb'
import axios from 'axios'
import OperationReportBlock from './OperationReportBlock'
import { useSession } from '../components/providers/SessionProvider'

function ModalControlOperacao({ isOpen, setModalIsOpen, operation }) {
  const { session } = useSession({})
  const [operationMsg, setOperationMsg] = useState({ text: '', color: '' })

  const [operationInfo, setOperationInfo] = useState(operation)
  const [reportInfo, setReportInfo] = useState({
    nomeAtividade: null,
    atividades: [],
    anotacoes: '',
    data: new Date().toISOString(),
  })

  function resetOperationMsg() {
    setTimeout(() => {
      setOperationMsg({ text: '', color: '' })
    }, 2500)
  }

  async function updateOperation() {
    setOperationMsg({ text: 'Processando...', color: 'text-[#15599a]' })
    if (operationInfo.nome.trim().length < 5) {
      setOperationMsg({
        text: 'Por favor, preencha um nome de ao menos 5 letras para a operação.',
        color: 'text-red-500',
      })
      resetOperationMsg()
      return false
    }
    if (!operationInfo.dataInicio) {
      setOperationMsg({
        text: 'Por favor, preencha uma data de início para a operação.',
        color: 'text-red-500',
      })
      resetOperationMsg()
      return false
    }
    if (operationInfo.atividades.length == 0) {
      setOperationMsg({
        text: 'Por favor, adicione ao menos uma atividade a essa operação.',
        color: 'text-red-500',
      })
      resetOperationMsg()
      return false
    }
    if (operationInfo.dataInicio && operationInfo.previsaoConclusao) {
      if (new Date(operationInfo.previsaoConclusao) < new Date(operationInfo.dataInicio)) {
        setOperationMsg({
          text: 'Por favor, especifique uma previsão de conclusão maior que a data de início.',
          color: 'text-red-500',
        })
        return false
      }
    }
    try {
      const { data } = await axios.put(`/api/operacoes`, operationInfo)
      if (data)
        setOperationMsg({
          text: 'Atualizações feitas !',
          color: 'text-green-500',
        })
      resetOperationMsg()
    } catch (error) {
      console.log(error)
      setOperationMsg({
        text: 'Houve um erro nas alterações da operação.',
        color: 'text-red-500',
      })
      resetOperationMsg()
    }
  }
  async function handleUpdates(changes) {
    try {
      const { data } = await axios.put(`/api/operacoes`, {
        ...changes,
        _id: operationInfo._id,
      })
    } catch (error) {
      alert('Não foi possível realizar alterações.')
    }
  }
  console.log(operationInfo)
  return (
    <>
      <AnimatedModalWrapper width={'90%'} height={'80%'} modalIsOpen={isOpen}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-300 pb-2">
            <h1 className="font-bold text-[#15599a]">{operation.nome}</h1>
            <button>
              <VscChromeClose onClick={() => setModalIsOpen(false)} style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col overflow-y-auto overscroll-y-auto px-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <h1 className="w-full bg-[#15599a] p-1 text-center font-medium text-white">INFORMAÇÕES GERAIS DA OPERAÇÃO</h1>
            <div className="flex w-full flex-col gap-2 pt-4 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <div className="flex w-full flex-col">
                  <h1 className="text-sm text-gray-500">NOME DA OPERAÇÃO</h1>
                  <p className="font-arial border-b-2 border-gray-300 text-center text-sm text-gray-700">{operationInfo.nome}</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex w-full flex-col">
                  <h1 className="text-sm text-gray-500">DESCRIÇÃO</h1>
                  <p className="font-arial border-b-2 border-gray-300 text-center text-sm text-gray-700">{operationInfo.descricao}</p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 pt-4 lg:flex-row">
              <div className="w=full lg:w-1/2">
                <div className="flex w-full flex-col">
                  <h1 className="text-sm text-gray-500">DATA DE INÍCIO</h1>
                  <p className="font-arial border-b-2 border-gray-300 text-center text-sm text-gray-700">
                    {new Date(operationInfo.dataInicio).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex w-full flex-col">
                  <h1 className="text-sm text-gray-500">PREVISÃO DE CONCLUSÃO</h1>
                  <p className="font-arial border-b-2 border-gray-300 text-center text-sm text-gray-700">{operationInfo.previsaoConclusao}</p>
                </div>
              </div>
            </div>
            <h1 className="w-full bg-[#15599a] p-1 text-center font-medium text-white">ATIVIDADES</h1>
            <div className="flex h-[250px] max-h-[250px] min-h-[250px] w-full flex-col overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {operationInfo.atividades.length > 0 ? (
                operationInfo.atividades.map((activity, index, arr) => (
                  <div key={index} className={`flex w-full flex-col items-start py-2 ${arr.length > 1 ? 'border-b border-gray-300' : ''}`}>
                    <div className="flex w-full items-center justify-around">
                      <p className="w-3/5 text-start font-medium text-gray-700 lg:w-2/5">{activity.nome}</p>
                      <div className="hidden w-2/6 items-center gap-2 lg:flex">
                        <div className="flex items-center gap-2 text-center font-medium text-gray-700">
                          <p>INICIO EM:</p>
                          <p>{activity.dataInicio ? dayjs(activity.dataInicio).add(4, 'hours').format('DD/MM/YYYY') : '-'}</p>
                        </div>
                        <div className="flex items-center gap-2 text-center font-medium text-gray-700">
                          <p>PREV.CONCLUSAO EM:</p>
                          <p>{activity.previsaoConclusao ? dayjs(activity.previsaoConclusao).add(4, 'hours').format('DD/MM/YYYY') : '-'}</p>
                        </div>
                      </div>

                      <div className="flex w-2/5 items-center justify-center gap-4 lg:w-1/5">
                        <button
                          onClick={() => {
                            setReportInfo((prev) => ({
                              ...prev,
                              nomeAtividade: activity.nome,
                            }))
                          }}
                          className="flex items-center justify-center text-sm text-[#fead61] duration-300 ease-in-out hover:scale-110"
                        >
                          <TbReport title="REPORTAR ATUALIZAÇÃO A ESSA ATIVIDADE" style={{ fontSize: '15px' }} />
                        </button>
                        {activity.dataConclusao ? <BsPatchCheckFill style={{ color: 'rgb(34,197,94)' }} /> : null}
                      </div>
                    </div>
                    {activity.subAtividades
                      ? activity.subAtividades.map((subActivity, subIndex) => (
                          <div key={subIndex} className="my-1 flex w-full items-start justify-around">
                            <p className="w-3/5 text-center text-xs text-gray-500 lg:w-2/5">{subActivity.nome}</p>

                            <div className="hidden w-2/5 items-center gap-2 lg:flex">
                              <p className="hidden text-center text-xs text-gray-500 lg:block">
                                {subActivity.dataInicio ? `INICIO EM: ${dayjs(subActivity.dataInicio).add(4, 'hours').format('DD/MM/YYYY')}` : '-'}
                              </p>
                              {subActivity.dataConclusao ? (
                                <p className="hidden text-center text-xs text-gray-500 lg:block">
                                  CONCLUSÃO EM: {dayjs(subActivity.dataConclusao).add(4, 'hours').format('DD/MM/YYYY')}
                                </p>
                              ) : (
                                <p className="hidden text-center text-xs text-gray-500 lg:block">
                                  {subActivity.previsaoConclusao
                                    ? `PREV.CONCLUSÃO EM: ${dayjs(subActivity.previsaoConclusao).add(4, 'hours').format('DD/MM/YYYY')}`
                                    : '-'}
                                </p>
                              )}
                            </div>
                            <div className="flex w-2/5 items-center justify-center lg:w-1/5">
                              {subActivity.status != 'CONCLUIDO' ? (
                                <button
                                  onClick={() => {
                                    var changesObj = {
                                      [`atividades.${index}.subAtividades.${subIndex}.status`]: 'CONCLUIDO',
                                      [`atividades.${index}.subAtividades.${subIndex}.dataConclusao`]: new Date().toISOString(),
                                    }
                                    // dealing with states
                                    const activitiesArr = operationInfo.atividades
                                    activitiesArr[index].subAtividades[subIndex].status = 'CONCLUIDO'
                                    activitiesArr[index].subAtividades[subIndex].dataConclusao = new Date().toISOString()
                                    // validating conclusion of all subactivities
                                    if (activitiesArr[index].subAtividades.every((subact) => subact.status == 'CONCLUIDO')) {
                                      activitiesArr[index].dataConclusao = new Date().toISOString()
                                      changesObj = {
                                        ...changesObj,
                                        [`atividades.${index}.dataConclusao`]: new Date().toISOString(),
                                      }
                                    }

                                    setOperationInfo((prev) => ({
                                      ...prev,
                                      atividades: activitiesArr,
                                    }))
                                    handleUpdates(changesObj)
                                  }}
                                  className="cursor-pointer rounded border border-green-500 p-1 text-xxs text-green-500 hover:bg-green-500 hover:text-white"
                                >
                                  CONCLUIR
                                </button>
                              ) : (
                                <div
                                  onClick={() => {
                                    var changesObj = {
                                      [`atividades.${index}.subAtividades.${subIndex}.status`]: null,
                                      [`atividades.${index}.subAtividades.${subIndex}.dataConclusao`]: null,
                                    }
                                    // dealing with states
                                    const activitiesArr = operationInfo.atividades
                                    activitiesArr[index].subAtividades[subIndex].status = null
                                    activitiesArr[index].subAtividades[subIndex].dataConclusao = null

                                    // reseting conclusion in the main activity
                                    if (activitiesArr[index].dataConclusao) {
                                      activitiesArr[index].dataConclusao = null
                                      changesObj = {
                                        ...changesObj,
                                        [`atividades.${index}.dataConclusao`]: null,
                                      }
                                    }

                                    setOperationInfo((prev) => ({
                                      ...prev,
                                      atividades: activitiesArr,
                                    }))
                                    handleUpdates(changesObj)
                                  }}
                                  className="cursor-pointer text-green-500 hover:text-red-500"
                                >
                                  <BsPatchCheckFill />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                ))
              ) : (
                <div className="flex w-full grow items-center justify-center py-2">
                  <p className="font-medium italic text-gray-500">Sem atividades vinculadas...</p>
                </div>
              )}
            </div>
            <OperationReportBlock
              session={session}
              operationName={operationInfo.nome}
              operationId={operationInfo._id}
              data={reportInfo}
              setReportInfo={setReportInfo}
            />
          </div>
          {/* <div className="w-full py-2 border-t border-gray-300 flex items-center justify-end justify-self-end">
            {operationMsg.text ? (
              <p className={`text-sm italic ${operationMsg.color}`}>
                {operationMsg.text}
              </p>
            ) : (
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={updateOperation}
              />
            )}
          </div> */}
        </div>
      </AnimatedModalWrapper>
    </>
  )
}

export default ModalControlOperacao
