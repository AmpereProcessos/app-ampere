import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai'
import SelectInput from '../../inputs/Select'
import CheckboxInput from '../../CheckboxInput'
import TextInput from '../../inputs/Text'
import { tiposDeEstruturas, tiposDePadrao, tiposDeTelha } from '../../../utils/constants'
import { AnimatePresence, motion } from 'framer-motion'
import { BsArrowDownUp, BsFillGearFill, BsHouse } from 'react-icons/bs'
import { MdElectricMeter, MdOutlineSettingsInputComponent, MdOutlineWifiPassword, MdOutput, MdRoofing } from 'react-icons/md'
import { IoMdWater } from 'react-icons/io'
import { TbTopologyFullHierarchy } from 'react-icons/tb'
const variants = {
  hidden: {
    opacity: 0.2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the color and alpha as needed
    transition: {
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Normal background color
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fading background color
    transition: {
      duration: 0.01,
    },
  },
}
function DetailsModalBlock({ infoHolder, setInfoHolder }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
        <h1 className="text-white font-bold">DETALHES</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div key={'editor'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2">
            <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label={'TOPOLOGIA'}
                  value={infoHolder.detalhes.topologia}
                  options={[
                    { id: 1, label: 'MICRO', value: 'MICRO' },
                    { id: 2, label: 'INVERSOR', value: 'INVERSOR' },
                  ]}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, topologia: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label={'TIPO DE ESTRUTURA'}
                  value={infoHolder.detalhes.tipoEstrutura}
                  options={tiposDeEstruturas.map((structure, index) => ({ ...structure, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoEstrutura: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <SelectInput
                  label={'TIPO DE TELHA'}
                  value={infoHolder.detalhes.tipoTelha}
                  options={tiposDeTelha.map((roofType, index) => ({ ...roofType, id: index + 1 }))}
                  selectedItemLabel={'NÃO DEFINIDO'}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoTelha: value } }))}
                  width={'100%'}
                />
              </div>
            </div>
            {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
              <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
                <div className="w-full lg:w-1/4">
                  <TextInput
                    label={'PONTO DE ÁGUA'}
                    placeholder={'Localização do ponto de água...'}
                    value={infoHolder.detalhes.pontoAgua}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, pontoAgua: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <TextInput
                    label={'SENHA DO WIFI'}
                    placeholder={'Senha do Wi-Fi do cliente...'}
                    value={infoHolder.detalhes.senhaWifi}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, senhaWifi: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <CheckboxInput
                    labelFalse={'NÃO CONFIGURAR'}
                    labelTrue={'CONFIGURAR'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={infoHolder.detalhes.configuracaoMonitoramento}
                    title={'CONFIGURAÇÃO DE MONITORAMENTO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, configuracaoMonitoramento: value } }))}
                    widthFit={true}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <CheckboxInput
                    labelFalse={'NÃO POSSUI TRAFO'}
                    labelTrue={'POSSUI TRAFO'}
                    labelClassName="font-sans font-bold  text-[#353432]"
                    checked={infoHolder.detalhes.possuiTrafo}
                    title={'SISTEMA COM TRAFO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, possuiTrafo: value } }))}
                    widthFit={true}
                  />
                </div>
              </div>
            ) : null}
            {infoHolder.categoria == 'PADRÃO' ? (
              <div className="flex w-full items-center gap-2 flex-col lg:flex-row mt-2">
                <div className="w-full lg:w-1/4">
                  <SelectInput
                    label={'ENTRADA DO PADRÃO'}
                    value={infoHolder.detalhes.tipoPadrao}
                    options={[
                      { id: 1, label: 'AEREO', value: 'AEREO' },
                      { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <SelectInput
                    label={'SAÍDA DO PADRÃO'}
                    value={infoHolder.detalhes.tipoSaidaPadrao}
                    options={[
                      { id: 1, label: 'AEREO', value: 'AEREO' },
                      { id: 2, label: 'SUBTERRANEO', value: 'SUBTERRANEO' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, tipoSaidaPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <SelectInput
                    label={'AMPERAGEM DO PADRÃO'}
                    value={infoHolder.detalhes.amperagemPadrao}
                    options={tiposDePadrao.map((type, index) => ({ ...type, id: index + 1 }))}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, amperagemPadrao: value } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-full lg:w-1/4 flex justify-center">
                  <SelectInput
                    label={'RESPONSABILIDADE DO PADRÃO'}
                    value={infoHolder.detalhes.responsabilidadePadrao}
                    options={[
                      { id: 1, label: 'AMPERE', value: 'AMPERE' },
                      { id: 2, label: 'CLIENTE', value: 'CLIENTE' },
                      { id: 3, label: 'NÃO SE APLICA', value: 'NÃO SE APLICA' },
                    ]}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, detalhes: { ...prev.detalhes, responsabilidadePadrao: value } }))}
                    width={'100%'}
                  />
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key={'readOnly'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col gap-2">
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2 flex-wrap">
              {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <IoMdWater />
                    <p className="font-medium text-gray-500 text-xs uppercase">PONTO DE ÁGUA</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.pontoAgua || 'N/A'}</h1>
                </div>
              ) : null}
              {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <MdOutlineWifiPassword />
                    <p className="font-medium text-gray-500 text-xs uppercase">SENHA DO WI-FI</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.senhaWifi || 'N/A'}</h1>
                </div>
              ) : null}
              {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <BsFillGearFill />
                    <p className="font-medium text-gray-500 text-xs uppercase">CONFIGURAR MONITORAMENTO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">
                    {infoHolder.detalhes.configuracaoMonitoramento ? 'SIM' : 'N/A'}
                  </h1>
                </div>
              ) : null}
              {infoHolder.categoria == 'MANUTENÇÃO PREVENTIVA' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <BsArrowDownUp />
                    <p className="font-medium text-gray-500 text-xs uppercase">POSSUI TRAFO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.possuiTrafo ? 'SIM' : 'N/A'}</h1>
                </div>
              ) : null}

              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <BsHouse />
                  <p className="font-medium text-gray-500 text-xs uppercase">TIPO ESTRUTURA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.tipoEstrutura || 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <TbTopologyFullHierarchy />
                  <p className="font-medium text-gray-500 text-xs uppercase">TOPOLOGIA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.detalhes.topologia || 'N/A'}</h1>
              </div>
              <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <MdRoofing />
                  <p className="font-medium text-gray-500 text-xs uppercase">TIPO DE TELHA</p>
                </div>
                <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.tipoTelha || 'N/A'}</h1>
              </div>
              {infoHolder.categoria == 'PADRÃO' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <MdElectricMeter />
                    <p className="font-medium text-gray-500 text-xs uppercase">TIPO DE PADRÃO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.tipoPadrao || 'N/A'}</h1>
                </div>
              ) : null}
              {infoHolder.categoria == 'PADRÃO' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <MdOutput />
                    <p className="font-medium text-gray-500 text-xs uppercase">TIPO DE SAÍDA DO PADRÃO</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.tipoPadrao || 'N/A'}</h1>
                </div>
              ) : null}
              {infoHolder.categoria == 'PADRÃO' ? (
                <div className="flex flex-col border border-gray-500 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <MdOutlineSettingsInputComponent />
                    <p className="font-medium text-gray-500 text-xs uppercase">AMPERAGEM</p>
                  </div>
                  <h1 className="font-medium text-gray-500 text-xs uppercase text-center">{infoHolder.amperagemPadrao || 'N/A'}</h1>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DetailsModalBlock
