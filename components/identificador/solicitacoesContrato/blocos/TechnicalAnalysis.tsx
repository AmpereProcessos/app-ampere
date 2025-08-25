import Avatar from '@/components/utils/Avatar'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useTechnicalAnalysisById } from '@/utils/methods/query/technical-analysis'
import React, { useState } from 'react'
import TechnicalAnalysisFiles from '../../analisesTecnicas/TechnicalAnalysisFiles'
import { BsCalendarCheckFill, BsCalendarFill } from 'react-icons/bs'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { MdTopic } from 'react-icons/md'
import { TbRulerMeasure } from 'react-icons/tb'

type TechnicalAnalysisProps = {
  analysisId: string
}
function TechnicalAnalysis({ analysisId }: TechnicalAnalysisProps) {
  const { data: analysis, isLoading, isError, isSuccess } = useTechnicalAnalysisById({ id: analysisId })
  return (
    <div className="flex flex-col rounded-md border border-[#fead41] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tl-md rounded-tr-md bg-[#fead41] py-2 text-center font-bold text-white">
        REFERÊNCIA DE ANÁLISE TÉCNICA
      </span>
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={'Erro ao buscar informações da análise técnica.'} /> : null}
      {isSuccess && analysis ? (
        <div className="flex w-full flex-col gap-2 px-4">
          <h1 className="self-center rounded border border-[#15599a] p-1 font-bold text-[#15599a]">{analysis.status}</h1>
          <div className="flex w-full items-center justify-center gap-2">
            <h1 className="font-raleway text-primary/60 text-xs font-bold">ANALISTA</h1>
            <Avatar url={analysis.analista?.avatar_url} fallback={'A'} height={30} width={30} />
            <p className="text-primary/60 text-sm font-medium">{analysis.analista?.apelido || 'NÃO DEFINIDO'}</p>
          </div>
          <div className="flex w-full flex-wrap justify-around">
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DE TELHA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoTelha}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">TIPO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.tipoEstrutura}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">MATERIAL DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.materialEstrutura}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">ORIENTAÇÃO DA ESTRUTURA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.orientacao || '-'}</h1>
            </div>
            <div className="border-primary/60 flex flex-col rounded-md border p-3">
              <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">CONCESSIONÁRIA</p>
              <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.detalhes.concessionaria}</h1>
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">SUPRIMENTOS</h1>
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">OBSERVAÇÕES P/ SUPRIMENTOS</h1>
              <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 text-primary/60 bg-primary/20 flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 p-3 text-center text-sm">
                {analysis.suprimentos?.observacoes}
              </div>
            </div>
            {analysis.suprimentos?.itens?.map((item, index) => (
              <div key={index} className="flex w-full items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-primary/60 text-sm font-medium">
                    <strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
                  </h1>
                  <div className="flex items-center gap-1">
                    <TbRulerMeasure />
                    <p className="text-primary/60 text-xs italic">{item.grandeza}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-col gap-1">
            <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">PROJETOS</h1>
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">OBSERVAÇÕES</h1>
              <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 text-primary/60 bg-primary/20 flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 p-3 text-center text-sm">
                {analysis.anotacoes || 'SEM OBSERVAÇÕES PREENCHIDAS'}
              </div>
            </div>
            <h1 className="text-primary/60 mt-2 text-sm leading-none font-medium tracking-tight">PENDÊNCIAS</h1>
            {analysis.pendencias && analysis.pendencias.length > 0 ? (
              analysis.pendencias.map((pendency, index) => (
                <div key={index} className="border-primary/20 mt-2 flex w-full flex-col rounded-md border p-3 shadow-xs">
                  <h1 className="w-full text-start leading-none font-bold tracking-tight">{pendency.categoria}</h1>
                  <div className="mt-1 flex w-full items-center justify-start gap-2">
                    <Avatar fallback={'R'} url={null} height={20} width={20} />
                    <p className="text-primary/60 text-xs font-medium">{pendency.responsavel.nome}</p>
                  </div>
                  <h1 className="text-primary/60 bg-primary/20 my-2 rounded-md p-2 text-center text-sm">{pendency.descricao}</h1>
                  <div className="flex w-full items-center justify-start">
                    <div className="flex items-center gap-2">
                      <div className={`text-primary/60 flex items-center gap-2`}>
                        <BsCalendarFill />
                        <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataInsercao)}</p>
                      </div>
                      {pendency.dataFinalizacao ? (
                        <div className={`text-primary/60 flex items-center gap-2`}>
                          <BsCalendarCheckFill color="rgb(34,197,94)" />
                          <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataFinalizacao, true)}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-primary/60 w-full py-2 text-center text-xs font-medium italic">Nenhuma pendência cadastrada.</p>
            )}
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">DESCRITIVO</h1>
              {analysis.descritivo?.length ? (
                analysis.descritivo.map((item, index) => (
                  <div key={index} className="flex w-full flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <MdTopic />
                      <h1 className="text-sm leading-none tracking-tight">{item.topico}</h1>
                    </div>
                    <p className="text-primary/60 w-full text-center text-sm">{item.descricao}</p>
                  </div>
                ))
              ) : (
                <p className="text-primary/60 w-full py-2 text-center text-xs font-medium italic">Sem descritivo.</p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">EXECUÇÃO</h1>
            <div className="mt-2 flex flex-col gap-1">
              <h1 className="text-primary/60 text-sm leading-none font-medium tracking-tight">OBSERVAÇÕES P/ EXECUÇÃO</h1>
              <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 text-primary/60 bg-primary/20 flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 p-3 text-center text-sm">
                {analysis.execucao?.observacoes}
              </div>
            </div>
            <div className="mt-4 flex w-full flex-wrap justify-around">
              <div className="border-primary/60 flex flex-col rounded-md border p-3">
                <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE INSTALAÇÃO DO INVERSOR</p>
                <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.inversor || '-'}</h1>
              </div>
              <div className="border-primary/60 flex flex-col rounded-md border p-3">
                <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE INSTALAÇÃO DOS MÓDULOS</p>
                <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.modulos || '-'}</h1>
              </div>
              <div className="border-primary/60 flex flex-col rounded-md border p-3">
                <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">LOCAL DE ATERRAMENTO</p>
                <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.locais.aterramento || '-'}</h1>
              </div>
              <div className="border-primary/60 flex flex-col rounded-md border p-3">
                <p className="text-primary/60 text-[0.6rem] leading-none font-medium tracking-tight uppercase">POSSUI ESPAÇO NO QGBT</p>
                <h1 className="text-center text-xs font-medium text-black uppercase">{analysis.execucao.espacoQGBT ? 'SIM' : 'NÃO'}</h1>
              </div>
            </div>
          </div>

          <TechnicalAnalysisFiles analysisId={analysisId} />
        </div>
      ) : null}
    </div>
  )
}

export default TechnicalAnalysis
