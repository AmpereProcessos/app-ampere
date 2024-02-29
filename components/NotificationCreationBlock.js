import React, { useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

import { IoIosSend, IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { VscChromeClose } from 'react-icons/vsc'
import { MdNotifications } from 'react-icons/md'

import SelectFloatingInput from '../components/SelectFloatingInput'
import TextFloatingInput from '../components/TextFloatingInput'
import { useUsers } from '../utils/methods/query/users'
import { useSession } from 'next-auth/react'
import Avatar from './utils/Avatar'
import SelectInputWithImages from './inputs/SelectWithImages'
import { formatNameAsInitials } from '../utils/methods/formatting'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'
import { useMutationWithFeedback } from '../utils/methods/mutation/general-hook'
import { useQueryClient } from 'react-query'
import { createNotification } from '../utils/methods/mutation/notifications'
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
function NotificationCreationBlock({ codProjeto, nomeDoProjeto }) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { data: users } = useUsers({ enabled: !!session.user })
  const { mutate } = useMutationWithFeedback({
    mutationKey: ['create-notification'],
    mutationFn: createNotification,
    affectedQueryKey: ['notifications'],
    queryClient: queryClient,
  })
  const [notifyMenuVisible, setNotifyMenuVisible] = useState(false)

  const [notInfo, setNotInfo] = useState({
    destinatario: null,
    mensagem: '',
    projetoReferencia: codProjeto,
    nomeDoProjeto: nomeDoProjeto,
  })

  async function notify() {
    if (validateFields()) {
      // const loadingToastId = toast.loading('Enviando...')

      const notification = {
        destinatario: notInfo.destinatario,
        remetente: session.user.nome,
        remetenteId: session?.user?.id,
        mensagem: notInfo.mensagem,
        projetoReferencia: codProjeto,
        nomeDoProjeto: nomeDoProjeto,
      }
      mutate({ info: notification })

      setNotInfo({
        destinatario: null,
        mensagem: '',
        projetoReferencia: codProjeto,
        nomeDoProjeto: nomeDoProjeto,
      })
    }
  }
  function validateFields() {
    if (notInfo.destinatario == null || notInfo.destinatario == 'NÃO DEFINIDO') {
      setMsg({
        text: 'Por favor, preencha o destinatário.',
        color: 'text-red-500',
      })
      return false
    }
    if (notInfo.mensagem.trim().length < 3) {
      setMsg({
        text: 'Por favor, digite uma mensagem válida.',
        color: 'text-red-500',
      })
      return false
    }
    return true
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
                <h1 className="text-xs font-bold text-gray-800">REMETENTE</h1>
                <div className="h-full w-[1px] bg-gray-500"></div>
                <div className="flex items-center justify-center  gap-2">
                  <Avatar fallback={'U'} height={25} width={25} url={session.user.avatar_url} />
                  <p className="text-xs font-medium text-gray-500">{session.user.nome || 'Autor não identificado'}</p>
                </div>
              </div>
              <SelectInputWithImages
                label="DESTINATÁRIO"
                labelClassName="font-bold text-gray-800 text-xs"
                editable={true}
                options={
                  users?.map((resp) => ({
                    id: resp._id,
                    label: resp.nome,
                    value: resp,
                    url: resp.avatar_url,
                    fallback: formatNameAsInitials(resp.nome),
                  })) || []
                }
                value={notInfo.destinatario}
                handleChange={(value) => {
                  setNotInfo((prev) => ({ ...prev, destinatario: value._id }))
                }}
                onReset={() => setNotInfo((prev) => ({ ...prev, destinatario: null }))}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
              <h1 className="mt-4 text-xs font-bold text-gray-800">MENSAGEM</h1>
              <textarea
                className="mt-1 w-full resize-none rounded-md border border-gray-300 bg-gray-200 p-3 text-center text-sm outline-none"
                value={notInfo.mensagem}
                onChange={(e) => setNotInfo((prev) => ({ ...prev, mensagem: e.target.value }))}
              />
              <div className="flex w-full items-center justify-end">
                <button
                  onClick={notify}
                  className="mt-2 rounded-lg bg-blue-200  text-[25px] duration-300 ease-in hover:scale-110 hover:bg-blue-600 hover:text-white"
                >
                  <div className="h-hull w-full -translate-x-1 rotate-45 p-2 duration-300 ease-in hover:translate-x-0 hover:rotate-0">
                    <IoIosSend />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default NotificationCreationBlock
