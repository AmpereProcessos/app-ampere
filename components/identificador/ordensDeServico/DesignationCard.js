import React, { useState } from 'react'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import SelectInput from '../../inputs/Select'
import TextInput from '../../inputs/Text'

import { BsCalendarFill, BsFillCalendarCheckFill } from 'react-icons/bs'
import { MdCategory } from 'react-icons/md'
import { IoMdAlert } from 'react-icons/io'
import { FaCity } from 'react-icons/fa'
import { AiFillTool } from 'react-icons/ai'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { updateServiceOrder } from '../../../utils/methods/mutation/service-orders'
import { equipesTecnicas } from '../../../utils/constants'

function DesignationCard({ order }) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState(order)
  async function handleSaveChanges() {
    const loadingToastId = toast.loading('Carregando...')
    try {
      const msg = await updateServiceOrder({ changes: infoHolder, id: order._id })
      toast.dismiss(loadingToastId)
      toast.success(msg)
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-3 rounded-md border border-gray-400 p-6 shadow-md">
      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-center text-sm leading-none font-bold tracking-tight text-[#15599a] duration-300 ease-in-out lg:text-start">
              {order.favorecido.nome}
            </h1>
            <div className="flex items-center gap-1">
              <AiFillTool />
              <h1 className="text-primary/60 text-center text-xs leading-none font-medium tracking-tight duration-300 ease-in-out lg:text-start">
                {order.descricao}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSaveChanges}
            className="w-fit rounded border border-blue-500 p-1 font-medium text-blue-500 duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            SALVAR
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 ${order.dataEfetivacao ? 'text-green-500' : 'text-primary/60'}`}>
            {order.dataEfetivacao ? <BsFillCalendarCheckFill /> : <BsCalendarFill />}

            <p className="text-xs font-medium">
              {dayjs(order.dataEfetivacao ? order.dataEfetivacao : order.dataInsercao).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-around gap-2 lg:flex-row">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-medium">CATEGORIA</h1>
            <MdCategory />
          </div>
          <p className="text-primary/60 text-sm">{order.categoria}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-medium">URGÊNCIA</h1>
            <IoMdAlert />
          </div>
          <p className="text-primary/60 text-sm">{order.urgencia}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-medium">CIDADE - UF</h1>
            <FaCity />
          </div>
          <p className="text-primary/60 text-sm">
            {order.localizacao.cidade}-{order.localizacao.uf}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <SelectInput
            label={'TIPO DE RESPONSÁVEL'}
            labelClassName="text-xs font-medium"
            value={infoHolder.responsavel.tipo}
            options={[
              { id: 1, label: 'INTERNO', value: 'INTERNO' },
              { id: 2, label: 'EXTERNO', value: 'EXTERNO' },
            ]}
            selectedItemLabel={'NÃO DEFINIDO'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, tipo: value } }))}
            width={'100%'}
          />
        </div>
        <div className="w-full lg:w-[50%]">
          {infoHolder.responsavel.tipo == 'EXTERNO' ? (
            <TextInput
              label={'NOME DO RESPONSÁVEL'}
              labelClassName="text-xs font-medium"
              placeholder={'Preencha o nome do responsável pela execução...'}
              value={infoHolder.responsavel.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
              width={'100%'}
            />
          ) : (
            <SelectInput
              label={'NOME DE RESPONSÁVEL'}
              labelClassName="text-xs font-medium"
              value={infoHolder.responsavel.nome}
              options={equipesTecnicas.map((team, index) => ({ ...team, id: index + 1 }))}
              selectedItemLabel={'NÃO DEFINIDO'}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsavel: { ...prev.responsavel, nome: value } }))}
              width={'100%'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DesignationCard
