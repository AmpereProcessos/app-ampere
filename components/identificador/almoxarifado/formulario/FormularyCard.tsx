import Avatar from '@/components/utils/Avatar'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import React from 'react'
import { BsCalendar2Check, BsCalendarPlus } from 'react-icons/bs'
import { FaCity, FaUser, FaUsers } from 'react-icons/fa'
import { FaDiamond } from 'react-icons/fa6'

type FormularyCardProps = {
  formulary: TNewWarehouseFormulary & { _id: string }
  openModal: (id: string) => void
}
function FormularyCard({ formulary, openModal }: FormularyCardProps) {
  function getCardColor(status: boolean) {
    if (status == true)
      return (
        <div className="flex min-w-fit items-center gap-2 rounded-full bg-green-600 px-2 py-1 ">
          <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">FINALIZADO</h1>
        </div>
      )
    return (
      <div className="flex min-w-fit items-center gap-2 rounded-full bg-blue-600 px-2 py-1 ">
        <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">EM ABERTO</h1>
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col rounded-md border border-gray-300 p-3 lg:w-[450px]">
      <div className="flex w-full items-center justify-between gap-2">
        <h1
          onClick={(e) => openModal(formulary._id)}
          className="cursor-pointer text-xs font-black leading-none tracking-tight hover:text-cyan-500 lg:text-sm"
        >
          {formulary.titulo}
        </h1>
        {getCardColor(!!formulary.dataEfetivacao)}
      </div>

      <div className="mt-1 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaDiamond />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formulary.categoria}</p>
        </div>
        {formulary.dataEfetivacao ? (
          <div className="flex items-center gap-2">
            <BsCalendar2Check color="rgb(22,101,52)" />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
              {formatDateAsLocale(formulary.dataEfetivacao, true)}
            </p>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCity />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formulary.localizacao.cidade}</p>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers color={'rgb(30,64,175)'} />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{formulary.responsaveis}</p>
        </div>
      </div>
      <div className="mt-2 flex w-full items-center justify-between">
        <div className={`flex items-center gap-2`}>
          <BsCalendarPlus />
          <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(formulary.dataInsercao, true)}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Avatar url={formulary.autor.avatar_url} width={25} height={25} fallback={formatNameAsInitials(formulary.autor.nome)} />
          <p className="text-xs font-medium text-gray-500">{formulary.autor.nome}</p>
        </div>
      </div>
    </div>
  )
}

export default FormularyCard
