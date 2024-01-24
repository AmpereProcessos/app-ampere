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
type NewFormProps = {
  session: Session
  closeModal: () => void
}
function NewForm({ session, closeModal }: NewFormProps) {
  const { data: clients, isLoading: clientsLoading, isFetching: clientsFetching } = useClients(!!session.user)
  const [infoHolder, setInfoHolder] = useState<TNewWarehouseFormulary>({
    titulo: '',
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
      nome: session.user.name,
      avatar_url: session.user.image,
    },
    dataEfetivacao: null,
    dataInsercao: new Date().toISOString(),
  })
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
  console.log(infoHolder)
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
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
            <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-2 text-center font-bold text-white">VINCULAÇÃO DE CLIENTE</h1>
            <p className="w-full text-center font-medium text-gray-500">
              Se o formulário de saída de materiais possuir relação com algum cliente, vincule o cliente no menu abaixo.
            </p>
            <SelectVirtualizedInput
              label="CLIENTE"
              options={clients?.map((client) => ({ id: client._id, label: `(${client.qtde}) ${client.nomeDoContrato}`, value: client._id })) || []}
              value={infoHolder.projeto.id}
              handleChange={(value) => {
                const equivalent = clients?.find((client) => client._id == value)
                if (!equivalent) return
                const { nomeDoContrato, cep, uf, cidade, bairro, logradouro, numeroResidencia } = equivalent
                setInfoHolder((prev) => ({
                  ...prev,
                  projeto: { id: value, nome: nomeDoContrato },
                  localizacao: { ...prev.localizacao, cep: cep as string, uf, cidade, bairro, logradouro, numeroResidencia },
                }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setInfoHolder((prev) => ({ ...prev, projeto: { ...prev.projeto, id: null } }))}
              width="100%"
            />
            <h1 className="mb-2 w-full rounded-md bg-[#15599a] p-2 text-center font-bold text-white">LOCALIZAÇÃO</h1>
            <div className="grid grid-cols-1 grid-rows-3 items-center gap-6 px-2 lg:grid-cols-3 lg:grid-rows-1">
              <TextInput
                label="CEP"
                value={infoHolder.localizacao.cep || ''}
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
            <MaterialsBlock formHolder={infoHolder} setFormHolder={setInfoHolder} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewForm
