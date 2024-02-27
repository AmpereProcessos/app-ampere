import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { TEmployeeDTO } from '@/utils/schemas/users'
import React from 'react'
import { BsCalendarPlus, BsCode } from 'react-icons/bs'
import { FaBirthdayCake } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa6'
import { PiOfficeChairFill } from 'react-icons/pi'

function getPosition(positions: TEmployeeDTO['cargos']) {
  const current = positions.find((p) => !!p.dataInicio && !p.dataFinal)?.cargo
  return current || 'CARGO INDEFINIDO'
}

type EmployeeCardProps = {
  employee: TEmployeeDTO
  openModal: (id: string) => void
}
function EmployeeCard({ employee, openModal }: EmployeeCardProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[450px]">
      <div className="flex w-full items-center gap-2">
        {employee.avatar_url ? (
          <Avatar fallback={formatNameAsInitials(employee.nome)} height={30} width={30} url={employee.avatar_url || undefined} />
        ) : null}
        <h1
          onClick={() => openModal(employee._id)}
          className="cursor-pointer text-sm font-black uppercase leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
        >
          {employee.nome}
        </h1>
      </div>

      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <BsCode />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{employee.cpf || 'N/A'}</p>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{employee.telefone || 'NÃO DEFINIDO'}</p>
        </div>
      </div>
      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaBirthdayCake />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
            {formatDateAsLocale(employee.dataNascimento) || 'NÃO DEFINIDO'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PiOfficeChairFill />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{getPosition(employee.cargos)}</p>
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-end gap-1">
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-xs font-medium text-gray-500">ADMITIDO EM {formatDateAsLocale(employee.dataAdmissao) || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeCard
