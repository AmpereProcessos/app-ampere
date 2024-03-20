import Image from 'next/image'
import React, { useState } from 'react'
import AlertVolts from '../../../utils/svgs/alert-volts.svg'
import SleepVolts from '../../../utils/svgs/sleep-volts.svg'
import { useNotifications } from '@/utils/methods/query/notifications'

import { Session } from 'next-auth'
import NotificationsModal from './NotificationsModal'
type NotificationBlockProps = {
  session: Session
}
function NotificationBlock({ session }: NotificationBlockProps) {
  const { data: notifications } = useNotifications({ id: session.user.id })
  const unreadCount = notifications?.reduce((acc, current) => (!current.lido ? acc + 1 : acc), 0) || 0
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  return (
    <div className="relative flex items-center">
      {unreadCount > 0 ? (
        <div onClick={() => setModalIsOpen((prev) => !prev)} className="flex cursor-pointer items-center justify-center">
          <div className="hidden h-[25px] w-[25px] items-center duration-500 ease-in-out hover:scale-105 lg:flex">
            <Image src={AlertVolts} />
          </div>
          <p className="mb-2 hidden h-[20px] w-[20px] items-center justify-center rounded-full bg-red-500 text-center text-xs font-bold lg:flex">
            {unreadCount}
          </p>
        </div>
      ) : (
        <div
          onClick={() => setModalIsOpen((prev) => !prev)}
          className="hidden h-[25px] w-[25px] cursor-pointer items-center duration-500 ease-in-out hover:scale-105 lg:flex"
        >
          <Image src={SleepVolts} />
        </div>
      )}
      {modalIsOpen ? <NotificationsModal notifications={notifications || []} session={session} closeModal={() => setModalIsOpen(false)} /> : null}
    </div>
  )
}

export default NotificationBlock
