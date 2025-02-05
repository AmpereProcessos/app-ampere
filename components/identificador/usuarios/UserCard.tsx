import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { TEmployeeDTO, TUserDTO } from '@/utils/schemas/users'
import React from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { FaDiamond } from 'react-icons/fa6'
import { MdEmail, MdOutlineEmail, MdOutlinePhone, MdPhone } from 'react-icons/md'

function getPosition(positions: TEmployeeDTO['cargos']) {
  const current = positions.find((p) => !!p.dataInicio && !p.dataFinal)?.cargo
  if (!current)
    return (
      <div className="flex min-w-fit items-center gap-2 rounded-full bg-[#fead41] px-2 py-1 ">
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">CARGO INDEFINIDO</h1>
      </div>
    )

  return (
    <div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
      <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">{current}</h1>
    </div>
  )
}

type UserCardProps = {
  user: TUserDTO
  openModal: (id: string) => void
}
function UserCard({ user, openModal }: UserCardProps) {
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-200 p-4 lg:w-[600px]">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1
            onClick={() => openModal(user._id)}
            className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
          >
            {user.usuario.toUpperCase()}
          </h1>
        </div>
        <Avatar url={user.avatar_url || undefined} width={35} height={35} fallback={formatNameAsInitials(user.usuario)} />
      </div>

      <div className="mt-2 flex w-full items-center gap-2">
        <div className="flex items-center gap-2">
          <MdOutlineEmail />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <MdOutlinePhone />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{user.telefone || 'NÃO DEFINIDO'}</p>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-between gap-1">
        {getPosition(user.cargos)}
        <div className={`flex items-center gap-1`}>
          <BsCalendarPlus />
          <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(user.dataInsercao) || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
