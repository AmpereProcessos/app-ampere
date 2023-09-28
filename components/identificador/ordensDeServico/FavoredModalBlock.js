import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { AiFillCloseCircle, AiFillEdit, AiFillPhone } from 'react-icons/ai'
import { FaCity, FaUser } from 'react-icons/fa'
import { MdLocationPin } from 'react-icons/md'
import TextInput from '../../inputs/Text'
import { formatToPhone } from '../../../utils/constants'
import SelectInput from '../../inputs/Select'
import { estadosECidades } from '../../../utils/estados_cidades'

function FavoredModalBlock({ order, infoHolder, setInfoHolder }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="flex flex-col w-full mt-4">
      <div className="w-full p-2 rounded-md bg-gray-800 flex items-center gap-2 justify-center">
        <h1 className="text-white font-bold">FAVORECIDO</h1>
        <button onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div initial={{ scale: 0.8, opacity: 0.3 }} animate={{ scale: 1, opacity: 1 }} className="w-full flex flex-col gap-1">
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <div className="w-full lg:w-[50%]">
                <TextInput
                  label={'NOME'}
                  placeholder={'Preencha o nome do cliente favorecido...'}
                  value={infoHolder.favorecido.nome}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, favorecido: { ...prev.favorecido, nome: value } }))}
                  width={'100%'}
                />
              </div>
              <div className="w-full lg:w-[50%]">
                <TextInput
                  label={'TELEFONE'}
                  placeholder={'Preencha o contato do cliente favorecido...'}
                  value={infoHolder.favorecido.contato}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, favorecido: { ...prev.favorecido, contato: formatToPhone(value) } }))}
                  width={'100%'}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row w-full gap-2">
              <div className="w-full lg:w-[50%] gap-2 flex items-center">
                <div className="w-[20%]">
                  <SelectInput
                    label={'UF'}
                    value={infoHolder.localizacao?.uf}
                    options={Object.keys(estadosECidades).map((op, index) => ({ id: index + 1, label: op, value: op }))}
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: value } }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, uf: null } }))}
                    width={'100%'}
                  />
                </div>
                <div className="w-[80%]">
                  <SelectInput
                    label={'CIDADE'}
                    value={infoHolder.localizacao?.cidade}
                    options={
                      infoHolder.localizacao?.uf
                        ? estadosECidades[infoHolder.localizacao.uf]?.map((op, index) => ({ id: index + 1, label: op, value: op }))
                        : null
                    }
                    selectedItemLabel={'NÃO DEFINIDO'}
                    handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: value } }))}
                    onReset={() => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, cidade: null } }))}
                    width={'100%'}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[50%]">
                <TextInput
                  label={'ENDEREÇO'}
                  placeholder={'Preencha o endereço do cliente favorecido...'}
                  value={infoHolder.localizacao.endereco}
                  handleChange={(value) => setInfoHolder((prev) => ({ ...prev, localizacao: { ...prev.localizacao, endereco: value } }))}
                  width={'100%'}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8, opacity: 0.3 }} animate={{ scale: 1, opacity: 1 }} className="w-full flex flex-col gap-1">
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
              <div className="flex gap-2 items-center text-gray-800">
                <FaUser size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">{order?.favorecido?.nome || 'N/A'}</p>
              </div>
              <div className="flex gap-2 items-center text-gray-800">
                <AiFillPhone size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">{order?.favorecido?.contato || 'N/A'}</p>
              </div>
            </div>
            <div className="flex w-full justify-center gap-2 lg:gap-4 flex-col md:flex-row items-center mt-2">
              <div className="flex gap-2 items-center">
                <FaCity size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {order?.localizacao ? `${order?.localizacao.cidade} - ${order?.localizacao.uf} ` : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <MdLocationPin size={'20px'} color="rgb(31,41,55)" />
                <p className="font-raleway font-medium text-sm">
                  {order?.localizacao
                    ? `${order?.localizacao.endereco}, Nº ${order?.localizacao.numeroOuIdentificador}, ${order?.localizacao.bairro} - ${order?.localizacao.cep}`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FavoredModalBlock
