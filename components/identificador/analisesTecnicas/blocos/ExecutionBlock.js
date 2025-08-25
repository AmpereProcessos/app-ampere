import React from 'react'

import CheckboxInput from '../../../inputs/Checkbox'
import TextInput from '../../../inputs/Text'

function ExecutionBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">INFORMAÇÕES DE EXECUÇÃO</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col">
          <h1 className="bg-primary/60 w-full rounded-tl-sm rounded-tr-sm p-1 text-center font-bold text-white">OBSERVAÇÕES</h1>
          <textarea
            placeholder="SEM OBSERVAÇÕES PREENCHIDAS..."
            value={infoHolder.execucao?.observacoes || ''}
            onChange={(e) => {
              setInfoHolder((prev) => ({
                ...prev,
                execucao: prev.execucao ? { ...prev.execucao, observacoes: e.target.value } : { observacoes: e.target.value, itens: [] },
              }))
              setChanges((prev) => ({ ...prev, 'execucao.observacoes': e.target.value }))
            }}
            className="text-primary/80 bg-primary/20 min-h-[80px] w-full resize-none rounded-br-sm rounded-bl-sm p-3 text-center text-xs font-medium outline-hidden"
          />
        </div>
        <div className="flex w-full items-center justify-center self-center lg:w-1/3">
          <CheckboxInput
            labelFalse="POSSUI ESPAÇO NO QGBT"
            labelTrue="POSSUI ESPAÇO NO QGBT"
            justify="justify-center"
            checked={infoHolder.execucao.espacoQGBT}
            handleChange={(value) => {
              setInfoHolder((prev) => ({ ...prev, execucao: { ...prev.execucao, espacoQGBT: value } }))
              setChanges((prev) => ({ ...prev, 'execucao.espacoQGBT': value }))
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label="LOCAL DE ATERRAMENTO"
              placeholder="Preencha o local de aterramento..."
              value={infoHolder.locais.aterramento || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, aterramento: value } }))
                setChanges((prev) => ({ ...prev, 'locais.aterramento': value }))
              }}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="LOCAL DE INSTALAÇÃO DO(S) INVERSOR(ES)"
              placeholder="Preencha o local de instalação do(s) inversor(es)..."
              value={infoHolder.locais.inversor || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, inversor: value } }))
                setChanges((prev) => ({ ...prev, 'locais.inversor': value }))
              }}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="LOCAL DE INSTALAÇÃO DOS MÓDULOS"
              placeholder="Preencha o local de instalação dos módulos..."
              value={infoHolder.locais.modulos || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, locais: { ...prev.locais, modulos: value } }))
                setChanges((prev) => ({ ...prev, 'locais.modulos': value }))
              }}
              width={'100%'}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label="DISTANCIA DO CABEAMENTO CA"
              placeholder="Preencha a distância para cabeamento CA..."
              value={infoHolder.distancias.cabeamentoCA || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, cabeamentoCA: value } }))
                setChanges((prev) => ({ ...prev, 'distancias.cabeamentoCA': value }))
              }}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="DISTANCIA DO CABEAMENTO CC"
              placeholder="Preencha a distância para cabeamento CC.."
              value={infoHolder.distancias.cabeamentoCC || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, cabeamentoCC: value } }))
                setChanges((prev) => ({ ...prev, 'distancias.cabeamentoCC': value }))
              }}
              width={'100%'}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <TextInput
              label="DISTÂNCIA ATÉ O ROTEADOR"
              placeholder="Preencha a distância do comunicador ao roteador..."
              value={infoHolder.distancias.conexaoInternet || ''}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, distancias: { ...prev.distancias, conexaoInternet: value } }))
                setChanges((prev) => ({ ...prev, 'distancias.conexaoInternet': value }))
              }}
              width={'100%'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutionBlock
