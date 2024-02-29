import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import AnalysisCard from '../../components/identificador/analisesTecnicas/AnalysisCard'
import ModalVisitaTecnica from '../../components/ModalVisitaTecnica'
import ModalAnalysis from '../../components/identificador/analisesTecnicas/ModalAnalysis'
import LoadingPage from '../../components/utils/LoadingPage'
import ErrorComponent from '../../components/utils/ErrorComponent'
import SelectInputWithImages from '../../components/inputs/SelectWithImages'

import TextInput from '../../components/inputs/Text'
import MultipleSelectInput from '../../components/inputs/MultipleSelect'
import DateInput from '../../components/inputs/Date'
import SelectInput from '../../components/inputs/Select'

import { formatDate } from '../../utils/constants'
import { engineeringAnalysts, technicalAnalysisStatus } from '../../utils/select-options'
import { formatDateInputChange } from '../../utils/methods/shared'
import { useTechnicalAnalysis } from '../../utils/methods/query/techAnalysis'
import { formatNameAsInitials } from '../../utils/methods/formatting'

function VisitaTecnica() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })
  const {
    data: analysis,
    isSuccess: analysisSuccess,
    isLoading: analysisLoading,
    isError: analysisError,
    filters,
    setFilters,
  } = useTechnicalAnalysis({ enabled: !!session?.user })

  const [modalAnalysis, setModalAnalysis] = useState({
    isOpen: false,
    analysisId: null,
  })

  function handleOpenModal(id) {
    setModalAnalysis({ analysisId: id, isOpen: true })
  }
  useEffect(() => {
    if (session) {
      const userRoutes = session?.user.permissoes.rotas
      if (!userRoutes.includes('Projetos')) return router.push('/')
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="flex grow flex-col bg-[#fff] p-6">
        <div className="flex w-full flex-col items-center gap-2 border-b border-gray-200 pb-2">
          <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
            <p className="text-2xl font-black  uppercase text-[#15599a]">ANÁLISES TÉCNICAS</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[10px] rounded bg-green-500" />
              <p className="text-sm md:text-base">CONCLUIDO</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[10px] rounded bg-yellow-500" />
              <p className="text-sm md:text-base">EM ANÁLISE TÉCNICA</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[10px] rounded bg-cyan-500" />
              <p className="text-sm md:text-base">PENDÊNCIA COMERCIAL</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[10px] rounded bg-indigo-500" />
              <p className="text-sm md:text-base">VISITA IN LOCO</p>
            </div>
          </div>
          <div className="flex w-full flex-col flex-wrap items-end justify-center gap-2 lg:flex-row">
            <TextInput
              label={'NOME DO CONTRATO'}
              placeholder={'Digite aqui o nome do contrato...'}
              value={filters.search}
              handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            />
            <MultipleSelectInput
              label={'STATUS'}
              selectedItemLabel={'NÃO DEFINIDO'}
              selected={filters.status}
              options={technicalAnalysisStatus}
              handleChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              onReset={() => setFilters((prev) => ({ ...prev, status: [] }))}
            />
            <SelectInputWithImages
              label="ANALISTA"
              labelClassName="font-bold text-gray-800 text-xs"
              editable={true}
              options={
                engineeringAnalysts.map((resp) => ({
                  id: resp.id,
                  label: resp.apelido,
                  value: resp.nome,
                  url: resp.avatar_url,
                  fallback: formatNameAsInitials(resp.nome),
                })) || []
              }
              value={filters.analyst}
              handleChange={(value) => {
                setFilters((prev) => ({ ...prev, analyst: value }))
              }}
              onReset={() => setFilters((prev) => ({ ...prev, analyst: null }))}
              selectedItemLabel="NÃO DEFINIDO"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row">
            <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
              <div className="flex items-center justify-center gap-x-2">
                <div className="w-full lg:w-[250px]">
                  <DateInput
                    width={'100%'}
                    label={'DEPOIS DE'}
                    value={filters.date.after ? formatDate(filters.date.after) : undefined}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, after: formatDateInputChange(value) } }))}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <DateInput
                    width={'100%'}
                    label={'ANTES DE'}
                    value={filters.date.before ? formatDate(filters.date.before) : undefined}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, before: formatDateInputChange(value) } }))}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[250px]">
                <SelectInput
                  width={'100%'}
                  label={'CAMPO DE FILTRO'}
                  value={filters.date.field}
                  options={[
                    {
                      id: 1,
                      label: 'DATA DE CONCLUSÃO',
                      value: 'dataEfetivacao',
                    },
                    {
                      id: 2,
                      label: 'DATA DE ABERTURA',
                      value: 'dataInsercao',
                    },
                  ]}
                  selectedItemLabel={'SEM FILTRO'}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, date: { ...prev.date, field: value } }))}
                  onReset={() => setFilters((prev) => ({ ...prev, date: { ...prev.date, field: null } }))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          {analysisLoading ? <LoadingPage /> : null}
          {analysisError ? <ErrorComponent msg={'Erro ao buscar informações da análise técnica.'} /> : null}
          {analysisSuccess && analysis
            ? analysis.map((form) => <AnalysisCard key={form._id} analysis={form} handleOpenModal={handleOpenModal} />)
            : null}
          {modalAnalysis.isOpen && modalAnalysis.analysisId ? (
            <ModalAnalysis
              analysisId={modalAnalysis.analysisId}
              modalIsOpen={modalAnalysis.isOpen}
              closeModal={() => setModalAnalysis({ isOpen: false, analysisId: null })}
            />
          ) : null}
        </div>
      </div>
    )
  }
}

export default VisitaTecnica
