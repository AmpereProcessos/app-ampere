import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import { BsSuitDiamondFill } from 'react-icons/bs'
import { FaSolarPanel } from 'react-icons/fa'
import { PiWaveSineBold } from 'react-icons/pi'
import TextInput from '../../inputs/Text'
import NumberInput from '../../inputs/Number'
import TakeMaterialsBlock from './TakeMaterialsBlock'
import AvailableMaterialsBlock from './AvailableMaterialsBlock'
import { easeInOut } from 'd3-ease'
const variants = {
  hidden: {
    opacity: 0.2,
    scale: 0.95, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the color and alpha as needed
    transition: {
      duration: 0.5,
      ease: easeInOut, // Use an easing function
    },
  },
  visible: {
    opacity: 1,
    scale: 1, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 1)', // Normal background color
    transition: {
      duration: 0.5,
      ease: easeInOut, // Use an easing function
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05, // Scale down slightly
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fading background color
    transition: {
      duration: 0.01,
      ease: easeInOut, // Use an easing function
    },
  },
}

function EquipmentModalBlock({ infoHolder, setInfoHolder }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
        <h1 className="text-white font-bold">EQUIPAMENTOS</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div key={'editor'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2 mt-2">
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'MODELO DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha o modelo dos inversores...'}
                  value={infoHolder.equipamentos.inversor.modelo}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, modelo: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'QTDE DE INVERSOR(ES)'}
                  placeholder={'Preencha a quantidade de inversores...'}
                  value={infoHolder.equipamentos.inversor.qtde}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, qtde: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'POTÊNCIA DO(S) INVERSOR(ES)'}
                  placeholder={'Preencha a potência dos inversores...'}
                  value={infoHolder.equipamentos.inversor.potencia}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, inversor: { ...prev.equipamentos.inversor, potencia: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'MODELO DOS MODULOS'}
                  placeholder={'Preencha o modelo dos módulos...'}
                  value={infoHolder.equipamentos.modulos.modelo}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, modelo: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'QTDE DE MODULOS'}
                  placeholder={'Preencha a quantidade de módulos...'}
                  value={infoHolder.equipamentos.modulos.qtde}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, qtde: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <NumberInput
                  label={'POTÊNCIA DOS MODULOS'}
                  placeholder={'Preencha a potência dos módulos...'}
                  value={infoHolder.equipamentos.modulos.potencia}
                  handleChange={(value) =>
                    setInfoHolder((prev) => ({
                      ...prev,
                      equipamentos: { ...prev.equipamentos, modulos: { ...prev.equipamentos.modulos, potencia: value } },
                    }))
                  }
                  width={'100%'}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={'readOnly'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2 mt-2">
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-4">
              <div className="flex gap-2 items-center">
                <FaSolarPanel size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {infoHolder.equipamentos.modulos.qtde}x {infoHolder.equipamentos.modulos.modelo || 'N/A'} {infoHolder.equipamentos.modulos.potencia}
                  W
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <PiWaveSineBold size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  ({infoHolder.detalhes.topologia || 'N/A'}) - {infoHolder.equipamentos?.inversor.qtde}x{' '}
                  {infoHolder.equipamentos?.inversor.modelo || 'N/A'} {infoHolder.equipamentos?.inversor.potencia}W
                </p>
              </div>
            </div>
            {/* <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-start mt-2">
              {infoHolder.equipamentos?.disponivel ? (
                <div className="flex flex-col gap-1 border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                  <h1 className="tracking-tight text-center font-medium">DISPONÍVEIS</h1>
                  {infoHolder.equipamentos.disponivel.map((equip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BsSuitDiamondFill />
                      <p className="text-xs text-gray-500 tracking-tight">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {infoHolder.equipamentos?.retirada ? (
                <div className="flex flex-col gap-1  border border-cyan-500 p-3 rounded-lg w-full lg:w-fit">
                  <h1 className="tracking-tight text-center font-medium">RETIRADA</h1>
                  {infoHolder.equipamentos.retirada.map((equip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <BsSuitDiamondFill />
                      <p className="text-xs text-gray-500 tracking-tight">
                        {equip.qtde ? `${equip.qtde}x ` : ''}
                        {equip.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div> */}
          </motion.div>
        )}
        <div className="flex w-full items-start gap-2 flex-col lg:flex-row mt-4">
          <div className="w-full lg:w-[50%] h-full">
            <TakeMaterialsBlock osInfo={infoHolder} setOsInfo={setInfoHolder} />
          </div>
          <div className="w-full lg:w-[50%] h-full">
            <AvailableMaterialsBlock osInfo={infoHolder} setOsInfo={setInfoHolder} />
          </div>
        </div>
      </AnimatePresence>
    </div>
  )
}

export default EquipmentModalBlock
