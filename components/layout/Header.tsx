'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from '@/components/providers/SessionProvider'

import { FaBars } from 'react-icons/fa'

import { BiLogIn } from 'react-icons/bi'
import { TbPresentationAnalytics } from 'react-icons/tb'

import LogoSVG from '@/utils/svgs/logo.svg'
import WhiteLogoSVG from '@/utils/svgs/logo-texto-branco-vertical.svg'

import HeaderActivitesBlock from '@/components/identificador/atividades/HeaderActivitesBlock'
import ConfigDropDown from '@/components/ConfigDropDown'
import { formatNameAsInitials } from '@/utils/methods/formatting'
import Notifications from '@/components/utils/Notifications'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '../utils/ThemeToggle'
import { useTheme } from 'next-themes'
import { Button } from '../ui/button'
import { AreaChart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

type HeaderProps = {
  toggleSidebar: () => void
}
function Header({ toggleSidebar }: HeaderProps) {
  const { theme } = useTheme()
  const { session, status } = useSession({})
  const pathname = usePathname()
  const publicOrDocumentPath = pathname?.includes('pdf') || pathname?.includes('publico') || pathname?.includes('auth')

  const [configDropDown, setConfigDropDown] = useState<boolean>(false)
  if (publicOrDocumentPath) return null

  if (status !== 'authenticated') return null
  return (
    <div className="border-primary/30 bg-background sticky top-0 z-1 flex h-[70px] w-full items-center gap-2 border-b px-3 lg:px-12">
      <div className="flex w-1/3 items-center justify-start gap-2">
        <Button variant="ghost" onClick={toggleSidebar} size={'fit'} className="p-2">
          <FaBars className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
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
        <Button variant="ghost" onClick={() => setConfigDropDown((prev) => !prev)} size={'fit'} className="p-2">
          <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
            <AvatarImage src={session.user.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs">{formatNameAsInitials(session.user?.nome || 'USER')}</AvatarFallback>
          </Avatar>
        </Button>

        <Notifications session={session} />
        <HeaderActivitesBlock session={session} />
        {session?.user.permissoes.gestao.visualizarResultados ? (
          <Button variant="ghost" asChild size={'fit'} className="hidden p-2 lg:flex">
            <Link href="/admin/relatorio">
              <AreaChart className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>
        ) : null}
        <ThemeToggle />

        <Button variant="ghost" asChild size={'fit'} className="p-2">
          <Link href="/api/auth/logout">
            <BiLogIn className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
          </Link>
        </Button>
      </div>
      {configDropDown && <ConfigDropDown closeConfigDropDown={() => setConfigDropDown(false)} />}
    </div>
  )
}

export default Header
