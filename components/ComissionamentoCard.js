import React, { useState } from 'react'
import axios from 'axios'
function ComissionamentoCard({ info, getProjects }) {
  const [infoHolder, setInfo] = useState(info)
  const [msg, setMsg] = useState('')
  const [changes, setChanges] = useState({})
  const editor = true
  async function notifyPosVenda() {
    try {
      let data = await axios.post('/api/notificacoes/1', {
        destinatario: '6353ebc7ef4e1a367a87794b',
        projetoReferencia: info.qtde,
        nomeDoProjeto: info.nomeDoContrato,
        remetente: 'SISTEMA',
        mensagem: `DOCUMENTO DE COMISSIONAMENTO DO CLIENTE FINALIZADO.`,
      })
      if (data) return
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  async function handleChanges() {
    if (!info.comissionamento.projetos && changes['comissionamento.projetos']) {
      await notifyPosVenda()
    }
    axios.post(`/api/projects/update/${info._id}`, changes).then((res) => {
      setMsg('Alterações concluidas')
      getProjects()
    })
  }
  return (
    <div className="border-primary/20 flex w-full flex-col border p-2">
      <p className="border-primary/20 font-raleway border-b pb-1 font-bold">
        {infoHolder.qtde} - {infoHolder.nomeDoContrato}
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <div className="flex w-[150px] flex-col items-center">
          <span className="font-raleway text-center text-sm font-bold uppercase">COMISSIONAMENTO COMERCIAL</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.comercial ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'comissionamento.comercial': e.target.checked,
                })
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    comercial: e.target.checked,
                  },
                })
              }}
              type="checkbox"
              name="comissionamentoComercial"
              id="comissionamentoComercial"
            />
            <label className="ml-2" htmlFor="comissionamentoComercial">
              OK
            </label>
          </div>
        </div>
        <div className="flex w-[150px] flex-col items-center">
          <span className="font-raleway text-center text-sm font-bold uppercase">COMISSIONAMENTO DE SUPRIMENTOS</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.suprimentos ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'comissionamento.suprimentos': e.target.checked,
                })
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    suprimentos: e.target.checked,
                  },
                })
              }}
              type="checkbox"
              name="comissionamentoSuprimentos"
              id="comissionamentoSuprimentos"
            />
            <label className="ml-2" htmlFor="comissionamentoSuprimentos">
              OK
            </label>
          </div>
        </div>
        <div className="flex w-[150px] flex-col items-center">
          <span className="font-raleway text-center text-sm font-bold uppercase">COMISSIONAMENTO PROJETOS</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.comissionamento?.projetos ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'comissionamento.projetos': e.target.checked,
                })
                setInfo({
                  ...infoHolder,
                  comissionamento: {
                    ...infoHolder.comissionamento,
                    projetos: e.target.checked,
                  },
                })
              }}
              type="checkbox"
              name="comissionamentoProjetos"
              id="comissionamentoProjetos"
            />
            <label className="ml-2" htmlFor="comissionamentoProjetos">
              OK
            </label>
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center justify-center">
        {msg && <p className="mt-1 text-center text-green-400">{msg}</p>}
        <button
          onClick={handleChanges}
          className={`font-bold ${
            !info.comissionamento?.projetos && changes['comissionamento.projetos']
              ? 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
              : 'border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white'
          } rounded p-2`}
        >
          {!info.comissionamento?.projetos && changes['comissionamento.projetos'] ? 'FINALIZAR' : 'SALVAR'}
        </button>
      </div>
    </div>
  )
}

export default ComissionamentoCard
