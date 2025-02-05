import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { BsCalendarFill, BsCalendarPlus, BsCode } from 'react-icons/bs'
import { FaUser, FaUserAlt } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { centrosDeCusto, formatDate, formatToMoney } from '../../../../utils/constants'
import ExpenseListItem from '../ExpenseListItem'
import { updateExpense } from '../../../../utils/methods/mutation/expenses'
import { getErrorMessage } from '../../../../utils/methods/handlers'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import DateInput from '../../../inputs/Date'
import CheckboxInput from '../../../inputs/Checkbox'
import { Session } from 'next-auth'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'
import { TExpense, TExpenseDTO } from '@/utils/schemas/expenses'
import { useExpenseById } from '@/utils/methods/query/expenses'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { formatDateInputChange } from '@/utils/methods/shared'
import SelectInput from '@/components/inputs/Select'
import ProjectVinculationMenu from '../ProjectVinculationMenu'
import NumberInput from '@/components/inputs/Number'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import EditExpenseFinalPriceMenu from '../EditExpenseFinalPriceMenu'
import Payments from '../Payments'
import ExpenseGeneralInformationBlock from './blocos/GeneralInformationBlock'
import ExpenseProjectInformationBlock from './blocos/ProjectInformationBlock'
import ExpenseProjectVinculation from './blocos/utils/ProjectVinculation'
import ExpenseItemsInformationBlock from './blocos/ItemsInformationBlock'
import ExpensePaymentsBlock from './blocos/PaymentsBlock'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'

function getMissingPercentage({ payments }: { payments: TExpenseDTO['pagamentos'] }) {
  const currentTotal = payments.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}

function getExpenseCategories(costApportionment: string) {
  if (!costApportionment) return []
  const costApportionmentsObj = centrosDeCusto.find((center) => center.nome == costApportionment)
  if (!costApportionmentsObj) return []

  const options = costApportionmentsObj.categorias.map((category, index) => ({
    id: index + 1,
    ...category,
  }))
  return options
}
type ExpenseModalProps = {
  expenseId: string
  session: Session
  closeModal: () => void
  callbacks?: {
    onMutate?: () => void
    onSuccess?: () => void
    onSettled?: () => void
  }
}
function ExpenseModal({ expenseId, session, closeModal, callbacks }: ExpenseModalProps) {
  const queryClient = useQueryClient()
  const { data: expense, isLoading, isError, isSuccess } = useExpenseById({ id: expenseId })
  const [infoHolder, setInfoHolder] = useState<TExpenseDTO>({
    _id: '',
    rateio: '',
    categoria: '',
    descricao: '',
    projeto: {
      id: null,
      nome: null,
      identificador: null,
      tipo: null,
    },
    autor: {
      id: session.user?.id,
      nome: session.user.nome,
    },
    itens: [],
    total: 0,
    efetivacao: {
      efetivado: false,
      data: null,
    },
    pagamentos: [],
    criterioReferencia: false,
    criterioCompetencia: false,
    dataInsercao: new Date().toISOString(),
  })

  function resetInfoHolder() {
    setInfoHolder({
      _id: '',
      rateio: '',
      categoria: '',
      descricao: '',
      projeto: {
        id: null,
        nome: null,
        identificador: null,
        tipo: null,
      },
      autor: {
        id: session.user?.id,
        nome: session.user.nome,
      },
      itens: [],
      total: 0,
      efetivacao: {
        efetivado: false,
        data: null,
      },
      pagamentos: [],
      criterioReferencia: false,
      criterioCompetencia: false,
      dataInsercao: new Date().toISOString(),
    })
  }
  const { mutate: handleUpdateExpense, isPending } = useMutation({
    mutationKey: ['edit-expense', expenseId],
    mutationFn: updateExpense,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['expense-by-id', expenseId] })
      if (!!callbacks?.onMutate) callbacks.onMutate()
    },
    onSuccess: async (data) => {
      if (!!callbacks?.onSuccess) callbacks.onSuccess()
      return toast.success(data)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['expense-by-id', expenseId] })
      if (!!callbacks?.onSettled) callbacks.onSettled()
      resetInfoHolder()
    },
    onError: (error) => {
      const msg = getErrorMessage(error)
      return toast.error(msg)
    },
  })
  useEffect(() => {
    if (expense) setInfoHolder(expense)
  }, [expense])

  return (
    <div id="edit-expense" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[75%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-[#353432] dark:text-white ">ATUALIZAR DESPESA</h3>
              <h1 className="text-xxs text-gray-500">#{expenseId}</h1>
            </div>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Houve um erro ao buscar informações da despesa.'} /> : null}
          {isSuccess ? (
            <>
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <ExpenseGeneralInformationBlock
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>}
                />

                {expense.projetoDados ? (
                  <ExpenseProjectInformationBlock expense={infoHolder} project={expense.projetoDados} />
                ) : (
                  <ExpenseProjectVinculation
                    expenseId={undefined}
                    infoHolder={infoHolder}
                    setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>}
                    affectedQueryKey={['expenses']}
                    queryClient={queryClient}
                  />
                )}
                <ExpenseItemsInformationBlock
                  infoHolder={infoHolder}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>}
                />

                <ExpensePaymentsBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TExpense>>} />
              </div>
              <div className="mt-2 flex w-full items-center justify-end">
                <LoadingButton
                  loading={isPending}
                  onClick={() =>
                    //@ts-ignore
                    handleUpdateExpense({ id: expenseId, changes: infoHolder })
                  }
                  type="button"
                  className="bg-blue-800 hover:bg-blue-700"
                >
                  ATUALIZAR DESPESA
                </LoadingButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ExpenseModal
