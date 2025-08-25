import React, { useState } from 'react'
import SelectFloatingInput from './SelectFloatingInput'
import TextFloatingInput from './TextFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'
import { credores } from '../utils/constants'

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

function FormSolicitacaoPagamentoOeM({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState('')
  const [idemContrato, setIdemContrato] = useState('NÂO')
  function getIdemContrato() {
    setIdemContrato('SIM')
    setDados({
      ...dados,
      nomePagador: dados.nomeDoContrato,
      contatoPagador: dados.telefone,
      cpf_cnpjNF: dados.cpf_cnpj,
    })
  }
  function validateCamposObrigatorios() {
    if (!dados.planoOeM || dados.planoOeM == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o plano de operação e manutenção.')
      return false
    }
    if (dados.nomePagador?.trim().length < 5) {
      setMessage('Por favor, preencha o nome do pagador.')
      return false
    }
    if (dados.contatoPagador?.trim().length < 8) {
      setMessage('Por favor, preencha o contato do pagador.')
      return false
    }
    if (!dados.valorContrato || dados.valorContrato == 0) {
      setMessage('Por favor, preencha um valor válido pro contrato.')
      return false
    }
    if (!dados.origemRecurso || dados.origemRecurso == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha a origem do recurso')
      return false
    }
    if (!dados.formaDePagamento || dados.formaDePagamento == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha a forma de pagamento.')
      return false
    }
    setMessage('')
    return true
  }
  function proximaEtapa() {
    if (validateCamposObrigatorios()) {
      avancar()
    }
  }
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DADOS DO OEM E PAGAMENTO</span>
      <div className="mt-2 flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
        <div className="col-span-3 flex items-center justify-center">
          <SelectFloatingInput
            label={'PLANO/SERVIÇO'}
            editable={true}
            value={dados.planoOeM}
            options={[
              {
                label: 'MANUTENÇÃO SIMPLES',
                value: 'MANUTENÇÃO SIMPLES',
              },
              {
                label: 'PLANO SOL',
                value: 'PLANO SOL',
              },
              {
                label: 'PLANO SOL +',
                value: 'PLANO SOL +',
              },
              {
                label: 'NÃO SE APLICA',
                value: 'NÃO SE APLICA',
              },
            ]}
            handleChange={(value) => setDados({ ...dados, planoOeM: value })}
          />
        </div>
        <div className="col-span-3 mt-2 flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
          <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">DADOS DO PAGADOR</h1>
          <div className="col-span-3 mt-2 flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'IDEM CONTRATO?'}
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
              value={idemContrato}
              handleChange={(value) => {
                if (value == 'SIM') {
                  getIdemContrato()
                } else setIdemContrato(value)
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'NOME DO PAGADOR'}
              editable={true}
              value={dados.nomePagador}
              handleChange={(value) => setDados({ ...dados, nomePagador: value })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'CONTATO DO PAGADOR'}
              editable={true}
              value={dados.contatoPagador}
              handleChange={(value) => setDados({ ...dados, contatoPagador: phoneMask(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={'450px'}
              label={'CPF/CNPJ PARA NF (em caso de emissão)'}
              editable={true}
              value={dados.cpf_cnpjNF}
              handleChange={(value) => setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })}
            />
          </div>
        </div>
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">DADOS DO PAGAMENTO</h1>
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <NumberFloatingInput
            width={'450px'}
            label={'VALOR DO CONTRATO(SEM CUSTOS ADICIONAIS)'}
            editable={true}
            tag={'R$'}
            value={dados.valorContrato}
            handleChange={(value) => setDados({ ...dados, valorContrato: Number(value) })}
          />
          <SelectFloatingInput
            width={'450px'}
            label={'ORIGEM DO RECURSO'}
            editable={true}
            value={dados.origemRecurso}
            handleChange={(value) => setDados({ ...dados, origemRecurso: value })}
            options={[
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
              {
                label: 'FINANCIAMENTO',
                value: 'FINANCIAMENTO',
              },
              {
                label: 'CAPITAL PRÓPRIO',
                value: 'CAPITAL PRÓPRIO',
              },
            ]}
          />
        </div>
        {dados.origemRecurso == 'FINANCIAMENTO' && (
          <div className="col-span-3 mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-3">
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'CREDOR'}
                editable={true}
                options={credores.map((credor) => credor)}
                value={dados.credor}
                handleChange={(value) => setDados({ ...dados, credor: value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                width={'450px'}
                label={'NOME DO GERENTE'}
                editable={true}
                value={dados.nomeGerente}
                handleChange={(value) => setDados({ ...dados, nomeGerente: value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                width={'450px'}
                label={'CONTATO DO GERENTE'}
                editable={true}
                value={dados.contatoGerente}
                handleChange={(value) => setDados({ ...dados, contatoGerente: phoneMask(value) })}
              />
            </div>
          </div>
        )}
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <NumberFloatingInput
            width={'450px'}
            label={'SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?'}
            editable={true}
            value={dados.numParcelas}
            handleChange={(value) =>
              setDados({
                ...dados,
                numParcelas: Number(value),
                valorParcela: dados.valorContrato / Number(value),
              })
            }
          />
          <NumberFloatingInput
            width={'450px'}
            label={'VALOR DA PARCELA'}
            editable={true}
            value={dados.valorParcela}
            tag={'R$'}
            handleChange={(value) => setDados({ ...dados, valorParcela: Number(value) })}
          />
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <SelectFloatingInput
            width={'450px'}
            label={'FORMA DE PAGAMENTO'}
            editable={true}
            options={
              dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)' || dados.tipoDeServico == 'OPERAÇÃO E MANUTENÇÃO'
                ? [
                    {
                      label: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                      value: '70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO',
                    },
                    {
                      label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                      value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                    },
                    {
                      label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                      value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                    },
                    {
                      label: 'NÃO DEFINIDO',
                      value: 'NÃO DEFINIDO',
                    },
                  ]
                : [
                    {
                      label: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                      value: '70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR',
                    },
                    {
                      label: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                      value: '100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO',
                    },
                    {
                      label: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                      value: 'NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)',
                    },
                    {
                      label: 'NÃO DEFINIDO',
                      value: 'NÃO DEFINIDO',
                    },
                  ]
            }
            value={dados.formaDePagamento}
            handleChange={(value) => setDados({ ...dados, formaDePagamento: value })}
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center self-center px-2">
        <span className="font-raleway text-center text-sm font-bold uppercase">DESCRIÇÃO DA NEGOCIAÇÃO</span>
        <textarea
          placeholder={'Descreva aqui a negociação'}
          value={dados.descricaoNegociacao}
          onChange={(e) =>
            setDados({
              ...dados,
              descricaoNegociacao: e.target.value,
            })
          }
          className="dark:border-primary/80 border-primary/20 dark:bg-primary/70 block h-[80px] w-full resize-none rounded-lg border bg-gray-50 p-2.5 text-center text-gray-900 outline-hidden focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
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

export default FormSolicitacaoPagamentoOeM
