import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCRMUsers } from '../../../../utils/methods/query/crmUsers'
import SelectInputWithImages from '../../../inputs/SelectWithImages'
import { formatDateAsLocale, formatNameAsInitials } from '../../../../utils/methods/formatting'
import { technicalAnalysisPendencyCategories } from '../../../../utils/select-options'
import CheckboxInput from '../../../inputs/Checkbox'
import toast from 'react-hot-toast'
import Avatar from '../../../utils/Avatar'
import { getUserAvatarUrl } from '../../../../utils/methods/extracting'
import { BsCalendar2Check, BsCalendarCheckFill, BsCalendarFill } from 'react-icons/bs'
import SelectInput from '../../../inputs/Select'
import TextInput from '../../../inputs/Text'
import { createActivityFromTechAnalysys } from '../../../../utils/methods/mutation/crmActivities'
import { notifySellerInCRM } from '../../../../utils/methods/handlers'

function PendencyBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  const { data: session } = useSession()
  const { data: crmUsers } = useCRMUsers({ enabled: true })
  const [pendencyHolder, setPendencyHolder] = useState({
    categoria: null,
    descricao: '',
    responsavel: null,
    dataInsercao: null,
    dataEfetivacao: null,
    finalizado: false,
  })
  const [attribute, setAttribute] = useState(false)
  async function addPendency() {
    const pendencyList = infoHolder.pendencias ? [...infoHolder.pendencias] : []
    const insertPendency = {
      ...pendencyHolder,
      dataInsercao: new Date().toISOString(),
    }
    pendencyList.push(insertPendency)
    if (attribute) {
      const userInCrm = crmUsers.find((user) => user.nome == pendencyHolder.responsavel)
      if (!userInCrm) return
      const responsible = {
        id: userInCrm._id,
        nome: userInCrm.nome,
        avatar_url: userInCrm.avatar_url,
      }
      const project = {
        id: infoHolder.projeto?.id,
        nome: infoHolder.projeto?.nome,
        codigo: infoHolder.projeto?.identificador,
      }
      const author = {
        id: session.user?.id,
        nome: session.user?.name,
        avatar_url: session.user?.image,
      }
      await createActivityFromTechAnalysys({ activity: pendencyHolder.descricao, author, project, responsible })
      await notifySellerInCRM(
        pendencyHolder.responsavel,
        infoHolder.projeto?.id,
        `ATIVIDADE CRIADA POR ${session.user?.name}: ${pendencyHolder.descricao}`
      )
      // criar função para notificar vendedor
    }
    setInfoHolder((prev) => ({
      ...prev,
      pendencias: pendencyList,
    }))
    setChanges((prev) => ({ ...prev, pendencias: pendencyList }))
    setPendencyHolder({
      categoria: null,
      descricao: '',
      responsavel: null,
      dataInsercao: null,
      dataEfetivacao: null,
      finalizado: false,
    })
    return toast.success('Pendência criada com sucesso !')
  }

  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">PENDÊNCIAS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="CATEGORIA"
              options={technicalAnalysisPendencyCategories}
              value={pendencyHolder.categoria}
              handleChange={(value) => setPendencyHolder((prev) => ({ ...prev, categoria: value }))}
              onReset={() => setPendencyHolder((prev) => ({ ...prev, categoria: null }))}
              selectedItemLabel="NÃO DEFINIDO"
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="DESCRIÇÃO"
              placeholder="Preencha a descrição da pendência..."
              value={pendencyHolder.descricao || ''}
              handleChange={(value) => setPendencyHolder((prev) => ({ ...prev, descricao: value }))}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInputWithImages
              label={'RESPONSÁVEL'}
              value={pendencyHolder.responsavel}
              options={
                crmUsers?.map((resp) => ({
                  id: resp._id,
                  label: resp.nome,
                  value: resp.nome,
                  url: resp.avatar_url,
                  fallback: formatNameAsInitials(resp.nome),
                })) || []
              }
              handleChange={(value) => {
                setPendencyHolder((prev) => ({ ...prev, responsavel: value }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => {
                setPendencyHolder((prev) => ({ ...prev, responsavel: null }))
              }}
              width={'100%'}
            />
          </div>
        </div>
        <div className="flex w-full gap-2 items-center justify-end my-2">
          {infoHolder.projeto.id && infoHolder.requerente.idCRM ? (
            <div className="w-fit">
              <CheckboxInput
                labelFalse={'ATRIBUIR ATIVIDADE AO REQUERENTE'}
                labelTrue={'ATRIBUIR ATIVIDADE AO REQUERENTE'}
                checked={attribute}
                handleChange={(value) => {
                  setAttribute(value)
                  setPendencyHolder((prev) => ({ ...prev, responsavel: infoHolder.requerente.nomeCRM }))
                }}
                justify="justify-center"
              />
            </div>
          ) : null}
          <button
            onClick={addPendency}
            className="rounded border border-green-500 p-1 font-bold text-green-500 duration-300 ease-in-out hover:bg-green-500 hover:text-white"
          >
            ADICIONAR ITEM
          </button>
        </div>
      </div>
      <h1 className="w-full p-1 bg-gray-500 text-white font-bold text-center rounded-tr-sm rounded-tl-sm">LISTA DE PENDÊNCIAS</h1>
      {infoHolder.pendencias && infoHolder.pendencias.length > 0 ? (
        infoHolder.pendencias.map((pendency, index) => (
          <div key={index} className="mt-2 w-full flex flex-col border border-gray-300 p-3 rounded-md shadow-sm">
            <h1 className="w-full text-start font-bold tracking-tight leading-none ">{pendency.categoria}</h1>
            <div className="flex items-center justify-start w-full gap-2 mt-1">
              <Avatar fallback={'R'} url={getUserAvatarUrl({ users: crmUsers, userName: pendency.responsavel })} height={20} width={20} />
              <p className="font-medium text-gray-500 text-xs">{pendency.responsavel}</p>
            </div>
            <h1 className="p-2 text-center text-sm text-gray-500 rounded-md bg-gray-100 my-2">{pendency.descricao}</h1>
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 text-gray-500`}>
                  <BsCalendarFill />
                  <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataInsercao)}</p>
                </div>
                {pendency.dataEfetivacao ? (
                  <div className={`flex items-center gap-2 text-gray-500`}>
                    <BsCalendarCheckFill color="rgb(34,197,94)" />
                    <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataEfetivacao, true)}</p>
                  </div>
                ) : null}
              </div>
              <div className="w-fit">
                <CheckboxInput
                  labelFalse={'FINALIZADO'}
                  labelTrue={'FINALIZADO'}
                  checked={pendency.finalizado}
                  handleChange={(value) => {
                    const pendencyList = [...infoHolder.pendencias]
                    pendencyList[index].finalizado = value
                    pendencyList[index].dataEfetivacao = new Date().toISOString()
                    setInfoHolder((prev) => ({ ...prev, pendencias: pendencyList }))
                    setChanges((prev) => ({ ...prev, [`pendencias.${index}.finalizado`]: value }))
                  }}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="w-full font-medium text-center text-xs italic text-gray-500 py-2">Nenhum pendência cadastrada.</p>
      )}
    </div>
  )
}

export default PendencyBlock
