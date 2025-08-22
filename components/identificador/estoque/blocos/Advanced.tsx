import { TMaterialDeletionDataOutput } from '@/pages/api/almoxarifado/materiais/exclusao'
import { Settings } from 'lucide-react'

type AdvancedProps = {
  deletionData: TMaterialDeletionDataOutput
}

export default function Advanced({ deletionData }: AdvancedProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-fit items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
        <Settings className="min-w-4 min-h-4 h-4 w-4" />
        <h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">INFORMAÇÕES DE CONTROLE DE QUANTIDADE</h1>
      </div>
    </div>
  )
}
