import React from 'react'
import { TServiceOrder } from '@/utils/schemas/service-order'
import CheckboxInput from '@/components/inputs/Checkbox'
import CheckboxWithDate from '@/components/inputs/CheckboxWithDate'
type ServiceOrderPendenciesBlockProps = {
  infoHolder: TServiceOrder
  updateInfoHolder: (changes: Partial<TServiceOrder>) => void
}
function ServiceOrderPendenciesBlock({ infoHolder, updateInfoHolder }: ServiceOrderPendenciesBlockProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h1 className="w-full rounded bg-primary p-1 text-center font-bold text-primary-foreground">PENDÊNCIAS</h1>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="DIAGRAMAS FEITOS"
            labelTrue="DIAGRAMAS FEITOS"
            date={infoHolder.pendencias?.diagramas || null}
            handleChange={(value) => {
              console.log(value)
              updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), diagramas: value ? value : null } })
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="DESENHOS FEITOS"
            labelTrue="DESENHOS FEITOS"
            date={infoHolder.pendencias?.desenhos || null}
            handleChange={(value) => {
              updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), desenhos: value ? value : null } })
            }}
          />
        </div>
        <div className="w-fit">
          <CheckboxWithDate
            labelFalse="MAPAS DE MICRO"
            labelTrue="MAPAS DE MICRO"
            date={infoHolder.pendencias?.mapasDeMicro || null}
            handleChange={(value) => {
              updateInfoHolder({ pendencias: { ...(infoHolder.pendencias || {}), mapasDeMicro: value ? value : null } })
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ServiceOrderPendenciesBlock
