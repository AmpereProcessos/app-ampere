import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Link from 'next/link'
import { VscChromeClose } from 'react-icons/vsc'
import { FaSave } from 'react-icons/fa'

import SelectInput from './inputs/Select'
import MaterialItem from './identificador/almoxarifado/formulario/MaterialItem'
import AddMaterialFormulario from './identificador/almoxarifado/AddMaterialFormulario'
import SaveButton from './utils/Buttons/SaveButton'

import { equipesTecnicas } from '../utils/constants'
import { debitMaterials, returnMaterials } from '../utils/methods/mutation/materials'
import { insertExpensesFromMaterials } from '../utils/methods/mutation/expenses'
import { useMaterials } from '../utils/methods/query/materials'
import { getErrorMessage } from '../utils/methods/handlers'
import { Session } from 'next-auth'
import { useWarehouseFormById } from '@/utils/methods/query/warehouse-forms'
import { TWarehouseFormulary, TWarehouseFormularyDTO } from '@/utils/schemas/warehouse-formularies'
import LoadingPage from './utils/LoadingPage'
import ErrorComponent from './utils/ErrorComponent'
import { TMaterialDTO } from '@/utils/schemas/materials'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '85%',
  height: '90%',
  borderRadius: '10px',
  padding: '10px',
  zIndex: 1000,
}
const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
  zIndex: 1000,
}

type EditWarehouseFormularyProps = {
  formId: string
  session: Session
  invalidateQuery: () => void
  closeModal: () => void
}
function EditWarehouseFormulary({ formId, session, invalidateQuery, closeModal }: EditWarehouseFormularyProps) {
  const { data: form, isLoading, isError, isSuccess } = useWarehouseFormById({ id: formId })
  const { data: materials, isFetching: materialsFetching } = useMaterials()

  const [infoHolder, setInfoHolder] = useState<TWarehouseFormularyDTO>({
    _id: '',
    idPai: null,
    tipo: 'RETIRADA',
    codigoProjeto: null,
    nomeDoContrato: '',
    uso: 'CLIENTE',
    cidade: null,
    segmento: 'COMÉRCIO',
    topologia: 'INVERSOR',
    equipeResp: '',
    responsavel: 'A DEFINIR',
    servico: 'NÃO DEFINIDO',
    materiais: [],
  })
  const [saidaMaterialHolder, setSaidaMaterialHolder] = useState({
    nome: null,
    id: null,
    qtdeSaida: null,
  })

  // Messages
  const [saidaMaterialMsg, setSaidaMaterialMsg] = useState('')
  const [responseMessage, setResponseMessage] = useState<{ status: string | null; text: string; color: string }>({
    status: null,
    text: '',
    color: '',
  })

  async function addMaterial(material) {
    if (material.qtdeSaida > 0 && material.nome.trim().length > 0) {
      let arr = infoHolder.materiais
      const debitMaterialsToastID = toast.loading('Debitando materiais do estoque...')
      if (material.id)
        await debitMaterials({
          formId: infoHolder._id,
          identifier: infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : infoHolder.nomeTerceiro,
          changes: [material],
          tag: 'RETIRADA',
        })
      toast.dismiss(debitMaterialsToastID)
      let index = arr.findIndex((obj) => !!material.id && obj.id == material.id)
      if (index != -1) {
        arr[index].qtdeSaida += material.qtdeSaida
      } else {
        arr.push(material)
      }
      setInfoHolder((prev) => ({ ...prev, materiais: arr }))
      await saveChanges()
    } else {
      setSaidaMaterialMsg('Informações inválidas')
    }
  }
  async function removeMaterial(material: TWarehouseFormularyDTO['materiais'][number], index: number) {
    const returningMaterialsToastID = toast.loading('Atualizando quantidades no estoque...')
    let infoMaterial = infoHolder.materiais
    infoMaterial.splice(index, 1)
    setInfoHolder({ ...infoHolder, materiais: infoMaterial })
    if (material.id)
      await returnMaterials({
        formId: infoHolder._id,
        identifier: infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : infoHolder.nomeTerceiro,
        changes: [{ id: material.id, qtdeDevolucao: material.qtdeSaida }],
        tag: 'DEVOLUÇÃO',
      })
    toast.dismiss(returningMaterialsToastID)
    await saveChanges()
    return
  }
  async function getCorrectedMaterialList() {
    const toastID = toast.loading('Buscando informações atualizadas dos materiais...')
    try {
      const { data } = await axios.post('/api/almoxarifado/pesquisarMateriais', { materials: infoHolder.materiais })
      const upToDateItems = data as TMaterialDTO[]
      const correctedMaterialList = infoHolder.materiais.map((item) => {
        const correspondentUpToDateItem = upToDateItems.filter((i) => i._id == item.id)[0]
        console.log(item, correspondentUpToDateItem, 'CORRESPONENCIA')
        return {
          id: item.id,
          nome: correspondentUpToDateItem ? correspondentUpToDateItem.nome : item.nome,
          precoUnit: correspondentUpToDateItem ? correspondentUpToDateItem.preco : item.nome,
          qtdeDevolucao: item.qtdeDevolucao ? item.qtdeDevolucao : 0,
          qtdeSaida: item.qtdeSaida,
          qtdePreBaixa: correspondentUpToDateItem ? correspondentUpToDateItem.qtde : 0,
        }
      })
      toast.dismiss(toastID)
      return correctedMaterialList
    } catch (error) {
      toast.dismiss(toastID)
      throw error
    }
  }
  async function updateFormStatus(formId: string, materialList: TWarehouseFormularyDTO['materiais']) {
    const toastID = toast.loading('Atualizando status do formulário...')
    try {
      await axios.put(`/api/almoxarifado/formularios?id=${formId}`, {
        id: formId,
        data: {
          materiais: materialList,
          dataEfetivacao: new Date(),
          efetivado: true,
        },
      })
      toast.dismiss(toastID)
      return
    } catch (error) {
      throw error
    }
  }
  async function handleFormConclusion() {
    try {
      setResponseMessage({
        status: 'loading',
        text: 'Atualizando preços...',
        color: 'text-[#15599a]',
      })
      // Correcting prices to up to date information
      const correctedMaterials = await getCorrectedMaterialList()

      // Updating form status to efetivado = true
      await updateFormStatus(infoHolder._id, correctedMaterials)

      // Creating a cost object and, in case the form references a project, vinculating the cost to the project
      await insertExpensesFromMaterials({
        warehouseFormId: infoHolder._id,
        user: session?.user,
        description: `Usado por/para ${infoHolder.nomeTerceiro ? infoHolder.nomeTerceiro : infoHolder.nomeDoContrato} em ${infoHolder.servico}`,
        projectId: infoHolder.idPai,
        projectQtde: infoHolder.codigoProjeto,
        projectName: infoHolder.nomeDoContrato && infoHolder.nomeDoContrato.trim().length > 0 ? infoHolder.nomeDoContrato : null,
        projectType: undefined,
        materialList: infoHolder.materiais,
      })

      // Updating the quantities in stock for the return quantities provided
      const returningMaterialsToastID = toast.loading('Atualizando quantidades no estoque...')
      await returnMaterials({
        formId: infoHolder._id,
        identifier: infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : infoHolder.nomeTerceiro,
        changes: correctedMaterials,
        tag: 'DEVOLUÇÃO',
      })
      toast.dismiss(returningMaterialsToastID)

      await saveChanges()
      toast.success('Formulário finalizado com sucesso !')

      invalidateQuery()
      setInfoHolder({ ...infoHolder, efetivado: true })
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }
  async function resetForm() {
    const { data: upToDateItems } = await axios.post('/api/almoxarifado/pesquisarMateriais', { materials: infoHolder.materiais })
    var changesArr = infoHolder.materiais.map((item) => {
      const correspondentUpToDateItem = upToDateItems.filter((i) => i._id == item.id)[0]
      return {
        id: item.id,
        nome: correspondentUpToDateItem.nome,
        precoUnit: correspondentUpToDateItem.preco,
        qtdeDevolucao: item.qtdeSaida ? item.qtdeSaida : 0,
        qtdeSaida: item.qtdeDevolucao ? item.qtdeDevolucao : 0,
        qtdePreBaixa: correspondentUpToDateItem.qtde,
      }
    })
    setResponseMessage({
      status: 'loading',
      text: 'Resetando formulários...',
      color: 'text-[#15599a]',
    })
    await axios.put(`/api/almoxarifado/formularios?id=${infoHolder._id}`, {
      id: infoHolder._id,
      data: {
        materiais: infoHolder.materiais,
        dataEfetivacao: null,
        efetivado: null,
      },
    })

    setResponseMessage({
      status: 'loading',
      text: 'Atualizando quantidades...',
      color: 'text-[#15599a]',
    })
    await axios.post('/api/almoxarifado/materiais', {
      idFormulario: infoHolder._id,
      nomeDoContrato: infoHolder.nomeDoContrato,
      changes: changesArr,
    })
    setResponseMessage({
      status: 'success',
      text: 'Formulário resetado com sucesso.',
      color: 'text-green-500',
    })
    invalidateQuery()
  }
  async function saveChanges() {
    const toastID = toast.loading('Atualizando formulário...')
    try {
      await axios.put(`/api/almoxarifado/formularios?id=${infoHolder._id}`, {
        id: infoHolder._id,
        data: {
          equipeResp: infoHolder.equipeResp,
          materiais: infoHolder.materiais,
        },
      })
      toast.dismiss(toastID)
      toast.success('Atualizações feitas com sucesso !')
    } catch (error) {
      toast.error('Erro ao salvar informações do formulário.')
    }
  }

  useEffect(() => {
    if (form) setInfoHolder(form)
  }, [form])
  return (
    <>
      <div id="edit-form" className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-[rgba(0,0,0,.85)]">
        <div className="fixed left-[50%] top-[50%] z-[100] h-[80%] w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-[#fff] p-[10px] lg:w-[75%]">
          <div className="flex h-full flex-col">
            <div className="flex justify-between border-b border-gray-200 px-2 pb-2 text-lg">
              <div className="flex items-center gap-2">
                <h1 className="pl-6 font-bold uppercase text-[#15599a]">REQUISIÇÃO</h1>
                <h1 className="text-xs italic text-gray-400">#{infoHolder._id}</h1>
              </div>
              {infoHolder.efetivado == true ? (
                <Link href={`/almoxarifado/pdfFormulario/${infoHolder._id}?efetivado=SIM`}>
                  <p className="cursor-pointer rounded bg-[#fead61] p-2 text-sm font-bold">VISUALIZAR PDF</p>
                </Link>
              ) : (
                <Link href={`/almoxarifado/pdfFormulario/${infoHolder._id}?efetivado=NAO`}>
                  <p className="cursor-pointer rounded bg-[#fead61] p-2 text-sm font-bold">VISUALIZAR PDF</p>
                </Link>
              )}
              <button>
                <VscChromeClose
                  onClick={() => {
                    closeModal()
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            {isLoading ? <LoadingPage /> : null}
            {isError ? <ErrorComponent msg={'Erro ao buscar informações do formulário.'} /> : null}
            {isSuccess ? (
              <div className="flex grow flex-col gap-y-2 overflow-y-auto overscroll-y-auto px-2 py-1 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">{infoHolder.uso == 'TERCEIRO' ? 'TERCEIRO' : 'CLIENTE'}</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.uso == 'TERCEIRO' ? infoHolder.nomeTerceiro : infoHolder.nomeDoContrato}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">CIDADE</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.cidade ? infoHolder.cidade : '-'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">SEGMENTO</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.segmento ? infoHolder.segmento : '-'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">TOPOLOGIA</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.topologia ? infoHolder.topologia : '-'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">EQUIPE RESP</span>
                  <div className={'grow'}>
                    <SelectInput
                      label="EQUIPE"
                      showLabel={false}
                      value={infoHolder.equipeResp}
                      selectedItemLabel="NÃO DEFINIDO"
                      options={equipesTecnicas.map((team, index) => ({ id: index + 1, label: team.label, value: team.value }))}
                      handleChange={(value) => setInfoHolder((prev) => ({ ...prev, equipeResp: value }))}
                      onReset={() => setInfoHolder((prev) => ({ ...prev, equipeResp: undefined }))}
                      width={'100%'}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">RESPONSÁVEL</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.responsavel ? infoHolder.responsavel : '-'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-x-2 border border-gray-200 p-2 lg:flex-row lg:items-center">
                  <span className="text-center font-bold uppercase">SERVIÇO</span>
                  <div className={'grow'}>
                    <p className="text-center text-gray-600">{infoHolder.servico}</p>
                  </div>
                </div>
                <div className="mt-4 flex w-full flex-col border border-gray-200 p-2">
                  <span className="text-center font-bold uppercase">ADICIONAR MATERIAIS</span>
                  <AddMaterialFormulario materials={materials} materialsFetching={materialsFetching} addMaterial={addMaterial} />
                </div>
                <div className="mt-4 flex h-[350px] flex-col gap-y-2 border border-gray-200 p-2">
                  <h1 className="text-center font-bold">MATERIAIS</h1>
                  <div className="hidden grid-cols-9 lg:grid">
                    <p className="col-span-4 text-center font-bold text-[#15599a]">NOME</p>
                    <p className="col-span-2 text-center font-bold text-[#15599a]">SAÍDA</p>
                    <p className="col-span-2 text-center font-bold text-[#15599a] ">DEVOLUÇÃO</p>
                    {infoHolder.efetivado != true && <p className="col-span-1 text-center font-bold text-[#15599a]">EXCLUIR</p>}
                  </div>
                  <div className="flex grow flex-col gap-2 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {infoHolder.materiais.map((obj, index) => (
                      <MaterialItem
                        key={index}
                        material={obj}
                        index={index}
                        formHolder={infoHolder}
                        setFormHolder={setInfoHolder}
                        removeItem={removeMaterial}
                      />
                    ))}
                  </div>
                </div>
                {infoHolder.efetivado != true ? (
                  <div className="my-2 flex w-full justify-end gap-2 pr-4">
                    {!responseMessage.status ? (
                      <>
                        <button
                          onClick={handleFormConclusion}
                          className="rounded border border-green-500 bg-transparent p-2 font-bold text-green-500 hover:bg-green-500 hover:text-white"
                        >
                          FINALIZAR FORMULÁRIO
                        </button>
                        <SaveButton isLoading={false} text={'SALVAR ALTERAÇÕES'} icon={<FaSave />} handleClick={saveChanges} />
                      </>
                    ) : (
                      <p className={`text-center italic ${responseMessage.color}`}>{responseMessage.text}</p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditWarehouseFormulary
