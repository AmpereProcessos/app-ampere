import Avatar from '@/components/utils/Avatar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingComponent from '@/components/utils/LoadingComponent'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { getErrorMessage } from '@/utils/methods/handlers'
import { useOpportunityTechnicalAnalysis } from '@/utils/methods/query/technical-analysis'
import { TTechnicalAnalysis, TTechnicalAnalysisDTO } from '@/utils/schemas/technical-analysis'
import { Optional } from '@tanstack/react-query'

import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { BsCalendarCheck, BsCalendarPlus } from 'react-icons/bs'

type AnalysisVinculationMenuProps = {
  infoHolder: TTechnicalAnalysis
  setInfoHolder: React.Dispatch<React.SetStateAction<TTechnicalAnalysis>>
  closeMenu: () => void
}
function AnalysisVinculationMenu({ infoHolder, setInfoHolder, closeMenu }: AnalysisVinculationMenuProps) {
  const {
    data: opportunityAnalysis,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useOpportunityTechnicalAnalysis({ opportunityId: infoHolder.oportunidade.id || '', concludedOnly: false })
  function handleVinculation(analysis: TTechnicalAnalysisDTO) {
    const analysisId = analysis._id
    var info = { ...analysis } as Optional<TTechnicalAnalysisDTO, '_id'>
    delete info._id
    setInfoHolder((prev) => ({ ...info, idAnaliseReferencia: analysisId }))
  }
  return (
    <AnimatePresence>
      <motion.div variants={GeneralVisibleHiddenExitMotionVariants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col">
        <h1 className="w-full rounded-md bg-orange-700 p-1 text-center font-medium text-white">VINCULAÇÃO DE ANÁLISE EXISTENTE</h1>
        <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex max-h-[600px] min-h-[100px] w-full flex-col gap-1 overflow-y-auto overscroll-y-auto py-2">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess
            ? opportunityAnalysis?.map((analysis) => (
                <TechnicalAnalysisVinculationCard
                  key={analysis._id}
                  analysis={analysis}
                  handleClick={(analysis) => handleVinculation(analysis)}
                  selectedId={infoHolder.idAnaliseReferencia}
                />
              ))
            : null}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AnalysisVinculationMenu

type TechnicalAnalysisVinculationCardProps = {
  analysis: TTechnicalAnalysisDTO
  selectedId?: string | null
  handleClick: (info: TTechnicalAnalysisDTO) => void
}
function TechnicalAnalysisVinculationCard({ analysis, selectedId, handleClick }: TechnicalAnalysisVinculationCardProps) {
  return (
    <div className="border-primary/20 flex w-full items-center rounded-md border">
      <div className="flex grow flex-col p-3">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 className="font-Inter leading-none font-bold tracking-tight">{analysis.nome}</h1>
          {selectedId == analysis._id ? (
            <button className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">SELECIONADO</button>
          ) : (
            <button onClick={() => handleClick(analysis)} className="rounded-full bg-cyan-500 px-2 py-1 text-xs font-bold text-white">
              SELECIONAR ANÁLISE
            </button>
          )}
        </div>
        <div className="mt-1 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              url={analysis.requerente.avatar_url || undefined}
              fallback={formatNameAsInitials(analysis.requerente.nome || analysis.requerente.apelido)}
              height={25}
              width={25}
            />

            <p className="text-xs font-medium">{analysis.requerente.nome || analysis.requerente.apelido}</p>
            <div className={`flex items-center gap-2`}>
              <BsCalendarPlus />
              <p className="text-xs font-medium">{formatDateAsLocale(analysis.dataInsercao, true)}</p>
            </div>

            {analysis.dataEfetivacao ? (
              <div className={`flex items-center gap-2 text-green-500`}>
                <BsCalendarCheck />
                <p className="text-xs font-medium">{formatDateAsLocale(analysis.dataEfetivacao, true)}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
