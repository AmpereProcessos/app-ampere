import React from 'react'
import SelectInput from '../SelectInput'
import DateInput from '../DateInput'
import TextInput from '../TextInput'
import dayjs from 'dayjs'

function InfoComissionamentoBlock({ editor, infoHolder, setInfo, changes, setChanges, project }) {
  return (
    <div className="flex flex-col rounded-md border border-[#15599a] pb-2 shadow-lg">
      <span className="mb-2 w-full rounded-tr-md rounded-tl-md bg-[#15599a] py-2 text-center font-bold text-white">COMISSIONAMENTO PÓS-BRA</span>
      <div className="flex flex-wrap justify-around gap-2">
        <SelectInput
          label={'DIAGNÓSTICO'}
          value={infoHolder.oem?.diagnostico ? infoHolder.oem?.diagnostico : 'NÃO DEFINIDO'}
          editable={editor}
          options={[
            {
              label: 'MICRO/INVERSOR DESCONFIGURADO',
              value: 'MICRO/INVERSOR DESCONFIGURADO',
            },
            {
              label: 'CLIENTE SEM INTERNET',
              value: 'CLIENTE SEM INTERNET',
            },
            {
              label: 'TEMPO DE O&M VENCIDO',
              value: 'TEMPO DE O&M VENCIDO',
            },
            {
              label: 'EQUIPAMENTOS PARA GARANTIA',
              value: 'EQUIPAMENTOS PARA GARANTIA',
            },
            {
              label: 'ROTEADOR COMPATÍVEL',
              value: 'ROTEADOR COMPATÍVEL',
            },
            {
              label: 'NÃO DEFINIDO',
              value: 'NÃO DEFINIDO',
            },
          ]}
          handleChange={(value) => {
            setChanges({ ...changes, 'oem.diagnostico': value })
            setInfo({
              ...infoHolder,
              oem: {
                ...infoHolder.oem,
                diagnostico: value,
              },
            })
          }}
        />
        <DateInput
          label={'Usina Ligada'}
          editable={editor}
          value={
            infoHolder.conferencias.usinaLigada.data != undefined && dayjs(infoHolder.conferencias.usinaLigada.data).isValid()
              ? new Date(infoHolder.conferencias.usinaLigada.data).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'conferencias.usinaLigada.data': isNaN(value) ? new Date(value).toISOString() : null,
              'conferencias.usinaLigada.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
            })
            setInfo({
              ...infoHolder,
              conferencias: {
                ...infoHolder.conferencias,
                usinaLigada: {
                  data: isNaN(value) ? new Date(value).toISOString() : null,
                  status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                },
              },
            })
          }}
        />
        <DateInput
          label={'Monitoramento feito'}
          editable={editor}
          value={
            infoHolder.conferencias.monitoramentoFeito.data != undefined && dayjs(infoHolder.conferencias.monitoramentoFeito.data).isValid()
              ? new Date(infoHolder.conferencias.monitoramentoFeito.data).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'conferencias.monitoramentoFeito.data': isNaN(value) ? new Date(value).toISOString() : null,
              'conferencias.monitoramentoFeito.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
            })
            setInfo({
              ...infoHolder,
              conferencias: {
                ...infoHolder.conferencias,
                monitoramentoFeito: {
                  data: isNaN(value) ? new Date(value).toISOString() : null,
                  status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                },
              },
            })
          }}
        />
        <DateInput
          label={'Data APP no celular'}
          editable={editor}
          value={
            infoHolder.app.data != undefined && dayjs(infoHolder.app.data).isValid() ? new Date(infoHolder.app.data).toISOString().slice(0, 10) : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'app.data': isNaN(value) ? new Date(value).toISOString() : null,
            })
            setInfo({
              ...infoHolder,
              app: {
                ...infoHolder.app,
                data: isNaN(value) ? new Date(value).toISOString() : null,
              },
            })
          }}
        />
        <DateInput
          label={'Energia Injetada'}
          editable={editor}
          value={
            infoHolder.conferencias.energiaInjetada.data != undefined && dayjs(infoHolder.conferencias.energiaInjetada.data).isValid()
              ? new Date(infoHolder.conferencias.energiaInjetada.data).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'conferencias.energiaInjetada.data': isNaN(value) ? new Date(value).toISOString() : null,
              'conferencias.energiaInjetada.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
            })
            setInfo({
              ...infoHolder,
              conferencias: {
                ...infoHolder.conferencias,
                energiaInjetada: {
                  data: isNaN(value) ? new Date(value).toISOString() : null,
                  status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
                },
              },
            })
          }}
        />
        <TextInput
          label={'LOGIN NO APP'}
          value={infoHolder.app.login ? infoHolder.app.login : ''}
          normalCase={true}
          editable={true}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'app.login': value,
            })
            setInfo({
              ...infoHolder,
              app: {
                ...infoHolder.app,
                login: value,
              },
            })
          }}
        />
        <TextInput
          label={'SENHA NO APP'}
          value={infoHolder.app.senha}
          normalCase={true}
          editable={true}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'app.senha': value,
            })
            setInfo({
              ...infoHolder,
              app: {
                ...infoHolder.app,
                senha: value,
              },
            })
          }}
        />
      </div>
    </div>
  )
}

export default InfoComissionamentoBlock
