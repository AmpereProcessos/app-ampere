import React, { useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios'

import { AppContext } from '../context/AppContext'

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
  const { data: session } = useSession()
  const { data: users } = useUsers({ enabled: !!session.user })
  const [notifyMenuVisible, setNotifyMenuVisible] = useState(false)

  const [notInfo, setNotInfo] = useState({
    destinatario: null,
    mensagem: '',
    projetoReferencia: codProjeto,
    nomeDoProjeto: nomeDoProjeto,
  })

  async function notify() {
    if (validateFields()) {
      const loadingToastId = toast.loading('Enviando...')
      try {
        const notification = {
          destinatario: notInfo.destinatario,
          remetente: session?.user?.name,
          remetenteId: session?.user?.id,
          mensagem: notInfo.mensagem,
          projetoReferencia: codProjeto,
          nomeDoProjeto: nomeDoProjeto,
        }
        await axios.post('/api/notificacoes/1', notification)
        toast.dismiss(loadingToastId)
        toast.success('Notificação enviada com sucesso !')
        setNotInfo({
          destinatario: null,
          mensagem: '',
          projetoReferencia: codProjeto,
          nomeDoProjeto: nomeDoProjeto,
        })
      } catch (error) {
        toast.dismiss(loadingToastId)
        const msg = getErrorMessage(error)
        toast.error(msg)
      }
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
  console.log(session)
  return (
    <>
      <div className="flex items-center justify-center p-2 w-full bg-[#15599a] rounded-md gap-6">
        <div className="flex items-center gap-2">
          <MdNotifications color="#fff" />
          <h1 className="text-center font-medium text-white">PAINEL DE NOTIFICAÇÕES</h1>
        </div>
        {notifyMenuVisible ? (
          <div className="text-white hover:text-blue-400 cursor-pointer">
            <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setNotifyMenuVisible(false)} />
          </div>
        ) : (
          <div className="text-white hover:text-blue-400 cursor-pointer">
            <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setNotifyMenuVisible(true)} />
          </div>
        )}
      </div>
      <AnimatePresence></AnimatePresence>
      {notifyMenuVisible ? (
        <motion.div variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col p-2">
          <div className="w-full lg:w-[50%] flex flex-col self-center">
            <div className="flex items-center justify-center gap-2 w-full">
              <h1 className="font-bold text-gray-800 text-xs">REMETENTE</h1>
              <div className="h-full w-[1px] bg-gray-500"></div>
              <div className="flex items-center gap-2  justify-center">
                <Avatar fallback={'U'} height={25} width={25} url={session?.user?.image} />
                <p className="font-medium text-gray-500 text-xs">{session?.user?.name || 'Autor não identificado'}</p>
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
            <h1 className="font-bold text-gray-800 text-xs mt-4">MENSAGEM</h1>
            <textarea
              className="mt-1 w-full outline-none rounded-md border border-gray-300 bg-gray-200 text-center text-sm p-3 resize-none"
              value={notInfo.mensagem}
              onChange={(e) => setNotInfo((prev) => ({ ...prev, mensagem: e.target.value }))}
            />
            <div className="w-full flex items-center justify-end">
              <button
                onClick={notify}
                className="bg-blue-200 hover:text-white hover:bg-blue-600  rounded-lg mt-2 hover:scale-110 ease-in duration-300 text-[25px]"
              >
                <div className="ease-in duration-300 -translate-x-1 p-2 rotate-45 hover:translate-x-0 hover:rotate-0 w-full h-hull">
                  <IoIosSend />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  )
}

export default NotificationCreationBlock
