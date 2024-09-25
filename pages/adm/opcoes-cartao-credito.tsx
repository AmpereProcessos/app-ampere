import NumberInput from '@/components/inputs/Number'
import SelectInput from '@/components/inputs/Select'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { formatToMoney } from '@/utils/constants'
import { useCreditCardOptions } from '@/utils/methods/query/credit-card-options'
import { TCreditCardOptionDTO } from '@/utils/schemas/credit-card-options'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

function CreditCardOptions() {
  const { data: session } = useSession({ required: true })
  const { data: options, isLoading, isError, isSuccess, error } = useCreditCardOptions()

  return (
    <div className="grow p-6">
      <div className="flex h-full grow flex-col">
        <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="text-center text-2xl font-black uppercase text-[#15599a]">SIMULAÇÕES DE CARTÃO DE CRÉDITO</p>
              <p className="text-sm tracking-tight text-gray-500">{options?.length || '...'} propriedades contabilizadas</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 py-2">
          {isLoading ? <LoadingPage /> : null}
          {isError ? <ErrorComponent msg="Erro ao buscar dados para simulação..." /> : null}
          {isSuccess ? (
            options.length > 0 ? (
              options.map((option) => <CreditCardOptionCard key={option._id} option={option} />)
            ) : (
              <p className="w-full text-center font-medium italic text-gray-500">Nenhuma opção de simulação encontrada.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CreditCardOptions

type CreditCardOptionCardProps = {
  option: TCreditCardOptionDTO
}
function CreditCardOptionCard({ option }: CreditCardOptionCardProps) {
  const [simulation, setSimulation] = useState<{ valor: number; parcelas: string; opcaoPagamento: string | null }>({
    valor: 0,
    parcelas: '1',
    opcaoPagamento: null,
  })
  function handleSimulation(data: { valor: number; parcelas: string; opcaoPagamento: string | null }) {
    const selected = option.opcoes.find((p) => p.descricao == data.opcaoPagamento)
    if (!selected) return { total: 0, valorParcela: 0 }
    const fractionment = Object.entries(selected.parcelas).find(([key, value]) => key == data.parcelas)
    const tax = fractionment ? fractionment[1] / 100 : 0
    const total = data.valor * Math.pow(1 + tax, Number(data.parcelas))
    return { total, valorParcela: total / Number(data.parcelas) }
  }
  return (
    <div className="flex w-full flex-col gap-2 rounded border border-black">
      <div className="flex w-full items-center justify-center bg-black p-2">
        <div className="flex items-center gap-2">
          <h1 className="font-bold tracking-tight text-white">{option.empresa}</h1>
          <h1 className="rounded-lg bg-blue-800 px-2 py-0.5 text-[0.6rem] font-black text-white">{option.modalidade}</h1>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 p-3">
        {/* <div className="flex w-full flex-col gap-1">
        {option.opcoes.map((paymentOption) => (
          <div className="flex w-full flex-col gap-1 rounded-lg border border-black p-3">
            <h1 className="text-xs tracking-tight text-gray-500">{paymentOption.descricao}</h1>
            <div className="flex w-full flex-wrap items-center gap-2">
              {Object.entries(paymentOption.parcelas).map(([key, value]) => (
                <div className="flex items-center gap-1 rounded-lg bg-gray-600 px-2 py-1 text-[0.6rem] text-white">
                  <h1 className="">{key}x</h1>
                  <h1 className="font-black">{value}%</h1>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <NumberInput
              label="VALOR SIMULADO"
              placeholder="Preencha aqui o valor de simulado..."
              value={simulation.valor}
              handleChange={(value) => setSimulation((prev) => ({ ...prev, valor: value }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="PARCELAS"
              value={simulation.parcelas}
              options={[
                { id: 1, label: '1x', value: '1' },
                { id: 2, label: '2x', value: '2' },
                { id: 3, label: '3x', value: '3' },
                { id: 4, label: '4x', value: '4' },
                { id: 5, label: '5x', value: '5' },
                { id: 6, label: '6x', value: '6' },
                { id: 7, label: '7x', value: '7' },
                { id: 8, label: '8x', value: '8' },
                { id: 9, label: '9x', value: '9' },
                { id: 10, label: '10x', value: '10' },
                { id: 11, label: '11x', value: '11' },
                { id: 12, label: '12x', value: '12' },
              ]}
              handleChange={(value) => setSimulation((prev) => ({ ...prev, parcelas: value }))}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setSimulation((prev) => ({ ...prev, parcelas: '1' }))}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="MÉTODO/BANDEIRA"
              value={simulation.opcaoPagamento}
              options={option.opcoes.map((x, index) => ({ id: index + 1, label: x.descricao, value: x.descricao }))}
              handleChange={(value) => setSimulation((prev) => ({ ...prev, opcaoPagamento: value }))}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => setSimulation((prev) => ({ ...prev, opcaoPagamento: null }))}
              width="100%"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center ">
          <div className="flex w-[300px] flex-col gap-1 overflow-hidden rounded border border-green-600">
            <h1 className="bg-green-600 p-1 text-center text-[0.6rem] font-bold text-white">RESULTADO</h1>
            <div className="flex w-full flex-col gap-1 p-3">
              <h1 className="font-black">{formatToMoney(handleSimulation(simulation).total)}</h1>
              <h1 className="text-xs tracking-tight text-gray-500">
                {simulation.parcelas}x PARCELAS DE: {formatToMoney(handleSimulation(simulation).valorParcela)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
