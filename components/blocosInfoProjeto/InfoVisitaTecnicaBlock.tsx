import React from 'react'

import { IoMdAdd } from 'react-icons/io'
import LoadingPage from '../utils/LoadingPage'
import ErrorComponent from '../utils/ErrorComponent'
import Avatar from '../utils/Avatar'
import { useSession } from 'next-auth/react'
import { TbRulerMeasure } from 'react-icons/tb'
import { MdTopic } from 'react-icons/md'
import { formatDateAsLocale } from '../../utils/methods/formatting'
import { BsCalendarCheckFill, BsCalendarFill } from 'react-icons/bs'
import { TProjectDTO } from '@/utils/schemas/projects'
import { Session } from 'next-auth'
import { useTechnicalAnalysisById } from '@/utils/methods/query/technical-analysis'
import TextInput from '../inputs/Text'
import TechnicalAnalysisFiles from '../identificador/analisesTecnicas/TechnicalAnalysisFiles'
function getViewPermissions({ routes }: { routes?: string[] }) {
  if (!routes) {
    return {
      suprimentos: false,
      projetos: false,
      obras: false,
    }
  }
  const permission = {
    suprimentos: routes.includes('Suprimentos'),
    projetos: routes.includes('Projetos'),
    obras: routes.includes('Obras'),
  }

  return permission
}

type InfoVisitaTecnicaBlockProps = {
  editor: boolean
  infoHolder: TProjectDTO
  setInfo: React.Dispatch<React.SetStateAction<TProjectDTO>>
  changes: { [key: string]: any }
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
  analysisId: string
  session: Session
}
function InfoVisitaTecnicaBlock({ editor, infoHolder, setInfo, changes, setChanges, analysisId, session }: InfoVisitaTecnicaBlockProps) {
  const { data: analysis, isLoading, isError, isSuccess } = useTechnicalAnalysisById({ id: analysisId })
  const viewPermissions = getViewPermissions({ routes: session?.user?.permissoes.rotas })
  // Return for technical analysis previous to system
  if (!analysisId)
    return (
      <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
        <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
          INFORMAÇÕES SOBRE A VISITA TÉCNICA
        </span>
        <div className="flex flex-wrap justify-around gap-2">
          <div className="flex w-[350px] items-center justify-center">
            <input
              disabled={!editor}
              checked={infoHolder.visitaTecnica?.status === 'REALIZADA' ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'visitaTecnica.status': e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                })
                setInfo({
                  ...infoHolder,
                  visitaTecnica: {
                    ...infoHolder.visitaTecnica,
                    status: e.target.checked ? 'REALIZADA' : 'PENDÊNCIA',
                  },
                })
              }}
              type="checkbox"
              name="visitaTecnica"
              id="visitaTecnica"
            />
            <label className="ml-2" htmlFor="visitaTecnica">
              REALIZADA ?
            </label>
          </div>
          <TextInput
            label={'TÉCNICO RESPONSÁVEL'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tecnico ? infoHolder.visitaTecnica?.tecnico : ''}
            placeholder="Preencha o nome do técnico responsável."
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tecnico': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tecnico: value,
                },
              })
            }}
          />
          <TextInput
            label={'Tipo da telha'}
            editable={editor}
            value={infoHolder.visitaTecnica?.tipoDaTelha ? infoHolder.visitaTecnica?.tipoDaTelha : ''}
            placeholder="Preencha o tipo da telha."
            handleChange={(value) => {
              setChanges({
                ...changes,
                'visitaTecnica.tipoDaTelha': value,
              })
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  tipoDaTelha: value,
                },
              })
            }}
          />
        </div>
      </div>
    )
  else
    return (
      <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
        <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">
          INFORMAÇÕES SOBRE A ANÁLISE TÉCNICA
        </span>
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar informações da análise técnica.'} /> : null}
        {isSuccess && analysis ? (
          <div className="flex w-full flex-col gap-2 px-4">
            <h1 className="self-center rounded border border-[#15599a] p-1 font-bold text-[#15599a]">{analysis.status}</h1>
            <div className="flex w-full items-center justify-center gap-2">
              <h1 className="font-raleway text-xs font-bold text-gray-500">ANALISTA</h1>
              <Avatar url={analysis.analista?.avatar_url} fallback={'A'} height={30} width={30} />
              <p className="text-sm font-medium text-gray-500">{analysis.analista?.apelido || 'NÃO DEFINIDO'}</p>
            </div>
            <div className="flex w-full flex-wrap justify-around">
              <div className="flex flex-col rounded-md border border-gray-500 p-3">
                <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DE TELHA</p>
                <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoTelha}</h1>
              </div>
              <div className="flex flex-col rounded-md border border-gray-500 p-3">
                <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">TIPO DA ESTRUTURA</p>
                <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.tipoEstrutura}</h1>
              </div>
              <div className="flex flex-col rounded-md border border-gray-500 p-3">
                <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">MATERIAL DA ESTRUTURA</p>
                <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.materialEstrutura}</h1>
              </div>
              <div className="flex flex-col rounded-md border border-gray-500 p-3">
                <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">ORIENTAÇÃO DA ESTRUTURA</p>
                <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.orientacao || '-'}</h1>
              </div>
              <div className="flex flex-col rounded-md border border-gray-500 p-3">
                <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">CONCESSIONÁRIA</p>
                <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.detalhes.concessionaria}</h1>
              </div>
            </div>
            {viewPermissions.suprimentos ? (
              <div className="flex w-full flex-col gap-1">
                <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">SUPRIMENTOS</h1>
                <div className="mt-2 flex flex-col gap-1">
                  <h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">OBSERVAÇÕES P/ SUPRIMENTOS</h1>
                  <div className="overscroll-y flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 bg-gray-100 p-3 text-center text-sm text-gray-500 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {analysis.suprimentos?.observacoes}
                  </div>
                </div>
                {analysis.suprimentos?.itens?.map((item, index) => (
                  <div key={index} className="flex w-full items-center justify-between">
                    <div className="flex flex-col">
                      <h1 className="text-sm font-medium text-gray-500">
                        <strong>{item.qtde}</strong> x {item.descricao} <strong className="text-[#fead41]">({item.tipo})</strong>
                      </h1>
                      <div className="flex items-center gap-1">
                        <TbRulerMeasure />
                        <p className="text-xs italic text-gray-500">{item.grandeza}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setChanges({
                            ...changes,
                            'compra.kitInfo': infoHolder.compra?.kitInfo
                              ? infoHolder.compra?.kitInfo + '\n' + `${item.qtde}-${item.descricao} ${item.tipo}`
                              : `${item.qtde}-${item.descricao} ${item.tipo}`,
                          })
                          setInfo({
                            ...infoHolder,
                            compra: {
                              ...infoHolder.compra,
                              kitInfo: infoHolder.compra?.kitInfo
                                ? infoHolder.compra?.kitInfo + '\n' + `${item.qtde}-${item.descricao} ${item.tipo}`
                                : `${item.qtde}-${item.descricao} ${item.tipo}`,
                            },
                          })
                        }}
                        className="flex items-center gap-1 rounded border border-[#fead61] p-1 text-xs font-bold text-[#fead61] hover:bg-[#fead61] hover:text-black"
                      >
                        <IoMdAdd />
                        <p>KIT</p>
                      </button>
                      <button
                        onClick={() => {
                          setChanges({
                            ...changes,
                            'material.materialFaltante': infoHolder.material?.materialFaltante
                              ? infoHolder.material?.materialFaltante + '\n' + `${item.qtde}-${item.descricao} ${item.tipo}`
                              : `${item.qtde}-${item.descricao} ${item.tipo}`,
                          })
                          setInfo({
                            ...infoHolder,
                            material: {
                              ...infoHolder.material,
                              materialFaltante: infoHolder.material?.materialFaltante
                                ? infoHolder.material?.materialFaltante + '\n' + `${item.qtde}-${item.descricao} ${item.tipo}`
                                : `${item.qtde}-${item.descricao} ${item.tipo}`,
                            },
                          })
                        }}
                        className="flex items-center gap-1 rounded border border-[#15599a] p-1 text-xs font-bold text-[#15599a] hover:bg-[#15599a] hover:text-white"
                      >
                        <IoMdAdd />
                        <p>FALTANTE</p>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {viewPermissions.projetos ? (
              <div className="flex w-full flex-col gap-1">
                <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">PROJETOS</h1>
                <div className="mt-2 flex flex-col gap-1">
                  <h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">OBSERVAÇÕES</h1>
                  <div className="overscroll-y flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 bg-gray-100 p-3 text-center text-sm text-gray-500 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {analysis.anotacoes || 'SEM OBSERVAÇÕES PREENCHIDAS'}
                  </div>
                </div>
                <h1 className="mt-2 text-sm font-medium leading-none tracking-tight text-gray-500">PENDÊNCIAS</h1>
                {analysis.pendencias && analysis.pendencias.length > 0 ? (
                  analysis.pendencias.map((pendency, index) => (
                    <div key={index} className="mt-2 flex w-full flex-col rounded-md border border-gray-300 p-3 shadow-sm">
                      <h1 className="w-full text-start font-bold leading-none tracking-tight ">{pendency.categoria}</h1>
                      <div className="mt-1 flex w-full items-center justify-start gap-2">
                        <Avatar fallback={'R'} url={null} height={20} width={20} />
                        <p className="text-xs font-medium text-gray-500">{pendency.responsavel.nome}</p>
                      </div>
                      <h1 className="my-2 rounded-md bg-gray-100 p-2 text-center text-sm text-gray-500">{pendency.descricao}</h1>
                      <div className="flex w-full items-center justify-start">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-2 text-gray-500`}>
                            <BsCalendarFill />
                            <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataInsercao)}</p>
                          </div>
                          {pendency.dataFinalizacao ? (
                            <div className={`flex items-center gap-2 text-gray-500`}>
                              <BsCalendarCheckFill color="rgb(34,197,94)" />
                              <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataFinalizacao, true)}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="w-full py-2 text-center text-xs font-medium italic text-gray-500">Nenhuma pendência cadastrada.</p>
                )}
                <div className="mt-2 flex flex-col gap-1">
                  <h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">DESCRITIVO</h1>
                  {analysis.descritivo?.length ? (
                    analysis.descritivo.map((item, index) => (
                      <div key={index} className="flex w-full flex-col">
                        <div className="flex items-center gap-2">
                          <MdTopic />
                          <h1 className="text-sm leading-none tracking-tight">{item.topico}</h1>
                        </div>
                        <p className="w-full text-center text-sm text-gray-500">{item.descricao}</p>
                      </div>
                    ))
                  ) : (
                    <p className="w-full py-2 text-center text-xs font-medium italic text-gray-500">Sem descritivo.</p>
                  )}
                </div>
              </div>
            ) : null}
            {viewPermissions.obras ? (
              <div className="flex w-full flex-col gap-1">
                <h1 className="w-full rounded-sm bg-[#fead41] p-1 text-center font-bold text-white">EXECUÇÃO</h1>
                <div className="mt-2 flex flex-col gap-1">
                  <h1 className="text-sm font-medium leading-none tracking-tight text-gray-500">OBSERVAÇÕES P/ EXECUÇÃO</h1>
                  <div className="overscroll-y flex h-[50px] max-h-[50px] w-full items-center justify-center overflow-y-auto rounded-md border border-cyan-500 bg-gray-100 p-3 text-center text-sm text-gray-500 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {analysis.execucao?.observacoes}
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-wrap justify-around">
                  <div className="flex flex-col rounded-md border border-gray-500 p-3">
                    <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE INSTALAÇÃO DO INVERSOR</p>
                    <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.inversor || '-'}</h1>
                  </div>
                  <div className="flex flex-col rounded-md border border-gray-500 p-3">
                    <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE INSTALAÇÃO DOS MÓDULOS</p>
                    <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.modulos || '-'}</h1>
                  </div>
                  <div className="flex flex-col rounded-md border border-gray-500 p-3">
                    <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">LOCAL DE ATERRAMENTO</p>
                    <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.locais.aterramento || '-'}</h1>
                  </div>
                  <div className="flex flex-col rounded-md border border-gray-500 p-3">
                    <p className="text-[0.6rem] font-medium uppercase leading-none tracking-tight text-gray-500">POSSUI ESPAÇO NO QGBT</p>
                    <h1 className="text-center text-xs font-medium uppercase text-black">{analysis.execucao.espacoQGBT ? 'SIM' : 'NÃO'}</h1>
                  </div>
                </div>
              </div>
            ) : null}
            <TechnicalAnalysisFiles analysisId={analysisId} />
          </div>
        ) : null}
      </div>
    )
}

export default InfoVisitaTecnicaBlock
