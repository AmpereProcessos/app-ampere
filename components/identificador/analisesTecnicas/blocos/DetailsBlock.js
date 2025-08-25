import React from 'react'

import SelectInput from '../../../inputs/Select'
import TextInput from '../../../inputs/Text'
import CheckboxInput from '../../../inputs/Checkbox'

import { inverterFixationOptions, roofTyles, structureTypes } from '../../../../utils/select-options'

function DetailsBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">DETALHES ADICIONAIS</h1>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="flex w-full flex-col justify-around gap-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <TextInput
              label="CONCESSIONÁRIA"
              placeholder="Preencha aqui a concessionária que atende o projeto..."
              value={infoHolder.detalhes.concessionaria}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, concessionaria: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.concessionaria': value }))
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="TOPOLOGIA"
              options={[
                { id: 1, label: 'MICRO-INVERSOR', value: 'MICRO-INVERSOR' },
                { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
              ]}
              value={infoHolder.detalhes.topologia}
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.topologia': value }))
              }}
              onReset={() => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: null } }))
                setChanges((prev) => ({ ...prev, 'detalhes.topologia': null }))
              }}
              selectedItemLabel="NÃO DEFINIDO"
              width="100%"
            />
          </div>
        </div>
        {/* <div className="flex w-full flex-col gap-2 lg:flex-row justify-around">
          <div className="w-full lg:w-1/4">
            <SelectInput
              label="TIPO DE TELHA"
              options={roofTyles}
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
        </div> */}
        <div className="flex w-full flex-col gap-2 lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelFalse="IMAGENS DE DRONE DISPONÍVEIS"
              labelTrue="IMAGENS DE DRONE DISPONÍVEIS"
              checked={infoHolder.detalhes.imagensDrone}
              justify="justify-center"
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, imagensDrone: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.imagensDrone': value }))
              }}
              width={'100%'}
            />
          </div>

          <div className="flex w-full items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelFalse="IMAGENS DA FACHADA DISPONÍVEIS"
              labelTrue="IMAGENS DA FACHADA DISPONÍVEIS"
              checked={infoHolder.detalhes.imagensFachada}
              justify="justify-center"
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, imagensFachada: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.imagensFachada': value }))
              }}
              width={'100%'}
            />
          </div>

          <div className="flex w-full items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelFalse="IMAGENS DE SATÉLITE DISPONÍVEIS"
              labelTrue="IMAGENS DE SATÉLITE DISPONÍVEIS"
              checked={infoHolder.detalhes.imagensSatelite}
              justify="justify-center"
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, imagensSatelite: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.imagensSatelite': value }))
              }}
              width={'100%'}
            />
          </div>
          <div className="flex w-full items-center justify-center lg:w-1/4">
            <CheckboxInput
              labelFalse="MEDIÇÕES DISPONÍVEIS"
              labelTrue="MEDIÇÕES DISPONÍVEIS"
              checked={infoHolder.detalhes.medicoes}
              justify="justify-center"
              handleChange={(value) => {
                setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, medicoes: value } }))
                setChanges((prev) => ({ ...prev, 'detalhes.medicoes': value }))
              }}
              width={'100%'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsBlock
