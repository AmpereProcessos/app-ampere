import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../utils/whitelogo.png'
import { cities, sellers, ppsSolicitations, vendedores } from '../../utils/constants'
import axios from 'axios'
import Link from 'next/link'
import Select from 'react-select'
function ChamadosPPS() {
  const [vendedorName, setVendedorName] = useState(vendedores[0].nome)
  const [svbCode, setSvbCode] = useState(0)
  const [solicitationType, setSolicitationType] = useState(ppsSolicitations[0])
  const [solicitationDesc, setSolicitationDesc] = useState('')
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
    setSolicitationType(ppsSolicitations[0])
    setSvbCode(0)
    setSolicitationDesc('')
  }
  async function handleOpenCall() {
    let obj = {
      status: 'PENDENTE',
      vendedor: vendedorName,
      codigoDoProjeto: svbCode,
      observacoes: solicitationDesc,
      tipoDeSolicitacao: solicitationType,
      responsavel: 'A DEFINIR',
    }
    if (checkObligatoryFields()) {
      axios.post('/api/chamados/pps/mainData', obj).then((res) => {
        setCreatedMessage(res.data)
        resetFields()
      })
    }
  }

  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#15599a]">
      <div className="flex flex-col bg-[#fff] p-4 rounded">
        <Link href="/calls/chamadosPPS">
          <div className="flex self-center items-center h-[80px] w-[80px]">
            <Image src={Logo} />
          </div>
        </Link>
        <h1 className="font-bold text-center font-raleway text-lg uppercase text-[#fead61]">ABERTURA DE CHAMADO</h1>
        <div className="flex items-center flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">VENDEDOR:</span>
          <div className="grow">
            <Select
              isMulti={false}
              placeholder="NOME DO CLIENTE"
              onChange={(e) => setVendedorName(e.value)}
              options={vendedores.map((vendedor) => {
                return {
                  label: vendedor.nome,
                  value: vendedor.nome,
                }
              })}
            />
          </div>
          {/**           <select
            value={vendedorName ? vendedorName : "NÃO DEFINIDO"}
            onChange={(e) => setVendedorName(e.target.value)}
            className="text-xs grow outline-none mt-2 lg:mt-0 text-center"
          >
            {vendedores.map((vendedor) => (
              <option value={vendedor.nome} key={vendedor.nome}>
                {vendedor.nome}
              </option>
            ))}
            <option value={"SETOR O&M"}>SETOR O&M</option>
            <option value={"SETOR PROJETOS"}>SETOR PROJETOS</option>
          </select>*/}
        </div>
        <div className={`flex flex-col lg:flex-row gap-x-2 border ${errorsMessage.errorSvbCode ? 'border-red-400' : 'border-gray-200'} p-2 mt-4`}>
          <span className="text-center font-bold">CÓDIGO SVB:</span>
          <input
            value={svbCode}
            onChange={(e) => setSvbCode(e.target.value)}
            className="outline-none text-sm text-center grow placeholder:italic"
            type="number"
          />
        </div>
        <div className="flex flex-col  gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">TIPO DE SOLICITAÇÃO</span>
          <select
            value={solicitationType}
            onChange={(e) => setSolicitationType(e.target.value)}
            className="text-xs outline-none mt-2 lg:mt-0 text-center"
          >
            {ppsSolicitations.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={`flex flex-col gap-x-2 border  ${errorsMessage.errorDesc ? 'border-red-400' : 'border-gray-200'}  p-2 mt-4`}>
          <span className="font-bold text-center">OBSERVAÇÕES:</span>
          <textarea
            value={solicitationDesc}
            onChange={(e) => setSolicitationDesc(e.target.value)}
            placeholder={'Observações sobre a solicitação'}
            className="outline-none placeholder:italic mt-1 rounded text-sm p-3 resize-none bg-gray-100 min-h-[100px] h-fit text-center grow"
          />
        </div>
        {callCreatedMessage && <p className="italic font-bold text-green-500 text-center mt-2">{callCreatedMessage}</p>}
        <div className="text-center">
          <button
            onClick={handleOpenCall}
            className="mt-2 bg-[#15599a] hover:bg-[#fead61] hover:text-[#15599a] text-white font-bold uppercase w-fit p-2 rounded"
          >
            Enviar chamado
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChamadosPPS
