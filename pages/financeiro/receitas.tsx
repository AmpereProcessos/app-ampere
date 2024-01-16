import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ExpensesWrapper from '../../components/identificador/despesas/ExpensesWrapper'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import NewExpense from '../../components/identificador/despesas/NewExpense'
import RevenuesWrapper from '../../components/identificador/receitas/RevenuesWrapper'
import NewRevenue from '../../components/identificador/receitas/NewRevenue'
import LoadingPage from '@/components/utils/LoadingPage'
import { useRevenues } from '@/utils/methods/query/revenues'
import ErrorComponent from '@/components/utils/ErrorComponent'
import RevenueCard from '@/components/identificador/receitas/RevenueCard'
import EditRevenue from '@/components/identificador/receitas/EditRevenue'
import { VscDiffAdded } from 'react-icons/vsc'
import { MdAssignmentLate, MdAttachMoney, MdOutlineAssignmentLate, MdOutlineWatchLater } from 'react-icons/md'
import { TRevenueDTO } from '@/utils/schemas/revenues'
import dayjs from 'dayjs'
import TextInput from '@/components/inputs/Text'
function Receitas() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/auth/authHome')
    },
  })

  const isAuthorized = !!session?.user.accessibleRoutes?.includes('ADM')

  const { data: revenues, isLoading, isError, isSuccess, filters, setFilters } = useRevenues()

  const [dropdownMenuVisible, setDropdownMenuVisible] = useState<boolean>(false)
  const [newRevenueModalIsOpen, setNewExpenseModalIsOpen] = useState<boolean>(false)
  const [modalRevenue, setModalRevenue] = useState<{ isOpen: boolean; id: null | string }>({
    isOpen: false,
    id: null,
  })

  function getStats({ info }: { info?: TRevenueDTO[] }) {
    if (!info)
      return {
        recebido: 0,
        receber: 0,
        receberHoje: 0,
        emAtraso: 0,
      }

    const received = info.reduce((acc, current) => {
      const percentageReceived = current.fracionamento.reduce((acc, current) => (!!current.dataRecebimento ? acc + current.porcentagem : acc), 0)

      return acc + current.total * (percentageReceived / 100)
    }, 0)
    const toReceive = info.reduce(
      (acc, current) => {
        const pendingPercentage = current.fracionamento.reduce((acc, current) => (!current.dataRecebimento ? acc + current.porcentagem : acc), 0)
        const total = (current.total * pendingPercentage) / 100
        acc.overall += total
        // Validing todays pending
        const isSame = (date: string) => dayjs(date).add(3, 'hour').isSame(dayjs(), 'day')
        const pendingTodayPercentage = current.fracionamento.reduce(
          (acc, current) => (!current.dataRecebimento && isSame(current.dataPrevisaoRecebimento) ? acc + current.porcentagem : acc),
          0
        )
        const totalToday = (current.total * pendingTodayPercentage) / 100
        acc.today += totalToday
        return acc
      },
      { overall: 0, today: 0 }
    )
    const overdue = info.reduce((acc, current) => {
      const isAfter = (date: string) => dayjs().isAfter(dayjs(date).add(3, 'hour'), 'day')

      const pendingOverduePercentage = current.fracionamento.reduce(
        (acc, current) => (!current.dataRecebimento && isAfter(current.dataPrevisaoRecebimento) ? acc + current.porcentagem : acc),
        0
      )
      const totalOverdue = (current.total * pendingOverduePercentage) / 100
      return acc + totalOverdue
    }, 0)

    return {
      recebido: received,
      receber: toReceive.overall,
      receberHoje: toReceive.today,
      emAtraso: overdue,
    }
  }
  useEffect(() => {
    if (session?.user && !isAuthorized) router.push('/')
  }, [session?.user])

  if (status != 'authenticated') return <LoadingPage />
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">Projetos no estágio comercial</p>
          </div>
          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-3 lg:flex-row">
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">RECEBIDO</h1>
              <MdAttachMoney />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: revenues }).recebido}</div>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">À RECEBER</h1>
              <MdOutlineWatchLater />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: revenues }).receber}</div>
              <p className="text-xs text-gray-500">{getStats({ info: revenues }).receberHoje} para hoje</p>
            </div>
          </div>
          <div className="flex min-h-[110px] w-full flex-col rounded-xl border border-gray-200 bg-[#fff] p-3 shadow-sm lg:w-1/4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium uppercase tracking-tight">EM ATRASO</h1>
              <MdOutlineAssignmentLate />
            </div>
            <div className="mt-2 flex w-full flex-col">
              <div className="text-2xl font-bold text-[#15599a]">{getStats({ info: revenues }).emAtraso}</div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
                <TextInput
                  label={'NOME DA RECEITA'}
                  value={filters.search}
                  placeholder={'Digite o nome da receita...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, received: !prev.received }))}
                  className={`rounded-md border border-green-400 ${
                    filters.received ? 'bg-green-400 text-white' : 'bg-transparent text-green-400'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  RECEBIDO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, notReceived: !prev.notReceived }))}
                  className={`rounded-md border border-[#ed174c] ${
                    filters.notReceived ? 'bg-[#ed174c] text-white' : 'bg-transparent text-[#ed174c]'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  NÃO RECEBIDO
                </button>
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, dueToday: !prev.dueToday }))}
                  className={`rounded-md border border-[#ffbd00] ${
                    filters.dueToday ? 'bg-[#ffbd00] text-white' : 'bg-transparent text-[#ffbd00]'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  RECEBER HOJE
                </button>
                {/* <button
                  onClick={() => setFilters((prev) => ({ ...prev, dueOverall: !prev.dueOverall }))}
                  className={`rounded-md border border-[#fead41] ${
                    filters.dueOverall ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  A RECEBER
                </button> */}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, overDue: !prev.overDue }))}
                  className={`rounded-md border border-red-600 ${
                    filters.overDue ? 'bg-red-600 text-white' : 'bg-transparent text-red-600'
                  }  h-[49px] py-1 px-4 text-sm font-bold text-white`}
                >
                  EM ATRASO
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex w-full grow flex-col flex-wrap items-start justify-between gap-4 lg:flex-row">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar receitas.'} /> : null}
        {isSuccess && revenues ? (
          revenues.length > 0 ? (
            revenues.map((revenue) => (
              <RevenueCard key={revenue._id} revenue={revenue} openModal={(id) => setModalRevenue({ isOpen: true, id: id })} />
            ))
          ) : (
            <p className="w-full text-center italic text-gray-500">Nenhuma receita encontrada...</p>
          )
        ) : null}
        {modalRevenue.isOpen && modalRevenue.id ? (
          <EditRevenue session={session} revenueId={modalRevenue.id} closeModal={() => setModalRevenue({ isOpen: false, id: null })} />
        ) : null}
        {/* {modalRevenue && modalIsOpen ? (
          <ExpenseModal expense={modalRevenue} closeModal={handleCloseModal} />
        ) : null} */}
      </div>
      <a
        onClick={() => setNewExpenseModalIsOpen(true)}
        className="fixed bottom-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
      >
        <p className="text-sm font-bold uppercase">NOVA RECEITA</p>
      </a>
      {newRevenueModalIsOpen ? <NewRevenue session={session} closeModal={() => setNewExpenseModalIsOpen(false)} /> : null}
    </div>
  )
}

export default Receitas
