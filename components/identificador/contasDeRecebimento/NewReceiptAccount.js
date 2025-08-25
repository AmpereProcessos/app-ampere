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
import { useQueryClient } from '@tanstack/react-query'
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
      <div className="h-[50%] w-[80%] lg:h-[30%] lg:w-[30%]" style={MODAL_STYLES}>
        <div className="flex h-full w-full flex-col">
          <div className="border-primary/20 flex items-center justify-between border-b px-2 pb-2 text-lg">
            <div className="flex items-center gap-x-2">
              <h1 className="pl-6 font-bold text-[#15599a]">NOVO RATEIO DE DESPESAS</h1>
            </div>
            <button>
              <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
            </button>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex w-full grow flex-col overflow-y-auto px-2 py-2">
            <TextInput
              label={'NOME DA CONTA DE RECEBIMENTO'}
              labelClassName="text-center text-primary/60 font-normal font-raleway text-sm"
              value={infoHolder.nome}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
              placeholder={'Preencha aqui o nome a ser dado a nova conta de recebimento.'}
              width={'100%'}
            />
          </div>
          <div className="flex w-full items-center justify-end py-2">
            <button
              disabled={isLoading}
              onClick={() => handleReceiptAccountCreation()}
              className="disabled:bg-primary/80 w-fit rounded border border-green-500 p-2 font-medium text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white disabled:text-white"
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
