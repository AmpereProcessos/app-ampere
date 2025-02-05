import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import SelectInput from '@/components/inputs/Select'
import SelectVirtualizedInput from '@/components/inputs/SelectVirtualized'
import TextInput from '@/components/inputs/Text'
import { formatDate, formatToPhone, tiposDeServico } from '@/utils/constants'
import { estadosECidades } from '@/utils/estados_cidades'
import { formatToCEP, formatToCPForCNPJ } from '@/utils/methods/formatting'
import { usePartnersSimplified } from '@/utils/methods/query/crm/partners'
import { formatDateInputChange, getCEPInfo } from '@/utils/methods/shared'
import { TContractRequestDTO } from '@/utils/schemas/contract-requests'
import { allSellers, customersAcquisitionChannels, serviceTypes } from '@/utils/select-options'
import React from 'react'
import toast from 'react-hot-toast'
import AllCities from '@/utils/jsons/cidades.json'
import TextareaInput from '@/components/inputs/TextareaInput'
type GeneralInformationBlockProps = {
  infoHolder: TContractRequestDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TContractRequestDTO>>
  userHasEditPermission: boolean
}
function GeneralInformationBlock({ infoHolder, setInfoHolder, userHasEditPermission }: GeneralInformationBlockProps) {
  const { data: partners } = usePartnersSimplified()
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
          enderecoCobranca: addressInfo.logradouro,
          bairro: addressInfo.bairro,
          uf: addressInfo.uf,
          cidade: addressInfo.localidade.toUpperCase(),
        }))
      }
    }, 1000)
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="w-full rounded bg-gray-800 p-1 text-center font-bold text-white">INFORMAÇÕES GERAIS</h1>
      <div className="flex items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="JÁ É CLIENTE AMPÈRE"
            labelTrue="JÁ É CLIENTE AMPÈRE"
            checked={infoHolder.clienteAmpere == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, clienteAmpere: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'VENDEDOR'}
            value={infoHolder.nomeVendedor}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            options={allSellers.map((vendedor) => ({
              id: vendedor.id,
              label: vendedor.label,
              value: vendedor.value,
            }))}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nomeVendedor: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, nomeVendedor: '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'CÓDIGO DO PROJETO'}
            placeholder="Preencha o código da oportunidade..."
            editable={userHasEditPermission}
            value={infoHolder.codigoSVB}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, codigoSVB: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'TIPO DE SERVIÇO'}
            editable={userHasEditPermission}
            value={infoHolder.tipoDeServico}
            selectedItemLabel="NÃO DEFINIDO"
            options={serviceTypes.map((tipo, index) => ({ id: index + 1, label: tipo.label, value: tipo.value }))}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipoDeServico: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, tipoDeServico: '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'SEGMENTO'}
            editable={userHasEditPermission}
            value={infoHolder.segmento}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, value: 'RESIDENCIAL', label: 'RESIDENCIAL' },
              { id: 2, value: 'COMERCIAL', label: 'COMERCIAL' },
              { id: 3, value: 'INDUSTRIAL', label: 'INDUSTRIAL' },
              { id: 4, value: 'RURAL', label: 'RURAL' },
            ]}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, segmento: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, segmento: '' }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'NOME/RAZÃO SOCIAL'}
            placeholder="Preencha o nome do contrato..."
            editable={userHasEditPermission}
            value={infoHolder.nomeDoContrato}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                nomeDoContrato: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'CPF/CNPJ'}
            placeholder="Preencha o CPF/CNPJ para contrato..."
            editable={userHasEditPermission}
            value={infoHolder.cpf_cnpj}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, cpf_cnpj: formatToCPForCNPJ(value) }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'RG'}
            placeholder="Preencha aqui o RG do titular..."
            editable={userHasEditPermission}
            value={infoHolder.rg}
            handleChange={(value) => setInfoHolder((prev) => ({ ...infoHolder, rg: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'EMPRESA/FILIAL'}
            selectedItemLabel="NÃO DEFINIDO"
            value={infoHolder.idParceiro}
            options={partners?.map((p) => ({ id: p._id, label: p.nome, value: p._id })) || []}
            editable={true}
            handleChange={(value) => {
              const partner = partners?.find((p) => p._id == value)
              setInfoHolder((prev) => ({ ...prev, nomeParceiro: partner?.nome || null, idParceiro: value }))
            }}
            onReset={() => setInfoHolder((prev) => ({ ...prev, nomeParceiro: null, idParceiro: null }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-1/2 lg:w-full">
          <TextInput
            label={'Telefone'}
            placeholder="Preencha o telefone do titular..."
            editable={userHasEditPermission}
            value={infoHolder.telefone}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, telefone: formatToPhone(value) }))}
            width="100%"
          />
        </div>
        <div className="w-1/2 lg:w-full">
          <TextInput
            label={'EMAIL'}
            placeholder="Preencha o email para contrato..."
            editable={userHasEditPermission}
            value={infoHolder.email}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, email: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'ESTADO CIVIL'}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            options={[
              { id: 1, label: 'CASADO(A)', value: 'CASADO(A)' },
              { id: 2, label: 'SOLTEIRO(A)', value: 'SOLTEIRO(A)' },
              { id: 3, label: 'UNIÃO ESTÁVEL', value: 'UNIÃO ESTÁVEL' },
              { id: 4, label: 'DIVORCIADO(A)', value: 'DIVORCIADO(A)' },
              { id: 5, label: 'VIUVO(A)', value: 'VIUVO(A)' },
              { id: 6, label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
            ]}
            value={infoHolder.estadoCivil}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, estadoCivil: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, estadoCivil: '' }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label={'DATA DE NASCIMENTO'}
            editable={userHasEditPermission}
            value={formatDate(infoHolder.dataDeNascimento)}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                dataDeNascimento: formatDateInputChange(value),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'PROFISSÃO'}
            placeholder="Preencha a profissão do titular do contrato..."
            editable={userHasEditPermission}
            value={infoHolder.profissao}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, profissao: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ONDE TRABALHA'}
            placeholder="Preencha o local de trabalho do titular do contrato..."
            editable={userHasEditPermission}
            value={infoHolder.ondeTrabalha}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, ondeTrabalha: value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="w-fit self-center">
          <CheckboxInput
            labelFalse="CLIENTE POSSUI ALGUMA DEFICIÊNCIA"
            labelTrue="CLIENTE POSSUI ALGUMA DEFICIÊNCIA"
            checked={infoHolder.possuiDeficiencia == 'SIM'}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, possuiDeficiencia: value ? 'SIM' : 'NÃO' }))}
          />
        </div>
        {infoHolder.possuiDeficiencia == 'SIM' ? (
          <TextInput
            label={'QUAL DEFICIÊNCIA'}
            placeholder="Preencha a deficiência do cliente..."
            editable={userHasEditPermission}
            value={infoHolder.qualDeficiencia}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qualDeficiencia: value }))}
          />
        ) : null}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label={'CEP'}
            placeholder="Preencha o CEP da do endereço de correspondência..."
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
            label="UF"
            value={infoHolder.uf}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, uf: value }))
            }}
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() => {
              setInfoHolder((prev) => ({ ...prev, uf: 'NÃO DEFINIDO' }))
            }}
            options={Object.keys(estadosECidades).map((state, index) => ({ id: index + 1, label: state, value: state }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <SelectVirtualizedInput
            label={'CIDADE'}
            editable={userHasEditPermission}
            value={infoHolder.cidade}
            selectedItemLabel="NÃO DEFINIDO"
            options={AllCities.map((city, index) => ({ id: index + 1, label: city, value: city }))}
            handleChange={(value) => {
              setInfoHolder((prev) => ({
                ...prev,
                cidade: value,
              }))
            }}
            onReset={() => {
              setInfoHolder((prev) => ({
                ...prev,
                cidade: '',
              }))
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'BAIRRO'}
            placeholder="Preencha o bairro de correspondência..."
            editable={userHasEditPermission}
            value={infoHolder.bairro}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                bairro: value.toUpperCase(),
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'ENDEREÇO'}
            placeholder="Preencha o endereço de correspondência..."
            editable={userHasEditPermission}
            value={infoHolder.enderecoCobranca}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                enderecoCobranca: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'Nª DA RESIDÊNCIA'}
            placeholder="Preencha o número do endereço de correspondência..."
            editable={userHasEditPermission}
            value={infoHolder.numeroResCobranca || ''}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                numeroResCobranca: value,
              }))
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={'PONTO DE REFERÊNCIA'}
            placeholder="Preencha o ponto de referência do endereço de correspondência..."
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
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'CANAL DE VENDA'}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            value={infoHolder.canalVenda}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, canalVenda: value }))}
            options={customersAcquisitionChannels.map((value) => value)}
            onReset={() => setInfoHolder((prev) => ({ ...prev, canalVenda: '' }))}
            width="100%"
          />
        </div>
        {infoHolder.canalVenda == 'INDICAÇÃO DE AMIGO' ? (
          <>
            <div className="w-full lg:w-1/4">
              <TextInput
                label={'NOME DO INDICADOR'}
                placeholder="Preencha o nome do indicador..."
                editable={userHasEditPermission}
                value={infoHolder.nomeIndicador}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    nomeIndicador: value,
                  }))
                }
                width="100%"
              />

              <TextInput
                label={'TELEFONE DO INDICADOR'}
                placeholder="Preencha o telefone do indicador..."
                editable={userHasEditPermission}
                value={infoHolder.telefone}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    telefone: formatToPhone(value),
                  }))
                }
                width="100%"
              />
            </div>
          </>
        ) : null}
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={'FORMA DE ASSINATURA'}
            editable={userHasEditPermission}
            selectedItemLabel="NÃO DEFINIDO"
            value={infoHolder.formaAssinatura}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, formaAssinatura: value }))}
            options={[
              { id: 1, value: 'DIGITAL', label: 'DIGITAL' },
              { id: 2, value: 'FISICO', label: 'FISICO' },
            ]}
            onReset={() => setInfoHolder((prev) => ({ ...prev, formaAssinatura: '' }))}
            width="100%"
          />
        </div>
      </div>
      <TextInput
        label="LINK DE PASTA NA NUVEM"
        placeholder="Preencha, se houver, o link da pasta do projeto na nuvem..."
        value={infoHolder.linkDrive || ''}
        handleChange={(value) => setInfoHolder((prev) => ({ ...prev, linkDrive: value }))}
        width="100%"
      />

      <TextareaInput
        label="OBSERVAÇÕES COMERCIAIS"
        placeholder="Preencha aqui observações relevantes sobre o projeto..."
        value={infoHolder.obsComercial || ''}
        handleChange={(value) => setInfoHolder((prev) => ({ ...prev, obsComercial: value }))}
      />
    </div>
  )
}

export default GeneralInformationBlock
