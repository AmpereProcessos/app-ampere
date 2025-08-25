import { estadosECidades } from '@/utils/estados_cidades'
import { getCEPInfo } from '@/utils/methods/shared'
import { TProjectDTOWithHomologation } from '@/utils/schemas/projects'
import React from 'react'

import toast from 'react-hot-toast'
import TextInput from '../inputs/Text'
import SelectInput from '../inputs/Select'
import { formatToCEP } from '@/utils/methods/formatting'

type LocationInformationProps = {
  infoHolder: TProjectDTOWithHomologation
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
}
function LocationInformation({ infoHolder, setInfoHolder, changes, setChanges }: LocationInformationProps) {
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
          homologacao: {
            ...prev.homologacao,
            localizacao: {
              ...prev.homologacao.localizacao,
              endereco: addressInfo.logradouro,
              bairro: addressInfo.bairro,
              uf: addressInfo.uf as keyof typeof estadosECidades,
              cidade: addressInfo.localidade.toUpperCase(),
            },
          },
        }))
        setChanges((prev) => ({
          ...prev,
          'homologacao.localizacao.endereco': addressInfo.logradouro,
          'homologacao.localizacao.bairro': addressInfo.bairro,
          'homologacao.localizacao.uf': addressInfo.uf as keyof typeof estadosECidades,
          'homologacao.localizacao.cidade': addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">LOCALIZAÇÃO DA INSTALAÇÃO ELÉTRICA</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="CEP"
            value={infoHolder.homologacao.localizacao.cep || ''}
            placeholder="Preencha aqui o CEP da instalação..."
            handleChange={(value) => {
              if (value.length == 9) {
                setAddressDataByCEP(value)
              }
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  localizacao: {
                    ...prev.homologacao.localizacao,
                    cep: formatToCEP(value),
                  },
                },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.cep': formatToCEP(value) }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="ESTADO"
            value={infoHolder.homologacao.localizacao.uf}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  localizacao: {
                    ...prev.homologacao.localizacao,
                    uf: value,
                    cidade: estadosECidades[value as keyof typeof estadosECidades][0] as string,
                  },
                },
              }))
              setChanges((prev) => ({
                ...prev,
                'homologacao.localizacao.uf': value,
                'homologacao.localizacao.cidade': estadosECidades[value as keyof typeof estadosECidades][0] as string,
              }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, uf: '', cidade: '' } },
              }))
              setChanges((prev) => ({
                ...prev,
                'homologacao.localizacao.uf': '',
                'homologacao.localizacao.cidade': '',
              }))
            }}
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
            value={infoHolder.homologacao.localizacao.cidade}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, cidade: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.cidade': value }))
            }}
            options={
              infoHolder.homologacao.localizacao.uf
                ? estadosECidades[infoHolder.homologacao.localizacao.uf as keyof typeof estadosECidades].map((city, index) => ({
                    id: index + 1,
                    value: city,
                    label: city,
                  }))
                : null
            }
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, cidade: '' } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.cidade': '' }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="BAIRRO"
            value={infoHolder.homologacao.localizacao.bairro || ''}
            placeholder="Preencha aqui o bairro do instalação..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, bairro: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.bairro': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LOGRADOURO/RUA"
            value={infoHolder.homologacao.localizacao.endereco || ''}
            placeholder="Preencha aqui o logradouro da instalação..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, endereco: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.endereco': value }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NÚMERO/IDENTIFICADOR"
            value={infoHolder.homologacao.localizacao.numeroOuIdentificador || ''}
            placeholder="Preencha aqui o número ou identificador da residência da instalação..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, numeroOuIdentificador: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.numeroOuIdentificador': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="COMPLEMENTO"
            value={infoHolder.homologacao.localizacao.complemento || ''}
            placeholder="Preencha aqui algum complemento do endereço..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, complemento: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.complemento': value }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LATITUDE"
            value={infoHolder.homologacao.localizacao.latitude || ''}
            placeholder="Preencha aqui a latitude da instalação..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, latitude: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.latitude': value }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LONGITUDE"
            value={infoHolder.homologacao.localizacao.longitude || ''}
            placeholder="Preencha aqui a longitude da instalação..."
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                homologacao: { ...prev.homologacao, localizacao: { ...prev.homologacao.localizacao, longitude: value } },
              }))
              setChanges((prev) => ({ ...prev, 'homologacao.localizacao.longitude': value }))
            }}
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default LocationInformation
