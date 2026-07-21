'use client'

import { TPropertyUsageStore, usePropertyUsageStore } from '@/utils/stores/property-usage'
import { TGetTemporaryUsageByPropertyOutput } from '@/pages/api/propriedades/uso-temporario/propriedade'
import { validateVehicleUsageFinishSubmission } from '@/lib/property-usage'
import { LoadingButton } from '@/components/utils/Buttons/LoadingButton'
import { handleMultipleAttachmentsUpdate, type TPropertyUsageClientMetrics } from '@/utils/methods/uploading'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import TextareaInput from '@/components/inputs/TextareaInput'
import { getErrorMessage } from '@/utils/methods/handlers'
import { updatePropertyUsage as updatePropertyUsageMutation } from '@/utils/methods/mutation/properties'
import VehicleUsagePropertyHeader from './blocks/VehicleUsagePropertyHeader'
import VehicleUsageResponsibleSelector from './blocks/VehicleUsageResponsibleSelector'
import VehicleUsageKilometerAttachment from './blocks/VehicleUsageKilometerAttachment'
import VehicleUsageSuccessScreen from './blocks/VehicleUsageSuccessScreen'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FullscreenUploadProgress from '@/components/utils/FullscreenUploadProgress'
type VehicleUsageFinishProps = {
  usageId: string
  property: TGetTemporaryUsageByPropertyOutput['data']['property']
}
export default function VehicleUsageFinish({ usageId, property }: VehicleUsageFinishProps) {
  const router = useRouter()
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const attachments = usePropertyUsageStore((state) => state.attachments)
  const propertyUsage = usePropertyUsageStore((state) => state.propertyUsage)
  const updatePropertyUsage = usePropertyUsageStore((state) => state.updatePropertyUsage)
  const updatePropertyUsageMetadata = usePropertyUsageStore((state) => state.updatePropertyUsageMetadata)
  const reset = usePropertyUsageStore((state) => state.reset)
  const propertyUsageNotes = usePropertyUsageStore((state) => state.propertyUsage.anotacoes)

  async function handleFinishPropertyUsage({
    stateHolder,
    usageId,
    property,
    attachments,
  }: {
    usageId: string
    property: TGetTemporaryUsageByPropertyOutput['data']['property']
    stateHolder: TPropertyUsageStore['propertyUsage']
    attachments: TPropertyUsageStore['attachments']
  }) {
    setUploadProgress(0)
    let clientMetrics: TPropertyUsageClientMetrics | undefined
    const filesMetadata = await handleMultipleAttachmentsUpdate({
      attachments,
      vinculationId: property._id,
      onProgress: setUploadProgress,
      onMetrics: (metrics) => {
        clientMetrics = metrics
        console.info('[PROPERTY_USAGE_UPLOAD_COMPLETED]', { operation: 'finish', ...metrics })
      },
    })
    const mergedFilesMetadata = [...(stateHolder.arquivos ?? []), ...filesMetadata]

    return await updatePropertyUsageMutation({
      id: usageId,
      changes: { ...stateHolder, arquivos: mergedFilesMetadata, dataFim: new Date().toISOString() },
      clientMetrics,
    })
  }

  const {
    mutate: handleUsageMutation,
    isPending: isUsageMutationLoading,
    isSuccess: isUsageMutationSuccess,
  } = useMutation({
    mutationKey: ['handle-usage-finish-mutation'],
    mutationFn: handleFinishPropertyUsage,
    onSuccess: (data) => {
      toast.success(data.message)
      reset()
    },
    onError: (error) => {
      setUploadProgress(null)
      toast.error(getErrorMessage(error))
    },
  })

  useEffect(() => {
    if (!isUsageMutationSuccess) return
    const timeout = setTimeout(() => {
      router.refresh()
    }, 5000)
    return () => clearTimeout(timeout)
  }, [isUsageMutationSuccess, router])

  if (isUsageMutationSuccess) {
    return <VehicleUsageSuccessScreen title="USO FINALIZADO COM SUCESSO" message="A finalização foi registrada com sucesso." />
  }

  return (
    <div className="bg-background mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-start gap-4 px-4 py-6 sm:py-10">
      <div className="bg-card border-border flex w-full flex-col items-center gap-6 rounded-lg border p-4 shadow-xs sm:p-6">
        <VehicleUsagePropertyHeader title="FINALIZAÇÃO DO USO DO VEÍCULO" property={property} />

        <VehicleUsageResponsibleSelector />
        <VehicleUsageKilometerAttachment
          property={property}
          attachmentIdentifier="foto_painel_final"
          title="IMAGEM DA QUILOMETRAGEM FINAL"
          helper="Anexe uma foto do painel do veículo."
          previewAlt="Imagem da quilometragem final."
          kmValue={propertyUsage.metadados.kmFinal}
          onKmChange={(value) => updatePropertyUsageMetadata({ kmFinal: value })}
        />
        <TextareaInput
          label="ANOTAÇÕES"
          placeholder="Preencha aqui qualquer detalhe relevante, como detalhes de uma possível avaria, etc..."
          value={propertyUsageNotes ?? ''}
          handleChange={(value) => updatePropertyUsage({ anotacoes: value })}
        />
        <FullscreenUploadProgress
          value={isUsageMutationLoading ? uploadProgress : null}
          title="Finalizando o uso do veículo"
          messages={['Enviando as imagens…', 'Finalizando o uso…', 'Sincronizando os dados…']}
        />
        <div className="flex w-full items-center justify-end">
          <LoadingButton
            loading={isUsageMutationLoading}
            onClick={() => {
              const validationError = validateVehicleUsageFinishSubmission({
                attachments,
                authorId: propertyUsage.autor.id,
                kmInicial: propertyUsage.metadados.kmInicial,
                kmFinal: propertyUsage.metadados.kmFinal,
              })
              if (validationError) {
                toast.error(validationError)
                return
              }
              handleUsageMutation({
                usageId,
                property,
                stateHolder: propertyUsage,
                attachments,
              })
            }}
          >
            FINALIZAR USO
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
