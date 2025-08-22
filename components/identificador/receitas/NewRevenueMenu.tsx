import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue } from '@/utils/schemas/revenues'
import { paymentMethods, revenueSources } from '@/utils/select-options'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import Fractionnements from './Fractionnements'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { createRevenue } from '@/utils/methods/mutation/revenues'

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenue['fracionamento'] }) {
  const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}

type NewRevenueMenuProps = {
  session: TAuthSession
  projectId?: string | null
  projectName?: string | null
  projectIdentificator?: string | null
  closeMenu: () => void
}
function NewRevenueMenu({ session, projectId, projectName, projectIdentificator }: NewRevenueMenuProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TRevenue>({
    nome: '',
    tipo: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    projeto: {
      id: projectId,
      nome: projectName,
      identificador: projectIdentificator,
    },
    total: 0,
    metodo: '',
    efetivacao: {
      efetivado: true,
      data: null,
    },
    fracionamento: [],
    dataInsercao: new Date().toISOString(),
  })
  const { mutate: handleCreateRevenue, isPending } = useMutationWithFeedback({
    mutationKey: ['create-revenue'],
    mutationFn: createRevenue,
    queryClient: queryClient,
    affectedQueryKey: ['project-revenues', projectId],
    callbackFn: () => console.log(),
  })
  return (
    <div className="mt-2 flex w-[90%] flex-col gap-2 self-center rounded border border-gray-500 p-2">
      <div className="my-2 flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NOME DA RECEITA"
            placeholder="Preencha o nome da receita..."
            value={infoHolder.nome}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="TIPO"
            options={revenueSources}
            selectedItemLabel="NÃO DEFINIDO"
            value={infoHolder.tipo}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipo: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tipo: revenueSources[0].value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="my-2 flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="MÉTODO DE PAGAMENTO"
            options={paymentMethods}
            selectedItemLabel="NÃO DEFINIDO"
            value={infoHolder.metodo}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, metodo: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, metodo: paymentMethods[0].value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="VALOR"
            placeholder="Preencha aqui o valor da receita..."
            value={infoHolder.total}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="font-Inter w-fit self-center rounded-md bg-gray-300 p-2 text-xs font-medium leading-none tracking-tight text-gray-700">
        OBS: O parâmetro de efetivação se refere a data em que a receita entra no regime de competência.
      </h1>
      <div className="my-2 flex w-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <CheckboxInput
            checked={!!infoHolder.efetivacao.efetivado}
            labelFalse={'EFETIVADO'}
            labelTrue={'EFETIVADO'}
            justify="justify-center"
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                efetivacao: {
                  ...prev.efetivacao,
                  efetivado: value,
                },
              }))
            }
          />
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <DateInput
            label={infoHolder.efetivacao.efetivado ? 'DATA DA EFETIVAÇÃO' : 'PREVISÃO DE EFETIVAÇÃO'}
            labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
            value={infoHolder.efetivacao.data ? formatDate(infoHolder.efetivacao.data) : undefined}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                efetivacao: {
                  ...prev.efetivacao,
                  data: formatDateInputChange(value),
                },
              }))
            }
          />
        </div>
        <Fractionnements
          infoHolder={infoHolder}
          setInfoHolder={setInfoHolder}
          missingPercentage={getMissingPercentage({ fractionnement: infoHolder.fracionamento })}
        />
      </div>
      <div className="mt-2 flex w-full items-center justify-end">
        <button
          disabled={isPending}
          // @ts-ignore
          onClick={() => handleCreateRevenue({ info: infoHolder })}
          className="w-fit rounded border border-green-500 py-1 px-4 text-sm font-medium text-green-500 disabled:border-gray-500 disabled:text-gray-500 hover:bg-green-500 hover:text-white"
        >
          CRIAR RECEITA
        </button>
      </div>
    </div>
  )
}

export default NewRevenueMenu
