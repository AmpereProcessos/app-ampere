import { formatDateAsLocale } from '@/utils/methods/formatting'
import { renderIcon } from '@/utils/methods/rendering'
import React from 'react'
import { BsCalendar } from 'react-icons/bs'
import { FaLock } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

const IconHeaders = [
  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#fead41]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#003049]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#d62828]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#ff5400]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#fcbf49]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#eae2b7]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#03045e]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#0077b6]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#00b4d8]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#90e0ef]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#390099]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#9e0059]  text-white`}>{renderIcon(icon)}</div>
  ),

  (icon: React.ComponentType | IconType) => (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#ff0054]  text-white`}>{renderIcon(icon)}</div>
  ),
]

function renderJourneyIcon({ active, icon, index }: { active: boolean; icon: React.ComponentType | IconType; index: number }) {
  if (!active)
    return (
      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-300`}>
        <FaLock color="white" />
      </div>
    )

  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#15599a] to-blue-500  text-white`}>
      {renderIcon(icon)}
    </div>
  )

  // return IconHeaders[index](icon)
}

type JourneyItemProps = {
  title: string
  description: string
  active: boolean
  date?: string | null
  icon: React.ComponentType | IconType
  index: number
}
function JourneyItem({ title, description, date, active, icon, index }: JourneyItemProps) {
  return (
    <div className="flex flex-col items-center px-4">
      {/* <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 dark:bg-orange-400">{renderIcon(icon)}</div>
       */}
      {renderJourneyIcon({ active, icon, index })}
      <h3 className="mt-4 text-center text-lg font-black uppercase">{title}</h3>
      {active ? (
        <div className="mt-2 flex items-center gap-1">
          <BsCalendar />
          <p className="text-sm font-bold">{formatDateAsLocale(date) || 'N/A'}</p>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-gray-500">
          <FaLock />
          <p className="text-sm font-bold">Processo pendente.</p>
        </div>
      )}

      <p className="mt-1 text-center text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

export default JourneyItem
