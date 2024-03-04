import DateInput from '@/components/inputs/Date'
import NumberInput from '@/components/inputs/Number'
import SelectInputWithImages from '@/components/inputs/SelectWithImages'
import Avatar from '@/components/utils/Avatar'
import { formatDate } from '@/utils/constants'
import { formatDateAsLocale, formatNameAsInitials } from '@/utils/methods/formatting'
import { useUsers } from '@/utils/methods/query/users'
import { formatDateInputChange } from '@/utils/methods/shared'
import { TProperty, TPropertyDTO } from '@/utils/schemas/properties'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { BsDownload, BsUpload } from 'react-icons/bs'
import { FaBox } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

type ResponsiblesMenuProps = {
  propertyHolder: TPropertyDTO
  setPropertyHolder: React.Dispatch<React.SetStateAction<TPropertyDTO>>
}
function ResponsiblesMenu({ propertyHolder, setPropertyHolder }: ResponsiblesMenuProps) {
  console.log(
    propertyHolder.quantidade,
    propertyHolder.responsaveis.reduce((acc, current) => acc + current.quantidade, 0)
  )
  const availableQty = propertyHolder.quantidade - propertyHolder.responsaveis.reduce((acc, current) => acc + current.quantidade, 0)
  console.log(availableQty)
  const { data: users } = useUsers()
  const [responsibleHolder, setResponsibleHolder] = useState<TProperty['responsaveis'][number]>({
    id: '',
    nome: '',
    avatar_url: null,
    quantidade: availableQty,
    dataRecebimento: new Date().toISOString(),
  })
  function addResponsible(info: TProperty['responsaveis'][number]) {
    if (info.quantidade <= 0) return toast.error('Preencha uma quantidade válida.')
    if (info.quantidade > availableQty) return toast.error('Quantidade excede o máximo de itens.')
    if (!info.dataRecebimento) return toast.error('Preencha uma data de recebimento.')
    const equivalentResponsible = users?.find((u) => u._id == info.id)
    const responsible = {
      id: equivalentResponsible?._id || '',
      nome: equivalentResponsible?.usuario || '',
      avatar_url: equivalentResponsible?.avatar_url,
      quantidade: info.quantidade,
      dataRecebimento: info.dataRecebimento,
    }
    const list = [...propertyHolder.responsaveis]
    list.push(responsible)
    setPropertyHolder((prev) => ({ ...prev, responsaveis: list }))
  }
  function removeResponsible(index: number) {
    const list = [...propertyHolder.responsaveis]
    list.splice(index, 1)
    setPropertyHolder((prev) => ({ ...prev, responsaveis: list }))
  }
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <h1 className="w-full text-center font-black">RESPONSÁVEIS</h1>
      <p className="w-full text-center text-sm tracking-tight text-gray-500">Adicione aqui os responsáveis em posse da propriedade.</p>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-[30%]">
          <SelectInputWithImages
            label={'RESPONSÁVEL'}
            editable={true}
            value={responsibleHolder.id}
            options={
              users?.map((resp) => ({
                id: resp._id,
                label: resp.usuario,
                value: resp._id,
                url: resp.avatar_url,
                fallback: formatNameAsInitials(resp.usuario),
              })) || []
            }
            handleChange={(value: any) => setResponsibleHolder((prev) => ({ ...prev, id: value }))}
            onReset={() => setResponsibleHolder((prev) => ({ ...prev, id: '' }))}
            selectedItemLabel={'USUÁRIO NÃO DEFINIDO'}
            width={'100%'}
          />
        </div>
        <div className="w-full lg:w-[30%]">
          <NumberInput
            label="QUANTIDADE EM POSSE"
            placeholder="Preencha a quantidade em posse do responsável..."
            value={responsibleHolder.quantidade}
            handleChange={(value) => setResponsibleHolder((prev) => ({ ...prev, quantidade: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[20%]">
          <DateInput
            label="DATA DE RECEBIMENTO"
            value={formatDate(responsibleHolder.dataRecebimento)}
            handleChange={(value) => setResponsibleHolder((prev) => ({ ...prev, dataRecebimento: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[20%]">
          <DateInput
            label="DATA DE DEVOLUÇÃO"
            value={responsibleHolder.dataDevolucao ? formatDate(responsibleHolder.dataDevolucao) : undefined}
            handleChange={(value) => setResponsibleHolder((prev) => ({ ...prev, dataDevolucao: formatDateInputChange(value) }))}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-1 flex w-full items-center justify-end">
        <button
          onClick={() => addResponsible(responsibleHolder)}
          className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-gray-500 enabled:hover:bg-gray-700"
        >
          ADICIONAR RESPONSÁVEL
        </button>
      </div>
      <div className="flex w-full flex-wrap items-start justify-around gap-2">
        {propertyHolder.responsaveis.length > 0 ? (
          propertyHolder.responsaveis.map((responsible, index) => (
            <div key={index} className="flex w-[450px] flex-col rounded-xl border border-gray-300 p-2">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Avatar url={responsible.avatar_url} height={30} width={30} fallback={formatNameAsInitials(responsible.nome)} />
                  <h1 className="text-xs font-medium leading-none tracking-tight  lg:text-sm">{responsible.nome}</h1>
                </div>
                <div className="flex min-w-fit items-center gap-2 rounded-full bg-gray-800 px-2 py-1 ">
                  <h1 className="text-[0.65rem] font-medium text-white lg:text-xs">
                    {responsible.quantidade > 1 ? `${responsible.quantidade} ITENS` : `${responsible.quantidade} ITEM`}
                  </h1>
                </div>
              </div>
              <div className="mt-2 flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <BsDownload />
                    <p className="text-xs font-medium text-gray-500">RECEBIDO EM: {formatDateAsLocale(responsible.dataRecebimento)}</p>
                  </div>
                  {responsible.dataDevolucao ? (
                    <div className="flex items-center gap-2">
                      <BsUpload />
                      <p className="text-xs font-medium text-gray-500">DEVOLVIDO EM: {formatDateAsLocale(responsible.dataDevolucao)}</p>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-gray-500">DEVOLUÇÃO PENDENTE</p>
                  )}
                </div>
                <button
                  onClick={() => removeResponsible(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 text-red-300 duration-300 ease-linear hover:scale-105 hover:bg-red-200 hover:text-red-500"
                >
                  <MdDelete size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs font-medium italic text-gray-500">Não há responsáveis cadastrados</p>
        )}
      </div>
    </div>
  )
}

export default ResponsiblesMenu
