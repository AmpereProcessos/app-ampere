import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import UserCard from '@/components/identificador/usuarios/UserCard'
import NewUser from '@/components/identificador/usuarios/NewUser'
import EditUser from '@/components/identificador/usuarios/EditUser'

import { useUsers } from '@/utils/methods/query/users'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import TextInput from '@/components/inputs/Text'

export default function UsersControl() {
  const router = useRouter()
  const [dropdownMenuVisible, setDropdownMenuVisible] = useState(false)

  const { data: session, status } = useSession({ required: true })
  const { data: users, isLoading, isError, isSuccess, filters, setFilters } = useUsers()
  const [newUserModalIsOpen, setNewUserModalIsOpen] = useState(false)

  const [editUserModal, setEditUserModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null })

  useEffect(() => {
    if (session && !session.user.permissoes.usuarios.visualizar) router.push('/')
  }, [session])
  if (status != 'authenticated') return <LoadingPage />

  return (
    <div className="grow p-6">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="text-center text-2xl font-black uppercase text-[#15599a]">CONTROLE DE USUÁRIOS</p>
            <p className="text-sm tracking-tight text-gray-500">{users?.length || '...'} usuários contabilizados.</p>
          </div>

          {dropdownMenuVisible ? (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(false)} />
            </div>
          ) : (
            <div className="cursor-pointer text-gray-600 hover:text-blue-400">
              <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setDropdownMenuVisible(true)} />
            </div>
          )}
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            onClick={() => setNewUserModalIsOpen(true)}
            className="h-9 whitespace-nowrap rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-gray-800 enabled:hover:text-white"
          >
            NOVO USUÁRIO
          </button>
        </div>
        <AnimatePresence>
          {dropdownMenuVisible ? (
            <motion.div initial={{ scale: 0.8, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 flex w-full flex-col gap-y-2">
              <div className="flex flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
                <TextInput
                  label={'NOME'}
                  value={filters.search}
                  placeholder={'Digite o nome do colaborador...'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap justify-around gap-3">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar usuários.'} /> : null}
        {isSuccess ? (
          users.length > 0 ? (
            users.map((user) => <UserCard user={user} openModal={(id) => setEditUserModal({ id: id, isOpen: true })} />)
          ) : (
            <p className="w-full text-center text-lg font-medium italic text-gray-500">Nenhum usuário encontrado.</p>
          )
        ) : null}
      </div>
      {newUserModalIsOpen ? <NewUser session={session} closeModal={() => setNewUserModalIsOpen(false)} /> : null}
      {editUserModal.isOpen && editUserModal.id ? (
        <EditUser session={session} userId={editUserModal.id} closeModal={() => setEditUserModal({ id: null, isOpen: false })} />
      ) : null}
    </div>
  )

  // return (
  //   <div className="flex grow flex-col overflow-x-hidden bg-[#fff]">
  //     <div className="flex h-[80px] w-full items-center justify-center bg-gray-800 p-2">
  //       <h1 className="text-center font-bold text-white">CONTROLE DE USUÁRIOS</h1>
  //     </div>
  //     {users ? (
  //       <>
  //         <div className="my-4 flex w-full flex-wrap justify-around gap-2">
  //           {users.map((user, index) => (
  //             <CardControleUsuarios key={user._id} userInfo={user} openModal={() => handleOpenModal(user)} />
  //           ))}
  //         </div>
  //       </>
  //     ) : (
  //       <div className="flex w-full items-center justify-center p-2">
  //         <div role="status">
  //           <svg
  //             aria-hidden="true"
  //             className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
  //             viewBox="0 0 100 101"
  //             fill="none"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  //               fill="currentColor"
  //             />
  //             <path
  //               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  //               fill="currentFill"
  //             />
  //           </svg>
  //           <span className="sr-only">Loading...</span>
  //         </div>
  //       </div>
  //     )}

  //     <div
  //       onClick={() => setNewUserModalIsOpen(true)}
  //       className="left-150 fixed bottom-10 ml-10 cursor-pointer rounded-lg bg-[#15599a] p-3 text-white hover:bg-[#fead61] hover:text-[#15599a]"
  //     >
  //       <p className="text-sm font-bold uppercase">NOVO USUÁRIO</p>
  //     </div>
  //     {newUserModalIsOpen && <ModalNovoUsuario closeModal={() => setNewUserModalIsOpen(false)} />}
  //     {editionModalIsOpen && <ModalEdicaoUsuario userInfo={editionModalObj} getUsers={getUsers} closeModal={() => setEditionModalIsOpen(false)} />}
  //   </div>
  // )
}
