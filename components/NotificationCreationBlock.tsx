import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdNotifications } from 'react-icons/md'

import { useUsers } from '../utils/methods/query/users'
import Avatar from './utils/Avatar'

import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
import { createNotification } from '../utils/methods/mutation/notifications'
import type { TAuthSession } from '@/lib/authentication/types'
import type { TCreateNotificationInput } from '@/pages/api/notificacoes'
import MultipleSelectWithImages from './inputs/MultipleSelectWithImages'
import TextInput from './inputs/Text'
import TextareaInput from './inputs/TextareaInput'
import { LoadingButton } from './utils/Buttons/LoadingButton'
const variants = {
  hidden: {
    opacity: 0.2,
    transition: {
      duration: 0.8, // Adjust the duration as needed
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8, // Adjust the duration as needed
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01, // Adjust the duration as needed
    },
  },
}

type NotificationCreationBlockProps = {
  session: TAuthSession
  codProjeto: string
  nomeDoProjeto: string
}
function NotificationCreationBlock({ session, codProjeto, nomeDoProjeto }: NotificationCreationBlockProps) {
  const queryClient = useQueryClient()
  const { data: users } = useUsers()

  async function handleNotificationCreation(info: TCreateNotificationInput) {
    if (info.notificadosIds.length === 0) throw new Error('Destinatário não informado.')

    if (info.assunto.trim().length < 3) throw new Error('Assunto não informado.')

    if (info.corpo.trim().length < 3) throw new Error('Corpo não informado.')

    return createNotification({ info: info })
  }
  const { mutate: handleNotificationCreationMutation, isPending } = useMutationWithFeedback({
    mutationKey: ['create-notification'],
    mutationFn: handleNotificationCreation,
    affectedQueryKey: ['notifications'],
    queryClient: queryClient,
  })
  const [notifyMenuVisible, setNotifyMenuVisible] = useState(false)

  const initialNotification: TCreateNotificationInput = {
    notificadosIds: [],
    assunto: '',
    corpo: '',
  }
  const [infoHolder, setInfoHolder] = useState<TCreateNotificationInput>(initialNotification)
  function updateInfoHolder(changes: Partial<TCreateNotificationInput>) {
    setInfoHolder((prev) => ({ ...prev, ...changes }))
  }
  return (
    <>
      <div className="flex w-full items-center justify-center gap-6 rounded-md bg-[#15599a] p-2">
        <div className="flex items-center gap-2">
          <MdNotifications color="#fff" />
          <h1 className="text-center font-medium text-white">PAINEL DE NOTIFICAÇÕES</h1>
        </div>
        {notifyMenuVisible ? (
          <div className="cursor-pointer text-white hover:text-blue-400">
            <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setNotifyMenuVisible(false)} />
          </div>
        ) : (
          <div className="cursor-pointer text-white hover:text-blue-400">
            <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setNotifyMenuVisible(true)} />
          </div>
        )}
      </div>
      <AnimatePresence>
        {notifyMenuVisible ? (
          <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col p-2">
            <div className="flex w-full flex-col self-center lg:w-[50%]">
              <div className="flex w-full items-center justify-center gap-2">
                <h1 className="text-xs font-bold">REMETENTE</h1>
                <div className="bg-primary/30 h-full w-px" />
                <div className="flex items-center justify-center gap-2">
                  <Avatar fallback={'U'} height={25} width={25} url={session.user.avatar_url} />
                  <p className="text-primary/60 text-xs font-medium">{session.user.nome || 'Autor não identificado'}</p>
                </div>
              </div>
              <MultipleSelectWithImages
                label="DESTINATÁRIO"
                labelClassName="font-bold text-xs"
                editable={true}
                options={
                  users?.map((resp) => ({
                    id: resp._id,
                    label: resp.usuario,
                    value: resp._id,
                    url: resp.avatar_url ?? undefined,
                  })) || []
                }
                selected={infoHolder.notificadosIds}
                resetOptionLabel="NÃO DEFINIDO"
                handleChange={(value) => {
                  updateInfoHolder({ notificadosIds: value })
                }}
                onReset={() => updateInfoHolder({ notificadosIds: [] })}
                width="100%"
              />
              <TextInput
                label="ASSUNTO"
                placeholder="Assunto da notificação"
                value={infoHolder.assunto}
                handleChange={(value) => updateInfoHolder({ assunto: value })}
                width="100%"
              />
              <TextareaInput
                label="CORPO"
                placeholder="Corpo da notificação"
                value={infoHolder.corpo}
                handleChange={(value) => updateInfoHolder({ corpo: value })}
              />

              <div className="flex w-full items-center justify-end">
                <LoadingButton onClick={() => handleNotificationCreationMutation(infoHolder)}>ENVIAR</LoadingButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default NotificationCreationBlock
