import TextInput from '@/components/inputs/Text'
import { formatDate, formatToPhone } from '@/utils/constants'
import { formatToCPForCNPJ } from '@/utils/methods/formatting'
import { TEmployee, TEmployeeDTO } from '@/utils/schemas/users'
import React, { useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import SystemAccess from './blocos/SystemAccess'
import DateInput from '@/components/inputs/Date'
import { formatDateInputChange } from '@/utils/methods/shared'
import CorporativeInformation from './blocos/CorporativeInformation'
import { Session } from 'next-auth'
import Documents from './blocos/Documents'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { createEmployee } from '@/utils/methods/mutation/employees'
import { useQueryClient } from 'react-query'

type NewEmployeeProps = {
  session: Session
  closeModal: () => void
}
function NewEmployee({ session, closeModal }: NewEmployeeProps) {
  const queryClient = useQueryClient()
  const [infoHolder, setInfoHolder] = useState<TEmployee>({
    acessoAtivo: false,
    nome: '',
    email: '',
    telefone: '',
    senha: '',
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
      },
      ordensDeServico: {
        criar: false,
        visualizar: false,
        editar: false,
      },
    },
    empresaVinculada: '', //
    dataNascimento: null, //
    localNascimento: '',
    nacionalidade: '', //
    estadoCivil: '', //
    grauInstrucao: '', //
    tituloEleitor: '', //
    carteiraTrabalho: {
      pisPaseb: '', //
      numero: '', //
      serie: '', //
    },
    rg: '', //
    cpf: '', //
    carteiraTransito: {
      numero: '', //
      dataVencimento: null, //
    },
    qtdeFilhos: 0, //
    localizacao: {
      cep: null, //
      uf: null, //
      cidade: null, //
      bairro: '', //
      endereco: '', //
      numeroOuIdentificador: '', //
    },
    dataAdmissao: null, //
    cargos: [], //
    salarioBase: 0,
    horariosTrabalho: [], //
    contatosAuxiliares: [],
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataInsercao: new Date().toISOString(),
  })

  const { mutate: handleCreateEmployee, isLoading } = useMutationWithFeedback({
    mutationKey: ['create-employee'],
    mutationFn: createEmployee,
    queryClient: queryClient,
    affectedQueryKey: ['employees'],
  })
  return (
    <div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">CADASTRO DE COLABORADOR</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <h1 className="w-full rounded bg-gray-800 py-1 text-center font-bold text-white">INFORMAÇÕES GERAIS</h1>
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="NOME DO COLABORADOR"
                  placeholder="Preencha aqui o nome do colaborador..."
                  value={infoHolder.nome}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="CPF DO COLABORADOR"
                  placeholder="Preencha aqui o CPF do colaborador..."
                  value={infoHolder.cpf}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cpf: formatToCPForCNPJ(value) }))}
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
            <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <DateInput
                  label="DATA DE NASCIMENTO"
                  value={infoHolder.dataNascimento ? formatDate(infoHolder.dataNascimento) : undefined}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataNascimento: formatDateInputChange(value) }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="NACIONALIDADE"
                  placeholder="Preencha aqui a nacionalidade do colaborador..."
                  value={infoHolder.nacionalidade}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nacionalidade: value }))}
                  width="100%"
                />
              </div>
            </div>
            <SystemAccess
              initialMode={true}
              infoHolder={infoHolder as TEmployeeDTO}
              setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>}
            />
            <CorporativeInformation
              infoHolder={infoHolder as TEmployeeDTO}
              setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>}
            />
          </div>
          <div className="my-1 flex w-full items-center justify-end">
            <button
              disabled={isLoading}
              // @ts-ignore
              onClick={() => handleCreateEmployee({ info: infoHolder })}
              className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
            >
              CADASTRAR COLABORADOR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewEmployee
