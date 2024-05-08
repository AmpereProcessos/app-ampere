import Link from 'next/link'
import React, { useState } from 'react'
import { MdDelete, MdOutlineAddCircle } from 'react-icons/md'
import { RiDeleteBack2Line } from 'react-icons/ri'

import { TProjectDTO } from '@/utils/schemas/projects'
import NumberInput from '../inputs/Number'
import SelectInput from '../inputs/Select'
import toast from 'react-hot-toast'
import { TbCircuitChangeover } from 'react-icons/tb'
import { TProjectUpdateLogDTO } from '@/utils/schemas/project-updates-logs'

type TCircuitBreaker = {
  tipo: 'NÃO DEFINIDO' | 'MONOFÁSICO' | 'BIFÁSICO' | 'TRIFÁSICO'
  corrente: number
  qtde: number
}

type InfoMaterialBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  updateLogs: TProjectUpdateLogDTO[]
  project: TProjectDTO
  showCircuitBreakers: boolean
  circuitBreakerAddition: boolean
}
function InfoMaterialBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs = [],
  showCircuitBreakers,
  circuitBreakerAddition,
}: InfoMaterialBlockProps) {
  const [circuitBreakersArr, setCircuitBreakersArr] = useState(infoHolder.material?.disjuntores ? infoHolder.material.disjuntores : [])
  const [circuitBreakerInfo, setCircuitBreakerInfo] = useState<TCircuitBreaker>({
    tipo: 'NÃO DEFINIDO',
    corrente: 0,
    qtde: 0,
  })
  function addCircuitBreaker(info: TCircuitBreaker) {
    const currentArr = [...circuitBreakersArr]
    if (info.tipo == 'NÃO DEFINIDO') return toast.error('Preencha um tipo válido de disjuntor.')
    const circutBreaker = {
      tipo: info.tipo,
      corrente: info.corrente,
      qtde: info.qtde,
    }
    currentArr.push(circutBreaker)

    setCircuitBreakerInfo({ tipo: 'NÃO DEFINIDO', corrente: 0, qtde: 0 })
    setInfo((prev) => ({
      ...prev,
      material: {
        ...prev.material,
        disjuntores: currentArr,
      },
    }))
    setChanges({ ...changes, 'material.disjuntores': currentArr })
    setCircuitBreakersArr(currentArr)
  }
  function deleteCircuitBreaker(index: number) {
    const currentArr = [...circuitBreakersArr]
    currentArr.splice(index, 1)
    setInfo((prev) => ({
      ...prev,
      material: {
        ...prev.material,
        disjuntores: currentArr,
      },
    }))
    setChanges({ ...changes, 'material.disjuntores': currentArr })
    setCircuitBreakersArr(currentArr)
  }

  return (
    <div className="flex w-full flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
        INFORMAÇÕES SOBRE MATERIAIS DO PROJETO
      </span>

      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label={'PREVISÃO DE CUSTOS EM INSUMOS'}
            editable={editor}
            value={infoHolder.material?.previsaoCustos || null}
            placeholder="Preencha a previsão de custos em insumos..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'material.previsaoCustos': value,
              }))
              setInfo((prev) => ({
                ...prev,
                material: {
                  ...prev.material,
                  previsaoCustos: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label={'EFETIVO DE CUSTOS EM INSUMOS'}
            editable={editor}
            value={infoHolder.material?.efetivoCustos || null}
            placeholder="Preencha o efetivo de custos em insumos..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                'material.efetivoCustos': value,
              }))
              setInfo((prev) => ({
                ...prev,
                material: {
                  ...prev.material,
                  efetivoCustos: value,
                },
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-center self-center lg:w-1/3">
        <SelectInput
          label={'STATUS DE SEPARAÇÃO DO MATERIAL'}
          value={infoHolder.material?.statusSeparacao}
          selectedItemLabel="NÃO DEFINIDO"
          editable={editor}
          options={[
            { id: 1, label: 'INICIAR SEPARAÇÃO', value: 'INICIAR SEPARAÇÃO' },
            { id: 2, label: 'SEPARADO', value: 'SEPARADO' },
          ]}
          handleChange={(value) => {
            setChanges((prev) => ({
              ...prev,
              'material.statusSeparacao': value,
            }))
            setInfo((prev) => ({
              ...prev,
              material: {
                ...prev.material,
                statusSeparacao: value,
              },
            }))
          }}
          onReset={() => {
            setChanges((prev) => ({
              ...prev,
              'material.statusSeparacao': 'NÃO DEFINIDO',
            }))
            setInfo((prev) => ({
              ...prev,
              material: {
                ...prev.material,
                statusSeparacao: 'NÃO DEFINIDO',
              },
            }))
          }}
          width="100%"
        />
      </div>
      {showCircuitBreakers ? (
        <>
          <h1 className="mt-2 w-full text-center font-black text-[#fead41]">DISJUNTORES</h1>
          {circuitBreakerAddition ? (
            <>
              <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
                <div className="w-full lg:w-1/3">
                  <SelectInput
                    label={'TIPO DO DISJUNTOR'}
                    editable={true}
                    value={circuitBreakerInfo.tipo}
                    selectedItemLabel="NÃO DEFINIDO"
                    options={[
                      { id: 1, label: 'MONOFÁSICO', value: 'MONOFÁSICO' },
                      { id: 2, label: 'BIFÁSICO', value: 'BIFÁSICO' },
                      { id: 3, label: 'TRIFÁSICO', value: 'TRIFÁSICO' },
                    ]}
                    handleChange={(value) =>
                      setCircuitBreakerInfo((prev) => ({
                        ...prev,
                        tipo: value,
                      }))
                    }
                    onReset={() =>
                      setCircuitBreakerInfo((prev) => ({
                        ...prev,
                        tipo: 'NÃO DEFINIDO',
                      }))
                    }
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <NumberInput
                    label={'CORRENTE'}
                    placeholder="Preencha a corrente do disjuntor..."
                    editable={true}
                    value={circuitBreakerInfo.corrente}
                    handleChange={(value) =>
                      setCircuitBreakerInfo((prev) => ({
                        ...prev,
                        corrente: value,
                      }))
                    }
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/3">
                  <NumberInput
                    label={'QUANTIDADE'}
                    placeholder="Prencha a quantidade de disjuntores..."
                    editable={true}
                    value={circuitBreakerInfo.qtde}
                    handleChange={(value) =>
                      setCircuitBreakerInfo((prev) => ({
                        ...prev,
                        qtde: value,
                      }))
                    }
                    width={'100%'}
                  />
                </div>
              </div>
              <div className="mt-1 flex w-full items-center justify-end">
                <button
                  onClick={() => addCircuitBreaker(circuitBreakerInfo)}
                  className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
                >
                  ADICIONAR DISJUNTOR
                </button>
              </div>
            </>
          ) : null}

          {circuitBreakersArr && circuitBreakersArr.length > 0 ? (
            <div className="flex w-full flex-wrap items-start justify-around">
              {circuitBreakersArr?.map((circuitBreaker, index) => (
                <div key={index} className="flex w-full flex-col rounded-md border border-gray-200 p-2 lg:w-[275px]">
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex  items-center gap-1">
                      <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
                        <TbCircuitChangeover size={25} />
                      </div>
                      <p className="text-[0.65rem] font-medium leading-none tracking-tight lg:text-xs">
                        <strong className="text-[#FF9B50]">{circuitBreaker.qtde}</strong> x {circuitBreaker.tipo}
                      </p>
                    </div>
                    <h1 className="min-w-fit rounded-full bg-gray-800 px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">
                      {circuitBreaker.corrente}A
                    </h1>
                  </div>
                  <div className="mt-2 flex w-full items-center justify-end">
                    <button
                      onClick={() => deleteCircuitBreaker(index)}
                      type="button"
                      className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                    >
                      <MdDelete style={{ color: 'red' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm italic text-gray-500">Sem disjuntores adicionados...</p>
          )}
        </>
      ) : null}
    </div>
  )
}

export default InfoMaterialBlock
