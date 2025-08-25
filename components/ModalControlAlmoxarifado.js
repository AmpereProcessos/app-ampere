import React, { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { VscChromeClose } from 'react-icons/vsc'
import { FaSave } from 'react-icons/fa'

import { units } from '../utils/constants'
import SaveButton from './utils/Buttons/SaveButton'
import TextFloatingInput from './TextFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import SelectFoatingInput from './SelectFloatingInput'
import MaterialLogs from './identificador/materials/MaterialLogs'
import { toast } from 'react-hot-toast'
import { getErrorMessage } from '../utils/methods/handlers'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '70%',
  height: '80%',
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
function ControleAlmoxarifado({ closeModal, info, handleUpdates }) {
  const queryClient = useQueryClient()
  const [materialInfo, setMaterialInfo] = useState(info)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })

  function validateChanges() {
    if (materialInfo.qtde < 0) {
      toast.error('Por favor, preencha uma quantidade válida.')
      return false
    }
    if (materialInfo.preco < 0) {
      toast.error('Por favor, preencha um preço válido.')
      return false
    }
    return true
  }
  async function handleAlteracoes() {
    if (validateChanges()) {
      const loadingToastID = toast.loading('Carregando...')
      try {
        const { data } = await axios.put('/api/almoxarifado/materiais', {
          id: info._id,
          changes: {
            ...materialInfo,
          },
        })
        console.log(data)
        toast.dismiss(loadingToastID)
        toast.success(data)
        await queryClient.cancelQueries({ queryKey: ['materialLog'] })
        await queryClient.invalidateQueries({
          queryKey: ['materialLog', materialInfo._id],
        })
        await queryClient.cancelQueries({ queryKey: ['materials'] })
        await queryClient.invalidateQueries({ queryKey: ['materials'] })
      } catch (error) {
        toast.dismiss(loadingToastID)
        const msg = getErrorMessage(error)
        toast.error(msg)
      }
    }
  }

  useEffect(() => {
    setMaterialInfo(info)
  }, [info])
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex h-full flex-col">
          <div className="flex min-h-[30px] items-center justify-between">
            <h1 className="font-bold text-[#15599a]">{info.nome}</h1>
            <p className="text-primary/60 text-xs">#{info._id}</p>
            <div className="">
              <button className="rounded-lg p-1 hover:bg-red-200">
                <VscChromeClose onClick={() => closeModal()} style={{ color: 'red' }} />
              </button>
            </div>
          </div>
          <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 grow overflow-y-auto overscroll-y-auto py-2">
            <div className="h-full w-full px-4">
              <div className="flex w-full flex-col">
                <h1 className="font-raleway w-full text-center font-medium text-[#15599a]">INFORMAÇÕES DO ITEM</h1>
                <div className="mt-4 flex w-full flex-col gap-4">
                  <TextFloatingInput
                    label="NOME DO ITEM"
                    value={materialInfo.nome}
                    handleChange={(value) => setMaterialInfo((prev) => ({ ...prev, nome: value }))}
                    editable={true}
                    width={'100%'}
                  />
                  <TextFloatingInput
                    label="CÓDIGO NEREUS"
                    value={materialInfo.codigo}
                    handleChange={(value) => setMaterialInfo((prev) => ({ ...prev, codigo: value }))}
                    editable={true}
                    width={'100%'}
                  />
                  <NumberFloatingInput
                    label={'QUANTIDADE'}
                    value={materialInfo.qtde}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        qtde: Number(value),
                      }))
                    }
                    width={'100%'}
                  />
                  <NumberFloatingInput
                    label={'QUANTIDADE MÍNIMA'}
                    value={materialInfo.qtdeMinima}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        qtdeMinima: Number(value),
                      }))
                    }
                    width={'100%'}
                  />
                  <NumberFloatingInput
                    label={'QUANTIDADE MÁXIMA'}
                    value={materialInfo.qtdeMaxima}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        qtdeMaxima: Number(value),
                      }))
                    }
                    width={'100%'}
                  />
                  <SelectFoatingInput
                    label={'GRANDEZA'}
                    editable={true}
                    value={materialInfo.grandeza ? materialInfo.grandeza : 'NÃO DEFINIDO'}
                    options={[...units, { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' }]}
                    handleChange={(value) => setMaterialInfo((prev) => ({ ...prev, grandeza: value }))}
                    width={'100%'}
                  />
                  <NumberFloatingInput
                    label={'PREÇO'}
                    value={materialInfo.preco}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        preco: Number(value),
                      }))
                    }
                    width={'100%'}
                  />
                  <TextFloatingInput
                    label={'LOCALIZAÇÃO'}
                    value={materialInfo.localizacao}
                    editable={true}
                    handleChange={(value) =>
                      setMaterialInfo((prev) => ({
                        ...prev,
                        localizacao: value,
                      }))
                    }
                    width={'100%'}
                  />
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="text-primary/60 w-full text-center text-xs font-medium">ANOTAÇÕES</h1>
                    <textarea
                      value={materialInfo.anotacoes}
                      onChange={(e) =>
                        setMaterialInfo((prev) => ({
                          ...prev,
                          anotacoes: e.target.value,
                        }))
                      }
                      placeholder="Deixe aqui anotações sobre o item em questão..."
                      className="border-primary/20 bg-primary/20 h-[80px] w-full resize-none border p-1 text-center text-sm outline-blue-200"
                    />
                  </div>
                </div>
              </div>
              <div className="my-2 flex w-full flex-col items-center gap-1">
                <div>
                  <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={handleAlteracoes} />
                </div>
              </div>
              <MaterialLogs materialId={materialInfo._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControleAlmoxarifado
