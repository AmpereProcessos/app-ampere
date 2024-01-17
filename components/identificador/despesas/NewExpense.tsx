import React, { useEffect, useState } from 'react'
import { FaLink, FaUser } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import ProjectVinculationMenu from './ProjectVinculationMenu'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import SelectInput from '../../inputs/Select'
import { centrosDeCusto, expenseCategories, formatDate, formatToMoney } from '../../../utils/constants'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import { MdDelete } from 'react-icons/md'

import { insertExpense } from '../../../utils/methods/mutation/expenses'
import { getErrorMessage } from '../../../utils/methods/handlers'
import { useQueryClient } from 'react-query'
import DateInput from '../../inputs/Date'
import { TExpense } from '@/utils/schemas/expenses'
import { Session } from 'next-auth'
import CheckboxInput from '@/components/inputs/Checkbox'
import { formatDateInputChange } from '@/utils/methods/shared'
import { BsCode } from 'react-icons/bs'
import { units } from '@/utils/select-options'

function getExpenseCategories(costApportionment: string) {
  if (!costApportionment) return []
  const costApportionmentsObj = centrosDeCusto.find((center) => center.nome == costApportionment)
  if (!costApportionmentsObj) return []

  const options = costApportionmentsObj.categorias.map((category, index) => ({
    id: index + 1,
    ...category,
  }))
  return options
}

type NewExpenseProps = {
  session: Session
  closeModal: () => void
}
function NewExpense({ session, closeModal }: NewExpenseProps) {
  const queryClient = useQueryClient()

  const initialInfoHolder: TExpense = {
    rateio: '',
    categoria: '',
    descricao: '',
    projeto: {
      id: null,
      nome: null,
      identificador: null,
      tipo: null,
    },
    autor: {
      id: session.user?.id,
      nome: session.user?.name,
    },
    itens: [],
    total: 0,
    efetivacao: {
      efetivado: false,
      data: null,
    },
    criterioReferencia: false,
    criterioCompetencia: false,
    dataInsercao: new Date().toISOString(),
  }
  const [infoHolder, setInfoHolder] = useState(initialInfoHolder)
  const [itemHolder, setItemHolder] = useState<TExpense['itens'][number]>({
    idMaterial: null,
    descricao: '',
    preco: 0,
    qtde: 0,
    unidade: 'UN',
  })
  const [insertLoading, setInsertLoading] = useState(false)
  function clearInfoHolder() {
    setInfoHolder(initialInfoHolder)
  }
  function handleLink(info: { id: string | null; nome: string | null; identificador: string | number | null }) {
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

  function addItem() {
    if (itemHolder.descricao.trim().length < 2) {
      toast.error('Prencha uma descrição de item válida.')
      return false
    }
    if (itemHolder.preco < 0) {
      toast.error('Prencha um preço válido..')
      return false
    }
    if (itemHolder.qtde <= 0) {
      toast.error('Prencha uma quantidade válida.')
      return false
    }
    var itemsArr = [...infoHolder.itens]
    itemsArr.push({
      ...itemHolder,
      descricao: itemHolder.descricao.toUpperCase(),
    })
    setInfoHolder((prev) => ({ ...prev, itens: itemsArr }))
    toast.success('Item adicionado !')
    setItemHolder({
      idMaterial: null,
      descricao: '',
      preco: 0,
      qtde: 0,
      unidade: 'UN',
    })
    return
  }
  function getExpenseTotal(itens: TExpense['itens']) {
    const total = itens.reduce((acc, current) => {
      const price = current.preco ? current.preco : 0
      const qtde = current.qtde ? current.qtde : 0
      const toSum = price * qtde
      return acc + toSum
    }, 0)
    return Number(total.toFixed(2))
  }
  async function handleInsertExpense() {
    if (!infoHolder.rateio) {
      toast.error('Preencha o rateio/centro de custo da despesa.')
      return false
    }
    if (!infoHolder.categoria) {
      toast.error('Preencha a categoria da despesa.')
      return false
    }
    if (infoHolder.total <= 0) {
      toast.error('Valor da despesa inválido.')
      return false
    }
    if (!infoHolder.criterioCompetencia && !infoHolder.criterioReferencia) {
      toast.error('Despesa deve ser aplicável a ao menos um critério de análise (Competência ou Referência).')
      return false
    }
    setInsertLoading(true)
    const loadingToastID = toast.loading('Processando...')
    try {
      const user = {
        id: session?.user.id,
        nome: session?.user.name,
      }
      const response = await insertExpense({ ...infoHolder, autor: user })
      toast.dismiss(loadingToastID)
      toast.success(response)
      clearInfoHolder()
      await queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setInsertLoading(false)
    } catch (error) {
      const msg = getErrorMessage(error)
      toast.dismiss(loadingToastID)
      toast.error(msg)
      setInsertLoading(false)
    }
  }
  useEffect(() => {
    const total = getExpenseTotal(infoHolder.itens)
    setInfoHolder((prev) => ({ ...prev, total: total }))
  }, [infoHolder.itens])
  return (
    <div id="defaultModal" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
      <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[75%]">
        <div className="flex h-full w-full flex-col">
          <div className="flex flex-col items-center justify-between border-b border-gray-200 px-2 pb-2 text-lg lg:flex-row">
            <h3 className="text-xl font-bold text-[#353432] dark:text-white ">NOVA DESPESA</h3>
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
            {infoHolder.projeto?.id ? (
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
                <SelectInput
                  editable={true}
                  label={'RATEIO / CENTRO DE CUSTO'}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  value={infoHolder.rateio}
                  options={centrosDeCusto.map((center, index) => ({
                    id: index + 1,
                    label: center.nome,
                    value: center.nome,
                  }))}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, rateio: value }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, rateio: '' }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <SelectInput
                  editable={true}
                  label={'CATEGORIA'}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  value={infoHolder.categoria}
                  options={getExpenseCategories(infoHolder.rateio)}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, categoria: value }))}
                  onReset={() => setInfoHolder((prev) => ({ ...prev, categoria: '' }))}
                  width={'100%'}
                />
              </div>
            </div>
            <div className="my-2 flex w-full flex-col justify-center gap-2 md:flex-row">
              <CheckboxInput
                checked={infoHolder.criterioCompetencia}
                labelFalse={'NÃO APLICÁVEL A CRITÉRIO DE COMPETÊNCIA'}
                labelTrue={'APLICÁVEL A CRITÉRIO DE COMPETÊNCIA'}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    criterioCompetencia: value,
                  }))
                }
              />
              <CheckboxInput
                checked={infoHolder.criterioReferencia}
                labelFalse={'NÃO APLICÁVEL A CRITÉRIO DE REFERÊNCIA'}
                labelTrue={'APLICÁVEL A CRITÉRIO DE REFERÊNCIA'}
                handleChange={(value) =>
                  setInfoHolder((prev) => ({
                    ...prev,
                    criterioReferencia: value,
                  }))
                }
              />
            </div>
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
            <div className="flex w-full flex-col">
              <h1 className="w-full rounded-tr-sm rounded-tl-sm bg-gray-500 p-1 text-center font-bold text-white">OBSERVAÇÕES</h1>
              <textarea
                placeholder="Preencha aqui informações adicionais sobre a despesa..."
                value={infoHolder.descricao || ''}
                onChange={(e) => {
                  setInfoHolder((prev) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }}
                className="min-h-[80px] w-full resize-none rounded-bl-sm rounded-br-sm bg-gray-100 p-3 text-center text-xs font-medium text-gray-600 outline-none"
              />
            </div>
            <div className="my-2 flex w-full flex-col">
              <h1 className="w-full rounded bg-gray-800 text-center font-bold text-white">ITENS</h1>
              <div className="item-center mt-2 flex w-full flex-col gap-2 lg:flex-row">
                <div className="w-full lg:w-[40%]">
                  <TextInput
                    label="DESCRIÇÃO DO ITEM"
                    placeholder={'Preencha aqui a descrição do item...'}
                    value={itemHolder.descricao}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, descricao: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[20%]">
                  <NumberInput
                    label="PREÇO"
                    value={itemHolder.preco}
                    placeholder={'Preencha aqui o preço...'}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, preco: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[20%]">
                  <NumberInput
                    label="QUANTIDADE"
                    value={itemHolder.qtde}
                    placeholder={'Preencha aqui o quantidade...'}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, qtde: value }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-[20%]">
                  <SelectInput
                    editable={true}
                    label={'UNIDADE'}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    value={itemHolder.unidade}
                    options={units}
                    handleChange={(value) => setItemHolder((prev) => ({ ...prev, unidade: value }))}
                    onReset={() => setItemHolder((prev) => ({ ...prev, unidade: '' }))}
                    width={'100%'}
                  />
                </div>
              </div>
              <div className="mt-2 flex w-full items-center justify-end">
                <button
                  className="rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
                  onClick={() => addItem()}
                >
                  ADICIONAR
                </button>
              </div>
              {infoHolder.itens.length > 0 ? (
                <>
                  <div className="mt-2 flex w-full items-center gap-2 rounded-md bg-gray-500">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">DESCRIÇÃO</p>
                    <p className="w-full text-center font-medium text-white lg:flex-[2_2_0%]">PREÇO</p>
                    <p className="w-full text-center font-medium text-white lg:flex-[2_2_0%]">QUANTIDADE</p>
                    <p className="w-full text-center font-medium text-white lg:flex-[1_1_0%]">TOTAL</p>
                  </div>
                  {infoHolder.itens.map((item, index) => (
                    <div key={index} className="my-2 flex w-full items-center gap-2 rounded-md border border-gray-300 p-2">
                      <p className="w-full text-start font-medium lg:flex-[4_4_0%]">{item.descricao}</p>
                      <p className="w-full text-center font-medium lg:flex-[2_2_0%]">{formatToMoney(item.preco)}</p>
                      <p className="w-full text-center font-medium lg:flex-[2_2_0%]">{item.qtde}</p>
                      <div className="flex  w-full items-center justify-center gap-2 lg:flex-[1_1_0%]">
                        <p className="font-medium">{formatToMoney(item.qtde * item.preco)}</p>
                        <button
                          onClick={() => {
                            var itensArr = [...infoHolder.itens]
                            itensArr.splice(index, 1)
                            setInfoHolder((prev) => ({
                              ...prev,
                              itens: itensArr,
                            }))
                          }}
                          className="text-red-300 hover:text-red-500 "
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* <div className="flex w-full items-center gap-2 rounded-md bg-gray-500">
                    <p className="w-full text-center font-medium text-white lg:flex-[4_4_0%]">TOTAL</p>
                  </div>
                  <h1 className="w-full border-x border-b border-gray-300 py-2 px-2 text-center text-lg font-black">
                    {formatToMoney(getExpenseTotal(infoHolder.itens))}
                  </h1> */}
                </>
              ) : (
                <div className="flex min-h-[40px] items-center justify-center">
                  <p className="text-sm italic text-gray-500">Não há itens adicionados...</p>
                </div>
              )}
            </div>

            <div className="my-2 flex w-full items-center justify-center">
              <div className="w-full lg:w-[40%]">
                <NumberInput
                  label={'TOTAL DA DESPESA'}
                  editable={infoHolder.itens.length == 0}
                  placeholder="Preencha o total da despesa..."
                  value={infoHolder.total}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, total: value }))}
                  width={'100%'}
                />
              </div>
            </div>

            <div className="mt-2 flex w-full items-center justify-end">
              <button
                disabled={insertLoading}
                onClick={handleInsertExpense}
                className="w-fit rounded border border-green-500 p-2 font-medium text-green-500 disabled:border-gray-500 disabled:text-gray-500 hover:bg-green-500 hover:text-white"
              >
                CRIAR NOVO REGISTRO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewExpense
