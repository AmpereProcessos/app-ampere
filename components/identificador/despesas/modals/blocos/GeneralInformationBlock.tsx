import CheckboxInput from '@/components/inputs/Checkbox'
import DateInput from '@/components/inputs/Date'
import SelectInput from '@/components/inputs/Select'
import TextareaInput from '@/components/inputs/TextareaInput'
import { centrosDeCusto, formatDate } from '@/utils/constants'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TExpense } from '@/utils/schemas/expenses'
import React from 'react'

function getCostCategoriesFromApportionment(costApportionment: string) {
  if (!costApportionment) return []
  const costApportionmentsObj = centrosDeCusto.find((center) => center.nome == costApportionment)
  if (!costApportionmentsObj) return []

  const options = costApportionmentsObj.categorias.map((category, index) => ({
    id: index + 1,
    ...category,
  }))
  return options
}
type ExpenseGeneralInformationBlockProps = {
  infoHolder: TExpense
  setInfoHolder: React.Dispatch<React.SetStateAction<TExpense>>
}
function ExpenseGeneralInformationBlock({ infoHolder, setInfoHolder }: ExpenseGeneralInformationBlockProps) {
  return (
    <div className="flex w-full grow flex-col gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">INFORMAÇÕES GERAIS</h1>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <SelectInput
              editable={true}
              label={'RATEIO / CENTRO DE CUSTO'}
              selectedItemLabel={'NÃO DEFINIDO'}
              value={infoHolder.rateio}
              options={centrosDeCusto.map((center, index) => ({
                id: index + 1,
                label: center.nome,
                value: center.nome,
              }))}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, rateio: value }))}
              onReset={() => setInfoHolder((prev) => ({ ...prev, rateio: '' }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <SelectInput
              editable={true}
              label={'CATEGORIA'}
              selectedItemLabel={'NÃO DEFINIDO'}
              value={infoHolder.categoria}
              options={getCostCategoriesFromApportionment(infoHolder.rateio)}
              handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
              onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: '' }))}
              width={'100%'}
            />
          </div>
        </div>
        <h1 className="w-fit self-center rounded-md bg-primary/10 p-2 text-[0.65rem] leading-none tracking-tight text-primary">
          OBS: O PARÂMETRO DE EFETIVAÇÃO SE REFERE A DATA EM QUE A DESPESA ENTRA NO REGIME DE COMPETÊNCIA.
        </h1>
        <div className="my-2 flex w-full flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <CheckboxInput
              checked={!!infoHolder.efetivacao.efetivado}
              labelFalse={'EFETIVADO'}
              labelTrue={'EFETIVADO'}
              justify="justify-center"
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  efetivacao: {
                    ...prev.efetivacao,
                    efetivado: value,
                  },
                }))
              }
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <DateInput
              label={infoHolder.efetivacao.efetivado ? 'DATA DA EFETIVAÇÃO' : 'PREVISÃO DE EFETIVAÇÃO'}
              labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
              value={infoHolder.efetivacao.data ? formatDate(infoHolder.efetivacao.data) : undefined}
              handleChange={(value) =>
                setInfoHolder((prev) => ({
                  ...prev,
                  efetivacao: {
                    ...prev.efetivacao,
                    data: formatDateInputChange(value),
                  },
                }))
              }
            />
          </div>
        </div>
        <TextareaInput
          label="OBSERVAÇÕES"
          value={infoHolder.descricao}
          placeholder="Preencha aqui informações adicionais sobre a despesa..."
          handleChange={(value) => setInfoHolder((prev) => ({ ...prev, descricao: value }))}
        />
      </div>
    </div>
  )
}

export default ExpenseGeneralInformationBlock
