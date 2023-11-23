import { useClickOutside } from '@/utils/hooks'
import { TActivityDTO } from '@/utils/schemas/activities'
import React, { useRef } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import ResponsibleActivityCard from './ResponsibleActivityCard'
type HeaderActivitiesModalProps = {
  activities: TActivityDTO[]
  userId: string
  closeModal: () => void
}
function HeaderActivitiesModal({ activities, userId, closeModal }: HeaderActivitiesModalProps) {
  const ref = useRef(null)
  useClickOutside(ref, closeModal)
  return (
    <div
      ref={ref}
      className="absolute top-[35px] -left-[190px] z-[200] flex h-[300px] w-[300px] flex-col border border-gray-200 bg-[#fff] p-2 shadow-md"
    >
      <div className="flex w-full items-center justify-between border-b border-gray-200 pb-1">
        <h1 className="text-sm font-bold leading-none tracking-tight">SUAS ATIVIDADES</h1>
        <button onClick={closeModal} className="rounded-lg p-1 text-red-500 hover:bg-red-200">
          <VscChromeClose size={15} />
        </button>
      </div>
      <div className="flex w-full grow flex-col gap-1">
        {activities.map((activity) => (
          <ResponsibleActivityCard key={activity._id} activity={activity} userId={userId} />
        ))}
      </div>
    </div>
  )
}

export default HeaderActivitiesModal
