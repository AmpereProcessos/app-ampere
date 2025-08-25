import React, { useState } from 'react'
import TextFloatingInput from './TextFloatingInput'
const phoneMask = (value) => {
  if (!value) return ''
  value = value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  return value
}
function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
}
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
  return cep
}
function FormSolicitacaoDadosContato({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState('')
  function validarCamposObrigatorios() {
    if (dados.nomeContatoJornadaUm.trim().length < 6) {
      setMessage('Por favor, preencha o nome do contato primário')
      return false
    }
    if (dados.telefoneContatoUm.trim().length < 9) {
      setMessage('Por favor, preencha o telefone do contato primário')
      return false
    }
    return true
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DADOS PARA CONTATO</span>
      <div className="flex flex-wrap justify-around gap-2 p-2">
        <TextFloatingInput
          label={'NOME DO CONTATO 1'}
          editable={true}
          value={dados.nomeContatoJornadaUm}
          handleChange={(value) => setDados({ ...dados, nomeContatoJornadaUm: value.toUpperCase() })}
        />
        <TextFloatingInput
          label={'TELEFONE DO CONTATO 1'}
          editable={true}
          value={dados.telefoneContatoUm}
          handleChange={(value) => setDados({ ...dados, telefoneContatoUm: phoneMask(value) })}
        />
        <TextFloatingInput
          label={'NOME DO CONTATO 2'}
          editable={true}
          value={dados.nomeContatoJornadaDois}
          handleChange={(value) => setDados({ ...dados, nomeContatoJornadaDois: value.toUpperCase() })}
        />
        <TextFloatingInput
          label={'TELEFONE DO CONTATO 2'}
          editable={true}
          value={dados.telefoneContatoDois}
          handleChange={(value) => setDados({ ...dados, telefoneContatoDois: phoneMask(value) })}
        />
        <div className="mt-2 flex w-full flex-col items-center self-center px-2">
          <span className="font-raleway text-center text-sm font-bold uppercase">CUIDADOS PARA CONTATO COM O CLIENTE</span>
          <textarea
            placeholder={
              'Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc...'
            }
            value={dados.cuidadosContatoJornada}
            onChange={(e) =>
              setDados({
                ...dados,
                cuidadosContatoJornada: e.target.value,
              })
            }
            className="dark:border-primary/80 border-primary/20 dark:bg-primary/70 block h-[80px] w-full resize-none rounded-lg border bg-gray-50 p-2.5 text-center text-gray-900 outline-hidden focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
        </div>
      </div>
      {message && <p className="text-center text-red-400 italic">{message}</p>}
      <div className="mt-2 flex w-full flex-wrap justify-center gap-2">
        <button onClick={voltar} className="rounded bg-[#15599a] p-2 font-bold text-white">
          VOLTAR
        </button>
        <button onClick={proximaEtapa} className="w-fit rounded bg-[#fead61] p-2 text-center font-bold hover:bg-[#15599a] hover:text-white">
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  )
}

export default FormSolicitacaoDadosContato
