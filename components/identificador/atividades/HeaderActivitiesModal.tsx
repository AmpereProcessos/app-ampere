import { useClickOutside } from '@/utils/hooks'
import { TActivityDTO } from '@/utils/schemas/activities'
import React, { Dispatch, SetStateAction, useRef } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import ResponsibleActivityCard from './ResponsibleActivityCard'
import { UseResponsibleActivitiesFilters } from '@/utils/methods/query/activities'
type HeaderActivitiesModalProps = {
  activities: TActivityDTO[]
  userId: string
  filters: UseResponsibleActivitiesFilters
  setFilters: Dispatch<SetStateAction<UseResponsibleActivitiesFilters>>
  closeModal: () => void
}
function HeaderActivitiesModal({ activities, userId, filters, setFilters, closeModal }: HeaderActivitiesModalProps) {
  const ref = useRef(null)
  useClickOutside(ref, closeModal)
  return (
    <div
      ref={ref}
      className="absolute top-[35px] -left-[280px] z-[200] flex h-[300px] w-[300px] flex-col border border-gray-200 bg-[#fff] p-2 shadow-md lg:-left-[190px]"
    >
      <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
        <h1 className="text-sm font-bold leading-none tracking-tight">SUAS ATIVIDADES</h1>
        <button onClick={closeModal} className="rounded-lg p-1 text-red-500 hover:bg-red-200">
          <VscChromeClose size={15} />
        </button>
      </div>
      <div className="flex w-full grow flex-col gap-1 overflow-y-auto overscroll-y-auto py-1 pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          type="text"
          placeholder="Filtre pelo título da atividade..."
          className="w-full rounded-md border border-gray-200 p-2 text-xs outline-none placeholder:italic"
        />

        {activities.length > 0 ? (
          activities.map((activity) => <ResponsibleActivityCard key={activity._id} activity={activity} userId={userId} />)
        ) : (
          <div className="flex  w-full grow items-center justify-center">
            <p className="text-center text-xs italic text-gray-500">Não foram encontradas atividades...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderActivitiesModal
