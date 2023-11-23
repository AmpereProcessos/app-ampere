import React from 'react'
import CheckboxInput from '../inputs/Checkbox'
function InfoJornadaBlock({ editor, infoHolder, setInfo, changes, setChanges }) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
      <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">JORNADA DO CLIENTE</span>
      <div className="w-full flex px-2">
        <div className="w-full flex items-center justify-around flex-wrap gap-3 rounded p-2 border border-cyan-500">
          <h1 className="w-full text-start font-bold text-xs text-cyan-500 tracking-tight leading-none">JORNADA DO CLIENTE</h1>
          <CheckboxInput
            labelFalse={'BOAS VINDAS'}
            labelTrue={'BOAS VINDAS'}
            checked={!!infoHolder.jornada.boasVindas}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, boasVindas: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.boasVindas': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'ASSINATURA DAS DOCUMENTAÇÕES'}
            labelTrue={'ASSINATURA DAS DOCUMENTAÇÕES'}
            checked={!!infoHolder.jornada.assDocumentacoes}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, assDocumentacoes: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.assDocumentacoes': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'COMPRA DO KIT'}
            labelTrue={'COMPRA DO KIT'}
            checked={!!infoHolder.jornada.compraDoKit}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, compraDoKit: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.compraDoKit': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'NF FATURADA'}
            labelTrue={'NF FATURADA'}
            checked={!!infoHolder.jornada.nfFaturada}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, nfFaturada: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.nfFaturada': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'PREVISÃO DE ENTREGA'}
            labelTrue={'PREVISÃO DE ENTREGA'}
            checked={!!infoHolder.jornada.prevChegada}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, prevChegada: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.prevChegada': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'RESPOSTA DA CONCESSIONÁRIA'}
            labelTrue={'RESPOSTA DA CONCESSIONÁRIA'}
            checked={!!infoHolder.jornada.respConcessionaria}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, respConcessionaria: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.respConcessionaria': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'KIT ENTREGUE'}
            labelTrue={'KIT ENTREGUE'}
            checked={!!infoHolder.jornada.entregaDoKit}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, entregaDoKit: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.entregaDoKit': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'INSTALAÇÃO AGENDADA'}
            labelTrue={'INSTALAÇÃO AGENDADA'}
            checked={!!infoHolder.jornada.instalacaoAgendada}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, instalacaoAgendada: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.instalacaoAgendada': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'INSTALAÇÃO REALIZADA'}
            labelTrue={'INSTALAÇÃO REALIZADA'}
            checked={!!infoHolder.jornada.instalacaoRealizada}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, instalacaoRealizada: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.instalacaoRealizada': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'VISTORIA DA CONCESSIONÁRIA'}
            labelTrue={'VISTORIA DA CONCESSIONÁRIA'}
            checked={!!infoHolder.jornada.vistoriaConcessionaria}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, vistoriaConcessionaria: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.vistoriaConcessionaria': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'SISTEMA LIGADO'}
            labelTrue={'SISTEMA LIGADO'}
            checked={!!infoHolder.jornada.sistemaLigado}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, sistemaLigado: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.sistemaLigado': value }))
            }}
          />
          <CheckboxInput
            labelFalse={'JORNADA CONCLUIDA'}
            labelTrue={'JORNADA CONCLUIDA'}
            checked={!!infoHolder.jornada.jornadaConcluida}
            handleChange={(value) => {
              setInfo((prev) => ({ ...prev, jornada: { ...prev.jornada, jornadaConcluida: value } }))
              setChanges((prev) => ({ ...prev, 'jornada.jornadaConcluida': value }))
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default InfoJornadaBlock
