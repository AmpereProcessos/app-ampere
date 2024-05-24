import TagTipoDeServico from '@/components/TagTipoDeServico'
import { TProjectDTODBSimplified } from '@/utils/schemas/projects'
import React from 'react'
import { FaCity, FaPhone, FaSignature, FaTag } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

type ProjectDBCardProps = {
  project: TProjectDTODBSimplified
  handleClick: (id: string) => void
}
function ProjectDBCard({ project, handleClick }: ProjectDBCardProps) {
  return (
    <div className="flex w-full flex-col border md:w-[350px] lg:w-[500px]">
      <TagTipoDeServico tipoDeServico={project.tipoDeServico} />
      <div className="flex w-full flex-col gap-4 p-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <h1
              onClick={() => handleClick(project._id)}
              className="cursor-pointer text-sm font-black leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500"
            >
              {project.nomeDoContrato}
            </h1>
          </div>
          <h1 className="rounded-full bg-black px-2 py-1 text-[0.55rem] font-bold text-white lg:text-xs">{project.qtde}</h1>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaCity />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
              {project.cidade} {project.uf ? `(${project.uf})` : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">{project.telefone || 'NÃO DEFINIDO'}</p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaTag />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
              {project.vendedor?.nome || 'NÃO DEFINIDO'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaSignature />
            <p className="text-[0.65rem] font-medium leading-none tracking-tight text-gray-500 lg:text-xs">
              {project.contrato?.status || 'NÃO DEFINIDO'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDBCard
