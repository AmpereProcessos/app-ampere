import { useState } from 'react'

import React from 'react'
import { FaCity, FaSolarPanel } from 'react-icons/fa'
import { TbWaveSine } from 'react-icons/tb'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { BsCheck2All } from 'react-icons/bs'
import { BiCheckDouble } from 'react-icons/bi'
import ErrorComponent from '@/components/utils/ErrorComponent'
import TextInput from '@/components/inputs/Text'
import LoadingComponent from '@/components/utils/LoadingComponent'
type OperationProjectsBlockProps = {
  handleVinculation: (info: any) => void
  handleUnvinculation: () => void
}
function OperationProjectsBlock({ handleVinculation, handleUnvinculation }: OperationProjectsBlockProps) {
  const [selectedProject, setSelectProject] = useState<any | null>(null)
  const { data: operationProjects, isLoading, isSuccess, isError, filters, setFilters } = useOperationProjects()
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="rounded bg-black py-1 text-center text-lg font-bold text-white uppercase">PROJETOS EXISTENTES</span>
      {isError ? <ErrorComponent msg="Erro ao buscar projetos existentes..." /> : null}
      {isLoading ? <LoadingComponent /> : null}
      {isSuccess ? (
        <div className="fle w-full grow flex-col gap-2">
          {!selectedProject ? (
            <TextInput
              label="NOME DO CONTRATO"
              placeholder="Pesquise o projeto pelo nome do contrato"
              value={filters.search}
              handleChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
              width="100%"
            />
          ) : null}

          <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex max-h-[500px] w-full flex-col gap-1 overflow-y-auto overscroll-y-auto">
            {operationProjects.length > 0 && !selectedProject
              ? operationProjects?.map((project: any, index: number) => (
                  <div key={project._id} className="border-primary/20 flex w-full flex-col rounded-md border p-3">
                    <h1 className="w-full leading-none font-bold tracking-tight">
                      <strong className="text-[#fead41]">({project.qtde})</strong> {project.nomeDoContrato}
                    </h1>
                    <p className="text-primary/60 mt-1 text-xs">{project.vendedor?.nome}</p>
                    <div className="mt-4 flex w-full items-end justify-between lg:items-center">
                      <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-2">
                          <FaCity style={{ fontSize: '15px', color: '#15599a' }} />
                          <p className="text-[0.55rem] font-medium lg:text-sm">{project.cidade}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaSolarPanel size={'15px'} color="rgb(31,41,55)" />
                          <p className="text-[0.55rem] font-medium lg:text-sm">
                            {project.sistema?.qtdeModulos}x {project.sistema?.potModulos}W
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <TbWaveSine size={'15px'} color="rgb(31,41,55)" />
                          <p className="text-[0.55rem] font-medium lg:text-sm">
                            ({project.sistema?.topologia}) {project.sistema?.inversor || 'SEM INFORMAÇÕES DO INVERSOR'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectProject(project)
                          handleVinculation(project)
                        }}
                        className="rounded border border-cyan-500 p-1 text-xs font-medium text-cyan-500 duration-300 ease-in-out hover:bg-cyan-500 hover:text-white"
                      >
                        VINCULAR
                      </button>
                    </div>
                  </div>
                ))
              : null}
            {selectedProject ? (
              <div className="border-primary/20 flex w-full flex-col rounded-md border p-3">
                <h1 className="w-full leading-none font-bold tracking-tight">
                  <strong className="text-[#fead41]">({selectedProject.qtde})</strong> {selectedProject.nomeDoContrato}
                </h1>
                <p className="text-primary/60 mt-1 text-xs">{selectedProject.vendedor?.nome}</p>
                <div className="mt-4 flex w-full items-end justify-between lg:items-center">
                  <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-2">
                      <FaCity style={{ fontSize: '15px', color: '#15599a' }} />
                      <p className="text-[0.55rem] font-medium lg:text-sm">{selectedProject.cidade}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSolarPanel size={'15px'} color="rgb(31,41,55)" />
                      <p className="text-[0.55rem] font-medium lg:text-sm">
                        {selectedProject.sistema?.qtdeModulos}x {selectedProject.sistema?.potModulos}W
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TbWaveSine size={'15px'} color="rgb(31,41,55)" />
                      <p className="text-[0.55rem] font-medium lg:text-sm">
                        ({selectedProject.sistema?.topologia}) {selectedProject.sistema?.inversor || 'SEM INFORMAÇÕES DO INVERSOR'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <BiCheckDouble color="rgb(34,197,94)" size={'20px'} />
                      <p className="text-primary/60 text-sm font-medium">Vinculado</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectProject(null)
                        handleUnvinculation()
                      }}
                      className="border-primary/60 text-primary/60 hover:bg-primary/60 flex items-center rounded border p-1 duration-300 ease-in-out hover:text-white"
                    >
                      <p className="text-xs font-medium">LIMPAR</p>
                      <MdOutlineCleaningServices />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OperationProjectsBlock
