import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { getCEPInfo } from '@/utils/methods/shared'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import React from 'react'
import toast from 'react-hot-toast'
import AllCities from '@/utils/jsons/cidades.json'
import { formatToCEP, formatToCPForCNPJ } from '@/utils/methods/formatting'
import { estadosECidades } from '@/utils/estados_cidades'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import CheckboxInput from '@/components/inputs/Checkbox'
import TextareaInput from '@/components/inputs/TextareaInput'
type ElectricalInstallationInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function ElectricalInstallationInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: ElectricalInstallationInformationBlockProps) {
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
          enderecoInstalacao: addressInfo.logradouro,
          bairroInstalacao: addressInfo.bairro,
          ufInstalacao: addressInfo.uf,
          cidadeInstalacao: addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">INFORMAÇÕES DA INSTALAÇÃO</h1>
      <div className="flex w-full items-center justify-center">
        <TextInput
          label="ID DE HOMOLOGAÇÃO AVULSA (SE HOUVER)"
          value={infoHolder.idHomologacao || ''}
          placeholder="Preencha aqui o ID de uma homologação avulsa se houver..."
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, idHomologacao: value }))}
        />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="REALIZAR HOMOLOGAÇÃO"
            labelTrue="REALIZAR HOMOLOGAÇÃO"
            checked={!!infoHolder.realizarHomologacao}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, realizarHomologacao: value }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="MODALIDADE FAST-TRACK"
            labelTrue="MODALIDADE FAST-TRACK"
            checked={!!infoHolder.homologacaoFastTrack}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, homologacaoFastTrack: value }))}
          />
        </div>
      </div>
      <TextareaInput
        label="OBSERVAÇÕES P/ HOMOLOGAÇÃO"
        placeholder="Preencha aqui informações relevantes relacionadas a homologação"
        value={infoHolder.observacoesHomologacao || ''}
        handleChange={(value) => setInfoHolder((prev) => ({ ...prev, observacoesHomologacao: value }))}
      />

      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NOME DO TITULAR DO PROJETO'}
            placeholder="Preencha o nome do titular do projeto..."
            editable={userHasEditPermission}
            value={infoHolder.nomeTitularProjeto || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                nomeTitularProjeto: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CPF/CNPJ DO TITULAR DO PROJETO'}
            placeholder="Preencha o CPF/CNPJ do titular do projeto..."
            editable={userHasEditPermission}
            value={infoHolder.cpf_cnpjTitularProjeto || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                cpf_cnpjTitularProjeto: formatToCPForCNPJ(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'NÚMERO DA INSTALAÇÃO ELÉTRICA'}
            placeholder="Preencha o nome do titular do projeto..."
            editable={userHasEditPermission}
            value={infoHolder.numeroInstalacao || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                numeroInstalacao: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <SelectInput
            label={'TIPO DO TITULAR'}
            editable={userHasEditPermission}
            value={infoHolder.tipoDoTitular}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDoTitular: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDoTitular: 'PESSOA FISICA' }))}
            options={[
              { id: 1, label: 'PESSOA FISICA', value: 'PESSOA FISICA' },
              { id: 2, label: 'PESSOA JURIDICA', value: 'PESSOA JURIDICA' },
              { id: 3, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label={'TIPO DA LIGAÇÃO'}
            editable={userHasEditPermission}
            value={infoHolder.tipoDaLigacao}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDaLigacao: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDaLigacao: 'EXISTENTE' }))}
            options={[
              { id: 1, label: 'NOVA', value: 'NOVA' },
              { id: 2, label: 'EXISTENTE', value: 'EXISTENTE' },
              { id: 3, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label={'TIPO DA INSTALAÇÃO'}
            editable={userHasEditPermission}
            value={infoHolder.tipoDaInstalacao}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDaInstalacao: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDaInstalacao: 'URBANO' }))}
            options={[
              { id: 1, label: 'RURAL', value: 'RURAL' },
              { id: 2, label: 'URBANO', value: 'URBANO' },
            ]}
            width="100%"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'LOGIN(CEMIG ATENDE)'}
            placeholder="Preencha o login da plataforma da concessionária..."
            editable={userHasEditPermission}
            value={infoHolder.loginCemigAtende}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, loginCemigAtende: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'SENHA(CEMIG ATENDE)'}
            placeholder="Preencha a senha da plataforma da concessionária..."
            editable={userHasEditPermission}
            value={infoHolder.senhaCemigAtende}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, senhaCemigAtende: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CEP INSTALAÇÃO'}
            placeholder="Preencha o CEP da do endereço instalação..."
            editable={userHasEditPermission}
            value={infoHolder.cepInstalacao}
            handleChange={(value) => {
              if (value.length == 9) {
                setAddressDataByCEP(value)
              }
              setInfoHolder((prev) => ({
                ...prev,
                cepInstalacao: formatToCEP(value),
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectInput
            label="UF DE INSTALAÇÃO"
            value={infoHolder.uf}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, ufInstalacao: value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({ ...prev, ufInstalacao: 'NÃO DEFINIDO' }))
            }}
            options={Object.keys(estadosECidades).map((state, index) => ({ id: index + 1, label: state, value: state }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectVirtualizedInput
            label={'CIDADE DE INSTALAÇÃO'}
            editable={userHasEditPermission}
            value={infoHolder.cidadeInstalacao}
            selectedItemLabel="NÃO DEFINIDO"
            options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                cidadeInstalacao: value,
              }))
            }}
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                cidadeInstalacao: '',
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'BAIRRO DE INSTALAÇÃO'}
            placeholder="Preencha o bairro de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.bairroInstalacao}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                bairroInstalacao: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ENDEREÇO DE INSTALAÇÃO'}
            placeholder="Preencha o endereço de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.enderecoInstalacao}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                enderecoInstalacao: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'Nª DE INSTALAÇÃO'}
            placeholder="Preencha o número do endereço de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.numeroResInstalacao || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                numeroResInstalacao: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'PONTO DE REFERÊNCIA'}
            placeholder="Preencha o ponto de referência do endereço de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.pontoDeReferenciaInstalacao || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                pontoDeReferenciaInstalacao: value,
              }))
            }
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-1/2 lg:w-full">
          <TextInput
            label={'LATITUDE DE INSTALAÇÃO'}
            placeholder="Preencha a latitude de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.latitude}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                latitude: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-1/2 lg:w-full">
          <TextInput
            label={'LONGITUDE DE INSTALAÇÃO'}
            placeholder="Preencha a longitude de instalação..."
            editable={userHasEditPermission}
            value={infoHolder.longitude}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                longitude: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}

export default ElectricalInstallationInformationBlock
