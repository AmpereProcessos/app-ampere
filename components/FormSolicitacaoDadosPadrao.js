import React, { useState } from 'react'
import TextInput from './TextInput'
import SelectFloatingInput from './SelectFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import { tiposDePadrao } from '../utils/constants'
function FormSolicitacaoDadosPadrao({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState('')
  function validarCamposObrigatorios() {
    if (dados.aumentoDeCarga == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha se há aumento de carga.')
      return false
    }
    if (dados.aumentoDeCarga == 'SIM') {
      if (dados.caixaConjugada == 'NÃO DEFINIDO') {
        setMessage('Por favor, preencha se há caixa conjugada.')
        return false
      }
      if (dados.tipoDePadrao == 'NÃO DEFINIDO') {
        setMessage('Por favor, preencha o tipo de padrão.')
        return false
      }
      if (dados.respTrocaPadrao == 'NÃO SE APLICA' && dados.aumentoDeCarga == 'SIM') {
        setMessage('Por favor, preencha o responsável pela troca do padrão.')
        return false
      }
      if (dados.formaPagamentoPadrao == 'NÃO SE APLICA' && dados.aumentoDeCarga == 'SIM') {
        setMessage('Por favor, preencha a forma de pagamento do padrão.')
        return false
      }
      if (dados.valorPadrao == null && dados.aumentoDeCarga == 'SIM') {
        setMessage('Por favor, preencha o valor do padrão.')
        return false
      }
      setMessage('')
      return true
    } else {
      setMessage('')
      return true
    }
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">AUMENTO DE CARGA</span>
      <div className="mt-2 flex justify-center p-2">
        <SelectFloatingInput
          width={'450px'}
          label={'HAVERÁ TROCA DE PADRÃO/AUMENTO DE CARGA?'}
          editable={true}
          options={[
            {
              label: 'NÃO DEFINIDO',
              value: 'NÃO DEFINIDO',
            },
            {
              label: 'NÃO',
              value: 'NÃO',
            },
            {
              label: 'SIM',
              value: 'SIM',
            },
          ]}
          value={dados.aumentoDeCarga}
          handleChange={(value) => setDados({ ...dados, aumentoDeCarga: value })}
        />
      </div>
      {dados.aumentoDeCarga == 'SIM' && (
        <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'TIPO DO PADRÃO'}
              editable={true}
              value={dados.tipoDePadrao}
              handleChange={(value) => setDados({ ...dados, tipoDePadrao: value })}
              options={tiposDePadrao}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'HAVERÁ AUMENTO DO DISJUNTOR?'}
              editable={true}
              value={dados.aumentoDisjuntor}
              handleChange={(value) => setDados({ ...dados, aumentoDisjuntor: value })}
              options={[
                {
                  label: 'SIM',
                  value: 'SIM',
                },
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
              ]}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'CAIXA CONJUGADA?'}
              editable={true}
              options={[
                {
                  label: 'NÃO DEFINIDO',
                  value: 'NÃO DEFINIDO',
                },
                {
                  label: 'NÃO',
                  value: 'NÃO',
                },
                {
                  label: 'SIM',
                  value: 'SIM',
                },
              ]}
              value={dados.caixaConjugada}
              handleChange={(value) => setDados({ ...dados, caixaConjugada: value })}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'RESPONSÁVEL PELA TROCA'}
              editable={true}
              value={dados.respTrocaPadrao}
              handleChange={(value) => setDados({ ...dados, respTrocaPadrao: value })}
              options={[
                {
                  label: 'AMPERE',
                  value: 'AMPERE',
                },
                {
                  label: 'CLIENTE',
                  value: 'CLIENTE',
                },
                {
                  label: 'NÃO SE APLICA',
                  value: 'NÃO SE APLICA',
                },
              ]}
            />
          </div>
          <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">PAGAMENTO</h1>
          <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
            <SelectFloatingInput
              width={'450px'}
              label={'PAGAMENTO DO PADRÃO'}
              editable={true}
              value={dados.formaPagamentoPadrao ? dados.formaPagamentoPadrao : 'NÃO HAVERA TROCA PADRÃO'}
              options={[
                {
                  label: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                  value: 'CLIENTE IRÁ COMPRAR EM SEPARADO',
                },
                {
                  label: 'CLIENTE PAGAR POR FORA',
                  value: 'CLIENTE PAGAR POR FORA',
                },
                {
                  label: 'INCLUSO NO CONTRATO',
                  value: 'INCLUSO NO CONTRATO',
                },
                {
                  label: 'NÃO HAVERA TROCA PADRÃO',
                  value: 'NÃO HAVERA TROCA PADRÃO',
                },
              ]}
              handleChange={(value) => {
                setDados({ ...dados, formaPagamentoPadrao: value })
              }}
            />
            <NumberFloatingInput
              width={'450px'}
              label={'VALOR DO PADRÃO'}
              editable={true}
              value={dados.valorPadrao}
              handleChange={(value) => setDados({ ...dados, valorPadrao: Number(value) })}
            />
          </div>
        </div>
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

export default FormSolicitacaoDadosPadrao
