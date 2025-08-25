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
import { easeBackInOut } from 'd3-ease'
import { TServiceOrderDTO } from '@/utils/schemas/service-order'
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

type EquipmentModalBlockProps = {
  infoHolder: TServiceOrderDTO
  setInfoHolder: React.Dispatch<React.SetStateAction<TServiceOrderDTO>>
}
function EquipmentModalBlock({ infoHolder, setInfoHolder }: EquipmentModalBlockProps) {
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
                  value={infoHolder.equipamentos.inversor.qtde || null}
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
                  value={infoHolder.equipamentos.inversor.potencia || null}
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
            <div className="flex w-full flex-col gap-2 lg:flex-row">
              <div className="w-full lg:w-1/3">
                <TextInput
                  label={'MODELO DOS MODULOS'}
                  placeholder={'Preencha o modelo dos módulos...'}
                  value={infoHolder.equipamentos.modulos.modelo || ''}
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
                  value={infoHolder.equipamentos.modulos.qtde || null}
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
                  value={infoHolder.equipamentos.modulos.potencia || null}
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
                <PiWaveSineBold size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway text-sm font-medium">
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
                 <p className="text-xs text-primary/60 tracking-tight">
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
                 <p className="text-xs text-primary/60 tracking-tight">
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
        <div className="mt-4 flex w-full flex-col items-start gap-2 lg:flex-row">
          <div className="h-full w-full lg:w-[50%]">
            <TakeMaterialsBlock osInfo={infoHolder} setOsInfo={setInfoHolder} useMissingMaterialInformation={null} />
          </div>
          <div className="h-full w-full lg:w-[50%]">
            <AvailableMaterialsBlock osInfo={infoHolder} setOsInfo={setInfoHolder} useKitInformation={null} />
          </div>
        </div>
      </AnimatePresence>
    </div>
  )
}

export default EquipmentModalBlock
