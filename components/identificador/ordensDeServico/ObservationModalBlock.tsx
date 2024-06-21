import TextInput from '@/components/inputs/Text'
import TextareaInput from '@/components/inputs/TextareaInput'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
const variants = {
  hidden: {
    opacity: 0.2,
    y: -1,
    transition: {
      duration: 0.5, // Adjust the duration as needed
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // Adjust the duration as needed
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.01, // Adjust the duration as needed
    },
  },
}

type ObservationModalBlockProps = {
  infoHolder: TServiceOrderDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TServiceOrderDTO>>
}
function ObservationModalBlock({ infoHolder, setInfoHolder }: ObservationModalBlockProps) {
  const [observationItemHolder, setObservationItemHolder] = useState<TServiceOrderDTO['observacoes'][number]>({
    topico: 'GERAL',
    descricao: '',
  })

  function addObservation(observation: TServiceOrderDTO['observacoes'][number]) {
    const observations = [...infoHolder.observacoes]
    observations.push(observation)
    setInfoHolder((prev) => ({ ...prev, observacoes: observations }))
  }
  function removeObservation(index: number) {
    const observations = [...infoHolder.observacoes]
    observations.splice(index, 1)
    setInfoHolder((prev) => ({ ...prev, observacoes: observations }))
  }
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 p-2">
        <h1 className="font-bold text-white">OBSERVAÇÕES</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div key={'editor'} variants={variants} initial="hidden" animate="visible" exit="exit" className="flex w-full flex-col gap-2">
            <TextInput
              label="TÓPICO"
              placeholder="Preencha aqui o tópico da observação."
              value={observationItemHolder.topico}
              handleChange={(value) => setObservationItemHolder((prev) => ({ ...prev, topico: value }))}
              width="100%"
            />
            <TextareaInput
              label="DESCRIÇÃO"
              placeholder="Preencha aqui o conteúdo da observação..."
              value={observationItemHolder.descricao}
              handleChange={(value) => setObservationItemHolder((prev) => ({ ...prev, descricao: value }))}
            />
            <div className="mt-1 flex w-full items-center justify-end">
              <button
                onClick={() => addObservation(observationItemHolder)}
                className="rounded bg-black px-4 py-1 text-sm font-medium text-white duration-300 ease-in-out hover:bg-gray-700"
              >
                ADICIONAR
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <h1 className="mt-2 text-[0.65rem] font-bold leading-none tracking-tight text-gray-500 lg:text-xs">LISTA DE OBSERVAÇÕES</h1>
      <div className="mt-2 flex w-full flex-col gap-2 px-2">
        {infoHolder.observacoes.length > 0 ? (
          infoHolder.observacoes.map((obs, index) => (
            <div key={index} className="flex w-full flex-col rounded-md border border-gray-500">
              <div className="flex min-h-[25px] w-full flex-col items-start justify-between gap-1 lg:flex-row">
                <div className="flex w-full items-center justify-center rounded-br-md rounded-tl-md bg-cyan-700 lg:w-[40%]">
                  <p className="w-full text-center text-xs font-medium text-white">{obs.topico}</p>
                </div>
                <div className="flex grow items-center justify-end gap-2 p-2">
                  <button
                    onClick={() => removeObservation(index)}
                    type="button"
                    className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                  >
                    <MdDelete style={{ color: 'red' }} size={10} />
                  </button>
                </div>
              </div>
              <h1 className="w-full p-2 text-center text-xs font-medium tracking-tight text-gray-500">{obs.descricao}</h1>
            </div>
          ))
        ) : (
          <p className="w-full text-center text-sm font-medium tracking-tight text-gray-500">Nenhuma observação adicionada ao projeto.</p>
        )}
      </div>
    </div>
  )
}

export default ObservationModalBlock
