import React, { useState } from 'react'
import { useSession } from '../../../../components/providers/SessionProvider'
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
  const { session } = useSession({ required: true })
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
        nome: session.user.nome,
        avatar_url: session.user.avatar_url,
      }
      await createActivityFromTechAnalysys({ activity: pendencyHolder.descricao, author, project, responsible })
      await notifySellerInCRM(
        pendencyHolder.responsavel,
        infoHolder.projeto?.id,
        `ATIVIDADE CRIADA POR ${session.user.nome}: ${pendencyHolder.descricao}`
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
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
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
        <div className="my-2 flex w-full items-center justify-end gap-2">
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
      <h1 className="bg-primary/60 w-full rounded-tl-sm rounded-tr-sm p-1 text-center font-bold text-white">LISTA DE PENDÊNCIAS</h1>
      {infoHolder.pendencias && infoHolder.pendencias.length > 0 ? (
        infoHolder.pendencias.map((pendency, index) => (
          <div key={index} className="border-primary/20 mt-2 flex w-full flex-col rounded-md border p-3 shadow-xs">
            <h1 className="w-full text-start leading-none font-bold tracking-tight">{pendency.categoria}</h1>
            <div className="mt-1 flex w-full items-center justify-start gap-2">
              <Avatar fallback={'R'} url={getUserAvatarUrl({ users: crmUsers, userName: pendency.responsavel })} height={20} width={20} />
              <p className="text-primary/60 text-xs font-medium">{pendency.responsavel}</p>
            </div>
            <h1 className="text-primary/60 bg-primary/20 my-2 rounded-md p-2 text-center text-sm">{pendency.descricao}</h1>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`text-primary/60 flex items-center gap-2`}>
                  <BsCalendarFill />
                  <p className="text-xs font-medium">{formatDateAsLocale(pendency.dataInsercao)}</p>
                </div>
                {pendency.dataEfetivacao ? (
                  <div className={`text-primary/60 flex items-center gap-2`}>
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
        <p className="text-primary/60 w-full py-2 text-center text-xs font-medium italic">Nenhum pendência cadastrada.</p>
      )}
    </div>
  )
}

export default PendencyBlock
