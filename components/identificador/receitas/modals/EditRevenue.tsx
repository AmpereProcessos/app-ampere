import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Session } from 'next-auth'
import { useQueryClient } from '@tanstack/react-query'

import { VscChromeClose } from 'react-icons/vsc'

import { useRevenueById } from '@/utils/methods/query/revenues'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { editRevenue } from '@/utils/methods/mutation/revenues'
import { TRevenue, TRevenueDTO } from '@/utils/schemas/revenues'

import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import RevenueProjectVinculation from '../modals/blocos/utils/ProjectVinculation'
import RevenueProjectInformationBlock from '../modals/blocos/ProjectInformationBlock'
import RevenueGeneralInformationBlock from './blocos/GeneralInformationBlock'
import RevenueReceiptsBlock from './blocos/ReceiptsBlock'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenueDTO['fracionamento'] }) {
  const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}
type EditRevenueProps = {
  revenueId: string
  session: Session
  closeModal: () => void
}
function EditRevenue({ revenueId, session, closeModal }: EditRevenueProps) {
  const queryClient = useQueryClient()
  const { data: revenue, isLoading, isError, isSuccess, error } = useRevenueById({ id: revenueId })
  const [infoHolder, setInfoHolder] = useState<TRevenue>({
    nome: '',
    tipo: '',
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
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
    dataInsercao: new Date().toISOString(),
  })

  const { mutate: handleEditRevenue, isPending: isUpdateLoading } = useMutationWithFeedback({
    mutationKey: ['edit-revenue', revenueId],
    mutationFn: editRevenue,
    queryClient: queryClient,
    affectedQueryKey: ['revenues'],
    callbackFn: () => console.log(),
  })
  useEffect(() => {
    if (revenue) setInfoHolder(revenue)
  }, [revenue])
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[70%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">ATUALIZAR RECEITA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            <>
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <RevenueGeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
                {revenue.projetoDados ? (
                  <RevenueProjectInformationBlock revenue={infoHolder} project={revenue.projetoDados} />
                ) : (
                  <RevenueProjectVinculation
                    revenueId={revenueId}
                    infoHolder={infoHolder}
                    setInfoHolder={setInfoHolder}
                    affectedQueryKey={['revenue-by-id', revenueId]}
                    queryClient={queryClient}
                  />
                )}
                <RevenueReceiptsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} />
              </div>
              <div className="mt-2 flex w-full items-center justify-end">
                <LoadingButton
                  loading={isUpdateLoading}
                  onClick={() =>
                    //@ts-ignore
                    handleEditRevenue({ id: revenueId, changes: infoHolder })
                  }
                  type="button"
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  ATUALIZAR RECEITA
                </LoadingButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditRevenue
