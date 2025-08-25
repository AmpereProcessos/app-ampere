import React, { useState } from 'react'
import TextFloatingInput from './TextFloatingInput'
import SelectFloatingInput from './SelectFloatingInput'
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
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
  return cep
}
function FormSolicitacaoDadosPagamento({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState('')
  const [idemContrato, setIdemContrato] = useState('NÂO')
  function validarCamposObrigatorios() {
    if (dados.nomePagador.trim().length < 3) {
      setMessage('Por favor, preencha o nome do pagador.')
      return false
    }
    if (dados.contatoPagador.trim().length < 8) {
      setMessage('Por favor, preencha o contato do pagador.')
      return false
    }
    if (dados.cpf_cnpjNF.trim().length < 11) {
      setMessage('Por favor, preencha um CPF/CPNJ válido para NF')
      return false
    }
    if (dados.localEntrega == 'NÃO DEFINIDO' && dados.tipoDeServico != 'MONTAGEM E DESMONTAGEM') {
      setMessage('Por favor, preencha o local de entrega.')
      return false
    }
    if (dados.entregaIgualCobranca == 'NÃO DEFINIDO' && dados.tipoDeServico != 'MONTAGEM E DESMONTAGEM') {
      setMessage('Por favor, preencha se o endereço de entrega é igual ao de cobrança.')
      return false
    }
    if (dados.restricoesEntrega == 'NÃO DEFINIDO' && dados.tipoDeServico != 'MONTAGEM E DESMONTAGEM') {
      setMessage('Por favor, preencha as restrições para entrega.')
      return false
    }
    if (dados.valorContrato == null || dados.valorContrato == 0) {
      setMessage('Por favor, preencha o valor do contrato fotovoltaico.')
      return false
    }
    if (dados.origemRecurso == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha a origem do recurso.')
      return false
    }
    if (dados.formaDePagamento == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha a forma de pagamento.')
      return false
    }
    if (dados.origemRecurso == 'FINANCIAMENTO' && dados.credor == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o credor do financiamento.')
      return false
    }
    if (dados.origemRecurso == 'FINANCIAMENTO' && dados.credor == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o credor do financiamento.')
      return false
    }
    if (dados.origemRecurso == 'FINANCIAMENTO' && dados.nomeGerente.trim().length < 5) {
      setMessage('Por favor, preencha o nome do gerente.')
      return false
    }
    if (dados.origemRecurso == 'FINANCIAMENTO' && dados.contatoGerente.trim().length < 8) {
      setMessage('Por favor, preencha o contato do gerente.')
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
  function getIdemContrato() {
    setIdemContrato('SIM')
    setDados({
      ...dados,
      nomePagador: dados.nomeDoContrato,
      contatoPagador: dados.telefone,
      cpf_cnpjNF: dados.cpf_cnpj,
    })
  }
  console.log(dados.credor)
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">DADOS FINANCEIROS E NEGOCIAÇÃO</span>
      <div className="mt-2 flex justify-center p-2">
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
      <div className="mt-2 flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">DADOS DO PAGADOR</h1>
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
            label={'CPF/CNPJ PARA NF'}
            editable={true}
            value={dados.cpf_cnpjNF}
            handleChange={(value) => setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })}
          />
        </div>
      </div>
      <div className="flex flex-col p-2">
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">SOBRE N.F</h1>
        <div className="mt-2 flex flex-wrap justify-around gap-2">
          <SelectFloatingInput
            width={'450px'}
            label={'NECESSIDADE N.F ADIANTADA'}
            editable={true}
            value={dados.necessidadeNFAdiantada}
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
            handleChange={(value) => setDados({ ...dados, necessidadeNFAdiantada: value })}
          />
          <SelectFloatingInput
            width={'450px'}
            label={'NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?'}
            editable={true}
            value={dados.necessidaInscricaoRural}
            handleChange={(value) => setDados({ ...dados, necessidaInscricaoRural: value })}
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
          />
          {dados.necessidaInscricaoRural == 'SIM' && (
            <TextFloatingInput
              width={'450px'}
              label={'INSCRIÇÃO RURAL'}
              editable={true}
              value={dados.inscriçãoRural}
              handleChange={(value) => setDados({ ...dados, inscriçãoRural: value })}
            />
          )}
        </div>
      </div>
      {dados.tipoDeServico != 'MONTAGEM E DESMONTAGEM' ? (
        <div className="flex flex-col p-2">
          <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">SOBRE A ENTREGA</h1>
          <div className="mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-3">
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'LOCAL DE ENTREGA'}
                options={[
                  {
                    label: 'MESMO DO PROJETO',
                    value: 'MESMO DO PROJETO',
                  },
                  {
                    label: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                    value: 'LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)',
                  },
                  {
                    label: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                    value: 'ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
                editable={true}
                value={dados.localEntrega}
                handleChange={(value) => setDados({ ...dados, localEntrega: value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'END. ENTREGA IGUAL COBRANÇA?'}
                editable={true}
                value={dados.entregaIgualCobranca}
                handleChange={(value) => setDados({ ...dados, entregaIgualCobranca: value })}
                options={[
                  {
                    label: 'SIM',
                    value: 'SIM',
                  },
                  {
                    label: 'NÃO',
                    value: 'NÃO',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={'450px'}
                label={'HÁ RESTRIÇÕES PARA ENTREGA?'}
                editable={true}
                value={dados.restricoesEntrega}
                handleChange={(value) => setDados({ ...dados, restricoesEntrega: value })}
                options={[
                  {
                    label: 'SOMENTE HORARIO COMERCIAL',
                    value: 'SOMENTE HORARIO COMERCIAL',
                  },
                  {
                    label: 'NÃO HÁ RESTRIÇÕES',
                    value: 'NÃO HÁ RESTRIÇÕES',
                  },
                  {
                    label: 'CASA EM CONSTRUÇÃO',
                    value: 'CASA EM CONSTRUÇÃO',
                  },
                  {
                    label: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                    value: 'NÃO PODE RECEBER EM HORARIO COMERCIAL',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col p-2">
        <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">SOBRE O PAGAMENTO</h1>
        <div className="mt-2 flex flex-col gap-2 lg:grid lg:grid-cols-3">
          <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
            <NumberFloatingInput
              width={'450px'}
              label={'VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)'}
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
          <div className="flex items-center justify-center">
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
          </div>
          <div className="flex items-center justify-center">
            <NumberFloatingInput
              width={'450px'}
              label={'VALOR DA PARCELA'}
              editable={true}
              value={dados.valorParcela}
              tag={'R$'}
              handleChange={(value) => setDados({ ...dados, valorParcela: Number(value) })}
            />
          </div>
          <div className="flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'NECESSIDADE CÓDIGO FINAME?'}
              editable={true}
              value={dados.necessidadeCodigoFiname}
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
              handleChange={(value) => setDados({ ...dados, necessidadeCodigoFiname: value })}
            />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <SelectFloatingInput
              width={'450px'}
              label={'FORMA DE PAGAMENTO'}
              editable={true}
              options={
                dados.tipoDeServico == 'SISTEMA FOTOVOLTAICO (OFF GRID)'
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

export default FormSolicitacaoDadosPagamento
