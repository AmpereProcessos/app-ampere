import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Session } from 'next-auth'
import { useQueryClient } from 'react-query'

import { VscChromeClose } from 'react-icons/vsc'

import SelectInput from '../../inputs/Select'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import DateInput from '../../inputs/Date'
import CheckboxInput from '@/components/inputs/Checkbox'
import { paymentMethods, revenueSources } from '@/utils/select-options'

import ProjectVinculationMenu from '../despesas/ProjectVinculationMenu'
import Fractionnements from './Fractionnements'

import { useRevenueById } from '@/utils/methods/query/revenues'
import { useMutationWithFeedback } from '@/utils/methods/mutation/general-hook'
import { editRevenue } from '@/utils/methods/mutation/revenues'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TRevenue, TRevenueDTO } from '@/utils/schemas/revenues'
import { formatDate } from '../../../utils/constants'
import { BsCode } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'

function getMissingPercentage({ fractionnement }: { fractionnement: TRevenueDTO['fracionamento'] }) {
  const currentTotal = fractionnement.reduce((acc, current) => current.porcentagem + acc, 0)
  return 100 - currentTotal
}
type EditRevenueProps = {
  revenueId: string
  session: Session
  closeModal: () => void
}
function EditRevenue({ revenueId, session, closeModal }: EditRevenueProps) {
  const queryClient = useQueryClient()
  const { data: revenue } = useRevenueById({ id: revenueId })
  const [infoHolder, setInfoHolder] = useState<TRevenue>({
    nome: '',
    tipo: '',
    autor: {
      id: session.user.id,
      nome: session.user.name,
      avatar_url: session.user.image,
    },
    projeto: {
      id: null,
      nome: null,
      identificador: null,
    },
    total: 0,
    metodo: '',
    efetivacao: {
      efetivado: false,
      data: null,
    },
    fracionamento: [],
    dataInsercao: new Date().toISOString(),
  })

  function handleLink(info: { id: string | null; nome: string | null; identificador: string | number | null }) {
    console.log(info)
    const { id, nome, identificador } = info
    const project = {
      id: id,
      nome: nome,
      identificador: identificador,
    }
    setInfoHolder((prev) => ({ ...prev, projeto: project }))

    return toast.success('Projeto vinculado com sucesso!')
  }
  function handleUnlink() {
    setInfoHolder((prev) => ({
      ...prev,
      projeto: {
        id: null,
        nome: null,
        identificador: null,
      },
    }))
  }

  const { mutate: handleEditRevenue, isLoading } = useMutationWithFeedback({
    mutationKey: ['edit-revenue', revenueId],
    mutationFn: editRevenue,
    queryClient: queryClient,
    affectedQueryKey: ['revenues'],
    callbackFn: () => console.log(),
  })
  useEffect(() => {
    if (revenue) setInfoHolder(revenue)
  }, [revenue])
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[60%]">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">ATUALIZAR RECEITA</h3>
            <button
              onClick={() => closeModal()}
              type="button"
              className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
            >
              <VscChromeClose style={{ color: 'red' }} />
            </button>
          </div>
          <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <ProjectVinculationMenu handleLink={handleLink} handleUnlink={handleUnlink} />
            {infoHolder.projeto.id ? (
              <div className="flex w-[90%] flex-col items-center justify-center gap-2 self-center rounded border border-gray-500 p-3 md:flex-row md:gap-4 lg:w-1/2">
                <div className="flex items-center gap-2">
                  <BsCode size={'20px'} color="rgb(31,41,55)" />
                  <p className="cursor-pointer font-raleway text-sm font-medium">#{infoHolder.projeto.identificador || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser size={'20px'} color="rgb(31,41,55)" />
                  <p className="font-raleway text-sm font-medium">{infoHolder.projeto.nome || 'N/A'}</p>
                </div>
              </div>
            ) : null}
            <div className="my-2 flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <TextInput
                  label="NOME DA RECEITA"
                  placeholder="Preencha o nome da receita..."
                  value={infoHolder.nome}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, nome: value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="TIPO"
                  options={revenueSources}
                  selectedItemLabel="NÃO DEFINIDO"
                  value={infoHolder.tipo}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, tipo: value }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, tipo: revenueSources[0].value }))}
                  width="100%"
                />
              </div>
            </div>
            <div className="my-2 flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="MÉTODO DE PAGAMENTO"
                  options={paymentMethods}
                  selectedItemLabel="NÃO DEFINIDO"
                  value={infoHolder.metodo}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, metodo: value }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, metodo: paymentMethods[0].value }))}
                  width="100%"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <NumberInput
                  label="VALOR"
                  placeholder="Preencha aqui o valor da receita..."
                  value={infoHolder.total}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
                  width="100%"
                />
              </div>
            </div>
            <h1 className="font-Inter w-fit self-center rounded-md bg-gray-300 p-2 text-xs font-medium leading-none tracking-tight text-gray-700">
              OBS: O parâmetro de efetivação se refere a data em que a receita entra no regime de competência.
            </h1>
            <div className="my-2 flex w-full flex-col items-center justify-center gap-2">
              <div className="flex w-full items-center justify-center lg:w-1/2">
                <CheckboxInput
                  checked={!!infoHolder.efetivacao.efetivado}
                  labelFalse={'EFETIVADO'}
                  labelTrue={'EFETIVADO'}
                  justify="justify-center"
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      efetivacao: {
                        ...prev.efetivacao,
                        efetivado: value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex w-full items-center justify-center lg:w-1/2">
                <DateInput
                  label={infoHolder.efetivacao.efetivado ? 'DATA DA EFETIVAÇÃO' : 'PREVISÃO DE EFETIVAÇÃO'}
                  labelClassName="text-center text-gray-500 font-normal font-raleway text-sm"
                  value={infoHolder.efetivacao.data ? formatDate(infoHolder.efetivacao.data) : undefined}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      efetivacao: {
                        ...prev.efetivacao,
                        data: formatDateInputChange(value),
                      },
                    }))
                  }
                />
              </div>
            </div>
            <Fractionnements
              infoHolder={infoHolder}
              setInfoHolder={setInfoHolder}
              missingPercentage={getMissingPercentage({ fractionnement: infoHolder.fracionamento })}
            />
          </div>
          <div className="mt-2 flex w-full items-center justify-end">
            <button
              disabled={isLoading}
              // @ts-ignore
              onClick={() => handleEditRevenue({ id: revenueId, changes: infoHolder })}
              className="w-fit rounded border border-blue-500 py-1 px-4 text-sm font-medium text-blue-500 disabled:border-gray-500 disabled:text-gray-500 hover:bg-blue-500 hover:text-white"
            >
              ATUALIZAR RECEITA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditRevenue
