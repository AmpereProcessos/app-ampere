import TextareaInput from '@/components/inputs/TextareaInput'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/utils/Avatar'
import { cn } from '@/lib/utils'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { TPurchaseControl } from '@/utils/schemas/purchases'
import { AnimatePresence, motion } from 'framer-motion'
import type { TAuthSession } from '@/lib/authentication/types'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsCalendarPlus } from 'react-icons/bs'
import { MdAddBox, MdDelete } from 'react-icons/md'

type PurchaseControlUpdatesInformationBlockProps = {
  session: TAuthSession
  infoHolder: TPurchaseControl
  setInfoHolder: React.Dispatch<React.SetStateAction<TPurchaseControl>>
}
function PurchaseControlUpdatesInformationBlock({ session, infoHolder, setInfoHolder }: PurchaseControlUpdatesInformationBlockProps) {
  const [newUpdateMenuIsOpen, setNewUpdateMenuIsOpen] = useState<boolean>(false)

  function addUpdate(update: TPurchaseControl['atualizacoes'][number]) {
    if (update.descricao.trim().length < 3) return toast.error('Preencha uma atualizaçao de ao menos 3 caractéres.')
    setInfoHolder((prev) => ({ ...prev, atualizacoes: [...prev.atualizacoes, update] }))
  }
  function removeUpdate(index: number) {
    setInfoHolder((prev) => ({ ...prev, atualizacoes: prev.atualizacoes.filter((a, i) => i != index) }))
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="bg-primary text-primary-foreground w-full rounded p-1 text-center font-bold">ATUALIZAÇÕES DA COMPRA</h1>
      <div className="flex w-full items-center justify-end">
        <button
          onClick={() => setNewUpdateMenuIsOpen((prev) => !prev)}
          className={cn('flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out', {
            'bg-primary/20 hover:bg-red-300': newUpdateMenuIsOpen,
            'bg-green-300 hover:bg-green-400': !newUpdateMenuIsOpen,
          })}
        >
          <MdAddBox />
          <h1 className="text-xs font-medium tracking-tight">
            {!newUpdateMenuIsOpen ? 'ABRIR MENU DE NOVA ATUALIZAÇÃO' : 'FECHAR MENU DE NOVA ATUALIZAÇÃO'}
          </h1>
        </button>
      </div>
      {newUpdateMenuIsOpen ? <NewUpdateMenu session={session} addUpdate={addUpdate} closeMenu={() => setNewUpdateMenuIsOpen(false)} /> : null}
      <div className="bg-background flex w-full flex-col gap-2 p-1 dark:bg-[#121212]">
        {infoHolder.atualizacoes.length > 0 ? (
          infoHolder.atualizacoes.map((item, index) => <UpdateCard key={index} update={item} removeUpdate={() => removeUpdate(index)} />)
        ) : (
          <p className="text-primary/80 w-full text-center text-sm font-medium tracking-tight">Não atualização definida.</p>
        )}
      </div>
    </div>
  )
}

export default PurchaseControlUpdatesInformationBlock

type NewUpdateMenuProps = {
  session: TAuthSession
  addUpdate: (update: TPurchaseControl['atualizacoes'][number]) => void
  closeMenu: () => void
}
function NewUpdateMenu({ session, addUpdate, closeMenu }: NewUpdateMenuProps) {
  const [updateHolder, setUpdateHolder] = useState<TPurchaseControl['atualizacoes'][number]>({
    descricao: '',
    data: new Date().toISOString(),
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
  })

  return (
    <AnimatePresence>
      <motion.div
        key={'menu-open'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-background flex w-full flex-col gap-2 rounded border border-green-600 shadow-xs dark:bg-[#121212]"
      >
        <h1 className="rounded-tl rounded-tr bg-green-600 p-1 text-center text-xs text-white">NOVA ATUALIZAÇÃO</h1>
        <div className="flex w-full grow flex-col gap-2 p-3">
          <TextareaInput
            label="CONTEÚDO DA ATUALIZAÇÃO"
            value={updateHolder.descricao}
            handleChange={(value) => setUpdateHolder((prev) => ({ ...prev, descricao: value }))}
            placeholder="Preencha aqui o conteúdo da atualização..."
          />

          <div className="mt-2 flex w-full items-center justify-end gap-2">
            <Button onClick={() => addUpdate(updateHolder)} type="button" size={'xs'}>
              ADICIONAR ATUALIZAÇÃO
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

type UpdateCardProps = {
  update: TPurchaseControl['atualizacoes'][number]
  removeUpdate: () => void
}

function UpdateCard({ update, removeUpdate }: UpdateCardProps) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded-md border p-2 dark:bg-[#121212]">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <p className="text-primary/80 text-[0.65rem] font-medium">ATUALIZAÇÃO POR:</p>
            <Avatar url={update.autor.avatar_url || undefined} width={20} height={20} fallback={formatNameAsInitials(update.autor.nome)} />

            <p className="text-primary/80 text-[0.65rem] font-medium">{update.autor.nome}</p>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-primary/80 text-[0.65rem] font-medium">{formatDateAsLocale(update.data, true)}</p>
          </div>
        </div>
        <button
          onClick={() => removeUpdate()}
          className="flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white hover:bg-red-500"
        >
          <MdDelete width={10} height={10} />
          <p>REMOVER</p>
        </button>
      </div>
      <p className="bg-primary/10 text-primary rounded-lg p-2 text-center text-xs">{update.descricao}</p>
    </div>
  )
}
