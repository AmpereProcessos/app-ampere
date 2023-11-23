import React, { useState } from 'react'
import { Session } from 'next-auth'

import HeaderActivitiesModal from './HeaderActivitiesModal'
import { useResponsibleActivities } from '@/utils/methods/query/activities'
import { MdOutlineCheckBox } from 'react-icons/md'

type HeaderActivitesBlockProps = {
  session: Session
}
function HeaderActivitesBlock({ session }: HeaderActivitesBlockProps) {
  const [activitiesModalIsOpen, setActivitiesModalIsOpen] = useState<boolean>(false)
  const { data: activities } = useResponsibleActivities({ id: session.user.id })

  const openActivitiesCount = activities ? activities.filter((a) => !a.dataConclusao).length : 0
  console.log(activities)
  return (
    <div className="relative flex items-center">
      <button onClick={() => setActivitiesModalIsOpen(true)} className={`${openActivitiesCount ? 'text-red-500' : 'text-[#fead41]'}`}>
        <MdOutlineCheckBox size={23} />
      </button>
      {openActivitiesCount > 0 ? (
        <div className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1">
          <p className="text-xxs font-medium text-white">{openActivitiesCount}</p>
        </div>
      ) : null}
      {activitiesModalIsOpen ? (
        <HeaderActivitiesModal closeModal={() => setActivitiesModalIsOpen(false)} userId={session.user.id} activities={activities || []} />
      ) : null}
    </div>
  )
}

export default HeaderActivitesBlock
