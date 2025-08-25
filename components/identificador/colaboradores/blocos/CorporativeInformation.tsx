import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { cidadesAtendidas, formatDate } from '@/utils/constants'
import { estadosECidades } from '@/utils/estados_cidades'
import { formatToCEP } from '@/utils/methods/formatting'
import { formatDateInputChange, getCEPInfo } from '@/utils/methods/shared'
import { TEmployee, TEmployeeDTO, TUser } from '@/utils/schemas/users'
import { InstructionLevels, NaturalPersonMaritalStatus, VinculationCompanies } from '@/utils/select-options'
import React from 'react'
import toast from 'react-hot-toast'
import PositionsMenu from '../PositionsMenu'
import WorkingHoursMenu from '../WorkingHoursMenu'
import AuxiliarContactsMenu from '../AuxiliarContactsMenu'

type CorporativeInformationProps = {
  infoHolder: TEmployeeDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TEmployeeDTO>>
}
function CorporativeInformation({ infoHolder, setInfoHolder }: CorporativeInformationProps) {
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
            uf: addressInfo.uf,
            cidade: addressInfo.localidade.toUpperCase(),
          },
        }))
      }
    }, 1000)
  }
  return (
    <div className="flex w-full flex-col gap-y-2">
      <h1 className="bg-primary/80 w-full rounded py-1 text-center font-bold text-white">INFORMAÇÕES CORPORATIVAS</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <SelectInput
            label="EMPRESA"
            options={VinculationCompanies}
            value={infoHolder.empresaVinculada}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, empresaVinculada: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, empresaVinculada: VinculationCompanies[0].value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE ADMISSÃO"
            value={infoHolder.dataAdmissao ? formatDate(infoHolder.dataAdmissao) : undefined}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, dataAdmissao: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full pt-2 text-center text-sm font-medium">CARGOS</h1>
      <PositionsMenu infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>} />
      <h1 className="w-full pt-2 text-center text-sm font-medium">HORÁRIOS DE TRABALHO</h1>
      <WorkingHoursMenu infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>} />

      <h1 className="w-full pt-2 text-center text-sm font-medium">CONTATOS AUXILIARES</h1>
      <AuxiliarContactsMenu infoHolder={infoHolder} setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TEmployeeDTO>>} />

      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="ESTADO CIVIL"
            options={NaturalPersonMaritalStatus}
            value={infoHolder.estadoCivil}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, estadoCivil: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, estadoCivil: NaturalPersonMaritalStatus[0].value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <SelectInput
            label="GRAU DE INSTRUÇÃO"
            options={InstructionLevels}
            value={infoHolder.grauInstrucao}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, grauInstrucao: value }))}
            onReset={() => setInfoHolder((prev) => ({ ...prev, grauInstrucao: InstructionLevels[0].value }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <NumberInput
            label="NÚMERO DE FILHOS"
            placeholder="Preencha o número de filhos, se houver, do colaborador."
            value={infoHolder.qtdeFilhos}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, qtdeFilhos: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="RG"
            placeholder="Preencha aqui o RG do colaborador..."
            value={infoHolder.rg}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, rg: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="TÍTULO DE ELEITOR"
            placeholder="Preencha aqui o título de eleitor do colaborador..."
            value={infoHolder.tituloEleitor}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tituloEleitor: value }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full pt-2 text-center text-sm font-medium">CARTEIRA DE TRABALHO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TextInput
            label="PIS/PASEB"
            placeholder="Preencha aqui o PIS/Paseb do colaborador..."
            value={infoHolder.carteiraTrabalho.pisPaseb}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, carteiraTrabalho: { ...prev.carteiraTrabalho, pisPaseb: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="NÚMERO"
            placeholder="Preencha aqui o número da carteira de trabalho do colaborador..."
            value={infoHolder.carteiraTrabalho.numero}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, carteiraTrabalho: { ...prev.carteiraTrabalho, numero: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TextInput
            label="SÉRIE"
            placeholder="Preencha aqui a série da carteira de trabalho do colaborador..."
            value={infoHolder.carteiraTrabalho.serie}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, carteiraTrabalho: { ...prev.carteiraTrabalho, serie: value } }))}
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full pt-2 text-center text-sm font-medium">CARTEIRA DE TRÂNSITO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="NÚMERO"
            placeholder="Preencha aqui o número da CNH do colaborador..."
            value={infoHolder.carteiraTransito.numero || ''}
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, carteiraTransito: { ...prev.carteiraTransito, numero: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <DateInput
            label="DATA DE VENCIMENTO"
            value={infoHolder.carteiraTransito.dataVencimento ? formatDate(infoHolder.carteiraTransito.dataVencimento) : undefined}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, carteiraTransito: { ...prev.carteiraTransito, dataVencimento: formatDateInputChange(value) } }))
            }
            width="100%"
          />
        </div>
      </div>
      <h1 className="w-full pt-2 text-center text-sm font-medium">ENDEREÇO</h1>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/3">
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
                localizacao: { ...prev.localizacao, cep: formatToCEP(value) },
              }))
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/3">
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
        </div>
        <div className="w-full lg:w-1/3">
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
            onReset={() => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: '' } }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <TextInput
            label="BAIRRO"
            value={infoHolder.localizacao.bairro}
            placeholder="Preencha aqui o bairro do cliente."
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, bairro: value } }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="LOGRADOURO/RUA"
            value={infoHolder.localizacao.endereco}
            placeholder="Preencha aqui o logradouro do cliente."
            handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <TextInput
          label="NÚMERO/IDENTIFICADOR"
          value={infoHolder.localizacao.numeroOuIdentificador}
          placeholder="Preencha aqui o número ou identificador da residência do cliente."
          handleChange={(value) =>
            setInfoHolder((prev) => ({
              ...prev,
              localizacao: { ...prev.localizacao, numeroOuIdentificador: value },
            }))
          }
          width="100%"
        />
      </div>
    </div>
  )
}

export default CorporativeInformation
