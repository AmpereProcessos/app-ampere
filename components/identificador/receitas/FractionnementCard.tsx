import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import { formatDate, formatDecimalPlaces, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue } from '@/utils/schemas/revenues'
import React from 'react'
import { BsCalendar, BsCalendarCheck } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'

type FractionnementCardProps = {
  fractionnement: TRevenue['fracionamento'][number]
  fractionnementIndex: number
  infoHolder: TRevenue
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>
  deleteFractionnement: () => void
}
function FractionnementCard({ fractionnement, fractionnementIndex, infoHolder, setInfoHolder, deleteFractionnement }: FractionnementCardProps) {
  function updateFractionnementIndex({ info }: { info: TRevenue['fracionamento'][number] }) {
    const fractionnements = [...infoHolder.fracionamento]
    fractionnements[fractionnementIndex] = { ...info }
    return setInfoHolder((prev) => ({ ...prev, fracionamento: fractionnements }))
  }
  return (
    <div className={`flex w-full flex-col rounded-md border border-gray-500 p-2 shadow-sm`}>
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-black leading-none tracking-tight lg:text-sm">FRAÇÃO DE {formatDecimalPlaces(fractionnement.porcentagem)}%</h1>
          <h1 className="rounded-full bg-gray-800 px-2 py-1 text-[0.65rem] font-medium text-white lg:text-xs">
            {formatToMoney((infoHolder.total * fractionnement.porcentagem) / 100)}
          </h1>
          <button
            onClick={() => deleteFractionnement()}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <MdDelete style={{ color: 'red' }} />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="VALOR"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui o valor do fracionamento..."
            value={fractionnement.valor || null}
            handleChange={(value) =>
              updateFractionnementIndex({ info: { ...fractionnement, valor: value, porcentagem: (value / infoHolder.total) * 100 } })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="PORCENTAGEM"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui a porcentagem do fracionamento..."
            value={fractionnement.porcentagem}
            handleChange={(value) =>
              updateFractionnementIndex({ info: { ...fractionnement, porcentagem: value, valor: (value * infoHolder.total) / 100 } })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="PREVISÃO DE RECEBIMENTO"
            labelClassName="text-sm tracking-tight"
            value={fractionnement.dataPrevisaoRecebimento ? formatDate(fractionnement.dataPrevisaoRecebimento) : undefined}
            handleChange={(value) =>
              updateFractionnementIndex({ info: { ...fractionnement, dataPrevisaoRecebimento: formatDateInputChange(value) } })
            }
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE RECEBIMENTO"
            labelClassName="text-sm tracking-tight"
            value={fractionnement.dataRecebimento ? formatDate(fractionnement.dataRecebimento) : undefined}
            handleChange={(value) => updateFractionnementIndex({ info: { ...fractionnement, dataRecebimento: formatDateInputChange(value) } })}
            width="100%"
          />
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
