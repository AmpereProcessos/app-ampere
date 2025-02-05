import CheckboxInput from '@/components/inputs/Checkbox'

import DateInput from '@/components/inputs/Date'
import { TEnergyPAExecution } from '@/pages/api/gestao-obras/padroes'
import { formatDate } from '@/utils/constants'
import { formatDateAsLocale, formatLocation } from '@/utils/methods/formatting'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { TLocation } from '@/utils/schemas/useful'
import React, { useState } from 'react'
import { BsCalendarCheck, BsCode, BsPatchCheck } from 'react-icons/bs'
import { FaCircle, FaPiggyBank } from 'react-icons/fa'
import { FaLocationDot, FaLocationPin } from 'react-icons/fa6'
import { MdAssistantPhoto, MdAttachMoney, MdElectricMeter, MdSettingsInputComponent } from 'react-icons/md'
import { useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/utils/methods/mutation/clients'
import toast from 'react-hot-toast'
import { formatDateInputChange } from '@/utils/methods/shared'
import CheckboxWithDate from '@/components/inputs/CheckboxWithDate'

type PAAdequationProjectCardProps = {
  project: TEnergyPAExecution
}
function PAAdequationProjectCard({ project }: PAAdequationProjectCardProps) {
  const queryClient = useQueryClient()
  const location: TLocation = {
    cep: project.cep?.toString(),
    uf: project.uf,
    cidade: project.cidade,
    bairro: project.bairro,
    endereco: project.logradouro,
    numeroOuIdentificador: project.numeroResidencia?.toString(),
  }

  async function updatePAAdequationExecutionDate(date: string | null) {
    try {
      await updateProject({ id: project._id, changes: { 'padrao.aumentoCarga.dataEfetivacao': date } })

      return 'Projeto atualizado com sucesso !'
    } catch (error) {
      throw error
    }
  }
  const { mutate: handleUpdate, isPending } = useMutationWithFeedback({
    mutationKey: ['update-project', project._id],
    mutationFn: updatePAAdequationExecutionDate,
    affectedQueryKey: ['pa-execution-projects'],
    queryClient: queryClient,
  })
  return (
    <div className="flex w-full flex-col gap-4 rounded border border-gray-300 bg-[#fff] p-3 font-[Inter]">
      <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-1">
          <h1 className="rounded-lg bg-[#15599a] px-2 py-1 text-xs font-bold text-white">{project.qtde}</h1>
          <h1 className="text-sm font-black leading-none tracking-tight">{project.nomeDoContrato}</h1>
        </div>
        <div className="flex items-center gap-1">
          <BsCode />
          <h1 className="text-xs tracking-tight text-gray-500">#{project._id}</h1>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <h1 className="text-[0.65rem] tracking-tight text-gray-500 lg:text-xs">LOCALIZAÇÃO</h1>
        </div>
        <div className="flex items-center gap-1">
          <FaLocationDot />
          <p className="text-sm font-[400] tracking-tight text-gray-800">{formatLocation({ location, includeUf: true, includeCity: true })}</p>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <h1 className="text-[0.65rem] tracking-tight text-gray-500 lg:text-xs">HOMOLOGAÇÃO</h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <FaCircle />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">{project.homologacao.status}</p>
          </div>
          <div className="flex items-center gap-1">
            <BsCalendarCheck />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">
              {project.homologacao.documentacao.dataConclusaoElaboracao
                ? `DOCUMENTAÇÃO CONCLUÍDA EM ${formatDateAsLocale(
                    project.homologacao.documentacao.dataConclusaoElaboracao || project.homologacao.documentacao.dataAssinatura
                  )}`
                : 'DOCUMENTAÇÃO NÃO CONCLUÍDA'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          {/* <MdElectricMeter /> */}
          <h1 className="text-[0.65rem] tracking-tight text-gray-500 lg:text-xs">PADRÃO</h1>
        </div>
        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <FaCircle color={!!project.padrao.aumentoCarga.dataEfetivacao ? 'rgb(34,197,94)' : 'black'} />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">
              {project.padrao.aumentoCarga.dataEfetivacao
                ? `ADEQUAÇÃO CONCLUÍDA EM ${formatDateAsLocale(project.padrao.aumentoCarga.dataEfetivacao)}`
                : 'ADEQUAÇÃO PENDENTE'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <FaPiggyBank color={!!project.compra.dataPagamento ? 'rgb(34,197,94)' : 'black'} />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">
              {project.compra.dataPagamento ? `PAGAMENTO EM: ${formatDateAsLocale(project.compra.dataPagamento)}` : 'PAGAMENTO PENDENTE'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MdAssistantPhoto />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">
              INSTALAÇÃO PELA(O) {project.padrao.respInstalacao || 'NÃO DEFINIDO'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MdSettingsInputComponent />
            <p className="text-xs font-medium tracking-tight text-gray-800 lg:text-sm">
              {project.visitaTecnica.amperagem || ''} {project.padrao.tipo || 'TIPO NÃO DEFINIDO'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <CheckboxWithDate
          labelFalse="EXECUTADO"
          labelTrue="EXECUTADO"
          editable={!isPending}
          showDate={!!project.padrao.aumentoCarga.dataEfetivacao}
          date={project.padrao.aumentoCarga.dataEfetivacao || project.obra.saida || null}
          handleChange={(value) => handleUpdate(formatDateInputChange(value))}
        />

        {/* <div className="w-fit">
               <DateInput
                 label="DATA DE EXECUÇÃO"
                 labelClassName="text-[0.6rem] tracking-tight"
                 editable={!isPending}
                 // inputClassName="w-full rounded-md border border-gray-200 p-2 text-[0.7rem] outline-none placeholder:italic"
                 value={formatDate(project.padrao.aumentoCarga.dataEfetivacao)}
                 handleChange={(value) => {
                   handleUpdate(formatDateInputChange(value))
                 }}
                 width="100%"
               />
              </div> */}
      </div>
    </div>
  )
}

export default PAAdequationProjectCard
