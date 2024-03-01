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

import HeaderActivitesBlock from './identificador/atividades/HeaderActivitesBlock'
import Avatar from './utils/Avatar'
import NotificationBlock from './identificador/notificacoes/NotificationBlock'
import ConfigDropDown from './ConfigDropDown'
import { formatNameAsInitials } from '../utils/methods/formatting'

type HeaderProps = {
  toggleSidebar: () => void
}
function Header({ toggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const publicOrDocumentPath = router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')

  const [configDropDown, setConfigDropDown] = useState<boolean>(false)
  if (publicOrDocumentPath) return null

  if (status != 'authenticated') return null
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
          Bem vindo, <strong className="text-[#15599a]">{session.user.nome}</strong> !
        </p>
        <div onClick={() => setConfigDropDown((prev) => !prev)}>
          <Avatar url={session.user.avatar_url} fallback={formatNameAsInitials(session.user?.nome || 'USER')} height={40} width={40} />
        </div>
        <NotificationBlock session={session} />
        <HeaderActivitesBlock session={session} />
        {session?.user.permissoes.gestao.visualizarResultados ? (
          <button className="hidden text-[#fead41] lg:block">
            <Link href="/admin/relatorioAdministrativo">
              <TbPresentationAnalytics size={25} />
            </Link>
          </button>
        ) : null}
        <button className="text-[#fead61] duration-500 ease-in-out hover:scale-105 hover:text-orange-500">
          <BiLogIn onClick={() => signOut()} size={25} />
        </button>
      </div>
      {configDropDown && <ConfigDropDown closeConfigDropDown={() => setConfigDropDown(false)} />}
      {/* {notificationIsOpen && <NotificationModal setNotificationIsOpen={setNotificationIsOpen} />} */}
    </div>
  )
}

export default Header
