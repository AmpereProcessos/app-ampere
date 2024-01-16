import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import { formatDate, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue } from '@/utils/schemas/revenues'
import React from 'react'
import { BsCalendar, BsCalendarCheck } from 'react-icons/bs'

type FractionnementCardProps = {
  fractionnement: TRevenue['fracionamento'][number]
  fractionnementIndex: number
  infoHolder: TRevenue
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>
}
function FractionnementCard({ fractionnement, fractionnementIndex, infoHolder, setInfoHolder }: FractionnementCardProps) {
  function updateFractionnementIndex({ info }: { info: TRevenue['fracionamento'][number] }) {
    const fractionnements = [...infoHolder.fracionamento]
    fractionnements[fractionnementIndex] = { ...info }
    return setInfoHolder((prev) => ({ ...prev, fracionamento: fractionnements }))
  }
  return (
    <div className={`flex w-full flex-col rounded-md border border-gray-500 p-2 shadow-sm`}>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">FRAÇÃO DE {fractionnement.porcentagem}%</h1>
          <h1 className="rounded-full bg-gray-800 px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">
            {formatToMoney((infoHolder.total * fractionnement.porcentagem) / 100)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="grow">
            <NumberInput
              label="PORCENTAGEM"
              placeholder="Preencha aqui a porcentagem do fracionamento..."
              value={fractionnement.porcentagem}
              handleChange={(value) => updateFractionnementIndex({ info: { ...fractionnement, porcentagem: value } })}
              width="100%"
            />
          </div>
          <div className="grow">
            <DateInput
              label="PREVISÃO DE RECEBIMENTO"
              value={fractionnement.dataPrevisaoRecebimento ? formatDate(fractionnement.dataPrevisaoRecebimento) : undefined}
              handleChange={(value) =>
                updateFractionnementIndex({ info: { ...fractionnement, dataPrevisaoRecebimento: formatDateInputChange(value) } })
              }
              width="100%"
            />
          </div>
          <div className="grow">
            <DateInput
              label="DATA DE RECEBIMENTO"
              value={fractionnement.dataRecebimento ? formatDate(fractionnement.dataRecebimento) : undefined}
              handleChange={(value) => updateFractionnementIndex({ info: { ...fractionnement, dataRecebimento: formatDateInputChange(value) } })}
              width="100%"
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-wrap items-center justify-start gap-2">
        <div className="flex items-center gap-2">
          <BsCalendar color={'#ffc300'} />
          <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
            PREVISTO PARA {formatDateAsLocale(fractionnement.dataPrevisaoRecebimento)}
          </p>
        </div>
        {fractionnement.dataRecebimento ? (
          <div className="flex items-center gap-2">
            <BsCalendarCheck color={'#76c893'} />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
              RECEBIDO EM {formatDateAsLocale(fractionnement.dataRecebimento)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default FractionnementCard
