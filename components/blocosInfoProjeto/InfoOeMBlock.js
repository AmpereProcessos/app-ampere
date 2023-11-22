import React from 'react'
import NumberInput from '../NumberInput'
import SelectInput from '../SelectInput'
import DateInput from '../DateInput'
import { oemPlans, statusObra } from '../../utils/constants'

function InfoOeMBlock({ editor, infoHolder, setInfo, changes, setChanges, project }) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg rounded-md">
      <span className="w-full bg-[#15599a] text-white text-center font-bold py-2 rounded-tr-md rounded-tl-md mb-2">OPERAÇÃO E MANUTENÇÃO</span>
      <div className="flex gap-2 justify-around flex-wrap">
        <div>
          <input
            disabled={!editor}
            checked={infoHolder.oem?.aplicavel ? true : false}
            onChange={(e) => {
              setChanges({
                ...changes,
                'oem.aplicavel': e.target.checked,
              })
              setInfo({
                ...infoHolder,
                oem: {
                  ...infoHolder.oem,
                  aplicavel: e.target.checked,
                },
              })
            }}
            type="checkbox"
            name="possuiOEM"
            id="possuiOEM"
          />
          <label className="ml-2" htmlFor="possuiOEM">
            POSSUI O&M?
          </label>
        </div>
        {infoHolder.oem?.aplicavel && (
          <NumberInput
            label={'Duração O&M (anos)'}
            value={infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0}
            editable={editor}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'oem.duracao': Number(value),
              })
              setInfo({
                ...infoHolder,
                oem: { ...infoHolder.oem, duracao: Number(value) },
              })
            }}
          />
        )}
        {infoHolder.oem?.aplicavel && (
          <NumberInput
            label={'QTDE de manutenções'}
            value={infoHolder.oem?.qtdeManutencoes ? infoHolder.oem?.qtdeManutencoes : 0}
            editable={editor}
            handleChange={(value) => {
              setChanges({
                ...changes,
                'oem.qtdeManutencoes': Number(value),
              })
              setInfo({
                ...infoHolder,
                oem: {
                  ...infoHolder.oem,
                  qtdeManutencoes: Number(value),
                },
              })
            }}
          />
        )}
        <SelectInput
          label={'PLANO DE O&M'}
          editable={false}
          value={infoHolder.oem?.plano ? infoHolder.oem.plano : 'NÃO DEFINIDO'}
          options={[...oemPlans.map((plan) => plan), { label: 'NÃO DEFINIDO', value: 'NÃO DEFINIDO' }]}
          handleChange={(value) => {
            setChanges({ ...changes, 'oem.plano': value })
            setInfo({
              ...infoHolder,
              oem: {
                ...infoHolder.oem,
                plano: value,
              },
            })
          }}
        />
        <DateInput
          label={'MANUTENÇÃO PREVENTIVA'}
          editable={editor}
          value={
            infoHolder.manutencaoPreventiva?.data != undefined && infoHolder.manutencaoPreventiva.data != '-'
              ? new Date(infoHolder.manutencaoPreventiva.data).toISOString().slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              'manutencaoPreventiva.data': isNaN(value) ? new Date(value).toISOString() : null,
              'manutencaoPreventiva.status': isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
            })
            setInfo({
              ...infoHolder,
              manutencaoPreventiva: {
                ...infoHolder.manutencaoPreventiva,
                data: isNaN(value) ? new Date(value).toISOString() : null,
                status: isNaN(value) ? 'REALIZADO' : 'NÃO REALIZADO',
              },
            })
          }}
        />
        <div className="flex flex-col w-[350px] items-center">
          <span className="uppercase font-bold font-raleway text-center text-sm">O&M CONCLUÍDO ?</span>
          <div className="flex">
            <input
              disabled={!editor}
              checked={infoHolder.oem?.oemConcluido == true ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'oem.oemConcluido': e.target.checked,
                  'obra.statusDaObra': 'CONCLUIDA',
                })
                setInfo({
                  ...infoHolder,
                  obra: {
                    ...infoHolder.obra,
                    statusDaObra: 'CONCLUIDA',
                  },
                  oem: {
                    ...infoHolder.oem,
                    oemConcluido: e.target.checked,
                  },
                })
              }}
              type="checkbox"
              name="oemConcluido"
              id="oemConcluido"
            />
            <label className="ml-2" htmlFor="oemConcluido">
              {infoHolder.oem?.oemConcluido ? 'SIM' : 'NÃO'}
            </label>
          </div>
        </div>
        <SelectInput
          label={'STATUS DA OBRA'}
          value={infoHolder.obra?.statusDaObra ? infoHolder.obra?.statusDaObra : 'NÃO DEFINIDO'}
          editable={editor}
          options={statusObra.map((status) => status)}
          handleChange={(value) => {
            setChanges({
              ...changes,
              'obra.statusDaObra': value,
            })
            setInfo({
              ...infoHolder,
              obra: {
                ...infoHolder.obra,
                statusDaObra: value,
              },
            })
          }}
        />
      </div>
    </div>
  )
}

export default InfoOeMBlock
