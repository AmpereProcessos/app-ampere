'use client'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from '../components/providers/SessionProvider'

import { FaBars } from 'react-icons/fa'

import { BiLogIn } from 'react-icons/bi'
import { TbPresentationAnalytics } from 'react-icons/tb'

import LogoSVG from '../utils/svgs/logo.svg'
import WhiteLogoSVG from '../utils/svgs/logo-texto-branco-vertical.svg'

import HeaderActivitesBlock from './identificador/atividades/HeaderActivitesBlock'
import Avatar from './utils/Avatar'
import ConfigDropDown from './ConfigDropDown'
import { formatNameAsInitials } from '../utils/methods/formatting'
import Notifications from './utils/Notifications'
import { ThemeToggle } from './utils/ThemeToggle'
import { Button } from './ui/button'
import { AreaChart } from 'lucide-react'

type HeaderProps = {
  toggleSidebar: () => void
}
function Header({ toggleSidebar }: HeaderProps) {
  const { session, status } = useSession({})
  const router = useRouter()
  const [configDropDown, setConfigDropDown] = useState<boolean>(false)

  const isPublicOrDocumentPath = router.pathname.includes('pdf') || router.pathname.includes('publico') || router.pathname.includes('auth')

  if (isPublicOrDocumentPath) return null
  if (status !== 'authenticated') return null
  return (
    <div className="border-primary/30 bg-background sticky top-0 z-1 flex h-[70px] w-full items-center gap-2 border-b px-3 lg:px-12">
      <div className="flex w-1/3 items-center justify-start gap-2">
        <Button variant="ghost" onClick={toggleSidebar}>
          <FaBars className="text-primary h-4 w-4" />
        </Button>
      </div>
      <div className="flex w-1/3 items-center justify-center gap-2">
        <div className="flex h-[58px] cursor-pointer items-center justify-center">
          <div className="relative flex h-[58px] w-[58px] dark:hidden">
            <Link href="/">
              <Image fill={true} src={LogoSVG} alt="Logo Padrão" />
            </Link>
          </div>
          <div className="relative hidden h-[58px] w-[58px] dark:flex">
            <Link href="/">
              <Image fill={true} src={WhiteLogoSVG} alt="Logo Branca" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex w-1/3 items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => setConfigDropDown((prev) => !prev)}>
          <Avatar url={session.user.avatar_url} fallback={formatNameAsInitials(session.user?.nome || 'USER')} height={35} width={35} />
        </Button>

        <Notifications session={session} />
        <HeaderActivitesBlock session={session} />
        {session?.user.permissoes.gestao.visualizarResultados ? (
          <Button variant="ghost" asChild className="hidden lg:flex">
            <Link href="/admin/relatorio">
              <AreaChart className="text-primary h-4 w-4" />
            </Link>
          </Button>
        ) : null}
        <ThemeToggle />

        <Button variant="ghost" asChild>
          <Link href="/api/auth/logout">
            <BiLogIn className="text-primary h-4 w-4" />
          </Link>
        </Button>
      </div>
      {configDropDown && <ConfigDropDown closeConfigDropDown={() => setConfigDropDown(false)} />}
    </div>
  )
}

export default Header
