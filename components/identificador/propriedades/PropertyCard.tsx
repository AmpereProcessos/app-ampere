import { cn } from '@/lib/utils'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import type { TGetPropertiesDefaultOutput } from '@/pages/api/propriedades'
import { Code, Landmark, Pencil, ScanSearch } from 'lucide-react'
import React from 'react'
import { BsCalendarPlus } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getVehicleReviewAlertLevelByKmDifference } from '@/lib/property-usage'
import { PROPERTY_METADATA_TYPES_CONFIG } from '@/lib/properties'
import { renderIconWithClassNames } from '@/utils/methods/rendering'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import Image from 'next/image'

type PropertyCardProps = {
  property: TGetPropertiesDefaultOutput[number]
  openModal: (id: string) => void
}
function PropertyCard({ property, openModal }: PropertyCardProps) {
  const openUsages = property.usosTemporarios || []

  const vehicleReviewAlertLevel =
    property.metadados.tipo === 'VEÍCULO'
      ? getVehicleReviewAlertLevelByKmDifference(property.metadados.kmProximaRevisao - property.metadados.kmAcumulado)
      : null
  return (
    <div className="flex w-full flex-col gap-3 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212] sm:flex-row">
      <div className="flex items-center justify-center">
        <div className="min-w-20 min-h-20 max-w-20 relative h-20 max-h-20 w-20 overflow-hidden rounded-lg">
          {property.imagemUrl ? (
            <Image src={property.imagemUrl} alt={property.nome} fill={true} objectFit="cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/50 text-primary-foreground">
              <Landmark className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="flex h-full grow flex-col justify-between gap-2">
        <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn(PROPERTY_METADATA_TYPES_CONFIG[property.metadados.tipo].stylingClassName, 'rounded-full text-[0.65rem]')}>
              {renderIconWithClassNames(PROPERTY_METADATA_TYPES_CONFIG[property.metadados.tipo].icon, 'h-4 w-4 min-w-4 min-h-4')}
              {property.metadados.tipo}
            </Badge>
            <p className="text-sm font-bold leading-none tracking-tight">{property.nome}</p>
            <div className={cn('flex items-center gap-1')}>
              <Code className="h-4 w-4" />
              <p className="text-xs font-medium tracking-tight">{property.identificador || 'N/A'}</p>
            </div>
            {property.metadados.tipo === 'VEÍCULO' ? (
              <>
                {vehicleReviewAlertLevel ? (
                  <Badge className={cn(vehicleReviewAlertLevel.color, 'rounded-full text-[0.65rem]')}>
                    <ScanSearch size={12} />
                    <p>{vehicleReviewAlertLevel.text}</p>
                  </Badge>
                ) : null}
              </>
            ) : null}
          </div>
          {openUsages.length > 0 ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant={'ghost'} size={'fit'} className="text-xs">
                  {openUsages.length} USOS EM ANDAMENTO
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <h1 className="text-[0.65rem] font-medium">USOS EM ANDAMENTO</h1>
                <div className="flex flex-col gap-3">
                  {openUsages.map((usage) => (
                    <div key={usage._id} className="flex w-full flex-col gap-1 rounded-lg bg-primary/10 p-2">
                      <div className="flex w-full items-center justify-between">
                        <Badge className="rounded-full text-[0.65rem]">{usage.metadados.tipo}</Badge>
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="min-w-4 min-h-4 h-4 w-4">
                            <AvatarImage src={usage.autor.avatar_url ?? undefined} />
                            <AvatarFallback>{formatNameAsInitials(usage.autor.nome)}</AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium tracking-tight">{usage.autor.nome}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <BsCalendarPlus className="h-4 w-4" />
                          <p className="text-xs font-medium tracking-tight">{formatDateAsLocale(usage.dataInicio) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <div />
          )}
        </div>
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-xs font-medium text-gray-500">{formatDateAsLocale(property.dataInsercao, true) || 'N/A'}</p>
          </div>
          <Button variant={'ghost'} className="flex items-center gap-1 px-2 py-1" size={'fit'} onClick={() => openModal(property._id)}>
            <Pencil size={16} />
            <p className="text-sm font-semibold text-primary/80">EDITAR</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
