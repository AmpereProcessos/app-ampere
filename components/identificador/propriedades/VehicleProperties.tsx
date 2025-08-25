import NumberInput from '@/components/inputs/Number'
import DateInput from '@/components/inputs/Date'
import type { TProperty, TPropertyMetadataVehicle, TPropertyUsageVehicleUsageMetadata } from '@/utils/schemas/properties'
import { Car, Circle, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { formatDateInputChange } from '@/utils/methods/shared'
import { formatDate } from '@/utils/constants'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import CheckboxInput from '@/components/inputs/Checkbox'

type VehiclePropertiesProps = {
  isDesktop: boolean
  infoHolder: TProperty
  updateInfoHolder: (info: Partial<TProperty>) => void
}
function VehicleProperties({ isDesktop, infoHolder, updateInfoHolder }: VehiclePropertiesProps) {
  if (infoHolder.metadados?.tipo !== 'VEÍCULO') return null

  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)

  function handleAddReview(info: TPropertyMetadataVehicle['revisoes'][number]) {
    if (info.km === null || Number.isNaN(info.km)) return

    const currentReviews = infoHolder.metadados?.revisoes ?? []
    const interval = infoHolder.metadados?.kmIntervaloRevisao ?? 0
    const currentKm = infoHolder.metadados?.kmAcumulado ?? 0

    const updatedReviews = [...currentReviews, info]
    const updatedNextRevisionKm = currentKm + interval

    updateInfoHolder({
      metadados: {
        ...infoHolder.metadados,
        revisoes: updatedReviews,
        kmProximaRevisao: updatedNextRevisionKm,
      },
    })

    setIsAddReviewOpen(false)
  }

  function handleDeleteReview(index: number) {
    updateInfoHolder({ metadados: { ...infoHolder.metadados, revisoes: infoHolder.metadados?.revisoes.filter((_, i) => i !== index) } })
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="bg-primary/20 flex w-fit items-center gap-2 rounded px-2 py-1">
        <Car size={15} />
        <h1 className="w-fit text-start text-xs font-medium tracking-tight">INFORMAÇÕES DO VEÍCULO</h1>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="KILOMETRAGEM INICIAL"
            placeholder="Preencha a kilometragem inicial..."
            value={infoHolder.metadados?.kmInicial}
            handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmInicial: value } })}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <NumberInput
            label="KILOMETRAGEM ACUMULADA"
            placeholder="Preencha a kilometragem acumulada..."
            value={infoHolder.metadados?.kmAcumulado}
            handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmAcumulado: value } })}
            width="100%"
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <h1 className="w-fit text-start text-[0.65rem] font-medium tracking-tight">INFORMAÇÕES DA REVISÃO DO VEÍCULO </h1>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="KILOMETRAGEM DO INTERVALO DE REVISÃO"
              placeholder="Preencha a kilometragem do intervalo de revisão..."
              value={infoHolder.metadados?.kmIntervaloRevisao}
              handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmIntervaloRevisao: value } })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <NumberInput
              label="KILOMETRAGEM DA PRÓXIMA REVISÃO"
              placeholder="Preencha a kilometragem da próxima revisão..."
              value={infoHolder.metadados?.kmProximaRevisao}
              handleChange={(value) => updateInfoHolder({ metadados: { ...infoHolder.metadados, kmProximaRevisao: value } })}
              width="100%"
            />
          </div>
        </div>

        {infoHolder.metadados?.revisoes.length > 0 ? (
          <>
            <h1 className="text-primary/70 w-fit text-start text-[0.65rem] font-medium tracking-tight">REVISÕES DO VEÍCULO </h1>
            <ul className="flex w-full flex-col gap-1">
              {infoHolder.metadados?.revisoes.map((review, reviewIndex) => (
                <li key={review.data} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Circle className="h-3 min-h-3 w-3 min-w-3" />
                    <span className="text-xs font-medium tracking-tight">
                      Revisão em {review.km}km, feita em {formatDateAsLocale(review.data)}.
                    </span>
                  </div>

                  <Button
                    size={'fit'}
                    className="gap- flex items-center px-2 py-1 transition-colors hover:bg-red-100 hover:text-red-500"
                    variant="ghost"
                    onClick={() => handleDeleteReview(reviewIndex)}
                  >
                    <Trash className="h-3 min-h-3 w-3 min-w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="flex w-full items-center justify-end">
          <Button type="button" onClick={() => setIsAddReviewOpen(true)} size={'fit'} className="gap- flex items-center px-2 py-1" variant="ghost">
            <Plus size={15} />
            <span className="text-xs font-medium tracking-tight">ADICIONAR REVISÃO</span>
          </Button>
        </div>
      </div>
      {isAddReviewOpen ? (
        <NewReviewMenu
          initialKm={infoHolder.metadados?.kmAcumulado ?? 0}
          isDesktop={isDesktop}
          closeModal={() => setIsAddReviewOpen(false)}
          addReview={handleAddReview}
        />
      ) : null}
    </div>
  )
}

export default VehicleProperties

type NewReviewMenuProps = {
  initialKm: number
  isDesktop: boolean
  closeModal: () => void
  addReview: (review: TPropertyMetadataVehicle['revisoes'][number]) => void
}
function NewReviewMenu({ initialKm, isDesktop, closeModal, addReview }: NewReviewMenuProps) {
  const [reviewInfo, setReviewInfo] = useState<TPropertyMetadataVehicle['revisoes'][number]>({
    km: initialKm,
    data: new Date().toISOString(),
  })
  function updateReviewInfo(info: Partial<TPropertyMetadataVehicle['revisoes'][number]>) {
    setReviewInfo((prev) => ({ ...prev, ...info }))
  }
  if (isDesktop)
    return (
      <Dialog open onOpenChange={(v) => (!v ? closeModal() : null)}>
        <DialogContent className="dark:bg-background flex h-fit max-h-[70vh] flex-col">
          <DialogHeader>
            <DialogTitle>NOVA REVISÃO</DialogTitle>
            <DialogDescription>Preencha as informações da revisão.</DialogDescription>
          </DialogHeader>

          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="KILOMETRAGEM DA REVISÃO"
                placeholder="Informe a kilometragem da revisão..."
                value={reviewInfo.km}
                handleChange={(value) => updateReviewInfo({ km: value })}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <DateInput
                label="DATA DA REVISÃO"
                value={formatDate(reviewInfo.data)}
                handleChange={(value) => updateReviewInfo({ data: formatDateInputChange(value) as string })}
                width="100%"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">CANCELAR</Button>
            </DialogClose>
            <Button onClick={() => addReview(reviewInfo)} disabled={reviewInfo.km === null || !reviewInfo.data}>
              ADICIONAR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  return (
    <Drawer open onOpenChange={(v) => (!v ? closeModal() : null)}>
      <DrawerContent className="flex h-fit max-h-[70vh] flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>NOVA REVISÃO</DrawerTitle>
          <DrawerDescription>Preencha as informações da revisão.</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-auto px-4">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <NumberInput
                label="KILOMETRAGEM DA REVISÃO"
                placeholder="Informe a kilometragem da revisão..."
                value={reviewInfo.km}
                handleChange={(value) => updateReviewInfo({ km: value })}
                width="100%"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <DateInput
                label="DATA DA REVISÃO"
                value={formatDate(reviewInfo.data)}
                handleChange={(value) => updateReviewInfo({ data: formatDateInputChange(value) as string })}
                width="100%"
              />
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">CANCELAR</Button>
          </DrawerClose>
          <Button onClick={() => addReview(reviewInfo)} disabled={reviewInfo.km === null || !reviewInfo.data}>
            ADICIONAR
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
