import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { useMaterialLogs } from '@/utils/methods/query/materials'
import React from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { BsCalendarFill, BsCartPlusFill } from 'react-icons/bs'
import { FaLongArrowAltRight, FaUserCircle } from 'react-icons/fa'
import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import UpdateRegistriesCard from './UpdateRegistriesCard'

type UpdateRegistriesProps = {
  materialId: string
}
function UpdateRegistries({ materialId }: UpdateRegistriesProps) {
  const { data: logs, isLoading, isError, isSuccess } = useMaterialLogs(materialId)
  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2">
      <h1 className="w-full bg-gray-800 p-2 text-center font-bold text-white">REGISTROS DE ATUALIZAÇÕES</h1>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar registros de atualização.'} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-wrap items-start justify-around gap-2 py-2">
          {logs.length > 0 ? (
            logs.map((log) => <UpdateRegistriesCard key={log._id} registry={log} />)
          ) : (
            <p className="w-full text-center font-medium italic tracking-tight text-gray-500">Não há registros de atualizações.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default UpdateRegistries
