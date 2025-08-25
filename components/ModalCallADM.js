import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import SaveButton from './utils/Buttons/SaveButton'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  backgroundColor: '#fff',
  minWidth: '40%',
  height: '87%',
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
function ModalCallADM({ open, setModalIsOpen, info, getCalls }) {
  const [modalInfo, setModalInfo] = useState(info)
  const [changes, setChanges] = useState({})
  const [message, setMessage] = useState({
    text: '',
    color: '',
  })
  function handleChanges(status) {
    let obj = { ...changes, status: status ? status : modalInfo.status }
    console.log(obj)
    axios
      .put('/api/chamados/adm/mainData', {
        id: info._id,
        changes: obj,
      })
      .then((res) => {
        getCalls()
        setMessage({ text: 'Alterações feitas', color: 'text-green-500' })
        setModalInfo(res.data.value)
      })
      .catch((err) =>
        setMessage({
          text: 'Um erro ocorreu, por favor tente novamente.',
          color: 'text-red-500',
        })
      )
  }
  function getText(service) {
    if (service == 'PAGAMENTO') {
      return 'VALOR A PAGAR'
    }
    if (service == 'COBRANÇA') {
      return 'VALOR A COBRAR'
    }
  }
  console.log(modalInfo)
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex h-full flex-col">
            <div className="border-primary/20 flex items-center justify-between border-b px-2 pb-2 text-lg">
              <div className="flex items-center gap-x-2">
                <h1 className="pl-6 font-bold text-[#15599a]">{modalInfo.demanda}</h1>
                <p className="text-primary/60 text-center text-xs">#{modalInfo._id}</p>
              </div>
              <button>
                <VscChromeClose
                  onClick={() => {
                    setMessage({ text: '', color: '' })
                    setModalIsOpen(false)
                  }}
                  style={{ color: 'red' }}
                />
              </button>
            </div>
            <div className="overflow-y-auto">
              <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 gap-x-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                <span className="font-raleway text-center font-bold">CLIENTE</span>
                <span className="font-raleway grow text-center">
                  {modalInfo.nomeCliente} - #{modalInfo.codigoProjeto}
                </span>
              </div>
              <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 gap-x-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                <span className="font-raleway text-center font-bold">EMISSOR</span>
                <span className="font-raleway grow text-center">{modalInfo.usuarioEmissor}</span>
              </div>
              <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                <span className="font-raleway text-center font-bold">ABERTURA</span>
                <span className="font-raleway grow text-center">{dayjs(modalInfo.dataAbertura).format('DD/MM/YYYY')}</span>
              </div>
              {modalInfo.dataDeConclusao && (
                <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                  <span className="font-raleway text-center font-bold">FECHAMENTO</span>
                  <span className="font-raleway grow text-center">{dayjs(modalInfo.dataDeConclusao).format('DD/MM/YYYY')}</span>
                </div>
              )}

              <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                <span className="font-raleway text-center font-bold">SERVIÇO</span>
                <span className="font-raleway grow text-center">{modalInfo.servico}</span>
              </div>
              {modalInfo.demanda == 'PAGAMENTO' && (
                <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 gap-x-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                  <span className="font-raleway text-center font-bold">NOME DO RECEBEDOR</span>
                  <span className="font-raleway grow text-center">{modalInfo.nomeRecebedor}</span>
                </div>
              )}
              <div className="border-primary/20 mt-4 grid grid-cols-1 grid-rows-2 gap-x-2 border p-2 lg:grid-cols-2 lg:grid-rows-1">
                <span className="font-raleway text-center font-bold">{getText(modalInfo.demanda)}</span>
                <span className="font-raleway grow text-center">
                  {typeof modalInfo.valor == 'number' ? `R$${modalInfo.valor.toFixed(2).replace('.', ',')}` : 'VALOR NÃO DEFINIDO'}
                </span>
              </div>
              <div className="border-primary/20 mt-4 flex flex-col gap-x-2 border p-2">
                <span className="font-raleway text-center font-bold">OBSERVAÇÕES</span>
                <span className="font-raleway bg-primary/20 grow p-4 text-center text-sm italic">
                  {modalInfo.observacoes ? (
                    <ul className="list-none text-center text-xs font-bold">
                      {modalInfo.observacoes.split('/').map((string, index) => (
                        <li key={index}>{string}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-xs font-bold">SEM OBSERVAÇÕES</p>
                  )}
                </span>
              </div>
              <div className="border-primary/20 mt-4 flex flex-col gap-x-2 border p-2">
                <span className="font-raleway text-center font-bold">ANOTAÇÕES</span>
                <textarea
                  value={modalInfo.anotacoes}
                  onChange={(e) => {
                    setChanges({ ...changes, anotacoes: e.target.value })
                    setModalInfo({ ...modalInfo, anotacoes: e.target.value })
                  }}
                  placeholder="Digite aqui as anotações do chamado"
                  className="bg-primary/20 mt-1 h-fit min-h-[100px] grow resize-none rounded p-3 text-center text-sm outline-hidden placeholder:italic"
                />
              </div>
              {modalInfo.dataDeConclusao ? (
                <div className="text-center">
                  <button
                    onClick={() => handleChanges('ABERTO')}
                    className="font-raleway mt-4 rounded-lg bg-yellow-400 p-3 font-bold hover:bg-[#f18701] hover:text-white"
                  >
                    REABRIR CHAMADO
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => handleChanges('FINALIZADO')}
                    className="font-raleway mt-4 rounded-lg bg-green-400 p-3 font-bold hover:bg-[#06d6a0] hover:text-white"
                  >
                    FINALIZAR CHAMADO
                  </button>
                </div>
              )}
              {message.text && <p className={`text-center ${message.color} mt-2 italic`}>{message.text}</p>}
              <div className="mt-2 flex items-center justify-center">
                <SaveButton text={'SALVAR'} icon={<FaSave />} handleClick={handleChanges} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalCallADM
