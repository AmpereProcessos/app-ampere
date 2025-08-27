import AllocatorsBlock from '@/components/identificador/configuracoes/AllocatorsBlock'
import { useSession } from '@/components/providers/SessionProvider'
import LoadingPage from '@/components/utils/LoadingPage'
import UnauthenticatedComponent from '@/components/utils/UnauthenticatedComponent'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'

function ConfigurationsMainPage() {
  const { session, status } = useSession()
  if (status === 'loading') return <LoadingPage />
  if (status === 'unauthenticated') return <UnauthenticatedComponent />
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
      <div className="border-primary/20 flex w-full flex-col border-b px-6 pb-2">
        <h1 className="text-2xl font-black tracking-tight text-[#15599a]">CONFIGURAÇÕES</h1>
        <p className="text-muted-foreground">Gerencie configurações e preferências</p>
      </div>
      <div className="flex grow flex-col items-center gap-2 py-2 lg:flex-row">
        <div className="flex h-fit w-full flex-col gap-1 px-2 py-2 lg:h-full lg:w-1/5">
          <button
            type="button"
            onClick={() => setMode('profile')}
            className={`${
              mode === 'profile' ? 'bg-secondary' : ''
            } text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
          >
            Perfil
          </button>
          <button
            type="button"
            onClick={() => setMode('allocators')}
            className={`${
              mode === 'allocators' ? 'bg-secondary' : ''
            } text-muted-foreground hover:bg-secondary w-full rounded-md px-4 py-2 text-center text-xs font-semibold duration-300 ease-in-out lg:text-start lg:text-base`}
          >
            Alocadores de Ativos
          </button>
        </div>
        <div className="flex h-full w-full flex-col gap-1 px-2 py-2 lg:w-4/5">
          {/* {mode == 'profile' ? <ProfileBlock session={session} /> : null} */}
          {mode === 'allocators' ? <AllocatorsBlock session={session} /> : null}
        </div>
      </div>
    </div>
  )
}
