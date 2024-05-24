import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

import ModalDB from '../../components/ModalDB'

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AiOutlineSearch } from 'react-icons/ai'

import DateInput from '../../components/inputs/Date'
import SelectInput from '../../components/inputs/Select'
import TextInput from '../../components/inputs/Text'
import LoadingPage from '../../components/utils/LoadingPage'
import FilterButton from '../../components/utils/Buttons/FilterButton'

import { cidadesAtendidas, equipesTecnicas, formatDate, vendedores } from '../../utils/constants'
import { allSellers, customersAcquisitionChannels, insiders } from '../../utils/select-options'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import { formatDateInputChange } from '../../utils/methods/shared'
import { useProjectsByPersonalizedFilters } from '@/utils/methods/query/projects'
import FilterMenu from '@/components/identificador/banco-de-dados/FilterMenu'
import ProjectsDBPagination from '@/components/identificador/banco-de-dados/Pagination'
import ErrorComponent from '@/components/utils/ErrorComponent'
import ProjectDBCard from '@/components/identificador/banco-de-dados/ProjectDBCard'
function MainDatebasePage() {
  const router = useRouter()
  const { data: session, status } = useSession({ required: true })
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const { data, isLoading, isError, isSuccess, updateFilters } = useProjectsByPersonalizedFilters({ page })

  const [modalProject, setModalProject] = useState<{ isOpen: boolean; projectId: string | null }>({ isOpen: false, projectId: null })
  const projects = data?.projects
  const projectsMatched = data?.projectsMatched
  const totalPages = data?.totalPages
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="grow p-6">
        <div className="flex w-full flex-col gap-2 border-b border-gray-200 p-1">
          <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
            <div className="flex items-center gap-1">
              {filterMenuIsOpen ? (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(false)} />
                </div>
              ) : (
                <div className="cursor-pointer text-gray-600 hover:text-blue-400">
                  <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setFilterMenuIsOpen(true)} />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black uppercase text-[#15599a]">BANCO DE CLIENTES</h1>
              </div>
            </div>
          </div>
          {filterMenuIsOpen ? <FilterMenu updateFilters={updateFilters} queryLoading={isLoading} resetSelectedPage={() => setPage(1)} /> : null}
        </div>
        <ProjectsDBPagination
          activePage={page}
          selectPage={(page) => setPage(page)}
          queryLoading={isLoading}
          totalPages={totalPages || 0}
          projectsMatched={projectsMatched}
          projectsShowing={projects?.length}
        />
        <div className="mt-4 flex flex-wrap justify-between gap-2 py-2">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Erro ao buscar projetos.'} /> : null}
          {isSuccess && projects
            ? projects.map((project) => (
                <ProjectDBCard key={project._id} project={project} handleClick={(id) => setModalProject({ isOpen: true, projectId: id })} />
              ))
            : null}
        </div>
        {/* <div className="mt-4  flex flex-wrap justify-around gap-3">
          {!filteredProjects ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                onClick={() => {
                  handleOpenModal(project._id)
                }}
                initial={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 0.3, delay: 0.01 * index }}
                key={project._id}
                className="w-full cursor-pointer border  border-gray-200 p-3 hover:bg-blue-100 md:w-[250px] lg:w-[450px]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
                  <p className="text-xs text-[#15599a]">#{project.qtde}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-yellow-500">{project.cidade && project.cidade}</p>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xxs">VENDEDOR</span>
                    <p className="text-xs text-[#15599a]">{project.vendedor && project.vendedor.nome}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-700">TIPO DE SERVIÇO</p>
                  <p className="text-xs font-bold text-gray-700">{project.tipoDeServico ? project.tipoDeServico : '-'}</p>
                </div>
              </motion.div>
            ))
          )}
        </div> */}
        {modalProject.isOpen && modalProject.projectId && (
          <ModalDB
            projectId={modalProject.projectId}
            closeModal={() => setModalProject({ isOpen: false, projectId: null })}
            modalIsOpen={modalProject.isOpen}
          />
        )}
      </div>
    )
  }
}

export default MainDatebasePage
