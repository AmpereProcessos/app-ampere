import React, { useState } from 'react'
import TextFloatingInput from './TextFloatingInput'
import SelectFloatingInput from './SelectFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import { FiDelete } from 'react-icons/fi'
function FormSolicitacaoDistribuicoesCredito({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState('')
  const [dadosDistribuicao, setDadosDistribuicao] = useState({
    numInstalacao: '',
    excedente: null,
  })
  function adicionarDistribuicao() {
    var distArr = dados.distribuicoes ? dados.distribuicoes : []
    distArr.push({
      numInstalacao: dadosDistribuicao.numInstalacao,
      excedente: dadosDistribuicao.excedente,
    })
    setDados({
      ...dados,
      distribuicoes: distArr,
    })
    setDadosDistribuicao({ numInstalacao: '', excedente: 0 })
  }
  function validarCamposObrigatorios() {
    if (dados.possuiDistribuicao == 'SIM') {
      if (dados.distribuicoes.length <= 0) {
        setMessage('Por favor, especifique a distribuição.')
        return false
      }
    }
    setMessage('')
    return true
  }

  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DISTRIBUIÇÃO DE CRÉDITOS</span>
      <div className="mt-2 flex justify-center p-2">
        <SelectFloatingInput
          label={'POSSUI DISTRIBUIÇÕES DE CRÉDITOS?'}
          value={dados.possuiDistribuicao}
          editable={true}
          options={[
            {
              label: 'NÃO',
              value: 'NÃO',
            },
            {
              label: 'SIM',
              value: 'SIM',
            },
          ]}
          handleChange={(value) => setDados({ ...dados, possuiDistribuicao: value })}
        />
      </div>
      {dados.possuiDistribuicao == 'SIM' && (
        <>
          <div className="mt-2 flex flex-col gap-2 p-2">
            <h1 className="font-raleway text-center font-bold">ADICIONAR DISTRIBUIÇÃO:</h1>
            <div className="flex flex-col items-center justify-around lg:flex-row">
              <TextFloatingInput
                label={'Nº DA INSTALAÇÃO'}
                editable={true}
                value={dadosDistribuicao.numInstalacao}
                handleChange={(value) =>
                  setDadosDistribuicao({
                    ...dadosDistribuicao,
                    numInstalacao: value,
                  })
                }
              />
              <NumberFloatingInput
                label={'% EXCEDENTE'}
                editable={true}
                value={dadosDistribuicao.excedente}
                handleChange={(value) =>
                  setDadosDistribuicao({
                    ...dadosDistribuicao,
                    excedente: Number(value),
                  })
                }
                unit={'%'}
              />
              <button onClick={adicionarDistribuicao} className="rounded bg-[#fead61] p-1 font-bold hover:bg-[#15599a] hover:text-white">
                ADICIONAR
              </button>
            </div>
          </div>
          {dados.distribuicoes?.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {dados.distribuicoes.map((distribuicao, index) => (
                <div key={index} className="flex flex-wrap justify-around">
                  <p className="text-primary/80 text-sm font-bold">INSTALAÇÃO Nº{distribuicao.numInstalacao}</p>
                  <p className="text-primary/80 text-sm font-bold">{distribuicao.excedente}%</p>
                  <button
                    onClick={() => {
                      let distribuicoes = dados.distribuicoes
                      distribuicoes.splice(index, 1)
                      setDados({ ...dados, distribuicoes: distribuicoes })
                    }}
                    className="rounded bg-red-500 p-1"
                  >
                    <FiDelete />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
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

export default FormSolicitacaoDistribuicoesCredito
