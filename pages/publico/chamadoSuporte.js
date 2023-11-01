import Image from 'next/image'
import React, { useState } from 'react'
import Logo from '../../utils/images/logo-texto-azul-vertical.png'
import { cities } from '../../utils/constants'
import axios from 'axios'
function ChamadoSuporte() {
  const [clientName, setClientName] = useState('')
  const [clientCity, setClientCity] = useState(cities[0].name)
  const [cpfCnpj, setCpfCnpj] = useState('')
  const [problemType, setProblemType] = useState('DÚVIDA COM GERAÇÃO')
  const [problemDesc, setProblemDesc] = useState('')
  const [errorsMessage, setErrorsMessage] = useState({
    clientNameMessage: '',
    cpfCnpjMessage: '',
    problemDescMessage: '',
  })
  const [callCreatedMessage, setCreatedMessage] = useState('')
  function resetFields() {
    setClientName('')
    setClientCity(cities[0].name)
    setCpfCnpj('')
    setProblemType('DÚVIDA COM GERAÇÃO')
    setProblemDesc('')
  }
  function checkObligatoryFields() {
    if (clientName.trim().length == 0) {
      setErrorsMessage({
        ...errorsMessage,
        clientNameMessage: 'PREENCHIMENTO OBRIGATÓRIO',
      })
      setClientName('')
    } else if (cpfCnpj.trim().length < 11) {
      setErrorsMessage({
        ...errorsMessage,
        cpfCnpjMessage: 'PREENCHIMENTO INVÁLIDO',
      })
      setCpfCnpj('')
    } else if (problemDesc.trim().length == 0) {
      setErrorsMessage({
        ...errorsMessage,
        problemDescMessage: 'PREENCHIMENTO OBRIGATÓRIO.',
      })
      setProblemDesc('')
    } else {
      return true
    }
  }
  async function handleOpenCall() {
    if (checkObligatoryFields()) {
      axios
        .post('/api/chamados/suporte/mainData', {
          clientName: clientName,
          clientCity: clientCity,
          cpfCnpj: cpfCnpj,
          problemType: problemType,
          problemDesc: problemDesc,
          demanda: 'EXTERNA',
        })
        .then((res) => console.log(res.data))
      setErrorsMessage({
        clientNameMessage: '',
        cpfCnpjMessage: '',
        problemDescMessage: '',
      })
      resetFields()
      setCreatedMessage('CHAMADO CRIADO!')
    }
  }
  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#15599a]">
      <div className="flex flex-col bg-[#fff] p-4 rounded">
        <div className="flex self-center items-center h-[80px] w-[80px]">
          <Image src={Logo} />
        </div>
        <h1 className="font-bold text-center font-raleway text-lg uppercase text-[#fead61]">ABERTURA DE CHAMADO</h1>
        <div
          className={`flex flex-col lg:flex-row gap-x-2 border ${errorsMessage.clientNameMessage ? 'border-red-400' : 'border-gray-200'}  p-2 mt-4`}
        >
          <span className="text-center font-bold">NOME:</span>
          <input
            className="outline-none text-sm text-center grow placeholder:italic"
            type="text"
            value={clientName}
            placeholder={errorsMessage.clientNameMessage ? errorsMessage.clientNameMessage : 'Nome do titular do contrato'}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">CIDADE:</span>
          <select value={clientCity} onChange={(e) => setClientCity(e.target.value)} className="text-xs grow outline-none mt-2 lg:mt-0 text-center">
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`flex flex-col lg:flex-row gap-x-2 border ${errorsMessage.cpfCnpjMessage ? 'border-red-400' : 'border-gray-200'} p-2 mt-4`}>
          <span className="text-center font-bold">CPF/CNPJ:</span>
          <input
            className="outline-none text-sm text-center grow placeholder:italic"
            type="text"
            value={cpfCnpj}
            placeholder={errorsMessage.cpfCnpjMessage ? errorsMessage.cpfCnpjMessage : 'CPF/CNPJ do titular do contrato'}
            onChange={(e) => setCpfCnpj(e.target.value)}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-x-2 border border-gray-200 p-2 mt-4">
          <span className="text-center font-bold">TIPO DE PROBLEMA</span>
          <select value={problemType} onChange={(e) => setProblemType(e.target.value)} className="text-xs outline-none mt-2 lg:mt-0 text-center">
            <option value={'DÚVIDA COM GERAÇÃO'}>DÚVIDA COM GERAÇÃO</option>
            <option value={'DÚVIDA COM APLICATIVO'}>DÚVIDA COM APLICATIVO</option>
            <option value={'DÚVIDA COM CONTA DE ENERGIA'}>DÚVIDA COM CONTA DE ENERGIA</option>
            <option value={'PROBLEMA COM PLACA'}>PROBLEMA COM PLACA</option>
            <option value={'PROBLEMA COM INVERSOR/MICRO'}>PROBLEMA COM INVERSOR/MICRO</option>
            <option value={'OUTROS'}>OUTROS</option>
          </select>
        </div>
        <div className={`flex flex-col gap-x-2 ${errorsMessage.problemDescMessage ? 'border border-red-400' : 'border border-gray-200'}  p-2 mt-4`}>
          <span className="font-bold text-center">DESCRIÇÃO DO PROBLEMA:</span>
          <textarea
            value={problemDesc}
            onChange={(e) => setProblemDesc(e.target.value)}
            placeholder={errorsMessage.problemDescMessage ? errorsMessage.problemDescMessage : 'Descrição da situação problema'}
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

export default ChamadoSuporte
