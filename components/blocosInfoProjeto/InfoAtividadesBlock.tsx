import React, { useState } from 'react'
import { Session } from 'next-auth'
import { AnimatePresence, motion } from 'framer-motion'

import { TActivity } from '@/utils/schemas/activities'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { MdOutlineCheckBox } from 'react-icons/md'
import { useUsers } from '@/utils/methods/query/users'
import TextInput from '../inputs/Text'
import dayjs from 'dayjs'
import SelectInputWithImages from '../inputs/SelectWithImages'
import { formatNameAsInitials } from '@/utils/methods/formatting'
import toast from 'react-hot-toast'
import Avatar from '../utils/Avatar'
import { useProjectActivities } from '@/utils/methods/query/activities'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createActivity } from '@/utils/methods/mutation/activities'
import { useQueryClient } from 'react-query'
import NewProjectActivityMenu from '../identificador/atividades/NewProjectActivityMenu'
import LoadingPage from '../utils/LoadingPage'
import ErrorComponent from '../utils/ErrorComponent'
import ProjectActivityCard from '../identificador/atividades/ProjectActivityCard'

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
type InfoAtividadesBlockProps = {
  projectId: string
  projectName: string
  projectIdentifier: string | number
  session: Session
}
function InfoAtividadesBlock({ projectId, projectName, projectIdentifier, session }: InfoAtividadesBlockProps) {
  const queryClient = useQueryClient()
  const { data: projectActivities, isSuccess, isLoading, isError } = useProjectActivities({ id: projectId })
  console.log('ATIVIDADES DO PROJETO', projectActivities)
  return (
    <>
      <div className="flex w-full items-center justify-center gap-6 rounded-md bg-[#fead41] p-2">
        <div className="flex items-center gap-2 text-white">
          <MdOutlineCheckBox size={25} />
          <h1 className="text-center font-medium">PAINEL DE ATIVIDADES</h1>
        </div>
      </div>
      <NewProjectActivityMenu projectId={projectId} projectName={projectName} projectIdentifier={projectIdentifier} session={session} />
      <div className="flex w-full flex-col gap-2 px-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao carregar atividades do projeto'} /> : null}
        {isSuccess ? (
          projectActivities.length > 0 ? (
            projectActivities.map((activity) => <ProjectActivityCard key={activity._id} activity={activity} projectId={projectId} />)
          ) : (
            <h1 className="w-full py-1 text-center text-sm italic text-gray-500">Nenhuma atividade cadastrada...</h1>
          )
        ) : null}
      </div>
    </>
  )
}

export default InfoAtividadesBlock
