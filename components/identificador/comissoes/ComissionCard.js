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
import { useQueryClient } from 'react-query'

function getBarColor(project) {
  const comissionPaid = project.comissoes.pagamentoRealizado
  const comissionsDefined = project.comissoes.efetivado
  if (comissionPaid) return 'bg-green-500'
  if (comissionsDefined) return 'bg-blue-500'
  return 'bg-red-500'
}
function ComissionCard({ project }) {
  const queryClient = useQueryClient()
  const [comissionHolder, setComissionHolder] = useState({
    seller: project.comissoes.vendedor || 0,
    insider: project.comissoes.insider || 0,
  })
  const { mutate: efectivateCommission, isLoading } = useMutationWithFeedback({
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
    <div className="flex gap-2 w-full shadow-sm border border-gray-300 rounded-md">
      <div className={`h-full w-[7px] ${getBarColor(project)} rounded-tl-md rounded-bl-md`}></div>
      <div className="flex flex-col w-full grow p-3 gap-2">
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col min-w-[350px]">
            <div className="flex items-center gap-1">
              <h1 className="text-[#fead41] font-black">{project.identificadorCRM}</h1>
              <h1 className="font-bold leading-none tracking-tight">{project.nome}</h1>
            </div>
            <div className="flex items-center gap-1">
              <BsCode />
              <p className="text-xxs text-gray-500 italic">{project.id}</p>
              <p className="text-xs text-gray-500">{project.tipoServico}</p>
            </div>
          </div>
          <div className="grow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserAlt />
              <div className="flex flex-col">
                <p className="text-gray-500 font-medium text-xs">VENDEDOR: {project.vendedor}</p>
                {project.insider ? <p className="text-gray-500 font-medium text-xs">INSIDER: {project.insider}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BsCalendarFill />
              <div className="flex flex-col">
                <p className="text-gray-500 font-medium text-xs">ASSINATURA: {formatDateAsLocale(project.dataAssinatura)}</p>

                <p className="text-gray-500 font-medium text-xs">PAGAMENTO: {formatDateAsLocale(project.dataRecebimentoParcial)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ImPower />
              <p className="text-gray-500 font-medium text-xs">{formatDecimalPlaces(project.potenciaPico)}W</p>
            </div>
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="text-gray-500 font-medium text-xs">{formatToMoney(project.valorProjeto || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="text-gray-500 font-medium text-xs">{formatToMoney(project.valorPadrao || 0)}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="text-gray-500 font-medium text-xs">{formatToMoney(project.valorContrato || 0)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-2">
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
        <div className="flex items-center justify-around w-full gap-2">
          <div className="flex flex-col border border-gray-500 p-1 rounded-md w-1/4">
            <div className="flex items-center gap-2">
              <FaSolarPanel />
              <p className="font-medium text-gray-500 text-xs uppercase">COMISSÃO PELO PROJETO UFV</p>
            </div>
            <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
              {formatToMoney(((project.valorProjeto || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
          <div className="flex flex-col border border-gray-500 p-1 rounded-md w-1/4">
            <div className="flex items-center gap-2">
              <MdElectricMeter />
              <p className="font-medium text-gray-500 text-xs uppercase">COMISSÃO PELO PADRÃO</p>
            </div>
            <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
              {formatToMoney(((project.valorPadrao || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
          <div className="flex flex-col border border-gray-500 p-1 rounded-md w-1/4">
            <div className="flex items-center gap-2">
              <MdOutlineAttachMoney />
              <p className="font-medium text-gray-500 text-xs uppercase">COMISSÃO GERAL </p>
            </div>
            <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
              {formatToMoney(((project.valorContrato || 0) * (comissionHolder.seller + comissionHolder.insider)) / 100)}
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-end w-full">
          <button
            disabled={isLoading}
            onClick={() => efectivateCommission()}
            className="px-4 py-2 rounded border border-black font-medium enabled:hover:bg-black enabled:hover:text-white duration-300 ease-in-out disabled:bg-gray-500 disabled:text-white"
          >
            EFETIVAR COMISSÕES
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComissionCard
