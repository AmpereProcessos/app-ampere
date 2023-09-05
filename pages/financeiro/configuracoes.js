import React, { useState } from 'react'
import { useCostApportionments } from '../../utils/methods/query/costApportionments'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession({
    onUnauthenticated: () => router.push('/auth/authHome'),
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
    <div className="p-6 grow flex flex-col gap-2">
      <div className="flex flex-col w-full pb-1 border-b border-gray-200">
        <p className="font-bold uppercase text-start text-2xl text-[#15599a]">CONFIGURAÇÕES</p>
      </div>
      <div className="w-full flex py-2 items-start gap-2">
        <div className="w-[50%] max-h-[500px] h-[500px]  flex flex-col rounded border border-gray-200 shadow-lg">
          <div className="flex items-center w-full justify-between px-2">
            <h1 className="pb-1 border-b border-gray-200 font-raleway font-black text-center p-3">CENTROS DE CUSTO</h1>
            <button onClick={() => setNewApportionmentModalIsOpen(true)}>
              <MdOutlineAddCircle color="rgb(34,197,94)" size={'25px'} />
            </button>
          </div>

          <div className="flex flex-col grow overflow-y-auto gap-3 overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-2">
            {apportionmentsFetching ? <LoadingPage /> : null}
            {apportionmentsSuccess
              ? apportionments?.map((apportionment, index) => (
                  <ApportionmentItem key={index} apportionment={apportionment} openEditModal={handleOpenEditApportionment} />
                ))
              : null}
          </div>
        </div>
        <div className="w-[50%] max-h-[500px] h-[500px]  flex flex-col  rounded border border-gray-200 shadow-lg">
          <div className="flex items-center w-full justify-between px-2">
            <h1 className="pb-1 border-b border-gray-200 font-raleway font-black text-center p-3">CONTAS DE RECEBIMENTO</h1>
            <button onClick={() => setNewAccountModalIsOpen(true)}>
              <MdOutlineAddCircle color="rgb(34,197,94)" size={'25px'} />
            </button>
          </div>
          <div className="flex flex-col grow overflow-y-auto gap-3 overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
