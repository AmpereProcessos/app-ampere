import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useFileReferencesByUserId } from '@/utils/methods/query/file-references'
import React from 'react'
import FileReferenceCard from '../referencias-arquivos/FileReferenceCard'

type EmployeeFilesProps = {
  employeeId: string
}
function EmployeeFiles({ employeeId }: EmployeeFilesProps) {
  const { data: fileReferences, isLoading, isError, isSuccess } = useFileReferencesByUserId({ id: employeeId })
  return (
    <div className="flex w-full flex-wrap items-start justify-around gap-2">
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar arquivos vinculados ao colaborador.'} /> : null}
      {isSuccess ? (
        fileReferences.length > 0 ? (
          fileReferences.map((reference) => (
            <div className="w-full lg:w-[350px]">
              <FileReferenceCard info={reference} />
            </div>
          ))
        ) : (
          <p className="w-full text-center font-bold italic tracking-tight text-gray-500">Sem arquivos vinculados ao colaborador.</p>
        )
      ) : null}
    </div>
  )
}

export default EmployeeFiles
