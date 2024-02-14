import Fireworks from '@fireworks-js/react'
import React, { useEffect, useRef, useState } from 'react'
import AmpereTeam from '../utils/images/time-ampere.jpg'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import NewForm from '../components/identificador/almoxarifado/formulario/NewForm'
import dayjs from 'dayjs'
import axios from 'axios'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import FormularyCard from '@/components/identificador/almoxarifado/formulario/FormularyCard'
import { useQueryClient } from 'react-query'
import EditForm from '@/components/identificador/almoxarifado/formulario/EditForm'
import { formatToMoney } from '@/utils/constants'
import { FaCity, FaSignature, FaTools } from 'react-icons/fa'
import { formatDateAsLocale } from '@/utils/methods/formatting'

const currentDate = dayjs()
const beforeParam = currentDate.toISOString()
const afterParam = currentDate.subtract(3, 'month').toISOString()
// function Test() {
//   const queryClient = useQueryClient()
//   const { data: session, status } = useSession()
//   const ref = useRef()
//   const [forms, setForms] = useState<(TNewWarehouseFormulary & { _id: string })[]>([])
//   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
//   const [modalForm, setModalForm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })
//   async function getForms() {
//     try {
//       const { data } = await axios.get(`/api/almoxarifado/formularios/test/?after=${afterParam}&before=${beforeParam}`)
//       setForms(data.data)
//     } catch (error) {
//       throw error
//     }
//   }
//   useEffect(() => {
//     const func = async () => await getForms()
//     func()
//   }, [])

//   if (status != 'authenticated') return <></>
//   return (
//     <div className="flex grow flex-col p-6">
//       <button onClick={() => setModalIsOpen(true)}>ABRIR MODAL</button>
//       {modalIsOpen ? (
//         <NewForm
//           session={session}
//           closeModal={() => setModalIsOpen(false)}
//           invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', afterParam, beforeParam] })}
//         />
//       ) : null}
//       <div className="flex w-full flex-wrap gap-3">
//         {forms.map((formulary) => (
//           <FormularyCard formulary={formulary} openModal={(id) => setModalForm({ isOpen: true, id: id })} />
//         ))}
//       </div>
//       {modalForm.id && modalForm.isOpen ? (
//         <EditForm
//           formularyId={modalForm.id}
//           session={session}
//           invalidateQuery={async () => await queryClient.invalidateQueries({ queryKey: ['warehouse-forms', afterParam, beforeParam] })}
//           closeModal={() => setModalForm({ isOpen: false, id: null })}
//         />
//       ) : null}
//     </div>
//   )
// }
type Exportation = {
  periodo: string
  nome: string
  cidade: string
  assinatura: string
  finalizacao: string
  itens: {
    preco: number
    qtde: number
    descricao: string
    unidade: string
    idMaterial?: string | null | undefined
  }[]
  totalGasto: number
}
function Test() {
  const [exportation, setExportation] = useState<Exportation[]>([])
  async function getForms() {
    try {
      const { data } = await axios.get(`/api/exportManual`)
      setExportation(data.data)
    } catch (error) {
      throw error
    }
  }
  function getStats(info?: Exportation[]) {
    if (!info)
      return {
        totais: [],
      }
    const totalsByMonth = info.reduce<{ [key: string]: number }>((acc, current) => {
      if (!acc[current.periodo]) acc[current.periodo] = 0
      acc[current.periodo] += current.totalGasto
      return acc
    }, {})
    return {
      totais: Object.entries(totalsByMonth).map(([key, value]) => ({ periodo: key, total: value })),
    }
  }
  useEffect(() => {
    const func = async () => await getForms()
    func()
  }, [])
  return (
    <div className="flex grow flex-col gap-2 px-2">
      <h1 className="w-full text-center text-lg font-black">RELATÓRIO DE GASTOS EM INSUMOS</h1>
      <h1 className="text-start font-bold tracking-tight">GASTOS POR PERÍODO</h1>
      <div className="flex w-full flex-wrap justify-around">
        {getStats(exportation).totais.map((t) => (
          <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-1 px-2">
            <h1 className="tracking-tight text-white">{t.periodo}</h1>
            <h1 className="font-bold text-white">{formatToMoney(t.total)}</h1>
          </div>
        ))}
      </div>
      <h1 className="text-start font-bold tracking-tight">GASTOS POR PROJETO</h1>
      {exportation.map((exp, index) => (
        <div key={index} className="flex w-full flex-col border border-gray-200 p-2">
          <div className="flex w-full items-center justify-between">
            <h1 className="tracking-tightlg:text-sm cursor-pointer text-xs font-black leading-none">{exp.nome}</h1>
            <div className="flex min-w-fit items-center gap-2 rounded-full bg-black px-2 py-1 ">
              <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(exp.totalGasto)}</h1>
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center gap-2">
              <FaCity />
              <h1 className="text-xs text-gray-500">{exp.cidade}</h1>
            </div>
            <div className="flex items-center gap-2">
              <FaSignature />
              <h1 className="text-xs text-gray-500">ASSINADO EM: {exp.assinatura}</h1>
            </div>

            <div className="flex items-center gap-2">
              <FaTools />
              <h1 className="text-xs text-gray-500">CONCLUÍDO EM: {exp.finalizacao}</h1>
            </div>
          </div>
          <h1 className="text-xs tracking-tight text-gray-500">ITENS</h1>
          {exp.itens.map((item, index2) => (
            <div key={index2} className="flex w-full items-center justify-between text-xs tracking-tight">
              <h1>
                {item.qtde} x {item.descricao} ({item.unidade})
              </h1>
              <h1>{formatToMoney(item.preco * item.qtde)}</h1>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
export default Test
