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
import { useNewWarehouseForms } from '@/utils/methods/query/warehouse-forms'
import NewEmployee from '@/components/identificador/colaboradores/NewEmployee'
import { getMetadata, ref } from 'firebase/storage'
import { storage } from '@/utils/services/firebase/firebase-storage'
import { useEmployees } from '@/utils/methods/query/users'
import EmployeeCard from '@/components/identificador/colaboradores/EmployeeCard'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import EditEmployee from '@/components/identificador/colaboradores/EditEmployee'
import { useRouter } from 'next/router'

type TEditModal = {
  isOpen: boolean
  id: string | null
}

function Test() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, status } = useSession({ required: true, onUnauthenticated: () => router.push('/auth/authHome') })
  const { data: employees, isLoading, isSuccess, isError } = useEmployees()

  const [newEmployeeModalIsOpen, setNewEmployeeModalIsOpen] = useState<boolean>(false)
  const [editEmployeeModal, setEditEmployeeModal] = useState<TEditModal>({ isOpen: false, id: null })

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="grow p-6">
      <div className="flex h-full grow flex-col">
        <div className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex flex-col">
            <h1 className="text-lg font-black">CONTROLE DE COLABORADORES</h1>
            <p className="text-sm text-[#71717A]">Gerencie, adicione e edite colaboradores</p>
            <p className="text-sm text-[#71717A]">{isSuccess ? employees.length : '0'} colaboradores atualmente cadastrados</p>
          </div>
          <button
            onClick={() => setNewEmployeeModalIsOpen(true)}
            className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            NOVO COLABORADOR
          </button>
        </div>
        <div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar usuários" /> : null}
          {isSuccess &&
            employees.map((employee, index: number) => (
              <EmployeeCard key={employee._id?.toString()} employee={employee} openModal={(id) => setEditEmployeeModal({ isOpen: true, id: id })} />
            ))}
        </div>
        {newEmployeeModalIsOpen ? <NewEmployee closeModal={() => setNewEmployeeModalIsOpen(false)} session={session} /> : null}
        {editEmployeeModal.isOpen && editEmployeeModal.id ? (
          <EditEmployee userId={editEmployeeModal.id} closeModal={() => setEditEmployeeModal({ isOpen: false, id: null })} session={session} />
        ) : null}
      </div>
    </div>
  )
}
// type Exportation = {
//   periodo: string
//   nome: string
//   cidade: string
//   assinatura: string
//   finalizacao: string
//   itens: {
//     preco: number
//     qtde: number
//     descricao: string
//     unidade: string
//     idMaterial?: string | null | undefined
//   }[]
//   totalGasto: number
// }
// function Test() {
//   const [exportation, setExportation] = useState<Exportation[]>([])
//   async function getForms() {
//     try {
//       const { data } = await axios.get(`/api/exportManual`)
//       setExportation(data.data)
//     } catch (error) {
//       throw error
//     }
//   }
//   function getStats(info?: Exportation[]) {
//     if (!info)
//       return {
//         totais: [],
//       }
//     const totalsByMonth = info.reduce<{ [key: string]: number }>((acc, current) => {
//       if (!acc[current.periodo]) acc[current.periodo] = 0
//       acc[current.periodo] += current.totalGasto
//       return acc
//     }, {})
//     return {
//       totais: Object.entries(totalsByMonth).map(([key, value]) => ({ periodo: key, total: value })),
//     }
//   }
//   useEffect(() => {
//     const func = async () => await getForms()
//     func()
//   }, [])
//   return (
//     <div className="flex grow flex-col gap-2 px-2">
//       <h1 className="w-full text-center text-lg font-black">RELATÓRIO DE GASTOS EM INSUMOS</h1>
//       <h1 className="text-start font-bold tracking-tight">GASTOS POR PERÍODO</h1>
//       <div className="flex w-full flex-wrap justify-around">
//         {getStats(exportation).totais.map((t) => (
//           <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-1 px-2">
//             <h1 className="tracking-tight text-white">{t.periodo}</h1>
//             <h1 className="font-bold text-white">{formatToMoney(t.total)}</h1>
//           </div>
//         ))}
//       </div>
//       <h1 className="text-start font-bold tracking-tight">GASTOS POR PROJETO</h1>
//       {exportation.map((exp, index) => (
//         <div key={index} className="flex w-full flex-col border border-gray-200 p-2">
//           <div className="flex w-full items-center justify-between">
//             <h1 className="tracking-tightlg:text-sm cursor-pointer text-xs font-black leading-none">{exp.nome}</h1>
//             <div className="flex min-w-fit items-center gap-2 rounded-full bg-black px-2 py-1 ">
//               <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{formatToMoney(exp.totalGasto)}</h1>
//             </div>
//           </div>
//           <div className="flex w-full items-center gap-2">
//             <div className="flex items-center gap-2">
//               <FaCity />
//               <h1 className="text-xs text-gray-500">{exp.cidade}</h1>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaSignature />
//               <h1 className="text-xs text-gray-500">ASSINADO EM: {exp.assinatura}</h1>
//             </div>

//             <div className="flex items-center gap-2">
//               <FaTools />
//               <h1 className="text-xs text-gray-500">CONCLUÍDO EM: {exp.finalizacao}</h1>
//             </div>
//           </div>
//           <h1 className="text-xs tracking-tight text-gray-500">ITENS</h1>
//           {exp.itens.map((item, index2) => (
//             <div key={index2} className="flex w-full items-center justify-between text-xs tracking-tight">
//               <h1>
//                 {item.qtde} x {item.descricao} ({item.unidade})
//               </h1>
//               <h1>{formatToMoney(item.preco * item.qtde)}</h1>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }
export default Test
