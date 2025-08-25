import TextInput from '@/components/inputs/Text'
import { formatToPhone } from '@/utils/constants'
import { TEmployeeDTO, TUserDTO } from '@/utils/schemas/users'
import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'

import type { TAuthSession } from '@/lib/authentication/types'

import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { updateEmployee } from '@/utils/methods/mutation/employees'
import { useQueryClient } from '@tanstack/react-query'
import SystemAccess from '../colaboradores/blocos/SystemAccess'
import { useUserById } from '@/utils/methods/query/users'
import LoadingPage from '@/components/utils/LoadingPage'
import ErrorComponent from '@/components/utils/ErrorComponent'
import AvatarAttachment from '../colaboradores/AvatarAttachment'

type EditUserProps = { userId: string; session: TAuthSession; closeModal: () => void }
function EditUser({ userId, session, closeModal }: EditUserProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TUserDTO>({
    _id: 'id-holder',
    acessoAtivo: true,
    usuario: '',
    nome: '',
    email: '',
    telefone: '',
    avatar_url: '',
    visualizacao: {
      tipo: null,
      referencia: null,
    },
    permissoes: {
      rotas: [],
      usuarios: {
        escopo: null,
        visualizar: false,
        editar: false,
        criar: false,
      },
      comercial: {
        visualizar: false,
        editar: false,
      },
      posVenda: {
        visualizar: false,
        editar: false,
      },
      suprimentos: {
        visualizar: false,
        editar: false,
      },
      engenharia: {
        visualizar: false,
        editar: false,
      },
      execucao: {
        visualizar: false,
        editar: false,
      },
      suporte: {
        visualizar: false,
        editar: false,
      },
      administrativo: {
        visualizar: false,
        editar: false,
      },
      financeiro: {
        visualizar: false,
        editar: false,
      },
      recursosHumanos: {
        visualizar: false,
        editar: false,
      },
      gestao: {
        visualizarResultados: false,
        restringirProjetos: false,
      },
      ordensDeServico: {
        criar: false,
        visualizar: false,
        editar: false,
      },
    },
    empresaVinculada: '', //
    cargos: [], //
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })
  const { data: employee, isLoading, isSuccess, isError } = useUserById({ id: userId })

  const { mutate: handleUpdateEmployee, isPending: updateLoading } = useMutationWithFeedback({
    mutationKey: ['update-employee'],
    mutationFn: updateEmployee,
    queryClient: queryClient,
    affectedQueryKey: ['employees'],
  })
  useEffect(() => {
    if (employee) setInfoHolder(employee)
  }, [employee])
  return (
    <div id="new-warehouse-form" className="fixed top-0 right-0 bottom-0 left-0 z-100 bg-[rgba(0,0,0,.85)]">
      <div className="bg-background fixed top-[50%] left-[50%] z-100 h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="border-primary/20 flex flex-col items-center justify-between border-b px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white">CADASTRO DE COLABORADOR</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg={'Erro ao buscar usuário.'} /> : null}
          {isSuccess && employee ? (
            <>
              <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1">
                <h1 className="bg-primary/80 w-full rounded py-1 text-center font-bold text-white">INFORMAÇÕES GERAIS</h1>
                <AvatarAttachment userId={userId} userName={employee.usuario} avatar_url={employee.avatar_url || null} />
                <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                  <div className="w-full">
                    <TextInput
                      label="NOME DO COLABORADOR"
                      placeholder="Preencha aqui o nome do colaborador..."
                      value={infoHolder.nome}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
                      width="100%"
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                  <div className="w-full lg:w-1/2">
                    <TextInput
                      label="EMAIL DO COLABORADOR"
                      placeholder="Preencha aqui o email do colaborador..."
                      value={infoHolder.email}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, email: value }))}
                      width="100%"
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <TextInput
                      label="TELEFONE DO COLABORADOR"
                      placeholder="Preencha aqui o telefone do colaborador..."
                      value={infoHolder.telefone}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
                      width="100%"
                    />
                  </div>
                </div>
                <SystemAccess
                  initialMode={true}
                  infoHolder={infoHolder as TEmployeeDTO}
                  setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>}
                />
              </div>
              <div className="my-1 flex w-full items-center justify-end">
                <button
                  disabled={updateLoading}
                  // @ts-ignore
                  onClick={() => handleUpdateEmployee({ id: userId, changes: infoHolder })}
                  className="disabled:bg-primary/60 enabled:hover:bg-primary/70 rounded bg-black px-4 py-1 text-xs font-medium text-white duration-300 ease-in-out"
                >
                  ATUALIZAR USUÁRIO
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default EditUser
