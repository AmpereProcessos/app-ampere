import UnauthorizedSVG from '@/utils/svgs/unauthorized.svg'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
export default function UnauthorizedComponent() {
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center gap-2">
      <div className="relative h-[70%] min-h-[70%] w-[70%] min-w-[70%]">
        <Image src={UnauthorizedSVG} alt="Não autorizado !" fill={true} />
      </div>
      <Button variant={'ghost'} asChild>
        <Link href="/">VOLTAR PARA A PÁGINA INICIAL</Link>
      </Button>
    </div>
  )
}
