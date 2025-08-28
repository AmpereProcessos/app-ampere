import SelectInputVirtualized from '@/components/inputs/SelectVirtualized'
import TextInput from '@/components/inputs/Text'
import ResponsiveDialogDrawer from '@/components/utils/ResponsiveDialogDrawer'
import { TAuthSession } from '@/lib/authentication/types'
import { TSupportCall } from '@/utils/schemas/support-calls'
import { Check, LayoutGrid, Loader, X } from 'lucide-react'
import { useState } from 'react'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import SelectInput from '@/components/inputs/Select'
import TextareaInput from '@/components/inputs/TextareaInput'
import { FaSolarPanel, FaWrench } from 'react-icons/fa'
import DateInput from '@/components/inputs/Date'
import { formatDate, tiposChamadosSuporte } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '@/utils/methods/handlers'
import { createSupportCall } from '@/utils/methods/mutation/support-calls'
import { useUsers } from '@/utils/methods/query/users'
import SelectWithImages from '@/components/inputs/SelectWithImages'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { BsCalendarCheck } from 'react-icons/bs'
import { General, PowerPlantInfo, WarrantyInfo } from './Content'

const AllStates = StatesAndCities.map((s) => s.sigla).map((c, index) => ({ id: index + 1, value: c, label: c }))
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, value: c, label: c }))

type NewSupportCallProps = {
  session: TAuthSession
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onError?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function NewSupportCall({ session, closeModal, callbacks }: NewSupportCallProps) {
  const [infoHolder, setInfoHolder] = useState<TSupportCall>({
    responsavel: session.user.id,
    statusChamado: 'ABERTO',
    tipoChamado: 'SUPORTE',
    abertura: new Date().toISOString(),
    responsavelUsuario: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })
  function updateInfoHolder(info: Partial<TSupportCall>) {
    setInfoHolder((prev) => ({ ...prev, ...info }))
  }

  const { mutate: handleCreateSupportCall, isPending: createSupportCallIsPending } = useMutation({
    mutationFn: createSupportCall,
    onMutate: async () => {
      callbacks?.onMutate?.()
    },
    onSuccess: (data) => {
      toast.success(data.message)
      callbacks?.onSuccess?.()
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
      callbacks?.onError?.()
    },
    onSettled: () => {
      callbacks?.onSettled?.()
    },
  })

  return (
    <ResponsiveDialogDrawer
      menuTitle="NOVO CHAMADO DE SUPORTE"
      menuDescription="Preencha os campos abaixo para criar um novo chamado de suporte."
      menuActionButtonText="CRIAR CHAMADO"
      menuCancelButtonText="CANCELAR"
      actionFunction={() => handleCreateSupportCall({ info: infoHolder })}
      actionIsPending={createSupportCallIsPending}
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogContentClassName="gap-6"
    >
      <General infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
      <PowerPlantInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
      <WarrantyInfo infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
    </ResponsiveDialogDrawer>
  )
}

export default NewSupportCall
