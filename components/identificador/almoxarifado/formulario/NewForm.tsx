import SelectInput from '@/components/inputs/Select'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import TextInput from '@/components/inputs/Text'
import { useClients } from '@/utils/methods/query/clients'
import { getCEPInfo } from '@/utils/methods/shared'
import { TNewWarehouseFormulary } from '@/utils/schemas/warehouse-formularies'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { VscChromeClose } from 'react-icons/vsc'
import { estadosECidades } from '../../../../utils/estados_cidades'
import { formatToCEP } from '@/utils/methods/formatting'
import { useMaterials } from '@/utils/methods/query/materials'
import MaterialsBlock from './MaterialsBlock'
import { equipesTecnicas, serviceOrdersCategories } from '@/utils/constants'
import CheckboxInput from '@/components/inputs/Checkbox'
import { createWarehouseFormulary } from '@/utils/methods/mutation/warehouse-forms'
import { updateManyMaterials } from '@/utils/methods/mutation/materials'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'
type NewFormProps = {
  session: Session
  closeModal: () => void
  invalidateQuery: () => void
}
function NewForm({ session, closeModal, invalidateQuery }: NewFormProps) {
  const queryClient = useQueryClient()
  const [vinculateClient, setVinculateClient] = useState<boolean>(true)
  const [externalResponsible, setExternalResponsible] = useState<boolean>(false)
  const { data: clients, isLoading: clientsLoading, isFetching: clientsFetching } = useClients(!!session.user)
  const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormulary>({
    titulo: '',
    categoria: '',
    responsaveis: '',
    projeto: {
      id: null,
      nome: null,
    },
    localizacao: {
      cep: null,
      uf: null,
      cidade: null,
      bairro: '',
      endereco: '',
      numeroOuIdentificador: '',
      complemento: '',
      distancia: null,
    },
    materiais: [],
    autor: {
      id: session.user.id,
      nome: session.user.nome,
      avatar_url: session.user.avatar_url,
    },
    dataEfetivacao: null,
    dataInsercao: new Date().toISOString(),
  })
  function resetInfoHolder() {
    setInfoHolder({
      titulo: '',
      categoria: '',
      responsaveis: '',
      projeto: {
        id: null,
        nome: null,
        identificador: null,
      },
      localizacao: {
        cep: null,
        uf: null,
        cidade: null,
        bairro: '',
        endereco: '',
        numeroOuIdentificador: '',
        complemento: '',
        distancia: null,
      },
      materiais: [],
      autor: {
        id: session.user.id,
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      },
      dataEfetivacao: null,
      dataInsercao: new Date().toISOString(),
    })
  }
  async function setAddressDataByCEP(cep: string) {
    const addressInfo = await getCEPInfo(cep)
    const toastID = toast.loading('Buscando informações sobre o CEP...', {
      duration: 2000,
    })
    setTimeout(() => {
      if (addressInfo) {
        toast.dismiss(toastID)
        toast.success('Dados do CEP buscados com sucesso.', {
          duration: 1000,
        })
        setInfoHolder((prev) => ({
          ...prev,
          localizacao: {
            ...prev.localizacao,
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf as keyof typeof estadosECidades,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }))
      }
    }, 1000)
  }
  async function handleFormularyCreation() {
    try {
      if (infoHolder.materiais.length == 0) return toast.error('Adicione ao menos um material.')

      // Formatting updates for material take away
      const updates = infoHolder.materiais
        .filter((m) => !!m.id)
        .map((material) => {
          return {
            id: material.id as string,
            nome: material.nome,
            diferenca: -material.qtdeRetirada,
          }
        })
      const project = infoHolder.projeto
      const title = project.id ? `SAIDA PARA ${project.nome}` : infoHolder.titulo
      const formulary = { ...infoHolder, titulo: title }
      // Calling method for stock formulary creation
      const formularyId = await createWarehouseFormulary({ info: formulary, mode: 'id' })
      // Calling method for stock quantities update
      const updateResponse = await updateManyMaterials({ formularyId, project, updates })

      return 'Formulário criado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleCreation, isPending } = useMutationWithFeedback({
    mutationKey: ['create-stock-formulary'],
    mutationFn: handleFormularyCreation,
    queryClient: queryClient,
    affectedQueryKey: ['warehouse-forms'],
    callbackFn: async () => {
      await invalidateQuery()
      resetInfoHolder()
    },
  })
  return (
    <div id="new-warehouse-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVO FORMULÁRIO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            {vinculateClient ? (
              <>
                <p className=" w-full py-2 text-center font-medium tracking-tight text-gray-500">
                  Se o formulário de saída de materiais possuir relação com algum cliente, vincule o cliente no menu abaixo. Se não,{' '}
                  <strong onClick={() => setVinculateClient(false)} className="cursor-pointer text-[#fead41]">
                    clique aqui
                  </strong>{' '}
                  para outros tipos de formulário.
                </p>
                <SelectVirtualizedInput
                  label="CLIENTE"
                  options={
                    clients?.map((client) => ({ id: client._id, label: `(${client.qtde}) ${client.nomeDoContrato}`, value: client._id })) || []
                  }
                  value={infoHolder.projeto.id}
                  handleChange={(value) => {
                    const equivalent = clients?.find((client) => client._id == value)
                    if (!equivalent) return
                    const { qtde, nomeDoContrato, cep, uf, cidade, bairro, logradouro, numeroResidencia } = equivalent
                    setInfoHolder((prev) => ({
                      ...prev,
                      projeto: { id: value, nome: nomeDoContrato, identificador: qtde },
                      localizacao: { ...prev.localizacao, cep: cep as string, uf, cidade, bairro, logradouro, numeroResidencia },
                    }))
                  }}
                  selectedItemLabel="NÃO DEFINIDO"
                  onReset={() => setInfoHolder((prev) => ({ ...prev, projeto: { ...prev.projeto, id: null } }))}
                  width="100%"
                />
              </>
            ) : (
              <>
                <p className=" w-full py-2 text-center font-medium tracking-tight text-gray-500">
                  Preencha um titulo para esse formulário de saída de materiais para futura identificação e filtro. Caso o formulário estiver
                  relacionado a um cliente,{' '}
                  <strong onClick={() => setVinculateClient(true)} className="cursor-pointer text-[#fead41]">
                    clique aqui
                  </strong>
                </p>
                <TextInput
                  label="TITULO DO FORMULÁRIO"
                  placeholder="Preencha aqui um titulo para identificação e filtro desse formulário posteriomente..."
                  value={infoHolder.titulo}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, titulo: value }))}
                  width="100%"
                />
              </>
            )}
            <div className="my-2 flex w-full items-center justify-center">
              <CheckboxInput
                labelFalse="RESPONSÁVEL INTERNO"
                labelTrue="RESPONSÁVEL INTERNO"
                checked={!externalResponsible}
                handleChange={(value) => {
                  setExternalResponsible((prev) => !prev)
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="CATEGORIA"
                  value={infoHolder.categoria}
                  options={serviceOrdersCategories}
                  selectedItemLabel="NÃO DEFINIDO"
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: '' }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                {externalResponsible ? (
                  <TextInput
                    label="RESPONSÁVEL(IS)"
                    placeholder="Preencha aqui o nome dos responsáveis pelo material.."
                    value={infoHolder.responsaveis}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
                    width="100%"
                  />
                ) : (
                  <SelectInput
                    label="RESPONSÁVEL(IS)"
                    value={infoHolder.responsaveis}
                    options={equipesTecnicas}
                    selectedItemLabel="NÃO DEFINIDO"
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, responsaveis: value }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, responsaveis: '' }))}
                    width="100%"
                  />
                )}
              </div>
            </div>

            <MaterialsBlock formHolder={infoHolder} setFormHolder={setInfoHolder} blockDevolution={true} />
            <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-1 text-center text-sm font-bold text-white">LOCALIZAÇÃO</h1>
            <div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
              <TextInput
                label="CEP"
                value={infoHolder.localizacao.cep?.toString() || ''}
                placeholder="Preencha aqui o CEP do cliente."
                handleChange={(value) => {
                  if (value.length == 9) {
                    setAddressDataByCEP(value)
                  }
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao,
                      cep: formatToCEP(value),
                    },
                  }))
                }}
                width="100%"
              />
              <SelectInput
                label="ESTADO"
                value={infoHolder.localizacao.uf}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: { ...prev.localizacao, uf: value, cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string },
                  }))
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: '', cidade: '' } }))}
                options={Object.keys(estadosECidades).map((state, index) => ({
                  id: index + 1,
                  label: state,
                  value: state,
                }))}
                width="100%"
              />
              <SelectInput
                label="CIDADE"
                value={infoHolder.localizacao.cidade}
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: value } }))}
                options={
                  infoHolder.localizacao.uf
                    ? estadosECidades[infoHolder.localizacao.uf as keyof typeof estadosECidades].map((city, index) => ({
                        id: index + 1,
                        value: city,
                        label: city,
                      }))
                    : null
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => setInfoHolder((prev) => ({ ...prev, cidade: '' }))}
                width="100%"
              />
            </div>
            <div className="grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
              <TextInput
                label="BAIRRO"
                value={infoHolder.localizacao.bairro || ''}
                placeholder="Preencha aqui o bairro do cliente."
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, bairro: value } }))}
                width="100%"
              />
              <TextInput
                label="LOGRADOURO/RUA"
                value={infoHolder.localizacao.endereco || ''}
                placeholder="Preencha aqui o logradouro do cliente."
                handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))}
                width="100%"
              />
            </div>
            <div className="mb-2 grid grid-cols-1 grid-rows-2 items-center gap-6 px-2 lg:grid-cols-2 lg:grid-rows-1">
              <TextInput
                label="NÚMERO/IDENTIFICADOR"
                value={infoHolder.localizacao.numeroOuIdentificador || ''}
                placeholder="Preencha aqui o número ou identificador da residência do cliente."
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao,
                      numeroOuIdentificador: value,
                    },
                  }))
                }
                width="100%"
              />
              <TextInput
                label="COMPLEMENTO"
                value={infoHolder.localizacao.complemento || ''}
                placeholder="Preencha aqui algum complemento do endereço."
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    localizacao: { ...prev.localizacao, complemento: value },
                  }))
                }
                width="100%"
              />
            </div>
          </div>
          <div className="my-1 flex w-full items-center justify-end">
            <button
              disabled={isPending}
              onClick={() => handleCreation()}
              className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
            >
              CRIAR FORMULÁRIO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewForm
