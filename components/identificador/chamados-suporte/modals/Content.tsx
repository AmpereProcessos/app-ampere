import SelectInputVirtualized from '@/components/inputs/SelectVirtualized'
import TextInput from '@/components/inputs/Text'

import { TSupportCall } from '@/utils/schemas/support-calls'
import { Check, LayoutGrid, Loader, X } from 'lucide-react'
import { useState } from 'react'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import SelectInput from '@/components/inputs/Select'
import TextareaInput from '@/components/inputs/TextareaInput'
import { FaSolarPanel, FaWrench } from 'react-icons/fa'
import DateInput from '@/components/inputs/Date'
import { formatDate, tiposChamadosSuporte } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { cn } from '@/lib/utils'

import { useUsers } from '@/utils/methods/query/users'
import SelectWithImages from '@/components/inputs/SelectWithImages'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { BsCalendarCheck } from 'react-icons/bs'

const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, value: c, label: c }))

type GeneralProps = {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}
export function General({ infoHolder, updateInfoHolder }: GeneralProps) {
  const { data: users } = useUsers()
  function handleEffectivationUpdate(newValue: TSupportCall['statusChamado'], previousData: TSupportCall) {
    if (newValue === 'RESOLVIDO') {
      if (previousData.statusChamado !== 'RESOLVIDO') return new Date().toISOString()
      return previousData.fechamento
    }
    if (previousData.statusChamado === 'FECHADO') return undefined
    return previousData.fechamento
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <LayoutGrid size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES GERAIS</h1>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'ABERTO', fechamento: handleEffectivationUpdate('ABERTO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-orange-300 px-3 py-1.5 text-sm text-orange-800', {
            'opacity-100': infoHolder.statusChamado === 'ABERTO',
            'opacity-50': infoHolder.statusChamado !== 'ABERTO',
          })}
        >
          <X className="h-4 min-h-4 w-4 min-w-4" />
          ABERTO
        </button>
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'EM ANDAMENTO', fechamento: handleEffectivationUpdate('EM ANDAMENTO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-blue-300 px-3 py-1.5 text-sm text-blue-800', {
            'opacity-100': infoHolder.statusChamado === 'EM ANDAMENTO',
            'opacity-50': infoHolder.statusChamado !== 'EM ANDAMENTO',
          })}
        >
          <Loader className="h-4 min-h-4 w-4 min-w-4" />
          EM ANDAMENTO
        </button>
        <button
          onClick={() => updateInfoHolder({ statusChamado: 'RESOLVIDO', fechamento: handleEffectivationUpdate('RESOLVIDO', infoHolder) })}
          className={cn('flex items-center gap-1 rounded-md bg-green-300 px-3 py-1.5 text-sm text-green-800', {
            'opacity-100': infoHolder.statusChamado === 'RESOLVIDO',
            'opacity-50': infoHolder.statusChamado !== 'RESOLVIDO',
          })}
        >
          <Check className="h-4 min-h-4 w-4 min-w-4" />
          RESOLVIDO
        </button>
      </div>
      {infoHolder.fechamento ? (
        <div className={`flex w-fit items-center gap-1 self-center rounded-md bg-green-200 px-1.5 py-0.5 text-[0.65rem] font-bold text-green-700`}>
          <BsCalendarCheck className="h-3 min-h-3 w-3 min-w-3" />
          {formatDateAsLocale(infoHolder.fechamento, true)}
        </div>
      ) : null}
      <SelectWithImages
        label="RESPONSÁVEL"
        value={infoHolder.responsavel}
        handleChange={(value) => {
          const selectedUser = users?.find((user) => user._id === value)
          if (selectedUser) {
            updateInfoHolder({
              responsavel: selectedUser._id,
              responsavelUsuario: {
                id: selectedUser._id,
                nome: selectedUser.nome,
                avatar_url: selectedUser.avatar_url,
              },
            })
          } else {
            updateInfoHolder({ responsavel: undefined, responsavelUsuario: undefined })
          }
        }}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ responsavel: undefined })}
        options={
          users?.map((user) => ({
            id: user._id,
            label: user.nome,
            value: user._id,
            url: user.avatar_url ?? undefined,
          })) || []
        }
        width="100%"
      />
      <SelectInput
        label="TIPO DE CHAMADO"
        options={tiposChamadosSuporte.map((tipo, index) => ({
          id: index + 1,
          label: tipo.tipo,
          value: tipo.tipo,
        }))}
        value={infoHolder.tipoChamado}
        handleChange={(value) => updateInfoHolder({ tipoChamado: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ tipoChamado: undefined })}
        width="100%"
      />
      <TextareaInput
        label="DESCRIÇÃO DO PROBLEMA"
        value={infoHolder.descricaoProblema ?? ''}
        placeholder="Preencha aqui a descrição do problema..."
        handleChange={(value) => updateInfoHolder({ descricaoProblema: value })}
      />
      <SelectInputVirtualized
        label="CIDADE"
        options={AllCities}
        value={infoHolder.cidade}
        handleChange={(value) => updateInfoHolder({ cidade: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ cidade: undefined })}
        width="100%"
      />
      <SelectInput
        label="DEMANDA"
        options={[
          {
            id: 1,
            label: 'INTERNA',
            value: 'INTERNA',
          },
          {
            id: 2,
            label: 'EXTERNA',
            value: 'EXTERNA',
          },
        ]}
        value={infoHolder.demanda}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ demanda: undefined })}
        handleChange={(value) => updateInfoHolder({ demanda: value })}
        width="100%"
      />
      <TextareaInput
        label="ANOTAÇÕES"
        value={infoHolder.anotacoes ?? ''}
        placeholder="Preencha aqui as anotações..."
        handleChange={(value) => updateInfoHolder({ anotacoes: value })}
      />
    </div>
  )
}

export function PowerPlantInfo({
  infoHolder,
  updateInfoHolder,
}: {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <FaSolarPanel size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DA USINA</h1>
      </div>
      <TextInput
        label="NOME DA USINA"
        value={infoHolder.nomeUsina ?? ''}
        placeholder="Preencha aqui o nome da usina..."
        handleChange={(value) => updateInfoHolder({ nomeUsina: value })}
        width="100%"
      />
      <div className="flex w-full flex-col gap-1">
        <TextInput
          label="LINK DA USINA"
          value={infoHolder.linkMonitoramento ?? ''}
          placeholder="Preencha aqui o link da usina..."
          handleChange={(value) => updateInfoHolder({ linkMonitoramento: value })}
          width="100%"
        />
        {infoHolder.linkMonitoramento ? (
          <a href={infoHolder.linkMonitoramento} target="_blank" rel="noopener noreferrer" className="text-center text-cyan-500 hover:text-cyan-700">
            {infoHolder.linkMonitoramento}
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function WarrantyInfo({
  infoHolder,
  updateInfoHolder,
}: {
  infoHolder: TSupportCall
  updateInfoHolder: (info: Partial<TSupportCall>) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <FaWrench size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DA GARANTIA</h1>
      </div>
      <SelectInputVirtualized
        label="EQUIPAMENTO DE GARANTIA"
        options={[
          {
            id: 1,
            label: 'PLACA',
            value: 'PLACA',
          },
          {
            id: 2,
            label: 'INVERSOR/MICRO',
            value: 'INVERSOR/MICRO',
          },
          {
            id: 3,
            label: 'COMUNICADOR',
            value: 'COMUNICADOR',
          },
        ]}
        value={infoHolder.equipamento}
        handleChange={(value) => updateInfoHolder({ equipamento: value })}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ equipamento: undefined })}
        width="100%"
      />
      <SelectInput
        label="STATUS DA GARANTIA"
        options={[
          {
            id: 1,
            label: 'IDENTIFICAÇÃO E TESTES',
            value: 'IDENTIFICAÇÃO E TESTES',
          },
          {
            id: 2,
            label: 'EM PROCESSO DE APROVAÇÃO',
            value: 'EM PROCESSO DE APROVAÇÃO',
          },
          {
            id: 3,
            label: 'APROVADO',
            value: 'APROVADO',
          },
          {
            id: 4,
            label: 'EQUIPAMENTO EM ROTA',
            value: 'EQUIPAMENTO EM ROTA',
          },
          {
            id: 5,
            label: 'ENTREGUE',
            value: 'ENTREGUE',
          },
          {
            id: 6,
            label: 'INSTALADO',
            value: 'INSTALADO',
          },
          {
            id: 7,
            label: 'NÃO DEFINIDO',
            value: 'NÃO DEFINIDO',
          },
        ]}
        value={infoHolder.statusGarantia}
        selectedItemLabel="NÃO DEFINIDO"
        onReset={() => updateInfoHolder({ statusGarantia: undefined })}
        handleChange={(value) => updateInfoHolder({ statusGarantia: value })}
        width="100%"
      />
      <DateInput
        label="ÚLTIMA ATUALIZAÇÃO DO CLIENTE"
        value={formatDate(infoHolder.ultAtualizacaoCliente)}
        handleChange={(value) => updateInfoHolder({ ultAtualizacaoCliente: formatDateInputChange(value, 'string') as string })}
        width="100%"
      />
    </div>
  )
}
