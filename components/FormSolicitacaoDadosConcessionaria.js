import React, { useState } from 'react'
import TextFloatingInput from './TextFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import { AiOutlineSearch } from 'react-icons/ai'
import { cidadesAtendidas, vendedores } from '../utils/constants'
import axios from 'axios'
import SelectFoatingInput from './SelectFloatingInput'
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
function FormSolicitacaoDadosConcessionaria({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState('')
  async function findCPF(field) {
    axios.get(`https://viacep.com.br/ws/${dados.cepInstalacao.replace('-', '')}/json/`).then((res) => {
      if (res.data.erro) {
        return
      } else {
        setDados({
          ...dados,
          bairroInstalacao: res.data.bairro,
          cidadeInstalacao: cidadesAtendidas.includes(res.data.localidade.toUpperCase()) ? res.data.localidade.toUpperCase() : 'ITUIUTABA',
          enderecoInstalacao: res.data.logradouro,
          ufInstalacao: res.data.uf,
        })
      }
    })
  }
  function validarCamposObrigatorios() {
    if (dados.nomeTitularProjeto.trim().length < 5) {
      setMessage('Por favor, preencha um nome do titular válido.')
      return false
    }
    if (dados.tipoDoTitular == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o tipo do titular.')
      return false
    }
    if (dados.tipoDaLigacao == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o tipo da ligação.')
      return false
    }
    if (dados.tipoDaInstalacao == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o tipo da instalação.')
      return false
    }
    if (dados.cidadeInstalacao == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha uma cidade válida.')
      return false
    }
    if (dados.enderecoInstalacao.trim().length < 3) {
      setMessage('Por favor, preencha um endereço válido')
      return false
    }
    if (dados.bairroInstalacao.trim().length < 3) {
      setMessage('Por favor, preencha um bairro válido')
      return false
    }
    if (dados.numeroResInstalacao == null) {
      setMessage('Por favor, preencha o número da residência.')
      return false
    }
    if (dados.tipoDaLigacao == 'EXISTENTE' && (dados.numeroInstalacao == null || dados.numeroInstalacao.trim().length < 7)) {
      setMessage('Por favor, preencha um número de instalação válido.')
      return false
    }
    if (dados.tipoDaInstalacao == 'RURAL' && dados.longitude.trim().length < 6) {
      setMessage('Por favor, preencha uma longitude válida.')
      return false
    }
    if (dados.tipoDaInstalacao == 'RURAL' && dados.latitude.trim().length < 6) {
      setMessage('Por favor, preencha uma latitude válida.')
      return false
    }
    if (dados.potPico == null) {
      setMessage('Por favor, preencha uma potência pico válida.')
      return false
    }
    setMessage('')
    return true
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar()
    }
  }
  console.log(dados.numeroInstalacao)
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DADOS PARA ENTRADA NA CONCESSIONÁRIA</span>
      <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">INFORMAÇÕES DA INSTALAÇÃO DO CLIENTE</h1>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'NOME DO TITULAR DO PROJETO'}
            value={dados.nomeTitularProjeto}
            editable={true}
            handleChange={(value) =>
              setDados({
                ...dados,
                nomeTitularProjeto: value.toUpperCase(),
              })
            }
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={'TIPO DO TITULAR'}
            editable={true}
            value={dados.tipoDoTitular}
            handleChange={(value) => setDados({ ...dados, tipoDoTitular: value })}
            options={[
              {
                label: 'PESSOA FISICA',
                value: 'PESSOA FISICA',
              },
              {
                label: 'PESSOA JURIDICA',
                value: 'PESSOA JURIDICA',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={'TIPO DA LIGAÇÃO'}
            editable={true}
            value={dados.tipoDaLigacao}
            handleChange={(value) => setDados({ ...dados, tipoDaLigacao: value })}
            options={[
              {
                label: 'NOVA',
                value: 'NOVA',
              },
              {
                label: 'EXISTENTE',
                value: 'EXISTENTE',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <SelectFoatingInput
            label={'TIPO DA INSTALAÇÃO'}
            editable={true}
            value={dados.tipoDaInstalacao}
            handleChange={(value) => setDados({ ...dados, tipoDaInstalacao: value })}
            options={[
              {
                label: 'RURAL',
                value: 'RURAL',
              },
              {
                label: 'URBANO',
                value: 'URBANO',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
          />
        </div>
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">ENDEREÇO DA INSTALAÇÃO</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-2">
          <TextFloatingInput
            editable={true}
            label={'CEP INSTALAÇÃO'}
            value={dados.cepInstalacao}
            handleChange={(value) => setDados({ ...dados, cepInstalacao: formatCEP(value) })}
          />
          <button onClick={() => findCPF('enderecoInstalacao')} className="flex h-[30px] items-center rounded bg-[#fead61] p-1">
            <AiOutlineSearch />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'ENDEREÇO DE INSTALAÇÃO'}
            editable={true}
            value={dados.enderecoInstalacao}
            handleChange={(value) => setDados({ ...dados, enderecoInstalacao: value.toUpperCase() })}
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'Nº'}
            editable={true}
            value={dados.numeroResInstalacao}
            handleChange={(value) => setDados({ ...dados, numeroResInstalacao: value })}
          />
        </div>
        <div className="flex items-center justify-center">
          <NumberFloatingInput
            label={'Nº DA INSTALAÇÃO'}
            editable={true}
            value={dados.numeroInstalacao}
            handleChange={(value) => setDados({ ...dados, numeroInstalacao: value })}
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'BAIRRO'}
            editable={true}
            value={dados.bairroInstalacao}
            handleChange={(value) => setDados({ ...dados, bairroInstalacao: value.toUpperCase() })}
          />
        </div>
        <div className="flex items-center justify-center">
          <SelectFoatingInput
            label={'CIDADE'}
            editable={true}
            value={dados.cidadeInstalacao}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              ...cidadesAtendidas.map((cidade) => {
                return { label: cidade, value: cidade }
              }),
            ]}
            handleChange={(value) => setDados({ ...dados, cidadeInstalacao: value })}
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'UF'}
            editable={true}
            value={dados.ufInstalacao}
            handleChange={(value) => setDados({ ...dados, ufInstalacao: value })}
          />
        </div>
        <div className="flex items-center justify-center">
          <TextFloatingInput
            label={'PONTO DE REFERÊNCIA'}
            editable={true}
            value={dados.pontoDeReferenciaInstalacao}
            handleChange={(value) => setDados({ ...dados, pontoDeReferenciaInstalacao: value })}
          />
        </div>
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <TextFloatingInput
            label={'LATITUDE'}
            value={dados.latitude}
            editable={true}
            handleChange={(value) => setDados({ ...dados, latitude: value })}
          />
          <TextFloatingInput
            label={'LONGITUDE'}
            editable={true}
            value={dados.longitude}
            handleChange={(value) => setDados({ ...dados, longitude: value })}
          />
        </div>

        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">INFORMAÇÕES DA CONTA DE CEMIG ATENDE</h1>
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <TextFloatingInput
            label={'LOGIN(CEMIG ATENDE)'}
            editable={true}
            normalCase={true}
            value={dados.loginCemigAtende}
            handleChange={(value) => setDados({ ...dados, loginCemigAtende: value })}
          />
          <TextFloatingInput
            label={'SENHA(CEMIG ATENDE)'}
            normalCase={true}
            editable={true}
            value={dados.senhaCemigAtende}
            handleChange={(value) => setDados({ ...dados, senhaCemigAtende: value })}
          />
        </div>
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">DADOS DO SISTEMA</h1>
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <NumberFloatingInput
            label={'POTÊNCIA PICO'}
            editable={true}
            value={dados.potPico}
            handleChange={(value) =>
              setDados({
                ...dados,
                potPico: Number(value),
                geracaoPrevista: Number(value) * 126,
              })
            }
          />
          <NumberFloatingInput
            label={'GERAÇÃO PREVISTA'}
            editable={true}
            value={dados.geracaoPrevista}
            handleChange={(value) => setDados({ ...dados, geracaoPrevista: Number(value) })}
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

export default FormSolicitacaoDadosConcessionaria
