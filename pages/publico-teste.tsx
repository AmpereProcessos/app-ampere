import React, { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

import NewEmployee from '@/components/identificador/colaboradores/NewEmployee'

import EmployeeCard from '@/components/identificador/colaboradores/EmployeeCard'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import EditEmployee from '@/components/identificador/colaboradores/EditEmployee'

import { useEmployees } from '@/utils/methods/query/users'
import { BsCalendarPlus, BsCheck, BsCheckAll, BsCode } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TNotificationDTO } from '@/utils/schemas/notifications'
import Notifications from '../projetos.notificacoes.json'
type TEditModal = {
  isOpen: boolean
  id: string | null
}

function renderHeader({ projectName, sender }: { projectName: string; sender: string }) {
  if (sender == 'SISTEMA') return <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">AUTOMAÇÃO</h1>
  return (
    <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">
      <strong className="text-[#15599a]">{sender.toUpperCase()}</strong> DIZ:
    </h1>
  )
}

const notifications = [
  {
    _id: '65df860e52e08050e832ef6d',
    destinatario: '6318db05929e9f8731d8d9bb',
    remetente: 'Lucas Fernandes',
    remetenteId: '6318db05929e9f8731d8d9bb',
    mensagem: 'testee21432131',
    projetoReferencia: 1747,
    nomeDoProjeto: 'CRISTIANO APARECIDO SIQUEIRA BORGES',
    dataDeEnvio: new Date().toISOString(),
    lido: false,
    dataDeLeitura: null,
  },
  {
    _id: '65f36cb5482174546faef483',
    destinatario: '6353eb83ef4e1a367a877949',
    nomeDoProjeto: 'TESTANDO PROJETO',
    remetente: 'SISTEMA',
    mensagem: 'Olá, acabo de aprovar uma solicitação de contrato do cliente Diego Rodrigues - casa. Desde já agradeço, Volts.',
    dataDeEnvio: new Date().toISOString(),
    lido: true,
    dataDeLeitura: '2024-03-15T18:14:38.105Z',
  },
  {
    _id: '65bbd86762c5363fc6e2bc4b',
    destinatario: '64638b6c2071c508968bdf08',
    remetente: 'Luis Eduardo',
    remetenteId: '659e8961df037400d84571ac',
    mensagem: 'TERMO ASSINADO SEGUIR COM O MESMO MATERIAL',
    projetoReferencia: 2050,
    nomeDoProjeto: 'ROGERIO GEROLINETO FONSECA',
    dataDeEnvio: '2024-02-01T17:44:07.817Z',

    lido: true,
    dataDeLeitura: '2024-02-02T17:11:13.843Z',
  },
]
const notificacao: TNotificationDTO = {
  _id: '65f36cb5482174546faef483',
  destinatario: '6353eb83ef4e1a367a877949',
  nomeDoProjeto: 'TESTANDO PROJETO',
  remetente: 'SISTEMA',
  mensagem: 'Olá, acabo de aprovar uma solicitação de contrato do cliente Diego Rodrigues - casa. Desde já agradeço, Volts.',
  dataDeEnvio: new Date().toISOString(),
  lido: true,
  dataDeLeitura: '2024-03-15T18:14:38.105Z',
}
function Test() {
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-2">
      {Notifications.map((notificacao, index) => (
        <div key={index} className={'flex w-[350px] flex-col gap-1 rounded-md border border-gray-200 p-3'}>
          {renderHeader({ projectName: notificacao.nomeDoProjeto || '', sender: notificacao.remetente })}
          {notificacao.nomeDoProjeto ? (
            <div className="flex w-full items-center gap-1 text-green-500">
              <BsCode color="rgb(34,197,94)" size={20} />
              <p className="text-xs font-medium tracking-tight text-gray-500">
                <strong className="text-[#fead41]">({notificacao.projetoReferencia})</strong> {notificacao.nomeDoProjeto}
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-2 text-center text-xs tracking-tight">
            {notificacao.mensagem}
          </div>
          <div className="mt-2 flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(notificacao.dataDeEnvio.$date, true)}</p>
            </div>
            <div className="flex items-center gap-2">
              {notificacao.remetenteId && (
                <button onClick={() => {}} className="outline-none transition duration-300 ease-in-out hover:scale-125">
                  <MdEmail style={{ fontSize: '20px', color: '#15599a' }} />{' '}
                </button>
              )}
              {notificacao.lido ? (
                <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-white">
                  <BsCheckAll />
                  <p className="text-[0.60rem] font-bold">LIDO</p>
                </div>
              ) : (
                <button className="flex items-center gap-1 rounded-full bg-gray-500 px-2 py-1 text-white duration-300 ease-in-out hover:scale-[1.05] hover:bg-green-500">
                  <BsCheck />
                  <p className="text-[0.60rem] font-bold">NÃO LIDO</p>
                </button>
                // <button
                //   onClick={() => {
                //     // @ts-ignore
                //     handleUpdate({
                //       id: notificacao._id,
                //       changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
                //     })
                //   }}
                //   className="outline-none transition duration-300 ease-in-out hover:scale-150"
                // >

                // </button>
              )}
            </div>
          </div>
          {/* <div className="mt-1 flex items-center justify-between gap-2 pr-2">
          <div>
            <p className="text-xs text-gray-500">{formatDateAsLocale(notificacao.dataDeEnvio)}</p>
          </div>
          <div className="flex items-center gap-2">
            {notificacao.remetenteId && (
              <button onClick={() => {}} className="outline-none transition duration-300 ease-in-out hover:scale-125">
                <MdEmail style={{ fontSize: '20px', color: '#15599a' }} />{' '}
              </button>
            )}

            {notificacao.lido ? (
              <BsCheckAll style={{ fontSize: '20px', color: 'green' }} />
            ) : (
              <button
                onClick={() => {
                  // @ts-ignore
                  handleUpdate({
                    id: notificacao._id,
                    changes: { lido: !notificacao.lido, dataDeLeitura: !!notificacao.dataDeLeitura ? null : new Date() },
                  })
                }}
                className="outline-none transition duration-300 ease-in-out hover:scale-150"
              >
                <BsCheck
                  style={{
                    fontSize: '20px',
                    color: 'gray',
                    cursor: 'pointer',
                  }}
                />
              </button>
            )}
          </div>
        </div> */}
        </div>
      ))}
    </div>
  )
  // return (
  //   <div className="grow p-6">
  //     <div className="flex h-full grow flex-col">
  //       <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
  //         <div className="flex w-full items-center justify-between">
  //           <div className="flex flex-col items-center gap-2 lg:flex-row">
  //             <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLE DE COLABORADORES</p>
  //           </div>
  //           {/* {dropdownMenuVisible ? (
  //         <div className="cursor-pointer text-gray-600 hover:text-blue-400">
  //           <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
  //         </div>
  //       ) : (
  //         <div className="cursor-pointer text-gray-600 hover:text-blue-400">
  //           <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
  //         </div>
  //       )} */}
  //         </div>
  //         <div className="flex w-full items-center justify-end">
  //           <button
  //             onClick={() => setNewEmployeeModalIsOpen(true)}
  //             className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
  //           >
  //             NOVO COLABORADOR
  //           </button>
  //         </div>
  //       </div>
  //       <div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
  //         {isLoading ? <LoadingPage /> : null}
  //         {isError ? <ErrorComponent msg="Erro ao buscar usuários" /> : null}
  //         {isSuccess &&
  //           employees.map((employee, index: number) => (
  //             <EmployeeCard key={employee._id?.toString()} employee={employee} openModal={(id) => setEditEmployeeModal({ isOpen: true, id: id })} />
  //           ))}
  //       </div>
  //       {newEmployeeModalIsOpen ? <NewEmployee closeModal={() => setNewEmployeeModalIsOpen(false)} session={session} /> : null}
  //       {editEmployeeModal.isOpen && editEmployeeModal.id ? (
  //         <EditEmployee userId={editEmployeeModal.id} closeModal={() => setEditEmployeeModal({ isOpen: false, id: null })} session={session} />
  //       ) : null}
  //     </div>
  //   </div>
  // )
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
