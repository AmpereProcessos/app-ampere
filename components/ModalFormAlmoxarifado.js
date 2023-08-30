import React, { useEffect, useState } from 'react'
import { VscChromeClose } from 'react-icons/vsc'
import { MdOutlineAddCircle } from 'react-icons/md'
import { FaSave } from 'react-icons/fa'
import Select from 'react-select'
import SelectInput from '../components/inputs/Select'
import { cities, equipesTecnicas } from '../utils/constants'
import axios from 'axios'
import MaterialItem from './MaterialItem'
import Link from 'next/link'
import SaveButton from './utils/Buttons/SaveButton'
import { debitMaterials, returnMaterials } from '../utils/methods/mutation/materials'
import { insertExpensesFromMaterials } from '../utils/methods/mutation/expenses'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { BsCheckCircleFill } from 'react-icons/bs'
import { getErrorMessage } from '../utils/methods/handlers'
import AddMaterialFormulario from './identificador/almoxarifado/AddMaterialFormulario'
import { useMaterials } from '../utils/methods/query/materials'
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
function FormularioAlmoxarifado({ setModalIsOpen, info, getForms }) {
  const { data: session } = useSession()
  const [dados, setDados] = useState(info)
  const { data: materials, isFetching: materialsFetching } = useMaterials(!!session.user)
  const [saidaMaterialHolder, setSaidaMaterialHolder] = useState({
    nome: null,
    id: null,
    qtdeSaida: null,
  })

  // Messages
  const [saidaMaterialMsg, setSaidaMaterialMsg] = useState('')
  const [responseMessage, setResponseMessage] = useState({
    status: null,
    text: '',
    color: '',
  })

  function getMaterials() {
    axios.get('/api/almoxarifado/materiais').then((res) => {
      setMateriais(res.data)
    })
  }

  async function addMaterial(material) {
    if (material.qtdeSaida > 0 && material.nome.trim().length > 0) {
      let arr = dados.materiais
      const debitMaterialsToastID = toast.loading('Debitando materiais do estoque...')
      if (material.id)
        await debitMaterials({
          formId: dados._id,
          identifier: dados.nomeDoContrato ? dados.nomeDoContrato : dados.nomeTerceiro,
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
      setDados((prev) => ({ ...prev, materiais: arr }))
      await saveChanges()
    } else {
      setSaidaMaterialMsg('Informações inválidas')
    }
  }
  async function removeMaterial(material, index) {
    const returningMaterialsToastID = toast.loading('Atualizando quantidades no estoque...')
    let infoMaterial = dados.materiais
    infoMaterial.splice(index, 1)
    setDados({ ...dados, materiais: infoMaterial })
    if (material.id)
      await returnMaterials({
        formId: dados._id,
        identifier: dados.nomeDoContrato ? dados.nomeDoContrato : dados.nomeTerceiro,
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
      const { data: upToDateItems } = await axios.post('/api/almoxarifado/pesquisarMateriais', { materials: dados.materiais })
      const correctedMaterialList = dados.materiais.map((item) => {
        const correspondentUpToDateItem = upToDateItems.filter((i) => i._id == item.id)[0]
        console.log(item, correspondentUpToDateItem, 'CORRESPONENCIA')
        return {
          id: item.id,
          nome: correspondentUpToDateItem ? correspondentUpToDateItem.nome : item.nome,
          precoUnit: correspondentUpToDateItem ? correspondentUpToDateItem.preco : item.nome,
          qtdeDevolucao: item.qtdeDevolucao ? item.qtdeDevolucao : 0,
          qtdeSaida: item.qtdeSaida,
          qtdePreBaixa: correspondentUpToDateItem ? correspondentUpToDateItem.qtde : item.qtde,
        }
      })
      toast.dismiss(toastID)
      return correctedMaterialList
    } catch (error) {
      toast.dismiss(toastID)
      throw error
    }
  }
  async function updateFormStatus(formId, materialList) {
    const toastID = toast.loading('Atualizando status do formulário...')
    try {
      await axios.put('/api/almoxarifado/formularios', {
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
      await updateFormStatus(dados._id, correctedMaterials)

      // Creating a cost object and, in case the form references a project, vinculating the cost to the project
      await insertExpensesFromMaterials({
        warehouseFormId: dados._id,
        user: session?.user,
        description: `Usado por/para ${dados.nomeTerceiro ? dados.nomeTerceiro : dados.nomeDoContrato} em ${dados.servico}`,

        projectId: dados.idPai,
        projectQtde: dados.codigoProjeto,
        projectName: dados.nomeDoContrato && dados.nomeDoContrato.trim().length > 0 ? dados.nomeDoContrato : null,
        projectType: undefined,
        materialList: dados.materiais,
      })

      // Updating the quantities in stock for the return quantities provided
      const returningMaterialsToastID = toast.loading('Atualizando quantidades no estoque...')
      await returnMaterials({
        formId: dados._id,
        identifier: dados.nomeDoContrato ? dados.nomeDoContrato : dados.nomeTerceiro,
        changes: correctedMaterials,
        tag: 'DEVOLUÇÃO',
      })
      toast.dismiss(returningMaterialsToastID)

      await saveChanges()
      toast.success('Formulário finalizado com sucesso !')

      getForms()
      setDados({ ...dados, efetivado: true })
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    }
  }
  async function resetForm() {
    const { data: upToDateItems } = await axios.post('/api/almoxarifado/pesquisarMateriais', { materials: dados.materiais })
    var changesArr = dados.materiais.map((item) => {
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
    await axios.put('/api/almoxarifado/formularios', {
      id: dados._id,
      data: {
        materiais: dados.materiais,
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
      idFormulario: dados._id,
      nomeDoContrato: dados.nomeDoContrato,
      changes: changesArr,
    })
    setResponseMessage({
      status: 'success',
      text: 'Formulário resetado com sucesso.',
      color: 'text-green-500',
    })
    getForms()
  }
  async function saveChanges() {
    const toastID = toast.loading('Atualizando formulário...')
    try {
      await axios.put('/api/almoxarifado/formularios', {
        id: dados._id,
        data: {
          equipeResp: dados.equipeResp,
          materiais: dados.materiais,
        },
      })
      toast.dismiss(toastID)
      toast.success('Atualizações feitas com sucesso !')
    } catch (error) {
      toast.error('Erro ao salvar informações do formulário.')
    }
  }

  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <h1 className="text-[#15599a] pl-6 uppercase font-bold">REQUISIÇÃO</h1>
                <h1 className="text-gray-400 italic text-xs">#{dados._id}</h1>
              </div>
              {dados.efetivado == true ? (
                <Link href={`/almoxarifado/pdfFormulario/${dados._id}?efetivado=SIM`}>
                  <p className="p-2 rounded cursor-pointer bg-[#fead61] font-bold text-sm">VISUALIZAR PDF</p>
                </Link>
              ) : (
                <Link href={`/almoxarifado/pdfFormulario/${dados._id}?efetivado=NAO`}>
                  <p className="p-2 rounded cursor-pointer bg-[#fead61] font-bold text-sm">VISUALIZAR PDF</p>
                </Link>
              )}
              <button>
                <VscChromeClose
                  onClick={() => {
                    setModalIsOpen(false)
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            <div className="flex flex-col grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#15599a80] scrollbar-track-gray-100">
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">{dados.uso == 'TERCEIRO' ? 'TERCEIRO' : 'CLIENTE'}</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.uso == 'TERCEIRO' ? dados.nomeTerceiro : dados.nomeDoContrato}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">CIDADE</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.cidade ? dados.cidade : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SEGMENTO</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.segmento ? dados.segmento : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">TOPOLOGIA</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.topologia ? dados.topologia : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">EQUIPE RESP</span>
                <div className={'grow'}>
                  <SelectInput
                    showLabel={false}
                    value={dados.equipeResp}
                    options={equipesTecnicas.map((team, index) => ({ id: index, label: team.label, value: team.value }))}
                    handleChange={(value) => setDados((prev) => ({ ...prev, equipeResp: value }))}
                    width={'100%'}
                  />
                  {/* <p className="text-gray-600 text-center">{dados.equipeResp ? dados.equipeResp : '-'}</p> */}
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">RESPONSÁVEL</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.responsavel ? dados.responsavel : '-'}</p>
                </div>
              </div>
              <div className="flex flex-col lg:items-center lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">SERVIÇO</span>
                <div className={'grow'}>
                  <p className="text-gray-600 text-center">{dados.servico}</p>
                </div>
              </div>
              <div className="w-full flex flex-col border border-gray-200 p-2 mt-4">
                <span className="text-center uppercase font-bold">ADICIONAR MATERIAIS</span>
                <AddMaterialFormulario materials={materials} materialsFetching={materialsFetching} addMaterial={addMaterial} />
              </div>
              <div className="flex h-[350px] flex-col gap-y-2 border border-gray-200 p-2 mt-4">
                <h1 className="font-bold text-center">MATERIAIS</h1>
                <div className="hidden lg:grid grid-cols-9">
                  <p className="text-[#15599a] font-bold col-span-4 text-center">NOME</p>
                  <p className="text-[#15599a] font-bold col-span-2 text-center">SAÍDA</p>
                  <p className="text-[#15599a] font-bold col-span-2 text-center ">DEVOLUÇÃO</p>
                  {dados.efetivado != true && <p className="text-[#15599a] font-bold col-span-1 text-center">EXCLUIR</p>}
                </div>
                <div className="flex flex-col gap-2 grow overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {dados.materiais.map((obj, index) => (
                    <MaterialItem key={index} obj={obj} index={index} dados={dados} setDados={setDados} removeItem={removeMaterial} />
                  ))}
                </div>
              </div>
              {dados.efetivado != true ? (
                <div className="flex w-full justify-end my-2 gap-2 pr-4">
                  {!responseMessage.status ? (
                    <>
                      <button
                        onClick={handleFormConclusion}
                        className="border border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white font-bold p-2 rounded"
                      >
                        FINALIZAR FORMULÁRIO
                      </button>
                      <SaveButton text={'SALVAR ALTERAÇÕES'} icon={<FaSave />} handleClick={saveChanges} />
                    </>
                  ) : (
                    <p className={`text-center italic ${responseMessage.color}`}>{responseMessage.text}</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FormularioAlmoxarifado
