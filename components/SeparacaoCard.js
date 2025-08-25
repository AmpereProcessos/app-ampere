import React, { useState } from 'react'
import SelectInput from './SelectInput'
import { FaSave } from 'react-icons/fa'
import { AiFillEye } from 'react-icons/ai'
import axios from 'axios'
import SaveButton from './utils/Buttons/SaveButton'
function SeparacaoCard({ info, editor }) {
  const [infoHolder, setInfo] = useState(info)
  const [changes, setChanges] = useState({})
  const [materialInfoVisible, setMaterialInfoVisible] = useState(false)
  const [msg, setMsg] = useState({
    text: '',
    color: '',
  })
  function handleChanges() {
    axios.post(`/api/projects/update/${info._id}`, changes).then((res) =>
      setMsg({
        text: 'Alterações feitas',
        color: 'text-green-500',
      })
    )
  }
  return (
    <div className="border-primary/20 flex w-full flex-col border p-2">
      <div className="border-primary/20 flex items-center border-b pb-2">
        <h1 className="mr-2 font-bold uppercase">
          <strong className="text-[#15599a]">({infoHolder.qtde})</strong> {infoHolder.nomeDoContrato}
        </h1>
        <div className="flex grow flex-wrap justify-around gap-2">
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">EQUIPE</p>
            <p className="text-primary/80 text-xs">{infoHolder.obra.equipeResp ? infoHolder.obra.equipeResp : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">CIDADE</p>
            <p className="text-primary/80 text-xs">{infoHolder.cidade ? infoHolder.cidade : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">TOPOLOGIA</p>
            <p className="text-primary/80 text-xs">{infoHolder.sistema.topologia ? infoHolder.sistema.topologia : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">Nº DE MÓDULOS</p>
            <p className="text-primary/80 text-xs">{infoHolder.sistema.qtdeModulos ? infoHolder.sistema.qtdeModulos : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">POT. MÓDULOS</p>
            <p className="text-primary/80 text-xs">{infoHolder.sistema.potModulos ? infoHolder.sistema.potModulos : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">INFO MICRO/INVERSOR</p>
            <p className="text-primary/80 text-xs">{infoHolder.sistema.inversor ? infoHolder.sistema.inversor : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">TIPO ESTRUTURA</p>
            <p className="text-primary/80 text-xs">{infoHolder.estruturaPersonalizada.tipo ? infoHolder.estruturaPersonalizada.tipo : '-'}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-primary/80 text-sm font-bold">TIPO TELHA</p>
            <p className="text-primary/80 text-xs uppercase">{infoHolder.visitaTecnica.tipoDaTelha ? infoHolder.visitaTecnica.tipoDaTelha : '-'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-2 py-2">
        <span className="text-center text-sm font-bold text-[#15599a] uppercase">INFO MATERIAL</span>
        <button
          onClick={() => setMaterialInfoVisible(!materialInfoVisible)}
          className="mb-2 h-[20px] rounded bg-[#fead41] px-1 hover:bg-[#15599a] hover:text-white"
        >
          <AiFillEye />
        </button>
      </div>
      {materialInfoVisible && (
        <div className="flex w-full items-center justify-center gap-x-4">
          <div className="mt-2 flex w-[450px] flex-col items-center self-center">
            <span className="font-raleway text-center text-sm font-bold uppercase">INFORMAÇÕES DO KIT</span>
            <textarea
              readOnly={true}
              value={infoHolder.compra.kitInfo ? infoHolder.compra.kitInfo : ''}
              placeholder={'Observações do material aqui...'}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'compra.kitInfo': e.target.value,
                })
                setInfo({
                  ...infoHolder,
                  compra: {
                    ...infoHolder.compra,
                    kitInfo: e.target.value,
                  },
                })
              }}
              className="border-primary/80 mb-2 h-[150px] w-full resize-none border bg-gray-200 p-2 text-center outline-hidden"
            />
          </div>
          <div className="mt-2 flex w-[450px] flex-col items-center self-center">
            <span className="font-raleway text-center text-sm font-bold uppercase">MATERIAL FALTANTE</span>
            <textarea
              readOnly={true}
              value={infoHolder.material.materialFaltante ? infoHolder.material.materialFaltante : ''}
              placeholder={'Observações do material aqui...'}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  'material.materialFaltante': e.target.value,
                })
                setInfo({
                  ...infoHolder,
                  material: {
                    ...infoHolder.material,
                    materialFaltante: e.target.value,
                  },
                })
              }}
              className="border-primary/80 mb-2 h-[150px] w-full resize-none border bg-gray-200 p-2 text-center outline-hidden"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-around py-2">
        <SelectInput
          label={'STATUS DA SEPARAÇÃO'}
          editable={editor}
          value={infoHolder.material.statusSeparacao ? infoHolder.material.statusSeparacao : 'NÃO DEFINIDO'}
          handleChange={(value) => {
            setChanges({ ...changes, 'material.statusSeparacao': value })
            setInfo({
              ...infoHolder,
              material: { ...infoHolder.material, statusSeparacao: value },
            })
          }}
          options={[
            {
              label: 'INICIAR SEPARAÇÃO',
              value: 'INICIAR SEPARAÇÃO',
            },
            {
              label: 'SEPARADO',
              value: 'SEPARADO',
            },
            {
              label: 'NÃO DEFINIDO',
              value: 'NÃO DEFINIDO',
            },
          ]}
        />
      </div>
      {msg.text && <p className={`${msg.color} text-center italic`}>{msg.text}</p>}
      <div className="flex justify-center">
        <SaveButton text={'Salvar alterações'} icon={<FaSave />} handleClick={handleChanges} />
      </div>
    </div>
  )
}

export default SeparacaoCard
