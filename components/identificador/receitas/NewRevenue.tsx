import React, { useEffect, useState } from 'react'
import { FaLink } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import SelectInput from '../../inputs/Select'
import { centrosDeCusto, expenseCategories, formatDate, formatToMoney } from '../../../utils/constants'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import { MdDelete } from 'react-icons/md'

import { insertExpense } from '../../../utils/methods/mutation/expenses'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { useQueryClient } from 'react-query'
import DateInput from '../../inputs/Date'
import { Session } from 'next-auth'
import { TRevenue, TRevenueDTO } from '@/utils/schemas/revenues'
import { paymentMethods, revenueSources } from '@/utils/select-options'
import CheckboxInput from '@/components/inputs/Checkbox'
import { formatDateInputChange } from '@/utils/methods/shared'
import ProjectVinculationMenu from '../despesas/ProjectVinculationMenu'
import Fractionnements from './Fractionnements'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createRevenue } from '@/utils/methods/mutation/revenues'

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenue['fracionamento'] }) {
  const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}
type NewRevenueProps = {
  session: Session
  closeModal: () => void
}
function NewRevenue({ session, closeModal }: NewRevenueProps) {
  const queryClient = useQueryClient()
  const initialInfoHolder = {
    nome: '',
    tipo: '',
    autor: {
      id: session.user.id,
      nome: session.user.name,
      avatar_url: session.user.image,
    },
    projeto: {
      id: null,
      nome: null,
      identificador: null,
    },
    total: 0,
    metodo: '',
    efetivacao: {
      efetivado: false,
      data: null,
    },
    fracionamento: [],
    criterioReferencia: false,
    criterioCompetencia: false,
    dataInsercao: new Date().toISOString(),
  }
  const [infoHolder, setInfoHolder] = useState<TRevenue>({
    nome: '',
    tipo: '',
    autor: {
      id: session.user.id,
      nome: session.user.name,
      avatar_url: session.user.image,
    },
    projeto: {
      id: null,
      nome: null,
      identificador: null,
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

  function linkClient(info: any) {
    const { _id, nomeDoContrato, qtde } = info
    const project = {
      id: _id,
      nome: nomeDoContrato,
      identificador: qtde,
    }
    setInfoHolder((prev) => ({ ...prev, projeto: project }))
    toast.success('Projeto vinculado com sucesso!')
    return
  }
  function unlinkClient() {
    setInfoHolder((prev) => ({
      ...prev,
      projeto: {
        id: null,
        nome: null,
        identificador: null,
      },
    }))
  }

  const { mutate: handleCreateRevenue, isLoading } = useMutationWithFeedback({
    mutationKey: ['create-revenue'],
    mutationFn: createRevenue,
    queryClient: queryClient,
    affectedQueryKey: ['revenues'],
    callbackFn: () => console.log(),
  })
  async function validate() {
    if (!infoHolder.tipo) {
      toast.error('Preencha o tipo da receita.')
      return false
    }
    if (infoHolder.total <= 0) {
      toast.error('Valor da receita inválido.')
      return false
    }
  }

  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA RECEITA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <ProjectVinculationMenu linkClient={linkClient} unlinkClient={unlinkClient} />
            {infoHolder.projeto ? (
              <>
                <div className="my-2 flex w-full flex-col">
                  <h1 className="w-full text-center font-raleway text-sm font-normal text-gray-500">NOME DO PROJETO</h1>
                  <p className="w-full text-center font-raleway text-lg font-black text-gray-700">{infoHolder.projeto.nome}</p>
                </div>
              </>
            ) : null}
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
            </div>
            <Fractionnements
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
              missingPercentage={getMissingPercentage({ fractionnement: infoHolder.fracionamento })}
            />
          </div>
          <div className="mt-2 flex w-full items-center justify-end">
            <button
              disabled={isLoading}
              // @ts-ignore
              onClick={() => handleCreateRevenue({ info: infoHolder })}
              className="w-fit rounded border border-green-500 py-1 px-4 text-sm font-medium text-green-500 disabled:border-gray-500 disabled:text-gray-500 hover:bg-green-500 hover:text-white"
            >
              CRIAR RECEITA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewRevenue
