import CheckboxInput from '@/components/inputs/Checkbox'
import MultipleSelectInput from '@/components/inputs/MultipleSelect'
import MultipleSelectInputVirtualized from '@/components/inputs/MultipleSelectInputVirtualized'
import SelectInput from '@/components/inputs/Select'
import TextInput from '@/components/inputs/Text'
import { GeneralVisibleHiddenExitMotionVariants } from '@/utils/constants'
import StatesAndCities from '@/utils/jsons/estados-cidades.json'
import { TUserDTOSimplified } from '@/utils/schemas/crm/user.schema'
import { TPersonalizedTechnicalAnalysisFilter } from '@/utils/schemas/technical-analysis'
import { TUserDTO } from '@/utils/schemas/users'
import { TechnicalAnalysisComplexity, TechnicalAnalysisSolicitationTypes, technicalAnalysisStatus } from '@/utils/select-options'
import { AnimatePresence, motion } from 'framer-motion'
import { Session } from 'next-auth'
import { useState } from 'react'
const AllCities = StatesAndCities.flatMap((s) => s.cidades).map((c, index) => ({ id: index + 1, label: c, value: c }))
const AllStates = StatesAndCities.map((e) => e.sigla).map((c, index) => ({ id: index + 1, label: c, value: c }))
type FilterMenuProps = {
  updateFilters: (filtersHolder: TPersonalizedTechnicalAnalysisFilter) => void
  selectedApplicants: string[] | null
  setApplicants: (authors: string[] | null) => void
  selectedAnalysts: string[] | null
  setAnalysts: (authors: string[] | null) => void
  applicantsOptions?: TUserDTO[]
  analystsOptions?: TUserDTOSimplified[]
  session: Session
  queryLoading: boolean
  resetSelectedPage: () => void
}
function FilterMenu({
  updateFilters,
  selectedApplicants,
  setApplicants,
  selectedAnalysts,
  setAnalysts,
  applicantsOptions,
  analystsOptions,
  session,
  queryLoading,
  resetSelectedPage,
}: FilterMenuProps) {
  const [filtersHolder, setFiltersHolder] = useState<TPersonalizedTechnicalAnalysisFilter>({
    name: '',
    status: [],
    complexity: null,
    city: [],
    state: [],
    type: [],
    pending: false,
  })
  return (
    <AnimatePresence>
      <motion.div
        key={'editor'}
        variants={GeneralVisibleHiddenExitMotionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="mt-2 flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-[#fff] p-2"
      >
        <h1 className="text-sm font-bold tracking-tight">FILTROS</h1>
        <div className="flex w-full flex-col flex-wrap items-center justify-start gap-2 lg:flex-row">
          <TextInput
            label="NOME DA ANÁLISE"
            placeholder="Filtre pelo nome da análise..."
            value={filtersHolder.name}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, name: value }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />

          <MultipleSelectInput
            label={'STATUS'}
            selectedItemLabel={'NÃO DEFINIDO'}
            selected={filtersHolder.status}
            options={technicalAnalysisStatus}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, status: value as string[] }))}
            onReset={() => setFiltersHolder((prev) => ({ ...prev, status: [] }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />

          <div className="w-full lg:w-[200px]">
            <MultipleSelectInputVirtualized
              label="CIDADE"
              selected={filtersHolder.city}
              options={AllCities}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  city: value as string[],
                }))
              }}
              onReset={() => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  city: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <MultipleSelectInputVirtualized
              label="ESTADO"
              selected={filtersHolder.state}
              options={AllStates}
              selectedItemLabel="NÃO DEFINIDO"
              handleChange={(value) => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  state: value as string[],
                }))
              }}
              onReset={() => {
                setFiltersHolder((prev) => ({
                  ...prev,
                  state: [],
                }))
              }}
              width="100%"
              labelClassName="text-xs font-medium tracking-tight text-black"
            />
          </div>
          <MultipleSelectInput
            label="TIPO DE SOLICITAÇÃO"
            selected={filtersHolder.type}
            options={TechnicalAnalysisSolicitationTypes}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, type: value as string[] }))}
            onReset={() => setFiltersHolder((prev) => ({ ...prev, type: [] }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />

          <SelectInput
            label={'COMPLEXIDADE'}
            selectedItemLabel={'NÃO DEFINIDO'}
            value={filtersHolder.complexity}
            options={TechnicalAnalysisComplexity}
            handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, complexity: value }))}
            onReset={() => setFiltersHolder((prev) => ({ ...prev, complexity: null }))}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />

          <MultipleSelectInput
            label="ANALISTA"
            selected={selectedAnalysts}
            options={analystsOptions?.map((a) => ({ id: a._id, label: a.nome, value: a._id, url: a.avatar_url || undefined })) || []}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setAnalysts(value as string[])}
            onReset={() => setAnalysts(null)}
            labelClassName="text-xs font-medium tracking-tight text-black"
          />

          {/* <MultipleSelectInput
                 label="REQUERENTE"
                 selected={selectedApplicants}
                 options={applicantSelectableOptions?.map((a) => ({ id: a._id, label: a.nome, value: a._id, url: a.avatar_url || undefined })) || []}
                 selectedItemLabel="NÃO DEFINIDO"
                 handleChange={(value) => setApplicants(value as string[])}
                 onReset={() => setApplicants(null)}
                 labelClassName="text-xs font-medium tracking-tight text-black"
                /> */}
        </div>
        <div className="flex w-full flex-col flex-wrap items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-fit">
              <CheckboxInput
                labelFalse="SOMENTE PENDENTES"
                labelTrue="SOMENTE PENDENTES"
                checked={filtersHolder.pending}
                handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, pending: value }))}
              />
            </div>
          </div>
          <button
            disabled={queryLoading}
            onClick={() => {
              resetSelectedPage()
              updateFilters(filtersHolder)
            }}
            className="h-9 whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow disabled:bg-gray-500 disabled:text-white enabled:hover:bg-blue-700 enabled:hover:text-white"
          >
            PESQUISAR
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FilterMenu
