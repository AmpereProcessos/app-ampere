import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

import { FaBars } from 'react-icons/fa'
import { MdOutlineCheckBox } from 'react-icons/md'
import { BiLogIn } from 'react-icons/bi'
import { TbPresentationAnalytics } from 'react-icons/tb'
import { FaUser } from 'react-icons/fa'

import LogoSVG from '../utils/svgs/logo.svg'
import AlertVolts from '../utils/svgs/alert-volts.svg'
import SleepVolts from '../utils/svgs/sleep-volts.svg'

import HeaderActivitesBlock from './identificador/atividades/HeaderActivitesBlock'
import Avatar from './utils/Avatar'
import NotificationModal from './NotificationModal'
import { AppContext } from '../context/AppContext'
import ConfigDropDown from './ConfigDropDown'
import { formatNameAsInitials } from '../utils/methods/formatting'

function Header({ toggleSidebar }) {
  const { notificacoes } = useContext(AppContext)
  const { data: session, status } = useSession()
  const router = useRouter()

  const [configDropDown, setConfigDropDown] = useState(false)
  const [notificationIsOpen, setNotificationIsOpen] = useState(false)
  let unreadArr = notificacoes ? notificacoes.filter((x) => x.lido == false) : 0
  const [unreadCount, setUnreadCount] = useState(unreadArr.length)

  useEffect(() => {
    let unreadArr = notificacoes ? notificacoes.filter((x) => x.lido == false) : 0
    setUnreadCount(unreadArr.length)
  }, [notificacoes])
  if (router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')) return null
  if (status == 'loading' || status == 'unauthenticated') return null
  return (
    <div className="sticky top-0 z-[1] grid h-[70px] w-full grid-cols-3 items-center border-b border-gray-200 bg-[#fff] px-3 lg:px-12">
      <div className="flex items-center gap-x-2">
        <FaBars onClick={toggleSidebar} style={{ fontSize: '23px', color: '#15599a', cursor: 'pointer' }} />
      </div>
      <div className="flex h-[58px] cursor-pointer items-center justify-center">
        <Link href="/">
          <Image height={'58px'} width={'58px'} src={LogoSVG} objectFit="fill" />
        </Link>
      </div>

      <div className="flex items-center justify-end gap-1 lg:gap-3">
        <p className="hidden lg:block">
          Seja bem vindo, <strong className="text-[#15599a]">{session?.user.name}</strong> !
        </p>
        <div onClick={() => setConfigDropDown((prev) => !prev)}>
          <Avatar url={session.user?.image} fallback={formatNameAsInitials(session.user?.nome || 'USER')} height={40} width={40} />
        </div>
        <div onClick={() => setNotificationIsOpen(!notificationIsOpen)} className="hidden:flex cursor-pointer items-center">
          {unreadCount > 0 ? (
            <div className="flex items-center justify-center">
              <div className="hidden h-[22px] w-[25px] items-center duration-500 ease-in-out hover:scale-105 lg:flex">
                <Image src={AlertVolts} />
              </div>
              <p className="mb-2 hidden h-[20px] w-[20px] items-center justify-center rounded-full bg-red-500 text-center text-xs font-bold lg:flex">
                {unreadCount}
              </p>
            </div>
          ) : (
            <div className="hidden h-[22px] w-[25px] items-center duration-500 ease-in-out hover:scale-105 lg:flex">
              <Image src={SleepVolts} />
            </div>
          )}
        </div>
        <HeaderActivitesBlock session={session} />
        {session?.user.manager && (
          <div className="hidden lg:block">
            <Link href="/admin/relatorioAdministrativo">
              <TbPresentationAnalytics
                style={{
                  fontSize: '25px',

                  cursor: 'pointer',
                  color: '#fead61',
                }}
              />
            </Link>
          </div>
        )}
        <div className="text-[#fead61] duration-500 ease-in-out hover:scale-105 hover:text-orange-500">
          <BiLogIn
            onClick={() => signOut()}
            style={{
              fontSize: '25px',
              cursor: 'pointer',
              color: '#fead61',
            }}
          />
        </div>
      </div>
      {configDropDown && <ConfigDropDown closeConfigDropDown={() => setConfigDropDown(false)} setNotificationIsOpen={setNotificationIsOpen} />}
      {notificationIsOpen && <NotificationModal setNotificationIsOpen={setNotificationIsOpen} />}
    </div>
  )
}

export default Header
