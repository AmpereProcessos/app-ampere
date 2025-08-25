import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../utils/images/logo-texto-azul-vertical.png'
import { projetistas, projetosSolicitations } from '../../utils/constants'
import axios from 'axios'
import Link from 'next/link'
function ChamadosPPS() {
  const [responsavel, setResponsavel] = useState('A DEFINIR')
  const [projeto, setProjeto] = useState('')
  const [tipoDoChamado, setTipoDoChamado] = useState(projetosSolicitations[0])
  const [observacoes, setObservacoes] = useState('')
  const [callCreatedMessage, setCreatedMessage] = useState('')
  const [errorsMessage, setErrorMessage] = useState({
    errorSvbCode: '',
    errorDesc: '',
  })
  function checkObligatoryFields() {
    if (svbCode == 0) {
      setErrorMessage({ ...errorsMessage, errorSvbCode: 'NÚMERO INVÁLIDO' })
    } else if (solicitationDesc.trim().length == 0) {
      setSolicitationDesc({
        ...errorsMessage,
        errorsMessage: 'Por favor, descreva a solicitações com mais palavras.',
      })
    } else {
      return true
    }
  }
  function resetFields() {
    setResponsavel('A DEFINIR')
    setProjeto('')
    setTipoDoChamado(projetosSolicitations[0])
    setObservacoes('')
  }
  async function handleOpenCall() {
    let obj = {
      responsavel: responsavel,
      projeto: projeto,
      observacoes: observacoes,
      tipoDoChamado: tipoDoChamado,
    }
    axios.post('/api/chamados/projetos/mainData', obj).then((res) => {
      setCreatedMessage(res.data)
      resetFields()
    })
  }
  console.log(responsavel, projeto, observacoes, tipoDoChamado)
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#15599a]">
      <div className="bg-background flex flex-col rounded p-4">
        <Link href="/calls/chamadosProjetos">
          <div className="flex h-[80px] w-[80px] items-center self-center">
            <Image src={Logo} />
          </div>
        </Link>
        <h1 className="font-raleway text-center text-lg font-bold text-[#fead61] uppercase">ABERTURA DE CHAMADO</h1>
        <div className="border-primary/20 mt-4 flex flex-col gap-x-2 border p-2 lg:flex-row">
          <span className="text-center font-bold">ANALISTA:</span>
          <select
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            className="mt-2 grow text-center text-xs outline-hidden lg:mt-0"
          >
            {projetistas.map((projetista) => (
              <option key={projetista.nome} value={projetista.nome}>
                {projetista.label}
              </option>
            ))}
            <option value={'A DEFINIR'}>A DEFINIR</option>
          </select>
        </div>
        <div className={`border-primary/20 mt-4 flex flex-col gap-x-2 border p-2`}>
          <span className="text-center font-bold">NOME DO PROJETO:</span>
          <input
            value={projeto}
            onChange={(e) => setProjeto(e.target.value)}
            placeholder={'Digite aqui o nome do projeto...'}
            className="grow text-center text-sm outline-hidden placeholder:italic"
            type="text"
          />
        </div>
        <div className="border-primary/20 mt-4 flex flex-col gap-x-2 border p-2">
          <span className="text-center font-bold">TIPO DE SOLICITAÇÃO</span>
          <select
            value={tipoDoChamado}
            onChange={(e) => setTipoDoChamado(e.target.value)}
            className="mt-2 text-center text-xs outline-hidden lg:mt-0"
          >
            {projetosSolicitations.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={`flex flex-col gap-x-2 border ${errorsMessage.errorDesc ? 'border-red-400' : 'border-primary/20'} mt-4 p-2`}>
          <span className="text-center font-bold">OBSERVAÇÕES:</span>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder={'Observações sobre a solicitação'}
            className="bg-primary/20 mt-1 h-fit min-h-[100px] grow resize-none rounded p-3 text-center text-sm outline-hidden placeholder:italic"
          />
        </div>
        {callCreatedMessage && <p className="mt-2 text-center font-bold text-green-500 italic">{callCreatedMessage}</p>}
        <div className="text-center">
          <button
            onClick={handleOpenCall}
            className="mt-2 w-fit rounded bg-[#15599a] p-2 font-bold text-white uppercase hover:bg-[#fead61] hover:text-[#15599a]"
          >
            Enviar chamado
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChamadosPPS
