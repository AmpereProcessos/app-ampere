import React, { useState } from 'react'
import SelectFloatingInput from './SelectFloatingInput'
import NumberFloatingInput from './NumberFloatingInput'

function FormSolicitacaoDadosEstruturaMontagemDesmontagem({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState('')
  function validarCamposObrigatorios() {
    if (dados.tipoEstrutura == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o tipo da estrutura')
      return false
    }
    if (dados.tipoEstruturaRemontagem == null || dados.tipoEstruturaRemontagem == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha o tipo da estrutura do novo local.')
      return false
    }

    if (!dados.materialEstrutura || dados.materialEstrutura == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha sobre o material da estrutura.')
      return false
    }
    if (!dados.materialEstruturaRemontagem || dados.materialEstruturaRemontagem == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha sobre o material da estrutura do novo local.')
      return false
    }

    if (dados.estruturaAmpere == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha sobre a necessidade de adequações ou construção de estrutura.')
      return false
    }
    if (dados.estruturaAmpere == 'SIM' && dados.responsavelEstrutura == 'NÃO SE APLICA') {
      setMessage('Por favor, preencha o responsável pela estrutura.')
      return false
    }
    if (dados.responsavelEstrutura != 'NÃO SE APLICA' && dados.formaPagamentoEstrutura == 'NÃO DEFINIDO') {
      setMessage('Por favor, preencha uma forma de pagamento válida.')
      return false
    }
    if (dados.responsavelEstrutura != 'NÃO SE APLICA' && (dados.valorEstrutura == null || dados.valorEstrutura == 0)) {
      setMessage('Por favor, preencha o valor da estrutura')
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
  return (
    <div className="bg-background flex w-full flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="py-2 text-center text-sm font-bold text-[#15599a] uppercase">ESTRUTURA DE MONTAGEM</span>
      <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <SelectFloatingInput
            width={'450px'}
            label={'TIPO DA ESTRUTURA'}
            editable={true}
            options={[
              {
                label: 'TELHADO',
                value: 'TELHADO',
              },
              {
                label: 'CARPORT',
                value: 'CARPORT',
              },
              {
                label: 'SOLO',
                value: 'SOLO',
              },
              {
                label: 'ESTRUTURA PERSONALIZADA',
                value: 'ESTRUTURA PERSONALIZADA',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
            value={dados.tipoEstrutura}
            handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
          />
          <SelectFloatingInput
            width={'450px'}
            label={'TIPO DA ESTRUTURA (REMONTAGEM)'}
            editable={true}
            options={[
              {
                label: 'MESMA ESTRUTURA',
                value: 'MESMA ESTRUTURA',
              },
              {
                label: 'TELHADO',
                value: 'TELHADO',
              },
              {
                label: 'CARPORT',
                value: 'CARPORT',
              },
              {
                label: 'SOLO',
                value: 'SOLO',
              },
              {
                label: 'ESTRUTURA PERSONALIZADA',
                value: 'ESTRUTURA PERSONALIZADA',
              },
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
            value={dados.tipoEstruturaRemontagem ? dados.tipoEstruturaRemontagem : 'NÃO DEFINIDO'}
            handleChange={(value) => setDados({ ...dados, tipoEstruturaRemontagem: value })}
          />
        </div>
        <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
          <SelectFloatingInput
            label={'MATERIAL DA ESTRUTURA'}
            width={'450px'}
            editable={true}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'MADEIRA', value: 'MADEIRA' },
              { label: 'FERRO', value: 'FERRO' },
            ]}
            value={dados.materialEstrutura ? dados.materialEstrutura : 'NÃO DEFINIDO'}
            handleChange={(value) => setDados({ ...dados, materialEstrutura: value })}
          />
          <SelectFloatingInput
            label={'MATERIAL DA ESTRUTURA (REMONTAGEM)'}
            width={'450px'}
            editable={true}
            options={[
              { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' },
              { label: 'MESMO MATERIAL', value: 'MESMO MATERIAL' },
              { label: 'MADEIRA', value: 'MADEIRA' },
              { label: 'FERRO', value: 'FERRO' },
            ]}
            value={dados.materialEstruturaRemontagem ? dados.materialEstruturaRemontagem : 'NÃO DEFINIDO'}
            handleChange={(value) => setDados({ ...dados, materialEstruturaRemontagem: value })}
          />
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <SelectFloatingInput
            label={'ADEQUAÇÃO OU CONSTRUÇÃO DE ESTRUTURA (REMONTAGEM)?'}
            width={'450px'}
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
              {
                label: 'NÃO DEFINIDO',
                value: 'NÃO DEFINIDO',
              },
            ]}
            value={dados.estruturaAmpere}
            handleChange={(value) => setDados({ ...dados, estruturaAmpere: value })}
          />
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <SelectFloatingInput
            width={'450px'}
            label={'RESPONSÁVEL PELAS ADEQUAÇÕES DE ESTRUTURA'}
            editable={true}
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
            value={dados.responsavelEstrutura}
            handleChange={(value) => setDados({ ...dados, responsavelEstrutura: value })}
          />
        </div>

        {dados.responsavelEstrutura != 'NÃO SE APLICA' && (
          <>
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">PAGAMENTO DA ESTRUTURA</h1>
            <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
              <SelectFloatingInput
                width={'450px'}
                label={'FORMA DE PAGAMENTO'}
                editable={true}
                options={[
                  {
                    label: 'INCLUSO NO FINANCIAMENTO',
                    value: 'INCLUSO NO FINANCIAMENTO',
                  },
                  {
                    label: 'DIRETO PRO FORNECEDOR',
                    value: 'DIRETO PRO FORNECEDOR',
                  },
                  {
                    label: 'A VISTA PARA AMPÈRE',
                    value: 'A VISTA PARA AMPÈRE',
                  },
                  {
                    label: 'NÃO SE APLICA',
                    value: 'NÃO SE APLICA',
                  },
                  {
                    label: 'NÃO DEFINIDO',
                    value: 'NÃO DEFINIDO',
                  },
                ]}
                value={dados.formaPagamentoEstrutura}
                handleChange={(value) => setDados({ ...dados, formaPagamentoEstrutura: value })}
              />
              <NumberFloatingInput
                width={'450px'}
                label={'VALOR DA ESTRUTURA'}
                editable={true}
                value={dados.valorEstrutura}
                handleChange={(value) => setDados({ ...dados, valorEstrutura: Number(value) })}
              />
            </div>
          </>
        )}
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

export default FormSolicitacaoDadosEstruturaMontagemDesmontagem
