import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { BsCalendarFill, BsCalendarPlus, BsCode } from 'react-icons/bs'
import { FaUser, FaUserAlt } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { centrosDeCusto, formatDate, formatToMoney } from '../../../utils/constants'
import ExpenseListItem from './ExpenseListItem'
import { updateExpense } from '../../../utils/methods/mutation/expenses'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import DateInput from '../../inputs/Date'
import CheckboxInput from '../../inputs/Checkbox'
import { Session } from 'next-auth'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'
import { TExpenseDTO } from '@/utils/schemas/expenses'
import { useExpenseById } from '@/utils/methods/query/expenses'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { formatDateInputChange } from '@/utils/methods/shared'
import SelectInput from '@/components/inputs/Select'
import ProjectVinculationMenu from './ProjectVinculationMenu'
import NumberInput from '@/components/inputs/Number'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'

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
}
function ExpenseModal({ expenseId, session, closeModal }: ExpenseModalProps) {
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
      nome: session.user?.name,
    },
    itens: [],
    total: 0,
    efetivacao: {
      efetivado: false,
      data: null,
    },
    criterioReferencia: false,
    criterioCompetencia: false,
    dataInsercao: new Date().toISOString(),
  })
  function getExpenseTotal(itens: TExpenseDTO['itens']) {
    const total = itens.reduce((acc, current) => {
      const price = current.preco ? current.preco : 0
      const qtde = current.qtde ? current.qtde : 0
      const toSum = price * qtde
      return acc + toSum
    }, 0)
    return Number(total.toFixed(2))
  }
  function handleLink(info: { id: string | null; nome: string | null; identificador: string | number | null }) {
    const { id, nome, identificador } = info
    const project = {
      id: id,
      nome: nome,
      identificador: identificador,
    }
    setInfoHolder((prev) => ({ ...prev, projeto: project }))

    return toast.success('Projeto vinculado com sucesso!')
  }
  function handleUnlink() {
    setInfoHolder((prev) => ({
      ...prev,
      projeto: {
        id: null,
        nome: null,
        identificador: null,
      },
    }))
  }

  const { mutate: handleUpdateExpense } = useMutationWithFeedback({
    mutationKey: ['edit-expense', expenseId],
    mutationFn: updateExpense,
    queryClient: queryClient,
    affectedQueryKey: ['expenses'],
    callbackFn: async () => await queryClient.invalidateQueries({ queryKey: ['expense-by-id', expenseId] }),
  })
  useEffect(() => {
    if (expense) setInfoHolder(expense)
  }, [expense])
  useEffect(() => {
    const total = getExpenseTotal(infoHolder.itens)
    setInfoHolder((prev) => ({ ...prev, total: total }))
  }, [infoHolder.itens])
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
            <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              <div className="mt-2 flex w-full items-center justify-center">
                <div className={`flex items-center gap-2`}>
                  <BsCalendarPlus />
                  <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(expense.dataInsercao)}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Avatar fallback={'U'} height={25} width={25} url={expense.autor?.avatar_url || undefined} />
                  <p className="text-xs font-medium text-gray-500">{expense.autor?.nome}</p>
                </div>
              </div>
              <ProjectVinculationMenu handleLink={handleLink} handleUnlink={handleUnlink} />
              {infoHolder.projeto?.id ? (
                <div className="flex w-[90%] flex-col items-center justify-center gap-2 self-center rounded border border-gray-500 p-3 md:flex-row md:gap-4 lg:w-1/2">
                  <div className="flex items-center gap-2">
                    <BsCode size={'20px'} color="rgb(31,41,55)" />
                    <p className="cursor-pointer font-raleway text-sm font-medium">#{infoHolder.projeto.identificador || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUser size={'20px'} color="rgb(31,41,55)" />
                    <p className="font-raleway text-sm font-medium">{infoHolder.projeto.nome || 'N/A'}</p>
                  </div>
                </div>
              ) : null}
              <div className="my-2 flex w-full flex-col gap-2 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <SelectInput
                    editable={true}
                    label={'RATEIO / CENTRO DE CUSTO'}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    value={infoHolder.rateio}
                    options={centrosDeCusto.map((center, index) => ({
                      id: index + 1,
                      label: center.nome,
                      value: center.nome,
                    }))}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, rateio: value }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, rateio: '' }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <SelectInput
                    editable={true}
                    label={'CATEGORIA'}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    value={infoHolder.categoria}
                    options={getExpenseCategories(infoHolder.rateio)}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: '' }))}
                    width={'100%'}
                  />
                </div>
              </div>
              <div className="my-2 flex w-full flex-col justify-center gap-2 md:flex-row">
                <CheckboxInput
                  checked={infoHolder.criterioCompetencia}
                  labelFalse={'NÃO APLICÁVEL A CRITÉRIO DE COMPETÊNCIA'}
                  labelTrue={'APLICÁVEL A CRITÉRIO DE COMPETÊNCIA'}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      criterioCompetencia: value,
                    }))
                  }
                />
                <CheckboxInput
                  checked={infoHolder.criterioReferencia}
                  labelFalse={'NÃO APLICÁVEL A CRITÉRIO DE REFERÊNCIA'}
                  labelTrue={'APLICÁVEL A CRITÉRIO DE REFERÊNCIA'}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      criterioReferencia: value,
                    }))
                  }
                />
              </div>
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
              <div className="flex w-full flex-col">
                <h1 className="w-full rounded-tr-sm rounded-tl-sm bg-gray-500 p-1 text-center font-bold text-white">OBSERVAÇÕES</h1>
                <textarea
                  placeholder="Preencha aqui informações adicionais sobre a despesa..."
                  value={infoHolder.descricao || ''}
                  onChange={(e) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }}
                  className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
                />
              </div>
              <div className="my-2 flex w-full flex-col px-2">
                <h1 className="w-full pb-1 text-center font-raleway text-sm font-normal text-gray-500">LISTA DE ITENS</h1>
                <div className="flex w-full items-center gap-2 rounded bg-gray-500 p-2 text-white">
                  <h1 className="w-3/6 text-center font-bold">DESCRIÇÃO</h1>
                  <h1 className="w-1/6 text-center font-bold">QUANTIDADE</h1>
                  <h1 className="w-1/6 text-center font-bold">PREÇO UNITÁRIO</h1>

                  <h1 className="w-1/6 text-center font-bold">VALOR TOTAL</h1>
                </div>
                {expense.itens.length > 0 ? (
                  expense.itens.map((item, index) => (
                    <ExpenseListItem key={index} item={item} index={index} items={infoHolder.itens} setExpenseInfo={setInfoHolder} />
                  ))
                ) : (
                  <div className="flex min-h-[40px] items-center justify-center">
                    <p className="text-sm italic text-gray-500">Não há itens adicionados...</p>
                  </div>
                )}
                <div className="my-2 flex w-full items-center justify-center">
                  <div className="w-full lg:w-[40%]">
                    <NumberInput
                      label={'TOTAL DA DESPESA'}
                      editable={infoHolder.itens.length == 0}
                      placeholder="Preencha o total da despesa..."
                      value={infoHolder.total}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
                      width={'100%'}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-end px-2">
                <button
                  // @ts-ignore
                  onClick={() => handleUpdateExpense({ expenseId, changes: infoHolder })}
                  className="w-fit rounded border border-blue-500 p-2 text-sm font-bold text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  SALVAR
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ExpenseModal
