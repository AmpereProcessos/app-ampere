import React from 'react'
import SelectInput from '../../../inputs/Select'
import { inverterFixationOptions, structureTypes, roofTiles } from '../../../../utils/select-options'
import TextInput from '../../../inputs/Text'

function StructureBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">ESTRUTURA</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2 lg:flex-row justify-around">
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="MATERIAL DA ESTRUTURA"
              options={[
                { id: 1, label: 'MADEIRA', value: 'MADEIRA' },
                { id: 2, label: 'FERRO', value: 'FERRO' },
              ]}
              value={infoHolder.detalhes.materialEstrutura}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, materialEstrutura: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.materialEstrutura': value }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, materialEstrutura: null } }))
                setChanges((prev) => ({ ...prev, 'detalhes.materialEstrutura': null }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <SelectInput
              label="TIPO DA ESTRUTURA"
              options={structureTypes}
              value={infoHolder.detalhes.tipoEstrutura}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.tipoEstrutura': value }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: null } }))
                setChanges((prev) => ({ ...prev, 'detalhes.tipoEstrutura': null }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
          {infoHolder.detalhes.topologia == 'INVERSOR' ? (
            <div className="w-full lg:w-1/3">
              <SelectInput
                label="ESTRUTURA DE FIXAÇÃO DO INVERSOR"
                options={inverterFixationOptions}
                value={infoHolder.detalhes.fixacaoInversores}
                handleChange={(value) => {
                  setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, fixacaoInversores: value } }))
                  setChanges((prev) => ({ ...prev, 'detalhes.fixacaoInversores': value }))
                }}
                onReset={() => {
                  setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, fixacaoInversores: null } }))
                  setChanges((prev) => ({ ...prev, 'detalhes.fixacaoInversores': null }))
                }}
                selectedItemLabel="NÃO DEFINIDO"
                width="100%"
              />
            </div>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-2 lg:flex-row justify-around">
          <div className="w-full lg:w-1/4">
            <TextInput
              label="ORIENTAÇÃO"
              placeholder="Preencha aqui a orientação da estrutura de instalação..."
              value={infoHolder.detalhes.orientacao}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, orientacao: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.orientacao': value }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="TIPO DE TELHA"
              options={roofTiles}
              value={infoHolder.detalhes.tipoTelha}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.tipoTelha': value }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: null } }))
                setChanges((prev) => ({ ...prev, 'detalhes.tipoTelha': null }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="TELHAS RESERVAS DISPONÍVEIS"
              options={[
                { id: 1, label: 'NÃO', value: 'NÃO' },
                { id: 2, label: 'SIM', value: 'SIM' },
              ]}
              value={infoHolder.detalhes.telhasReservas}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, telhasReservas: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.telhasReservas': value }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, telhasReservas: null } }))
                setChanges((prev) => ({ ...prev, 'detalhes.telhasReservas': null }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StructureBlock
