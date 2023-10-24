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
      router.push('/auth/authHome')
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
      const userRoutes = session.user.accessibleRoutes
      if (!userRoutes.includes('Projetos')) return router.push('/')
    }
  }, [session])
  if (status == 'loading') return <LoadingPage />
  if (status == 'authenticated') {
    return (
      <div className="p-6 grow bg-[#fff] flex flex-col">
        <div className="flex flex-col gap-2 items-center w-full border-b border-gray-200 pb-2">
          <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
            <p className="font-black uppercase  text-2xl text-[#15599a]">ANÁLISES TÉCNICAS</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-green-500 rounded" />
              <p className="text-sm md:text-base">CONCLUIDO</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-yellow-500 rounded" />
              <p className="text-sm md:text-base">EM ANÁLISE TÉCNICA</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-cyan-500 rounded" />
              <p className="text-sm md:text-base">PENDÊNCIA COMERCIAL</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] bg-indigo-500 rounded" />
              <p className="text-sm md:text-base">VISITA IN LOCO</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-end justify-center gap-2 flex-wrap w-full">
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
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2">
            <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-fit">
              <div className="flex items-center gap-x-2 justify-center">
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
        <div className="flex flex-wrap justify-around gap-3 mt-4">
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
