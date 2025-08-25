import { getServiceTypeTagColor } from '@/components/TagTipoDeServico'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { TProjectDTO } from '@/utils/schemas/projects'
import React from 'react'
import { BsBricks, BsCalendarCheck, BsSuitDiamondFill } from 'react-icons/bs'
import { FaCity, FaSolarPanel } from 'react-icons/fa'
import { MdOutlineRoofing } from 'react-icons/md'
import { TbTopologyFull } from 'react-icons/tb'

function getKitInfoAsList(str: string | null | undefined) {
  if (!str) return []
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]
    if (qty || desc)
      return {
        qtde: qty,
        descricao: desc,
      }
  })
  return formattedSpllited.filter((x) => !!x)
}
function getMissingMaterialAsList(str: string | null | undefined) {
  if (!str) return []
  const spllited = str.split('\n')
  const formattedSpllited = spllited.map((i) => {
    const arr = i.split('-')
    var qty = null
    var desc = null
    if (arr.length > 1) {
      qty = Number(arr[0].trim())
      desc = arr[1]
    } else desc = arr[0]
    if (qty || desc)
      return {
        qtde: qty,
        descricao: desc,
      }
  })
  return formattedSpllited.filter((x) => !!x)
}
function getObservationsAsList(str: string) {
  if (!str) return []
  const spllited = str.split('/')
  return spllited.filter((x) => !!x)
}
function getProjectTypeTag(serviceType: string) {
  return <h1 className={`rounded-full px-2 py-1 text-[0.65rem] font-medium lg:text-xs ${getServiceTypeTagColor(serviceType)}`}>{serviceType}</h1>
}

type SeparationProjectCardProps = {
  project: TProjectDTO
}
function SeparationProjectCard({ project }: SeparationProjectCardProps) {
  const purchaseMaterialList = getKitInfoAsList(project.compra?.kitInfo)
  const missingMaterialList = getMissingMaterialAsList(project.material?.materialFaltante)
  const executionObservations = getObservationsAsList(project.obra.observacoes || '')
  return (
    <div className="border-primary/20 flex w-full flex-col rounded-md border p-4">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="grow text-xs leading-none font-black tracking-tight lg:text-sm">{project.nomeDoContrato}</h1>
        {getProjectTypeTag(project.tipoDeServico)}
      </div>

      <div className="mt-2 flex w-full flex-wrap items-center justify-around gap-4">
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <FaCity />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {project.cidade} ({project.uf})
          </p>
        </div>
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <TbTopologyFull />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {project.sistema.topologia} ({project.sistema.inversor})
          </p>
        </div>
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <FaSolarPanel />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {project.sistema.qtdeModulos || 'N/A'} x {project.sistema.potModulos || 'N/A'}
          </p>
        </div>
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <MdOutlineRoofing />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">{project.estruturaPersonalizada.tipo}</p>
        </div>
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <BsBricks />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {project.visitaTecnica.tipoDaTelha || 'N/A'}
          </p>
        </div>
        <div className="border-primary/60 flex items-center gap-1 rounded-lg border p-2">
          <BsCalendarCheck />
          <p className="text-primary/60 text-[0.65rem] leading-none font-medium tracking-tight lg:text-xs">
            {formatDateAsLocale(project.compra.dataEntrega) || 'NÃO ENTREGUE'}
          </p>
        </div>
      </div>
      <div className="mt-2 flex h-full max-h-[300px] min-h-[150px] w-full flex-col rounded-lg border border-cyan-500 p-3">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-center font-sans font-bold text-[#353432]">OBSERVAÇÕES DE EXECUÇÃO</h1>
        </div>
        <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex w-full grow flex-col overflow-y-auto px-2">
          {executionObservations.length > 0 ? (
            executionObservations.map((observation, index) => (
              <div key={index} className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <BsSuitDiamondFill />
                  <p className="text-primary/60 text-xs tracking-tight">{observation}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex grow items-center justify-center">
              <p className="text-primary/60 text-center text-sm italic">Nenhum material adicionado a lista...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-start justify-around gap-2">
        <div className="flex h-full max-h-[300px] min-h-[150px] w-full flex-col rounded-lg border border-cyan-500 p-3 lg:w-1/2">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-center font-sans font-bold text-[#353432]">MATERIAL FALTANTE</h1>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex w-full grow flex-col overflow-y-auto px-2">
            {missingMaterialList.length > 0 ? (
              missingMaterialList.map((equip, index) => (
                <div key={index} className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BsSuitDiamondFill />
                    <p className="text-primary/60 text-xs tracking-tight">
                      {equip.qtde ? `${equip.qtde}x ` : ''}
                      {equip.descricao}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex grow items-center justify-center">
                <p className="text-primary/60 text-center text-sm italic">Nenhum material adicionado a lista...</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full max-h-[300px] min-h-[150px] w-full flex-col rounded-lg border border-cyan-500 p-3 lg:w-1/2">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-center font-sans font-bold text-[#353432]">MATERIAL DO KIT</h1>
          </div>
          <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex w-full grow flex-col overflow-y-auto px-2">
            {purchaseMaterialList.length > 0 ? (
              purchaseMaterialList.map((equip, index) => (
                <div key={index} className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BsSuitDiamondFill />
                    <p className="text-primary/60 text-xs tracking-tight">
                      {equip.qtde ? `${equip.qtde}x ` : ''}
                      {equip.descricao}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex grow items-center justify-center">
                <p className="text-primary/60 text-center text-sm italic">Nenhum material adicionado a lista...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeparationProjectCard
