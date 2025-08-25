import React, { useState } from 'react'
import axios from 'axios'

import { VscChromeClose } from 'react-icons/vsc'
import { FaSave } from 'react-icons/fa'

import { units } from '../utils/constants'
import TextFloatingInput from './TextFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import SelectFoatingInput from './SelectFloatingInput'
import { useQueryClient } from '@tanstack/react-query'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
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
function Novoitem({ closeModal }) {
  const queryClient = useQueryClient()
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState(0)
  const [quantidadeMinima, setQuantidadeMinima] = useState(0)
  const [quantidadeMaxima, setQuantidadeMaxima] = useState(0)
  const [grandeza, setGrandeza] = useState('UN')
  const [preco, setPreco] = useState(0)
  const [codigo, setCodigo] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [anotacoes, setAnotacoes] = useState('')
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })

  async function addItem() {
    let obj = {
      nome: nome,
      qtde: quantidade,
      qtdeMinima: quantidadeMinima,
      qtdeMaxima: quantidadeMaxima,
      grandeza: grandeza,
      preco: preco,
      codigo: codigo,
      localizacao: localizacao,
      anotacoes: anotacoes,
    }
    if (nome.trim().length < 3) {
      setMsg({
        text: 'Por favor, preencha um nome válido.',
        color: 'text-red-500',
      })
      return
    }
    if (quantidade == 0) {
      setMsg({
        text: 'Por favor, preencha uma quantidade válida.',
        color: 'text-red-500',
      })
      return
    }
    if (preco == 0) {
      setMsg({
        text: 'Por favor, preencha um preço válido.',
        color: 'text-red-500',
      })
      return
    }
    await axios.post('/api/almoxarifado/novoMaterial', obj)
    setMsg({ text: 'Item adicionado!', color: 'text-green-500' })
    setNome('')
    setQuantidade(0)
    setPreco(0)
    setCodigo('')
    setLocalizacao('')
    setAnotacoes('')
    setTimeout(() => {
      setMsg({ text: '', color: '' })
    }, 2000)
    await queryClient.cancelQueries({ queryKey: ['materials'] })
    await queryClient.invalidateQueries({ queryKey: ['materials'] })
  }

  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div className="h-[90%] w-[90%] lg:h-[80%] lg:w-[50%]" style={MODAL_STYLES}>
          <div className="flex h-full flex-col">
            <div className="border-primary/20 flex min-h-[30px] justify-between border-b px-2 pb-2 text-lg">
              <h1 className="pl-6 font-bold text-[#15599a] uppercase">NOVO ITEM</h1>
              <button>
                <VscChromeClose
                  onClick={() => {
                    closeModal(false)
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 grow overflow-y-auto overscroll-y-auto py-2">
              <div className="flex h-full w-full flex-col px-4">
                <TextFloatingInput label={'NOME DO ITEM'} editable={true} value={nome} handleChange={(value) => setNome(value)} width={'100%'} />
                <NumberFloatingInput
                  label={'QUANTIDADE'}
                  editable={true}
                  value={quantidade}
                  handleChange={(value) => setQuantidade(Number(value))}
                  width={'100%'}
                />
                <NumberFloatingInput
                  label={'QUANTIDADE MÍNIMA'}
                  editable={true}
                  value={quantidadeMinima}
                  handleChange={(value) => setQuantidadeMinima(Number(value))}
                  width={'100%'}
                />
                <NumberFloatingInput
                  label={'QUANTIDADE MÁXIMA'}
                  editable={true}
                  value={quantidadeMaxima}
                  handleChange={(value) => setQuantidadeMaxima(Number(value))}
                  width={'100%'}
                />
                <SelectFoatingInput
                  label={'GRANDEZA'}
                  editable={true}
                  value={grandeza}
                  options={units}
                  handleChange={(value) => setGrandeza(value)}
                  width={'100%'}
                />
                <NumberFloatingInput label={'PREÇO'} editable={true} value={preco} handleChange={(value) => setPreco(Number(value))} width={'100%'} />
                <TextFloatingInput label={'CÓDIGO NEREUS'} editable={true} value={codigo} handleChange={(value) => setCodigo(value)} width={'100%'} />
                <TextFloatingInput
                  label={'LOCALIZAÇÃO'}
                  editable={true}
                  value={localizacao}
                  handleChange={(value) => setLocalizacao(value)}
                  width={'100%'}
                />
                <div className="flex w-full flex-col gap-1">
                  <h1 className="text-primary/60 w-full text-center text-xs font-medium">ANOTAÇÕES</h1>
                  <textarea
                    value={anotacoes}
                    onChange={(e) => setAnotacoes(e.target.value)}
                    placeholder="Deixe aqui anotações sobre o item em questão..."
                    className="border-primary/20 bg-primary/20 h-[80px] w-full resize-none border p-1 text-center text-sm outline-blue-200"
                  />
                </div>
                {msg.text && <p className={`text-center italic ${msg.color}`}>{msg.text}</p>}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={addItem}
                    className="flex items-center gap-x-2 rounded bg-[#15599a] p-2 text-sm font-bold text-white hover:bg-blue-500"
                  >
                    <p>ADICIONAR</p>
                    <FaSave />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Novoitem
