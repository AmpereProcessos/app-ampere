import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import { formatDate, formatToMoney } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue } from '@/utils/schemas/revenues'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsCalendar, BsCalendarCheck } from 'react-icons/bs'
import FractionnementCard from './FractionnementCard'

type FractionnementsProps = {
  infoHolder: TRevenue
  setInfoHolder: React.Dispatch<React.SetStateAction<TRevenue>>
  missingPercentage: number
}
function Fractionnements({ infoHolder, setInfoHolder, missingPercentage }: FractionnementsProps) {
  const [newFractionnementHolder, setNewFractionnementHolder] = useState<TRevenue['fracionamento'][number]>({
    valor: 0,
    porcentagem: missingPercentage,
    dataPrevisaoRecebimento: new Date().toISOString(),
  })
  function addFractionnement() {
    if (newFractionnementHolder.porcentagem > missingPercentage) return toast.error('Porcentagem excede o máximo permitido.')
    if (!newFractionnementHolder.dataPrevisaoRecebimento) return toast.error('Preencha uma data de previsão de recebimento.')

    const currentFractionnements = [...infoHolder.fracionamento]
    currentFractionnements.push(newFractionnementHolder)
    setInfoHolder((prev) => ({ ...prev, fracionamento: currentFractionnements }))
  }
  function deleteFractionnement(index: number) {
    const currentFractionnements = [...infoHolder.fracionamento]
    currentFractionnements.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, fracionamento: currentFractionnements }))
  }
  useEffect(() => {
    setNewFractionnementHolder((prev) => ({ ...prev, porcentagem: missingPercentage }))
  }, [missingPercentage])
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded text-center font-bold text-white">FRACIONAMENTOS</h1>
      <h1 className="text-primary/60 my-2 w-full self-center text-center text-sm font-medium lg:w-[80%]">
        Os fracionamentos se referem aos <strong className="text-[#fead41]">recebimentos da receita</strong> , ou seja, as parcelas em que a receita
        será divida. Portanto, serão utilizadas como parametro para o{' '}
        <strong className="text-[#fead41]">regime de referência / regime de caixa.</strong>
      </h1>
      <div className="item-center flex w-full flex-col gap-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="VALOR"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui o valor do fracionamento..."
            value={newFractionnementHolder.valor || null}
            handleChange={(value) => setNewFractionnementHolder((prev) => ({ ...prev, valor: value, porcentagem: (value / infoHolder.total) * 100 }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="PORCENTAGEM"
            labelClassName="text-sm tracking-tight"
            placeholder="Preencha aqui a porcentagem do fracionamento..."
            value={newFractionnementHolder.porcentagem}
            handleChange={(value) => setNewFractionnementHolder((prev) => ({ ...prev, porcentagem: value, valor: (value * infoHolder.total) / 100 }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="PREVISÃO DE RECEBIMENTO"
            labelClassName="text-sm tracking-tight"
            value={newFractionnementHolder.dataPrevisaoRecebimento ? formatDate(newFractionnementHolder.dataPrevisaoRecebimento) : undefined}
            handleChange={(value) => setNewFractionnementHolder((prev) => ({ ...prev, dataPrevisaoRecebimento: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <DateInput
            label="DATA DE RECEBIMENTO"
            labelClassName="text-sm tracking-tight"
            value={newFractionnementHolder.dataRecebimento ? formatDate(newFractionnementHolder.dataRecebimento) : undefined}
            handleChange={(value) => setNewFractionnementHolder((prev) => ({ ...prev, dataRecebimento: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <button
          className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
          onClick={() => addFractionnement()}
        >
          ADICIONAR
        </button>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-2">
        {infoHolder.fracionamento.map((fractionnement, index) => (
          <FractionnementCard
            key={index}
            fractionnement={fractionnement}
            fractionnementIndex={index}
            infoHolder={infoHolder}
            setInfoHolder={setInfoHolder}
            deleteFractionnement={() => deleteFractionnement(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Fractionnements
