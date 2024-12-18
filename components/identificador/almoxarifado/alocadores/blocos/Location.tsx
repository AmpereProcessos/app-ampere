import React from 'react'
import toast from 'react-hot-toast'
import { estadosECidades } from '@/utils/estados_cidades'
import { formatToCEP } from '@/utils/methods/formatting'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { TAllocator } from '@/utils/schemas/allocators'
import { getCEPInfo } from '@/utils/methods/shared'

type AllocatorLocationProps = {
  data: TAllocator
  updateAllocator: (data: Partial<TAllocator>) => void
}
function AllocatorLocation({ data, updateAllocator }: AllocatorLocationProps) {
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
        updateAllocator({
          localizacao: {
            ...data.localizacao,
            cep: formatToCEP(cep),
            endereco: addressInfo.logradouro,
            bairro: addressInfo.bairro,
            uf: addressInfo.uf as keyof typeof estadosECidades,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        })
      }
    }, 1000)
  }
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">LOCALIZAÇÃO</h1>
      <div className="flex w-full grow flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label="CEP"
              value={data.localizacao.cep || ''}
              placeholder="Preencha aqui o CEP do alocador..."
              handleChange={(value) => {
                if (value.length == 9) {
                  setAddressDataByCEP(value)
                }
                updateAllocator({ localizacao: { ...data.localizacao, cep: formatToCEP(value) } })
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="ESTADO"
              value={data.localizacao.uf}
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, uf: value } })}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => updateAllocator({ localizacao: { ...data.localizacao, uf: '' } })}
              options={Object.keys(estadosECidades).map((state, index) => ({
                id: index + 1,
                label: state,
                value: state,
              }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="CIDADE"
              value={data.localizacao.cidade}
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, cidade: value } })}
              options={
                data.localizacao.uf
                  ? estadosECidades[data.localizacao.uf as keyof typeof estadosECidades].map((city, index) => ({
                      id: index + 1,
                      value: city,
                      label: city,
                    }))
                  : null
              }
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => updateAllocator({ localizacao: { ...data.localizacao, cidade: '' } })}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <TextInput
              label="BAIRRO"
              value={data.localizacao.bairro || ''}
              placeholder="Preencha aqui o bairro do instalação..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, bairro: value } })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <TextInput
              label="LOGRADOURO/RUA"
              value={data.localizacao.endereco || ''}
              placeholder="Preencha aqui o logradouro do alocador..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, endereco: value } })}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <TextInput
              label="NÚMERO/IDENTIFICADOR"
              value={data.localizacao.numeroOuIdentificador || ''}
              placeholder="Preencha aqui o número ou identificador da residência do alocador..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, numeroOuIdentificador: value } })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <TextInput
              label="COMPLEMENTO"
              value={data.localizacao.complemento || ''}
              placeholder="Preencha aqui algum complemento do endereço..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, complemento: value } })}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <TextInput
              label="LATITUDE"
              value={data.localizacao.latitude || ''}
              placeholder="Preencha aqui a latitude do alocador..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, latitude: value } })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <TextInput
              label="LONGITUDE"
              value={data.localizacao.longitude || ''}
              placeholder="Preencha aqui a longitude do alocador..."
              handleChange={(value) => updateAllocator({ localizacao: { ...data.localizacao, longitude: value } })}
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllocatorLocation
