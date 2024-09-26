import TextInput from '@/components/inputs/Text'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDecimalPlaces, GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { isEmpty } from '@/utils/methods/shared'
import { TCreditCardOption } from '@/utils/schemas/credit-card-options'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { MdDelete, MdPayment } from 'react-icons/md'

type PaymentOptionsMenuProps = {
  infoHolder: TCreditCardOption
  setInfoHolder: React.Dispatch<React.SetStateAction<TCreditCardOption>>
}
function PaymentOptionsMenu({ infoHolder, setInfoHolder }: PaymentOptionsMenuProps) {
  const [newPaymentOptionMenuIsOpen, setNewPaymentOptionMenuIsOpen] = useState<boolean>(false)

  function addPaymentOption(option: TCreditCardOption['opcoes'][number]) {
    if (option.descricao.trim().length == 0) return toast.error('Preencha uma descrição/bandeira para a opção de pagamento.')
    const options = [...infoHolder.opcoes]
    options.push(option)
    setInfoHolder((prev) => ({ ...prev, opcoes: options }))
  }
  function removePaymentOption(index: number) {
    setInfoHolder((prev) => ({ ...prev, opcoes: prev.opcoes.filter((o, i) => i != index) }))
  }
  function updatePaymentOption({ index, data }: { index: number; data: TCreditCardOption['opcoes'][number] }) {
    setInfoHolder((prev) => ({ ...prev, opcoes: prev.opcoes.map((op, i) => (i == index ? data : op)) }))
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="w-full rounded bg-black p-1 text-center font-bold text-white">OPÇÕES DE PAGAMENTO</h1>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setNewPaymentOptionMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-gray-300  hover:bg-red-300': newPaymentOptionMenuIsOpen,
            'bg-green-300  hover:bg-green-400': !newPaymentOptionMenuIsOpen,
          })}
        >
          <MdPayment />
          <h1 className="text-xs font-medium tracking-tight">
            {!newPaymentOptionMenuIsOpen ? 'ABRIR MENU DE NOVA OPÇÃO DE PAGAMENTO' : 'FECHAR MENU DE NOVA OPÇÃO DE PAGAMENTO'}
          </h1>
        </button>
      </div>
      <AnimatePresence>{newPaymentOptionMenuIsOpen ? <NewPaymentOptionMenu addPaymentOption={addPaymentOption} /> : null}</AnimatePresence>
      <h1 className="text-sm font-medium tracking-tight text-gray-500">LISTA DE OPÇÕES</h1>
      {infoHolder.opcoes.map((option, index) => (
        <PaymentOptionCard
          key={`${option.descricao}-${index}`}
          option={option}
          removePaymentOption={() => removePaymentOption(index)}
          updatePaymentOption={(data) => updatePaymentOption({ index, data })}
        />
      ))}
    </div>
  )
}

export default PaymentOptionsMenu

type NewPaymentOptionMenuProps = {
  addPaymentOption: (option: TCreditCardOption['opcoes'][number]) => void
}
function NewPaymentOptionMenu({ addPaymentOption }: NewPaymentOptionMenuProps) {
  const [paymentOption, setPaymentOption] = useState<TCreditCardOption['opcoes'][number]>({
    descricao: '',
    parcelas: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0 },
  })

  return (
    <motion.div
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-[90%] flex-col gap-1 self-center overflow-hidden rounded border border-green-500"
    >
      <h1 className="w-full bg-green-500 p-1 text-center text-xs font-bold text-white lg:text-base">NOVA OPÇÃO PAGAMENTO</h1>
      <div className="flex w-full flex-col gap-2 p-3">
        <TextInput
          value={paymentOption.descricao}
          label="DESCRIÇÃO/BANDEIRA"
          placeholder="Preencha aqui a descrição/bandeira da opção..."
          handleChange={(value) => setPaymentOption((prev) => ({ ...prev, descricao: value }))}
          width="100%"
        />
        <div className="grid w-full grid-cols-1 items-center gap-2 lg:grid-cols-2">
          {Object.entries(paymentOption.parcelas).map(([key, value]) => (
            <div className={`flex  w-full flex-col gap-1`}>
              <label htmlFor={`parcela-${key}`} className={cn('text-xs tracking-tight')}>
                TAXA P/ {key} PARCELA(S)
              </label>
              <input
                value={!isEmpty(value) ? value?.toString() : ''}
                onChange={(e) => {
                  setPaymentOption((prev) => ({
                    ...prev,
                    parcelas: {
                      ...prev.parcelas,
                      [key]: Number(e.target.value),
                    },
                  }))
                }}
                id={`parcela-${key}`}
                type="number"
                placeholder={`Preencha aqui a taxa para ${key} parcela(s)`}
                className="h-[30px] w-full rounded-md border border-gray-200 p-3 text-sm outline-none placeholder:italic"
              />
            </div>
          ))}
        </div>
        <div className="flex w-full items-center justify-end">
          <Button onClick={() => addPaymentOption(paymentOption)} size={'xs'}>
            ADICIONAR OPÇÃO
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

type PaymentOptionCardProps = {
  option: TCreditCardOption['opcoes'][number]
  updatePaymentOption: (data: TCreditCardOption['opcoes'][number]) => void
  removePaymentOption: () => void
}
function PaymentOptionCard({ option, updatePaymentOption, removePaymentOption }: PaymentOptionCardProps) {
  const [paymentOptionInfo, setPaymentOptionInfo] = useState<TCreditCardOption['opcoes'][number]>(option)
  const [editPaymentOptionMenuIsOpen, setEditPaymentOptionMenuIsOpen] = useState<boolean>(false)
  return (
    <AnimatePresence>
      <div className="flex w-full flex-col gap-2 rounded border border-gray-500 p-3">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-1">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black p-1">
              <MdPayment />
            </div>
            <p className="text-[0.6rem] font-medium leading-none tracking-tight lg:text-xs">{option.descricao}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditPaymentOptionMenuIsOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
            >
              <Pencil width={10} height={10} />
              <p>EDITAR</p>
            </button>
            <button
              onClick={() => removePaymentOption()}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white hover:bg-red-500"
            >
              <MdDelete width={10} height={10} />
              <p>REMOVER</p>
            </button>
          </div>
        </div>
        <h1 className="text-[0.6rem] text-gray-500">TAXAS POR PARCELA</h1>
        <div className="flex w-full flex-wrap items-center gap-2">
          {Object.entries(option.parcelas).map(([key, value]) => (
            <div className="flex items-center gap-1 rounded-lg bg-gray-500 px-2 py-0.5 text-[0.6rem] text-white">
              <p>{key}x</p>
              <h1 className="font-black">{formatDecimalPlaces(value)}%</h1>
            </div>
          ))}
        </div>
        {editPaymentOptionMenuIsOpen ? (
          <motion.div
            variants={GeneralVisibleHiddenExitMotionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex w-[90%] flex-col gap-1 self-center overflow-hidden rounded border border-blue-500"
          >
            <h1 className="w-full bg-blue-500 p-1 text-center text-xs font-bold text-white lg:text-base">EDITAR OPÇÃO PAGAMENTO</h1>
            <div className="flex w-full flex-col gap-2 p-3">
              <TextInput
                value={paymentOptionInfo.descricao}
                label="DESCRIÇÃO/BANDEIRA"
                placeholder="Preencha aqui a descrição/bandeira da opção..."
                handleChange={(value) => setPaymentOptionInfo((prev) => ({ ...prev, descricao: value }))}
                width="100%"
              />
              <div className="grid w-full grid-cols-1 items-center gap-2 lg:grid-cols-2">
                {Object.entries(paymentOptionInfo.parcelas).map(([key, value]) => (
                  <div className={`flex  w-full flex-col gap-1`}>
                    <label htmlFor={`parcela-${key}`} className={cn('text-xs tracking-tight')}>
                      TAXA P/ {key} PARCELA(S)
                    </label>
                    <input
                      value={!isEmpty(value) ? value?.toString() : ''}
                      onChange={(e) => {
                        setPaymentOptionInfo((prev) => ({
                          ...prev,
                          parcelas: {
                            ...prev.parcelas,
                            [key]: Number(e.target.value),
                          },
                        }))
                      }}
                      id={`parcela-${key}`}
                      type="number"
                      placeholder={`Preencha aqui a taxa para ${key} parcela(s)`}
                      className="h-[30px] w-full rounded-md border border-gray-200 p-3 text-xs outline-none placeholder:italic"
                    />
                  </div>
                ))}
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-end">
                <Button variant={'outline'} onClick={() => setEditPaymentOptionMenuIsOpen(false)} size={'xs'}>
                  FECHAR MENU
                </Button>
                <Button
                  onClick={() => {
                    updatePaymentOption(paymentOptionInfo)
                    setEditPaymentOptionMenuIsOpen(false)
                  }}
                  size={'xs'}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  ATUALIZAR OPÇÃO
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </AnimatePresence>
  )
}
