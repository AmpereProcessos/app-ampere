import Link from 'next/link'
import React from 'react'
import { MdOutlineSecurity } from 'react-icons/md'
import { Button } from '../ui/button'

function UnauthenticatedPage() {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center">
      <MdOutlineSecurity className="text-red-500" size={35} />
      <p className="text-primary/60 text-sm font-medium italic">Você precisa estar autenticado para acessar essa página.</p>
      <Button variant={'ghost'} asChild>
        <Link href="/auth/signin">FAZER LOGIN</Link>
      </Button>
    </div>
  )
}

export default UnauthenticatedPage
