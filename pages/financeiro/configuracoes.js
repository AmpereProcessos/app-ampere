import React, { useState } from 'react'
import { useCostApportionments } from '../../utils/methods/query/costApportionments'
import { useSession } from '../../components/providers/SessionProvider'
import { useRouter } from 'next/router'
import { validateAuthorization } from '../../utils/constants'
import LoadingPage from '../../components/utils/LoadingPage'
import { useReceiptAccounts } from '../../utils/methods/query/receiptAccounts'
import ApportionmentItem from '../../components/identificador/centrosDeCusto/ApportionmentItem'
import { MdOutlineAddCircle } from 'react-icons/md'
import NewApportionment from '../../components/identificador/centrosDeCusto/NewApportionment'
import EditApportionment from '../../components/identificador/centrosDeCusto/EditApportionment'
import NewReceiptAccount from '../../components/identificador/contasDeRecebimento/NewReceiptAccount'
import AccountItem from '../../components/identificador/contasDeRecebimento/ReceiptAccountItem'
import EditReceiptAccount from '../../components/identificador/contasDeRecebimento/EditReceiptAccount'

function Configuracoes() {
  const router = useRouter()
  const { session } = useSession({
    onUnauthenticated: () => router.push('/auth/signin'),
  })
  const {
    data: apportionments,
    isFetching: apportionmentsFetching,
    isSuccess: apportionmentsSuccess,
  } = useCostApportionments(validateAuthorization(session, 'ADM'))
  const {
    data: receiptAccounts,
    isFetching: receiptAccountsFetching,
    isSuccess: receiptAccountsSuccess,
  } = useReceiptAccounts(validateAuthorization(session, 'ADM'))

  const [newApportionmentModalIsOpen, setNewApportionmentModalIsOpen] = useState(false)
  const [newAccountModalIsOpen, setNewAccountModalIsOpen] = useState(false)

  const [editApportionment, setEditApportionment] = useState({
    isOpen: false,
    id: null,
  })
  const [editAccount, setEditAccount] = useState({
    isOpen: false,
    id: null,
  })
  function handleOpenEditApportionment(id) {
    setEditApportionment({ id: id, isOpen: true })
  }
  function handleOpenEditAccount(id) {
    setEditAccount({ id: id, isOpen: true })
  }
  console.log(receiptAccounts)
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="flex w-full flex-col border-b border-gray-300 pb-1">
        <p className="text-start text-2xl font-bold uppercase text-[#15599a]">CONFIGURAÇÕES</p>
      </div>
      <div className="flex w-full items-start gap-2 py-2">
        <div className="flex h-[500px] max-h-[500px]  w-[50%] flex-col rounded border border-gray-300 shadow-lg">
          <div className="flex w-full items-center justify-between px-2">
            <h1 className="border-b border-gray-300 p-3 pb-1 text-center font-raleway font-black">CENTROS DE CUSTO</h1>
            <button onClick={() => setNewApportionmentModalIsOpen(true)}>
              <MdOutlineAddCircle color="rgb(34,197,94)" size={'25px'} />
            </button>
          </div>

          <div className="overscroll-y flex grow flex-col gap-3 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {apportionmentsFetching ? <LoadingPage /> : null}
            {apportionmentsSuccess
              ? apportionments?.map((apportionment, index) => (
                  <ApportionmentItem key={index} apportionment={apportionment} openEditModal={handleOpenEditApportionment} />
                ))
              : null}
          </div>
        </div>
        <div className="flex h-[500px] max-h-[500px]  w-[50%] flex-col  rounded border border-gray-300 shadow-lg">
          <div className="flex w-full items-center justify-between px-2">
            <h1 className="border-b border-gray-300 p-3 pb-1 text-center font-raleway font-black">CONTAS DE RECEBIMENTO</h1>
            <button onClick={() => setNewAccountModalIsOpen(true)}>
              <MdOutlineAddCircle color="rgb(34,197,94)" size={'25px'} />
            </button>
          </div>
          <div className="overscroll-y flex grow flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {receiptAccountsFetching ? <LoadingPage /> : null}
            {receiptAccountsSuccess
              ? receiptAccounts?.map((account, index) => <AccountItem key={index} account={account} openEditModal={handleOpenEditAccount} />)
              : null}
          </div>
        </div>
      </div>
      {editApportionment.id && editApportionment.isOpen ? (
        <EditApportionment apportionmentId={editApportionment.id} closeModal={() => setEditApportionment({ id: null, isOpen: false })} />
      ) : null}
      {editAccount.id && editAccount.isOpen ? (
        <EditReceiptAccount receiptAccountId={editAccount.id} closeModal={() => setEditAccount({ id: null, isOpen: false })} />
      ) : null}
      {newApportionmentModalIsOpen ? <NewApportionment closeModal={() => setNewApportionmentModalIsOpen(false)} /> : null}
      {newAccountModalIsOpen ? <NewReceiptAccount closeModal={() => setNewAccountModalIsOpen((prev) => !prev)} /> : null}
    </div>
  )
}

export default Configuracoes
