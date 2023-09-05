import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import { toast } from 'react-hot-toast'
import { formatToMoney } from '../../../utils/constants'
import { MdDelete } from 'react-icons/md'
import MonthYearPicker from '../../inputs/MonthPicker'
import { useInsertApportionment } from '../../../utils/methods/mutation/costApportionments'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { useQueryClient } from 'react-query'
import { useInsertReceiptAccount } from '../../../utils/methods/mutation/receiptAccounts'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}
const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()
const period = `${currentMonth.toString().padStart(2, '0')}/${currentYear}`
const infoHolderInitialState = {
  nome: '',
}
function NewReceiptAccount({ closeModal }) {
  const queryClient = useQueryClient()
  const { mutate: insertReceiptAccount, isLoading } = useInsertReceiptAccount()
  const [infoHolder, setInfoHolder] = useState(infoHolderInitialState)
  async function handleReceiptAccountCreation() {
    if (infoHolder.nome.trim().length < 2) {
      toast.error('Preencha um nome válido para a conta de recebimento.')
      return
    }
    const loadingToastId = toast.loading('Carregando...')
    var insertInfo = infoHolder
    insertInfo.nome = insertInfo.nome.toUpperCase()

    try {
      insertReceiptAccount(insertInfo, {
        onSuccess: async (data) => {
          toast.dismiss(loadingToastId)
          toast.success(data)
          // Resetting info holder
          setInfoHolder(infoHolderInitialState)
          await queryClient.cancelQueries({ queryKey: ['receiptAccounts'] })
        },
        onSettled: async () => {
          await queryClient.invalidateQueries({ queryKey: ['receiptAccounts'] })
        },
        onError: (error) => {
          throw error
        },
      })
    } catch (error) {
      toast.dismiss(loadingToastId)
      const msg = getErrorMessage(error)
      toast.error(msg)
    }
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div className="lg:w-[30%] w-[80%] lg:h-[30%] h-[50%]" style={MODAL_STYLES}>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex items-center gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">NOVO RATEIO DE DESPESAS</h1>
            </div>
            <button>
              <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex flex-col py-2 px-2 w-full grow overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <TextInput
              label={'NOME DA CONTA DE RECEBIMENTO'}
              labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
              value={infoHolder.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              placeholder={'Preencha aqui o nome a ser dado a nova conta de recebimento.'}
              width={'100%'}
            />
          </div>
          <div className="w-full flex items-center justify-end py-2">
            <button
              disabled={isLoading}
              onClick={() => handleReceiptAccountCreation()}
              className="w-fit p-2 rounded border border-green-500 text-green-500 font-medium hover:bg-green-500 hover:text-white duration-300 ease-in-out disabled:bg-gray-800 disabled:text-white"
            >
              CRIAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewReceiptAccount
