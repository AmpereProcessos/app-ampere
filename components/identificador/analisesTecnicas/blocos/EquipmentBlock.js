import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { easeBackInOut } from 'd3-ease'

import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import { FaSolarPanel } from 'react-icons/fa'
import { TbWaveSine } from 'react-icons/tb'

import TextInput from '../../../inputs/Text'

const variants = {
  hidden: {
    opacity: 0.2,
    scale: 0.95, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the color and alpha as needed
    transition: {
      duration: 0.5,
      ease: easeBackInOut, // Use an easing function
    },
  },
  visible: {
    opacity: 1,
    scale: 1, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 1)', // Normal background color
    transition: {
      duration: 0.5,
      ease: easeBackInOut, // Use an easing function
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fading background color
    transition: {
      duration: 0.01,
      ease: easeBackInOut, // Use an easing function
    },
  },
}

function EquipmentBlock({ infoHolder, setInfoHolder, changes, setChanges }) {
  console.log(infoHolder)
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">EQUIPAMENTOS</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div key={'editor'} variants={variants} initial="hidden" animate="visible" exit="exit" className="mt-2 flex w-full flex-col gap-2">
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'MODELO DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha o modelo dos inversores...'}
                  value={infoHolder.equipamentos.inversor.modelo || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, modelo: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.inversor.modelo': value }))
                  }}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'QTDE DE INVERSOR(ES)'}
                  placeholder={'Preencha a quantidade de inversores...'}
                  value={infoHolder.equipamentos.inversor.qtde || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, qtde: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.inversor.qtde': value }))
                  }}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'POTÊNCIA DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha a potência dos inversores...'}
                  value={infoHolder.equipamentos.inversor.potencia || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, potencia: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.inversor.potencia': value }))
                  }}
                  width={'100%'}
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'MODELO DOS MODULOS'}
                  placeholder={'Preencha o modelo dos módulos...'}
                  value={infoHolder.equipamentos.modulos.modelo || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, modelo: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.modulos.modelo': value }))
                  }}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'QTDE DE MODULOS'}
                  placeholder={'Preencha a quantidade de módulos...'}
                  value={infoHolder.equipamentos.modulos.qtde || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, qtde: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.modulos.qtde': value }))
                  }}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'POTÊNCIA DOS MODULOS'}
                  placeholder={'Preencha a potência dos módulos...'}
                  value={infoHolder.equipamentos.modulos.potencia || ''}
                  handleChange={(value) => {
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, potencia: value } },
                    }))
                    setChanges((prev) => ({ ...prev, 'equipamentos.modulos.potencia': value }))
                  }}
                  width={'100%'}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={'readOnly'} variants={variants} initial="hidden" animate="visible" exit="exit" className="mt-2 flex w-full flex-col gap-2">
            <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:gap-4">
              <div className="flex items-center gap-2">
                <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">
                  {infoHolder.equipamentos.modulos.qtde}x {infoHolder.equipamentos.modulos.modelo || 'N/A'} {infoHolder.equipamentos.modulos.potencia}
                  W
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TbWaveSine size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">
                  ({infoHolder.detalhes.topologia || 'N/A'}) - {infoHolder.equipamentos?.inversor.qtde}x{' '}
                  {infoHolder.equipamentos?.inversor.modelo || 'N/A'} {infoHolder.equipamentos?.inversor.potencia}W
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EquipmentBlock
