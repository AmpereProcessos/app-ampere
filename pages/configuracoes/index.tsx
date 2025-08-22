import AllocatorsBlock from '@/components/identificador/configuracoes/AllocatorsBlock'
import LoadingPage from '@/components/utils/LoadingPage'
import type { TAuthSession } from '@/lib/authentication/types'
import { useSession } from '@/components/providers/SessionProvider'
import React, { useState } from 'react'

function ConfigurationsMainPage() {
  const { session, status } = useSession({ required: true })
  if (status != 'authenticated') return <LoadingPage />
  return <ConfigurationBlock session={session} />
}

export default ConfigurationsMainPage

type ConfigurationPageModes = 'profile' | 'users' | 'allocators'
type ConfigurationBlockProps = {
  session: TAuthSession
}
function ConfigurationBlock({ session }: ConfigurationBlockProps) {
  const [mode, setMode] = useState<ConfigurationPageModes>('allocators')
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex w-full flex-col border-b border-primary/20 px-6 pb-2">
        <h1 className="text-2xl font-black tracking-tight text-[#15599a]">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground">Gerencie configurações e preferências</p>
      </div>
      <div className="flex grow flex-col items-center gap-2 py-2 lg:flex-row">
        <div className="flex h-fit w-full flex-col gap-1 px-2 py-2 lg:h-full lg:w-1/5">
          <button
            onClick={() => setMode('profile')}
            className={`${
              mode == 'profile' ? 'bg-secondary' : ''
            } w-full rounded-md px-4 py-2 text-center text-xs font-semibold text-muted-foreground duration-300 ease-in-out hover:bg-secondary lg:text-start lg:text-base`}
          >
            Perfil
          </button>
          <button
            onClick={() => setMode('allocators')}
            className={`${
              mode == 'allocators' ? 'bg-secondary' : ''
            } w-full rounded-md px-4 py-2 text-center text-xs font-semibold text-muted-foreground duration-300 ease-in-out hover:bg-secondary lg:text-start lg:text-base`}
          >
            Alocadores de Ativos
          </button>
        </div>
        <div className="flex h-full w-full flex-col gap-1 px-2 py-2 lg:w-4/5">
          {/* {mode == 'profile' ? <ProfileBlock session={session} /> : null} */}
          {mode == 'allocators' ? <AllocatorsBlock session={session} /> : null}
        </div>
      </div>
    </div>
  )
}
