import React, { useState } from 'react'

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle, IoMdDocument, IoMdPower } from 'react-icons/io'
import { FaSolarPanel, FaUserAlt } from 'react-icons/fa'
import { ImPower } from 'react-icons/im'
import { MdElectricMeter, MdOutlineAttachMoney, MdRoofing } from 'react-icons/md'
import { BsCalendarFill, BsCode, BsFillCalendarFill, BsHouse } from 'react-icons/bs'
import { formatDecimalPlaces, formatToMoney } from '../../../utils/constants'
import NumberInput from '../../inputs/Number'
import { formatDateAsLocale } from '../../../utils/methods/formatting'
import { updateProject } from '../../../utils/methods/mutation/clients'
import { useMutationWithFeedback } from '../../../utils/methods/mutation/general-hook'
import { useQueryClient } from '@tanstack/react-query'

function getBarColor(project) {
  const comissionPaid = project.comissoes.pagamentoRealizado
  const comissionsDefined = project.comissoes.efetivado
  if (comissionPaid) return 'bg-green-500'
  if (comissionsDefined) return 'bg-blue-500'
  return 'bg-red-500'
}
function ComissionCard({ project, userIsManager }) {
  const queryClient = useQueryClient()
  const [comissionHolder, setComissionHolder] = useState({
    seller: project.comissoes.vendedor || 0,
    insider: project.comissoes.insider || 0,
  })
  const { mutate: efectivateCommission, isPending } = useMutationWithFeedback({
    mutationKey: ['update-commission', project.id],
    mutationFn: handleCommissionEfectivation,
    affectedQueryKey: ['comissions'],
    queryClient: queryClient,
  })
  async function handleCommissionEfectivation() {
    const changes = {
      'comissoes.efetivado': true,
      'comissoes.porcentagemVendedor': comissionHolder.seller,
      'comissoes.porcentagemInsider': comissionHolder.insider,
    }
    try {
      await updateProject({ id: project.id, changes: changes })
      return 'Atualizações realizadas com sucesso.'
    } catch (error) {
      throw error
    }
  }
  return (
    <div className="flex w-full gap-2 rounded-md border border-gray-300 shadow-sm">
      <div className={`h-full w-[7px] ${getBarColor(project)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex w-full grow flex-col gap-2 p-3">
        <div className="flex w-full items-center gap-2">
          <div className="flex min-w-[350px] flex-col">
            <div className="flex items-center gap-1">
              <h1 className="font-black text-[#fead41]">{project.identificadorCRM}</h1>
              <h1 className="font-bold leading-none tracking-tight">{project.nome}</h1>
            </div>
            <div className="flex items-center gap-1">
              <BsCode />
              <p className="text-xxs italic text-gray-500">{project.id}</p>
              <p className="text-xs text-gray-500">{project.tipoServico}</p>
            </div>
          </div>
          <div className="flex grow items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserAlt />
              <div className="flex flex-col">
                <p className="text-xs font-medium text-gray-500">VENDEDOR: {project.vendedor}</p>
                {project.insider ? <p className="text-xs font-medium text-gray-500">INSIDER: {project.insider}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BsCalendarFill />
              <div className="flex flex-col">
                <p className="text-xs font-medium text-gray-500">ASSINATURA: {formatDateAsLocale(project.dataAssinatura)}</p>

                <p className="text-xs font-medium text-gray-500">PAGAMENTO: {formatDateAsLocale(project.dataRecebimentoParcial)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ImPower />
              <p className="text-xs font-medium text-gray-500">{formatDecimalPlaces(project.potenciaPico)}W</p>
            </div>
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="text-xs font-medium text-gray-500">{formatToMoney(project.valorProjeto || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="text-xs font-medium text-gray-500">{formatToMoney(project.valorPadrao || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="text-xs font-medium text-gray-500">{formatToMoney(project.valorContrato || 0)}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
          <div className="w-full lg:w-[250px]">
            <NumberInput
              label={'COMISSÃO DO VENDEDOR (%)'}
              labelClassName="font-bold text-xs text-[#0E21A0]"
              value={comissionHolder.seller}
              placeholder={'Preencha aqui a porcentagem da comissão do vendedor...'}
              handleChange={(value) => setComissionHolder((prev) => ({ ...prev, seller: value }))}
              width={'100%'}
            />
          </div>

          {!!project.insider ? (
            <div className="w-full lg:w-[250px]">
              <NumberInput
                label={'COMISSÃO DO INSIDER (%)'}
                labelClassName="font-bold text-xs text-[#0E21A0]"
                value={comissionHolder.insider}
                placeholder={'Preencha aqui a porcentagem da comissão do insider...'}
                handleChange={(value) => setComissionHolder((prev) => ({ ...prev, insider: value }))}
                width={'100%'}
              />
            </div>
          ) : null}
        </div>
        <div className="flex w-full items-center justify-around gap-2">
          <div className="flex w-1/4 flex-col rounded-md border border-gray-500 p-1">
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="text-xs font-medium uppercase text-gray-500">COMISSÃO PELO PROJETO UFV</p>
            </div>
            <h1 className="text-center text-xs font-medium uppercase text-gray-500">
              {formatToMoney(((project.valorProjeto || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
          <div className="flex w-1/4 flex-col rounded-md border border-gray-500 p-1">
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="text-xs font-medium uppercase text-gray-500">COMISSÃO PELO PADRÃO</p>
            </div>
            <h1 className="text-center text-xs font-medium uppercase text-gray-500">
              {formatToMoney(((project.valorPadrao || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
          <div className="flex w-1/4 flex-col rounded-md border border-gray-500 p-1">
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="text-xs font-medium uppercase text-gray-500">COMISSÃO GERAL </p>
            </div>
            <h1 className="text-center text-xs font-medium uppercase text-gray-500">
              {formatToMoney(((project.valorContrato || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
        </div>
        {userIsManager ? (
          <div className="flex w-full items-center justify-end">
            <button
              disabled={isPending}
              onClick={() => efectivateCommission()}
              className="rounded border border-black px-2 py-1 font-medium duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white enabled:hover:bg-black enabled:hover:text-white"
            >
              EFETIVAR COMISSÕES
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ComissionCard
