import { useDebounce } from '@/lib/hooks/debounce'
import { useVinculationProjectsSearch } from '@/utils/methods/query/projects'
import { TProjectDTODBSimplified, TQueryVinculationProjectsFilter } from '@/utils/schemas/projects'
import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VscChromeClose } from 'react-icons/vsc'
import { Input } from '@/components/ui/input'
import LoadingComponent from '@/components/utils/LoadingComponent'
import ErrorComponent from '@/components/utils/ErrorComponent'
import { getErrorMessage } from '@/utils/methods/handlers'
import { FaLink, FaPhone, FaUser } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { formatLocation } from '@/utils/methods/formatting'
import { BsCalendarPlus } from 'react-icons/bs'

type ProjectVinculationMenuProps = {
  closeModal: () => void
  handleSelect: (projectSimplified: TProjectDTODBSimplified) => void
}
function ProjectVinculationMenu({ closeModal, handleSelect }: ProjectVinculationMenuProps) {
  const [queryParams, setQueryParams] = useState<TQueryVinculationProjectsFilter>({
    search: '',
  })
  const debouncedQueryParams = useDebounce(queryParams, 350)
  const { data: projects, isLoading, isFetching, isError, isSuccess, isStale, error } = useVinculationProjectsSearch(queryParams)
  return (
    <Dialog.Root open onOpenChange={closeModal}>
      <Dialog.Overlay className="fixed inset-0 z-[100] bg-primary/70 backdrop-blur-sm" />
      <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] h-[90%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-[10px] lg:h-[50%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col gap-2">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-sm font-bold lg:text-xl">VINCULAR PROJETO</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <Input
            value={queryParams.search}
            placeholder="Pesquisa aqui pelo nome ou código do projeto..."
            onChange={(e) => setQueryParams((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full"
          />

          {isLoading || isFetching ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess && !isFetching ? (
            <div className="flex h-full flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
                    <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold leading-none tracking-tight">{project.nomeDoContrato}</p>
                      </div>
                      <button
                        onClick={() => handleSelect(project)}
                        className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
                      >
                        <FaLink />
                        <h1>VINCULAR</h1>
                      </button>
                    </div>
                    <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
                      <div className="flex grow flex-wrap items-center justify-center gap-2 lg:justify-start">
                        <div className="flex items-center gap-1">
                          <FaUser width={10} height={10} />
                          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.nomeDoContrato}</h1>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaPhone width={10} height={10} />
                          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{project.telefone}</h1>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaLocationDot width={10} height={10} />
                          <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
                            {formatLocation({
                              location: {
                                uf: project!.uf || '',
                                cidade: project!.cidade || '',
                                cep: project!.cep?.toString() || '',
                                bairro: project!.bairro,
                                endereco: project!.logradouro,
                                numeroOuIdentificador: project!.numeroResidencia?.toString() || '',
                                complemento: null,
                                latitude: null,
                                longitude: null,
                              },
                              includeCity: true,
                              includeUf: true,
                            })}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Nenhum projeto encontrado.</div>
              )}
            </div>
          ) : null}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ProjectVinculationMenu
